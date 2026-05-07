import { Link } from 'react-router-dom';

const ClientFooter = () => {
  return (
    <footer
      className="relative py-12 mt-auto overflow-hidden"
      style={{
        background: 'rgba(10,10,26,0.95)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Subtle glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(168,85,247,0.15) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm transition-transform duration-300 group-hover:scale-110"
              style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
            >
              N
            </div>
            <span className="text-white font-black text-lg tracking-tight">Nexus</span>
          </Link>

          {/* Copyright */}
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} Nexus Social. All rights reserved.
          </p>

          {/* Links */}
          <div className="flex gap-6 text-white/40 text-sm">
            <a href="#" className="hover:text-white/70 transition-colors">Điều khoản</a>
            <a href="#" className="hover:text-white/70 transition-colors">Bảo mật</a>
            <a href="#" className="hover:text-white/70 transition-colors">Hỗ trợ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ClientFooter;
