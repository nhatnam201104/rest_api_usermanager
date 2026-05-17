import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

/* ─── Mock phone screen slides ─── */
const PHONE_SLIDES = [
  {
    bg: 'from-purple-500 to-pink-500',
    icon: '🌟',
    title: 'Khoảnh khắc đẹp',
    desc: 'Chia sẻ những khoảnh khắc ý nghĩa',
  },
  {
    bg: 'from-blue-500 to-cyan-400',
    icon: '💬',
    title: 'Kết nối bạn bè',
    desc: 'Trò chuyện và tương tác mọi lúc',
  },
  {
    bg: 'from-orange-400 to-pink-500',
    icon: '🎨',
    title: 'Sáng tạo nội dung',
    desc: 'Thể hiện cá tính của bạn',
  },
  {
    bg: 'from-green-400 to-teal-500',
    icon: '🌍',
    title: 'Cộng đồng toàn cầu',
    desc: 'Kết nối với triệu người dùng',
  },
];

/* ─── Feature cards ─── */
const FEATURES = [
  {
    icon: '✨',
    title: 'Chia sẻ khoảnh khắc',
    desc: 'Đăng ảnh, video và câu chuyện của bạn với bạn bè và người theo dõi.',
    gradient: 'from-purple-500 to-pink-500',
    delay: '0ms',
  },
  {
    icon: '💬',
    title: 'Nhắn tin thời gian thực',
    desc: 'Trò chuyện trực tiếp, gửi ảnh và biểu cảm với những người bạn quan tâm.',
    gradient: 'from-blue-500 to-cyan-400',
    delay: '100ms',
  },
  {
    icon: '🔥',
    title: 'Khám phá xu hướng',
    desc: 'Theo dõi các chủ đề hot, hashtag nổi bật và nội dung được yêu thích nhất.',
    gradient: 'from-orange-400 to-red-500',
    delay: '200ms',
  },
  {
    icon: '🛡️',
    title: 'Bảo mật tuyệt đối',
    desc: 'Kiểm soát hoàn toàn quyền riêng tư và bảo vệ dữ liệu cá nhân của bạn.',
    gradient: 'from-green-400 to-teal-500',
    delay: '300ms',
  },
  {
    icon: '🎯',
    title: 'Nội dung cá nhân hóa',
    desc: 'Thuật toán thông minh hiển thị nội dung phù hợp với sở thích của bạn.',
    gradient: 'from-yellow-400 to-orange-500',
    delay: '400ms',
  },
  {
    icon: '🌐',
    title: 'Cộng đồng đa dạng',
    desc: 'Tham gia hàng triệu người dùng từ khắp nơi trên thế giới.',
    gradient: 'from-pink-500 to-purple-600',
    delay: '500ms',
  },
];

/* ─── Stats ─── */
const STATS = [
  { value: '10M+', label: 'Người dùng' },
  { value: '50M+', label: 'Bài viết' },
  { value: '200M+', label: 'Lượt thích' },
  { value: '99.9%', label: 'Uptime' },
];

/* ─── 3D Floating Phone Component ─── */
const FloatingPhone = () => {
  const [slide, setSlide] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % PHONE_SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const x = ((e.clientX - cx) / rect.width) * 20;
      const y = ((e.clientY - cy) / rect.height) * -20;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const current = PHONE_SLIDES[slide];

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center"
      style={{ perspective: '1000px' }}
    >
      {/* Glow orbs behind phone */}
      <div className="absolute w-64 h-64 orb bg-purple-500 animate-float" style={{ top: '-20%', left: '10%' }} />
      <div className="absolute w-48 h-48 orb bg-pink-500 animate-float-slow" style={{ bottom: '-10%', right: '5%' }} />
      <div className="absolute w-32 h-32 orb bg-blue-400 animate-float-fast" style={{ top: '30%', right: '-10%' }} />

      {/* Phone frame */}
      <div
        className="relative z-10 transition-transform duration-100 ease-out"
        style={{
          transform: `rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Phone shadow */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-8 rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)',
            filter: 'blur(8px)',
            transform: `translateZ(-20px) scaleX(${1 + mousePos.x * 0.01})`,
          }}
        />

        {/* Phone body */}
        <div
          className="relative w-56 rounded-[2.5rem] overflow-hidden"
          style={{
            height: '480px',
            background: 'linear-gradient(145deg, #1a1a2e, #16213e)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-20" />

          {/* Screen content */}
          <div className={`absolute inset-0 bg-gradient-to-br ${current.bg} transition-all duration-700`}>
            {/* Status bar */}
            <div className="flex justify-between items-center px-6 pt-12 pb-2 text-white text-xs font-medium">
              <span>9:41</span>
              <span>●●●</span>
            </div>

            {/* App header */}
            <div className="px-4 py-2 flex items-center justify-between">
              <span className="text-white font-bold text-lg">Nexus</span>
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs">♥</div>
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs">✉</div>
              </div>
            </div>

            {/* Stories row */}
            <div className="flex gap-2 px-4 py-2 overflow-hidden">
              {['A', 'B', 'C', 'D'].map((l, i) => (
                <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{
                      background: 'rgba(255,255,255,0.3)',
                      border: '2px solid rgba(255,255,255,0.6)',
                    }}
                  >
                    {l}
                  </div>
                  <span className="text-white/70 text-[9px]">User {i + 1}</span>
                </div>
              ))}
            </div>

            {/* Post card */}
            <div className="mx-4 mt-2 rounded-2xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div className="flex items-center gap-2 p-3">
                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-lg">
                  {current.icon}
                </div>
                <div>
                  <div className="text-white text-xs font-semibold">{current.title}</div>
                  <div className="text-white/60 text-[9px]">2 phút trước</div>
                </div>
              </div>
              <div className="h-28 flex items-center justify-center text-5xl">
                {current.icon}
              </div>
              <div className="p-3">
                <p className="text-white/80 text-[10px]">{current.desc}</p>
                <div className="flex gap-3 mt-2 text-white/60 text-xs">
                  <span>♥ 1.2k</span>
                  <span>💬 48</span>
                  <span>↗ 23</span>
                </div>
              </div>
            </div>
          </div>

          {/* Screen glare */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
            }}
          />

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/40 rounded-full" />
        </div>

        {/* Slide dots */}
        <div className="flex justify-center gap-2 mt-4">
          {PHONE_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`rounded-full transition-all duration-300 ${
                i === slide ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Feature Card with 3D hover ─── */
const FeatureCard = ({ feature }: { feature: typeof FEATURES[0] }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setTilt({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="glass rounded-2xl p-6 cursor-default animate-slide-up"
      style={{
        transform: `perspective(600px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateZ(0)`,
        transition: 'transform 0.15s ease, box-shadow 0.3s ease',
        boxShadow: tilt.x !== 0
          ? '0 25px 50px rgba(0,0,0,0.4), 0 0 30px rgba(168,85,247,0.2)'
          : '0 8px 32px rgba(0,0,0,0.2)',
        animationDelay: feature.delay,
        animationFillMode: 'both',
      }}
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
        {feature.icon}
      </div>
      <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
      <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
    </div>
  );
};

/* ─── Main Landing Page ─── */
const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#0a0a1a' }}>

      {/* ── Background mesh ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-mesh-gradient" />
        <div
          className="absolute top-0 left-1/4 w-96 h-96 orb bg-purple-600"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-80 h-80 orb bg-pink-500"
          style={{ transform: `translateY(${scrollY * -0.2}px)` }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-64 h-64 orb bg-blue-500"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        />
      </div>

      {/* ── Hero Section ── */}
      <section className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: Text */}
            <div className="space-y-8 animate-slide-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-white/80">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Nền tảng mạng xã hội thế hệ mới
              </div>

              {/* Headline */}
              <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                <span className="text-white">Kết nối</span>
                <br />
                <span className="text-gradient">thế giới</span>
                <br />
                <span className="text-white">của bạn</span>
              </h1>

              <p className="text-white/60 text-lg leading-relaxed max-w-md">
                Chia sẻ khoảnh khắc, kết nối bạn bè và khám phá những điều thú vị
                mỗi ngày trên nền tảng xã hội hiện đại nhất.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/auth/register"
                  className="group relative px-8 py-4 rounded-2xl font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-glow-purple"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
                >
                  <span className="relative z-10">Bắt đầu miễn phí</span>
                  <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                <Link
                  to="/auth/login"
                  className="px-8 py-4 rounded-2xl font-bold text-white glass hover:bg-white/15 transition-all duration-300 hover:scale-105"
                >
                  Đăng nhập →
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {['🧑', '👩', '👨', '🧑‍💻', '👩‍🎨'].map((emoji, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full glass flex items-center justify-center text-lg border-2 border-white/20"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">10M+ người dùng</div>
                  <div className="text-white/50 text-xs">đang hoạt động mỗi ngày</div>
                </div>
              </div>
            </div>

            {/* Right: 3D Phone */}
            <div className="flex justify-center lg:justify-end">
              <FloatingPhone />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="relative z-10 py-16">
        <div className="container mx-auto px-6">
          <div className="glass rounded-3xl p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {STATS.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl font-black text-gradient mb-1">{stat.value}</div>
                  <div className="text-white/50 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Tính năng <span className="text-gradient">nổi bật</span>
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Mọi thứ bạn cần để kết nối, chia sẻ và khám phá trong một nền tảng duy nhất.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={i} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Chỉ <span className="text-gradient">3 bước</span> đơn giản
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.5), transparent)' }}
            />

            {[
              { step: '01', icon: '📝', title: 'Tạo tài khoản', desc: 'Đăng ký miễn phí chỉ trong 30 giây với email của bạn.' },
              { step: '02', icon: '🎨', title: 'Cá nhân hóa', desc: 'Thiết lập hồ sơ và theo dõi những người bạn quan tâm.' },
              { step: '03', icon: '🚀', title: 'Bắt đầu chia sẻ', desc: 'Đăng bài, tương tác và kết nối với cộng đồng.' },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="relative inline-block mb-6">
                  <div
                    className="w-32 h-32 rounded-3xl flex items-center justify-center text-5xl mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3))',
                      border: '1px solid rgba(168,85,247,0.4)',
                      boxShadow: '0 20px 40px rgba(168,85,247,0.2)',
                    }}
                  >
                    {item.icon}
                  </div>
                  <div
                    className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
                    style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
                  >
                    {item.step}
                  </div>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div
            className="relative rounded-3xl p-12 text-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3))',
              border: '1px solid rgba(168,85,247,0.3)',
            }}
          >
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-64 h-64 orb bg-purple-500" style={{ opacity: 0.3 }} />
            <div className="absolute bottom-0 right-0 w-48 h-48 orb bg-pink-500" style={{ opacity: 0.3 }} />

            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
                Sẵn sàng tham gia?
              </h2>
              <p className="text-white/60 text-lg mb-8 max-w-md mx-auto">
                Hàng triệu người đang kết nối mỗi ngày. Đừng bỏ lỡ cơ hội của bạn.
              </p>
              <Link
                to="/auth/register"
                className="inline-block px-10 py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300 hover:scale-105 animate-pulse-glow"
                style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
              >
                Tạo tài khoản ngay →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-12 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm"
                style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
              >
                N
              </div>
              <span className="text-white font-bold text-lg">Nexus</span>
            </div>
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} Nexus Social. All rights reserved.
            </p>
            <div className="flex gap-6 text-white/40 text-sm">
              <a href="#" className="hover:text-white/80 transition-colors">Điều khoản</a>
              <a href="#" className="hover:text-white/80 transition-colors">Bảo mật</a>
              <a href="#" className="hover:text-white/80 transition-colors">Hỗ trợ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
