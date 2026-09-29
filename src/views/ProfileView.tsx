import React, { useState } from 'react';
import { MamAiMascot } from '../components/MamAiMascot';
import {
  User,
  Award,
  BookOpen,
  FolderHeart,
  Flame,
  Sparkles,
  Settings,
  CheckCircle2,
  Clock,
  LogOut,
  Edit,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Phone,
  BookMarked,
  Save,
  KeyRound,
  RefreshCw,
} from 'lucide-react';
import { UserProfile, BadgeDetail, LessonPlan } from '../types';
import { MOCK_BADGES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../utils/audioUtils';

interface ProfileViewProps {
  user: UserProfile;
  savedPlans: LessonPlan[];
  onOpenPlan: (plan: LessonPlan) => void;
  onLogout?: () => void;
}

const AVATAR_OPTIONS = ['👩‍🏫', '🌸', '🌱', '🌼', '🍎', '✨', '🐣', '🎨'];

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  savedPlans,
  onOpenPlan,
  onLogout,
}) => {
  const {
    isAuthenticated,
    isEmailVerified,
    openAuthModal,
    logout,
    updateProfile,
    changePassword,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'plans' | 'badges' | 'settings'>('plans');

  // Edit profile state
  const [name, setName] = useState(user.name);
  const [school, setSchool] = useState(user.school);
  const [ageGroup, setAgeGroup] = useState(user.ageGroup);
  const [phone, setPhone] = useState(user.phone || '');
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState(user.avatar || '👩‍🏫');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passMsg, setPassMsg] = useState<{ text: string; error: boolean } | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    sounds.playPop();
    const res = await updateProfile({
      name,
      school,
      ageGroup,
      phone,
      bio,
      avatar,
    });
    setIsSavingProfile(false);

    if (res.success) {
      sounds.playSuccess();
      setProfileMsg('Đã lưu thông tin hồ sơ thành công!');
      setTimeout(() => setProfileMsg(null), 3000);
    } else {
      setProfileMsg(res.message || 'Lỗi cập nhật hồ sơ');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    if (newPassword.length < 8) {
      setPassMsg({ text: 'Mật khẩu mới phải có ít nhất 8 ký tự.', error: true });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassMsg({ text: 'Mật khẩu xác nhận chưa trùng khớp.', error: true });
      return;
    }

    setIsChangingPass(true);
    sounds.playPop();
    const res = await changePassword(currentPassword, newPassword);
    setIsChangingPass(false);

    if (res.success) {
      sounds.playSuccess();
      setPassMsg({ text: 'Đổi mật khẩu thành công!', error: false });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassMsg(null), 3000);
    } else {
      setPassMsg({ text: res.message || 'Mật khẩu hiện tại không đúng.', error: true });
    }
  };

  const handleLogoutClick = async () => {
    sounds.playPop();
    await logout();
    if (onLogout) onLogout();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      {/* Guest Mode Banner */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 rounded-3xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-rose-200">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shrink-0">
              🌱
            </div>
            <div>
              <h3 className="font-extrabold text-base font-['Quicksand']">
                Cô chưa đăng nhập tài khoản
              </h3>
              <p className="text-xs text-rose-100 font-medium">
                Đăng nhập hoặc đăng ký để lưu trữ hồ sơ học tập lâu dài, tải video bài học và đồng bộ trên mọi thiết bị.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playPop();
              openAuthModal('login');
            }}
            className="px-5 py-2.5 rounded-2xl bg-white text-rose-600 hover:bg-rose-50 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer hover:scale-102 shrink-0"
          >
            Đăng nhập / Đăng ký ngay
          </button>
        </div>
      )}

      {/* Teacher Profile Card - Warm Terracotta & Caramel Theme */}
      <div className="bg-gradient-to-br from-amber-100/90 via-[#FFF8F0] to-orange-100/80 rounded-3xl p-5 sm:p-7 border border-amber-200/90 shadow-[0_4px_20px_rgba(180,83,9,0.06)]">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 p-1 shadow-md shadow-orange-200">
              <div className="w-full h-full bg-white rounded-[20px] flex items-center justify-center text-4xl shadow-inner">
                {user.avatar || '🌸'}
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-[10px] shadow-xs">
              Lv. 3
            </span>
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight font-['Quicksand']">
                {user.name}
              </h2>
              <span className="text-xs font-black text-orange-800 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                Cô giáo sáng tạo AI
              </span>

              {/* Email Verification Status Pill */}
              {user.email && (
                isEmailVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Đã xác minh email
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      sounds.playPop();
                      openAuthModal('verify');
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-200/80 border border-amber-300 px-2.5 py-0.5 rounded-full hover:bg-amber-300 transition-colors cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                    Chưa xác minh · Nhấn để xác minh
                  </button>
                )
              )}
            </div>

            <p className="text-xs sm:text-sm text-stone-600 font-semibold">
              {user.school || 'Trường mầm non'}
            </p>
            <p className="text-xs text-stone-500 font-medium">
              Phụ trách: <strong className="text-amber-950">{user.ageGroup || 'Chưa chọn'}</strong>
              {user.email && ` · Email: ${user.email}`}
            </p>

            {user.bio && (
              <p className="text-xs text-stone-600 italic font-medium pt-0.5">
                "{user.bio}"
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 rounded-full font-black border border-amber-200/90 shadow-2xs">
                <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500 animate-pulse" />
                <span>Streak: {user.streakDays} ngày</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-800 rounded-full font-black border border-orange-200/90 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>{user.xp} Điểm kinh nghiệm</span>
              </div>
            </div>
          </div>

          {/* Logout button */}
          {isAuthenticated && (
            <div className="pt-2 sm:pt-0">
              <button
                onClick={handleLogoutClick}
                className="px-3.5 py-2 rounded-2xl bg-white/80 hover:bg-rose-50 text-stone-600 hover:text-rose-700 border border-amber-200 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-amber-100 pb-2">
        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('plans');
          }}
          className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'plans'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs'
              : 'text-stone-600 hover:bg-amber-50/60'
          }`}
        >
          📝 Giáo án đã lưu ({savedPlans.length})
        </button>

        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('badges');
          }}
          className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'badges'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs'
              : 'text-stone-600 hover:bg-amber-50/60'
          }`}
        >
          🏆 Huy hiệu thành tích ({MOCK_BADGES.filter((b) => b.unlocked).length})
        </button>

        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('settings');
          }}
          className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs'
              : 'text-stone-600 hover:bg-amber-50/60'
          }`}
        >
          ⚙️ Cài đặt & Đổi mật khẩu
        </button>
      </div>

      {/* TAB 1: SAVED LESSON PLANS */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          {savedPlans.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedPlans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => onOpenPlan(plan)}
                  className="p-5 rounded-3xl bg-white/95 border border-amber-100/90 hover:border-orange-300 shadow-[0_4px_16px_rgba(180,83,9,0.05)] hover:shadow-[0_8px_24px_rgba(234,88,12,0.12)] cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5 font-medium">
                      <span className="font-black text-orange-700">{plan.ageGroup}</span>
                      <span>{plan.createdAt}</span>
                    </div>
                    <h3 className="font-black text-sm sm:text-base text-amber-950 leading-snug font-['Quicksand']">
                      {plan.title}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2 font-medium">
                      Lĩnh vực: {plan.domain} · Thời lượng: {plan.duration}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-amber-100 flex items-center justify-between text-xs font-black text-orange-700">
                    <span>Mở xem chi tiết →</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center bg-white/95 rounded-3xl border border-amber-200/80 space-y-2">
              <MamAiMascot size="md" mood="idle" />
              <p className="text-xs text-stone-500 font-medium">
                Cô chưa lưu giáo án nào. Hãy vào mục Soạn giáo án để tạo và lưu nhé!
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BADGES & GAMIFICATION */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {MOCK_BADGES.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-3xl border transition-all flex items-start gap-3.5 ${
                b.unlocked
                  ? 'bg-white/95 border-amber-200/90 shadow-2xs'
                  : 'bg-stone-50 border-stone-200 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                  b.unlocked ? 'bg-amber-100 border border-amber-200' : 'bg-stone-200'
                }`}
              >
                {b.icon}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-black text-xs sm:text-sm text-amber-950 font-['Quicksand']">
                    {b.name}
                  </h4>
                  {b.unlocked && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed font-medium">
                  {b.description}
                </p>
                {b.unlocked && (
                  <span className="text-[10px] text-stone-400 block pt-1 font-semibold">
                    Đạt được ngày: {b.earnedDate}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: SETTINGS & PASSWORD */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 1: Update Profile Details */}
          <form
            onSubmit={handleSaveProfile}
            className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-amber-200/80 shadow-[0_4px_16px_rgba(180,83,9,0.05)] space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-amber-100 pb-2">
              <User className="w-4 h-4 text-orange-600" />
              <h3 className="font-black text-sm text-amber-950 font-['Quicksand']">
                Thông Tin Hồ Sơ Giáo Viên
              </h3>
            </div>

            {profileMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl">
                {profileMsg}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-amber-950 mb-1">
                  Chọn biểu tượng đại diện (Avatar)
                </label>
                <div className="flex gap-2">
                  {AVATAR_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAvatar(opt)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition-all cursor-pointer ${
                        avatar === opt
                          ? 'border-orange-500 bg-orange-100 scale-110 shadow-xs'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-amber-950 mb-1">
                  Họ và tên giáo viên
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-amber-50/30 border border-amber-200 font-semibold text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-amber-950 mb-1">
                  Trường mầm non đang công tác
                </label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-amber-50/30 border border-amber-200 font-semibold text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block font-bold text-amber-950 mb-1">
                  Nhóm lớp phụ trách
                </label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-amber-50/30 border border-amber-200 font-semibold text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="Nhà trẻ (18–36 tháng)">Nhà trẻ (18–36 tháng)</option>
                  <option value="3–4 tuổi (Lớp Mầm)">3–4 tuổi (Lớp Mầm)</option>
                  <option value="4–5 tuổi (Lớp Chồi)">4–5 tuổi (Lớp Chồi)</option>
                  <option value="5–6 tuổi (Lớp Lá)">5–6 tuổi (Lớp Lá)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-amber-950 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0987xxxxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-amber-50/30 border border-amber-200 font-semibold text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block font-bold text-amber-950 mb-1">
                  Lời giới thiệu / Tiểu sử ngắn
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  placeholder="Chia sẻ đôi điều về phương châm giáo dục của cô..."
                  className="w-full px-3.5 py-2 rounded-xl bg-amber-50/30 border border-amber-200 font-medium text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs cursor-pointer hover:scale-102 active:scale-95 shadow-2xs flex items-center gap-1.5"
              >
                {isSavingProfile ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Lưu thông tin</span>
              </button>
            </div>
          </form>

          {/* Box 2: Change Password & Security */}
          <form
            onSubmit={handleChangePassword}
            className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-amber-200/80 shadow-[0_4px_16px_rgba(180,83,9,0.05)] space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-amber-100 pb-2">
              <KeyRound className="w-4 h-4 text-orange-600" />
              <h3 className="font-black text-sm text-amber-950 font-['Quicksand']">
                Bảo Mật & Đổi Mật Khẩu
              </h3>
            </div>

            {passMsg && (
              <div
                className={`p-3 border text-xs font-semibold rounded-2xl ${
                  passMsg.error
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}
              >
                {passMsg.text}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-amber-950 mb-1">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-amber-50/30 border border-amber-200 font-semibold text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-amber-950 mb-1">
                  Mật khẩu mới (tối thiểu 8 ký tự)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-amber-50/30 border border-amber-200 font-semibold text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-amber-950 mb-1">
                  Xác nhận lại mật khẩu mới
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-amber-50/30 border border-amber-200 font-semibold text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isChangingPass}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs cursor-pointer hover:scale-102 active:scale-95 shadow-2xs flex items-center gap-1.5"
              >
                {isChangingPass ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
                <span>Cập nhật mật khẩu</span>
              </button>
            </div>

            {/* Email verification reminder in settings */}
            {!isEmailVerified && user.email && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center justify-between">
                <span>Email chưa xác minh</span>
                <button
                  type="button"
                  onClick={() => openAuthModal('verify')}
                  className="font-bold text-orange-700 underline cursor-pointer"
                >
                  Xác minh ngay
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
