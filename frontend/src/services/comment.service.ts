import axios from '../configs/axios.config';
import type { ApiResponse } from '../types/api.type';
import type { CommentResponse } from '../types/comment/response';
import type { CreateCommentRequest } from '../types/comment/response';

export const getCommentsByPostService = async (
  postId: number
): Promise<ApiResponse<CommentResponse[]>> => {
  const response = await axios.get(`/posts/${postId}/comments`);
  return response.data;
};

export const createCommentService = async (
  data: CreateCommentRequest
): Promise<ApiResponse<CommentResponse>> => {
  const response = await axios.post('/comments', data);
  return response.data;
};

export const deleteCommentService = async (commentId: number): Promise<ApiResponse<null>> => {
  const response = await axios.delete(`/comments/${commentId}`);
  return response.data;
};
