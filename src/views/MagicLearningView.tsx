import React, { useState } from 'react';
import { MamAiMascot } from '../components/MamAiMascot';
import { LuckyWheelGame } from '../components/games/LuckyWheelGame';
import { SmartSortGame } from '../components/games/SmartSortGame';
import { BubblePopGame } from '../components/games/BubblePopGame';
import { MemoryMatchGame } from '../components/games/MemoryMatchGame';
import { SpeedQuizGame } from '../components/games/SpeedQuizGame';
import { WhackBallGame } from '../components/games/WhackBallGame';
import { SecretDoorsGame } from '../components/games/SecretDoorsGame';
import { ClawMachineGame } from '../components/games/ClawMachineGame';
import { TargetThrowGame } from '../components/games/TargetThrowGame';
import { KnowledgeTrainGame } from '../components/games/KnowledgeTrainGame';
import { GameQuestionManager } from '../components/games/GameQuestionManager';
import { DEFAULT_GAME_QUESTIONS } from '../data/defaultGameQuestions';
import { GameQuestion, InteractiveGameMode } from '../types/interactiveGame';
import {
  Wand2,
  Sparkles,
  Gamepad2,
  Volume2,
  VolumeX,
  FileText,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Smile,
} from 'lucide-react';
import { sounds, speakText, speakGirlPraise } from '../utils/audioUtils';

interface MagicLearningViewProps {
  onNavigateToPack?: () => void;
  initialTab?: InteractiveGameMode | 'text-generator';
  initialOpenQuestions?: boolean;
}

