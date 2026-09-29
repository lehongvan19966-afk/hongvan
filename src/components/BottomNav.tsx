import React from 'react';
import { Home, GraduationCap, Wand2, FolderHeart, User } from 'lucide-react';
import { sounds } from '../utils/audioUtils';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const navItems = [
    {
      id: 'home',
      label: 'Trang chủ',
      icon: Home,
      badge: null,
    },
    {
      id: 'academy',
      label: 'Học AI',
      icon: GraduationCap,
      badge: 'HOT',
    },
    {
      id: 'create-hub',
      label: 'Tạo với AI',
      icon: Wand2,
      badge: 'AI',
      isCenter: true,
    },
    {
      id: 'library',
      label: 'Kho học liệu',
      icon: FolderHeart,
      badge: null,
    },
    {
      id: 'profile',
      label: 'Của tôi',
      icon: User,
      badge: null,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-amber-100/90 rounded-t-[28px] shadow-[0_-4px_24px_rgba(180,83,9,0.07)] transition-all duration-300"
      aria-label="Thanh điều hướng chính"
    >
      <div className="max-w-xl mx-auto px-3 sm:px-6 pt-2 pb-3 sm:pb-4">
        <ul className="flex items-center justify-between gap-1.5 sm:gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id} className="flex-1 text-center">
                <button
                  onClick={() => {
                    sounds.playPop();
                    onSelectTab(item.id);
                  }}
                  className={`group w-full flex flex-col items-center justify-center py-1.5 px-1 sm:px-2 rounded-2xl transition-all duration-250 cursor-pointer select-none relative ${
                    isActive
                      ? 'bg-gradient-to-b from-amber-50 to-orange-100/70 border border-amber-200/80 shadow-[0_2px_8px_rgba(217,119,6,0.12)]'
                      : 'hover:bg-amber-50/50 active:scale-95'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Miniature cute island container */}
                  <div className="relative flex flex-col items-center">
                    {/* Badge if present */}
                    {item.badge && (
                      <span
                        className={`absolute -top-1.5 -right-3 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider shadow-2xs ${
                          isActive
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Icon on Top */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white shadow-[0_4px_10px_rgba(234,88,12,0.35)] scale-108'
                          : 'text-stone-500 group-hover:text-amber-700 group-hover:scale-105'
                      }`}
                    >
                      <Icon className="w-5 h-5 stroke-[2.3]" />
                    </div>

                    {/* Function Label Below */}
                    <span
                      className={`text-[11px] sm:text-xs font-extrabold mt-1 tracking-tight transition-colors duration-200 whitespace-nowrap ${
                        isActive ? 'text-amber-950 font-black' : 'text-stone-500 group-hover:text-amber-900'
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Active Warm Indicator Dot */}
                    {isActive && (
                      <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-0.5 animate-pulse" />
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
