import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../../stores/auth.store';
import type { ErrorApiResponse } from '../../types/api.type';

const DIGITS = 6;

// ─── OTP Input ────────────────────────────────────────────────────────────────

interface OtpInputProps {
  digits: string[];
  onChange: (digits: string[]) => void;
  disabled?: boolean;
  error?: boolean;
}

const OtpInput = ({ digits, onChange, disabled, error }: OtpInputProps) => {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const focus = (i: number) => refs.current[i]?.focus();

  const handleChange = (i: number, raw: string) => {
    // Allow only digits
    const char = raw.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = char;
    onChange(next);
    if (char && i < DIGITS - 1) focus(i + 1);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[i]) {
        // Clear current cell
        const next = [...digits];
        next[i] = '';
        onChange(next);
      } else if (i > 0) {
        // Move back and clear previous
        const next = [...digits];
        next[i - 1] = '';
        onChange(next);
        focus(i - 1);
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' && i > 0) {
      focus(i - 1);
    } else if (e.key === 'ArrowRight' && i < DIGITS - 1) {
      focus(i + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, DIGITS);
    const next = Array(DIGITS).fill('');
    pasted.split('').forEach((c, i) => { next[i] = c; });
    onChange(next);
    focus(Math.min(pasted.length, DIGITS - 1));
  };

  return (
    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          className="w-12 h-14 text-center text-2xl font-bold text-white rounded-xl outline-none transition-all duration-200 disabled:opacity-50"
          style={{
            background: d ? 'rgba(168,85,247,0.18)' : 'rgba(255,255,255,0.07)',
            border: error
              ? '1.5px solid rgba(239,68,68,0.7)'
              : d
              ? '1.5px solid rgba(168,85,247,0.8)'
              : '1.5px solid rgba(255,255,255,0.12)',
            boxShadow: d && !error ? '0 0 0 3px rgba(168,85,247,0.12)' : 'none',
          }}
        />
      ))}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, isAuthenticated, isLoading } = useAuthStore();

  const email: string = (location.state as { email?: string; password?: string })?.email ?? '';
  const password: string = (location.state as { email?: string; password?: string })?.password ?? '';

  const [digits, setDigits] = useState<string[]>(Array(DIGITS).fill(''));
  const [serverError, setServerError] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 min TTL from backend

  const otp = digits.join('');
  const isFilled = otp.length === DIGITS;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate('/feed', { replace: true });
  }, [isAuthenticated, navigate]);

  // Redirect back if no email passed
  useEffect(() => {
    if (!email) navigate('/auth/register', { replace: true });
  }, [email, navigate]);

  // Countdown
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setFieldError('');

    if (!isFilled) {
      setFieldError('Vui lòng nhập đủ 6 chữ số.');
      return;
    }
    if (countdown <= 0) {
      setServerError('Mã OTP đã hết hạn. Vui lòng đăng ký lại.');
      return;
    }

    try {
      await verifyOtp(email, otp);
      // Redirect to login with pre-filled credentials and success flag
      navigate('/auth/login', {
        replace: true,
        state: { email, password, registered: true },
      });
    } catch (err) {
      const apiErr = err as ErrorApiResponse;
      setServerError(apiErr?.message ?? 'Mã OTP không hợp lệ hoặc đã hết hạn.');
      // Clear digits so user can re-enter
      setDigits(Array(DIGITS).fill(''));
    }
  };

  const expired = countdown <= 0;

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#0a0a1a' }}
    >
      {/* Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 orb bg-purple-600 animate-float" style={{ opacity: 0.4 }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 orb bg-pink-500 animate-float-slow" style={{ opacity: 0.3 }} />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8 animate-slide-up">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl"
              style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
            >
              N
            </div>
            <span className="text-white font-black text-2xl tracking-tight">SocialWeb</span>
          </Link>
          <p className="text-white/40 text-sm mt-2">Xác thực email của bạn 📧</p>
        </div>

        {/* Card */}
        <div
          className="animate-slide-up"
          style={{ animationDelay: '100ms', animationFillMode: 'both' }}
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
            {/* Header */}
            <h1 className="text-2xl font-black text-white mb-1">Nhập mã xác thực</h1>
            <p className="text-white/40 text-sm mb-1">Mã 6 chữ số đã được gửi đến</p>
            <p className="text-purple-400 text-sm font-semibold mb-6 truncate">{email}</p>

            {/* Server error */}
            {serverError && (
              <div
                className="mb-5 px-4 py-3 rounded-xl text-red-300 text-sm flex items-center gap-2"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <span>⚠️</span> {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 6-digit input */}
              <div className="space-y-2">
                <OtpInput
                  digits={digits}
                  onChange={(next) => {
                    setDigits(next);
                    setFieldError('');
                    setServerError('');
                  }}
                  disabled={isLoading || expired}
                  error={!!fieldError || !!serverError}
                />
                {fieldError && (
                  <p className="text-red-400 text-xs text-center flex items-center justify-center gap-1">
                    <span>⚠</span> {fieldError}
                  </p>
                )}
              </div>

              {/* Countdown */}
              <div className="text-center">
                {!expired ? (
                  <p className="text-white/40 text-sm">
                    Mã hết hạn sau{' '}
                    <span
                      className="font-semibold tabular-nums"
                      style={{ color: countdown < 60 ? '#f87171' : '#a78bfa' }}
                    >
                      {formatTime(countdown)}
                    </span>
                  </p>
                ) : (
                  <p className="text-red-400 text-sm font-medium">
                    Mã OTP đã hết hạn.{' '}
                    <Link to="/auth/register" className="underline hover:text-red-300 transition-colors">
                      Đăng ký lại
                    </Link>
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!isFilled || isLoading || expired}
                className="relative w-full py-4 rounded-xl font-bold text-white text-sm overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Đang xác thực...
                    </>
                  ) : (
                    'Xác nhận →'
                  )}
                </span>
                <div className="absolute inset-0 shimmer-bg opacity-0 hover:opacity-100 transition-opacity" />
              </button>
            </form>

            {/* Back */}
            <p className="text-center text-white/30 text-xs mt-6">
              Nhập sai email?{' '}
              <Link
                to="/auth/register"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Đăng ký lại
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
