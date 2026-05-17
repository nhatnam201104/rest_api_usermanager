import { create } from 'zustand';
import type { UserResponse } from '../types/user/response';
import { getUsersService, getUserByIdService, getUserProfileService, updateUserService, banUserService, unbanUserService } from '../services/user.service';

interface UserState {
  users: UserResponse[];
  currentProfile: UserResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  fetchUserProfile: (userId: string) => Promise<void>;
  getUserById: (id: string) => Promise<void>;
  updateUser: (id: string, data: Partial<UserResponse>) => Promise<void>;
  banUser: (id: string) => Promise<void>;
  unbanUser: (id: string) => Promise<void>;
  setCurrentProfile: (user: UserResponse | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  currentProfile: null,
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const response = await getUsersService();
      if (response.success && response.data) {
        set({ users: response.data, isLoading: false });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch users', isLoading: false });
    }
  },

  fetchUserProfile: async (userId: string) => {
    set({ isLoading: true });
    try {
      const response = await getUserProfileService(Number(userId));
      if (response.success && response.data) {
        set({ currentProfile: response.data, isLoading: false });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch profile', isLoading: false });
    }
  },

  getUserById: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await getUserByIdService(Number(id));
      if (response.success && response.data) {
        set({ currentProfile: response.data, isLoading: false });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch user', isLoading: false });
    }
  },

  updateUser: async (id: string, data: Partial<UserResponse>) => {
    set({ isLoading: true });
    try {
      const response = await updateUserService(Number(id), data);
      if (response.success && response.data) {
        const updatedUser = response.data;
        set((state) => ({
          users: state.users.map((u) => (u.id === Number(id) ? updatedUser : u)),
          isLoading: false,
        }));
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update user', isLoading: false });
    }
  },

  banUser: async (id: string) => {
    set({ isLoading: true });
    try {
      await banUserService(Number(id));
      set((state) => ({
        users: state.users.map((u) =>
          u.id === Number(id) ? { ...u, status: 'BANNED' as const } : u
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to ban user', isLoading: false });
    }
  },

  unbanUser: async (id: string) => {
    set({ isLoading: true });
    try {
      await unbanUserService(Number(id));
      set((state) => ({
        users: state.users.map((u) =>
          u.id === Number(id) ? { ...u, status: 'ACTIVE' as const } : u
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to unban user', isLoading: false });
    }
  },

  setCurrentProfile: (user) => set({ currentProfile: user }),
}));