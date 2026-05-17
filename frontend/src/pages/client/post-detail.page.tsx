import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { usePostStore } from '../../stores/post.store';
import { useCommentStore } from '../../stores/comment.store';
import { useAuthStore } from '../../stores/auth.store';

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getPostById, currentPost } = usePostStore();
  const { comments, fetchCommentsByPost, createComment } = useCommentStore();
  const { isAuthenticated } = useAuthStore();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      getPostById(id);
      fetchCommentsByPost(id);
    }
  }, [id, getPostById, fetchCommentsByPost]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id || !isAuthenticated) return;

    setIsSubmitting(true);
    try {
      await createComment(id, newComment);
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentPost) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  const postComments = id ? comments[Number(id)] || [] : [];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Link to="/" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">
        ← Quay lại
      </Link>

      <article className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            {currentPost.user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <Link
              to={`/profile/${currentPost.userId}`}
              className="font-semibold text-gray-800 hover:text-blue-500"
            >
              {currentPost.user?.fullName || 'Người dùng'}
            </Link>
            <p className="text-sm text-gray-500">
              {new Date(currentPost.createdAt).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>

        <p className="text-gray-700 mb-4">{currentPost.content}</p>

        {currentPost.imageUrl && (
          <img
            src={currentPost.imageUrl}
            alt=""
            className="w-full rounded-lg mb-4 max-h-96 object-cover"
          />
        )}

        <div className="flex items-center gap-4 text-gray-500">
          <button className="flex items-center gap-1 hover:text-blue-500">
            <span>♥</span>
            <span>{currentPost.likeCount || 0}</span>
          </button>
          <span className="flex items-center gap-1">
            <span>💬</span>
            <span>{postComments.length} bình luận</span>
          </span>
        </div>
      </article>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bình luận</h3>

        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              rows={3}
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
            </button>
          </form>
        ) : (
          <p className="mb-6 text-gray-500">
            <Link to="/auth/login" className="text-blue-500 hover:text-blue-600">
              Đăng nhập
            </Link>{' '}
            để bình luận.
          </p>
        )}

        <div className="space-y-4">
          {postComments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-semibold">
                  {comment.user?.fullName?.charAt(0) || 'U'}
                </div>
                <Link
                  to={`/profile/${comment.userId}`}
                  className="font-semibold text-gray-800 text-sm hover:text-blue-500"
                >
                  {comment.user?.fullName || 'Người dùng'}
                </Link>
                <span className="text-gray-400 text-xs">
                  {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <p className="text-gray-700 pl-10">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;