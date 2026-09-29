import React from 'react';
import { MamAiMascot } from '../components/MamAiMascot';
import {
  TrendingUp,
  Clock,
  Users,
  BookOpen,
  Award,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const ImpactDashboardView: React.FC = () => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-20">
      {/* Top Header - Warm Terracotta */}
      <div className="bg-gradient-to-r from-amber-100/90 via-[#FFF8F0] to-orange-100/80 rounded-3xl p-5 sm:p-7 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(180,83,9,0.06)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-orange-700 text-xs font-black mb-2 shadow-2xs border border-orange-200">
            <TrendingUp className="w-3.5 h-3.5 text-orange-600" />
            <span>Đo Lường Hiệu Quả & Tác Động Sư Phạm</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight font-['Quicksand']">
            Dashboard Tác Động Cộng Đồng Vườn Ươm AI
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
            Minh chứng năng lực tiết kiệm thời gian cho giáo viên & lan tỏa giờ học chất lượng tới trẻ
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <MamAiMascot size="lg" mood="celebrate" />
        </div>
      </div>

      {/* 4 Big Impact Metric Cards (Hòn đảo số liệu) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white/95 p-5 rounded-3xl border border-amber-200/80 shadow-[0_4px_16px_rgba(180,83,9,0.05)] space-y-1">
          <span className="text-xs font-bold text-stone-500">Giáo án AI đã tạo</span>
          <div className="text-2xl sm:text-3xl font-black text-orange-600 font-mono">
            3,480+
          </div>
          <span className="text-[11px] text-emerald-700 font-bold block">
            ↑ +24% trong tháng này
          </span>
        </div>

        <div className="bg-white/95 p-5 rounded-3xl border border-amber-200/80 shadow-[0_4px_16px_rgba(180,83,9,0.05)] space-y-1">
          <span className="text-xs font-bold text-stone-500">Giờ dạy thực tế</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-800 font-mono">
            1,245
          </div>
          <span className="text-[11px] text-stone-500 block font-medium">
            Lớp học đã áp dụng
          </span>
        </div>

        <div className="bg-white/95 p-5 rounded-3xl border border-amber-200/80 shadow-[0_4px_16px_rgba(180,83,9,0.05)] space-y-1">
          <span className="text-xs font-bold text-stone-500">Thời gian tiết kiệm</span>
          <div className="text-2xl sm:text-3xl font-black text-orange-700 font-mono">
            3.5 giờ
          </div>
          <span className="text-[11px] text-stone-500 block font-medium">
            Trung bình / giáo viên / tuần
          </span>
        </div>

        <div className="bg-white/95 p-5 rounded-3xl border border-amber-200/80 shadow-[0_4px_16px_rgba(180,83,9,0.05)] space-y-1">
          <span className="text-xs font-bold text-stone-500">Trẻ em được tiếp cận</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-900 font-mono">
            28,900+
          </div>
          <span className="text-[11px] text-stone-500 block font-medium">
            Tại các trường mầm non
          </span>
        </div>
      </div>

      {/* DÒNG CHẢY LAN TỎA SƯ PHẠM (INFOGRAPHIC) */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-7 border border-amber-200/80 shadow-[0_4px_16px_rgba(180,83,9,0.05)] space-y-5">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-black text-amber-950 font-['Quicksand'] flex items-center gap-2">
            <span>Dòng Chảy Lan Tỏa Giáo Dục Mầm Non</span>
            <span className="text-xs font-black text-orange-800 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
              Mô hình cấp số nhân
            </span>
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            Từ 1 hạt mầm sáng tạo của cô giáo ban đầu đến hàng trăm nụ cười hạnh phúc của trẻ thơ
          </p>
        </div>

        {/* 4 Flow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/70 border border-amber-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white font-black text-lg mx-auto flex items-center justify-center shadow-xs">
              1
            </div>
            <h4 className="font-black text-sm text-amber-950 font-['Quicksand']">1 Giáo Viên</h4>
            <p className="text-xs text-stone-600 font-medium">
              Soạn giáo án hoặc bộ thẻ flashcard 3D bằng công cụ AI
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50/70 border border-amber-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-600 text-white font-black text-lg mx-auto flex items-center justify-center shadow-xs">
              25
            </div>
            <h4 className="font-black text-sm text-amber-950 font-['Quicksand']">25 Đồng Nghiệp Học</h4>
            <p className="text-xs text-stone-600 font-medium">
              Đọc tham khảo, học prompt mẫu và tải file về máy
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/70 border border-amber-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-700 text-white font-black text-lg mx-auto flex items-center justify-center shadow-xs">
              18
            </div>
            <h4 className="font-black text-sm text-amber-950 font-['Quicksand']">18 Lớp Áp Dụng</h4>
            <p className="text-xs text-stone-600 font-medium">
              Đưa vào giảng dạy thực tế, bấm nút xác nhận và đóng góp phản hồi
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50/70 border border-amber-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-800 text-white font-black text-lg mx-auto flex items-center justify-center shadow-xs">
              420+
            </div>
            <h4 className="font-black text-sm text-amber-950 font-['Quicksand']">420 Trẻ Tiếp Cận</h4>
            <p className="text-xs text-stone-600 font-medium">
              Trải nghiệm học bằng chơi, khám phá đa giác quan và tiếng Anh vui tươi
            </p>
          </div>
        </div>

        <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/80 text-[11px] text-stone-500 text-center font-medium">
          * Dữ liệu thống kê tác động giáo dục của hệ sinh thái Vườn Ươm AI trên toàn quốc.
        </div>
      </div>
    </div>
  );
};
