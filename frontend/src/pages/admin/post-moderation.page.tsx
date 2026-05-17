import { useEffect, useState } from 'react';
import { usePostStore } from '../../stores/post.store';

const PostModerationPage = () => {
  const { posts, fetchPosts, deletePost, approvePost, rejectPost, isLoading } = usePostStore();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = posts.filter((post) => {
    if (filter === 'ALL') return true;
    return post.moderationStatus === filter;
  });

  const handleDelete = async (postId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
    try {
      await deletePost(String(postId));
    } catch {
      // Error handled by store
    }
  };

  const handleModeration = async (postId: number, action: 'APPROVE' | 'REJECT') => {
    try {
      if (action === 'APPROVE') {
        await approvePost(String(postId));
      } else {
        await rejectPost(String(postId));
      }
    } catch {
      // Error handled by store
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kiểm duyệt bài viết</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">Tất cả</option>
          <option value="PENDING">Đang chờ</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Đã từ chối</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nội dung</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tác giả</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Không có bài viết nào.
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4">
                    <p className="text-gray-800 line-clamp-2">{post.content}</p>
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt=""
                        className="w-16 h-16 object-cover rounded mt-2"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {post.user?.fullName || 'Người dùng'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        post.moderationStatus === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : post.moderationStatus === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {post.moderationStatus === 'APPROVED'
                        ? 'Đã duyệt'
                        : post.moderationStatus === 'REJECTED'
                        ? 'Đã từ chối'
                        : 'Đang chờ'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {post.moderationStatus === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleModeration(post.id, 'APPROVE')}
                            className="px-3 py-1 text-xs rounded-lg bg-green-100 text-green-800 hover:bg-green-200"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => handleModeration(post.id, 'REJECT')}
                            className="px-3 py-1 text-xs rounded-lg bg-red-100 text-red-800 hover:bg-red-200"
                          >
                            Từ chối
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="px-3 py-1 text-xs rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostModerationPage;