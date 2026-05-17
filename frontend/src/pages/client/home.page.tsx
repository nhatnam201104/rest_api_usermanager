import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePostStore } from '../../stores/post.store';
import { useAuthStore } from '../../stores/auth.store';
import { MOCK_STORIES, MOCK_SUGGESTED } from '../../mocks/posts.mock';
import type { PostResponse } from '../../types/post/response';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(date: Date): string {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return 'Vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
  return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

interface AvatarProps {
  name: string;
  avatarUrl?: string;
  size?: number;
  ring?: boolean;
  ringGradient?: string;
}

const Avatar = ({ name, avatarUrl, size = 40, ring = false, ringGradient }: AvatarProps) => {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(-2)
    .join('')
    .toUpperCase();

  const inner = avatarUrl ? (
    <img
      src={avatarUrl}
      alt={name}
      className="w-full h-full object-cover rounded-full"
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
  ) : (
    <span className="text-white font-bold text-sm select-none">{initials}</span>
  );

  if (ring) {
    return (
      <div
        className="rounded-full p-[2px] flex-shrink-0"
        style={{
          background: ringGradient ?? 'linear-gradient(135deg, #a855f7, #ec4899)',
          width: size + 4,
          height: size + 4,
        }}
      >
        <div
          className="rounded-full flex items-center justify-center overflow-hidden"
          style={{
            width: size,
            height: size,
            background: avatarUrl ? 'transparent' : 'linear-gradient(135deg, #a855f7, #ec4899)',
          }}
        >
          {inner}
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: avatarUrl ? 'transparent' : 'linear-gradient(135deg, #a855f7, #ec4899)',
      }}
    >
      {inner}
    </div>
  );
};

// ─── Stories bar ─────────────────────────────────────────────────────────────

