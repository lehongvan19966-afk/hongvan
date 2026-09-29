import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../utils/audioUtils';

export const EmailVerificationBanner: React.FC = () => {
  const { user, isEmailVerified, resendVerification, openAuthModal, isAuthenticated } = useAuth();
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // If user is verified or no email, don't show banner
  if (isEmailVerified || !user.email) {
    return null;
  }

  const handleResend = async () => {
    if (cooldown > 0 || loading) return;
    setLoading(true);
    sounds.playPop();
    const res = await resendVerification(user.email);
    setLoading(false);

    if (res.success) {
      sounds.playSuccess();
      setMsg('Đã gửi lại email xác minh!');
      setCooldown(60);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setMsg(res.message || 'Chưa thể gửi lại lúc này.');
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-3 sm:px-4 py-2 sm:py-2.5 shadow-md flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-semibold animate-fadeIn">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-200 animate-bounce" />
        <span>
          Email của cô (<strong>{user.email}</strong>) chưa được xác minh. Hãy xác minh để mở khóa toàn bộ tính năng tải video và lưu trữ bài học.
        </span>
      </div>

      <div className="flex items-center gap-2">
        {msg ? (
          <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-bold text-white flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            {msg}
          </span>
        ) : (
          <button
            onClick={handleResend}
            disabled={cooldown > 0 || loading}
            className="px-3 py-1 bg-white text-orange-900 hover:bg-orange-50 rounded-xl text-xs font-extrabold transition-all cursor-pointer disabled:opacity-60 flex items-center gap-1 shadow-2xs"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span>{cooldown > 0 ? `Gửi lại (${cooldown}s)` : 'Gửi lại email xác minh'}</span>
          </button>
        )}

        <button
          onClick={() => {
            sounds.playPop();
            openAuthModal('verify');
          }}
          className="px-3 py-1 bg-amber-950/40 hover:bg-amber-950/60 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1"
        >
          <span>Xác minh ngay</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
