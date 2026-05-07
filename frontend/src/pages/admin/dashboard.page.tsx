import { useEffect } from 'react';
import { useUserStore } from '../../stores/user.store';
import { usePostStore } from '../../stores/post.store';

const DashboardPage = () => {
  const { users, fetchUsers } = useUserStore();
  const { posts, fetchPosts } = usePostStore();

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, [fetchUsers, fetchPosts]);

  const activeUsers = users.filter((u) => u.status === 'ACTIVE').length;
  const bannedUsers = users.filter((u) => u.status === 'BANNED').length;
  const publishedPosts = posts.filter((p) => p.moderationStatus === 'APPROVED').length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Tổng người dùng</h3>
          <p className="text-3xl font-bold text-gray-800">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Người dùng hoạt động</h3>
          <p className="text-3xl font-bold text-green-600">{activeUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Người dùng bị cấm</h3>
          <p className="text-3xl font-bold text-red-600">{bannedUsers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bài viết</h3>
          <p className="text-3xl font-bold text-gray-800">{posts.length}</p>
          <p className="text-sm text-gray-500 mt-2">{publishedPosts} đã xuất bản</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bình luận</h3>
          <p className="text-sm text-gray-500">Tổng số bình luận trên hệ thống</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;