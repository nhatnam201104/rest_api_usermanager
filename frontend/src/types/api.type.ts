export interface ErrorApiResponse {
  success: boolean;
  message: string;
  statusCode: number;
  errorCode?: string;
}

export interface ApiResponse<T> extends ErrorApiResponse {
  success: boolean;
  message: string;
  data?: T;
}
