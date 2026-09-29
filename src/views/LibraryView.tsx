import React, { useState } from 'react';
import { MamAiMascot } from '../components/MamAiMascot';
import {
  FolderHeart,
  Search,
  CheckCircle2,
  Sparkles,
  Bot,
  Heart,
  Share2,
} from 'lucide-react';
import { ResourceItem } from '../types';
import { sounds } from '../utils/audioUtils';
import { ExportShareModal } from '../components/ExportShareModal';

interface LibraryViewProps {
  resources: ResourceItem[];
  onOpenResource: (item: ResourceItem) => void;
  onCreateNew: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  resources,
  onOpenResource,
  onCreateNew,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [resourceList, setResourceList] = useState<ResourceItem[]>(resources);
  const [sharingResource, setSharingResource] = useState<ResourceItem | null>(null);

  // "Hỏi Kho AI" Chatbot state
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiSearchResultMessage, setAiSearchResultMessage] = useState<string | null>(null);

  // "Đã áp dụng tại lớp" feedback modal state
  const [appliedModalItem, setAppliedModalItem] = useState<ResourceItem | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [showAppliedToast, setShowAppliedToast] = useState(false);

  // Filter Categories
  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'lesson_plan', label: '📝 Giáo án' },
    { id: 'video', label: '🎥 Video bài giảng' },
    { id: 'story', label: '📖 Truyện & Thơ' },
    { id: 'flashcard', label: '🃏 Flashcard 3D' },
    { id: 'game', label: '🎮 Trò chơi' },
    { id: 'english', label: '🌎 English Buddy' },
  ];

  const filteredResources = resourceList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesAge = selectedAge === 'all' || item.ageGroup.includes(selectedAge);

    return matchesSearch && matchesType && matchesAge;
  });

  const handleAiSearch = () => {
    if (!aiSearchQuery.trim()) return;
    sounds.playPop();
    setIsAiSearching(true);
    setAiSearchResultMessage(null);

    setTimeout(() => {
      setIsAiSearching(false);
      const query = aiSearchQuery.toLowerCase();
      // Natural language matching in existing database
      const found = resourceList.filter(
        (r) =>
          (query.includes('cam') && r.title.toLowerCase().includes('cam')) ||
          (query.includes('mẹ') && r.title.toLowerCase().includes('mẹ')) ||
          (query.includes('giao thông') && r.title.toLowerCase().includes('giao thông'))
      );

      if (found.length > 0) {
        sounds.playSuccess();
        setAiSearchResultMessage(
          `Tìm thấy ${found.length} học liệu phù hợp chính xác trong kho của cô! ✨`
        );
        setResourceList(found);
      } else {
        sounds.playRetry();
        setAiSearchResultMessage(
          `Kho chưa có nội dung đúng chuẩn với yêu cầu "${aiSearchQuery}". Cô có muốn AI hỗ trợ tạo mới ngay không?`
        );
      }
    }, 1200);
  };

  const handleApplyClassroom = (item: ResourceItem) => {
    sounds.playPop();
    setAppliedModalItem(item);
  };

  const submitAppliedFeedback = () => {
    if (!appliedModalItem) return;
    sounds.playSuccess();

    setResourceList((prev) =>
      prev.map((r) =>
        r.id === appliedModalItem.id
          ? { ...r, appliedCount: r.appliedCount + 1 }
          : r
      )
    );
    setAppliedModalItem(null);
    setShowAppliedToast(true);
    setTimeout(() => setShowAppliedToast(false), 3000);
  };

  const toggleFavorite = (id: string) => {
    sounds.playPop();
    setResourceList((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, isFavorite: !r.isFavorite, likes: r.isFavorite ? r.likes - 1 : r.likes + 1 }
          : r
      )
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      {/* Top Banner - Warm Terracotta Theme */}
      <div className="bg-gradient-to-r from-amber-100/90 via-[#FFF8F0] to-orange-100/80 rounded-3xl p-5 sm:p-7 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(180,83,9,0.06)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-orange-700 text-xs font-black mb-2 shadow-2xs border border-orange-200">
            <FolderHeart className="w-3.5 h-3.5 text-orange-600" />
            <span>Kho Báu Của Cô · Thư Viện Học Liệu Mầm Non</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight font-['Quicksand']">
            Hàng Trăm Giáo Án & Học Liệu Tuyển Chọn
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
            Được giáo viên mầm non cả nước chia sẻ, xác thực hiệu quả tại lớp học thực tế
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xs shadow-md shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>+ Tạo học liệu mới</span>
        </button>
      </div>

      {/* "HỎI KHO AI" NATURAL LANGUAGE SEARCH BOX */}
      <div className="bg-gradient-to-br from-amber-50/70 via-white to-orange-50/60 rounded-3xl p-4 sm:p-5 border border-amber-200/90 shadow-[0_4px_16px_rgba(180,83,9,0.05)] space-y-3">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-orange-600" />
          <h3 className="font-black text-xs sm:text-sm text-amber-950 font-['Quicksand']">
            Hỏi Kho AI (Tìm kiếm bằng ngôn ngữ tự nhiên)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={aiSearchQuery}
            onChange={(e) => setAiSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
            placeholder="Ví dụ: 'Tìm cho tôi hoạt động cho trẻ 3 tuổi chủ đề mẹ, có thơ và tiếng Anh'..."
            className="flex-1 px-3.5 py-2.5 rounded-2xl bg-white border border-amber-200 text-xs sm:text-sm text-amber-950 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 font-medium"
          />
          <button
            onClick={handleAiSearch}
            disabled={isAiSearching}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs shadow-xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer hover:scale-102 active:scale-95"
          >
            {isAiSearching ? 'Đang tìm...' : 'Hỏi Kho AI'}
          </button>
        </div>

        {aiSearchResultMessage && (
          <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs flex items-center justify-between gap-3 animate-fadeIn">
            <span className="text-stone-700 font-medium">{aiSearchResultMessage}</span>
            {aiSearchResultMessage.includes('chưa có nội dung') && (
              <button
                onClick={onCreateNew}
                className="px-3 py-1 bg-orange-600 text-white font-black rounded-lg whitespace-nowrap hover:bg-orange-700 transition-colors cursor-pointer"
              >
                Tạo mới ngay ✨
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/95 rounded-3xl p-4 border border-amber-200/80 shadow-[0_4px_16px_rgba(180,83,9,0.05)] space-y-3">
        {/* Search Input & Age select */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên học liệu, chủ đề (Quả cam, Gia đình, Động vật...)"
              className="w-full pl-9 pr-3.5 py-2 rounded-2xl bg-amber-50/30 border border-amber-200/80 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white text-stone-800"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedAge}
              onChange={(e) => setSelectedAge(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-2xl bg-amber-50/30 border border-amber-200/80 text-xs font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
            >
              <option value="all">Tất cả độ tuổi</option>
              <option value="Nhà trẻ">18–36 tháng</option>
              <option value="Mầm">3–4 tuổi (Lớp Mầm)</option>
              <option value="Chồi">4–5 tuổi (Lớp Chồi)</option>
              <option value="Lá">5–6 tuổi (Lớp Lá)</option>
            </select>
          </div>
        </div>

        {/* Type Category Tabs (Islands) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                sounds.playPop();
                setSelectedType(c.id);
              }}
              className={`px-3 py-1.5 rounded-xl font-black whitespace-nowrap transition-all cursor-pointer ${
                selectedType === c.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-2xs'
                  : 'bg-amber-50/60 hover:bg-orange-100/60 text-stone-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid (Hòn đảo học liệu) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((item) => (
          <div
            key={item.id}
            className="group bg-white/95 rounded-3xl p-5 border border-amber-100/90 hover:border-orange-300 shadow-[0_4px_16px_rgba(180,83,9,0.05)] hover:shadow-[0_8px_24px_rgba(234,88,12,0.12)] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Meta Header */}
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-orange-800">{item.ageGroup.split('(')[0]}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-stone-600">{item.domain}</span>
                </div>
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className={`p-1 rounded-full transition-transform active:scale-90 cursor-pointer ${
                    item.isFavorite ? 'text-orange-600 fill-orange-600' : 'text-stone-300 hover:text-orange-500'
                  }`}
                  aria-label="Yêu thích"
                >
                  <Heart className={`w-4 h-4 ${item.isFavorite ? 'fill-orange-600' : ''}`} />
                </button>
              </div>

              {/* Title */}
              <h3
                onClick={() => onOpenResource(item)}
                className="font-black text-sm sm:text-base text-amber-950 group-hover:text-orange-600 cursor-pointer transition-colors leading-snug font-['Quicksand']"
              >
                {item.title}
              </h3>

              <p className="text-xs text-stone-600 mt-1.5 line-clamp-2 leading-relaxed font-medium">
                {item.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {item.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] text-stone-600 bg-amber-50/50 px-2 py-0.5 rounded-md border border-amber-100 font-semibold"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions & Classroom Applied Badge */}
            <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-xs">
              <button
                onClick={() => handleApplyClassroom(item)}
                className="text-[11px] font-black text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-xl border border-emerald-200 transition-all flex items-center gap-1 cursor-pointer"
                title="Bấm để xác nhận cô đã áp dụng tại lớp"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{item.appliedCount} lớp đã dùng</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    sounds.playPop();
                    setSharingResource(item);
                  }}
                  className="p-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 transition-colors cursor-pointer"
                  title="Xuất & Chia sẻ (Điện thoại & Máy tính)"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onOpenResource(item)}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-orange-100/70 text-orange-900 font-black text-xs border border-amber-200 transition-colors cursor-pointer"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="p-12 text-center bg-white/95 rounded-3xl border border-amber-200 space-y-3">
          <MamAiMascot size="lg" mood="thinking" />
          <h3 className="font-black text-amber-950 text-sm font-['Quicksand']">
            Kho của cô đang chờ những học liệu đầu tiên theo từ khóa này.
          </h3>
          <button
            onClick={onCreateNew}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs cursor-pointer shadow-md"
          >
            + Tạo học liệu bằng AI
          </button>
        </div>
      )}

      {/* Applied Feedback Modal */}
      {appliedModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-amber-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-amber-950 text-base font-['Quicksand']">
                  Tôi Đã Dùng Tài Liệu Này Tại Lớp
                </h3>
              </div>
              <button
                onClick={() => setAppliedModalItem(null)}
                className="text-stone-400 hover:text-stone-600 font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-stone-600 space-y-1 font-medium">
              <p className="font-black text-amber-950">{appliedModalItem.title}</p>
              <p>Phản hồi của cô giúp cộng đồng giáo viên mầm non hoàn thiện học liệu tốt hơn!</p>
            </div>

            {/* Rating Stars */}
            <div>
              <label className="block text-xs font-bold text-amber-950 mb-1.5">
                Mức độ hứng thú của các bé:
              </label>
              <div className="flex items-center gap-2 text-2xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    className="hover:scale-125 transition-transform cursor-pointer"
                  >
                    {star <= feedbackRating ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-950 mb-1">
                Góp ý thực tế từ giờ dạy tại lớp:
              </label>
              <textarea
                rows={3}
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                placeholder="Ví dụ: Trẻ rất thích trò chơi chuyền cam, phần đàm thoại nên cho trẻ sờ thêm vỏ..."
                className="w-full px-3.5 py-2 rounded-2xl bg-amber-50/30 border border-amber-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAppliedModalItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={submitAppliedFeedback}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-md cursor-pointer"
              >
                Xác nhận đã áp dụng ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showAppliedToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-700 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>Đã ghi nhận! Cảm ơn cô đã lan tỏa giờ học vui tới các bé! 💖</span>
        </div>
      )}

      {/* Cross-Device Export & Share Modal (Phone & Desktop) */}
      {sharingResource && (
        <ExportShareModal
          isOpen={!!sharingResource}
          onClose={() => setSharingResource(null)}
          item={{
            id: String(sharingResource.id),
            type: sharingResource.type === 'lesson_plan' ? 'lesson_plan' : sharingResource.type === 'video' ? 'video' : 'teaching_pack',
            title: sharingResource.title,
            subtitle: `${sharingResource.ageGroup} • ${sharingResource.domain}`,
            author: sharingResource.author,
            school: sharingResource.school,
            data: sharingResource,
          }}
        />
      )}
    </div>
  );
};
