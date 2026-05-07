import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, setAccessToken } from '../libs/auth/token-storage';
import type { ApiResponse, ErrorApiResponse } from '../types/api.type';
import type { TokenResponse } from '../types/auth/response';

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface BackendErrorResponse extends ErrorApiResponse {
  status?: number;
}

type QueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];
let logoutPromise: Promise<void> | null = null;

const instance = axios.create({
  baseURL:'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 40000,
  withCredentials: true,
});

const authRefreshSkipPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/verify-otp',
  '/auth/verify-register',
  '/auth/refresh-token',
  '/auth/logout',
];

const shouldSkipAuthRefresh = (url?: string) =>
  !url || authRefreshSkipPaths.some((path) => url.includes(path));

const processQueue = (error: unknown, token?: string) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error || !token) {
      reject(error);
      return;
    }

    resolve(token);
  });
  failedQueue = [];
};

const normalizeError = (error: unknown): ErrorApiResponse => {
  if (axios.isAxiosError<BackendErrorResponse>(error)) {
    return {
      message: error.response?.data?.message || error.message || 'Unknown error',
      success: error.response?.data?.success ?? false,
      statusCode:
        error.response?.data?.statusCode ??
        error.response?.data?.status ??
        error.response?.status ??
        500,
      errorCode: error.response?.data?.errorCode,
    };
  }

  const maybeError = error as Partial<ErrorApiResponse> | undefined;
  return {
    message: maybeError?.message || 'Unknown error',
    success: maybeError?.success ?? false,
    statusCode: maybeError?.statusCode ?? 500,
    errorCode: maybeError?.errorCode,
  };
};

const triggerLogout = async () => {
  if (!logoutPromise) {
    logoutPromise = import('../stores/auth.store')
      .then(({ useAuthStore }) => useAuthStore.getState().logout())
      .finally(() => {
        logoutPromise = null;
      });
  }

  await logoutPromise;
};

instance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<BackendErrorResponse>) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      shouldSkipAuthRefresh(originalRequest.url)
    ) {
      return Promise.reject(normalizeError(error));
    }

    if (originalRequest._retry) {
      await triggerLogout();
      return Promise.reject(normalizeError(error));
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(instance(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await instance.post<ApiResponse<TokenResponse>>('/auth/refresh-token');
      const accessToken = response.data.data?.accessToken;

      if (!response.data.success || !accessToken) {
        throw response.data;
      }

      setAccessToken(accessToken);
      processQueue(null, accessToken);

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return instance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      await triggerLogout();
      return Promise.reject(normalizeError(refreshError));
    } finally {
      isRefreshing = false;
    }
  }
);

export default instance;
