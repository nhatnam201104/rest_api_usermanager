import { create } from 'zustand';
import type { PostResponse } from '../types/post/response';
import { MOCK_POSTS } from '../mocks/posts.mock';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const simulateDelay = (ms = 600) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// ─── State shape ─────────────────────────────────────────────────────────────

interface PostState {
  posts: PostResponse[];
  currentPost: PostResponse | null;
  isLoading: boolean;
  error: string | null;

  fetchPosts: () => Promise<void>;
  fetchUserPosts: (userId: string) => Promise<void>;
  getPostById: (id: string) => Promise<void>;
  createPost: (content: string, imageUrl?: string) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  toggleLike: (postId: number) => void;
  setCurrentPost: (post: PostResponse | null) => void;

  // Admin actions (kept for compatibility)
  approvePost: (id: string) => Promise<void>;
  rejectPost: (id: string) => Promise<void>;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,

  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    await simulateDelay();
    set({ posts: MOCK_POSTS, isLoading: false });
  },

  fetchUserPosts: async (userId: string) => {
    set({ isLoading: true, error: null });
    await simulateDelay(400);
    const filtered = MOCK_POSTS.filter((p) => p.userId === Number(userId));
    set({ posts: filtered, isLoading: false });
  },

  getPostById: async (id: string) => {
    set({ isLoading: true, error: null });
    await simulateDelay(300);
    const post = MOCK_POSTS.find((p) => p.id === Number(id)) ?? null;
    set({ currentPost: post, isLoading: false });
  },

  createPost: async (content: string, imageUrl?: string) => {
    set({ isLoading: true, error: null });
    await simulateDelay(500);
    const { posts } = get();
    const newPost: PostResponse = {
      id: Date.now(),
      content,
      imageUrl,
      visibility: 'PUBLIC',
      moderationStatus: 'APPROVED',
      isDeleted: false,
      userId: 0,
      user: {
        id: 0,
        fullName: 'Bạn',
        email: '',
        role: 'USER',
        status: 'ACTIVE',
        createdAt: new Date(),
      },
      likeCount: 0,
      commentCount: 0,
      isLiked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set({ posts: [newPost, ...posts], isLoading: false });
  },

  deletePost: async (id: string) => {
    set({ isLoading: true, error: null });
    await simulateDelay(300);
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== Number(id)),
      isLoading: false,
    }));
  },

  toggleLike: (postId: number) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likeCount: p.isLiked
                ? Math.max(0, (p.likeCount ?? 1) - 1)
                : (p.likeCount ?? 0) + 1,
            }
          : p,
      ),
    })),

  setCurrentPost: (post) => set({ currentPost: post }),

  approvePost: async (id: string) => {
    await simulateDelay(300);
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === Number(id) ? { ...p, moderationStatus: 'APPROVED' as const } : p,
      ),
    }));
  },

  rejectPost: async (id: string) => {
    await simulateDelay(300);
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === Number(id) ? { ...p, moderationStatus: 'REJECTED' as const } : p,
      ),
    }));
  },
}));
