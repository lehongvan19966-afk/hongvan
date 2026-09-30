import React, { useState, useEffect, useRef, useId } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Star,
  Trophy,
  Heart,
  Palette,
  Eye,
  Headphones,
  Layers,
  Edit3,
  Shuffle,
  Grid,
  HelpCircle,
  Play
} from 'lucide-react';
import { speakText, sounds } from '../utils/audioUtils';
import { MamAiMascot } from './MamAiMascot';
import { StickerItem, GameHonorRecord, KidRank } from '../types/englishBuddy';
import { PRESCHOOL_STICKERS, INITIAL_HONOR_LEADERBOARD } from '../data/stickersData';
import { saveTodayGameRecord, getTodayGameRecords } from '../services/englishHonorStorage';
import { KidNameModal } from './KidNameModal';
import { HonorCelebrationModal } from './HonorCelebrationModal';
import { StickerBackpackModal } from './StickerBackpackModal';

export interface VocabItem {
  word: string;
  ipa?: string;
  viSpelling?: string;
  meaning: string;
  emoji?: string;
  usage?: string;
}

interface EnglishPlayZoneProps {
  vocabulary: VocabItem[];
  topicTitle: string;
  currentAgeGroup?: string;
  onClose?: () => void;
}

type GameType =
  | 'look_and_choose'
  | 'listen_and_choose'
  | 'word_to_picture'
  | 'trace_letter'
  | 'build_word'
  | 'first_letter'
  | 'memory_cards';

