export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  /** Always "USER" for self-registration */
  role: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}
