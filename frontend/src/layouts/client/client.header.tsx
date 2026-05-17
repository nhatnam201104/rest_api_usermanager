import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/auth.store';

const ClientHeader = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    void logout().finally(() => setMenuOpen(false));
  };

  const isLanding = location.pathname === '/';

  const navLink = (to: string, label: string) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`text-sm font-medium transition-colors duration-200 ${
          active ? 'text-white' : 'text-white/60 hover:text-white'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled || !isLanding
          ? 'rgba(10,10,26,0.85)'
          : 'transparent',
        backdropFilter: scrolled || !isLanding ? 'blur(20px)' : 'none',
        borderBottom: scrolled || !isLanding
          ? '1px solid rgba(255,255,255,0.08)'
          : 'none',
      }}
    >
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
          >
            N
          </div>
          <span className="text-white font-black text-lg tracking-tight">SocialApp</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLink('/', 'Trang chủ')}
          {isAuthenticated && navLink('/feed', 'Bảng tin')}

          {isAuthenticated && user ? (
            <>
              <Link
                to={`/profile/${user.id}`}
                className="text-white/60 hover:text-white text-sm font-medium transition-colors duration-200"
              >
                Cá nhân
              </Link>

              {/* Avatar dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 group"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-200 group-hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                      boxShadow: '0 0 15px rgba(168,85,247,0.4)',
                    }}
                  >
                    {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-white/70 text-sm font-medium hidden lg:block">
                    {user.fullName?.split(' ').pop()}
                  </span>
                  <span className="text-white/40 text-xs">{menuOpen ? '▲' : '▼'}</span>
                </button>

                {menuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-48 rounded-2xl py-2 z-50"
                    style={{
                      background: 'rgba(15,15,30,0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    }}
                  >
                    <Link
                      to={`/profile/${user.id}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/5 text-sm transition-colors"
                    >
                      <span>👤</span> Hồ sơ cá nhân
                    </Link>
                    <div className="h-px bg-white/10 my-1 mx-3" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm transition-colors"
                    >
                      <span>🚪</span> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/auth/login"
                className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-200 px-4 py-2 rounded-xl hover:bg-white/10"
              >
                Đăng nhập
              </Link>
              <Link
                to="/auth/register"
                className="text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-glow-purple"
                style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white/70 hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-6 pb-6 space-y-2"
          style={{
            background: 'rgba(10,10,26,0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Link to="/" onClick={() => setMenuOpen(false)} className="block py-3 text-white/70 hover:text-white text-sm font-medium transition-colors border-b border-white/5">
            🏠 Trang chủ
          </Link>
          {isAuthenticated && (
            <Link to="/feed" onClick={() => setMenuOpen(false)} className="block py-3 text-white/70 hover:text-white text-sm font-medium transition-colors border-b border-white/5">
              📰 Bảng tin
            </Link>
          )}
          {isAuthenticated && user ? (
            <>
              <Link to={`/profile/${user.id}`} onClick={() => setMenuOpen(false)} className="block py-3 text-white/70 hover:text-white text-sm font-medium transition-colors border-b border-white/5">
                👤 Cá nhân
              </Link>
              <button onClick={handleLogout} className="block w-full text-left py-3 text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
                🚪 Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login" onClick={() => setMenuOpen(false)} className="block py-3 text-white/70 hover:text-white text-sm font-medium transition-colors border-b border-white/5">
                Đăng nhập
              </Link>
              <Link
                to="/auth/register"
                onClick={() => setMenuOpen(false)}
                className="block mt-3 text-center text-white text-sm font-bold px-5 py-3 rounded-xl"
                style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
              >
                Đăng ký ngay
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default ClientHeader;
