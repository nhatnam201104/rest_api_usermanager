import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '../../stores/auth.store';
import { loginSchema, type LoginFormData } from '../../libs/validation/login.schema';
import type { ErrorApiResponse } from '../../types/api.type';

/* ─── Generate particles once ─── */
const generateParticles = () => Array.from({ length: 12 }, () => ({
  width:  `${Math.random() * 8 + 4}px`,
  height: `${Math.random() * 8 + 4}px`,
  top:    `${Math.random() * 100}%`,
  left:   `${Math.random() * 100}%`,
  opacity: Math.random() * 0.5 + 0.2,
  animation: `float ${Math.random() * 4 + 4}s ease-in-out infinite`,
  animationDelay: `${Math.random() * 4}s`,
}));

const particles = generateParticles();

/* ─── Floating particle ─── */
const Particle = ({ style }: { style: React.CSSProperties }) => (
  <div
    className="absolute rounded-full pointer-events-none"
    style={{
      background: 'linear-gradient(135deg, rgba(168,85,247,0.6), rgba(236,72,153,0.6))',
      ...style,
    }}
  />
);

/* ─── Input field component ─── */
interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  error?: string;
  registration: UseFormRegisterReturn;
}

const InputField = ({ id, label, type, placeholder, error, registration }: InputFieldProps) => {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-white/70">
        {label}
      </label>
      <div className="relative">
        <input
          {...registration}
          id={id}
          type={isPassword && showPass ? 'text' : type}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={(event) => {
            setFocused(false);
            void registration.onBlur(event);
          }}
          className="w-full px-4 py-3.5 rounded-xl text-white placeholder-white/30 text-sm outline-none transition-all duration-300"
          style={{
            background: focused
              ? 'rgba(255,255,255,0.12)'
              : 'rgba(255,255,255,0.07)',
            border: focused
              ? '1px solid rgba(168,85,247,0.7)'
              : error
              ? '1px solid rgba(239,68,68,0.6)'
              : '1px solid rgba(255,255,255,0.1)',
            boxShadow: focused ? '0 0 0 3px rgba(168,85,247,0.15)' : 'none',
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors text-sm"
          >
            {showPass ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

/* ─── Login Page ─── */
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuthStore();
  const [serverError, setServerError] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // State passed from verify-otp page after successful registration
  const locationState = location.state as { email?: string; password?: string; registered?: boolean } | null;
  const prefillEmail = locationState?.email ?? '';
  const prefillPassword = locationState?.password ?? '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: prefillEmail,
      password: prefillPassword,
    },
  });

  // Show success toast if redirected after registration
  useEffect(() => {
    if (locationState?.registered) {
      toast.success('Đăng ký thành công! Hãy đăng nhập để tiếp tục 🎉');
      window.history.replaceState({}, '');
    }
  }, [locationState?.registered]);

  useEffect(() => {
    if (isAuthenticated) navigate('/feed', { replace: true });
  }, [isAuthenticated, navigate]);

  /* 3D tilt on card */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    setMousePos({ x, y });
  };

  const onSubmit = async (data: LoginFormData) => {
    setServerError('');
    try {
      await login(data.email, data.password);
      navigate('/feed', { replace: true });
    } catch (err) {
      const apiErr = err as ErrorApiResponse;
      setServerError(apiErr?.message ?? 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#0a0a1a' }}
    >
      {/* Background orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 orb bg-purple-600 animate-float" style={{ opacity: 0.4 }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 orb bg-pink-500 animate-float-slow" style={{ opacity: 0.3 }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 orb bg-blue-500 animate-float-fast" style={{ opacity: 0.2 }} />

      {/* Particles */}
      {particles.map((p, i) => (
        <Particle key={i} style={p} />
      ))}

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8 animate-slide-up">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-glow-purple animate-pulse-glow"
              style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
            >
              N
            </div>
            <span className="text-white font-black text-2xl tracking-tight">SocialWeb</span>
          </Link>
          <p className="text-white/40 text-sm mt-2">Chào mừng trở lại 👋</p>
        </div>

        {/* Card */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
          className="animate-slide-up"
          style={{
            transform: `perspective(800px) rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`,
            transition: 'transform 0.15s ease',
            animationDelay: '100ms',
            animationFillMode: 'both',
          }}
        >
          <div
            className="rounded-3xl p-8"
            style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <h1 className="text-2xl font-black text-white mb-1">Đăng nhập</h1>
            <p className="text-white/40 text-sm mb-8">Nhập thông tin tài khoản của bạn</p>

            {/* Server error */}
            {serverError && (
              <div
                className="mb-6 px-4 py-3 rounded-xl text-red-300 text-sm flex items-center gap-2"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <span>⚠️</span> {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <InputField
                id="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                registration={register('email')}
              />

              <InputField
                id="password"
                label="Mật khẩu"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                registration={register('password')}
              />

              {/* Forgot password */}
              <div className="flex justify-end">
                <a href="#" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                  Quên mật khẩu?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="relative w-full py-4 rounded-xl font-bold text-white text-sm overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting || isLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Đang xử lý...
                    </>
                  ) : (
                    'Đăng nhập →'
                  )}
                </span>
                {/* Shimmer */}
                <div className="absolute inset-0 shimmer-bg opacity-0 hover:opacity-100 transition-opacity" />
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-xs">hoặc tiếp tục với</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Social login (UI only) */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🌐', label: 'Google' },
                { icon: '📘', label: 'Facebook' },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl text-white/70 text-sm font-medium transition-all duration-200 hover:bg-white/10 hover:text-white"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <span>{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Register link */}
        <p className="text-center text-white/40 text-sm mt-6 animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
          Chưa có tài khoản?{' '}
          <Link to="/auth/register" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
