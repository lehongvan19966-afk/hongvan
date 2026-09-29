import React, { useState, useEffect } from 'react';
import { MamAiMascot } from './MamAiMascot';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../utils/audioUtils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'verify' | 'forgot';
  message?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  message,
}) => {
  const {
    login,
    register,
    loginWithGoogle,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    user,
    isEmailVerified,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'verify' | 'forgot' | 'reset-code'>(
    initialMode
  );

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Verification & reset code states
  const [verifyCode, setVerifyCode] = useState('');
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Cooldown timer for resend verification (60 seconds)
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg(null);
    setSuccessMsg(null);
    if (user?.email) {
      setEmail(user.email);
    }
  }, [initialMode, isOpen, user?.email]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  if (!isOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pass: string): { label: string; color: string; score: number } => {
    if (!pass) return { label: 'Chưa nhập', color: 'bg-stone-200', score: 0 };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { label: 'Yếu', color: 'bg-rose-500', score: 1 };
    if (score <= 3) return { label: 'Trung bình', color: 'bg-amber-500', score: 2 };
    return { label: 'Tốt', color: 'bg-emerald-500', score: 3 };
  };

  const strength = getPasswordStrength(password);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('Cô vui lòng điền đầy đủ email và mật khẩu');
      return;
    }

    setIsLoading(true);
    sounds.playPop();
    const res = await login(email.trim(), password, rememberMe);
    setIsLoading(false);

    if (res.success) {
      sounds.playSuccess();
      onClose();
    } else {
      setErrorMsg(res.message || 'Đăng nhập không thành công');
    }
  };

  // Handle Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg('Cô vui lòng nhập họ và tên');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Địa chỉ email chưa đúng định dạng.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận chưa trùng khớp.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('Cô vui lòng đồng ý với Điều khoản sử dụng và Chính sách bảo mật.');
      return;
    }

    setIsLoading(true);
    sounds.playPop();
    const res = await register(name.trim(), email.trim(), password);
    setIsLoading(false);

    if (res.success) {
      sounds.playSuccess();
      setMode('verify');
      if (res.verificationCode) {
        setVerificationFeedback(`Mã xác thực của cô là: ${res.verificationCode}`);
        setVerifyCode(res.verificationCode);
      }
      setCooldown(60);
    } else {
      setErrorMsg(res.message || 'Đăng ký tài khoản không thành công');
    }
  };

  // Handle Google Login
  const handleGoogleSubmit = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    sounds.playPop();
    const res = await loginWithGoogle(
      email || 'lehongvan19966@gmail.com',
      name || 'Cô Lê Hồng Vân',
      '👩‍🏫'
    );
    setIsLoading(false);
    if (res.success) {
      sounds.playSuccess();
      onClose();
    } else {
      setErrorMsg(res.message || 'Không thể đăng nhập bằng Google lúc này');
    }
  };

  // Handle Verify Email
  const handleVerifySubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!verifyCode.trim()) {
      setErrorMsg('Cô vui lòng nhập mã xác minh 6 số');
      return;
    }

    setIsLoading(true);
    sounds.playPop();
    const res = await verifyEmail(verifyCode.trim(), email);
    setIsLoading(false);

    if (res.success) {
      sounds.playSuccess();
      setSuccessMsg(res.message || 'Xác minh email thành công!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setErrorMsg(res.message || 'Mã xác minh không chính xác.');
    }
  };

  // Handle Resend Verification
  const handleResendClick = async () => {
    if (cooldown > 0) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);
    sounds.playPop();

    const res = await resendVerification(email);
    setIsLoading(false);

    if (res.success) {
      sounds.playSuccess();
      setCooldown(60);
      setSuccessMsg('Đã gửi lại liên kết xác minh đến email của cô.');
      if (res.verificationCode) {
        setVerificationFeedback(`Mã xác minh mới: ${res.verificationCode}`);
        setVerifyCode(res.verificationCode);
      }
    } else {
      setErrorMsg(res.message || 'Lỗi gửi lại mã xác minh.');
    }
  };

  // Handle Forgot Password
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('Vui lòng nhập địa chỉ email của cô');
      return;
    }

    setIsLoading(true);
    sounds.playPop();
    const res = await forgotPassword(email.trim());
    setIsLoading(false);

    if (res.success) {
      sounds.playSuccess();
      setSuccessMsg(res.message || 'Hướng dẫn đặt lại mật khẩu đã được gửi.');
      if (res.resetCode) {
        setResetCode(res.resetCode);
      }
      setMode('reset-code');
    } else {
      setErrorMsg(res.message || 'Có lỗi xảy ra');
    }
  };

  // Handle Reset Password with Code
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!resetCode.trim()) {
      setErrorMsg('Vui lòng nhập mã khôi phục 6 số');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 8 ký tự');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Mật khẩu xác nhận chưa trùng khớp');
      return;
    }

    setIsLoading(true);
    sounds.playPop();
    const res = await resetPassword(email.trim(), resetCode.trim(), newPassword);
    setIsLoading(false);

    if (res.success) {
      sounds.playSuccess();
      setSuccessMsg(res.message || 'Đặt lại mật khẩu thành công!');
      setTimeout(() => {
        setMode('login');
        setPassword(newPassword);
        setSuccessMsg('Cô có thể đăng nhập ngay với mật khẩu mới.');
      }, 1500);
    } else {
      setErrorMsg(res.message || 'Lỗi đặt lại mật khẩu');
    }
  };

  const getWebmailUrl = (emailAddr: string) => {
    const domain = emailAddr.split('@')[1] || '';
    if (domain.includes('gmail')) return 'https://mail.google.com';
    if (domain.includes('outlook') || domain.includes('hotmail')) return 'https://outlook.live.com';
    if (domain.includes('yahoo')) return 'https://mail.yahoo.com';
    return 'https://mail.google.com';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl sm:rounded-[32px] shadow-2xl border border-rose-100 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp">
        {/* Soft Pastel Background Accent */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-rose-100 via-orange-100 to-purple-100 -z-0" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-500 hover:text-stone-800 flex items-center justify-center shadow-xs transition-all cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Branding */}
        <div className="relative z-10 pt-6 px-6 pb-2 text-center">
          <div className="inline-block relative">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-md shadow-rose-200/50 p-1 mx-auto flex items-center justify-center border border-rose-100">
              <MamAiMascot size="sm" mood="happy" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 shadow-xs">
              <Sparkles className="w-3 h-3" />
            </div>
          </div>

          <h2 className="mt-2 text-xl font-extrabold text-amber-950 font-['Quicksand'] tracking-tight">
            VƯỜN ƯƠM AI
          </h2>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            “Cô học AI – Bé học vui – Cộng đồng cùng lan tỏa.”
          </p>

          {message && (
            <div className="mt-2 text-xs bg-amber-50 border border-amber-200 text-amber-900 rounded-xl px-3 py-1.5 font-medium flex items-center gap-1.5 justify-center">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}
        </div>

        {/* Mode Switcher Tabs (Login vs Register) */}
        {(mode === 'login' || mode === 'register') && (
          <div className="relative z-10 px-6 pt-3">
            <div className="flex bg-rose-50/70 p-1 rounded-2xl border border-rose-100">
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setMode('login');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setMode('register');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Đăng ký tài khoản
              </button>
            </div>
          </div>
        )}

        {/* Form Body Scroll Area */}
        <div className="relative z-10 p-6 overflow-y-auto space-y-4">
          {/* Alerts */}
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ================= MODE: LOGIN ================= */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của cô"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50/80 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700">Mật khẩu</label>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setMode('forgot');
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="w-full pl-10 pr-10 py-2.5 bg-stone-50/80 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-stone-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-500 accent-rose-500 cursor-pointer"
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
              </div>

              {/* Main Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white font-black text-sm shadow-md shadow-rose-200 hover:shadow-lg hover:shadow-rose-300 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Đăng nhập</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-stone-200 w-full" />
                <span className="bg-white px-3 text-[11px] text-stone-400 font-bold uppercase tracking-wider">
                  hoặc
                </span>
              </div>

              {/* Google One-Click Button */}
              <button
                type="button"
                onClick={handleGoogleSubmit}
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-white border border-stone-200 hover:border-stone-300 rounded-2xl text-xs sm:text-sm font-bold text-stone-700 shadow-2xs hover:bg-stone-50 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2.5"
              >
                {/* Official Google G SVG */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Tiếp tục với Google</span>
              </button>

              <p className="text-center text-xs text-stone-500 pt-1">
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setMode('register');
                  }}
                  className="font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                >
                  Đăng ký ngay
                </button>
              </p>
            </form>
          )}

          {/* ================= MODE: REGISTER ================= */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Họ và tên của cô
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Cô Lê Hồng Vân"
                    className="w-full pl-10 pr-4 py-2 bg-stone-50/80 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com (Gmail, Outlook, Yahoo...)"
                    className="w-full pl-10 pr-4 py-2 bg-stone-50/80 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700">Mật khẩu</label>
                  {password && (
                    <span className="text-[10px] font-bold text-stone-500">
                      Độ mạnh: <strong className="text-stone-800">{strength.label}</strong>
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 8 ký tự"
                    className="w-full pl-10 pr-10 py-2 bg-stone-50/80 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength bar */}
                {password && (
                  <div className="w-full bg-stone-100 h-1.5 rounded-full mt-1.5 overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(strength.score / 3) * 100}%` }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nhập lại mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu để xác nhận"
                    className="w-full pl-10 pr-10 py-2 bg-stone-50/80 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[11px] text-rose-500 font-bold mt-1">
                    Mật khẩu xác nhận chưa trùng khớp.
                  </p>
                )}
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 text-[11px] text-stone-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-500 accent-rose-500 cursor-pointer mt-0.5"
                  />
                  <span>
                    Tôi đồng ý với{' '}
                    <span className="font-bold text-rose-600 underline">
                      Điều khoản sử dụng
                    </span>{' '}
                    và{' '}
                    <span className="font-bold text-rose-600 underline">
                      Chính sách bảo mật
                    </span>{' '}
                    của Vườn Ươm AI.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white font-black text-sm shadow-md shadow-rose-200 hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Tạo tài khoản Vườn Ươm AI</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-stone-500 pt-1">
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setMode('login');
                  }}
                  className="font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                >
                  Đăng nhập
                </button>
              </p>
            </form>
          )}

          {/* ================= MODE: VERIFY EMAIL SCREEN (IX-D & IX-E) ================= */}
          {mode === 'verify' && (
            <div className="space-y-4 text-center py-2 animate-fadeIn">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-100 to-amber-100 border border-rose-200 flex items-center justify-center mx-auto text-3xl shadow-inner">
                📩
              </div>

              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-amber-950 font-['Quicksand']">
                  Kiểm tra email của cô
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  Vườn Ươm AI vừa gửi một liên kết xác minh đến địa chỉ email:
                </p>
                <div className="inline-block px-3 py-1 bg-rose-50 border border-rose-200 text-rose-800 font-bold text-xs rounded-full">
                  {email || user?.email || 'email@example.com'}
                </div>
              </div>

              {/* Notice for unverified limit */}
              <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-[11px] text-amber-900 text-left font-medium flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Chỉ tài khoản đã xác minh mới có thể <strong>đăng video bài học</strong>, chia sẻ tài liệu cộng đồng và lưu tiến độ học lâu dài.
                </span>
              </div>

              {/* Direct Code Verification Input */}
              <div className="pt-2 text-left">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nhập mã xác minh (6 số từ email)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ví dụ: 829415"
                    className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-center text-base tracking-widest font-black text-amber-950 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleVerifySubmit()}
                    disabled={isLoading || !verifyCode.trim()}
                    className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black transition-all cursor-pointer disabled:opacity-50"
                  >
                    Xác minh
                  </button>
                </div>
                {verificationFeedback && (
                  <p className="text-[11px] text-emerald-700 font-bold mt-1 text-center">
                    💡 {verificationFeedback}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {/* 1. Open Webmail */}
                <a
                  href={getWebmailUrl(email)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 bg-white border border-rose-200 hover:bg-rose-50 text-rose-800 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Mở ứng dụng Email</span>
                </a>

                {/* 2. Resend Email with Cooldown */}
                <button
                  type="button"
                  onClick={handleResendClick}
                  disabled={cooldown > 0 || isLoading}
                  className="w-full py-2 px-4 rounded-2xl text-xs font-bold text-stone-600 hover:text-stone-900 border border-stone-200 hover:bg-stone-50 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>
                    {cooldown > 0
                      ? `Gửi lại sau ${cooldown}s`
                      : 'Gửi lại email xác minh'}
                  </span>
                </button>

                {/* 3. Change Email address */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setMode('register');
                  }}
                  className="text-xs text-stone-500 hover:text-stone-800 underline block mx-auto cursor-pointer"
                >
                  Đổi địa chỉ email khác
                </button>
              </div>
            </div>
          )}

          {/* ================= MODE: FORGOT PASSWORD (IX-J) ================= */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-stone-500 hover:text-stone-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Quay lại đăng nhập</span>
              </button>

              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-amber-950 font-['Quicksand']">
                  Khôi phục mật khẩu
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  Nhập email đã đăng ký. Vườn Ươm AI sẽ gửi liên kết và mã 6 số để cô tạo mật khẩu mới.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của cô"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50/80 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black text-xs sm:text-sm shadow-md shadow-rose-200 hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Gửi liên kết đặt lại mật khẩu</span>
                )}
              </button>
            </form>
          )}

          {/* ================= MODE: RESET CODE / NEW PASSWORD ================= */}
          {mode === 'reset-code' && (
            <form onSubmit={handleResetSubmit} className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-amber-950 font-['Quicksand']">
                  Đặt lại mật khẩu mới
                </h3>
                <p className="text-xs text-stone-600 font-medium">
                  Cô vui lòng nhập mã xác nhận 6 số đã nhận và mật khẩu mới.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Mã khôi phục (6 số)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="Ví dụ: 382914"
                  className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-2xl text-center text-sm font-bold tracking-widest text-amber-950 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Mật khẩu mới (tối thiểu 8 ký tự)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black text-xs sm:text-sm shadow-md active:scale-[0.98] transition-all cursor-pointer mt-2"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  <span>Lưu mật khẩu mới & Đăng nhập</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