const StoriesBar = () => {
  const { user } = useAuthStore();
  const [seenMap, setSeenMap] = useState<Record<number, boolean>>({});

  const markSeen = (id: number) => setSeenMap((prev) => ({ ...prev, [id]: true }));

  return (
    <div
      className="rounded-2xl p-4 mb-4"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
        {/* Add story */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
          <div className="relative">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px dashed rgba(168,85,247,0.5)' }}
            >
              {user ? (
                <Avatar name={user.fullName} avatarUrl={user.avatar} size={56} />
              ) : (
                <span className="text-white/40 text-2xl">+</span>
              )}
            </div>
            <div
              className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
            >
              +
            </div>
          </div>
          <span className="text-white/50 text-[11px] w-14 text-center truncate">
            {user ? 'Story của bạn' : 'Thêm story'}
          </span>
        </div>

        {/* Stories */}
        {MOCK_STORIES.map((story) => {
          const seen = seenMap[story.id] ?? story.seen;
          return (
            <button
              key={story.id}
              onClick={() => markSeen(story.id)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
            >
              <Avatar
                name={story.user.fullName}
                avatarUrl={story.user.avatarUrl}
                size={56}
                ring
                ringGradient={
                  seen
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))'
                    : `linear-gradient(135deg, #a855f7, #ec4899)`
                }
              />
              <span className="text-white/50 text-[11px] w-14 text-center truncate group-hover:text-white/80 transition-colors">
                {story.user.fullName.split(' ').pop()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── Create post box ──────────────────────────────────────────────────────────

const CreatePostBox = () => {
  const { user } = useAuthStore();
  const { createPost } = usePostStore();
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePost = async () => {
    if (!content.trim()) return;
    setIsPosting(true);
    await createPost(content.trim());
    setContent('');
    setIsExpanded(false);
    setIsPosting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handlePost();
  };

  return (
    <div
      className="rounded-2xl p-4 mb-4"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex gap-3">
        {user ? (
          <Avatar name={user.fullName} avatarUrl={user.avatar} size={40} />
        ) : (
          <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0" />
        )}

        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={handleKeyDown}
            placeholder={user ? `${user.fullName.split(' ')[0]} ơi, bạn đang nghĩ gì vậy?` : 'Bạn đang nghĩ gì?'}
            rows={isExpanded ? 3 : 1}
            className="w-full bg-transparent text-white/80 placeholder-white/30 text-sm resize-none outline-none leading-relaxed transition-all duration-200"
          />

          {isExpanded && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <div className="flex gap-1">
                {[
                  { icon: '🖼️', label: 'Ảnh' },
                  { icon: '😊', label: 'Cảm xúc' },
                  { icon: '📍', label: 'Vị trí' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    title={item.label}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 text-xs transition-all duration-150"
                  >
                    <span>{item.icon}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setIsExpanded(false); setContent(''); }}
                  className="px-3 py-1.5 rounded-lg text-white/40 hover:text-white/70 text-xs transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handlePost}
                  disabled={!content.trim() || isPosting}
                  className="px-4 py-1.5 rounded-lg text-white text-xs font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
                >
                  {isPosting ? 'Đang đăng...' : 'Đăng'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Post card ────────────────────────────────────────────────────────────────

interface PostCardProps {
  post: PostResponse;
}

const PostCard = ({ post }: PostCardProps) => {
  const { toggleLike } = usePostStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const handleLike = () => toggleLike(post.id);

  return (
    <article
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <Link to={`/profile/${post.userId}`}>
          <Avatar name={post.user?.fullName ?? 'U'} avatarUrl={post.user?.avatarUrl} size={42} ring />
        </Link>

        <div className="flex-1 min-w-0">
          <Link
            to={`/profile/${post.userId}`}
            className="font-semibold text-white hover:text-purple-300 transition-colors text-sm leading-tight block"
          >
            {post.user?.fullName ?? 'Người dùng'}
          </Link>
          <p className="text-white/40 text-xs mt-0.5">{timeAgo(post.createdAt)}</p>
        </div>

        {/* Options menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-all duration-150 text-lg leading-none"
            aria-label="Tùy chọn"
          >
            ···
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-44 rounded-xl py-1 z-20"
              style={{
                background: 'rgba(15,15,30,0.97)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              }}
            >
              {[
                { icon: '🔖', label: 'Lưu bài viết' },
                { icon: '🔗', label: 'Sao chép liên kết' },
                { icon: '🚩', label: 'Báo cáo', danger: true },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
                    item.danger
                      ? 'text-red-400 hover:bg-red-500/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-white/85 text-sm leading-relaxed whitespace-pre-line">{post.content}</p>
      </div>

      {/* Image */}
      {post.imageUrl && (
        <div className="relative overflow-hidden bg-white/5" style={{ maxHeight: 480 }}>
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-white/5" style={{ height: 300 }} />
          )}
          <img
            src={post.imageUrl}
            alt=""
            className="w-full object-cover transition-opacity duration-300"
            style={{ opacity: imgLoaded ? 1 : 0 }}
            onLoad={() => setImgLoaded(true)}
          />
        </div>
      )}

      {/* Stats row */}
      {(post.likeCount > 0 || post.commentCount > 0) && (
        <div className="flex items-center justify-between px-4 py-2 text-white/35 text-xs">
          {post.likeCount > 0 && (
            <span className="flex items-center gap-1">
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]"
                style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
              >
                ♥
              </span>
              {formatCount(post.likeCount)}
            </span>
          )}
          {post.commentCount > 0 && (
            <span className="ml-auto">
              {formatCount(post.commentCount)} bình luận
            </span>
          )}
        </div>
      )}

      {/* Action bar */}
      <div
        className="flex items-center px-2 py-1 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        {/* Like */}
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            post.isLiked
              ? 'text-pink-400'
              : 'text-white/50 hover:text-pink-400 hover:bg-pink-500/10'
          }`}
        >
          <span
            className="text-base transition-transform duration-150"
            style={{ transform: post.isLiked ? 'scale(1.2)' : 'scale(1)' }}
          >
            {post.isLiked ? '♥' : '♡'}
          </span>
          <span>Thích</span>
        </button>

        {/* Comment */}
        <Link
          to={`/post/${post.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-purple-400 hover:bg-purple-500/10 transition-all duration-200"
        >
          <span className="text-base">💬</span>
          <span>Bình luận</span>
        </Link>

        {/* Share */}
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200">
          <span className="text-base">↗</span>
          <span>Chia sẻ</span>
        </button>
      </div>
    </article>
  );
};

// ─── Skeleton loader ──────────────────────────────────────────────────────────

const PostSkeleton = () => (
  <div
    className="rounded-2xl p-4 animate-pulse"
    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-white/10" />
      <div className="space-y-2 flex-1">
        <div className="w-32 h-3 bg-white/10 rounded-full" />
        <div className="w-20 h-2 bg-white/10 rounded-full" />
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="w-full h-3 bg-white/10 rounded-full" />
      <div className="w-5/6 h-3 bg-white/10 rounded-full" />
      <div className="w-3/4 h-3 bg-white/10 rounded-full" />
    </div>
    <div className="w-full h-48 bg-white/10 rounded-xl" />
  </div>
);

// ─── Right sidebar ────────────────────────────────────────────────────────────

const RightSidebar = () => {
  const { user } = useAuthStore();
  const [followed, setFollowed] = useState<Record<number, boolean>>({});

  const toggleFollow = (id: number) =>
    setFollowed((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <aside className="space-y-6">
      {/* Current user */}
      {user && (
        <div className="flex items-center gap-3">
          <Avatar name={user.fullName} avatarUrl={user.avatar} size={44} ring />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user.fullName}</p>
            <p className="text-white/40 text-xs truncate">{user.email}</p>
          </div>
          <Link
            to={`/profile/${user.id}`}
            className="text-purple-400 hover:text-purple-300 text-xs font-semibold transition-colors"
          >
            Xem
          </Link>
        </div>
      )}

      {/* Suggested */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">Gợi ý cho bạn</p>
          <button className="text-white/60 hover:text-white text-xs font-semibold transition-colors">
            Xem tất cả
          </button>
        </div>

        <div className="space-y-3">
          {MOCK_SUGGESTED.map((u) => (
            <div key={u.id} className="flex items-center gap-3">
              <Avatar name={u.fullName} avatarUrl={u.avatarUrl} size={36} ring />
              <div className="flex-1 min-w-0">
                <Link
                  to={`/profile/${u.id}`}
                  className="text-white text-xs font-semibold hover:text-purple-300 transition-colors block truncate"
                >
                  {u.fullName}
                </Link>
                <p className="text-white/35 text-[11px]">Gợi ý cho bạn</p>
              </div>
              <button
                onClick={() => toggleFollow(u.id)}
                className={`text-xs font-semibold transition-colors ${
                  followed[u.id]
                    ? 'text-white/40 hover:text-white/60'
                    : 'text-purple-400 hover:text-purple-300'
                }`}
              >
                {followed[u.id] ? 'Đang theo dõi' : 'Theo dõi'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer links */}
      <div className="text-white/20 text-[11px] leading-relaxed">
        <div className="flex flex-wrap gap-x-2 gap-y-1 mb-2">
          {['Giới thiệu', 'Trợ giúp', 'Bảo mật', 'Điều khoản', 'Vị trí'].map((l) => (
            <a key={l} href="#" className="hover:text-white/40 transition-colors">
              {l}
            </a>
          ))}
        </div>
        <p>© 2026 SocialWeb</p>
      </div>
    </aside>
  );
};

// ─── Feed page ────────────────────────────────────────────────────────────────

const HomePage = () => {
  const { posts, isLoading, fetchPosts } = usePostStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="min-h-screen" style={{ background: '#0a0a1a' }}>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* ── Main feed ── */}
          <main className="flex-1 min-w-0 max-w-[600px]">
            {/* Stories */}
            <StoriesBar />

            {/* Create post (only when logged in) */}
            {isAuthenticated && <CreatePostBox />}

            {/* Posts */}
            <div className="space-y-4">
              {isLoading ? (
                <>
                  <PostSkeleton />
                  <PostSkeleton />
                  <PostSkeleton />
                </>
              ) : posts.length === 0 ? (
                <div
                  className="rounded-2xl p-12 text-center"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="text-5xl mb-4">📭</div>
                  <p className="text-white/50 text-lg font-semibold">Chưa có bài viết nào</p>
                  <p className="text-white/30 text-sm mt-2">
                    Hãy theo dõi thêm bạn bè để xem nội dung mới!
                  </p>
                </div>
              ) : (
                posts.map((post) => <PostCard key={post.id} post={post} />)
              )}
            </div>
          </main>

          {/* ── Right sidebar (desktop only) ── */}
          <div className="hidden lg:block w-[300px] flex-shrink-0 pt-1">
            <div className="sticky top-20">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