export const EnglishPlayZone: React.FC<EnglishPlayZoneProps> = ({
  vocabulary,
  topicTitle,
  currentAgeGroup = '4–5 tuổi',
  onClose,
}) => {
  // Ensure we have valid items
  const validVocab = vocabulary && vocabulary.length > 0
    ? vocabulary
    : [
        { word: 'Apple', meaning: 'Quả táo', emoji: '🍎', ipa: '/ˈæp.əl/' },
        { word: 'Banana', meaning: 'Quả chuối', emoji: '🍌', ipa: '/bəˈnæn.ə/' },
        { word: 'Orange', meaning: 'Quả cam', emoji: '🍊', ipa: '/ˈɒr.ɪndʒ/' },
        { word: 'Cat', meaning: 'Con mèo', emoji: '🐱', ipa: '/kæt/' },
        { word: 'Dog', meaning: 'Con chó', emoji: '🐶', ipa: '/dɒɡ/' },
      ];

  const [activeGame, setActiveGame] = useState<GameType>('look_and_choose');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedAge, setSelectedAge] = useState<string>(currentAgeGroup);

  // Kid Profile, Scoring & Sticker State
  const [kidName, setKidName] = useState<string>(() => {
    try {
      return localStorage.getItem('english_buddy_kid_name') || 'Bé Bống';
    } catch {
      return 'Bé Bống';
    }
  });

  const [kidAvatar, setKidAvatar] = useState<string>(() => {
    try {
      return localStorage.getItem('english_buddy_kid_avatar') || '👧';
    } catch {
      return '👧';
    }
  });

  const [sessionScore, setSessionScore] = useState<number>(0);
  const [isKidNameModalOpen, setIsKidNameModalOpen] = useState<boolean>(false);
  const [isHonorModalOpen, setIsHonorModalOpen] = useState<boolean>(false);
  const [isBackpackModalOpen, setIsBackpackModalOpen] = useState<boolean>(false);
  const [currentHonorRecord, setCurrentHonorRecord] = useState<GameHonorRecord | null>(null);

  // Sync kid profile when selected from right-hand honor board
  useEffect(() => {
    const handleKidChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ name: string; avatar: string }>;
      if (customEvent.detail) {
        setKidName(customEvent.detail.name);
        setKidAvatar(customEvent.detail.avatar);
        setSessionScore(0);
      }
    };
    window.addEventListener('english_buddy_kid_changed', handleKidChange);
    return () => window.removeEventListener('english_buddy_kid_changed', handleKidChange);
  }, []);

  // Collected stickers
  const [collectedStickers, setCollectedStickers] = useState<StickerItem[]>(() => {
    try {
      const saved = localStorage.getItem('english_buddy_stickers');
      if (saved) return JSON.parse(saved);
      return [PRESCHOOL_STICKERS[0], PRESCHOOL_STICKERS[1]];
    } catch {
      return [PRESCHOOL_STICKERS[0], PRESCHOOL_STICKERS[1]];
    }
  });

  // Class leaderboard
  const [leaderboard, setLeaderboard] = useState<GameHonorRecord[]>(() => {
    try {
      const saved = localStorage.getItem('english_buddy_leaderboard');
      if (saved) return JSON.parse(saved);
      return INITIAL_HONOR_LEADERBOARD;
    } catch {
      return INITIAL_HONOR_LEADERBOARD;
    }
  });

  // Filter recommendations based on age
  const getGameRecommendation = (game: GameType) => {
    if (selectedAge.includes('3–4') || selectedAge.includes('Nhà trẻ')) {
      if (['listen_and_choose', 'look_and_choose', 'word_to_picture'].includes(game)) {
        return '⭐ Rất phù hợp 3–4 tuổi';
      }
      return 'Dành cho trẻ lớn hơn';
    }
    if (selectedAge.includes('4–5')) {
      if (['look_and_choose', 'listen_and_choose', 'word_to_picture', 'first_letter', 'trace_letter'].includes(game)) {
        return '⭐ Chuẩn độ tuổi 4–5';
      }
      return 'Thử thách nâng cao';
    }
    return '⭐ Phù hợp 5–6 tuổi';
  };

  const fireCelebration = () => {
    sounds.playSuccess();
    setSessionScore((prev) => prev + 20);
    try {
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#f97316', '#eab308', '#22c55e', '#3b82f6', '#ec4899'],
      });
    } catch {
      // fallback safe
    }
  };

  const getGameTitle = (game: GameType) => {
    switch (game) {
      case 'look_and_choose': return 'Nhìn & Chọn từ';
      case 'listen_and_choose': return 'Nghe & Chọn hình';
      case 'word_to_picture': return 'Ghép từ với hình';
      case 'trace_letter': return 'Bé tô chữ cái';
      case 'build_word': return 'Xếp chữ thành từ';
      case 'first_letter': return 'Tìm chữ cái đầu';
      case 'memory_cards': return 'Lật thẻ ghi nhớ';
      default: return 'Trò chơi tiếng Anh';
    }
  };

  // Hoàn thành lượt chơi, tính điểm, xếp loại vinh danh và tặng sticker
  const handleFinishRound = () => {
    if (!kidName.trim()) {
      setIsKidNameModalOpen(true);
      return;
    }

    const calculatedScore = sessionScore > 0 ? sessionScore : 60;
    const finalScore = Math.min(calculatedScore, 100);
    const maxScore = 100;
    const rank: KidRank = finalScore >= 80 ? 'xuat_sac' : finalScore >= 60 ? 'gioi' : 'kha';
    const stars = finalScore >= 80 ? 3 : finalScore >= 60 ? 2 : 1;
    const rankTitle =
      rank === 'xuat_sac'
        ? '🌟 XUẤT SẮC - Ngôi Sao Tiếng Anh Nhí'
        : rank === 'gioi'
        ? '🌸 GIỎI - Bé Siêu Cố Gắng'
        : '🌼 KHÁ - Bé Tiến Bộ Vượt Bậc';

    // Pick next uncollected sticker or random
    const uncollected = PRESCHOOL_STICKERS.filter(
      (s) => !collectedStickers.some((cs) => cs.id === s.id)
    );
    const newSticker =
      uncollected.length > 0
        ? uncollected[Math.floor(Math.random() * uncollected.length)]
        : PRESCHOOL_STICKERS[Math.floor(Math.random() * PRESCHOOL_STICKERS.length)];

    const updatedStickers = [
      ...collectedStickers,
      {
        ...newSticker,
        unlockedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setCollectedStickers(updatedStickers);
    try {
      localStorage.setItem('english_buddy_stickers', JSON.stringify(updatedStickers));
    } catch {}

    const newRecord: GameHonorRecord = {
      id: 'hon_' + Date.now(),
      kidName: kidName.trim(),
      kidAvatar: kidAvatar,
      gameTitle: getGameTitle(activeGame),
      score: finalScore,
      maxScore,
      stars,
      rank,
      rankTitle,
      stickerEarned: newSticker,
      timestamp: 'Vừa xong, ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setCurrentHonorRecord(newRecord);
    saveTodayGameRecord(newRecord);
    const updatedLeaderboard = [newRecord, ...leaderboard.slice(0, 19)];
    setLeaderboard(updatedLeaderboard);
    try {
      localStorage.setItem('english_buddy_leaderboard', JSON.stringify(updatedLeaderboard));
    } catch {}

    setIsHonorModalOpen(true);
  };

  const handleSaveKidName = (name: string, avatar: string) => {
    setKidName(name);
    setKidAvatar(avatar);
    setSessionScore(0);
    try {
      localStorage.setItem('english_buddy_kid_name', name);
      localStorage.setItem('english_buddy_kid_avatar', avatar);
    } catch {}
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`bg-[#FFFBF5] rounded-3xl border border-amber-200/90 shadow-[0_8px_30px_rgba(217,119,6,0.08)] overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none overflow-y-auto p-4 sm:p-8 bg-amber-50/95' : 'p-4 sm:p-6'
      }`}
    >
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black mb-1 border border-orange-200">
            <span className="text-sm">🎮</span>
            <span>BÉ LUYỆN TẬP – ENGLISH PLAY</span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-bold text-stone-600">
              {validVocab.length} từ vựng bài học
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-amber-950 font-['Quicksand'] flex items-center gap-2">
            <span>Chơi Vui Cùng Tiếng Anh</span>
            <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
              {topicTitle}
            </span>
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Nguyên tắc vàng: <strong className="text-orange-700">NGHE → NHÌN → CHƠI → LẶP LẠI → GHI NHỚ</strong> (Không áp lực điểm số, động viên tức thì)
          </p>
        </div>

        {/* Controls: Age Filter & Fullscreen */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Age selector */}
          <div className="flex items-center bg-white rounded-2xl border border-amber-200 p-1 text-xs shadow-2xs">
            <span className="px-2 text-stone-500 font-bold text-[11px]">Độ tuổi:</span>
            {['3–4 tuổi', '4–5 tuổi', '5–6 tuổi'].map((age) => (
              <button
                key={age}
                onClick={() => {
                  sounds.playPop();
                  setSelectedAge(age);
                }}
                className={`px-2.5 py-1 rounded-xl font-black transition-all cursor-pointer ${
                  selectedAge === age
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {age}
              </button>
            ))}
          </div>

          {/* Fullscreen Button for Classroom Projection */}
          <button
            onClick={toggleFullscreen}
            className="px-3.5 py-2 rounded-2xl bg-white hover:bg-amber-50 text-amber-900 font-bold text-xs border border-amber-200/90 shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all"
            title="Chiếu toàn màn hình lên tivi / máy chiếu lớp học"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-orange-600" /> : <Maximize2 className="w-4 h-4 text-orange-600" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Thu nhỏ' : 'Chiếu Tivi/Kiosk'}</span>
          </button>

          {onClose && !isFullscreen && (
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs cursor-pointer transition-all"
            >
              Đóng
            </button>
          )}
        </div>
      </div>

      {/* KID PROFILE, SCORING & STICKER ACTION BAR */}
      <div className="my-3 p-3 sm:p-3.5 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-2xl border-2 border-orange-200/90 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Kid Info with Name input trigger */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              sounds.playPop();
              setIsKidNameModalOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-orange-50 rounded-xl border border-orange-200 shadow-2xs transition-all cursor-pointer hover:scale-102 group"
            title="Bấm để đổi tên hoặc chọn hình bé trước khi chơi"
          >
            <span className="text-2xl filter drop-shadow-xs">{kidAvatar}</span>
            <div className="text-left">
              <span className="text-[10px] font-bold text-stone-400 block leading-tight">
                Bé đang luyện tập:
              </span>
              <span className="font-black font-bubbly text-xs sm:text-sm text-stone-900 group-hover:text-orange-600 block leading-tight">
                {kidName || 'Chưa nhập tên bé (Bấm để nhập)'} ✏️
              </span>
            </div>
          </button>
        </div>

        {/* Live Score & Backpack & Leaderboard & Finish Round */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Live Score Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-amber-200 shadow-2xs font-bubbly text-xs font-black text-amber-900">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400 animate-pulse" />
            <span>Điểm bé:</span>
            <span className="text-sm font-black text-orange-600">{sessionScore} đ</span>
          </div>

          {/* Sticker Backpack Trigger */}
          <button
            onClick={() => {
              sounds.playPop();
              setIsBackpackModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-amber-50 rounded-xl border border-amber-200 shadow-2xs font-bubbly text-xs font-black text-stone-800 transition-all cursor-pointer hover:scale-102"
            title="Xem bộ sưu tập sticker bé đã đạt được"
          >
            <span className="text-sm">🎒</span>
            <span>Ba lô:</span>
            <span className="text-xs px-2 py-0.2 rounded-full bg-rose-100 text-rose-700 font-black">
              {collectedStickers.length} stickers
            </span>
          </button>

          {/* Leaderboard button */}
          <button
            onClick={() => {
              sounds.playPop();
              if (currentHonorRecord) {
                setIsHonorModalOpen(true);
              } else if (leaderboard.length > 0) {
                setCurrentHonorRecord(leaderboard[0]);
                setIsHonorModalOpen(true);
              } else {
                handleFinishRound();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-amber-50 rounded-xl border border-amber-200 shadow-2xs font-bubbly text-xs font-black text-amber-900 transition-all cursor-pointer hover:scale-102"
            title="Bảng vàng vinh danh cả lớp"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Bảng Vàng 🏆</span>
          </button>

          {/* Finish Round & Honor Button */}
          <button
            onClick={() => {
              sounds.playSuccess();
              handleFinishRound();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl shadow-md shadow-orange-500/25 font-bubbly text-xs font-black transition-all cursor-pointer hover:scale-105 active:scale-95 border border-white"
            title="Hoàn thành lượt chơi để vinh danh xếp loại và nhận sticker mới"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Vinh danh & Nhận Sticker 🎁</span>
          </button>
        </div>
      </div>

      {/* Game Selection Menu Tabs */}
      <div className="py-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 min-w-max pb-1">
          <GameTabButton
            active={activeGame === 'look_and_choose'}
            icon={<Eye className="w-4 h-4" />}
            title="1. Nhìn & Chọn từ"
            subtitle="Look & Choose"
            badge="Phổ biến"
            onClick={() => {
              sounds.playPop();
              setActiveGame('look_and_choose');
            }}
          />

          <GameTabButton
            active={activeGame === 'listen_and_choose'}
            icon={<Headphones className="w-4 h-4" />}
            title="2. Nghe & Chọn hình"
            subtitle="Listen & Choose"
            badge="Dễ nhất"
            onClick={() => {
              sounds.playPop();
              setActiveGame('listen_and_choose');
            }}
          />

          <GameTabButton
            active={activeGame === 'word_to_picture'}
            icon={<Layers className="w-4 h-4" />}
            title="3. Ghép từ với hình"
            subtitle="Word to Picture"
            onClick={() => {
              sounds.playPop();
              setActiveGame('word_to_picture');
            }}
          />

          <GameTabButton
            active={activeGame === 'trace_letter'}
            icon={<Edit3 className="w-4 h-4" />}
            title="4. Bé tô chữ cái"
            subtitle="Trace the Letter"
            badge="Vận động tinh"
            onClick={() => {
              sounds.playPop();
              setActiveGame('trace_letter');
            }}
          />

          <GameTabButton
            active={activeGame === 'build_word'}
            icon={<Shuffle className="w-4 h-4" />}
            title="5. Xếp chữ thành từ"
            subtitle="Build the Word"
            badge="5-6 tuổi"
            onClick={() => {
              sounds.playPop();
              setActiveGame('build_word');
            }}
          />

          <GameTabButton
            active={activeGame === 'first_letter'}
            icon={<HelpCircle className="w-4 h-4" />}
            title="6. Tìm chữ cái đầu"
            subtitle="First Letter"
            onClick={() => {
              sounds.playPop();
              setActiveGame('first_letter');
            }}
          />

          <GameTabButton
            active={activeGame === 'memory_cards'}
            icon={<Grid className="w-4 h-4" />}
            title="7. Lật thẻ ghi nhớ"
            subtitle="Memory Cards"
            onClick={() => {
              sounds.playPop();
              setActiveGame('memory_cards');
            }}
          />
        </div>
      </div>

      {/* Game Stage Area */}
      <div className="mt-2 min-h-[440px] bg-white rounded-3xl border border-amber-200/80 p-4 sm:p-7 shadow-xs">
        {activeGame === 'look_and_choose' && (
          <GameLookAndChoose
            vocab={validVocab}
            onSuccess={fireCelebration}
            ageGroup={selectedAge}
          />
        )}

        {activeGame === 'listen_and_choose' && (
          <GameListenAndChoose
            vocab={validVocab}
            onSuccess={fireCelebration}
            ageGroup={selectedAge}
          />
        )}

        {activeGame === 'word_to_picture' && (
          <GameWordToPicture
            vocab={validVocab}
            onSuccess={fireCelebration}
            ageGroup={selectedAge}
          />
        )}

        {activeGame === 'trace_letter' && (
          <GameTraceLetter
            vocab={validVocab}
            onSuccess={fireCelebration}
            ageGroup={selectedAge}
          />
        )}

        {activeGame === 'build_word' && (
          <GameBuildWord
            vocab={validVocab}
            onSuccess={fireCelebration}
            ageGroup={selectedAge}
          />
        )}

        {activeGame === 'first_letter' && (
          <GameFirstLetter
            vocab={validVocab}
            onSuccess={fireCelebration}
            ageGroup={selectedAge}
          />
        )}

        {activeGame === 'memory_cards' && (
          <GameMemoryCards
            vocab={validVocab}
            onSuccess={fireCelebration}
            ageGroup={selectedAge}
          />
        )}
      </div>

      {/* Classroom Teaching Philosophy Footer */}
      <div className="mt-4 p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/70 flex items-center justify-between text-xs text-stone-700">
        <div className="flex items-center gap-2">
          <span className="text-base">🌱</span>
          <span className="italic font-medium">
            &ldquo;HỌC TIẾNG ANH MẦM NON THÔNG QUA TRẢI NGHIỆM, HÌNH ẢNH, ÂM THANH VÀ TRÒ CHƠI – KHÔNG BIẾN ENGLISH BUDDY THÀNH MỘT TIẾT HỌC NGỮ PHÁP.&rdquo;
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-stone-500 font-bold shrink-0">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>Vườn Ươm AI</span>
        </div>
      </div>

      {/* 1. Modal Nhập Tên Bé Trước Khi Chơi */}
      <KidNameModal
        isOpen={isKidNameModalOpen}
        onClose={() => setIsKidNameModalOpen(false)}
        currentName={kidName}
        currentAvatar={kidAvatar}
        onSave={handleSaveKidName}
      />

      {/* 2. Modal Xếp Loại Vinh Danh & Nhận Sticker */}
      <HonorCelebrationModal
        isOpen={isHonorModalOpen}
        onClose={() => setIsHonorModalOpen(false)}
        record={currentHonorRecord}
        onPlayAgain={() => {
          setIsHonorModalOpen(false);
          setSessionScore(0);
        }}
        onChangeKid={() => {
          setIsHonorModalOpen(false);
          setIsKidNameModalOpen(true);
        }}
        onOpenBackpack={() => {
          setIsHonorModalOpen(false);
          setIsBackpackModalOpen(true);
        }}
        leaderboard={leaderboard}
      />

      {/* 3. Modal Ba Lô Sticker Của Bé */}
      <StickerBackpackModal
        isOpen={isBackpackModalOpen}
        onClose={() => setIsBackpackModalOpen(false)}
        kidName={kidName || 'Bé Yêu'}
        kidAvatar={kidAvatar}
        collectedStickers={collectedStickers}
        totalScore={sessionScore}
      />
    </div>
  );
};

// Sub-Component: Game Tab Button
const GameTabButton: React.FC<{
  active: boolean;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: string;
  onClick: () => void;
}> = ({ active, icon, title, subtitle, badge, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2.5 rounded-2xl text-left transition-all flex items-center gap-2.5 border cursor-pointer ${
        active
          ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-orange-600 shadow-md scale-[1.02]'
          : 'bg-white hover:bg-amber-50/70 border-amber-200 text-stone-700 shadow-2xs'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
          active ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-600'
        }`}
      >
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="font-black text-xs block leading-tight">{title}</span>
          {badge && (
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold ${
                active ? 'bg-white/25 text-amber-100' : 'bg-orange-100 text-orange-800'
              }`}
            >
              {badge}
            </span>
          )}
        </div>
        <span
          className={`text-[10px] block leading-tight font-medium ${
            active ? 'text-amber-100' : 'text-stone-400'
          }`}
        >
          {subtitle}
        </span>
      </div>
    </button>
  );
};

// ==========================================
// GAME 1: LOOK & CHOOSE (Nhìn hình – Chọn từ)
// ==========================================
const GameLookAndChoose: React.FC<{
  vocab: VocabItem[];
  onSuccess: () => void;
  ageGroup: string;
}> = ({ vocab, onSuccess }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [mascotMessage, setMascotMessage] = useState<string>('Bé hãy nhìn hình và chọn từ tiếng Anh đúng nhé!');

  const currentItem = vocab[currentIndex % vocab.length];

  // Generate 3 choices: 1 correct + 2 wrong
  const choices = React.useMemo(() => {
    const wrong = vocab.filter((v) => v.word !== currentItem.word);
    const shuffledWrong = [...wrong].sort(() => 0.5 - Math.random()).slice(0, 2);
    const list = [currentItem, ...shuffledWrong];
    return list.sort(() => 0.5 - Math.random());
  }, [currentIndex, currentItem, vocab]);

  useEffect(() => {
    setFeedback('idle');
    setMascotMessage('Bé hãy nhìn hình và chọn từ tiếng Anh đúng nhé!');
  }, [currentIndex]);

  const handleSelect = (choice: VocabItem) => {
    sounds.playPop();
    if (choice.word.toLowerCase() === currentItem.word.toLowerCase()) {
      setFeedback('correct');
      setMascotMessage(`⭐ Great job! ${currentItem.word} – ${currentItem.meaning}`);
      speakText(currentItem.word);
      onSuccess();
    } else {
      sounds.playRetry();
      setFeedback('wrong');
      setMascotMessage(`🌱 Try again! Cô cùng bé thử lại nhé!`);
      // Soft audio repeat of current word to guide
      setTimeout(() => {
        speakText(currentItem.word);
      }, 400);
    }
  };

  const nextQuestion = () => {
    sounds.playPop();
    setCurrentIndex((prev) => (prev + 1) % vocab.length);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center text-center space-y-6">
      {/* Question Counter & Audio prompt */}
      <div className="flex items-center justify-between w-full">
        <span className="text-xs font-black text-orange-800 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
          Câu {currentIndex + 1} / {vocab.length}
        </span>
        <button
          onClick={() => speakText(currentItem.word)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs cursor-pointer transition-all"
        >
          <Volume2 className="w-4 h-4 text-orange-600" />
          <span>🔊 Nghe gợi ý</span>
        </button>
      </div>

      {/* Big Picture / Emoji Display */}
      <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-gradient-to-b from-amber-50 to-orange-100/60 border-2 border-dashed border-amber-300 flex items-center justify-center shadow-inner relative group">
        <span className="text-7xl sm:text-8xl select-none filter drop-shadow-md group-hover:scale-110 transition-transform">
          {currentItem.emoji || '🌟'}
        </span>
        {feedback === 'correct' && (
          <div className="absolute inset-0 bg-emerald-500/10 rounded-3xl flex items-center justify-center backdrop-blur-2xs animate-fadeIn">
            <span className="text-5xl animate-bounce">⭐</span>
          </div>
        )}
      </div>

      {/* Mascot Message & Guidance */}
      <div className="flex items-center gap-3 bg-amber-50/80 px-4 py-2.5 rounded-2xl border border-amber-200 text-xs text-amber-950 font-bold max-w-md">
        <MamAiMascot mood={feedback === 'correct' ? 'celebrate' : feedback === 'wrong' ? 'teaching' : 'happy'} size="sm" />
        <p className="text-left">{mascotMessage}</p>
      </div>

      {/* Answer Options: Big Buttons for Kids */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
        {choices.map((c, idx) => {
          const isSelected = feedback === 'correct' && c.word === currentItem.word;
          return (
            <button
              key={idx}
              disabled={feedback === 'correct'}
              onClick={() => handleSelect(c)}
              className={`py-4 px-3 rounded-2xl font-black text-base sm:text-lg tracking-wide uppercase transition-all shadow-sm cursor-pointer border-2 ${
                isSelected
                  ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-emerald-500/30'
                  : 'bg-white hover:bg-orange-50 text-amber-950 border-amber-200 hover:border-orange-400 active:scale-95'
              }`}
            >
              <span className="block">{c.word}</span>
              {feedback === 'correct' && c.word === currentItem.word && (
                <span className="text-xs text-emerald-100 block normal-case font-medium mt-0.5">
                  {c.meaning}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Next Question Button */}
      {feedback === 'correct' && (
        <button
          onClick={nextQuestion}
          className="mt-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer animate-bounce"
        >
          <span>Bé làm giỏi quá! Tiếp tục nào</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// ==========================================
// GAME 2: LISTEN & CHOOSE (Nghe & Chọn hình)
// ==========================================
const GameListenAndChoose: React.FC<{
  vocab: VocabItem[];
  onSuccess: () => void;
  ageGroup: string;
}> = ({ vocab, onSuccess }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const currentItem = vocab[currentIndex % vocab.length];

  // Generate 4 picture choices
  const choices = React.useMemo(() => {
    const wrong = vocab.filter((v) => v.word !== currentItem.word);
    const shuffledWrong = [...wrong].sort(() => 0.5 - Math.random()).slice(0, 3);
    const list = [currentItem, ...shuffledWrong];
    return list.sort(() => 0.5 - Math.random());
  }, [currentIndex, currentItem, vocab]);

  // Auto speak on question load
  useEffect(() => {
    setFeedback('idle');
    setSelectedWord(null);
    const timer = setTimeout(() => {
      speakText(currentItem.word);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentIndex, currentItem]);

  const handleChoose = (choice: VocabItem) => {
    sounds.playPop();
    setSelectedWord(choice.word);
    if (choice.word.toLowerCase() === currentItem.word.toLowerCase()) {
      setFeedback('correct');
      speakText(currentItem.word);
      onSuccess();
    } else {
      sounds.playRetry();
      setFeedback('wrong');
      setTimeout(() => {
        speakText(currentItem.word);
      }, 500);
    }
  };

  const nextQuestion = () => {
    sounds.playPop();
    setCurrentIndex((prev) => (prev + 1) % vocab.length);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center text-center space-y-6">
      <div className="flex items-center justify-between w-full">
        <span className="text-xs font-black text-orange-800 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
          Câu {currentIndex + 1} / {vocab.length}
        </span>
        <span className="text-xs text-stone-500 font-bold">
          Chạm vào loa để nghe lại bao nhiêu lần cũng được!
        </span>
      </div>

      {/* Speaker Card Hero */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-300 text-center w-full max-w-md shadow-xs space-y-3">
        <button
          onClick={() => {
            sounds.playPop();
            speakText(currentItem.word);
          }}
          className="w-20 h-20 mx-auto rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 hover:scale-110 active:scale-95 transition-all cursor-pointer animate-pulse"
          title="Nghe lại âm thanh"
        >
          <Volume2 className="w-10 h-10" />
        </button>

        <div>
          <h3 className="text-sm font-black text-amber-950 font-['Quicksand']">
            Bé hãy lắng nghe thật kỹ:
          </h3>
          <p className="text-xs text-orange-800 font-bold mt-0.5">
            &ldquo;Đố bé từ này tương ứng với hình nào ở dưới?&rdquo;
          </p>
        </div>
      </div>

      {/* Mascot feedback */}
      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-amber-200 text-xs text-amber-950 font-bold">
        <MamAiMascot mood={feedback === 'correct' ? 'celebrate' : feedback === 'wrong' ? 'teaching' : 'happy'} size="sm" />
        <span>
          {feedback === 'correct'
            ? `⭐ Excellent! Đúng rồi, đó là "${currentItem.word} (${currentItem.meaning})"!`
            : feedback === 'wrong'
            ? '🌱 Bé thử chọn lại hình khác nhé, bấm vào loa để nghe lại nè!'
            : 'Bé bấm vào hình tròn có quả / đồ vật tương ứng nhé!'}
        </span>
      </div>

      {/* Picture Choices: Oversized touch cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
        {choices.map((c, idx) => {
          const isChosen = selectedWord === c.word;
          const isCorrect = feedback === 'correct' && c.word === currentItem.word;
          return (
            <button
              key={idx}
              onClick={() => handleChoose(c)}
              className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-sm ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-500 scale-105 shadow-emerald-500/20'
                  : 'bg-white hover:bg-amber-50/80 border-amber-200 hover:border-orange-400 active:scale-95'
              }`}
            >
              <span className="text-6xl select-none filter drop-shadow-sm transition-transform hover:scale-110">
                {c.emoji || '🌸'}
              </span>
              {feedback === 'correct' && (
                <span className="font-black text-xs text-emerald-800 uppercase tracking-wide">
                  {c.word}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {feedback === 'correct' && (
        <button
          onClick={nextQuestion}
          className="mt-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer animate-bounce"
        >
          <span>⭐ Câu tiếp theo nào</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// ==========================================
// GAME 3: WORD TO PICTURE (Ghép từ với hình)
// ==========================================
const GameWordToPicture: React.FC<{
  vocab: VocabItem[];
  onSuccess: () => void;
  ageGroup: string;
}> = ({ vocab, onSuccess }) => {
  // Use 4 items at a time
  const currentSet = React.useMemo(() => {
    return [...vocab].slice(0, 4);
  }, [vocab]);

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matchedWords, setMatchedWords] = useState<string[]>([]);
  const [shuffledPictures, setShuffledPictures] = useState<VocabItem[]>([]);

  useEffect(() => {
    setMatchedWords([]);
    setSelectedWord(null);
    setShuffledPictures([...currentSet].sort(() => 0.5 - Math.random()));
  }, [currentSet]);

  const handleSelectWord = (word: string) => {
    sounds.playPop();
    if (matchedWords.includes(word)) return;
    setSelectedWord(word);
    speakText(word);
  };

  const handleSelectPicture = (item: VocabItem) => {
    sounds.playPop();
    if (matchedWords.includes(item.word)) return;

    if (!selectedWord) {
      // Guide kid to select a word first or play picture name
      speakText(item.word);
      return;
    }

    if (selectedWord.toLowerCase() === item.word.toLowerCase()) {
      // Match found!
      sounds.playSuccess();
      const updated = [...matchedWords, item.word];
      setMatchedWords(updated);
      setSelectedWord(null);
      speakText(item.word);

      if (updated.length === currentSet.length) {
        onSuccess();
      }
    } else {
      sounds.playRetry();
      setSelectedWord(null);
    }
  };

  const resetGame = () => {
    sounds.playPop();
    setMatchedWords([]);
    setSelectedWord(null);
    setShuffledPictures([...currentSet].sort(() => 0.5 - Math.random()));
  };

  const isCompleted = matchedWords.length === currentSet.length;

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-center">
      <div>
        <h3 className="text-base font-black text-amber-950 font-['Quicksand']">
          Ghép Từ Tiếng Anh Với Hình Tương Ứng
        </h3>
        <p className="text-xs text-stone-600 mt-0.5">
          👉 <strong>Thao tác dễ cho bé:</strong> Chạm vào 1 từ tiếng Anh bên trái → rồi chạm vào hình tương ứng bên phải!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-8 items-center">
        {/* Left Column: Words */}
        <div className="space-y-3">
          <span className="text-xs font-black text-orange-800 bg-orange-100 px-3 py-1 rounded-full border border-orange-200 block mb-2">
            🔤 Thẻ chữ tiếng Anh
          </span>
          {currentSet.map((item, idx) => {
            const isMatched = matchedWords.includes(item.word);
            const isSelected = selectedWord === item.word;

            return (
              <button
                key={idx}
                disabled={isMatched}
                onClick={() => handleSelectWord(item.word)}
                className={`w-full p-3.5 rounded-2xl border-2 font-black text-sm uppercase transition-all flex items-center justify-between cursor-pointer ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800 opacity-60 cursor-default'
                    : isSelected
                    ? 'bg-orange-500 text-white border-orange-600 scale-105 shadow-md shadow-orange-500/25'
                    : 'bg-white hover:bg-amber-50 text-amber-950 border-amber-200'
                }`}
              >
                <span>{item.word}</span>
                {isMatched ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-stone-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Column: Pictures */}
        <div className="space-y-3">
          <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 block mb-2">
            🖼️ Hình ảnh trực quan
          </span>
          {shuffledPictures.map((item, idx) => {
            const isMatched = matchedWords.includes(item.word);

            return (
              <button
                key={idx}
                disabled={isMatched}
                onClick={() => handleSelectPicture(item)}
                className={`w-full p-2.5 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 cursor-pointer ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800 opacity-60 cursor-default'
                    : 'bg-white hover:bg-amber-50 border-amber-200 hover:border-orange-400'
                }`}
              >
                <span className="text-3xl select-none filter drop-shadow-2xs">{item.emoji || '🌟'}</span>
                <span className="text-xs font-bold text-stone-600">{item.meaning}</span>
                {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-auto" />}
              </button>
            );
          })}
        </div>
      </div>

      {isCompleted ? (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2 animate-fadeIn">
          <span className="text-3xl">🎉</span>
          <h4 className="text-base font-black text-emerald-950">Tuyệt vời! Bé đã ghép đúng toàn bộ!</h4>
          <button
            onClick={resetGame}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-sm hover:scale-105 cursor-pointer"
          >
            Chơi lại bàn này
          </button>
        </div>
      ) : (
        <div className="text-xs text-stone-500 font-medium">
          Đã ghép đúng: {matchedWords.length} / {currentSet.length}
        </div>
      )}
    </div>
  );
};

// ==========================================
// GAME 4: TRACE THE LETTER / WORD (Bé tô chữ)
// ==========================================
const GameTraceLetter: React.FC<{
  vocab: VocabItem[];
  onSuccess: () => void;
  ageGroup: string;
}> = ({ vocab, onSuccess, ageGroup }) => {
  const [vocabIndex, setVocabIndex] = useState(0);
  const [mode, setMode] = useState<'letter' | 'word'>('letter');
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  const currentItem = vocab[vocabIndex % vocab.length];
  const targetChar = currentItem.word.charAt(0).toUpperCase();
  const targetText = mode === 'letter' ? `${targetChar} ${targetChar.toLowerCase()}` : currentItem.word.toUpperCase();

  // Draw background template letter
  const renderTemplate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Subtle guide lines
    ctx.strokeStyle = '#fef3c7';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    ctx.beginPath();
    ctx.moveTo(20, canvas.height / 2);
    ctx.lineTo(canvas.width - 20, canvas.height / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(20, canvas.height * 0.25);
    ctx.lineTo(canvas.width - 20, canvas.height * 0.25);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(20, canvas.height * 0.75);
    ctx.lineTo(canvas.width - 20, canvas.height * 0.75);
    ctx.stroke();

    ctx.setLineDash([]);

    // Dotted template letter
    ctx.fillStyle = '#fcd34d';
    ctx.font = mode === 'letter' ? 'bold 120px "Quicksand", sans-serif' : 'bold 50px "Quicksand", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(targetText, canvas.width / 2, canvas.height / 2);

    // Outline dotted
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.setLineDash([4, 6]);
    ctx.strokeText(targetText, canvas.width / 2, canvas.height / 2);
    ctx.setLineDash([]);
  };

  useEffect(() => {
    renderTemplate();
    setHasDrawn(false);
    setIsCompleted(false);
  }, [vocabIndex, mode, targetText]);

  // Canvas drawing handlers (mouse & touch)
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    setHasDrawn(true);
    draw(e);
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#f97316'; // kid-friendly vibrant orange

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleFinish = () => {
    sounds.playSuccess();
    setIsCompleted(true);
    onSuccess();
    speakText(targetChar);
    setTimeout(() => {
      speakText(`${targetChar} - ${currentItem.word}`);
    }, 800);
  };

  const handleClear = () => {
    sounds.playPop();
    renderTemplate();
    setHasDrawn(false);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center text-center space-y-4">
      {/* Mode toggle */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('letter')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
              mode === 'letter' ? 'bg-orange-500 text-white' : 'bg-stone-100 text-stone-700'
            }`}
          >
            Tô chữ cái ({targetChar})
          </button>
          <button
            onClick={() => setMode('word')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
              mode === 'word' ? 'bg-orange-500 text-white' : 'bg-stone-100 text-stone-700'
            }`}
          >
            Tô cả từ ({currentItem.word})
          </button>
        </div>

        <button
          onClick={() => {
            speakText(`${targetChar} - ${currentItem.word}`);
          }}
          className="flex items-center gap-1 text-xs text-orange-700 font-bold bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Nghe phát âm</span>
        </button>
      </div>

      {/* Target Word Info Header */}
      <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200">
        <span className="text-4xl">{currentItem.emoji || '🍎'}</span>
        <div className="text-left">
          <h4 className="text-base font-black text-amber-950">
            {targetChar} is for {currentItem.word}
          </h4>
          <span className="text-xs text-orange-800 font-bold">Nghĩa: {currentItem.meaning}</span>
        </div>
      </div>

      {/* Drawing Canvas */}
      <div className="relative border-4 border-dashed border-amber-300 rounded-3xl overflow-hidden bg-amber-50/20 shadow-inner">
        <canvas
          ref={canvasRef}
          width={400}
          height={240}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          className="w-full max-w-[380px] sm:max-w-[420px] h-[220px] cursor-crosshair touch-none"
        />

        {/* Step Guide Hints */}
        <div className="absolute top-2 left-2 text-[10px] font-black text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-200 pointer-events-none">
          Nét 1 ➔ Nét 2
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleClear}
          className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Xóa tô lại</span>
        </button>

        <button
          onClick={handleFinish}
          disabled={!hasDrawn}
          className={`px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
            hasDrawn
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md hover:scale-105'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Bé đã tô xong! ⭐</span>
        </button>

        <button
          onClick={() => {
            sounds.playPop();
            setVocabIndex((prev) => (prev + 1) % vocab.length);
          }}
          className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 cursor-pointer"
        >
          Đổi chữ khác ➔
        </button>
      </div>

      {isCompleted && (
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-black animate-fadeIn">
          🎉 Hoan hô bé! &ldquo;{targetChar} - {currentItem.word}&rdquo; chuẩn xác lắm!
        </div>
      )}
    </div>
  );
};

// ==========================================
// GAME 5: BUILD THE WORD (Sắp xếp chữ cái)
// ==========================================
const GameBuildWord: React.FC<{
  vocab: VocabItem[];
  onSuccess: () => void;
  ageGroup: string;
}> = ({ vocab, onSuccess }) => {
  const [vocabIndex, setVocabIndex] = useState(0);
  const currentItem = vocab[vocabIndex % vocab.length];
  const originalLetters = currentItem.word.toUpperCase().split('');

  // Scrambled pool
  const [letterPool, setLetterPool] = useState<{ id: string; char: string }[]>([]);
  const [slottedLetters, setSlottedLetters] = useState<(string | null)[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setIsSuccess(false);
    setSlottedLetters(new Array(originalLetters.length).fill(null));

    // Scramble letters
    const pool = originalLetters.map((char, index) => ({
      id: `${char}-${index}-${Math.random()}`,
      char,
    }));
    setLetterPool([...pool].sort(() => 0.5 - Math.random()));
  }, [vocabIndex, currentItem]);

  const handlePickLetter = (item: { id: string; char: string }) => {
    sounds.playPop();
    // Find first empty slot
    const firstEmptyIndex = slottedLetters.indexOf(null);
    if (firstEmptyIndex === -1) return;

    const newSlots = [...slottedLetters];
    newSlots[firstEmptyIndex] = item.char;
    setSlottedLetters(newSlots);

    // Remove from pool
    setLetterPool((prev) => prev.filter((p) => p.id !== item.id));

    // Check if filled
    if (firstEmptyIndex === originalLetters.length - 1) {
      const finalWord = newSlots.join('');
      if (finalWord.toLowerCase() === currentItem.word.toLowerCase()) {
        sounds.playSuccess();
        setIsSuccess(true);
        speakText(currentItem.word);
        onSuccess();
      } else {
        sounds.playRetry();
      }
    }
  };

  const handleReset = () => {
    sounds.playPop();
    setIsSuccess(false);
    setSlottedLetters(new Array(originalLetters.length).fill(null));
    const pool = originalLetters.map((char, index) => ({
      id: `${char}-${index}-${Math.random()}`,
      char,
    }));
    setLetterPool([...pool].sort(() => 0.5 - Math.random()));
  };

  const handleNext = () => {
    sounds.playPop();
    setVocabIndex((prev) => (prev + 1) % vocab.length);
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center text-center space-y-6">
      <div className="flex items-center justify-between w-full">
        <span className="text-xs font-black text-orange-800 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
          Xếp chữ cái thành từ đúng
        </span>
        <button
          onClick={() => speakText(currentItem.word)}
          className="flex items-center gap-1 text-xs text-orange-700 font-bold bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Nghe từ</span>
        </button>
      </div>

      {/* Picture & Audio */}
      <div className="p-4 rounded-3xl bg-amber-50/60 border border-amber-200 flex flex-col items-center gap-2">
        <span className="text-6xl filter drop-shadow-sm">{currentItem.emoji || '🐱'}</span>
        <span className="text-xs font-bold text-stone-600">{currentItem.meaning}</span>
      </div>

      {/* Target Word Slots */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        {slottedLetters.map((char, idx) => (
          <div
            key={idx}
            className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-2 flex items-center justify-center font-black text-xl sm:text-2xl transition-all shadow-inner ${
              char
                ? isSuccess
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                  : 'bg-orange-500 text-white border-orange-600'
                : 'bg-white border-dashed border-amber-300 text-transparent'
            }`}
          >
            {char || '_'}
          </div>
        ))}
      </div>

      {/* Available Scrambled Letter Tiles */}
      <div className="space-y-2">
        <span className="text-xs text-stone-500 font-bold block">
          Chạm vào các chữ cái bên dưới để xếp vào ô:
        </span>
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {letterPool.map((item) => (
            <button
              key={item.id}
              onClick={() => handlePickLetter(item)}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white hover:bg-amber-100 text-amber-950 font-black text-xl border-2 border-amber-200 shadow-sm hover:scale-105 active:scale-95 cursor-pointer transition-all"
            >
              {item.char}
            </button>
          ))}
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Xếp lại</span>
        </button>

        {isSuccess && (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs shadow-md hover:scale-105 cursor-pointer animate-bounce"
          >
            Từ tiếp theo ➔
          </button>
        )}
      </div>

      {isSuccess && (
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-black animate-fadeIn">
          ⭐ Xuất sắc! Từ đúng là: &ldquo;{currentItem.word}&rdquo;!
        </div>
      )}
    </div>
  );
};

// ==========================================
// GAME 6: FIRST LETTER (Tìm chữ cái đầu tiên)
// ==========================================
const GameFirstLetter: React.FC<{
  vocab: VocabItem[];
  onSuccess: () => void;
  ageGroup: string;
}> = ({ vocab, onSuccess }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const currentItem = vocab[currentIndex % vocab.length];
  const correctLetter = currentItem.word.charAt(0).toUpperCase();

  // Choices: correct letter + 2 random letters
  const choices = React.useMemo(() => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const wrong = alphabet.filter((c) => c !== correctLetter);
    const shuffledWrong = [...wrong].sort(() => 0.5 - Math.random()).slice(0, 2);
    const list = [correctLetter, ...shuffledWrong];
    return list.sort(() => 0.5 - Math.random());
  }, [currentIndex, correctLetter]);

  useEffect(() => {
    setFeedback('idle');
  }, [currentIndex]);

  const handleSelect = (letter: string) => {
    sounds.playPop();
    if (letter === correctLetter) {
      setFeedback('correct');
      sounds.playSuccess();
      speakText(`${letter} - ${currentItem.word}`);
      onSuccess();
    } else {
      sounds.playRetry();
      setFeedback('wrong');
    }
  };

  const handleNext = () => {
    sounds.playPop();
    setCurrentIndex((prev) => (prev + 1) % vocab.length);
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center text-center space-y-6">
      <div className="flex items-center justify-between w-full">
        <span className="text-xs font-black text-orange-800 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
          Câu hỏi chữ cái đầu
        </span>
        <button
          onClick={() => speakText(currentItem.word)}
          className="flex items-center gap-1 text-xs text-orange-700 font-bold bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Nghe từ</span>
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 w-full max-w-sm flex flex-col items-center gap-2">
        <span className="text-7xl filter drop-shadow-sm">{currentItem.emoji || '🍎'}</span>
        <h3 className="text-xl font-black text-amber-950 font-['Quicksand'] mt-1">
          {currentItem.word}
        </h3>
        <p className="text-xs text-stone-600 font-medium">Nghĩa: {currentItem.meaning}</p>
        <span className="text-xs font-black text-orange-800 bg-orange-100 px-3 py-1 rounded-full border border-orange-200 mt-2">
          &ldquo;{currentItem.word}&rdquo; bắt đầu bằng chữ cái nào?
        </span>
      </div>

      {/* 3 Letter Choices */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
        {choices.map((letter, idx) => {
          const isCorrect = feedback === 'correct' && letter === correctLetter;
          return (
            <button
              key={idx}
              disabled={feedback === 'correct'}
              onClick={() => handleSelect(letter)}
              className={`h-20 rounded-2xl font-black text-3xl transition-all border-2 cursor-pointer shadow-sm ${
                isCorrect
                  ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-emerald-500/30'
                  : 'bg-white hover:bg-orange-50 text-amber-950 border-amber-200 hover:border-orange-400 active:scale-95'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {feedback === 'correct' && (
        <button
          onClick={handleNext}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-sm shadow-md hover:scale-105 cursor-pointer animate-bounce"
        >
          Câu tiếp theo ➔
        </button>
      )}

      {feedback === 'wrong' && (
        <div className="text-xs text-orange-700 font-bold bg-orange-50 px-4 py-2 rounded-xl border border-orange-200">
          🌱 Bé thử chữ cái khác nhé! Hãy phát âm to để cảm nhận chữ cái đầu nè!
        </div>
      )}
    </div>
  );
};

// ==========================================
// GAME 7: MEMORY CARDS (Lật thẻ ghi nhớ)
// ==========================================
interface MemoryCard {
  id: string;
  type: 'word' | 'picture';
  content: string;
  wordKey: string;
}

const GameMemoryCards: React.FC<{
  vocab: VocabItem[];
  onSuccess: () => void;
  ageGroup: string;
}> = ({ vocab, onSuccess }) => {
  // Take 4 items for 8 cards
  const selectedVocab = React.useMemo(() => {
    return [...vocab].slice(0, 4);
  }, [vocab]);

  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedKeys, setMatchedKeys] = useState<string[]>([]);

  const initGame = () => {
    const deck: MemoryCard[] = [];
    selectedVocab.forEach((item, index) => {
      deck.push({
        id: `word-${index}`,
        type: 'word',
        content: item.word,
        wordKey: item.word,
      });
      deck.push({
        id: `pic-${index}`,
        type: 'picture',
        content: item.emoji || '🌸',
        wordKey: item.word,
      });
    });
    setCards(deck.sort(() => 0.5 - Math.random()));
    setFlippedIds([]);
    setMatchedKeys([]);
  };

  useEffect(() => {
    initGame();
  }, [selectedVocab]);

  const handleCardClick = (card: MemoryCard) => {
    sounds.playPop();
    if (flippedIds.length === 2 || flippedIds.includes(card.id) || matchedKeys.includes(card.wordKey)) {
      return;
    }

    const newFlipped = [...flippedIds, card.id];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      const firstCard = cards.find((c) => c.id === newFlipped[0]);
      const secondCard = card;

      if (firstCard && firstCard.wordKey === secondCard.wordKey) {
        // Matched!
        sounds.playSuccess();
        const updatedMatches = [...matchedKeys, card.wordKey];
        setMatchedKeys(updatedMatches);
        setFlippedIds([]);
        speakText(card.wordKey);

        if (updatedMatches.length === selectedVocab.length) {
          onSuccess();
        }
      } else {
        sounds.playRetry();
        setTimeout(() => {
          setFlippedIds([]);
        }, 1100);
      }
    }
  };

  const isComplete = matchedKeys.length === selectedVocab.length;

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center text-center space-y-6">
      <div className="flex items-center justify-between w-full">
        <div>
          <h4 className="text-sm font-black text-amber-950 font-['Quicksand']">
            Lật Thẻ Ghi Nhớ (Hình ↔ Chữ)
          </h4>
          <span className="text-[11px] text-stone-500 font-medium">
            Lật 1 thẻ chữ và 1 thẻ hình tương ứng để ghép cặp nhé!
          </span>
        </div>
        <button
          onClick={initGame}
          className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Trộn lại</span>
        </button>
      </div>

      {/* Grid 4x2 Cards */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full">
        {cards.map((card) => {
          const isFlipped = flippedIds.includes(card.id) || matchedKeys.includes(card.wordKey);
          const isMatched = matchedKeys.includes(card.wordKey);

          return (
            <button
              key={card.id}
              disabled={isMatched}
              onClick={() => handleCardClick(card)}
              className={`h-24 sm:h-28 rounded-2xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer shadow-xs ${
                isFlipped
                  ? isMatched
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-emerald-500/20'
                    : 'bg-white border-orange-400 text-amber-950 scale-105'
                  : 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 text-white hover:scale-105'
              }`}
            >
              {isFlipped ? (
                card.type === 'picture' ? (
                  <span className="text-4xl filter drop-shadow-2xs">{card.content}</span>
                ) : (
                  <span className="font-black text-sm uppercase px-1">{card.content}</span>
                )
              ) : (
                <span className="text-2xl font-bold select-none opacity-80">🌱</span>
              )}
            </button>
          );
        })}
      </div>

      {isComplete ? (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2 animate-fadeIn w-full">
          <span className="text-3xl">🏆</span>
          <h4 className="text-base font-black text-emerald-950">Tuyệt cú mèo! Bé nhớ bài siêu đỉnh!</h4>
          <button
            onClick={initGame}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-sm hover:scale-105 cursor-pointer"
          >
            Chơi ván mới
          </button>
        </div>
      ) : (
        <div className="text-xs text-stone-500 font-medium">
          Cặp đã tìm được: {matchedKeys.length} / {selectedVocab.length}
        </div>
      )}
    </div>
  );
};
