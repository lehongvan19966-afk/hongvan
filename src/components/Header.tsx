import React from 'react';
import { MamAiMascot } from './MamAiMascot';
import { Bell, Flame, Search, ShieldCheck, UserCheck, Share2 } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  streakDays: number;
  userName: string;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenShare?: () => void;
  unreadCount?: number;
  isAuthenticated?: boolean;
  isEmailVerified?: boolean;
  onOpenAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  userRole,
  onRoleChange,
  streakDays,
  userName,
  onOpenSearch,
  onOpenNotifications,
  onOpenShare,
  unreadCount = 2,
  isAuthenticated = false,
  isEmailVerified = false,
  onOpenAuth,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/92 backdrop-blur-xl border-b border-amber-100/90 shadow-[0_4px_20px_rgba(154,52,18,0.04)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Zone 1: Brand & Logo */}
        <div
          onClick={() => onTabChange('home')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 p-0.5 shadow-sm shadow-orange-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
              <MamAiMascot size="sm" mood="happy" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-amber-900 via-orange-700 to-amber-600 bg-clip-text text-transparent font-['Quicksand']">
                VƯỜN ƯƠM AI
              </span>
              <span className="hidden sm:inline-block text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Mầm non
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-stone-500 font-medium">
              Cô học AI · Bé học vui · Cộng đồng lan tỏa
            </p>
          </div>
        </div>

        {/* Zone 2: Desktop Navigation Links (Island Pills) */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
          {[
            { id: 'home', label: 'Trang chủ' },
            { id: 'ai-assistant', label: '🤖 Trợ lý AI mầm non' },
            { id: 'interactive-games', label: 'Kho game tương tác' },
            { id: 'academy', label: 'Hướng dẫn học AI' },
            { id: 'daily-practice', label: 'Luyện AI' },
            { id: 'lesson-studio', label: 'Soạn giáo án' },
            { id: 'english-buddy', label: 'English Buddy' },
            { id: 'story-poem-creator', label: 'Tạo thơ truyện AI' },
            { id: 'be-vui-hoc', label: '🎨 Bé vui học' },
            { id: 'teaching-pack', label: 'Tủ tài liệu' },
            { id: 'library', label: 'Kho học liệu' },
            { id: 'community', label: 'Cộng đồng' },
          ].map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-3 py-1.5 rounded-2xl text-xs xl:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-orange-100/80 text-orange-950 shadow-2xs border border-orange-200/90 scale-102'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions, Streak & User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Global Search trigger */}
          <button
            onClick={onOpenSearch}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl text-stone-600 hover:text-stone-900 hover:bg-amber-50 active:scale-95 transition-all"
            title="Tìm kiếm toàn bộ app"
            aria-label="Tìm kiếm"
          >
            <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-stone-600" />
          </button>

          {/* Learning Streak Counter */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-full text-xs font-bold shadow-2xs"
            title="Chuỗi ngày học AI liên tục"
          >
            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500 animate-pulse" />
            <span className="tabular-nums">{streakDays} ngày</span>
          </div>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl text-stone-600 hover:text-stone-900 hover:bg-amber-50 active:scale-95 transition-all"
            aria-label="Thông báo"
          >
            <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-600 ring-2 ring-white" />
            )}
          </button>

          {/* Cross-Platform Share App & Data */}
          {onOpenShare && (
            <button
              onClick={onOpenShare}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black text-orange-950 bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 border border-orange-300 shadow-2xs active:scale-95 transition-all cursor-pointer font-['Quicksand']"
              title="Lấy đường link xem trên điện thoại & máy tính (kèm mã QR)"
              aria-label="Lấy link & mã QR"
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-700 shrink-0" />
              <span className="hidden sm:inline">Lấy link / Quét QR</span>
              <span className="sm:hidden">Lấy link</span>
            </button>
          )}

          {/* Role selector dropdown / pill */}
          <div className="hidden sm:flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200/70 text-xs font-semibold">
            <button
              onClick={() => onRoleChange('teacher')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                userRole === 'teacher'
                  ? 'bg-white text-orange-800 shadow-2xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              👩‍🏫 Cô giáo
            </button>
            <button
              onClick={() => onRoleChange('parent')}
              className={`px-2 py-1 rounded-lg transition-all ${
                userRole === 'parent'
                  ? 'bg-white text-amber-800 shadow-2xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              👨‍👩‍👧 Phụ huynh
            </button>
            <button
              onClick={() => onRoleChange('kid')}
              className={`px-2 py-1 rounded-lg transition-all ${
                userRole === 'kid'
                  ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              👶 Bé vui
            </button>
          </div>

          {/* Profile Avatar or Login button */}
          {isAuthenticated ? (
            <button
              onClick={() => onTabChange('profile')}
              className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full hover:bg-orange-50 border border-transparent hover:border-orange-200 transition-all active:scale-95 cursor-pointer"
              title="Hồ sơ tài khoản"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-200 to-orange-300 flex items-center justify-center text-sm shadow-2xs border border-white">
                  🌸
                </div>
                {isEmailVerified && (
                  <span
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[8px] font-black border border-white"
                    title="Email đã xác minh"
                  >
                    ✓
                  </span>
                )}
              </div>
              <span className="hidden sm:inline-block text-xs font-bold text-stone-700 max-w-[80px] truncate">
                {userName}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-black shadow-xs hover:shadow-md hover:scale-102 active:scale-95 transition-all cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
