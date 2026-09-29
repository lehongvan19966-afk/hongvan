import React, { useState, useRef } from 'react';
import { MamAiMascot } from '../components/MamAiMascot';
import {
  Globe,
  Volume2,
  Mic,
  Sparkles,
  Music,
  Gamepad2,
  Clock,
  Play,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { speakText, sounds } from '../utils/audioUtils';
import { generateEnglishBuddy } from '../services/aiService';
import { EnglishPlayZone } from '../components/EnglishPlayZone';

interface EnglishBuddyViewProps {
  initialTopic?: string;
  initialAgeGroup?: string;
}

export const EnglishBuddyView: React.FC<EnglishBuddyViewProps> = ({
  initialTopic = 'Khám phá quả cam',
  initialAgeGroup = '4–5 tuổi',
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [ageGroup, setAgeGroup] = useState(initialAgeGroup);
  const [isNotConfident, setIsNotConfident] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'lesson' | 'play_zone'>('lesson');

  // Active word for Pronunciation Coach
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingFeedback, setRecordingFeedback] = useState<string | null>(null);

  const playZoneRef = useRef<HTMLDivElement>(null);

  // Lesson data
  const [englishData, setEnglishData] = useState({
    topic: 'Khám phá quả cam (Orange)',
    ageGroup: '4–5 tuổi (Lớp Chồi)',
    vocabulary: [
      { word: 'Orange', ipa: '/ˈɒr.ɪndʒ/', viSpelling: 'O-rình-d', meaning: 'Quả cam / Màu cam', emoji: '🍊', usage: 'Cô giơ quả cam: "Look! An orange!"' },
      { word: 'Round', ipa: '/raʊnd/', viSpelling: 'Rao-n-đ', meaning: 'Tròn xoe', emoji: '⚪', usage: 'Hai tay cô vẽ vòng tròn trong không khí: "Big round shape!"' },
      { word: 'Sweet', ipa: '/swiːt/', viSpelling: 'X-uýt-t', meaning: 'Vị ngọt thanh', emoji: '😋', usage: 'Xoa bụng và mỉm cười: "Mmm, so sweet!"' },
      { word: 'Peel', ipa: '/piːl/', viSpelling: 'Pi-ồ', meaning: 'Bóc vỏ cam', emoji: '🤲', usage: 'Động tác bóc vỏ: "Let’s peel the orange!"' },
    ],
    classroomEnglish: [
      { phrase: 'Look at this!', meaning: 'Nhìn vào đây nào các bé!', bodyLanguage: 'Mắt mở to tò mò, ngón tay chỉ vào vật phẩm' },
      { phrase: 'Touch it, please!', meaning: 'Con hãy sờ thử nhé!', bodyLanguage: 'Đưa đồ vật lại gần tay bé nhẹ nhàng' },
      { phrase: 'Great job!', meaning: 'Bé làm tuyệt lắm!', bodyLanguage: 'Giơ 2 ngón tay cái và đập tay vui vẻ với bé' },
      { phrase: 'Clean hands, please!', meaning: 'Chúng mình lau sạch tay nào!', bodyLanguage: 'Động tác xoa 2 bàn tay vào nhau' },
    ],
    miniGame: {
      title: 'Pass the Magic Orange (Chuyền quả cam vui nhộn)',
      materials: '1 quả cam thật hoặc mô hình nhựa, bài nhạc thiếu nhi sôi động',
      howToPlay: 'Các bé ngồi thành vòng tròn chuyền quả cam theo điệu nhạc. Khi nhạc dừng, bé nào đang cầm quả cam sẽ cùng cả lớp hô to: "Orange! Sweet Orange!" và nhận sticker bé ngoan!',
    },
    chant: {
      title: 'Orange Chant (Đồng dao quả cam)',
      lines: [
        'Orange, orange, round and bright, 🍊',
        'Smell so sweet and taste so right! 😋',
        'Peel it, eat it, share with friend, 🤲',
        'Happy smiles that never end! ✨',
      ],
      action: 'Vỗ tay theo nhịp 2/4, lắc lư vai nhẹ nhàng',
    },
    routine: [
      { step: '1. Hello Song', time: '2 phút', description: 'Hát bài "Hello, hello, how are you today?" chào đón bé.' },
      { step: '2. Magic Discovery', time: '3 phút', description: 'Mở hộp bí mật xuất hiện từ mới kèm vật thật.' },
      { step: '3. Play & Move', time: '4 phút', description: 'Trò chơi vận động tương tác cùng bạn bè.' },
      { step: '4. Goodbye Hug', time: '1 phút', description: 'Cùng vẫy tay hát "See you soon!" ấm áp.' },
    ],
  });

  const handleGenerateNew = async (newTopic?: string) => {
    sounds.playPop();
    setIsLoading(true);
    setRecordingFeedback(null);
    try {
      const result = await generateEnglishBuddy(newTopic || topic, ageGroup);
      setEnglishData(result);
      sounds.playSuccess();
    } catch {
      sounds.playRetry();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecordSimulation = () => {
    sounds.playPop();
    setIsRecording(true);
    setRecordingFeedback(null);

    // Simulate 2 seconds recording & AI assessment
    setTimeout(() => {
      setIsRecording(false);
      sounds.playSuccess();
      const currentWord = englishData.vocabulary[activeWordIndex]?.word || 'Word';
      setRecordingFeedback(
        `🎉 Tuyệt vời cô ơi! Phát âm từ "${currentWord}" rất tự nhiên, chuẩn khẩu hình. Khi nói cô nhớ kết hợp biểu cảm tay để trẻ thích thú bắt chước nhé!`
      );
    }, 2200);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      {/* Top Banner - Warm Terracotta Theme */}
      <div className="bg-gradient-to-r from-amber-100/90 via-[#FFF8F0] to-orange-100/80 rounded-3xl p-5 sm:p-7 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(180,83,9,0.06)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-orange-700 text-xs font-black mb-2 shadow-2xs border border-orange-200">
            <Globe className="w-3.5 h-3.5 text-orange-500" />
            <span>English Buddy · Tiếng Anh Mầm Non Tự Nhiên</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight font-['Quicksand']">
            Tiếng Anh Đến Với Trẻ Thật Tự Nhiên
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
            Không học ngữ pháp hàn lâm · Ưu tiên vận động, nhịp điệu, hình ảnh & niềm vui
          </p>
        </div>

        {/* Toggle Mode: Tôi chưa tự tin tiếng Anh */}
        <div className="bg-white p-3 rounded-2xl border border-amber-200/90 shadow-2xs flex items-center gap-3">
          <div>
            <span className="text-xs font-black text-amber-950 block">
              Tôi chưa tự tin tiếng Anh
            </span>
            <span className="text-[10px] text-stone-500 font-medium">
              Hiện phiên âm tiếng Việt dễ đọc
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isNotConfident}
              onChange={(e) => setIsNotConfident(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>
      </div>

      {/* Module Mode Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-amber-100/60 rounded-2xl border border-amber-200/80 w-fit">
        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('lesson');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'lesson'
              ? 'bg-white text-amber-950 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <BookOpen className="w-4 h-4 text-orange-600" />
          <span>Bài Học & Phát Âm</span>
        </button>

        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('play_zone');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'play_zone'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Gamepad2 className="w-4 h-4 text-amber-400" />
          <span>🎮 Bé Luyện Tập – English Play</span>
          <span className="text-[10px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full font-black">
            7 Games
          </span>
        </button>
      </div>

      {/* Quick Topic Search / Generate */}
      <div className="bg-white/95 rounded-3xl p-4 sm:p-5 border border-amber-200/80 shadow-[0_4px_16px_rgba(180,83,9,0.05)] flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:flex-1">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Nhập chủ đề muốn tích hợp tiếng Anh (vd: Quả cam, Gia đình, Động vật...)"
            className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200/80 text-xs sm:text-sm font-bold text-amber-950 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white"
          />
        </div>

        <button
          onClick={() => handleGenerateNew()}
          disabled={isLoading}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
        >
          {isLoading ? (
            <span>Đang tạo nội dung...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Tạo gói tiếng Anh AI</span>
            </>
          )}
        </button>
      </div>

      {/* Main Content Layout */}
      {activeTab === 'play_zone' ? (
        <div ref={playZoneRef} className="space-y-4 animate-fadeIn">
          <EnglishPlayZone
            vocabulary={englishData.vocabulary}
            topicTitle={englishData.topic}
            currentAgeGroup={ageGroup}
            onClose={() => setActiveTab('lesson')}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Pronunciation Coach & Vocab list */}
        <div className="lg:col-span-2 space-y-6">
          {/* PRONUNCIATION COACH CARD */}
          <div className="bg-gradient-to-br from-white via-amber-50/40 to-orange-50/50 rounded-3xl p-5 sm:p-6 border border-amber-200/90 shadow-[0_4px_16px_rgba(180,83,9,0.05)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎙️</span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-amber-950 tracking-tight font-['Quicksand']">
                    Pronunciation Coach · Luyện Phát Âm Cùng Mầm AI
                  </h3>
                  <p className="text-[11px] text-stone-500 font-medium">
                    Nghe mẫu bản xứ chuẩn xác, nghe chậm & thu âm AI phản hồi tức thì
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-orange-800 bg-orange-100 px-2.5 py-1 rounded-full border border-orange-200">
                AI Coach
              </span>
            </div>

            {/* Current Active Word Highlight Box */}
            {englishData.vocabulary[activeWordIndex] && (
              <div className="p-4 sm:p-6 bg-white rounded-2xl border border-amber-200/80 text-center space-y-3 shadow-2xs">
                <span className="text-4xl sm:text-5xl block animate-bounce">
                  {englishData.vocabulary[activeWordIndex].emoji || '🍊'}
                </span>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight font-['Quicksand']">
                    {englishData.vocabulary[activeWordIndex].word}
                  </h2>

                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-xs sm:text-sm font-mono text-stone-500 font-bold">
                      {englishData.vocabulary[activeWordIndex].ipa}
                    </span>
                    {isNotConfident && (
                      <span className="text-xs font-black text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                        Đọc như: {englishData.vocabulary[activeWordIndex].viSpelling || englishData.vocabulary[activeWordIndex].word}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-black text-orange-700 mt-1">
                    Nghĩa: {englishData.vocabulary[activeWordIndex].meaning}
                  </p>
                </div>

                {/* Practical Tip for Class */}
                <div className="text-xs text-stone-700 bg-amber-50 p-3 rounded-xl border border-amber-200/80 text-left font-medium">
                  💡 <strong className="text-amber-950 font-black">Gợi ý khi dạy trẻ:</strong> {englishData.vocabulary[activeWordIndex].usage}
                </div>

                {/* Pronunciation Action Controls */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {/* Normal Speed */}
                  <button
                    onClick={() => {
                      sounds.playPop();
                      speakText(englishData.vocabulary[activeWordIndex].word, 1.0);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>🔊 Nghe mẫu</span>
                  </button>

                  {/* Slow Speed 0.7x */}
                  <button
                    onClick={() => {
                      sounds.playPop();
                      speakText(englishData.vocabulary[activeWordIndex].word, 0.7);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>🐢 Nghe chậm</span>
                  </button>

                  {/* Mic Recording */}
                  <button
                    onClick={handleRecordSimulation}
                    disabled={isRecording}
                    className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                      isRecording
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>{isRecording ? 'Đang lắng nghe cô...' : '🎙 Thu âm thử'}</span>
                  </button>
                </div>

                {/* Feedback Box */}
                {recordingFeedback && (
                  <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 text-left animate-fadeIn font-medium">
                    {recordingFeedback}
                  </div>
                )}
              </div>
            )}

            {/* List of Vocabulary Selector Pills (Islands) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {englishData.vocabulary.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sounds.playPop();
                    setActiveWordIndex(idx);
                    setRecordingFeedback(null);
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    activeWordIndex === idx
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-orange-600 shadow-sm'
                      : 'bg-white hover:bg-amber-50/60 border-amber-200/70 text-stone-700'
                  }`}
                >
                  <span className="text-lg block">{item.emoji || '🌸'}</span>
                  <span className="font-black text-xs block truncate">{item.word}</span>
                  <span
                    className={`text-[10px] block truncate font-medium ${
                      activeWordIndex === idx ? 'text-amber-100' : 'text-stone-400'
                    }`}
                  >
                    {item.meaning}
                  </span>
                </button>
              ))}
            </div>

            {/* XXII-B. AI TỰ TẠO TRÒ CHƠI TỪ BÀI ENGLISH BUDDY */}
            <div className="pt-3 border-t border-amber-100">
              <button
                onClick={() => {
                  sounds.playSuccess();
                  setActiveTab('play_zone');
                  setTimeout(() => {
                    playZoneRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-sm shadow-md shadow-emerald-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-400"
              >
                <Gamepad2 className="w-5 h-5 text-amber-200 animate-bounce" />
                <span>🎮 TẠO TRÒ CHƠI ÔN LUYỆN</span>
                <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold ml-1 text-emerald-100">
                  7 Trò chơi tương tác · {englishData.vocabulary.length} từ vựng
                </span>
              </button>
            </div>
          </div>

          {/* CLASSROOM ENGLISH PHRASES */}
          <div className="bg-white/95 rounded-3xl p-5 border border-amber-200/80 shadow-[0_4px_16px_rgba(180,83,9,0.05)] space-y-3">
            <h3 className="text-sm font-black text-amber-950 tracking-tight flex items-center gap-2 font-['Quicksand']">
              <span>Khẩu Lệnh Lớp Học Thân Thiện (Classroom English)</span>
              <span className="text-xs text-stone-400 font-normal">(Ngắn gọn, dễ bắt chước)</span>
            </h3>

            <div className="space-y-2.5">
              {englishData.classroomEnglish.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-amber-50/40 hover:bg-orange-50/70 border border-amber-100 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-amber-950">
                        {item.phrase}
                      </span>
                      <button
                        onClick={() => speakText(item.phrase)}
                        className="text-orange-600 hover:text-orange-800 p-1 cursor-pointer"
                        title="Nghe phát âm"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs font-bold text-orange-700 block">
                      {item.meaning}
                    </span>
                    <span className="text-[11px] text-stone-600 block mt-0.5 font-medium">
                      Động tác cơ thể: {item.bodyLanguage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Mini Game, Chant & Routine */}
        <div className="space-y-6">
          {/* Mini Game Box */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-5 border border-amber-200/90 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-black text-amber-950 font-['Quicksand']">
                {englishData.miniGame.title}
              </h3>
            </div>
            <div className="text-xs space-y-1.5 text-stone-700 font-medium">
              <p>
                <strong className="text-amber-950">Đồ dùng:</strong> {englishData.miniGame.materials}
              </p>
              <p className="leading-relaxed">
                <strong className="text-amber-950">Cách chơi:</strong> {englishData.miniGame.howToPlay}
              </p>
            </div>
          </div>

          {/* Chant / Song Box */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-5 border border-amber-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-orange-600" />
                <h3 className="text-sm font-black text-amber-950 font-['Quicksand']">
                  {englishData.chant.title}
                </h3>
              </div>
              <button
                onClick={() => speakText(englishData.chant.lines.join('. '))}
                className="px-2.5 py-1 rounded-xl bg-orange-600 text-white text-[11px] font-black shadow-2xs flex items-center gap-1 hover:bg-orange-700 transition-all cursor-pointer"
              >
                <Play className="w-3 h-3" />
                <span>Nghe chant</span>
              </button>
            </div>

            <div className="p-3 bg-white/90 rounded-2xl border border-amber-200/80 space-y-1 text-center font-black text-xs text-amber-950">
              {englishData.chant.lines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <p className="text-[11px] text-stone-600 italic font-medium">
              💡 {englishData.chant.action}
            </p>
          </div>

          {/* 4-Step Routine */}
          <div className="bg-white/95 rounded-3xl p-5 border border-amber-200/80 shadow-2xs space-y-3">
            <h3 className="text-sm font-black text-amber-950 flex items-center gap-2 font-['Quicksand']">
              <Clock className="w-4 h-4 text-orange-600" />
              <span>English Routine (10 phút mỗi ngày)</span>
            </h3>

            <div className="space-y-2">
              {englishData.routine.map((r, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-amber-50/40 border border-amber-100 flex items-start gap-2.5 text-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-900 font-black flex items-center justify-center shrink-0 text-[10px]">
                    {i + 1}
                  </span>
                  <div>
                    <span className="font-black text-amber-950">{r.step}</span>
                    <span className="text-[10px] text-stone-400 ml-1.5 font-bold">({r.time})</span>
                    <p className="text-stone-600 text-[11px] mt-0.5 font-medium">{r.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Play Zone at bottom of lesson view */}
      <div ref={playZoneRef} className="pt-4">
        <EnglishPlayZone
          vocabulary={englishData.vocabulary}
          topicTitle={englishData.topic}
          currentAgeGroup={ageGroup}
        />
      </div>
    </>
  )}
</div>
  );
};
