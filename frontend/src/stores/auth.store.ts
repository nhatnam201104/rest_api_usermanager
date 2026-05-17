import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserResponse } from '../types/auth/response';
import type { ErrorApiResponse } from '../types/api.type';
import { loginService, logoutService, verifyOtpService } from '../services/auth.service';
import { clearTokens, hasAccessToken, setAccessToken } from '../libs/auth/token-storage';

// ─── State shape ─────────────────────────────────────────────────────────────

interface AuthState {
  /** Authenticated user info (persisted to localStorage) */
  user: UserResponse | null;
  /** Whether the user has a valid session */
  isAuthenticated: boolean;
  /** Loading flag for async auth operations */
  isLoading: boolean;

  // ── Actions ──────────────────────────────────────────────────────────────

  /**
   * Login with email + password.
   * Stores the access token in sessionStorage and user in Zustand (persisted).
   * Throws ErrorApiResponse on failure so callers can display the message.
   */
  login: (email: string, password: string) => Promise<void>;

  /**
   * Verify OTP after registration.
   * On success stores the access token + user, same as login.
   * Throws ErrorApiResponse on failure.
   */
  verifyOtp: (email: string, otp: string) => Promise<void>;

  /** Update the current access token after a successful refresh. */
  refreshToken: (accessToken: string) => void;

  /** Clear auth state and revoke the refresh cookie on the server when possible. */
  logout: (options?: LogoutOptions) => Promise<void>;

  /** Partially update the stored user (e.g. after profile edit). */
  updateUser: (partial: Partial<UserResponse>) => void;
}

interface LogoutOptions {
  callApi?: boolean;
  redirect?: boolean;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: hasAccessToken(),
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await loginService({ email, password });

          if (!response.success || !response.data) {
            const err: ErrorApiResponse = {
              success: false,
              message: response.message ?? 'Đăng nhập thất bại',
              statusCode: response.statusCode ?? 400,
            };
            throw err;
          }

          const { accessToken, user } = response.data;
          setAccessToken(accessToken);
          set({ user, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      verifyOtp: async (email, otp) => {
        set({ isLoading: true });
        try {
          const response = await verifyOtpService({ email, otp });

          if (!response.success || !response.data) {
            const err: ErrorApiResponse = {
              success: false,
              message: response.message ?? 'Xác thực OTP thất bại',
              statusCode: response.statusCode ?? 400,
            };
            throw err;
          }

          const { accessToken, user } = response.data;
          setAccessToken(accessToken);
          set({ user, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      refreshToken: (accessToken) => {
        setAccessToken(accessToken);
        set({ isAuthenticated: true });
      },

      logout: async (options) => {
        const callApi = options?.callApi ?? true;
        const redirect = options?.redirect ?? true;

        set({ isLoading: true });
        try {
          if (callApi) {
            try {
              await logoutService();
            } catch {
              // Logout is best-effort; local state is cleared regardless.
            }
          }
        } finally {
          clearTokens();
          set({ user: null, isAuthenticated: false, isLoading: false });

          if (redirect && window.location.pathname !== '/auth/login') {
            window.location.assign('/auth/login');
          }
        }
      },

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    {
      name: 'auth-storage',
      // Only persist user + isAuthenticated; the refresh token lives in an HttpOnly cookie.
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
