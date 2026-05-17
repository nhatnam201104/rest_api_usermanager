import type { PostResponse } from '../types/post/response';

// ─── Mock users ───────────────────────────────────────────────────────────────

const mockUsers = [
  {
    id: 1,
    fullName: 'Nguyễn Minh Tuấn',
    email: 'tuan@example.com',
    role: 'USER',
    status: 'ACTIVE' as const,
    createdAt: new Date('2024-01-10'),
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=tuan',
  },
  {
    id: 2,
    fullName: 'Trần Thị Lan',
    email: 'lan@example.com',
    role: 'USER',
    status: 'ACTIVE' as const,
    createdAt: new Date('2024-02-05'),
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=lan',
  },
  {
    id: 3,
    fullName: 'Lê Hoàng Nam',
    email: 'nam@example.com',
    role: 'USER',
    status: 'ACTIVE' as const,
    createdAt: new Date('2024-03-12'),
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=nam',
  },
  {
    id: 4,
    fullName: 'Phạm Thu Hà',
    email: 'ha@example.com',
    role: 'USER',
    status: 'ACTIVE' as const,
    createdAt: new Date('2024-01-28'),
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ha',
  },
  {
    id: 5,
    fullName: 'Võ Đức Anh',
    email: 'anh@example.com',
    role: 'USER',
    status: 'ACTIVE' as const,
    createdAt: new Date('2024-04-01'),
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=anh',
  },
];

// ─── Mock posts ───────────────────────────────────────────────────────────────

export const MOCK_POSTS: PostResponse[] = [
  {
    id: 1,
    content:
      'Vừa hoàn thành dự án React + Spring Boot đầu tiên 🎉 Cảm giác khi thấy app chạy mượt mà thật sự rất tuyệt. Cảm ơn mọi người đã support trong suốt quá trình!',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    visibility: 'PUBLIC',
    moderationStatus: 'APPROVED',
    isDeleted: false,
    userId: 1,
    user: mockUsers[0],
    likeCount: 142,
    commentCount: 23,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: 2,
    content:
      'Buổi sáng cà phê và code 🌅☕ Không có gì tuyệt hơn khi ngồi code lúc trời còn mát. Hôm nay target: hoàn thành authentication flow.',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80',
    visibility: 'PUBLIC',
    moderationStatus: 'APPROVED',
    isDeleted: false,
    userId: 2,
    user: mockUsers[1],
    likeCount: 89,
    commentCount: 11,
    isLiked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: 3,
    content:
      'Chia sẻ một số tips khi làm việc với Zustand + React Query:\n\n1. Tách biệt server state và client state\n2. Dùng persist middleware cho auth\n3. Invalidate queries sau mutation\n\nAi có thêm tips không? 👇',
    visibility: 'PUBLIC',
    moderationStatus: 'APPROVED',
    isDeleted: false,
    userId: 3,
    user: mockUsers[2],
    likeCount: 215,
    commentCount: 47,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: 4,
    content: 'Hà Nội mùa thu đẹp quá 🍂 Đi dạo Hồ Tây buổi chiều, gió mát, lá vàng rơi. Cuộc sống đôi khi chỉ cần đơn giản vậy thôi.',
    imageUrl: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80',
    visibility: 'PUBLIC',
    moderationStatus: 'APPROVED',
    isDeleted: false,
    userId: 4,
    user: mockUsers[3],
    likeCount: 334,
    commentCount: 28,
    isLiked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
  {
    id: 5,
    content:
      'Vừa đọc xong "Clean Code" của Uncle Bob. Cuốn sách thay đổi cách mình nhìn nhận về code hoàn toàn. Recommend cho bất kỳ developer nào muốn nâng cao kỹ năng 📚',
    visibility: 'PUBLIC',
    moderationStatus: 'APPROVED',
    isDeleted: false,
    userId: 5,
    user: mockUsers[4],
    likeCount: 178,
    commentCount: 35,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
  {
    id: 6,
    content: 'Team building cuối tuần 🏕️ Cắm trại ở Ba Vì, trời trong xanh, không khí trong lành. Recharge năng lượng cho tuần mới!',
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
    visibility: 'PUBLIC',
    moderationStatus: 'APPROVED',
    isDeleted: false,
    userId: 1,
    user: mockUsers[0],
    likeCount: 256,
    commentCount: 19,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: 7,
    content:
      'Mình vừa deploy lên production lần đầu tiên và... không có bug nào 😱 Không biết nên vui hay lo lắng nữa 😂 Chắc là may mắn thôi, nhưng cũng tự hào lắm!',
    visibility: 'PUBLIC',
    moderationStatus: 'APPROVED',
    isDeleted: false,
    userId: 2,
    user: mockUsers[1],
    likeCount: 421,
    commentCount: 62,
    isLiked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 30),
  },
  {
    id: 8,
    content: 'Bình minh trên đỉnh Fansipan 🌄 Sau 2 ngày leo núi, khoảnh khắc này xứng đáng với mọi mệt mỏi. Việt Nam mình đẹp lắm!',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    visibility: 'PUBLIC',
    moderationStatus: 'APPROVED',
    isDeleted: false,
    userId: 3,
    user: mockUsers[2],
    likeCount: 589,
    commentCount: 74,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
];

// ─── Mock stories ─────────────────────────────────────────────────────────────

export interface StoryMock {
  id: number;
  user: (typeof mockUsers)[0];
  seen: boolean;
  gradient: string;
}

export const MOCK_STORIES: StoryMock[] = [
  { id: 1, user: mockUsers[0], seen: false, gradient: 'from-purple-500 to-pink-500' },
  { id: 2, user: mockUsers[1], seen: false, gradient: 'from-orange-400 to-pink-500' },
  { id: 3, user: mockUsers[2], seen: true,  gradient: 'from-blue-500 to-cyan-400' },
  { id: 4, user: mockUsers[3], seen: false, gradient: 'from-green-400 to-teal-500' },
  { id: 5, user: mockUsers[4], seen: true,  gradient: 'from-yellow-400 to-orange-500' },
];

// ─── Suggested users ──────────────────────────────────────────────────────────

export const MOCK_SUGGESTED = mockUsers.slice(0, 4);
