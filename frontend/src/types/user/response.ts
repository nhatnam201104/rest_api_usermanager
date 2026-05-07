export interface UserResponse {
  id: number;
  email: string;
  fullName: string;
  role: string;
  phone?: string;
  status: 'ACTIVE' | 'BANNED' | 'INACTIVE';
  createdAt: Date;
  avatarUrl?: string;
}
