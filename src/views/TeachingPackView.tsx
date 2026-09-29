import React, { useState, useEffect } from 'react';
import { MamAiMascot } from '../components/MamAiMascot';
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  Gamepad2,
  Globe,
  Home,
  Save,
  Printer,
  CheckCircle2,
  XCircle,
  Volume2,
  Share2,
} from 'lucide-react';
import { TeachingPack } from '../types';
import { PRELOADED_SAMPLE_PACK } from '../data/mockData';
import { generateTeachingPack } from '../services/aiService';
import { sounds, speakText } from '../utils/audioUtils';
import { ExportShareModal } from '../components/ExportShareModal';

interface TeachingPackViewProps {
  initialTopic?: string;
  initialAgeGroup?: string;
  initialPack?: TeachingPack;
  onSaveToLibrary: (pack: TeachingPack) => void;
  onOpenFamilyMode: () => void;
}

export const TeachingPackView: React.FC<TeachingPackViewProps> = ({
  initialTopic = 'Chủ đề Mẹ và Bé',
  initialAgeGroup = '3–4 tuổi (Lớp Mầm)',
  initialPack,
  onSaveToLibrary,
  onOpenFamilyMode,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [ageGroup, setAgeGroup] = useState(initialAgeGroup);
  const [duration, setDuration] = useState('20 phút');
  const [isLoading, setIsLoading] = useState(false);
  const [pack, setPack] = useState<TeachingPack>(initialPack || PRELOADED_SAMPLE_PACK);
  const [isSaved, setIsSaved] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    if (initialPack) {
      setPack(initialPack);
      if (initialPack.packTitle) setTopic(initialPack.packTitle);
      if (initialPack.ageGroup) setAgeGroup(initialPack.ageGroup);
    }
  }, [initialPack]);

  // Interactive Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<number, boolean>>({});

  const handleGenerate = async () => {
    sounds.playPop();
    setIsLoading(true);
    setIsSaved(false);
    setQuizAnswers({});
    setQuizSubmitted({});

    try {
      const generated = await generateTeachingPack(topic, ageGroup, duration);
      setPack(generated);
      sounds.playSuccess();
    } catch {
      sounds.playRetry();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuiz = (qIdx: number, optionIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optionIdx }));
    setQuizSubmitted((prev) => ({ ...prev, [qIdx]: true }));

    const isCorrect = optionIdx === pack.quiz[qIdx]?.correctIndex;
    if (isCorrect) {
      sounds.playSuccess();
    } else {
      sounds.playRetry();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      {/* Top Banner - Warm Terracotta */}
      <div className="bg-gradient-to-r from-amber-100/90 via-[#FFF8F0] to-orange-100/80 rounded-3xl p-5 sm:p-7 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(180,83,9,0.06)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-orange-700 text-xs font-black mb-2 shadow-2xs border border-orange-200">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>AI Teaching Pack · Trọn Gói Hoạt Động 1-Chạm</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight font-['Quicksand']">
            Bộ Học Liệu Toàn Diện Cho Giờ Học Mầm Non
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
            Chỉ với 1 thao tác: Sinh đồng bộ Kịch bản, Thơ truyện, Flashcard 3D, Quiz nhận biết, Game & Hoạt động gia đình
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <MamAiMascot size="lg" mood={isLoading ? 'thinking' : 'celebrate'} />
        </div>
      </div>

      {/* Input Controls Card */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-amber-200/80 shadow-[0_4px_16px_rgba(180,83,9,0.05)] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="sm:col-span-1.5">
            <label className="block text-xs font-bold text-amber-950 mb-1">
              Chủ đề hoạt động
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ví dụ: Bé khám phá quả cam, Ngày của Mẹ..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200/80 text-xs sm:text-sm font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-950 mb-1">
              Độ tuổi
            </label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200/80 text-xs sm:text-sm font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white cursor-pointer"
            >
              <option value="18–36 tháng (Nhà trẻ)">18–36 tháng (Nhà trẻ)</option>
              <option value="3–4 tuổi (Lớp Mầm)">3–4 tuổi (Lớp Mầm)</option>
              <option value="4–5 tuổi (Lớp Chồi)">4–5 tuổi (Lớp Chồi)</option>
              <option value="5–6 tuổi (Lớp Lá)">5–6 tuổi (Lớp Lá)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-950 mb-1">
              Thời lượng
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200/80 text-xs sm:text-sm font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white cursor-pointer"
            >
              <option value="15 phút">15 phút</option>
              <option value="20 phút">20 phút</option>
              <option value="25 phút">25 phút</option>
              <option value="30 phút">30 phút</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end pt-1">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <span>🌱 Mầm AI đang tạo trọn bộ...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>✨ Tạo trọn gói hoạt động</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Teaching Pack Result Box */}
      {pack && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="bg-white/95 rounded-3xl p-5 border border-amber-200/80 shadow-[0_4px_16px_rgba(180,83,9,0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black text-orange-800 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                Gói hoàn chỉnh · {pack.ageGroup}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-amber-950 mt-1 font-['Quicksand']">
                {pack.packTitle}
              </h2>
              <p className="text-xs text-stone-600 mt-0.5 font-medium">{pack.planOverview}</p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                onClick={() => {
                  sounds.playSuccess();
                  setIsSaved(true);
                  onSaveToLibrary(pack);
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-orange-800 text-xs font-black border border-amber-200 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaved ? 'Đã lưu kho 💖' : 'Lưu toàn bộ'}</span>
              </button>

              <button
                onClick={() => setIsExportModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-black shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Xuất & Chia sẻ đa thiết bị (Điện thoại & Máy tính)"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Xuất & Chia sẻ</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold border border-stone-200 transition-all flex items-center gap-1.5 cursor-pointer"
                title="In hoặc Lưu PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In / PDF</span>
              </button>
            </div>
          </div>

          {/* 1. THƠ / TRUYỆN MẦM NON */}
          <div className="bg-gradient-to-br from-amber-50/70 via-[#FFF8F0] to-orange-50 rounded-3xl p-5 sm:p-7 border border-amber-200/90 shadow-[0_4px_16px_rgba(180,83,9,0.05)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📖</span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-amber-950 font-['Quicksand']">
                    1. {pack.storyOrPoem.type}: {pack.storyOrPoem.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">
                    Ngắn gọn, vần điệu vui tươi, dễ thuộc cho trẻ mầm non
                  </p>
                </div>
              </div>
              <button
                onClick={() => speakText(pack.storyOrPoem.content.join('. '), 0.9, 'vi-VN')}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-orange-50 text-orange-700 border border-orange-200 text-xs font-black shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-orange-500" />
                <span>Đọc thơ</span>
              </button>
            </div>

            <div className="p-4 sm:p-6 bg-white rounded-2xl border border-amber-100 text-center space-y-1.5 shadow-2xs font-black text-sm sm:text-base text-amber-950 leading-relaxed font-['Quicksand']">
              {pack.storyOrPoem.content.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>

          {/* 2. FLASHCARDS TRỰC QUAN (Hòn đảo thẻ nhỏ) */}
          <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-amber-200/80 shadow-[0_4px_16px_rgba(180,83,9,0.05)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🖼️</span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-amber-950 font-['Quicksand']">
                    2. Bộ Thẻ Flashcards Trực Quan (4 Thẻ)
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">
                    Hình ảnh đất sét 3D bo tròn, bắt mắt, kích thích thị giác
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {pack.flashcards.map((fc) => (
                <div
                  key={fc.id}
                  className="p-4 rounded-2xl bg-gradient-to-b from-white to-amber-50/40 border border-amber-100/90 hover:border-orange-300 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-black text-orange-800 bg-orange-100 px-2 py-0.5 rounded-full inline-block mb-2">
                      {fc.tag}
                    </span>
                    <h4 className="font-black text-sm text-amber-950 font-['Quicksand']">
                      {fc.title}
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed font-medium">
                      {fc.caption}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-amber-100 flex items-center justify-between text-[11px] text-orange-700 font-bold">
                    <span>Thẻ số #{fc.id}</span>
                    <button
                      onClick={() => speakText(fc.title, 0.9, 'vi-VN')}
                      className="hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-orange-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. QUIZ TƯƠNG TÁC */}
          <div className="bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50 rounded-3xl p-5 sm:p-6 border border-amber-200/90 shadow-[0_4px_16px_rgba(180,83,9,0.05)] space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="text-base sm:text-lg font-black text-amber-950 font-['Quicksand']">
                  3. Câu Hỏi & Quiz Nhận Biết Vui Nhộn
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  Chạm để kiểm tra đáp án tương tác có âm thanh phản hồi
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {pack.quiz.map((q, qIdx) => {
                const isAnswered = quizSubmitted[qIdx];
                const selected = quizAnswers[qIdx];

                return (
                  <div
                    key={qIdx}
                    className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-2xs space-y-3"
                  >
                    <h4 className="font-black text-sm text-amber-950">
                      Câu {qIdx + 1}: {q.question}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {q.options.map((opt, oIdx) => {
                        const isChosen = selected === oIdx;
                        const isCorrect = oIdx === q.correctIndex;

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectQuiz(qIdx, oIdx)}
                            className={`p-3 rounded-xl text-xs font-black text-left transition-all border cursor-pointer ${
                              isAnswered && isCorrect
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 ring-2 ring-emerald-200'
                                : isAnswered && isChosen && !isCorrect
                                ? 'bg-rose-50 text-rose-900 border-rose-300'
                                : 'bg-amber-50/30 hover:bg-orange-50 text-stone-800 border-amber-200/70'
                            }`}
                          >
                            <span className="block">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div
                        className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                          selected === q.correctIndex
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                            : 'bg-amber-50 text-amber-900 border border-amber-200'
                        }`}
                      >
                        {selected === q.correctIndex ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span>{q.explanation}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. GAME & ENGLISH MINI TIME */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Game Card */}
            <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-amber-950">
                <Gamepad2 className="w-5 h-5 text-orange-600" />
                <h4 className="font-black text-sm sm:text-base font-['Quicksand']">
                  4. {pack.game.title}
                </h4>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                {pack.game.description}
              </p>
            </div>

            {/* English Mini Card */}
            <div className="p-5 rounded-3xl bg-orange-50/60 border border-orange-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-amber-950">
                <Globe className="w-5 h-5 text-orange-600" />
                <h4 className="font-black text-sm sm:text-base font-['Quicksand']">
                  5. English Mini Time
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {pack.englishMini.words.map((w, i) => (
                  <button
                    key={i}
                    onClick={() => speakText(w.en)}
                    className="px-2.5 py-1 bg-white rounded-xl border border-amber-200 text-xs font-black text-amber-950 flex items-center gap-1 hover:bg-orange-50 cursor-pointer shadow-2xs"
                  >
                    <span>{w.en}</span>
                    <span className="text-[10px] text-stone-400 font-bold">({w.vi})</span>
                    <Volume2 className="w-3 h-3 text-orange-500" />
                  </button>
                ))}
              </div>
              <div className="text-xs text-stone-700 space-y-1 pt-1 border-t border-amber-200/60 font-medium">
                {pack.englishMini.sentences.map((s, i) => (
                  <div key={i}>
                    <strong className="text-amber-950">{s.en}:</strong> {s.vi}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 6. FAMILY MODE (GÓC CÙNG CON 10 PHÚT) */}
          <div className="bg-gradient-to-r from-amber-100 via-[#FFF8F0] to-orange-100 rounded-3xl p-5 sm:p-7 border border-amber-200/90 shadow-[0_4px_16px_rgba(180,83,9,0.06)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Home className="w-6 h-6 text-orange-600" />
                <div>
                  <h3 className="text-base sm:text-lg font-black text-amber-950 font-['Quicksand']">
                    6. Góc Phụ Huynh: {pack.familyActivity.title}
                  </h3>
                  <p className="text-xs text-stone-600 font-medium">
                    Không tạo áp lực bài tập · Gợi ý gắn kết cha mẹ và con cái sau giờ tan trường
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenFamilyMode}
                className="px-3.5 py-2 rounded-xl bg-white text-orange-800 font-black text-xs border border-orange-200 shadow-2xs hover:bg-orange-50 transition-all shrink-0 cursor-pointer"
              >
                Mở Family Mode
              </button>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border border-amber-100 space-y-2 text-xs text-stone-700">
              <ol className="list-decimal list-inside space-y-1.5 font-semibold">
                {pack.familyActivity.steps.map((st, i) => (
                  <li key={i}>{st}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Cross-Device Export & Share Modal (Phone & Desktop) */}
      {pack && (
        <ExportShareModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          item={{
            id: pack.id,
            type: 'teaching_pack',
            title: pack.packTitle,
            subtitle: `Độ tuổi: ${pack.ageGroup} • Thời gian: ${pack.duration}`,
            data: pack,
          }}
        />
      )}
    </div>
  );
};
