import { create } from 'zustand';
import type { CommentResponse } from '../types/comment/response';
import { getCommentsByPostService, createCommentService, deleteCommentService } from '../services/comment.service';

interface CommentState {
  comments: Record<number, CommentResponse[]>;
  isLoading: boolean;
  error: string | null;
  fetchCommentsByPost: (postId: string) => Promise<void>;
  createComment: (postId: string, content: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
}

export const useCommentStore = create<CommentState>((set) => ({
  comments: {},
  isLoading: false,
  error: null,

  fetchCommentsByPost: async (postId: string) => {
    set({ isLoading: true });
    try {
      const response = await getCommentsByPostService(Number(postId));
      if (response.success && response.data) {
        const commentsData = response.data as CommentResponse[];
        set((state) => ({
          comments: { ...state.comments, [Number(postId)]: commentsData },
          isLoading: false,
        }));
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch comments', isLoading: false });
    }
  },

  createComment: async (postId: string, content: string) => {
    set({ isLoading: true });
    try {
      const response = await createCommentService({ postId: Number(postId), content });
      if (response.success && response.data) {
        const newComment = response.data as CommentResponse;
        set((state) => ({
          comments: {
            ...state.comments,
            [Number(postId)]: [newComment, ...(state.comments[Number(postId)] || [])],
          },
          isLoading: false,
        }));
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create comment', isLoading: false });
    }
  },

  deleteComment: async (postId: string, commentId: string) => {
    set({ isLoading: true });
    try {
      await deleteCommentService(Number(commentId));
      set((state) => ({
        comments: {
          ...state.comments,
          [Number(postId)]: (state.comments[Number(postId)] || []).filter((c) => c.id !== Number(commentId)),
        },
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete comment', isLoading: false });
    }
  },
}));