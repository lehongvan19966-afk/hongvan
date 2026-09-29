import React, { useState } from 'react';
import { MamAiMascot } from '../components/MamAiMascot';
import {
  Wand2,
  Sparkles,
  Gamepad2,
  HelpCircle,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { sounds } from '../utils/audioUtils';

interface MagicLearningViewProps {
  onNavigateToPack?: () => void;
}

export const MagicLearningView: React.FC<MagicLearningViewProps> = () => {
  const [inputText, setInputText] = useState(
    'Quả cam hình tròn, màu vàng cam khi chín. Vỏ sần sùi có tinh dầu thơm. Bên trong có nhiều múi mọng nước, vị ngọt thanh mát, giàu vitamin C giúp bé khỏe khoắn.'
  );
  const [targetType, setTargetType] = useState<
    'quiz' | 'flashcard' | 'game' | 'dialogue'
  >('game');
  const [ageGroup, setAgeGroup] = useState('4–5 tuổi (Lớp Chồi)');
  const [isGenerating, setIsGenerating] = useState(false);

  // Interactive Game Preview state (Matching colors / objects)
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [selectedItem, setSelectedItem] = useState<{ id: number; color: string } | null>(null);

  const gameItems = [
    { id: 1, name: 'Quả cam chín', color: 'orange', icon: '🍊' },
    { id: 2, name: 'Quả dâu tây', color: 'red', icon: '🍓' },
    { id: 3, name: 'Quả chuối vàng', color: 'yellow', icon: '🍌' },
  ];

  const colorBaskets = [
    { color: 'yellow', label: 'Giỏ Màu Vàng', bg: 'bg-amber-100 border-amber-300 text-amber-900' },
    { color: 'orange', label: 'Giỏ Màu Cam', bg: 'bg-orange-100 border-orange-300 text-orange-950' },
    { color: 'red', label: 'Giỏ Màu Đỏ', bg: 'bg-rose-100 border-rose-300 text-rose-950' },
  ];

  const handleSelectFruit = (item: { id: number; color: string }) => {
    sounds.playPop();
    setSelectedItem(item);
  };

  const handleSelectBasket = (color: string) => {
    if (!selectedItem) return;
    if (selectedItem.color === color) {
      sounds.playSuccess();
      setMatchedPairs((prev) => [...prev, selectedItem.id]);
      setSelectedItem(null);
    } else {
      sounds.playRetry();
    }
  };

  const resetGame = () => {
    sounds.playPop();
    setMatchedPairs([]);
    setSelectedItem(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      {/* Top Banner - Warm Terracotta Theme */}
      <div className="bg-gradient-to-r from-amber-100/90 via-[#FFF8F0] to-orange-100/80 rounded-3xl p-5 sm:p-7 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(180,83,9,0.06)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-orange-700 text-xs font-black mb-2 shadow-2xs border border-orange-200">
            <Wand2 className="w-3.5 h-3.5 text-orange-600" />
            <span>AI Magic Learning · Biến Mọi Tài Liệu Thành Học Liệu Vui</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight font-['Quicksand']">
            Tạo Trò Chơi, Quiz & Flashcard Từ Văn Bản Hoặc Ảnh
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
            Chỉ cần dán truyện, thơ hoặc tải file lên · AI tự động sinh trò chơi tương tác mầm non
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <MamAiMascot size="lg" mood="teaching" />
        </div>
      </div>

      {/* Input Section - Island Container */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-7 border border-amber-200/80 shadow-[0_4px_16px_rgba(180,83,9,0.05)] space-y-4">
        <div>
          <label className="block text-xs font-bold text-amber-950 mb-1.5">
            Dán nội dung truyện, thơ hoặc kiến thức bài học:
          </label>
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Dán câu chuyện mầm non, bài thơ hoặc đoạn giới thiệu chủ đề..."
            className="w-full px-3.5 py-3 rounded-2xl bg-amber-50/30 border border-amber-200 text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-amber-950 mb-1.5">
              Cô muốn AI tạo dạng học liệu nào?
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'game', label: '🎮 Trò chơi kéo thả', desc: 'Phân loại màu & hình' },
                { id: 'quiz', label: '❓ Quiz nhận biết', desc: 'Có âm thanh & khen ngợi' },
                { id: 'flashcard', label: '🃏 Bộ Flashcard 3D', desc: 'Mặt trước - mặt sau' },
                { id: 'dialogue', label: '💬 Câu hỏi gợi mở', desc: 'Đàm thoại tư duy' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setTargetType(item.id as unknown as typeof targetType);
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    targetType === item.id
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-orange-600 shadow-sm'
                      : 'bg-amber-50/40 hover:bg-orange-50/70 border-amber-200/80 text-stone-800'
                  }`}
                >
                  <span className="font-black block font-['Quicksand']">{item.label}</span>
                  <span
                    className={`text-[10px] block font-medium ${
                      targetType === item.id ? 'text-amber-100' : 'text-stone-400'
                    }`}
                  >
                    {item.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-950 mb-1.5">
              Độ tuổi của trẻ
            </label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200 text-xs sm:text-sm font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
            >
              <option value="18–36 tháng (Nhà trẻ)">18–36 tháng (Nhà trẻ)</option>
              <option value="3–4 tuổi (Lớp Mầm)">3–4 tuổi (Lớp Mầm)</option>
              <option value="4–5 tuổi (Lớp Chồi)">4–5 tuổi (Lớp Chồi)</option>
              <option value="5–6 tuổi (Lớp Lá)">5–6 tuổi (Lớp Lá)</option>
            </select>

            <div className="mt-4 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  sounds.playSuccess();
                  resetGame();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>✨ Tạo học liệu thông minh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Game Builder Preview */}
      <div className="bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50 rounded-3xl p-5 sm:p-7 border border-amber-200/90 shadow-[0_4px_16px_rgba(180,83,9,0.05)] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-amber-100">
          <div className="flex items-center gap-2.5">
            <Gamepad2 className="w-6 h-6 text-orange-600" />
            <div>
              <h3 className="text-base sm:text-lg font-black text-amber-950 font-['Quicksand']">
                Template Trò Chơi Mầm Non: "Bé Phân Loại Quả Vào Đúng Giỏ Màu"
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Chạm vào quả → Chạm vào giỏ màu tương ứng (Có âm thanh khen ngợi khi làm đúng!)
              </p>
            </div>
          </div>

          <button
            onClick={resetGame}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-600 border border-amber-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Chơi lại</span>
          </button>
        </div>

        {/* Game Arena */}
        <div className="space-y-6">
          {/* Fruits to pick */}
          <div>
            <span className="text-xs font-black text-amber-950 block mb-2 text-center sm:text-left font-['Quicksand']">
              BƯỚC 1: Chọn một quả bé thích:
            </span>
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto sm:mx-0">
              {gameItems.map((item) => {
                const isMatched = matchedPairs.includes(item.id);
                const isSelected = selectedItem?.id === item.id;

                return (
                  <button
                    key={item.id}
                    disabled={isMatched}
                    onClick={() => handleSelectFruit(item)}
                    className={`p-3 sm:p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                      isMatched
                        ? 'bg-emerald-50 border-emerald-200 opacity-40 cursor-not-allowed scale-95'
                        : isSelected
                        ? 'bg-amber-100 border-orange-400 ring-4 ring-orange-200 scale-105 shadow-sm'
                        : 'bg-white hover:bg-amber-50/50 border-amber-200/80 hover:scale-102 shadow-2xs'
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl block">{item.icon}</span>
                    <span className="font-black text-xs text-stone-800 block mt-1 font-['Quicksand']">
                      {item.name}
                    </span>
                    {isMatched && (
                      <span className="text-[10px] text-emerald-700 font-black block mt-0.5">
                        ✓ Đã đúng
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Baskets to place into */}
          <div>
            <span className="text-xs font-black text-amber-950 block mb-2 text-center sm:text-left font-['Quicksand']">
              BƯỚC 2: Chạm vào giỏ màu đúng:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {colorBaskets.map((basket) => (
                <button
                  key={basket.color}
                  onClick={() => handleSelectBasket(basket.color)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${basket.bg} hover:scale-102 active:scale-95 shadow-2xs`}
                >
                  <span className="text-2xl">🧺</span>
                  <span className="font-black text-xs sm:text-sm tracking-tight font-['Quicksand']">
                    {basket.label}
                  </span>
                  <span className="text-[11px] opacity-80 font-medium">
                    Bấm để bỏ quả vào đây
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Victory Message when all matched */}
          {matchedPairs.length === gameItems.length && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-bounce">
              <span className="text-3xl">🎉 🏆 🌸</span>
              <h4 className="font-black text-emerald-950 text-sm sm:text-base font-['Quicksand']">
                BÉ GIỎI QUÁ! BÉ ĐÃ PHÂN LOẠI ĐÚNG HẾT TẤT CẢ CÁC QUẢ VÀO GIỎ!
              </h4>
              <p className="text-xs text-emerald-800 font-medium">
                Cô có thể tải file template này về để chiếu trên bảng tương tác thông minh tại lớp!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
