import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { registerSchema, type RegisterFormData } from '../../libs/validation/register.schema';
import { registerService } from '../../services/auth.service';
import type { ErrorApiResponse } from '../../types/api.type';

/* ─── Animated background ring ─── */
const Ring = ({ size, delay, color }: { size: number; delay: string; color: string }) => (
  <div
    className="absolute rounded-full pointer-events-none animate-spin-slow"
    style={{
      width: size,
      height: size,
      border: `1px solid ${color}`,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      animationDelay: delay,
      opacity: 0.15,
    }}
  />
);

/* ─── Input field ─── */
interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  error?: string;
  hint?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registration: any;
}

const InputField = ({ id, label, type, placeholder, error, hint, registration }: InputFieldProps) => {
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
          id={id}
          type={isPassword && showPass ? 'text' : type}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...registration}
          className="w-full px-4 py-3.5 rounded-xl text-white placeholder-white/30 text-sm outline-none transition-all duration-300"
          style={{
            background: focused ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)',
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
      {hint && !error && <p className="text-white/30 text-xs">{hint}</p>}
    </div>
  );
};

/* ─── Password strength indicator ─── */
const PasswordStrength = ({ password }: { password: string }) => {
  const getStrength = (p: string) => {
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  if (!password) return null;
  const strength = getStrength(password);
  const labels = ['', 'Yếu', 'Trung bình', 'Tốt', 'Mạnh'];
  const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i <= strength ? colors[strength] : 'rgba(255,255,255,0.1)' }}
          />
        ))}
      </div>
      {strength > 0 && (
        <p className="text-xs" style={{ color: colors[strength] }}>
          Độ mạnh: {labels[strength]}
        </p>
      )}
    </div>
  );
};

/* ─── Register Page ─── */
const RegisterPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [watchedPassword, setWatchedPassword] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate('/feed', { replace: true });
  }, [isAuthenticated, navigate]);

  // Watch password for strength indicator
  useEffect(() => {
    const sub = watch((value) => {
      setWatchedPassword(value.password ?? '');
    });
    return () => sub.unsubscribe();
  }, [watch]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    setMousePos({ x, y });
  };

  const onSubmit = async (data: RegisterFormData) => {
    setServerError('');
    setIsSubmitting(true);
    try {
      const response = await registerService({
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        password: data.password,
        role: 'USER',
      });

      if (!response.success) {
        setServerError(response.message ?? 'Đăng ký thất bại. Vui lòng thử lại.');
        return;
      }

      // Navigate to OTP page — pass email + password so verify page
      // can forward them to login for auto-fill after successful registration
      navigate('/auth/verify-otp', { state: { email: data.email, password: data.password } });
    } catch (err) {
      const apiErr = err as ErrorApiResponse;
      setServerError(apiErr?.message ?? 'Đăng ký thất bại. Email hoặc số điện thoại có thể đã được sử dụng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-12"
      style={{ background: '#0a0a1a' }}
    >
      {/* Background rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Ring size={600} delay="0s" color="rgba(168,85,247,0.8)" />
        <Ring size={800} delay="2s" color="rgba(236,72,153,0.8)" />
        <Ring size={1000} delay="4s" color="rgba(59,130,246,0.8)" />
      </div>

      {/* Orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 orb bg-purple-600 animate-float" style={{ opacity: 0.35 }} />
      <div className="absolute bottom-0 left-0 w-72 h-72 orb bg-pink-500 animate-float-slow" style={{ opacity: 0.3 }} />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(168,85,247,1) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,1) 1px, transparent 1px)',
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
          <p className="text-white/40 text-sm mt-2">Tạo tài khoản mới ✨</p>
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
            <h1 className="text-2xl font-black text-white mb-1">Đăng ký</h1>
            <p className="text-white/40 text-sm mb-8">Điền thông tin để tạo tài khoản</p>

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
                id="fullName"
                label="Họ và tên"
                type="text"
                placeholder="Nguyễn Văn A"
                error={errors.fullName?.message}
                registration={formRegister('fullName')}
              />

              <InputField
                id="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                registration={formRegister('email')}
              />

              <InputField
                id="phone"
                label="Số điện thoại"
                type="tel"
                placeholder="0912345678"
                error={errors.phone?.message}
                hint="Số điện thoại Việt Nam (VD: 0912345678)"
                registration={formRegister('phone')}
              />

              <div className="space-y-2">
                <InputField
                  id="password"
                  label="Mật khẩu"
                  type="password"
                  placeholder="6–20 ký tự"
                  error={errors.password?.message}
                  hint="Nên có chữ hoa, số và ký tự đặc biệt"
                  registration={formRegister('password')}
                />
                <PasswordStrength password={watchedPassword} />
              </div>

              <InputField
                id="confirmPassword"
                label="Xác nhận mật khẩu"
                type="password"
                placeholder="Nhập lại mật khẩu"
                error={errors.confirmPassword?.message}
                registration={formRegister('confirmPassword')}
              />

              {/* Terms */}
              <p className="text-white/30 text-xs leading-relaxed">
                Bằng cách đăng ký, bạn đồng ý với{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300">
                  Điều khoản dịch vụ
                </a>{' '}
                và{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300">
                  Chính sách bảo mật
                </a>{' '}
                của chúng tôi.
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative w-full py-4 rounded-xl font-bold text-white text-sm overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Đang tạo tài khoản...
                    </>
                  ) : (
                    'Tạo tài khoản →'
                  )}
                </span>
                <div className="absolute inset-0 shimmer-bg opacity-0 hover:opacity-100 transition-opacity" />
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-xs">hoặc đăng ký với</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Social */}
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

        {/* Login link */}
        <p
          className="text-center text-white/40 text-sm mt-6 animate-fade-in"
          style={{ animationDelay: '300ms', animationFillMode: 'both' }}
        >
          Đã có tài khoản?{' '}
          <Link to="/auth/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
