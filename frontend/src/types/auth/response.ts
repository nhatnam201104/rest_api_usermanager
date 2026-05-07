// ─── Role ────────────────────────────────────────────────────────────────────
export interface RoleResponse {
  id: number;
  roleName: string;
}

// ─── User ────────────────────────────────────────────────────────────────────
export type UserStatus = 'ACTIVE' | 'BANNED' | 'INACTIVE';

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  avatar: string;
  status: UserStatus;
  role: RoleResponse | null;
}

// ─── Auth (login / verify-otp response) ──────────────────────────────────────
export interface AuthTokenResponse {
  accessToken: string;
  refreshToken?: string | null;
  user: UserResponse;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken?: string | null;
}
