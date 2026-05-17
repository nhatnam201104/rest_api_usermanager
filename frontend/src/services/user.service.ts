import axios from '../configs/axios.config';
import type { ApiResponse } from '../types/api.type';
import type { UserResponse } from '../types/user/response';

export const getUsersService = async (): Promise<ApiResponse<UserResponse[]>> => {
  const response = await axios.get('/users');
  return response.data;
};

export const getUserByIdService = async (id: number): Promise<ApiResponse<UserResponse>> => {
  const response = await axios.get(`/users/${id}`);
  return response.data;
};

export const getUserProfileService = async (userId: number): Promise<ApiResponse<UserResponse>> => {
  const response = await axios.get(`/users/${userId}/profile`);
  return response.data;
};

export const updateUserService = async (
  id: number,
  data: Partial<UserResponse>
): Promise<ApiResponse<UserResponse>> => {
  const response = await axios.put(`/users/${id}`, data);
  return response.data;
};

export const banUserService = async (id: number): Promise<ApiResponse<null>> => {
  const response = await axios.post(`/admin/users/${id}/ban`);
  return response.data;
};

export const unbanUserService = async (id: number): Promise<ApiResponse<null>> => {
  const response = await axios.post(`/admin/users/${id}/unban`);
  return response.data;
};
