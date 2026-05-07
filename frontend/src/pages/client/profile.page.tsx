import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserStore } from '../../stores/user.store';
import { useAuthStore } from '../../stores/auth.store';
import { usePostStore } from '../../stores/post.store';

const ProfilePage = () => {
  const { userId } = useParams<{ userId?: string }>();
  const { currentProfile, fetchUserProfile, isLoading } = useUserStore();
  const { user: currentUser } = useAuthStore();
  const { posts, fetchUserPosts } = usePostStore();

  const isOwnProfile = !userId || userId === String(currentUser?.id);

  useEffect(() => {
    const targetId = userId || (currentUser?.id ? String(currentUser.id) : undefined);
    if (targetId) {
      fetchUserProfile(targetId);
      fetchUserPosts(targetId);
    }
  }, [userId, currentUser?.id, fetchUserProfile, fetchUserPosts]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <p className="text-gray-500">Không tìm thấy người dùng.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-semibold">
            {currentProfile.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{currentProfile.fullName}</h1>
            <p className="text-gray-500">{currentProfile.email}</p>
            <p className="text-sm text-gray-400">
              Tham gia: {new Date(currentProfile.createdAt || '').toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Bài viết của {isOwnProfile ? 'bạn' : currentProfile.fullName}</h2>

      {posts.length === 0 ? (
        <p className="text-gray-500">Chưa có bài viết nào.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-700 mb-4">{post.content}</p>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt=""
                  className="w-full rounded-lg mb-4 max-h-96 object-cover"
                />
              )}
              <div className="flex items-center gap-4 text-gray-500 text-sm">
                <span>♥ {post.likeCount || 0}</span>
                <span>💬 {post.commentCount || 0}</span>
                <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;