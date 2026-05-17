import type { UserResponse } from '../user/response';

export interface CommentResponse {
  id: number;
  content: string;
  status: 'VISIBLE' | 'HIDDEN' | 'DELETED';
  userId: number;
  user: UserResponse;
  postId: number;
  createdAt: Date;
}

export interface CreateCommentRequest {
  postId: number;
  content: string;
}
