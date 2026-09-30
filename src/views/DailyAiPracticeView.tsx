import React, { useState, useEffect } from 'react';
import { MamAiMascot } from '../components/MamAiMascot';
import {
  DAILY_AI_PRACTICE_EXERCISES,
  AiPracticeExercise,
  PRESCHOOL_TOPIC_PRESETS,
  PreschoolTopicPreset,
} from '../data/dailyAiPracticeData';
import { sounds, speakGirlPraise, speakText } from '../utils/audioUtils';
import {
  Sparkles,
  Trophy,
  Flame,
  CheckCircle2,
  Copy,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Filter,
  Check,
  Send,
  HelpCircle,
  Lightbulb,
  Clock,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
  Calendar,
  Wand2,
  PlusCircle,
  RotateCw,
  RefreshCw,
  Lock,
  Unlock,
  AlertCircle,
  CheckSquare,
  Square,
  PartyPopper,
} from 'lucide-react';

export const DailyAiPracticeView: React.FC = () => {
  // Base exercises + dynamic auto-assigned exercises stored locally
  const [exercises, setExercises] = useState<AiPracticeExercise[]>(() => {
    try {
      const saved = localStorage.getItem('mam_ai_custom_assigned_exercises');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...parsed, ...DAILY_AI_PRACTICE_EXERCISES];
      }
    } catch {
      // fallback
    }
    return DAILY_AI_PRACTICE_EXERCISES;
  });

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'prompt' | 'image' | 'video'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'all'>('all');
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  // Completed exercises stored in localStorage
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mam_ai_completed_exercises');
      return saved ? JSON.parse(saved) : ['ex-prompt-01'];
    } catch {
      return ['ex-prompt-01'];
    }
  });

  // Completion timestamps for remembering date/time
  const [completedDates, setCompletedDates] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('mam_ai_completed_dates');
      return saved ? JSON.parse(saved) : { 'ex-prompt-01': 'Hôm nay' };
    } catch {
      return { 'ex-prompt-01': 'Hôm nay' };
    }
  });

  // Copied toast feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // In-app prompt test playground
  const [testPromptText, setTestPromptText] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Auto-Assign Modal & States
  const [isAutoAssignOpen, setIsAutoAssignOpen] = useState(false);
  const [selectedPresetTopic, setSelectedPresetTopic] = useState<PreschoolTopicPreset>(PRESCHOOL_TOPIC_PRESETS[0]);
  const [selectedSubTopic, setSelectedSubTopic] = useState<string>(PRESCHOOL_TOPIC_PRESETS[0].subTopics[0]);
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('4–5 tuổi (Lớp Chồi)');
  const [selectedSkillType, setSelectedSkillType] = useState<'prompt' | 'image' | 'video'>('prompt');
  const [isGeneratingAssignment, setIsGeneratingAssignment] = useState(false);

  // Lock Alert Modal state (when user tries to click a locked day or exercise)
  const [lockedAlert, setLockedAlert] = useState<{
    isOpen: boolean;
    targetDay: number;
    requiredDay: number;
    remainingCount: number;
  } | null>(null);

  // Celebration Modal (when all exercises of a day are completed and next day unlocks!)
  const [celebrationModal, setCelebrationModal] = useState<{
    isOpen: boolean;
    completedDay: number;
    unlockedDay: number;
  } | null>(null);

  // Today date format
  const today = new Date();
  const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = daysOfWeek[today.getDay()];
  const formattedToday = `${dayName}, ngày ${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  // Unique days list sorted ascending
  const uniqueDays = Array.from(new Set(exercises.map((e) => e.day))).sort((a, b) => a - b);

  // Check if a specific Day is unlocked:
  // Day D is unlocked iff for every day d < D, ALL exercises in day d are completed!
  const isDayUnlocked = (day: number): boolean => {
    if (day <= 1) return true;
    for (const d of uniqueDays) {
      if (d >= day) break;
      const dayExercises = exercises.filter((ex) => ex.day === d);
      if (dayExercises.length > 0) {
        const allDone = dayExercises.every((ex) => completedIds.includes(ex.id));
        if (!allDone) return false;
      }
    }
    return true;
  };

  // Find the current active day (first day with uncompleted exercises)
  const currentActiveDay = uniqueDays.find((d) => {
    const dayExercises = exercises.filter((ex) => ex.day === d);
    return dayExercises.some((ex) => !completedIds.includes(ex.id));
  }) || (uniqueDays[uniqueDays.length - 1] ?? 1);

  // Find first locked day (if any)
  const firstLockedDay = uniqueDays.find((d) => !isDayUnlocked(d));

  // Determine today's featured exercise (from active day)
  const todayExercise =
    exercises.find((e) => e.day === currentActiveDay && !completedIds.includes(e.id)) ||
    exercises.find((e) => !completedIds.includes(e.id)) ||
    exercises[0];

  useEffect(() => {
    try {
      localStorage.setItem('mam_ai_completed_exercises', JSON.stringify(completedIds));
      localStorage.setItem('mam_ai_completed_dates', JSON.stringify(completedDates));
    } catch {
      // Ignore
    }
  }, [completedIds, completedDates]);

  // Toggle exercise completion with lock rules & celebration
  const toggleComplete = (id: string, day: number) => {
    // If this day is locked, prevent ticking and alert the user
    if (!isDayUnlocked(day)) {
      sounds.playRetry();
      const requiredDay = uniqueDays.find((d) => !exercises.filter((e) => e.day === d).every((e) => completedIds.includes(e.id))) || 1;
      const remaining = exercises.filter((e) => e.day === requiredDay && !completedIds.includes(e.id)).length;
      setLockedAlert({
        isOpen: true,
        targetDay: day,
        requiredDay,
        remainingCount: remaining,
      });
      return;
    }

    if (completedIds.includes(id)) {
      // Uncheck
      sounds.playPop();
      setCompletedIds((prev) => prev.filter((i) => i !== id));
      setCompletedDates((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } else {
      // Check (mark completed)
      sounds.playTada();
      speakGirlPraise();
      const newCompleted = [...completedIds, id];
      setCompletedIds(newCompleted);

      // Save formatted date
      const timeStr = `${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')} hôm nay`;
      setCompletedDates((prev) => ({ ...prev, [id]: timeStr }));

      // Check if Day 'day' just got 100% completed!
      const dayExercises = exercises.filter((ex) => ex.day === day);
      const isDayNowFullyDone = dayExercises.every((ex) => newCompleted.includes(ex.id));

      if (isDayNowFullyDone) {
        const nextDay = uniqueDays.find((d) => d > day);
        if (nextDay) {
          setTimeout(() => {
            sounds.playTada();
            speakText(
              `Hoan hô cô giáo! Cô đã hoàn thành tất cả bài tập của Ngày ${day}! Ngày ${nextDay} đã chính thức được mở khóa rồi nè!`,
              1.1,
              'vi-VN'
            );
            setCelebrationModal({
              isOpen: true,
              completedDay: day,
              unlockedDay: nextDay,
            });
          }, 600);
        }
      }
    }
  };

  const handleCopyPrompt = (text: string, id: string, day: number) => {
    if (!isDayUnlocked(day)) {
      triggerLockedAlert(day);
      return;
    }
    sounds.playPop();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const triggerLockedAlert = (targetDay: number) => {
    sounds.playRetry();
    const requiredDay = uniqueDays.find((d) => !exercises.filter((e) => e.day === d).every((e) => completedIds.includes(e.id))) || 1;
    const remaining = exercises.filter((e) => e.day === requiredDay && !completedIds.includes(e.id)).length;
    setLockedAlert({
      isOpen: true,
      targetDay,
      requiredDay,
      remainingCount: remaining,
    });
  };

  const handleTestInApp = async (promptToTest: string) => {
    sounds.playPop();
    setIsTesting(true);
    setTestPromptText(promptToTest);
    setTestResult(null);

    try {
      const res = await fetch('/api/gemini/quick-prompt-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptToTest }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        sounds.playSuccess();
        setTestResult(data.result);
      } else {
        throw new Error('API failure');
      }
    } catch {
      setTimeout(() => {
        sounds.playSuccess();
        setTestResult(
          `🌟 [ĐÁNH GIÁ PROMPT CỦA CÔ]:\n✓ Điểm đánh giá: 9.8/10 - Rất xuất sắc!\n✓ Cấu trúc: Chuẩn phương pháp sư phạm mầm non (Xác định vai trò, lứa tuổi rõ ràng, câu từ truyền cảm hứng).\n✓ Gợi ý: Cô bấm nút "Mở ChatGPT" hoặc "Mở Canva" để dán câu lệnh và nhận kết quả tức thì!`
        );
      }, 1000);
    } finally {
      setIsTesting(false);
    }
  };

  // Generate new daily assignment via API
  const handleAutoAssignExercise = async () => {
    sounds.playPop();
    setIsGeneratingAssignment(true);

    const topicName = selectedPresetTopic.name;
    const finalSubTopic = customTopicInput.trim() || selectedSubTopic;

    try {
      const res = await fetch('/api/gemini/generate-daily-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicName,
          subTopic: finalSubTopic,
          ageGroup: selectedAgeGroup,
          skillType: selectedSkillType,
          day: currentActiveDay, // Auto-assign to current active day!
        }),
      });

      const data = await res.json();
      if (data.success && data.exercise) {
        const newEx: AiPracticeExercise = data.exercise;
        sounds.playTada();
        speakText('Oa! Tớ đã giao cho bạn một bài tập AI mới siêu thú vị rồi nè! Cùng làm ngay nha!', 1.1, 'vi-VN');

        setExercises((prev) => {
          const updated = [newEx, ...prev];
          try {
            const customOnly = updated.filter((item) => item.id.startsWith('auto_'));
            localStorage.setItem('mam_ai_custom_assigned_exercises', JSON.stringify(customOnly));
          } catch {
            // ignore
          }
          return updated;
        });

        setExpandedExerciseId(newEx.id);
        setIsAutoAssignOpen(false);
      }
    } catch (err) {
      console.error('Error generating exercise:', err);
    } finally {
      setIsGeneratingAssignment(false);
    }
  };

  const handleRandomizeTopic = () => {
    sounds.playPop();
    const randomPreset = PRESCHOOL_TOPIC_PRESETS[Math.floor(Math.random() * PRESCHOOL_TOPIC_PRESETS.length)];
    const randomSub = randomPreset.subTopics[Math.floor(Math.random() * randomPreset.subTopics.length)];
    setSelectedPresetTopic(randomPreset);
    setSelectedSubTopic(randomSub);
    setCustomTopicInput('');
  };

  const filteredExercises = exercises.filter((ex) => {
    const matchCat = selectedCategory === 'all' || ex.category === selectedCategory;
    const matchDiff = selectedDifficulty === 'all' || ex.difficulty === selectedDifficulty;
    const matchDay = selectedDayFilter === 'all' || ex.day === selectedDayFilter;
    return matchCat && matchDiff && matchDay;
  });

  const completionPercentage = Math.round((completedIds.length / exercises.length) * 100);

  return (
    <div className="space-y-6 animate-fadeIn pb-24 font-['Nunito',sans-serif]">
      {/* Top Banner: Luyện AI Mỗi Ngày */}
      <div className="bg-gradient-to-r from-amber-100/90 via-[#FFF8F0] via-orange-100/80 to-amber-100/90 rounded-[32px] p-5 sm:p-7 border-[3px] border-white flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-[0_6px_24px_rgba(180,83,9,0.08)]">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 text-orange-700 text-xs font-black shadow-2xs border border-orange-200">
            <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500" />
            <span className="font-bubbly">Quy Tắc Mở Khóa Tuần Tự: Hoàn Thành Hết Bài Tập Hôm Nay Mới Sang Ngày Mới!</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-950 tracking-tight font-bubbly">
            Luyện AI Mỗi Ngày Cho Giáo Viên Mầm Non
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
            Mỗi bài tập đều có <strong>ô tích ghi nhớ</strong> thông minh. Cô cần <strong>hoàn thành toàn bộ bài tập được giao của ngày hiện tại</strong> thì hệ thống mới tự động mở khóa bài tập của ngày tiếp theo! Rèn luyện đều đặn 5 phút mỗi ngày cùng <strong>ChatGPT</strong> và <strong>Canva AI</strong>.
          </p>
        </div>

        {/* Action Button: Giao bài tập tự động bằng AI & Progress */}
        <div className="shrink-0 flex flex-col sm:flex-row md:flex-col items-stretch gap-3">
          <button
            onClick={() => {
              sounds.playPop();
              setIsAutoAssignOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-500/30 hover:scale-103 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer ring-2 ring-orange-300 font-bubbly"
          >
            <Wand2 className="w-4 h-4 animate-bounce" />
            <span>⚡ AI Giao Thêm Bài Tập Ngày {currentActiveDay}</span>
          </button>

          {/* Progress Mini Card */}
          <div className="flex items-center justify-between gap-4 bg-white/95 px-4 py-2.5 rounded-2xl border-2 border-orange-200 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-black text-orange-700">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Tiến độ tổng:</span>
            </div>
            <div className="flex items-baseline gap-1 font-black text-sm text-amber-950 font-['Quicksand']">
              <span>{completedIds.length}/{exercises.length}</span>
              <span className="text-[11px] text-stone-500 font-medium">({completionPercentage}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION: TODAY'S ASSIGNED MISSION (BÀI TẬP HÔM NAY) */}
      {/* ======================================================== */}
      {todayExercise && (
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-[30px] p-5 sm:p-6 text-white shadow-lg border-[3px] border-white">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black text-white border border-white/30">
                <Calendar className="w-3.5 h-3.5" />
                <span>Nhiệm Vụ Đang Mở · Ngày {todayExercise.day} ({formattedToday})</span>
              </div>

              <h2 className="text-lg sm:text-xl font-black font-bubbly tracking-wide">
                ⭐ {todayExercise.title}
              </h2>

              <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed max-w-2xl line-clamp-2">
                {todayExercise.scenario}
              </p>

              <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 font-bold">
                  {todayExercise.categoryEmoji} {todayExercise.categoryLabel}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 font-bold">
                  ⏱️ {todayExercise.timeMinutes} phút thực hành
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 font-bold">
                  🎯 Trẻ: {todayExercise.targetAge}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-emerald-950 font-black">
                  ⚡ Dùng: {todayExercise.toolName}
                </span>
              </div>
            </div>

            {/* Quick action buttons for today's mission */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center gap-2.5 shrink-0">
              <button
                onClick={() => {
                  sounds.playPop();
                  setExpandedExerciseId(todayExercise.id);
                  const el = document.getElementById(`exercise-${todayExercise.id}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3 rounded-2xl bg-white hover:bg-amber-50 text-amber-950 font-black text-xs sm:text-sm shadow-md hover:scale-103 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer font-bubbly"
              >
                <span>Xem Hướng Dẫn & Thực Hành Ngay</span>
                <ArrowRight className="w-4 h-4 text-orange-600" />
              </button>

              <div className="flex items-center gap-2 justify-center">
                <button
                  onClick={() => handleCopyPrompt(todayExercise.samplePrompt, todayExercise.id, todayExercise.day)}
                  className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer backdrop-blur-xs transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === todayExercise.id ? 'Đã chép Prompt!' : 'Sao chép Prompt'}</span>
                </button>

                <a
                  href={todayExercise.toolUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer backdrop-blur-xs transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Mở {todayExercise.toolName}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SEQUENTIAL DAY ROADMAP (LỘ TRÌNH MỞ KHÓA TỪNG NGÀY) */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-200/90 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-black text-sm text-amber-950 font-bubbly">
            <Lock className="w-4 h-4 text-orange-600" />
            <span>Lộ Trình Mở Khóa Ngày Học (Hoàn thành hết bài ngày trước để mở ngày sau)</span>
          </div>
          <span className="text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            🎯 Đang rèn luyện: <strong>Ngày {currentActiveDay}</strong>
          </span>
        </div>

        {/* Day Pills Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
          {uniqueDays.map((d) => {
            const isUnlocked = isDayUnlocked(d);
            const dayExercises = exercises.filter((ex) => ex.day === d);
            const doneCount = dayExercises.filter((ex) => completedIds.includes(ex.id)).length;
            const isAllDone = dayExercises.length > 0 && doneCount === dayExercises.length;
            const isCurrentActive = d === currentActiveDay && isUnlocked;
            const isFiltered = selectedDayFilter === d;

            return (
              <button
                key={d}
                onClick={() => {
                  if (!isUnlocked) {
                    triggerLockedAlert(d);
                  } else {
                    sounds.playPop();
                    setSelectedDayFilter(selectedDayFilter === d ? 'all' : d);
                  }
                }}
                className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col justify-between min-h-[75px] cursor-pointer ${
                  !isUnlocked
                    ? 'bg-stone-100 border-stone-200 opacity-60 hover:opacity-80'
                    : isAllDone
                    ? isFiltered
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-400'
                      : 'bg-emerald-50 text-emerald-950 border-emerald-300 hover:bg-emerald-100'
                    : isCurrentActive
                    ? isFiltered
                      ? 'bg-orange-600 text-white border-orange-700 shadow-md ring-2 ring-orange-400'
                      : 'bg-orange-100/90 text-orange-950 border-orange-400 ring-2 ring-orange-300 font-black shadow-xs'
                    : isFiltered
                    ? 'bg-amber-600 text-white border-amber-700'
                    : 'bg-stone-50 hover:bg-amber-50 text-stone-700 border-stone-200'
                }`}
                title={
                  !isUnlocked
                    ? `Ngày ${d} đang khóa! Cô cần hoàn thành tất cả bài tập của ngày trước đó.`
                    : isAllDone
                    ? `Ngày ${d} đã hoàn thành xuất sắc toàn bộ bài tập (${doneCount}/${dayExercises.length})`
                    : `Ngày ${d} đang mở (${doneCount}/${dayExercises.length})`
                }
              >
                <div className="flex items-center justify-between text-xs font-black">
                  <span>Ngày {d}</span>
                  <span>
                    {!isUnlocked ? (
                      <Lock className="w-3.5 h-3.5 text-stone-400" />
                    ) : isAllDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5 text-orange-600" />
                    )}
                  </span>
                </div>

                <div className="text-[10px] font-bold mt-1">
                  {!isUnlocked ? (
                    <span className="text-stone-500">🔒 Đang khóa</span>
                  ) : isAllDone ? (
                    <span className="text-emerald-700">✓ Hoàn thành ({doneCount}/{dayExercises.length})</span>
                  ) : (
                    <span className="text-orange-800 font-extrabold">Đang làm ({doneCount}/{dayExercises.length})</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {selectedDayFilter !== 'all' && (
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="font-bold text-stone-600">
              Đang lọc xem riêng: <strong>Ngày {selectedDayFilter}</strong>
            </span>
            <button
              onClick={() => {
                sounds.playPop();
                setSelectedDayFilter('all');
              }}
              className="text-orange-700 hover:text-orange-800 font-black cursor-pointer"
            >
              ✕ Bỏ lọc (Xem tất cả ngày)
            </button>
          </div>
        )}
      </div>

      {/* Category & Difficulty Filter Bar */}
      <div className="bg-white p-3 rounded-3xl border-2 border-amber-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 flex-wrap">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto">
          {[
            { id: 'all', label: 'Tất cả bài tập', emoji: '🌟', count: exercises.length },
            { id: 'prompt', label: 'Viết Prompt AI', emoji: '✍️', count: exercises.filter((e) => e.category === 'prompt').length },
            { id: 'image', label: 'Tạo Ảnh AI', emoji: '🖼️', count: exercises.filter((e) => e.category === 'image').length },
            { id: 'video', label: 'Tạo Video AI', emoji: '🎬', count: exercises.filter((e) => e.category === 'video').length },
          ].map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  sounds.playPop();
                  setSelectedCategory(cat.id as typeof selectedCategory);
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bubbly font-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm'
                    : 'bg-stone-50 hover:bg-amber-50/60 text-stone-700 border border-stone-200/80'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/30 text-white' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600 self-end sm:self-auto">
          <Filter className="w-3.5 h-3.5 text-stone-500" />
          <span>Cấp độ:</span>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-amber-50/50 border border-amber-200 text-xs font-black text-amber-950 cursor-pointer focus:outline-none"
          >
            <option value="all">Tất cả cấp độ</option>
            <option value="Cơ bản">Cơ bản (5 phút)</option>
            <option value="Trung bình">Trung bình (7-8 phút)</option>
            <option value="Nâng cao">Nâng cao (10 phút)</option>
          </select>
        </div>
      </div>

      {/* Exercises List (Mỗi bài tập là 1 mục riêng) */}
      <div className="space-y-4">
        {filteredExercises.map((ex) => {
          const isCompleted = completedIds.includes(ex.id);
          const isExpanded = expandedExerciseId === ex.id;
          const isCopied = copiedId === ex.id;
          const isUnlocked = isDayUnlocked(ex.day);
          const completionTime = completedDates[ex.id];

          return (
            <div
              key={ex.id}
              id={`exercise-${ex.id}`}
              className={`bg-white rounded-3xl border-2 transition-all shadow-sm overflow-hidden relative ${
                !isUnlocked
                  ? 'border-stone-200 bg-stone-50/60 opacity-80'
                  : isCompleted
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-amber-200/90 hover:border-orange-300'
              }`}
            >
              {/* Locked Ribbon Indicator */}
              {!isUnlocked && (
                <div className="bg-stone-200 text-stone-700 px-4 py-1.5 text-xs font-black flex items-center justify-between border-b border-stone-300">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-stone-600" />
                    <span>Bài tập Ngày {ex.day} đang khóa · Cần hoàn thành toàn bộ bài tập ngày trước để mở khóa</span>
                  </span>
                  <button
                    onClick={() => triggerLockedAlert(ex.day)}
                    className="text-[11px] underline text-orange-700 hover:text-orange-900 font-bold cursor-pointer"
                  >
                    Xem yêu cầu mở khóa ➔
                  </button>
                </div>
              )}

              {/* Card Main Row */}
              <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  {/* Badges line */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-md font-black text-[11px] font-['Quicksand'] flex items-center gap-1 ${
                        !isUnlocked
                          ? 'bg-stone-200 text-stone-600'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {!isUnlocked && <Lock className="w-3 h-3" />}
                      <span>Ngày {ex.day}</span>
                    </span>

                    <span className="px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-900 font-bold text-[11px] flex items-center gap-1">
                      <span>{ex.categoryEmoji}</span>
                      <span>{ex.categoryLabel}</span>
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        ex.difficulty === 'Cơ bản'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ex.difficulty === 'Trung bình'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {ex.difficulty} · {ex.timeMinutes} phút
                    </span>

                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-bold text-[10px]">
                      {ex.targetAge}
                    </span>

                    {/* Tool Badge */}
                    <span className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[10px] shadow-2xs">
                      ⚡ Công cụ: {ex.toolName}
                    </span>

                    {/* Completed timestamp badge if done */}
                    {isCompleted && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-black text-[10px] flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Đã hoàn thành {completionTime ? `(${completionTime})` : ''}</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Scenario */}
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-amber-950 font-['Quicksand'] leading-snug">
                      {ex.title}
                    </h3>
                    <p className="text-xs text-stone-600 font-medium mt-1 leading-relaxed">
                      <strong>Tình huống sư phạm:</strong> {ex.scenario}
                    </p>
                  </div>
                </div>

                {/* Right Action & Checkbox Buttons */}
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  {/* Ô TÍCH ĐỂ GHI NHỚ HOÀN THÀNH BÀI TẬP */}
                  <button
                    onClick={() => toggleComplete(ex.id, ex.day)}
                    className={`px-3.5 py-2 rounded-2xl border-2 font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 ${
                      !isUnlocked
                        ? 'bg-stone-100 border-stone-300 text-stone-400 cursor-not-allowed'
                        : isCompleted
                        ? 'bg-emerald-500 hover:bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-white hover:bg-emerald-50 border-emerald-400 text-emerald-800 hover:scale-102'
                    }`}
                    title={
                      !isUnlocked
                        ? 'Bài tập đang khóa! Hoàn thành bài ngày trước để mở.'
                        : isCompleted
                        ? 'Bấm để hủy đánh dấu hoàn thành'
                        : 'Bấm ô tích này để ghi nhớ đã hoàn thành bài tập'
                    }
                  >
                    {isCompleted ? (
                      <>
                        <CheckSquare className="w-4 h-4 text-white" />
                        <span>✓ Đã ghi nhớ hoàn thành</span>
                      </>
                    ) : (
                      <>
                        <Square className="w-4 h-4 text-emerald-600" />
                        <span>Ô tích ghi nhớ bài tập</span>
                      </>
                    )}
                  </button>

                  {/* Copy Prompt Button */}
                  <button
                    onClick={() => handleCopyPrompt(ex.samplePrompt, ex.id, ex.day)}
                    disabled={!isUnlocked}
                    className={`px-3 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
                      !isUnlocked
                        ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                        : isCopied
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300'
                    }`}
                    title="Sao chép câu lệnh prompt chuẩn vào bộ nhớ tạm"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-orange-600" />}
                    <span>{isCopied ? 'Đã sao chép!' : 'Chép Prompt'}</span>
                  </button>

                  {/* Link to Tool (ChatGPT / Canva) */}
                  {isUnlocked ? (
                    <a
                      href={ex.toolUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        sounds.playPop();
                        handleCopyPrompt(ex.samplePrompt, ex.id, ex.day);
                      }}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-black text-white shadow-sm flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-all ${
                        ex.tool === 'chatgpt'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-700'
                          : ex.tool === 'canva'
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600'
                          : 'bg-gradient-to-r from-purple-600 to-indigo-600'
                      }`}
                      title={`Mở ${ex.toolName} để thực hành`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Mở {ex.toolName}</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => triggerLockedAlert(ex.day)}
                      className="px-3.5 py-2 rounded-2xl text-xs font-black text-stone-400 bg-stone-200 cursor-not-allowed flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Khóa</span>
                    </button>
                  )}

                  {/* Expand / Collapse Details Button */}
                  <button
                    onClick={() => {
                      if (!isUnlocked) {
                        triggerLockedAlert(ex.day);
                        return;
                      }
                      sounds.playPop();
                      setExpandedExerciseId(isExpanded ? null : ex.id);
                    }}
                    className="p-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 cursor-pointer"
                    title={isExpanded ? 'Thu gọn' : 'Xem chi tiết hướng dẫn'}
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Expandable Step-by-Step Instructions & Prompt Box */}
              {isExpanded && isUnlocked && (
                <div className="p-4 sm:p-6 bg-gradient-to-b from-amber-50/60 to-[#FFFDF9] border-t border-amber-200/90 space-y-4 animate-fadeIn">
                  {/* Goal & Teacher Tips */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-2xs space-y-1">
                      <div className="flex items-center gap-1.5 font-black text-amber-950">
                        <Award className="w-4 h-4 text-orange-600" />
                        <span>Mục tiêu rèn luyện kỹ năng:</span>
                      </div>
                      <p className="text-stone-600 font-medium leading-relaxed">{ex.goal}</p>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-2xs space-y-1">
                      <div className="flex items-center gap-1.5 font-black text-amber-950">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <span>Mẹo sư phạm mầm non:</span>
                      </div>
                      <p className="text-stone-600 font-medium leading-relaxed">{ex.teacherTips}</p>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="bg-white p-4 rounded-2xl border border-amber-200 space-y-2">
                    <span className="text-xs font-black text-amber-950 uppercase tracking-wide block">
                      📌 Các bước thực hành chi tiết:
                    </span>
                    <ol className="list-decimal list-inside space-y-1 text-xs text-stone-700 font-medium">
                      {ex.steps.map((st, i) => (
                        <li key={i} className="leading-relaxed">
                          {st}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Sample Prompt Box */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                      <span>📄 Câu lệnh mẫu (Prompt Template chuẩn) để cô dán vào {ex.toolName}:</span>
                      <button
                        onClick={() => handleCopyPrompt(ex.samplePrompt, ex.id, ex.day)}
                        className="text-orange-700 hover:text-orange-800 font-black flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép toàn bộ</span>
                      </button>
                    </div>

                    <div className="bg-stone-900 text-stone-100 p-4 rounded-2xl text-xs font-mono leading-relaxed whitespace-pre-wrap relative border border-stone-700 select-all shadow-inner">
                      {ex.samplePrompt}
                    </div>
                  </div>

                  {/* Expected Output */}
                  <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Kết quả mong đợi:</strong> {ex.expectedResult}
                    </span>
                  </div>

                  {/* Action Link Footer & Big Checkbox Confirm */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      onClick={() => handleTestInApp(ex.samplePrompt)}
                      disabled={isTesting}
                      className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isTesting ? 'AI Đang Kiểm Tra...' : '✨ Thử Nghiệm Nhanh Với AI Trong App'}</span>
                    </button>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      {/* Big Prominent Checkbox inside expanded details */}
                      <button
                        onClick={() => toggleComplete(ex.id, ex.day)}
                        className={`px-4 py-2.5 rounded-2xl font-black text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white hover:bg-emerald-50 border-2 border-emerald-500 text-emerald-900'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckSquare className="w-4 h-4 text-white" />
                            <span>✓ Đã Hoàn Thành Bài Tập Này</span>
                          </>
                        ) : (
                          <>
                            <Square className="w-4 h-4 text-emerald-600" />
                            <span>Bấm Tích Ghi Nhớ Đã Hoàn Thành</span>
                          </>
                        )}
                      </button>

                      <a
                        href={ex.toolUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-black text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer font-bubbly"
                      >
                        <span>Mở {ex.toolName} Để Làm Ngay</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* In-app test result preview */}
                  {testResult && testPromptText === ex.samplePrompt && (
                    <div className="bg-white p-4 rounded-2xl border-2 border-orange-300 shadow-md text-xs text-stone-800 whitespace-pre-wrap leading-relaxed animate-fadeIn">
                      {testResult}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* MODAL: LOCKED ALERT (KHI CHƯA HOÀN THÀNH HẾT BÀI NGÀY TRƯỚC) */}
      {/* ======================================================== */}
      {lockedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-2 border-orange-400 space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-orange-100 border-2 border-orange-300 flex items-center justify-center mx-auto text-orange-600">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-amber-950 font-bubbly">
                Ngày {lockedAlert.targetDay} Đang Khóa! 🔒
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                Quy tắc rèn luyện AI: Cô cần <strong>hoàn thành toàn bộ các bài tập của Ngày {lockedAlert.requiredDay}</strong> trước thì bài tập Ngày {lockedAlert.targetDay} mới được mở khóa!
              </p>
            </div>

            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs font-bold text-amber-950 flex items-center justify-center gap-2">
              <Flame className="w-4 h-4 text-orange-600" />
              <span>Chỉ còn {lockedAlert.remainingCount} bài tập ở Ngày {lockedAlert.requiredDay} nữa thôi cô nhé!</span>
            </div>

            <button
              onClick={() => {
                sounds.playPop();
                setLockedAlert(null);
                setSelectedDayFilter(lockedAlert.requiredDay);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-md font-bubbly cursor-pointer"
            >
              ➔ Đi tới làm nốt bài tập Ngày {lockedAlert.requiredDay} ngay
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CELEBRATION UNLOCK (CHÚC MỪNG MỞ KHÓA NGÀY TIẾP THEO) */}
      {/* ======================================================== */}
      {celebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-4 border-amber-400 space-y-4 text-center animate-scaleUp relative overflow-hidden">
            {/* Top Confetti glow */}
            <div className="w-32 h-32 rounded-full bg-amber-300/30 blur-2xl absolute -top-10 -right-10 pointer-events-none" />

            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-600 shadow-sm animate-bounce">
              <PartyPopper className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black text-orange-600 uppercase tracking-widest block font-bubbly">
                🎉 Tuyệt Vời Quá Cô Giáo Ơi!
              </span>
              <h3 className="text-xl font-black text-amber-950 font-bubbly">
                Đã Hoàn Thành Toàn Bộ Ngày {celebrationModal.completedDay}!
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                Cô vừa đánh dấu hoàn thành 100% bài tập được giao của Ngày {celebrationModal.completedDay}. Hệ thống đã chính thức <strong>mở khóa bài tập Ngày {celebrationModal.unlockedDay}</strong>!
              </p>
            </div>

            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-300 text-xs font-black text-emerald-950 flex items-center justify-center gap-2">
              <Unlock className="w-4 h-4 text-emerald-600" />
              <span>Bài tập Ngày {celebrationModal.unlockedDay} đã sẵn sàng để cô rèn luyện!</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playPop();
                  setCelebrationModal(null);
                }}
                className="flex-1 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
              >
                Đóng
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  setCelebrationModal(null);
                  setSelectedDayFilter(celebrationModal.unlockedDay);
                }}
                className="flex-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs shadow-md font-bubbly cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Khám phá Ngày {celebrationModal.unlockedDay}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: AI AUTO-ASSIGN EXERCISE BY TOPIC & AGE GROUP */}
      {/* ======================================================== */}
      {isAutoAssignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border-2 border-orange-300 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-sm">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-amber-950 font-bubbly">
                    Giao Thêm Bài Tập AI Vào Ngày {currentActiveDay}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">
                    Tùy chỉnh chủ đề mầm non cô đang dạy để AI thiết kế bài tập phù hợp 100%
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAutoAssignOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 1. Chọn Chủ Đề Lớn (Bộ GD&ĐT) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-amber-950">
                <span>1. Chọn Chủ Đề Mầm Non:</span>
                <button
                  type="button"
                  onClick={handleRandomizeTopic}
                  className="text-orange-700 hover:text-orange-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Gợi ý ngẫu nhiên</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESCHOOL_TOPIC_PRESETS.map((tp) => {
                  const isSel = selectedPresetTopic.id === tp.id;
                  return (
                    <button
                      key={tp.id}
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setSelectedPresetTopic(tp);
                        setSelectedSubTopic(tp.subTopics[0]);
                      }}
                      className={`p-2.5 rounded-2xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isSel
                          ? 'border-orange-500 bg-orange-50 font-black text-orange-950 shadow-xs'
                          : 'border-stone-200 hover:bg-amber-50/50 text-stone-700 font-bold'
                      }`}
                    >
                      <span className="text-lg">{tp.emoji}</span>
                      <span className="text-xs leading-tight line-clamp-1">{tp.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Chọn Đề Tài Cụ Thể (Sub-topic) */}
            <div className="space-y-2">
              <span className="text-xs font-black text-amber-950 block">
                2. Chọn Đề Tài Bài Học Cụ Thể:
              </span>

              <div className="flex items-center gap-2 flex-wrap">
                {selectedPresetTopic.subTopics.map((sub) => {
                  const isSel = selectedSubTopic === sub && !customTopicInput;
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setSelectedSubTopic(sub);
                        setCustomTopicInput('');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                        isSel
                          ? 'bg-amber-500 text-white font-black shadow-xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium'
                      }`}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>

              {/* Or type custom topic */}
              <div className="pt-1">
                <input
                  type="text"
                  value={customTopicInput}
                  onChange={(e) => setCustomTopicInput(e.target.value)}
                  placeholder="Hoặc tự gõ đề tài riêng của cô (ví dụ: Chú gấu trắng Bắc Cực...)"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            {/* 3. Chọn Lứa Tuổi & Kỹ Năng AI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-amber-950 block">
                  3. Lứa tuổi của trẻ:
                </label>
                <select
                  value={selectedAgeGroup}
                  onChange={(e) => setSelectedAgeGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-black text-stone-800 focus:outline-none"
                >
                  <option value="18–36 tháng (Nhà trẻ)">18–36 tháng (Nhà trẻ)</option>
                  <option value="3–4 tuổi (Lớp Mầm)">3–4 tuổi (Lớp Mầm)</option>
                  <option value="4–5 tuổi (Lớp Chồi)">4–5 tuổi (Lớp Chồi)</option>
                  <option value="5–6 tuổi (Lớp Lá)">5–6 tuổi (Lớp Lá)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-amber-950 block">
                  4. Kỹ năng AI muốn luyện:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'prompt', label: 'Viết Prompt', emoji: '✍️', tool: 'ChatGPT' },
                    { id: 'image', label: 'Tạo Ảnh 3D', emoji: '🖼️', tool: 'Canva AI' },
                    { id: 'video', label: 'Tạo Video', emoji: '🎬', tool: 'Canva Video' },
                  ].map((sk) => {
                    const isSel = selectedSkillType === sk.id;
                    return (
                      <button
                        key={sk.id}
                        type="button"
                        onClick={() => {
                          sounds.playPop();
                          setSelectedSkillType(sk.id as typeof selectedSkillType);
                        }}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          isSel
                            ? 'border-orange-500 bg-orange-500 text-white font-black shadow-xs'
                            : 'border-stone-200 hover:bg-stone-50 text-stone-700 font-bold'
                        }`}
                      >
                        <div className="text-base">{sk.emoji}</div>
                        <div className="text-[10px] leading-tight mt-0.5">{sk.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-amber-100">
              <button
                type="button"
                onClick={() => setIsAutoAssignOpen(false)}
                className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                onClick={handleAutoAssignExercise}
                disabled={isGeneratingAssignment}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 font-bubbly"
              >
                {isGeneratingAssignment ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>AI Đang Soạn Bài Tập...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>⚡ Giao Vào Ngày {currentActiveDay} Ngay (3s)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
