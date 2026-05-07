import type { UserResponse } from '../user/response';

export interface PostResponse {
  id: number;
  content: string;
  imageUrl?: string;
  visibility: 'PUBLIC' | 'PRIVATE' | 'DRAFT' | 'PUBLISHED';
  moderationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  isDeleted: boolean;
  userId: number;
  user: UserResponse;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostRequest {
  content: string;
  imageUrl?: string;
  visibility?: 'PUBLIC' | 'PRIVATE';
}