export const MagicLearningView: React.FC<MagicLearningViewProps> = ({
  onNavigateToPack,
  initialTab = 'lucky-wheel',
  initialOpenQuestions = false,
}) => {
  const [activeTab, setActiveTab] = useState<InteractiveGameMode | 'text-generator'>(initialTab);
  const [questions, setQuestions] = useState<GameQuestion[]>(DEFAULT_GAME_QUESTIONS);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isQuestionManagerOpen, setIsQuestionManagerOpen] = useState(initialOpenQuestions);

  // Original text to game generator state
  const [inputText, setInputText] = useState(
    'Quả cam hình tròn, màu vàng cam khi chín. Vỏ sần sùi có tinh dầu thơm. Bên trong có nhiều múi mọng nước, vị ngọt thanh mát, giàu vitamin C giúp bé khỏe khoắn.'
  );
  const [targetType, setTargetType] = useState<'quiz' | 'flashcard' | 'game' | 'dialogue'>('game');
  const [ageGroup, setAgeGroup] = useState('4–5 tuổi (Lớp Chồi)');
  const [isGenerating, setIsGenerating] = useState(false);

  // Toggle sound
  const toggleSound = () => {
    if (!soundEnabled) {
      sounds.playSuccess();
      speakText('Âm thanh đã bật rồi nè! Hi hi!', 1.08, 'vi-VN');
    }
    setSoundEnabled(!soundEnabled);
  };

  const handleTestGirlVoice = () => {
    sounds.playPop();
    speakText('Xin chào các bạn nhỏ đáng yêu! Cùng chơi 10 trò chơi cảm ứng mầm non thật vui nha!', 1.1, 'vi-VN');
  };

  const gameNavItems: Array<{
    id: InteractiveGameMode | 'text-generator';
    title: string;
    icon: string;
    badge?: string;
    badgeColor?: string;
    bgHover: string;
    activeGrad: string;
  }> = [
    {
      id: 'lucky-wheel',
      title: '1. Vòng Quay May Mắn',
      icon: '🎡',
      badge: 'HOT',
      badgeColor: 'bg-red-500 text-white',
      bgHover: 'hover:bg-amber-50',
      activeGrad: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md',
    },
    {
      id: 'whack-ball',
      title: '2. Đập Chuột / Đập Bóng',
      icon: '🔨',
      badge: 'Cảm ứng',
      badgeColor: 'bg-orange-500 text-white animate-pulse',
      bgHover: 'hover:bg-orange-50',
      activeGrad: 'bg-gradient-to-r from-amber-500 via-orange-600 to-red-500 text-white shadow-md',
    },
    {
      id: 'bubble-pop',
      title: '3. Nổ Bong Bóng Tri Thức',
      icon: '🎈',
      badge: 'Chạm nổ',
      badgeColor: 'bg-sky-500 text-white',
      bgHover: 'hover:bg-sky-50',
      activeGrad: 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md',
    },
    {
      id: 'smart-sort',
      title: '4. Phân Loại Vào Giỏ',
      icon: '🧺',
      badge: 'Kéo thả',
      badgeColor: 'bg-emerald-500 text-white',
      bgHover: 'hover:bg-emerald-50',
      activeGrad: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md',
    },
    {
      id: 'memory-match',
      title: '5. Lật Thẻ Trí Nhớ',
      icon: '🔍',
      badge: 'Quan sát',
      badgeColor: 'bg-purple-500 text-white',
      bgHover: 'hover:bg-purple-50',
      activeGrad: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md',
    },
    {
      id: 'speed-quiz',
      title: '6. Đấu Trường Nhanh Trí',
      icon: '⚡',
      badge: 'Tốc độ',
      badgeColor: 'bg-rose-500 text-white',
      bgHover: 'hover:bg-rose-50',
      activeGrad: 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md',
    },
    {
      id: 'secret-doors',
      title: '7. Ô Cửa Bí Mật Cổ Tích',
      icon: '🚪',
      badge: 'MỚI',
      badgeColor: 'bg-indigo-600 text-white animate-pulse',
      bgHover: 'hover:bg-indigo-50',
      activeGrad: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md',
    },
    {
      id: 'claw-machine',
      title: '8. Gắp Thú & Rương Quà',
      icon: '🧸',
      badge: 'Hộp quà',
      badgeColor: 'bg-pink-500 text-white animate-pulse',
      bgHover: 'hover:bg-pink-50',
      activeGrad: 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-md',
    },
    {
      id: 'target-throw',
      title: '9. Ném Bóng Trúng Đích',
      icon: '🎯',
      badge: 'Chạm bắn',
      badgeColor: 'bg-teal-500 text-white animate-pulse',
      bgHover: 'hover:bg-teal-50',
      activeGrad: 'bg-gradient-to-r from-teal-500 via-emerald-600 to-cyan-600 text-white shadow-md',
    },
    {
      id: 'knowledge-train',
      title: '10. Chuyến Tàu Tri Thức',
      icon: '🚂',
      badge: 'Đoàn tàu',
      badgeColor: 'bg-blue-600 text-white animate-pulse',
      bgHover: 'hover:bg-blue-50',
      activeGrad: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-md',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-24 font-['Nunito',sans-serif]">
      {/* Top Banner - Kho Game Tương Tác Mầm Non */}
      <div className="bg-gradient-to-r from-amber-100/90 via-[#FFF8F0] via-orange-100/80 to-amber-100/90 rounded-[32px] p-5 sm:p-7 border-[3px] border-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_6px_24px_rgba(180,83,9,0.08)]">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-orange-700 text-xs font-black shadow-2xs border border-orange-200">
              <Gamepad2 className="w-3.5 h-3.5 text-orange-600" />
              <span className="font-bubbly">Kho Game Tương Tác Mầm Non · 10 Trò Chơi Cảm Ứng Mới Nhất</span>
            </div>

            {/* 5-year-old girl voice badge */}
            <button
              onClick={handleTestGirlVoice}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/95 hover:bg-pink-200 text-pink-800 text-xs font-black shadow-2xs border border-pink-300 cursor-pointer transition-transform hover:scale-105"
              title="Bấm để nghe thử giọng bé gái 5 tuổi"
            >
              <span>👧 Giọng Bé Gái 5 Tuổi Nhí Nhảnh</span>
              <Volume2 className="w-3.5 h-3.5 text-pink-600" />
            </button>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-950 tracking-tight font-bubbly">
            Kho Game Tương Tác Mầm Non
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
            Hệ sinh thái 10 trò chơi cảm ứng mầm non đa giác quan nổi bật và mới nhất hiện nay. Mỗi trò đều cho phép tạo câu hỏi tự động bằng AI, tải file câu hỏi lên, hoặc tự điền câu hỏi có đáp án đúng sai, chọn môn học và độ tuổi mầm non.
          </p>

          {/* Quick info bar on questions */}
          <div className="pt-1 flex items-center gap-2 flex-wrap text-xs">
            <span className="px-3 py-1 rounded-full bg-white/90 text-amber-950 font-black border border-amber-200 shadow-2xs flex items-center gap-1.5">
              <span>📚</span>
              <span>Đang áp dụng: {questions.length} câu hỏi</span>
            </span>

            {questions[0]?.subject && (
              <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-950 font-bold border border-orange-200">
                {questions[0].subject}
              </span>
            )}

            {questions[0]?.ageGroup && (
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-950 font-bold border border-blue-200">
                {questions[0].ageGroup}
              </span>
            )}
          </div>
        </div>

        {/* Mascot & Controls */}
        <div className="shrink-0 flex items-center gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap">
          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            className={`p-3 rounded-2xl border-2 flex items-center gap-1.5 cursor-pointer shadow-sm transition-all active:scale-95 ${
              soundEnabled
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                : 'bg-stone-100 border-stone-300 text-stone-400 hover:bg-stone-200'
            }`}
            title={soundEnabled ? 'Âm thanh đang BẬT (Bấm để tắt)' : 'Âm thanh đang TẮT (Bấm để bật)'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-600" /> : <VolumeX className="w-5 h-5" />}
            <span className="text-xs font-black hidden sm:inline">
              {soundEnabled ? 'Âm thanh' : 'Tắt tiếng'}
            </span>
          </button>

          {/* AI Question Manager Shortcut */}
          <button
            onClick={() => {
              if (soundEnabled) sounds.playPop();
              setIsQuestionManagerOpen(true);
            }}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer font-bubbly border-2 border-white"
          >
            <Sparkles className="w-4 h-4 text-yellow-200" />
            <span>⚙️ Đổi Câu Hỏi / Môn Học</span>
          </button>

          <MamAiMascot size="md" mood="teaching" />
        </div>
      </div>

      {/* 🎯 BẢNG THIẾT LẬP CÂU HỎI TRƯỚC KHI CHƠI (CHỌN ĐỘ TUỔI & CHỦ ĐỀ) */}
      <div className="bg-gradient-to-r from-[#031538] via-[#092b67] to-[#031538] rounded-3xl p-4 sm:p-5 border-2 border-cyan-400/90 shadow-md text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h3 className="text-base sm:text-lg font-black font-bubbly text-cyan-200">
              THIẾT LẬP CÂU HỎI TRƯỚC KHI CHƠI (ĐỘ TUỔI & CHỦ ĐỀ)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-cyan-100/90 font-medium">
            Cô có thể tự điền câu hỏi hoặc chọn độ tuổi & chủ đề để AI tự động soạn bộ câu hỏi tương tác thông minh cho cả 10 trò chơi cảm ứng mầm non!
          </p>
          <div className="flex items-center gap-2 pt-1 flex-wrap text-xs font-bold">
            <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-300 text-cyan-200">
              Độ tuổi: {questions[0]?.ageGroup || '4–5 tuổi (Lớp Chồi)'}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-sky-950/80 border border-sky-300 text-sky-200">
              Chủ đề: {questions[0]?.subject || 'Toán & Nhận biết'}
            </span>
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-stone-900 font-black shadow-xs">
              {questions.length} câu hỏi đã sẵn sàng chơi
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playPop();
            setIsQuestionManagerOpen(true);
          }}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-500 hover:to-orange-600 text-stone-950 font-black text-xs sm:text-sm font-bubbly shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer self-start md:self-center shrink-0 border-2 border-white"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>Điền / Đổi Câu Hỏi Trước Khi Chơi ➔</span>
        </button>
      </div>

      {/* 10-GAME TOUCH TAB SELECTOR BAR */}
      <div className="bg-white p-2 sm:p-2.5 rounded-3xl border-2 border-amber-200/90 shadow-sm flex items-center gap-2 overflow-x-auto scrollbar-none">
        {gameNavItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (soundEnabled) sounds.playPop();
                setActiveTab(item.id);
              }}
              className={`px-3.5 sm:px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bubbly font-black transition-all flex items-center gap-2 cursor-pointer shrink-0 select-none ${
                isActive
                  ? item.activeGrad
                  : `text-stone-700 ${item.bgHover} border border-transparent`
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.title}</span>
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-md font-black shadow-2xs ${
                    isActive ? 'bg-white text-stone-900' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* RENDER CURRENT ACTIVE GAME MODE */}
      <div className="animate-fadeIn">
        {/* GAME 1 */}
        {activeTab === 'lucky-wheel' && (
          <LuckyWheelGame
            questions={questions}
            soundEnabled={soundEnabled}
            onOpenQuestionManager={() => setIsQuestionManagerOpen(true)}
          />
        )}

        {/* GAME 2 */}
        {activeTab === 'smart-sort' && (
          <SmartSortGame
            questions={questions}
            soundEnabled={soundEnabled}
            onOpenQuestionManager={() => setIsQuestionManagerOpen(true)}
          />
        )}

        {/* GAME 3 */}
        {activeTab === 'bubble-pop' && (
          <BubblePopGame
            questions={questions}
            soundEnabled={soundEnabled}
            onOpenQuestionManager={() => setIsQuestionManagerOpen(true)}
          />
        )}

        {/* GAME 4 */}
        {activeTab === 'memory-match' && (
          <MemoryMatchGame
            questions={questions}
            soundEnabled={soundEnabled}
            onOpenQuestionManager={() => setIsQuestionManagerOpen(true)}
          />
        )}

        {/* GAME 5 */}
        {activeTab === 'speed-quiz' && (
          <SpeedQuizGame
            questions={questions}
            soundEnabled={soundEnabled}
            onOpenQuestionManager={() => setIsQuestionManagerOpen(true)}
          />
        )}

        {/* GAME 6 (MỚI: ĐẬP BÓNG THẦN TỐC) */}
        {activeTab === 'whack-ball' && (
          <WhackBallGame
            questions={questions}
            soundEnabled={soundEnabled}
            onOpenQuestionManager={() => setIsQuestionManagerOpen(true)}
          />
        )}

        {/* GAME 7 (MỚI: Ô CỬA BÍ MẬT) */}
        {activeTab === 'secret-doors' && (
          <SecretDoorsGame
            questions={questions}
            soundEnabled={soundEnabled}
            onOpenQuestionManager={() => setIsQuestionManagerOpen(true)}
          />
        )}

        {/* GAME 8 (MỚI: GẮP THÚ BÔNG) */}
        {activeTab === 'claw-machine' && (
          <ClawMachineGame
            questions={questions}
            soundEnabled={soundEnabled}
            onOpenQuestionManager={() => setIsQuestionManagerOpen(true)}
          />
        )}

        {/* GAME 9 (MỚI: NÉM BÓNG TRÚNG ĐÍCH) */}
        {activeTab === 'target-throw' && (
          <TargetThrowGame
            questions={questions}
            soundEnabled={soundEnabled}
            onOpenQuestionManager={() => setIsQuestionManagerOpen(true)}
          />
        )}

        {/* GAME 10 (MỚI: CHUYẾN TÀU TRI THỨC) */}
        {activeTab === 'knowledge-train' && (
          <KnowledgeTrainGame
            questions={questions}
            soundEnabled={soundEnabled}
            onOpenQuestionManager={() => setIsQuestionManagerOpen(true)}
          />
        )}

        {/* TAB 11: TEXT TO GAME GENERATOR (Biến văn bản thành học liệu) */}
        {activeTab === 'text-generator' && (
          <div className="space-y-6">
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
                      { id: 'game', label: '🎮 Trò chơi tương tác', desc: 'Tự động đưa vào cả 10 game' },
                      { id: 'quiz', label: '❓ Quiz nhận biết', desc: 'Có âm thanh & giọng bé gái 5 tuổi' },
                      { id: 'flashcard', label: '🃏 Bộ Flashcard 3D', desc: 'Mặt trước - mặt sau' },
                      { id: 'dialogue', label: '💬 Câu hỏi đàm thoại', desc: 'Gợi mở tư duy bé' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (soundEnabled) sounds.playPop();
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
                    Độ tuổi của lớp:
                  </label>
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200 text-xs sm:text-sm font-semibold text-stone-800 cursor-pointer focus:outline-none"
                  >
                    <option>18–36 tháng (Nhà trẻ)</option>
                    <option>3–4 tuổi (Lớp Mầm)</option>
                    <option>4–5 tuổi (Lớp Chồi)</option>
                    <option>5–6 tuổi (Lớp Lá)</option>
                  </select>

                  <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500 font-medium">
                      ⚡ Tự động phân tích ngữ liệu & sinh câu đố
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        if (soundEnabled) sounds.playPop();
                        setIsGenerating(true);
                        try {
                          const res = await fetch('/api/gemini/interactive-game-questions', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              topic: inputText.slice(0, 100),
                              ageGroup,
                              count: 6,
                            }),
                          });
                          const data = await res.json();
                          if (data.success && data.questions) {
                            setQuestions(data.questions);
                            if (soundEnabled) sounds.playFanfare();
                            speakGirlPraise();
                            setActiveTab('lucky-wheel');
                          }
                        } catch {
                          if (soundEnabled) sounds.playSuccess();
                        } finally {
                          setIsGenerating(false);
                        }
                      }}
                      disabled={isGenerating}
                      className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs sm:text-sm font-black shadow-md shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isGenerating ? 'AI Đang Xử Lý...' : '✨ Biến Hóa Thành Trò Chơi'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QUESTION MANAGER & AI GENERATOR MODAL */}
      <GameQuestionManager
        questions={questions}
        onUpdateQuestions={(newQuestions) => setQuestions(newQuestions)}
        isOpen={isQuestionManagerOpen}
        onClose={() => setIsQuestionManagerOpen(false)}
      />
    </div>
  );
};

export const InteractiveGamesView = MagicLearningView;

