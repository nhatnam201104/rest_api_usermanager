import axios from '../configs/axios.config';
import type { ApiResponse } from '../types/api.type';
import type { LoginRequest, RegisterRequest, VerifyOtpRequest } from '../types/auth/request';
import type { AuthTokenResponse, TokenResponse } from '../types/auth/response';

/**
 * Step 1 of registration.
 * Backend returns the OTP string in `data` (dev mode) and sends it via email.
 * Response: ApiResponse<string>
 */
export const registerService = async (
  data: RegisterRequest,
): Promise<ApiResponse<string>> => {
  const response = await axios.post<ApiResponse<string>>('/auth/register', data);
  return response.data;
};

/**
 * Step 2 of registration — verify the OTP received by email.
 * On success returns an access token and stores refresh token in HttpOnly cookie.
 */
export const verifyOtpService = async (
  data: VerifyOtpRequest,
): Promise<ApiResponse<AuthTokenResponse>> => {
  const response = await axios.post<ApiResponse<AuthTokenResponse>>(
    '/auth/verify-otp',
    data,
  );
  return response.data;
};

/**
 * Login with email + password.
 * Returns an access token and stores refresh token in HttpOnly cookie.
 */
export const loginService = async (
  data: LoginRequest,
): Promise<ApiResponse<AuthTokenResponse>> => {
  const response = await axios.post<ApiResponse<AuthTokenResponse>>(
    '/auth/login',
    data,
  );
  return response.data;
};

/**
 * Refresh the access token using the HttpOnly refreshToken cookie.
 */
export const refreshTokenService = async (): Promise<ApiResponse<TokenResponse>> => {
  const response = await axios.post<ApiResponse<TokenResponse>>('/auth/refresh-token');
  return response.data;
};

/**
 * Best-effort server logout. The refresh token is sent by cookie.
 */
export const logoutService = async (): Promise<ApiResponse<void>> => {
  const response = await axios.post<ApiResponse<void>>('/auth/logout');
  return response.data;
};
