import axios from '../configs/axios.config';
import type { ApiResponse } from '../types/api.type';
import type { PostResponse } from '../types/post/response';
import type { CreatePostRequest } from '../types/post/response';

export const getPostsService = async (): Promise<ApiResponse<PostResponse[]>> => {
  const response = await axios.get('/posts');
  return response.data;
};

export const getPostByIdService = async (id: number): Promise<ApiResponse<PostResponse>> => {
  const response = await axios.get(`/posts/${id}`);
  return response.data;
};

export const getUserPostsService = async (userId: number): Promise<ApiResponse<PostResponse[]>> => {
  const response = await axios.get(`/posts/user/${userId}`);
  return response.data;
};

export const createPostService = async (
  data: CreatePostRequest
): Promise<ApiResponse<PostResponse>> => {
  const response = await axios.post('/posts', data);
  return response.data;
};

export const deletePostService = async (id: number): Promise<ApiResponse<null>> => {
  const response = await axios.delete(`/posts/${id}`);
  return response.data;
};

export const likePostService = async (postId: number): Promise<ApiResponse<null>> => {
  const response = await axios.post(`/posts/${postId}/like`);
  return response.data;
};

export const unlikePostService = async (postId: number): Promise<ApiResponse<null>> => {
  const response = await axios.post(`/posts/${postId}/unlike`);
  return response.data;
};

export const getPendingPostsService = async (): Promise<ApiResponse<PostResponse[]>> => {
  const response = await axios.get('/admin/posts/pending');
  return response.data;
};

export const approvePostService = async (postId: number): Promise<ApiResponse<null>> => {
  const response = await axios.post(`/admin/posts/${postId}/approve`);
  return response.data;
};

export const rejectPostService = async (postId: number): Promise<ApiResponse<null>> => {
  const response = await axios.post(`/admin/posts/${postId}/reject`);
  return response.data;
};
