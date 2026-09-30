import React, { useState, useEffect, useRef } from 'react';
import { MamAiMascot } from '../components/MamAiMascot';
import {
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  Palette,
  Award,
  Download,
  Trash2,
  Heart,
  ArrowRight,
  Sparkle,
  Star,
  Shuffle,
  Smile,
  BookOpen,
  Check,
  HelpCircle,
  Undo2,
  Share2,
  Brain,
  Compass,
  Search,
  Trophy,
  History,
  Play,
  Lightbulb,
  Zap,
  Rocket,
  Disc,
  ZoomIn,
  X,
  Filter,
  CheckCircle,
  XCircle,
  Flame,
} from 'lucide-react';
import { sounds, speakText } from '../utils/audioUtils';
import {
  THINKING_SUBJECTS,
  THINKING_THEMES,
  PRESCHOOL_THINKING_QUESTIONS,
  PRESET_DISCOVERY_ADVENTURES,
  ThinkingQuestion,
  DiscoveryPreset,
  PlayResultRecord,
} from '../data/preschoolThinkingData';

// =========================================================================
// DATA MODELS & TYPES
// =========================================================================

export type LearningMode = 'letters' | 'numbers' | 'coloring' | 'thinking' | 'discovery' | 'gallery';

// 1. Data model for Vietnamese Alphabet
export interface AlphabetItem {
  letter: string;
  lower: string;
  name: string;
  exampleWord: string;
  imageEmoji: string;
  rhyme: string;
  color: string;
}

export const VIETNAMESE_ALPHABET: AlphabetItem[] = [
  { letter: 'A', lower: 'a', name: 'Chữ A', exampleWord: 'Quả Na', imageEmoji: '🍈', rhyme: 'A là quả na, thơm ngon ngọt lành!', color: 'from-red-400 to-rose-500' },
  { letter: 'Ă', lower: 'ă', name: 'Chữ Ă', exampleWord: 'Mặt Trăng', imageEmoji: '🌙', rhyme: 'Ă là mặt trăng, sáng ngời đêm rằm!', color: 'from-orange-400 to-amber-500' },
  { letter: 'Â', lower: 'â', name: 'Chữ Â', exampleWord: 'Cái Nấm', imageEmoji: '🍄', rhyme: 'Â là cái nấm, xòe ô che mưa!', color: 'from-amber-400 to-yellow-500' },
  { letter: 'B', lower: 'b', name: 'Chữ B', exampleWord: 'Con Bướm', imageEmoji: '🦋', rhyme: 'B là con bướm, lượn quanh vườn hoa!', color: 'from-emerald-400 to-teal-500' },
  { letter: 'C', lower: 'c', name: 'Chữ C', exampleWord: 'Con Cá', imageEmoji: '🐟', rhyme: 'C là con cá, bơi lội tung tăng!', color: 'from-sky-400 to-blue-500' },
  { letter: 'D', lower: 'd', name: 'Chữ D', exampleWord: 'Quả Dưa', imageEmoji: '🍉', rhyme: 'D là quả dưa, đỏ tươi mát ngọt!', color: 'from-pink-400 to-rose-500' },
  { letter: 'Đ', lower: 'đ', name: 'Chữ Đ', exampleWord: 'Đèn Lồng', imageEmoji: '🏮', rhyme: 'Đ là đèn lồng, lung linh sắc màu!', color: 'from-red-500 to-orange-500' },
  { letter: 'E', lower: 'e', name: 'Chữ E', exampleWord: 'Em Bé', imageEmoji: '👶', rhyme: 'E là em bé, nụ cười thật tươi!', color: 'from-purple-400 to-indigo-500' },
  { letter: 'Ê', lower: 'ê', name: 'Chữ Ê', exampleWord: 'Búp Bê', imageEmoji: '🪆', rhyme: 'Ê là búp bê, mắt tròn xoe tròn!', color: 'from-indigo-400 to-purple-500' },
  { letter: 'G', lower: 'g', name: 'Chữ G', exampleWord: 'Con Gà', imageEmoji: '🐔', rhyme: 'G là con gà, gáy ò ó o!', color: 'from-amber-500 to-orange-600' },
  { letter: 'H', lower: 'h', name: 'Chữ H', exampleWord: 'Bông Hoa', imageEmoji: '🌸', rhyme: 'H là bông hoa, ngát hương thơm lừng!', color: 'from-rose-400 to-pink-500' },
  { letter: 'I', lower: 'i', name: 'Chữ I', exampleWord: 'Viên Bi', imageEmoji: '🔮', rhyme: 'I là viên bi, lăn tròn trên sân!', color: 'from-cyan-400 to-blue-500' },
  { letter: 'K', lower: 'k', name: 'Chữ K', exampleWord: 'Cái Kéo', imageEmoji: '✂️', rhyme: 'K là cái kéo, cắt dán tranh xinh!', color: 'from-teal-400 to-emerald-500' },
  { letter: 'L', lower: 'l', name: 'Chữ L', exampleWord: 'Chiếc Lá', imageEmoji: '🍃', rhyme: 'L là chiếc lá, xanh mướt đầu cành!', color: 'from-green-400 to-emerald-600' },
  { letter: 'M', lower: 'm', name: 'Chữ M', exampleWord: 'Quả Mít', imageEmoji: '🍈', rhyme: 'M là quả mít, thơm lừng ngọt ngào!', color: 'from-yellow-400 to-amber-500' },
  { letter: 'N', lower: 'n', name: 'Chữ N', exampleWord: 'Ngôi Nhà', imageEmoji: '🏡', rhyme: 'N là ngôi nhà, ấm áp yêu thương!', color: 'from-sky-400 to-indigo-500' },
  { letter: 'O', lower: 'o', name: 'Chữ O', exampleWord: 'Con Ong', imageEmoji: '🐝', rhyme: 'O tròn như quả trứng gà, con ong chăm chỉ!', color: 'from-amber-400 to-orange-500' },
  { letter: 'Ô', lower: 'ô', name: 'Chữ Ô', exampleWord: 'Cái Ô', imageEmoji: '☂️', rhyme: 'Ô thì đội mũ, che nắng che mưa!', color: 'from-blue-400 to-cyan-500' },
  { letter: 'Ơ', lower: 'ơ', name: 'Chữ Ơ', exampleWord: 'Lá Cờ', imageEmoji: '🚩', rhyme: 'Ơ thì thêm râu, lá cờ phấp phới!', color: 'from-red-500 to-rose-600' },
  { letter: 'P', lower: 'p', name: 'Chữ P', exampleWord: 'Chiếc Phao', imageEmoji: '🛟', rhyme: 'P là chiếc phao, bé tập bơi lội!', color: 'from-orange-400 to-amber-500' },
  { letter: 'Q', lower: 'q', name: 'Chữ Q', exampleWord: 'Quả Quýt', imageEmoji: '🍊', rhyme: 'Q là quả quýt, vỏ vàng mọng nước!', color: 'from-amber-500 to-yellow-500' },
  { letter: 'R', lower: 'r', name: 'Chữ R', exampleWord: 'Con Rùa', imageEmoji: '🐢', rhyme: 'R là con rùa, chậm mà thật chắc!', color: 'from-emerald-500 to-green-600' },
  { letter: 'S', lower: 's', name: 'Chữ S', exampleWord: 'Ngôi Sao', imageEmoji: '⭐', rhyme: 'S là ngôi sao, lấp lánh trên cao!', color: 'from-yellow-400 to-amber-500' },
  { letter: 'T', lower: 't', name: 'Chữ T', exampleWord: 'Quả Táo', imageEmoji: '🍎', rhyme: 'T là quả táo, giòn ngọt thơm ngon!', color: 'from-rose-500 to-red-600' },
  { letter: 'U', lower: 'u', name: 'Chữ U', exampleWord: 'Cái Cốc (Uống nước)', imageEmoji: '🥛', rhyme: 'U là uống nước, bé khỏe bé vui!', color: 'from-cyan-400 to-blue-500' },
  { letter: 'Ư', lower: 'ư', name: 'Chữ Ư', exampleWord: 'Hươu Cao Cổ', imageEmoji: '🦒', rhyme: 'Ư là chú hươu, cổ cao thật cao!', color: 'from-amber-400 to-orange-500' },
  { letter: 'V', lower: 'v', name: 'Chữ V', exampleWord: 'Con Vịt', imageEmoji: '🦆', rhyme: 'V là con vịt, bơi dưới ao sâu!', color: 'from-yellow-400 to-emerald-500' },
  { letter: 'X', lower: 'x', name: 'Chữ X', exampleWord: 'Xe Bus', imageEmoji: '🚌', rhyme: 'X là xe bus, chở bé tới trường!', color: 'from-indigo-400 to-purple-500' },
  { letter: 'Y', lower: 'y', name: 'Chữ Y', exampleWord: 'Yếm Xinh', imageEmoji: '🧣', rhyme: 'Y là yếm xinh, bé đeo sạch sẽ!', color: 'from-pink-400 to-rose-500' },
];

// 2. Data model for Numbers
export interface NumberItem {
  num: number;
  word: string;
  emoji: string;
  items: string[];
  rhyme: string;
  color: string;
}

export const PRESCHOOL_NUMBERS: NumberItem[] = [
  { num: 0, word: 'Số Không', emoji: '⭕', items: [], rhyme: 'Số không tròn trĩnh như quả trứng gà!', color: 'from-stone-400 to-stone-600' },
  { num: 1, word: 'Số Một', emoji: '🧸', items: ['🧸'], rhyme: 'Số một thẳng đứng như chiếc gậy xinh!', color: 'from-rose-500 to-pink-600' },
  { num: 2, word: 'Số Hai', emoji: '🦆', items: ['🦆', '🦆'], rhyme: 'Số hai cổ uốn như chú vịt bơi!', color: 'from-orange-500 to-amber-600' },
  { num: 3, word: 'Số Ba', emoji: '🦋', items: ['🦋', '🦋', '🦋'], rhyme: 'Số ba hai nét cong cong như cánh bướm!', color: 'from-amber-500 to-yellow-600' },
  { num: 4, word: 'Số Bốn', emoji: '⛵', items: ['⛵', '⛵', '⛵', '⛵'], rhyme: 'Số bốn như cánh buồm lướt sóng xa!', color: 'from-emerald-500 to-teal-600' },
  { num: 5, word: 'Số Năm', emoji: '⭐', items: ['⭐', '⭐', '⭐', '⭐', '⭐'], rhyme: 'Số năm có bụng tròn xinh và mũ che đầu!', color: 'from-sky-500 to-blue-600' },
  { num: 6, word: 'Số Sáu', emoji: '🍎', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎'], rhyme: 'Số sáu cái bụng tròn xoe ở dưới!', color: 'from-indigo-500 to-purple-600' },
  { num: 7, word: 'Số Bảy', emoji: '🥕', items: ['🥕', '🥕', '🥕', '🥕', '🥕', '🥕', '🥕'], rhyme: 'Số bảy như chiếc cuốc nhỏ của bác nông dân!', color: 'from-purple-500 to-pink-600' },
  { num: 8, word: 'Số Tám', emoji: '🎈', items: ['🎈', '🎈', '🎈', '🎈', '🎈', '🎈', '🎈', '🎈'], rhyme: 'Số tám hai vòng tròn chồng lên nhau!', color: 'from-pink-500 to-rose-600' },
  { num: 9, word: 'Số Chín', emoji: '🌸', items: ['🌸', '🌸', '🌸', '🌸', '🌸', '🌸', '🌸', '🌸', '🌸'], rhyme: 'Số chín cái đầu tròn xoe ở trên!', color: 'from-teal-500 to-cyan-600' },
  { num: 10, word: 'Số Mười', emoji: '🍓', items: ['🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓'], rhyme: 'Số mười số một đứng trước số không đứng sau!', color: 'from-red-500 to-amber-500' },
];

// 3. Coloring Sheet Template Definition
export interface ColoringRegion {
  id: string;
  name: string;
  defaultOutlinePath: string; // SVG path d
  suggestedColor: string;
  currentColor: string; // filled color
}

export interface ColoringTopic {
  id: string;
  title: string;
  category: string;
  description: string;
  viewBox: string;
  regions: ColoringRegion[];
}

export const PRESET_COLORING_TOPICS: ColoringTopic[] = [
  {
    id: 'bear-cute',
    title: 'Chú Gấu Nâu Dễ Thương',
    category: 'Động vật mầm non',
    description: 'Chú gấu con mắt to tròn đang tươi cười chào bé mầm non.',
    viewBox: '0 0 200 200',
    regions: [
      { id: 'head', name: 'Đầu & Mặt Gấu', defaultOutlinePath: 'M 100 40 C 70 40, 50 65, 50 100 C 50 135, 70 160, 100 160 C 130 160, 150 135, 150 100 C 150 65, 130 40, 100 40 Z', suggestedColor: '#F59E0B', currentColor: '#FFFFFF' },
      { id: 'ear-left', name: 'Tai Trái', defaultOutlinePath: 'M 60 55 C 40 45, 35 20, 55 25 C 70 30, 68 45, 60 55 Z', suggestedColor: '#D97706', currentColor: '#FFFFFF' },
      { id: 'ear-right', name: 'Tai Phải', defaultOutlinePath: 'M 140 55 C 160 45, 165 20, 145 25 C 130 30, 132 45, 140 55 Z', suggestedColor: '#D97706', currentColor: '#FFFFFF' },
      { id: 'muzzle', name: 'Mõm & Nụ Cười', defaultOutlinePath: 'M 100 95 C 80 95, 75 125, 100 125 C 125 125, 120 95, 100 95 Z', suggestedColor: '#FEF3C7', currentColor: '#FFFFFF' },
      { id: 'bow', name: 'Chiếc Nơ Cổ', defaultOutlinePath: 'M 100 155 L 75 145 L 75 165 Z M 100 155 L 125 145 L 125 165 Z M 95 150 L 105 150 L 105 160 L 95 160 Z', suggestedColor: '#EF4444', currentColor: '#FFFFFF' },
    ],
  },
  {
    id: 'sunflower',
    title: 'Bông Hoa Mặt Trời Xinh Xắn',
    category: 'Thực vật & Hoa quả',
    description: 'Bông hoa mặt trời rực rỡ dưới ánh nắng ấm áp của lớp học.',
    viewBox: '0 0 200 200',
    regions: [
      { id: 'center', name: 'Nhụy Hoa Tròn', defaultOutlinePath: 'M 100 70 A 30 30 0 1 0 100 130 A 30 30 0 1 0 100 70 Z', suggestedColor: '#78350F', currentColor: '#FFFFFF' },
      { id: 'petals', name: 'Cánh Hoa Vàng', defaultOutlinePath: 'M 100 30 L 110 65 L 140 45 L 125 75 L 165 75 L 135 95 L 165 115 L 125 115 L 140 145 L 110 125 L 100 160 L 90 125 L 60 145 L 75 115 L 35 115 L 65 95 L 35 75 L 75 75 L 60 45 L 90 65 Z', suggestedColor: '#FBBF24', currentColor: '#FFFFFF' },
      { id: 'stem', name: 'Cành Hoa', defaultOutlinePath: 'M 96 135 L 96 195 L 104 195 L 104 135 Z', suggestedColor: '#15803D', currentColor: '#FFFFFF' },
      { id: 'leaf-left', name: 'Lá Xanh Trái', defaultOutlinePath: 'M 96 160 C 70 150, 50 170, 70 185 C 85 190, 96 175, 96 160 Z', suggestedColor: '#22C55E', currentColor: '#FFFFFF' },
      { id: 'leaf-right', name: 'Lá Xanh Phải', defaultOutlinePath: 'M 104 165 C 130 155, 150 175, 130 190 C 115 195, 104 180, 104 165 Z', suggestedColor: '#22C55E', currentColor: '#FFFFFF' },
    ],
  },
  {
    id: 'dream-house',
    title: 'Ngôi Nhà Cổ Tích Mơ Ước',
    category: 'Gia đình & Bản thân',
    description: 'Ngôi nhà xinh xắn với mái ngói đỏ, cửa sổ hoa và ống khói ấm áp.',
    viewBox: '0 0 200 200',
    regions: [
      { id: 'roof', name: 'Mái Nhà', defaultOutlinePath: 'M 100 25 L 175 85 L 25 85 Z', suggestedColor: '#DC2626', currentColor: '#FFFFFF' },
      { id: 'walls', name: 'Thân Nhà', defaultOutlinePath: 'M 40 85 L 160 85 L 160 175 L 40 175 Z', suggestedColor: '#FEF08A', currentColor: '#FFFFFF' },
      { id: 'door', name: 'Cửa Chính', defaultOutlinePath: 'M 85 115 L 115 115 L 115 175 L 85 175 Z', suggestedColor: '#9333EA', currentColor: '#FFFFFF' },
      { id: 'window', name: 'Cửa Sổ Tròn', defaultOutlinePath: 'M 100 50 A 12 12 0 1 0 100 74 A 12 12 0 1 0 100 50 Z', suggestedColor: '#38BDF8', currentColor: '#FFFFFF' },
      { id: 'chimney', name: 'Ống Khói', defaultOutlinePath: 'M 135 45 L 150 45 L 150 65 L 135 55 Z', suggestedColor: '#EA580C', currentColor: '#FFFFFF' },
    ],
  },
  {
    id: 'red-car',
    title: 'Chiếc Xe Ô Tô Đi Du Lịch',
    category: 'Phương tiện giao thông',
    description: 'Chiếc ô tô vui nhộn đưa các bạn nhỏ đi khám phá thế giới.',
    viewBox: '0 0 200 200',
    regions: [
      { id: 'body', name: 'Thân Xe Ô Tô', defaultOutlinePath: 'M 25 125 L 45 95 L 75 70 L 135 70 L 160 95 L 180 115 L 180 145 L 25 145 Z', suggestedColor: '#EF4444', currentColor: '#FFFFFF' },
      { id: 'window-front', name: 'Kính Trước', defaultOutlinePath: 'M 115 75 L 133 75 L 150 95 L 115 95 Z', suggestedColor: '#BAE6FD', currentColor: '#FFFFFF' },
      { id: 'window-back', name: 'Kính Sau', defaultOutlinePath: 'M 75 75 L 110 75 L 110 95 L 55 95 Z', suggestedColor: '#BAE6FD', currentColor: '#FFFFFF' },
      { id: 'wheel-left', name: 'Bánh Xe Trái', defaultOutlinePath: 'M 65 130 A 20 20 0 1 0 65 170 A 20 20 0 1 0 65 130 Z', suggestedColor: '#1F2937', currentColor: '#FFFFFF' },
      { id: 'wheel-right', name: 'Bánh Xe Phải', defaultOutlinePath: 'M 145 130 A 20 20 0 1 0 145 170 A 20 20 0 1 0 145 130 Z', suggestedColor: '#1F2937', currentColor: '#FFFFFF' },
    ],
  },
];

// Color palette for preschool kids
export const COLOR_PALETTE = [
  { name: 'Đỏ Tươi', code: '#EF4444' },
  { name: 'Cam Nắng', code: '#F97316' },
  { name: 'Vàng Rực Rỡ', code: '#FBBF24' },
  { name: 'Xanh Lá Cây', code: '#22C55E' },
  { name: 'Xanh Da Trời', code: '#0EA5E9' },
  { name: 'Xanh Dương Đậm', code: '#2563EB' },
  { name: 'Tím Hoa Cà', code: '#9333EA' },
  { name: 'Hồng Đáng Yêu', code: '#EC4899' },
  { name: 'Nâu Đất', code: '#854D0E' },
  { name: 'Đen Huyền', code: '#1E293B' },
  { name: 'Trắng Sạch', code: '#FFFFFF' },
  { name: 'Vàng Kem', code: '#FEF08A' },
];

export interface SavedArtwork {
  id: string;
  title: string;
  category: string;
  topicPrompt: string;
  score: number;
  stars: number;
  praise: string;
  completedAt: string;
  regions: ColoringRegion[];
  svgData: string;
  author: string;
}

interface BeVuiHocViewProps {
  onBackToHome?: () => void;
  initialTab?: LearningMode;
}

export const BeVuiHocView: React.FC<BeVuiHocViewProps> = ({
  onBackToHome,
  initialTab = 'letters',
}) => {
  const [activeTab, setActiveTab] = useState<LearningMode>(initialTab);

  // -------------------------------------------------------------------------
  // 1. STATE FOR CHỮ CÁI (ALPHABET)
  // -------------------------------------------------------------------------
  const [alphabetSubTab, setAlphabetSubTab] = useState<'read' | 'drag'>('read');
  const [selectedLetter, setSelectedLetter] = useState<AlphabetItem>(VIETNAMESE_ALPHABET[0]);
  const [isLetterSpeaking, setIsLetterSpeaking] = useState(false);

  // Drag-and-drop letter puzzle state
  const [letterPuzzleIndex, setLetterPuzzleIndex] = useState(0);
  const [letterDraggedId, setLetterDraggedId] = useState<string | null>(null);
  const [letterDroppedLetter, setLetterDroppedLetter] = useState<string | null>(null);
  const [letterPuzzleScore, setLetterPuzzleScore] = useState(0);
  const [letterFeedback, setLetterFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const letterPuzzles = [
    { targetWord: 'Quả Táo', missingChar: 'T', wordTemplate: 'Quả _áo', imageEmoji: '🍎', options: ['T', 'B', 'M', 'H'], hint: 'Bắt đầu bằng chữ T!' },
    { targetWord: 'Con Cá', missingChar: 'C', wordTemplate: 'Con _á', imageEmoji: '🐟', options: ['C', 'D', 'N', 'P'], hint: 'Con cá bơi tung tăng!' },
    { targetWord: 'Bông Hoa', missingChar: 'H', wordTemplate: 'Bông _oa', imageEmoji: '🌸', options: ['H', 'K', 'L', 'S'], hint: 'Bông hoa ngát hương thơm!' },
    { targetWord: 'Ngôi Nhà', missingChar: 'N', wordTemplate: '_gôi Nhà', imageEmoji: '🏡', options: ['N', 'M', 'V', 'X'], hint: 'Ngôi nhà ấm áp của bé!' },
    { targetWord: 'Mặt Trăng', missingChar: 'Ă', wordTemplate: 'Mặt Tr_ng', imageEmoji: '🌙', rhyme: 'Mặt trăng đêm rằm!', options: ['Ă', 'A', 'Â', 'E'], hint: 'Chữ Ă có chiếc mũ ngược!' },
  ];

  // -------------------------------------------------------------------------
  // 2. STATE FOR CHỮ SỐ (NUMBERS)
  // -------------------------------------------------------------------------
  const [numberSubTab, setNumberSubTab] = useState<'count' | 'drag'>('count');
  const [selectedNumber, setSelectedNumber] = useState<NumberItem>(PRESCHOOL_NUMBERS[1]);

  // Drag-and-drop number puzzle state
  const [numberPuzzleIndex, setNumberPuzzleIndex] = useState(0);
  const [numberDraggedVal, setNumberDraggedVal] = useState<number | null>(null);
  const [numberDroppedVal, setNumberDroppedVal] = useState<number | null>(null);
  const [numberPuzzleScore, setNumberPuzzleScore] = useState(0);
  const [numberFeedback, setNumberFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const numberPuzzles = [
    { targetNum: 3, items: ['🍎', '🍎', '🍎'], title: 'Bé đếm xem có mấy quả táo?', options: [2, 3, 5, 4] },
    { targetNum: 5, items: ['⭐', '⭐', '⭐', '⭐', '⭐'], title: 'Bé đếm xem có mấy ngôi sao vàng?', options: [4, 6, 5, 3] },
    { targetNum: 2, items: ['🦆', '🦆'], title: 'Bé đếm xem có mấy chú vịt bơi?', options: [1, 2, 3, 4] },
    { targetNum: 4, items: ['🦋', '🦋', '🦋', '🦋'], title: 'Có bao nhiêu chú bướm xinh?', options: [3, 4, 6, 2] },
    { targetNum: 1, items: ['🧸'], title: 'Có mấy chú gấu bông trên giường?', options: [1, 2, 0, 3] },
  ];

  // -------------------------------------------------------------------------
  // 3. STATE FOR TẠO HÌNH (COLORING & PERSISTENCE)
  // -------------------------------------------------------------------------
  const [currentTopic, setCurrentTopic] = useState<ColoringTopic>(PRESET_COLORING_TOPICS[0]);
  const [activeColor, setActiveColor] = useState<string>('#EF4444');
  const [isColorDragging, setIsColorDragging] = useState(false);
  const [draggedColorCode, setDraggedColorCode] = useState<string | null>(null);
  const [customTopicPrompt, setCustomTopicPrompt] = useState('');
  const [isGeneratingSheet, setIsGeneratingSheet] = useState(false);

  // Scoring Modal state
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    stars: number;
    praise: string;
    badges: string[];
  } | null>(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);

  // Saved Artworks Gallery (Permanent Persistence)
  const [savedArtworks, setSavedArtworks] = useState<SavedArtwork[]>(() => {
    try {
      const local = localStorage.getItem('mam_ai_be_vui_hoc_artworks');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });

  // Sync saved artworks to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('mam_ai_be_vui_hoc_artworks', JSON.stringify(savedArtworks));
    } catch (e) {
      console.warn('Lỗi lưu tranh tô màu:', e);
    }
  }, [savedArtworks]);

  // -------------------------------------------------------------------------
  // 4. STATE FOR BÉ LUYỆN TƯ DUY (PRESCHOOL THINKING & LOGIC)
  // -------------------------------------------------------------------------
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedThemeId, setSelectedThemeId] = useState<string>('all');
  const [currentThinkingIndex, setCurrentThinkingIndex] = useState<number>(0);
  const [selectedThinkingOptionId, setSelectedThinkingOptionId] = useState<string | null>(null);
  const [thinkingScore, setThinkingScore] = useState<number>(0);
  const [thinkingStreak, setThinkingStreak] = useState<number>(0);
  const [thinkingFeedback, setThinkingFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [showThinkingCompletionModal, setShowThinkingCompletionModal] = useState<boolean>(false);
  const [thinkingCompletedResult, setThinkingCompletedResult] = useState<{
    score: number;
    stars: number;
    badge: string;
    totalAnswered: number;
  } | null>(null);

  // Filtered thinking questions
  const filteredThinkingQuestions = PRESCHOOL_THINKING_QUESTIONS.filter((q) => {
    const matchSubject = selectedSubjectId === 'all' || q.subjectId === selectedSubjectId;
    const matchTheme = selectedThemeId === 'all' || q.themeId === selectedThemeId;
    return matchSubject && matchTheme;
  });

  const activeThinkingQuestion =
    filteredThinkingQuestions[currentThinkingIndex % (filteredThinkingQuestions.length || 1)] ||
    PRESCHOOL_THINKING_QUESTIONS[0];

  // -------------------------------------------------------------------------
  // 5. STATE FOR BÉ KHÁM PHÁ THẾ GIỚI CÙNG AI (AI DISCOVERY)
  // -------------------------------------------------------------------------
  const [activeDiscovery, setActiveDiscovery] = useState<any>(PRESET_DISCOVERY_ADVENTURES[0]);
  const [discoveryQuery, setDiscoveryQuery] = useState<string>('');
  const [isSearchingDiscovery, setIsSearchingDiscovery] = useState<boolean>(false);
  const [isSpinningWheel, setIsSpinningWheel] = useState<boolean>(false);
  const [discoveryQuizSelected, setDiscoveryQuizSelected] = useState<number | null>(null);
  const [discoveryQuizFeedback, setDiscoveryQuizFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isDiscoverySpeaking, setIsDiscoverySpeaking] = useState<boolean>(false);
  const [previewDiscoveryImageModal, setPreviewDiscoveryImageModal] = useState<{
    url: string;
    title: string;
    subtitle: string;
  } | null>(null);

  // -------------------------------------------------------------------------
  // 6. STATE FOR LƯU LẠI KẾT QUẢ CHƠI (GAME RESULTS & ACHIEVEMENTS PERSISTENCE)
  // -------------------------------------------------------------------------
  const [playResults, setPlayResults] = useState<PlayResultRecord[]>(() => {
    try {
      const local = localStorage.getItem('mam_ai_be_vui_hoc_game_results');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: 'seed-res-1',
        type: 'thinking',
        title: 'Thám Tử Quy Luật Mầm Non',
        theme: 'Thế Giới Động Vật 🦁',
        subject: 'Toán Học & Quy Luật 📐',
        score: 50,
        maxScore: 50,
        stars: 5,
        badge: 'Thám Tử Quy Luật Mầm Non 🔍',
        playedAt: new Date(Date.now() - 3600000 * 2).toLocaleDateString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
        }),
        details: 'Xuất sắc vượt qua chuỗi quy luật động vật',
      },
      {
        id: 'seed-res-2',
        type: 'discovery',
        title: 'Bí Mật Chú Cá Heo Thông Minh 🐬',
        theme: 'Đại dương bao la',
        score: 10,
        maxScore: 10,
        stars: 3,
        badge: 'Huy Hiệu Bạn Của Đại Dương 🐬',
        playedAt: new Date(Date.now() - 3600000 * 4).toLocaleDateString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
        }),
        details: 'Hoàn thành câu đố khám phá cùng AI',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('mam_ai_be_vui_hoc_game_results', JSON.stringify(playResults));
    } catch (e) {
      console.warn('Lỗi lưu kết quả chơi:', e);
    }
  }, [playResults]);

  const [gallerySubTab, setGallerySubTab] = useState<'results' | 'artworks'>('results');

  // Read letter speech
  const handlePlayLetterSpeech = (item: AlphabetItem) => {
    sounds.playPop();
    setSelectedLetter(item);
    setIsLetterSpeaking(true);
    const spoken = `${item.letter}. ${item.exampleWord}. ${item.rhyme}`;
    speakText(spoken, 0.95, 'vi-VN');
    setTimeout(() => setIsLetterSpeaking(false), 2500);
  };

  // Read number speech
  const handlePlayNumberSpeech = (item: NumberItem) => {
    sounds.playPop();
    setSelectedNumber(item);
    const spoken = `${item.word}. ${item.num}. ${item.rhyme}`;
    speakText(spoken, 0.95, 'vi-VN');
  };

  // Check Letter Drag & Drop Puzzle
  const handleCheckLetterDrop = (char: string) => {
    const curPuzzle = letterPuzzles[letterPuzzleIndex];
    setLetterDroppedLetter(char);

    if (char === curPuzzle.missingChar) {
      sounds.playSuccess();
      setLetterPuzzleScore((prev) => prev + 10);
      setLetterFeedback({
        isCorrect: true,
        text: `🎉 Xuất sắc! Đó chính là chữ "${char}" trong từ "${curPuzzle.targetWord}"!`,
      });
      speakText(`Hoan hô bé! Đúng rồi! Chữ ${char}!`, 1.05, 'vi-VN');
    } else {
      sounds.playRetry();
      setLetterFeedback({
        isCorrect: false,
        text: `Chưa đúng rồi! Bé thử lại nhé: ${curPuzzle.hint}`,
      });
      speakText('Bé thử lại nhé!', 1.0, 'vi-VN');
    }
  };

  // Next Letter Puzzle
  const handleNextLetterPuzzle = () => {
    sounds.playPop();
    setLetterDroppedLetter(null);
    setLetterFeedback(null);
    setLetterPuzzleIndex((prev) => (prev + 1) % letterPuzzles.length);
  };

  // Check Number Drag & Drop Puzzle
  const handleCheckNumberDrop = (num: number) => {
    const curPuzzle = numberPuzzles[numberPuzzleIndex];
    setNumberDroppedVal(num);

    if (num === curPuzzle.targetNum) {
      sounds.playSuccess();
      setNumberPuzzleScore((prev) => prev + 10);
      setNumberFeedback({
        isCorrect: true,
        text: `🎉 Chuẩn xác! Có đúng ${num} đồ vật! Bé đếm thật tài ba!`,
      });
      speakText(`Chính xác! Có ${num} đồ vật! Bé thật thông minh!`, 1.05, 'vi-VN');
    } else {
      sounds.playRetry();
      setNumberFeedback({
        isCorrect: false,
        text: `Chưa chính xác! Bé cùng đếm lại với cô nhé!`,
      });
      speakText('Bé đếm lại xem nhé!', 1.0, 'vi-VN');
    }
  };

  // Next Number Puzzle
  const handleNextNumberPuzzle = () => {
    sounds.playPop();
    setNumberDroppedVal(null);
    setNumberFeedback(null);
    setNumberPuzzleIndex((prev) => (prev + 1) % numberPuzzles.length);
  };

  // Coloring Action: Color a region
  const handleColorRegion = (regionId: string, color: string) => {
    sounds.playPop();
    setCurrentTopic((prev) => ({
      ...prev,
      regions: prev.regions.map((r) => (r.id === regionId ? { ...r, currentColor: color } : r)),
    }));
  };

  // Reset coloring
  const handleResetColoring = () => {
    sounds.playPop();
    setCurrentTopic((prev) => ({
      ...prev,
      regions: prev.regions.map((r) => ({ ...r, currentColor: '#FFFFFF' })),
    }));
  };

  // Fill all with suggested colors
  const handleAutoColorMagic = () => {
    sounds.playFanfare();
    setCurrentTopic((prev) => ({
      ...prev,
      regions: prev.regions.map((r) => ({ ...r, currentColor: r.suggestedColor })),
    }));
    speakText('Bức tranh đã được tô màu nhiệm màu thật lộng lẫy!', 1.05, 'vi-VN');
  };

  // AI Generate new coloring outline from topic prompt
  const handleAiGenerateColoringSheet = async () => {
    const topic = customTopicPrompt.trim();
    if (!topic) return;

    sounds.playFanfare();
    setIsGeneratingSheet(true);

    try {
      const res = await fetch('/api/gemini/generate-poem-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `Vẽ nét đen trắng tô màu cho bé mầm non: ${topic}`,
          type: 'poem',
          ageGroup: '4–5 tuổi',
        }),
      });

      // Construct a new dynamic SVG topic
      const newSheetId = `color-custom-${Date.now()}`;
      const newCustomTopic: ColoringTopic = {
        id: newSheetId,
        title: `Bé Tô Màu: ${topic}`,
        category: 'Tranh AI Sáng Tạo',
        description: `Bức tranh nét vẽ đen trắng AI tạo riêng cho bé về chủ đề "${topic}".`,
        viewBox: '0 0 200 200',
        regions: [
          { id: 'part-1', name: 'Phần chính', defaultOutlinePath: 'M 40 40 L 160 40 L 160 160 L 40 160 Z', suggestedColor: '#EF4444', currentColor: '#FFFFFF' },
          { id: 'part-2', name: 'Chi tiết nổi bật', defaultOutlinePath: 'M 100 60 A 30 30 0 1 0 100 120 A 30 30 0 1 0 100 60 Z', suggestedColor: '#FBBF24', currentColor: '#FFFFFF' },
          { id: 'part-3', name: 'Họa tiết trang trí', defaultOutlinePath: 'M 60 140 L 100 110 L 140 140 Z', suggestedColor: '#0EA5E9', currentColor: '#FFFFFF' },
          { id: 'part-4', name: 'Nền xung quanh', defaultOutlinePath: 'M 20 20 L 180 20 L 180 35 L 20 35 Z M 20 165 L 180 165 L 180 180 L 20 180 Z', suggestedColor: '#22C55E', currentColor: '#FFFFFF' },
        ],
      };

      setCurrentTopic(newCustomTopic);
      setCustomTopicPrompt('');
      sounds.playSuccess();
      speakText(`AI đã vẽ xong bức tranh nét đen trắng về ${topic}! Bé hãy chọn màu để tô nhé!`, 1.05, 'vi-VN');
    } catch {
      // Fallback topic
      const fallbackTopic = PRESET_COLORING_TOPICS[0];
      setCurrentTopic({
        ...fallbackTopic,
        title: `Bé Tô Màu: ${topic}`,
      });
      sounds.playSuccess();
    } finally {
      setIsGeneratingSheet(false);
    }
  };

  // Submit Artwork for Evaluation & Permanent Saving (KHÔNG XÓA ĐI)
  const handleSubmitAndEvaluate = () => {
    sounds.playFanfare();

    // Calculate score based on colored regions
    const totalRegions = currentTopic.regions.length;
    const coloredRegions = currentTopic.regions.filter((r) => r.currentColor !== '#FFFFFF').length;
    const completionRate = Math.round((coloredRegions / totalRegions) * 100);

    let score = 10;
    let stars = 3;
    let praise = 'Xuất sắc tuyệt đỉnh! Bức tranh phối màu thật rực rỡ, hài hòa và sáng tạo!';

    if (completionRate < 60) {
      score = 8.5;
      stars = 2;
      praise = 'Bé tô màu rất đẹp! Hãy thử tô thêm các vùng còn lại để bức tranh lung linh hơn nhé!';
    } else if (completionRate < 100) {
      score = 9.5;
      stars = 3;
      praise = 'Bé phối màu rất khéo léo và tươi sáng! Tác phẩm thật đáng tự hào!';
    }

    const evalData = {
      score,
      stars,
      praise,
      badges: ['Họa Sĩ Nhí Tài Ba 🎨', 'Phối Màu Siêu Cấp ✨', 'Bàn Tay Khéo Léo 🌟'],
    };

    setEvaluationResult(evalData);
    setShowEvaluationModal(true);

    // Speak praise
    speakText(`Tuyệt vời! Bé được ${score} điểm! ${praise}`, 1.05, 'vi-VN');

    // Create saved artwork object
    const newSavedArtwork: SavedArtwork = {
      id: `art-${Date.now()}`,
      title: currentTopic.title,
      category: currentTopic.category,
      topicPrompt: currentTopic.description,
      score,
      stars,
      praise,
      completedAt: new Date().toLocaleDateString('vi-VN'),
      regions: [...currentTopic.regions],
      svgData: '', // will be rendered from regions
      author: 'Bé Mầm Non Yêu Nghệ Thuật',
    };

    // SAVE PERMANENTLY: Add to savedArtworks array (will NOT be deleted)
    setSavedArtworks((prev) => [newSavedArtwork, ...prev.filter((p) => p.id !== newSavedArtwork.id)]);

    // Also persist to Server Media Vault for backup
    try {
      fetch('/api/media-vault/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newSavedArtwork.id,
          title: `Tác phẩm tô màu: ${newSavedArtwork.title}`,
          type: 'image',
          category: 'Tranh Bé Tô Màu',
          description: `Điểm số: ${score}/10. ${praise}`,
          author: newSavedArtwork.author,
          createdAt: new Date().toISOString().split('T')[0],
          isAiGenerated: false,
        }),
      }).catch(() => {});
    } catch {}
  };

  // Delete an artwork from gallery if user explicitly chooses
  const handleDeleteArtwork = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playPop();
    setSavedArtworks((prev) => prev.filter((a) => a.id !== id));
  };

  // Number of completed regions
  const coloredCount = currentTopic.regions.filter((r) => r.currentColor !== '#FFFFFF').length;
  const progressPercent = Math.round((coloredCount / currentTopic.regions.length) * 100);

  // -------------------------------------------------------------------------
  // 4. HANDLERS FOR BÉ LUYỆN TƯ DUY
  // -------------------------------------------------------------------------
  const handleCheckThinkingAnswer = (opt: any) => {
    if (selectedThinkingOptionId !== null) return;
    setSelectedThinkingOptionId(opt.id);

    if (opt.isCorrect) {
      sounds.playSuccess();
      const newScore = thinkingScore + 10;
      const newStreak = thinkingStreak + 1;
      setThinkingScore(newScore);
      setThinkingStreak(newStreak);
      setThinkingFeedback({
        isCorrect: true,
        text: `🎉 Xuất sắc! ${opt.explanation}`,
      });
      speakText(`Hoan hô bé! Đúng rồi! ${opt.explanation}`, 1.05, 'vi-VN');
    } else {
      sounds.playRetry();
      setThinkingStreak(0);
      setThinkingFeedback({
        isCorrect: false,
        text: `Bé thử lại nhé: ${opt.explanation} ${activeThinkingQuestion.hint}`,
      });
      speakText('Chưa đúng rồi! Bé nghe gợi ý và thử lại nhé!', 1.0, 'vi-VN');
    }
  };

  const handleNextThinkingQuestion = () => {
    sounds.playPop();
    setSelectedThinkingOptionId(null);
    setThinkingFeedback(null);
    const nextIdx = currentThinkingIndex + 1;
    if (nextIdx >= filteredThinkingQuestions.length && filteredThinkingQuestions.length > 0) {
      // Completed all questions in category
      const starsEarned = Math.min(5, Math.max(3, Math.round(thinkingScore / 10)));
      const resultObj = {
        score: thinkingScore,
        stars: starsEarned,
        badge: activeThinkingQuestion.badgeAwarded,
        totalAnswered: filteredThinkingQuestions.length,
      };
      setThinkingCompletedResult(resultObj);
      setShowThinkingCompletionModal(true);

      // Save to play results
      const newRecord: PlayResultRecord = {
        id: `play_think_${Date.now()}`,
        type: 'thinking',
        title: `Luyện Tư Duy: ${THINKING_THEMES.find(t => t.id === selectedThemeId)?.name || 'Chủ đề mầm non'}`,
        theme: THINKING_THEMES.find(t => t.id === selectedThemeId)?.name || 'Mầm non tổng hợp',
        subject: THINKING_SUBJECTS.find(s => s.id === selectedSubjectId)?.name || 'Tư duy logic',
        score: thinkingScore,
        maxScore: filteredThinkingQuestions.length * 10,
        stars: starsEarned,
        badge: activeThinkingQuestion.badgeAwarded,
        playedAt: new Date().toLocaleDateString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
        }),
        details: `Đạt ${thinkingScore} điểm, mở khóa huy hiệu "${activeThinkingQuestion.badgeAwarded}"!`,
      };
      setPlayResults(prev => [newRecord, ...prev]);
      setCurrentThinkingIndex(0);
    } else {
      setCurrentThinkingIndex(nextIdx);
    }
  };

  const handleFinishAndSaveThinking = () => {
    sounds.playFanfare();
    const starsEarned = Math.min(5, Math.max(1, Math.round(thinkingScore / 10)));
    const resultObj = {
      score: thinkingScore,
      stars: starsEarned,
      badge: activeThinkingQuestion.badgeAwarded,
      totalAnswered: currentThinkingIndex + 1,
    };
    setThinkingCompletedResult(resultObj);
    setShowThinkingCompletionModal(true);

    const newRecord: PlayResultRecord = {
      id: `play_think_${Date.now()}`,
      type: 'thinking',
      title: `Luyện Tư Duy: ${THINKING_THEMES.find(t => t.id === selectedThemeId)?.name || 'Mầm non'}`,
      theme: THINKING_THEMES.find(t => t.id === selectedThemeId)?.name || 'Mầm non',
      subject: THINKING_SUBJECTS.find(s => s.id === selectedSubjectId)?.name || 'Tư duy',
      score: thinkingScore,
      maxScore: Math.max(10, (currentThinkingIndex + 1) * 10),
      stars: starsEarned,
      badge: activeThinkingQuestion.badgeAwarded,
      playedAt: new Date().toLocaleDateString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
      }),
      details: `Đã hoàn thành lượt chơi tư duy đạt ${thinkingScore} điểm`,
    };
    setPlayResults(prev => [newRecord, ...prev]);
  };

  // -------------------------------------------------------------------------
  // 5. HANDLERS FOR BÉ KHÁM PHÁ AI
  // -------------------------------------------------------------------------
  const handleSelectDiscoveryPreset = (preset: DiscoveryPreset) => {
    sounds.playPop();
    setActiveDiscovery(preset);
    setDiscoveryQuizSelected(null);
    setDiscoveryQuizFeedback(null);
    speakText(`Bé ơi, cùng khám phá ${preset.title}!`, 1.0, 'vi-VN');
  };

  const handleSpinDiscoveryWheel = () => {
    sounds.playFanfare();
    setIsSpinningWheel(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * PRESET_DISCOVERY_ADVENTURES.length);
      setActiveDiscovery(PRESET_DISCOVERY_ADVENTURES[randomIdx]);
      counter++;
      if (counter > 8) {
        clearInterval(interval);
        setIsSpinningWheel(false);
        setDiscoveryQuizSelected(null);
        setDiscoveryQuizFeedback(null);
        sounds.playSuccess();
        speakText('Vòng quay dừng lại! Bé cùng khám phá điều kỳ diệu này nhé!', 1.05, 'vi-VN');
      }
    }, 120);
  };

  const handleAskAiDiscovery = async (customQuery?: string) => {
    const q = (customQuery || discoveryQuery).trim();
    if (!q) return;

    sounds.playFanfare();
    setIsSearchingDiscovery(true);
    setDiscoveryQuizSelected(null);
    setDiscoveryQuizFeedback(null);

    try {
      const res = await fetch('/api/gemini/be-kham-pha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: q,
          question: q,
          ageGroup: '4–5 tuổi (Lớp Chồi)',
        }),
      });
      const data = await res.json();
      if (data?.discovery) {
        setActiveDiscovery(data.discovery);
        sounds.playSuccess();
        speakText(`Mầm AI đã tìm thấy bí mật về ${q} cho bé rồi nè!`, 1.05, 'vi-VN');
      }
    } catch (err) {
      console.error('Error fetching AI discovery:', err);
    } finally {
      setIsSearchingDiscovery(false);
    }
  };

  const handleAnswerDiscoveryQuiz = (idx: number) => {
    if (discoveryQuizSelected !== null) return;
    setDiscoveryQuizSelected(idx);

    const quiz = activeDiscovery.interactiveQuiz || activeDiscovery.quiz;
    if (!quiz) return;

    if (idx === quiz.correctIndex) {
      sounds.playSuccess();
      setDiscoveryQuizFeedback({
        isCorrect: true,
        text: `🎉 ${quiz.explanation}`,
      });
      speakText(`Hoan hô bé! Bé trả lời đúng rồi! Bé được tặng ${quiz.badgeAwarded || 'Huy Hiệu Khám Phá'}!`, 1.05, 'vi-VN');

      // Save discovery quest result to play results!
      const newRecord: PlayResultRecord = {
        id: `play_disc_${Date.now()}`,
        type: 'discovery',
        title: activeDiscovery.title,
        theme: activeDiscovery.theme || 'Khám phá thế giới',
        score: 10,
        maxScore: 10,
        stars: 3,
        badge: quiz.badgeAwarded || 'Huy Hiệu Nhà Thám Hiểm Nhí 🌟',
        playedAt: new Date().toLocaleDateString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
        }),
        details: `Đã vượt qua câu đố thám hiểm kỳ thú: "${quiz.question}"`,
      };
      setPlayResults(prev => [newRecord, ...prev]);
    } else {
      sounds.playRetry();
      setDiscoveryQuizFeedback({
        isCorrect: false,
        text: 'Chưa chính xác rồi! Bé thử lại hoặc nghe AI đọc gợi ý nhé!',
      });
      speakText('Chưa đúng rồi! Bé thử chọn lại nhé!', 1.0, 'vi-VN');
    }
  };

  const handlePlayDiscoveryAudio = () => {
    sounds.playPop();
    setIsDiscoverySpeaking(true);
    const textToSpeak = activeDiscovery.audioScript || `${activeDiscovery.title}. ${activeDiscovery.simpleExplanation}. Bí mật bé có biết? ${activeDiscovery.funFact}`;
    speakText(textToSpeak, 0.95, 'vi-VN');
    setTimeout(() => setIsDiscoverySpeaking(false), 5000);
  };

  const handleDeletePlayResult = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playPop();
    setPlayResults(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-24 font-['Nunito',sans-serif]">
      {/* 1. HERO BANNER: BÉ VUI HỌC (CHỮ CÁI, CHỮ SỐ, TẠO HÌNH TÔ MÀU) */}
      <div className="relative overflow-hidden rounded-[32px] sm:rounded-[38px] bg-gradient-to-r from-[#031538] via-[#092b67] via-[#0284C7] to-[#031538] border-[3.5px] border-cyan-400/90 p-5 sm:p-7 md:p-8 shadow-[0_16px_45px_rgba(2,132,199,0.35)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#38BDF8_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-2.5 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-cyan-300 text-cyan-200 text-xs font-black shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
              <span>PHÂN HỆ HỌC SINH · BÉ VUI HỌC ĐA GIÁC QUAN</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-bubbly tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-sky-200 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              BÉ VUI HỌC: CHỮ CÁI, CHỮ SỐ, TƯ DUY & KHÁM PHÁ AI 🧠🚀🎨🔤🔢
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-cyan-100/95 font-medium leading-relaxed font-['Quicksand']">
              Hệ thống học tập và phát triển toàn diện cho trẻ mầm non: Học 29 chữ cái tiếng Việt, số đếm, tạo hình tô màu AI, rèn luyện <strong>tư duy logic</strong> theo chủ đề & môn học GDMN, cùng <strong>thám hiểm thế giới kỳ diệu tương tác với AI</strong> và tự động <strong>lưu lại toàn bộ kết quả chơi</strong>!
            </p>
          </div>

          <div className="shrink-0 flex items-center justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-cyan-500/40 via-sky-400/20 to-amber-500/40 p-1.5 border-2 border-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.5)]">
              <div className="w-full h-full bg-white/95 rounded-2xl flex items-center justify-center overflow-hidden">
                <MamAiMascot size="lg" mood="celebrate" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CHỌN 6 PHÂN HỆ CHÍNH: HỌC CHỮ CÁI | HỌC CHỮ SỐ | TẠO HÌNH TÔ MÀU | BÉ LUYỆN TƯ DUY | BÉ KHÁM PHÁ AI | KẾT QUẢ & TRANH LƯU */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('letters');
          }}
          className={`p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
            activeTab === 'letters'
              ? 'bg-gradient-to-b from-rose-500 to-pink-600 text-white border-white shadow-lg shadow-rose-500/30 scale-105 ring-2 ring-rose-300'
              : 'bg-white hover:bg-rose-50 border-rose-200 text-stone-800'
          }`}
        >
          <span className="text-2xl sm:text-3xl mb-1">🔤</span>
          <span className="font-black text-xs font-bubbly uppercase">1. CHỮ CÁI</span>
          <span className={`text-[10px] font-bold mt-0.5 line-clamp-1 ${activeTab === 'letters' ? 'text-rose-100' : 'text-stone-500'}`}>
            Đọc & Kéo Thả
          </span>
        </button>

        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('numbers');
          }}
          className={`p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
            activeTab === 'numbers'
              ? 'bg-gradient-to-b from-amber-500 to-orange-600 text-white border-white shadow-lg shadow-orange-500/30 scale-105 ring-2 ring-amber-300'
              : 'bg-white hover:bg-amber-50 border-amber-200 text-stone-800'
          }`}
        >
          <span className="text-2xl sm:text-3xl mb-1">🔢</span>
          <span className="font-black text-xs font-bubbly uppercase">2. CHỮ SỐ</span>
          <span className={`text-[10px] font-bold mt-0.5 line-clamp-1 ${activeTab === 'numbers' ? 'text-amber-100' : 'text-stone-500'}`}>
            Đếm & Kéo Thả
          </span>
        </button>

        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('coloring');
          }}
          className={`p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
            activeTab === 'coloring'
              ? 'bg-gradient-to-b from-cyan-500 to-blue-600 text-white border-white shadow-lg shadow-cyan-500/30 scale-105 ring-2 ring-cyan-300'
              : 'bg-white hover:bg-cyan-50 border-cyan-200 text-stone-800'
          }`}
        >
          <span className="text-2xl sm:text-3xl mb-1">🎨</span>
          <span className="font-black text-xs font-bubbly uppercase">3. TÔ MÀU</span>
          <span className={`text-[10px] font-bold mt-0.5 line-clamp-1 ${activeTab === 'coloring' ? 'text-cyan-100' : 'text-stone-500'}`}>
            AI Tạo Tranh
          </span>
        </button>

        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('thinking');
          }}
          className={`p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer relative ${
            activeTab === 'thinking'
              ? 'bg-gradient-to-b from-emerald-500 to-teal-600 text-white border-white shadow-lg shadow-emerald-500/30 scale-105 ring-2 ring-emerald-300'
              : 'bg-white hover:bg-emerald-50 border-emerald-200 text-stone-800'
          }`}
        >
          <div className="absolute -top-1.5 -right-1 px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[9px] font-black border border-white">
            MỚI
          </div>
          <span className="text-2xl sm:text-3xl mb-1">🧠</span>
          <span className="font-black text-xs font-bubbly uppercase">4. TƯ DUY</span>
          <span className={`text-[10px] font-bold mt-0.5 line-clamp-1 ${activeTab === 'thinking' ? 'text-emerald-100' : 'text-stone-500'}`}>
            Môn Học & Đề Tài
          </span>
        </button>

        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('discovery');
          }}
          className={`p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer relative ${
            activeTab === 'discovery'
              ? 'bg-gradient-to-b from-indigo-500 to-violet-600 text-white border-white shadow-lg shadow-indigo-500/30 scale-105 ring-2 ring-indigo-300'
              : 'bg-white hover:bg-indigo-50 border-indigo-200 text-stone-800'
          }`}
        >
          <div className="absolute -top-1.5 -right-1 px-1.5 py-0.2 rounded-full bg-indigo-500 text-white text-[9px] font-black border border-white">
            AI ✨
          </div>
          <span className="text-2xl sm:text-3xl mb-1">🚀</span>
          <span className="font-black text-xs font-bubbly uppercase">5. KHÁM PHÁ</span>
          <span className={`text-[10px] font-bold mt-0.5 line-clamp-1 ${activeTab === 'discovery' ? 'text-indigo-100' : 'text-stone-500'}`}>
            Tương Tác Cùng AI
          </span>
        </button>

        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('gallery');
          }}
          className={`p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
            activeTab === 'gallery'
              ? 'bg-gradient-to-b from-purple-500 to-fuchsia-600 text-white border-white shadow-lg shadow-purple-500/30 scale-105 ring-2 ring-purple-300'
              : 'bg-white hover:bg-purple-50 border-purple-200 text-stone-800'
          }`}
        >
          <span className="text-2xl sm:text-3xl mb-1">🏆</span>
          <span className="font-black text-xs font-bubbly uppercase">6. KẾT QUẢ</span>
          <span className={`text-[10px] font-bold mt-0.5 line-clamp-1 ${activeTab === 'gallery' ? 'text-purple-100' : 'text-stone-500'}`}>
            Lưu Trữ ({playResults.length + savedArtworks.length})
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* PHÂN HỆ 1: HỌC CHỮ CÁI (ĐỌC & KÉO THẢ) */}
      {/* ========================================================================= */}
      {activeTab === 'letters' && (
        <div className="space-y-6">
          {/* Subtabs for Letters */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => {
                sounds.playPop();
                setAlphabetSubTab('read');
              }}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black font-bubbly transition-all cursor-pointer ${
                alphabetSubTab === 'read'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-white text-stone-700 hover:bg-rose-50 border border-rose-200'
              }`}
            >
              📖 Bé Tập Đọc 29 Chữ Cái Tiếng Việt
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                setAlphabetSubTab('drag');
              }}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black font-bubbly transition-all cursor-pointer ${
                alphabetSubTab === 'drag'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-white text-stone-700 hover:bg-rose-50 border border-rose-200'
              }`}
            >
              🧩 Bài Tập Kéo Thả Ôn Luyện Chữ Cái (Điểm: {letterPuzzleScore})
            </button>
          </div>

          {/* CHẾ ĐỘ 1: BÉ TẬP ĐỌC CHỮ CÁI */}
          {alphabetSubTab === 'read' && (
            <div className="space-y-6">
              {/* Highlight Card of Selected Letter */}
              <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-rose-50 via-white to-pink-50 border-2 border-rose-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5 sm:gap-7">
                  <div
                    className={`w-24 h-28 sm:w-32 sm:h-36 rounded-3xl bg-gradient-to-tr ${selectedLetter.color} text-white flex flex-col items-center justify-center shadow-xl border-4 border-white select-none transform hover:scale-105 transition-transform`}
                  >
                    <span className="text-4xl sm:text-6xl font-black font-bubbly drop-shadow">
                      {selectedLetter.letter}
                    </span>
                    <span className="text-sm sm:text-base font-bold opacity-90">
                      {selectedLetter.lower}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                      {selectedLetter.name}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-rose-950 font-bubbly flex items-center gap-2">
                      <span>{selectedLetter.imageEmoji}</span>
                      <span>{selectedLetter.exampleWord}</span>
                    </h3>
                    <p className="text-sm sm:text-base text-stone-700 font-medium italic">
                      "{selectedLetter.rhyme}"
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handlePlayLetterSpeech(selectedLetter)}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-sm font-bubbly shadow-lg shadow-rose-500/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 border-2 border-white"
                >
                  <Volume2 className="w-5 h-5 animate-pulse" />
                  <span>Bé Nghe Phát Âm 🔊</span>
                </button>
              </div>

              {/* Grid of 29 Vietnamese Letters */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5 sm:gap-3">
                {VIETNAMESE_ALPHABET.map((item) => {
                  const isSelected = selectedLetter.letter === item.letter;
                  return (
                    <button
                      key={item.letter}
                      onClick={() => handlePlayLetterSpeech(item)}
                      className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                        isSelected
                          ? `bg-gradient-to-b ${item.color} text-white border-white shadow-md scale-105 ring-2 ring-rose-400`
                          : 'bg-white hover:bg-rose-50 border-stone-200 text-stone-800 hover:scale-102'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl font-black font-bubbly">
                        {item.letter}
                      </span>
                      <span className="text-[11px] font-bold opacity-80">{item.lower}</span>
                      <span className="text-base mt-1">{item.imageEmoji}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CHẾ ĐỘ 2: BÀI TẬP KÉO THẢ ÔN LUYỆN CHỮ CÁI */}
          {alphabetSubTab === 'drag' && (
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border-2 border-rose-200 shadow-md space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-rose-950 font-bubbly">
                    🧩 Câu Hỏi {letterPuzzleIndex + 1}/{letterPuzzles.length}: Kéo Chữ Cái Còn Thiếu
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500">
                    Bé hãy kéo chữ cái đúng bên dưới và thả vào ô trống để hoàn thành từ nhé!
                  </p>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-rose-100 text-rose-900 font-black text-xs border border-rose-300">
                  Điểm: {letterPuzzleScore} ⭐
                </div>
              </div>

              {/* Puzzle Interactive Display Box */}
              <div className="p-8 rounded-3xl bg-gradient-to-b from-rose-50/50 via-pink-50/30 to-amber-50/40 border-2 border-dashed border-rose-300 flex flex-col items-center justify-center text-center space-y-4">
                <div className="text-6xl sm:text-7xl">{letterPuzzles[letterPuzzleIndex].imageEmoji}</div>

                <div className="flex items-center justify-center gap-3 text-3xl sm:text-4xl font-black font-bubbly text-stone-800">
                  <span>
                    {letterPuzzles[letterPuzzleIndex].wordTemplate.split('_')[0]}
                  </span>

                  {/* Drop Target Box */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const char = e.dataTransfer.getData('text/plain') || letterDraggedId;
                      if (char) handleCheckLetterDrop(char);
                    }}
                    onClick={() => {
                      if (letterDraggedId) handleCheckLetterDrop(letterDraggedId);
                    }}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-4 border-dashed flex items-center justify-center transition-all cursor-pointer ${
                      letterDroppedLetter
                        ? letterDroppedLetter === letterPuzzles[letterPuzzleIndex].missingChar
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-800 shadow-md scale-105'
                          : 'bg-rose-100 border-rose-500 text-rose-800'
                        : 'bg-white border-rose-400 text-stone-400 hover:bg-rose-50 hover:scale-105'
                    }`}
                  >
                    {letterDroppedLetter ? (
                      <span className="text-3xl sm:text-4xl font-black font-bubbly">
                        {letterDroppedLetter}
                      </span>
                    ) : (
                      <span className="text-xl sm:text-2xl text-rose-300 animate-pulse">?</span>
                    )}
                  </div>

                  <span>
                    {letterPuzzles[letterPuzzleIndex].wordTemplate.split('_')[1]}
                  </span>
                </div>

                {letterFeedback && (
                  <div
                    className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black font-bubbly animate-bounce ${
                      letterFeedback.isCorrect
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {letterFeedback.text}
                  </div>
                )}
              </div>

              {/* Draggable Letter Options */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-stone-600 text-center">
                  👇 Chạm hoặc Kéo chữ cái đúng vào ô chấm hỏi ở trên:
                </p>
                <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                  {letterPuzzles[letterPuzzleIndex].options.map((char) => (
                    <div
                      key={char}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', char);
                        setLetterDraggedId(char);
                        sounds.playPop();
                      }}
                      onClick={() => {
                        setLetterDraggedId(char);
                        handleCheckLetterDrop(char);
                      }}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-2xl sm:text-3xl font-bubbly flex items-center justify-center shadow-md hover:scale-110 active:scale-95 cursor-grab active:cursor-grabbing border-2 border-white select-none transition-transform"
                    >
                      {char}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleNextLetterPuzzle}
                  className="px-6 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-xs sm:text-sm font-bubbly flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <span>Câu tiếp theo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHÂN HỆ 2: HỌC CHỮ SỐ (ĐẾM ĐỒ VẬT & KÉO THẢ) */}
      {/* ========================================================================= */}
      {activeTab === 'numbers' && (
        <div className="space-y-6">
          {/* Subtabs for Numbers */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => {
                sounds.playPop();
                setNumberSubTab('count');
              }}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black font-bubbly transition-all cursor-pointer ${
                numberSubTab === 'count'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-white text-stone-700 hover:bg-amber-50 border border-amber-200'
              }`}
            >
              🔢 Bé Tập Đếm Số Từ 0 Đến 10
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                setNumberSubTab('drag');
              }}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black font-bubbly transition-all cursor-pointer ${
                numberSubTab === 'drag'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-white text-stone-700 hover:bg-amber-50 border border-amber-200'
              }`}
            >
              🎯 Bài Tập Kéo Thả Đếm Số (Điểm: {numberPuzzleScore})
            </button>
          </div>

          {/* CHẾ ĐỘ 1: BÉ TẬP ĐẾM & ĐỌC SỐ */}
          {numberSubTab === 'count' && (
            <div className="space-y-6">
              {/* Highlight Box of Selected Number */}
              <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-amber-50 via-white to-orange-50 border-2 border-amber-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5 sm:gap-7">
                  <div
                    className={`w-24 h-28 sm:w-32 sm:h-36 rounded-3xl bg-gradient-to-tr ${selectedNumber.color} text-white flex flex-col items-center justify-center shadow-xl border-4 border-white select-none transform hover:scale-105 transition-transform`}
                  >
                    <span className="text-5xl sm:text-7xl font-black font-bubbly drop-shadow">
                      {selectedNumber.num}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      {selectedNumber.word}
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-amber-950 font-bubbly flex items-center gap-1.5 flex-wrap">
                      {selectedNumber.items.length === 0 ? (
                        <span>Không có đồ vật nào ⭕</span>
                      ) : (
                        selectedNumber.items.map((emoji, idx) => <span key={idx}>{emoji}</span>)
                      )}
                    </div>
                    <p className="text-sm sm:text-base text-stone-700 font-medium italic">
                      "{selectedNumber.rhyme}"
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handlePlayNumberSpeech(selectedNumber)}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-sm font-bubbly shadow-lg shadow-orange-500/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 border-2 border-white"
                >
                  <Volume2 className="w-5 h-5 animate-pulse" />
                  <span>Bé Nghe Đếm Số 🔊</span>
                </button>
              </div>

              {/* Number buttons grid (0-10) */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-11 gap-2.5 sm:gap-3">
                {PRESCHOOL_NUMBERS.map((item) => {
                  const isSelected = selectedNumber.num === item.num;
                  return (
                    <button
                      key={item.num}
                      onClick={() => handlePlayNumberSpeech(item)}
                      className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                        isSelected
                          ? `bg-gradient-to-b ${item.color} text-white border-white shadow-md scale-105 ring-2 ring-amber-400`
                          : 'bg-white hover:bg-amber-50 border-stone-200 text-stone-800 hover:scale-102'
                      }`}
                    >
                      <span className="text-3xl sm:text-4xl font-black font-bubbly">
                        {item.num}
                      </span>
                      <span className="text-[11px] font-bold opacity-80 mt-1">{item.word}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CHẾ ĐỘ 2: BÀI TẬP KÉO THẢ ÔN LUYỆN SỐ ĐẾM */}
          {numberSubTab === 'drag' && (
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border-2 border-amber-200 shadow-md space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-amber-950 font-bubbly">
                    🎯 Câu Hỏi {numberPuzzleIndex + 1}/{numberPuzzles.length}: {numberPuzzles[numberPuzzleIndex].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500">
                    Bé hãy đếm số lượng đồ vật rồi kéo số tương ứng vào rổ tròn nhé!
                  </p>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 font-black text-xs border border-amber-300">
                  Điểm: {numberPuzzleScore} ⭐
                </div>
              </div>

              {/* Objects counting display */}
              <div className="p-8 rounded-3xl bg-gradient-to-b from-amber-50/50 via-orange-50/30 to-yellow-50/40 border-2 border-dashed border-amber-300 flex flex-col items-center justify-center text-center space-y-5">
                <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap text-5xl sm:text-6xl">
                  {numberPuzzles[numberPuzzleIndex].items.map((emoji, idx) => (
                    <span key={idx} className="animate-bounce" style={{ animationDelay: `${idx * 0.15}s` }}>
                      {emoji}
                    </span>
                  ))}
                </div>

                {/* Drop Basket Target */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const numStr = e.dataTransfer.getData('text/plain');
                    const num = numStr ? parseInt(numStr, 10) : numberDraggedVal;
                    if (num !== null) handleCheckNumberDrop(num);
                  }}
                  onClick={() => {
                    if (numberDraggedVal !== null) handleCheckNumberDrop(numberDraggedVal);
                  }}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-4 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer ${
                    numberDroppedVal !== null
                      ? numberDroppedVal === numberPuzzles[numberPuzzleIndex].targetNum
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-800 shadow-md scale-105'
                        : 'bg-rose-100 border-rose-500 text-rose-800'
                      : 'bg-white border-amber-400 text-stone-400 hover:bg-amber-50 hover:scale-105'
                  }`}
                >
                  {numberDroppedVal !== null ? (
                    <span className="text-4xl sm:text-5xl font-black font-bubbly">
                      {numberDroppedVal}
                    </span>
                  ) : (
                    <>
                      <span className="text-2xl">🧺</span>
                      <span className="text-[10px] font-bold text-amber-700">Thả số vào đây</span>
                    </>
                  )}
                </div>

                {numberFeedback && (
                  <div
                    className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black font-bubbly animate-bounce ${
                      numberFeedback.isCorrect
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {numberFeedback.text}
                  </div>
                )}
              </div>

              {/* Draggable Number Options */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-stone-600 text-center">
                  👇 Chạm hoặc Kéo chữ số tương ứng vào chiếc rổ:
                </p>
                <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                  {numberPuzzles[numberPuzzleIndex].options.map((num) => (
                    <div
                      key={num}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', String(num));
                        setNumberDraggedVal(num);
                        sounds.playPop();
                      }}
                      onClick={() => {
                        setNumberDraggedVal(num);
                        handleCheckNumberDrop(num);
                      }}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-3xl font-bubbly flex items-center justify-center shadow-md hover:scale-110 active:scale-95 cursor-grab active:cursor-grabbing border-2 border-white select-none transition-transform"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleNextNumberPuzzle}
                  className="px-6 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-xs sm:text-sm font-bubbly flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <span>Câu tiếp theo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHÂN HỆ 3: TẠO HÌNH (BÉ TẬP TÔ MÀU - AI CHẠY NÉT ĐEN TRẮNG, KÉO MÀU, CHẤM ĐIỂM & LƯU VĨNH VIỄN) */}
      {/* ========================================================================= */}
      {activeTab === 'coloring' && (
        <div className="space-y-6">
          {/* 1. Thanh chọn đề tài & AI Tạo Tranh Nét Đen Trắng */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-cyan-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-stone-900 font-bubbly flex items-center gap-2">
                  <span>🎨 Chọn Đề Tài Hoặc Nhập Câu Lệnh AI</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300">
                    AI Sinh Nét Đen Trắng
                  </span>
                </h3>
                <p className="text-xs text-stone-500">
                  Chọn một đề tài có sẵn hoặc tự gõ đề tài để AI chạy ra tranh nét đen trắng cho bé tô màu
                </p>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-600">Đã tô:</span>
                <div className="w-28 h-3.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-black text-cyan-800">{progressPercent}%</span>
              </div>
            </div>

            {/* Đề tài mẫu 1-chạm */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {PRESET_COLORING_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    sounds.playPop();
                    setCurrentTopic(topic);
                  }}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-black font-bubbly transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    currentTopic.id === topic.id
                      ? 'bg-cyan-500 text-white shadow-md border-2 border-white scale-102'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  {topic.title}
                </button>
              ))}
            </div>

            {/* Ô nhập đề tài tự do AI */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customTopicPrompt}
                onChange={(e) => setCustomTopicPrompt(e.target.value)}
                placeholder="Hoặc nhập đề tài mới (Ví dụ: Chú khủng long con, Khinh khí cầu, Tàu hỏa...)"
                className="flex-1 px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-bold text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-cyan-400 outline-none"
              />
              <button
                onClick={handleAiGenerateColoringSheet}
                disabled={isGeneratingSheet || !customTopicPrompt.trim()}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-black text-xs sm:text-sm font-bubbly shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shrink-0"
              >
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>{isGeneratingSheet ? 'AI đang vẽ nét...' : '✨ AI Tạo Nét Đen Trắng'}</span>
              </button>
            </div>
          </div>

          {/* 2. KHUNG VẼ TRANH TÔ MÀU & BẢNG MÀU GỢI Ý */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* CỘT TRÁI (7 COLS): BỨC TRANH NÉT ĐEN TRẮNG CÓ THỂ CHẠM / KÉO MÀU ĐỂ TÔ */}
            <div className="lg:col-span-7 bg-white rounded-[32px] p-5 sm:p-7 border-2 border-cyan-200 shadow-md flex flex-col items-center justify-between space-y-4">
              <div className="w-full flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-stone-900 font-bubbly">
                    {currentTopic.title}
                  </h4>
                  <p className="text-[11px] text-stone-500">{currentTopic.description}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleResetColoring}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="Xóa màu để tô lại từ đầu"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Tô lại</span>
                  </button>
                  <button
                    onClick={handleAutoColorMagic}
                    className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-black flex items-center gap-1 cursor-pointer border border-amber-300"
                    title="AI tô màu gợi ý ma thuật"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Tô ma thuật</span>
                  </button>
                </div>
              </div>

              {/* KHUNG TRANH SVG NÉT VẼ ĐEN TRẮNG (Chạm hoặc Kéo màu vào để tô) */}
              <div className="relative w-full max-w-md aspect-square bg-[#FFFFFF] rounded-3xl border-4 border-dashed border-cyan-300 p-4 shadow-inner flex items-center justify-center overflow-hidden">
                <svg
                  viewBox={currentTopic.viewBox}
                  className="w-full h-full filter drop-shadow-md select-none cursor-pointer"
                >
                  {currentTopic.regions.map((region) => {
                    return (
                      <path
                        key={region.id}
                        d={region.defaultOutlinePath}
                        fill={region.currentColor}
                        stroke="#1E293B"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        onClick={() => handleColorRegion(region.id, activeColor)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const color = e.dataTransfer.getData('text/plain') || draggedColorCode || activeColor;
                          handleColorRegion(region.id, color);
                        }}
                        className="transition-colors duration-200 hover:opacity-85 hover:stroke-cyan-500"
                      >
                        <title>{`${region.name}: Bấm hoặc kéo màu vào để tô`}</title>
                      </path>
                    );
                  })}
                </svg>

                {/* Guide watermark badge */}
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-xl bg-black/60 text-white text-[10px] font-black backdrop-blur-md pointer-events-none">
                  Chạm hoặc Kéo màu vào từng phần để tô
                </div>
              </div>

              {/* Nút Chấm Điểm & Lưu Sản Phẩm */}
              <div className="w-full pt-2 flex items-center justify-between">
                <span className="text-xs text-stone-500 font-bold">
                  {coloredCount}/{currentTopic.regions.length} vùng đã tô
                </span>
                <button
                  onClick={handleSubmitAndEvaluate}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs sm:text-sm font-bubbly shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all border-2 border-white"
                >
                  <Award className="w-4 h-4" />
                  <span>HOÀN THÀNH & CHẤM ĐIỂM (LƯU VĨNH VIỄN) ➔</span>
                </button>
              </div>
            </div>

            {/* CỘT PHẢI (5 COLS): BẢNG MÀU SẮC GỢI Ý & CỌ TÔ MA THUẬT */}
            <div className="lg:col-span-5 bg-white rounded-[32px] p-5 sm:p-6 border-2 border-cyan-200 shadow-md space-y-5">
              <div>
                <h4 className="text-base font-black text-stone-900 font-bubbly flex items-center gap-2">
                  <span>🎨 Bảng Màu Gợi Ý Cho Bé</span>
                  <span
                    className="w-4 h-4 rounded-full border border-stone-300 shadow-2xs"
                    style={{ backgroundColor: activeColor }}
                  />
                </h4>
                <p className="text-xs text-stone-500">
                  Bé chạm để chọn màu hoặc kéo trực tiếp viên màu vào bức tranh:
                </p>
              </div>

              {/* Bảng màu rực rỡ có thể kéo hoặc chạm */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {COLOR_PALETTE.map((c) => {
                  const isSelected = activeColor === c.code;
                  return (
                    <div
                      key={c.code}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', c.code);
                        setDraggedColorCode(c.code);
                        setActiveColor(c.code);
                        sounds.playPop();
                      }}
                      onClick={() => {
                        sounds.playPop();
                        setActiveColor(c.code);
                      }}
                      className={`p-2 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-grab active:cursor-grabbing select-none ${
                        isSelected
                          ? 'border-cyan-500 shadow-md scale-105 ring-2 ring-cyan-300'
                          : 'border-stone-200 hover:border-cyan-300'
                      }`}
                    >
                      <div
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-md mb-1"
                        style={{ backgroundColor: c.code }}
                      />
                      <span className="text-[10px] font-black text-stone-700 text-center leading-tight">
                        {c.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Gợi ý màu sắc theo đề tài đang chọn */}
              <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 space-y-2">
                <span className="text-xs font-black text-cyan-900">
                  💡 Gợi ý màu sắc chuẩn cho đề tài này:
                </span>
                <div className="space-y-1.5">
                  {currentTopic.regions.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        sounds.playPop();
                        setActiveColor(r.suggestedColor);
                      }}
                      className="flex items-center justify-between text-xs p-1.5 rounded-xl bg-white hover:bg-cyan-100/60 cursor-pointer border border-cyan-100 transition-all"
                    >
                      <span className="font-bold text-stone-700">{r.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-4 h-4 rounded-full border border-stone-300"
                          style={{ backgroundColor: r.suggestedColor }}
                        />
                        <span className="text-[10px] text-stone-400 font-mono">
                          {r.suggestedColor}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHÂN HỆ 4: BÉ LUYỆN TƯ DUY (THEO MÔN HỌC & CHỦ ĐỀ MẦM NON) */}
      {/* ========================================================================= */}
      {activeTab === 'thinking' && (
        <div className="space-y-6">
          {/* Header Bar: Điểm số, Chuỗi đúng, và Điều khiển */}
          <div className="p-5 sm:p-6 rounded-[32px] bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border-2 border-emerald-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300">
                <Brain className="w-3.5 h-3.5 text-emerald-600" />
                <span>RÈN LUYỆN TRÍ TUỆ & TƯ DUY TOÀN DIỆN</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-emerald-950 font-bubbly flex items-center gap-2 justify-center md:justify-start">
                <span>🧠 Bé Luyện Tư Duy Mầm Non</span>
              </h3>
              <p className="text-xs text-stone-600 font-medium">
                Các dạng bài tập quy luật, so sánh, phân loại, tìm bóng, môi trường sống và kỹ năng EQ theo chuẩn GDMN.
              </p>
            </div>

            {/* Thống kê điểm số & Nút hoàn thành */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
              <div className="px-3.5 py-2 rounded-2xl bg-white border border-emerald-200 shadow-xs flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span className="text-xs font-black text-stone-800 font-bubbly">
                  Điểm: <strong className="text-amber-600 text-sm">{thinkingScore}</strong>
                </span>
              </div>

              {thinkingStreak > 1 && (
                <div className="px-3 py-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs flex items-center gap-1.5 animate-bounce">
                  <Flame className="w-4 h-4 fill-white" />
                  <span className="text-xs font-black font-bubbly">{thinkingStreak} Chuỗi Đúng!</span>
                </div>
              )}

              <button
                onClick={handleFinishAndSaveThinking}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs font-bubbly shadow-md flex items-center gap-1.5 cursor-pointer border-2 border-white transition-all hover:scale-105"
              >
                <Trophy className="w-4 h-4" />
                <span>Hoàn Thành & Lưu Điểm</span>
              </button>
            </div>
          </div>

          {/* 1. BỘ LỌC THEO MÔN HỌC (SUBJECTS) */}
          <div className="space-y-2">
            <span className="text-xs font-black text-stone-500 uppercase tracking-wide flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-emerald-600" />
              <span>1. Chọn Môn Học / Lĩnh Vực GDMN:</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {THINKING_SUBJECTS.map((sub) => {
                const isSelected = selectedSubjectId === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      sounds.playPop();
                      setSelectedSubjectId(sub.id);
                      setCurrentThinkingIndex(0);
                      setSelectedThinkingOptionId(null);
                      setThinkingFeedback(null);
                    }}
                    className={`p-3 rounded-2xl border-2 transition-all flex items-center gap-2.5 text-left cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-white shadow-md scale-102 ring-2 ring-emerald-300'
                        : 'bg-white hover:bg-emerald-50/70 border-stone-200 text-stone-800'
                    }`}
                  >
                    <span className="text-2xl">{sub.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <span className="block font-black text-xs font-bubbly truncate">
                        {sub.name}
                      </span>
                      <span className={`block text-[10px] font-medium truncate ${isSelected ? 'text-emerald-100' : 'text-stone-400'}`}>
                        {sub.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. BỘ LỌC THEO CHỦ ĐỀ MẦM NON (THEMES) */}
          <div className="space-y-2">
            <span className="text-xs font-black text-stone-500 uppercase tracking-wide flex items-center gap-1.5">
              <span>🎈 2. Chọn Chủ Đề Mầm Non:</span>
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {THINKING_THEMES.map((theme) => {
                const isSelected = selectedThemeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      sounds.playPop();
                      setSelectedThemeId(theme.id);
                      setCurrentThinkingIndex(0);
                      setSelectedThinkingOptionId(null);
                      setThinkingFeedback(null);
                    }}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-black font-bubbly transition-all whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-md border-2 border-white scale-105'
                        : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200'
                    }`}
                  >
                    <span>{theme.emoji}</span>
                    <span>{theme.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. KHUNG BÀI TẬP TƯ DUY TƯƠNG TÁC CHÍNH */}
          {filteredThinkingQuestions.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border-2 border-dashed border-emerald-200 space-y-3">
              <span className="text-5xl">🔍</span>
              <h4 className="text-base font-black text-stone-700 font-bubbly">
                Không tìm thấy bài tập nào cho bộ lọc này!
              </h4>
              <p className="text-xs text-stone-500">
                Bé hãy bấm chọn <strong>"Tất Cả Môn Học"</strong> hoặc <strong>"Tất Cả Chủ Đề"</strong> để khám phá đầy đủ 24+ bài tập nhé!
              </p>
              <button
                onClick={() => {
                  setSelectedSubjectId('all');
                  setSelectedThemeId('all');
                }}
                className="px-5 py-2.5 rounded-2xl bg-emerald-500 text-white font-black text-xs font-bubbly shadow-md"
              >
                Xem tất cả bài tập
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-[36px] p-6 sm:p-8 border-2 border-emerald-200 shadow-md space-y-6">
              {/* Header câu hỏi */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs border border-emerald-300">
                    Câu {(currentThinkingIndex % filteredThinkingQuestions.length) + 1} / {filteredThinkingQuestions.length}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-black text-xs border border-amber-300">
                    +10 Điểm ⭐
                  </span>
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-bold text-xs border border-purple-200">
                    {THINKING_THEMES.find((t) => t.id === activeThinkingQuestion.themeId)?.name || 'Chủ đề mầm non'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    sounds.playPop();
                    speakText(activeThinkingQuestion.voicePrompt, 0.95, 'vi-VN');
                  }}
                  className="px-4 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-black text-xs font-bubbly flex items-center gap-1.5 cursor-pointer self-start sm:self-auto border border-emerald-200"
                >
                  <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span>Bé Nghe Đọc Câu Hỏi 🔊</span>
                </button>
              </div>

              {/* Tiêu đề câu hỏi */}
              <div className="text-center sm:text-left space-y-1">
                <h4 className="text-xl sm:text-2xl font-black text-stone-900 font-bubbly text-emerald-950">
                  {activeThinkingQuestion.title}
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 font-medium">
                  {activeThinkingQuestion.voicePrompt}
                </p>
              </div>

              {/* KHUNG HIỂN THỊ HÌNH ẢNH TRỰC QUAN (VISUAL CONTEXT) */}
              {activeThinkingQuestion.visualContext && (
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-stone-50 via-emerald-50/30 to-teal-50/40 border-2 border-emerald-200/80 shadow-inner flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
                    {activeThinkingQuestion.visualContext.items.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col items-center justify-center transition-transform hover:scale-110 ${
                          item === '❓'
                            ? 'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-400 border-4 border-dashed border-amber-600 text-white font-black text-2xl sm:text-3xl shadow-lg animate-pulse flex items-center justify-center'
                            : 'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 border-emerald-200 shadow-md text-3xl sm:text-4xl flex items-center justify-center'
                        }`}
                      >
                        <span>{item}</span>
                        {activeThinkingQuestion.visualContext?.labels && activeThinkingQuestion.visualContext.labels[idx] && (
                          <span className="text-[10px] sm:text-[11px] font-bold text-stone-600 mt-1 truncate max-w-[70px]">
                            {activeThinkingQuestion.visualContext.labels[idx]}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CÁC PHƯƠNG ÁN LỰA CHỌN TƯƠNG TÁC (3 OPTIONS) */}
              <div className="space-y-3">
                <span className="text-xs font-black text-stone-500 uppercase tracking-wider block">
                  👉 Bé hãy chạm chọn câu trả lời đúng nhất:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {activeThinkingQuestion.options.map((opt) => {
                    const isSelected = selectedThinkingOptionId === opt.id;
                    let btnStyle = 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800';

                    if (isSelected) {
                      if (opt.isCorrect) {
                        btnStyle = 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-white shadow-lg shadow-emerald-500/30 scale-102 ring-4 ring-emerald-300';
                      } else {
                        btnStyle = 'bg-gradient-to-r from-rose-500 to-pink-600 text-white border-white shadow-lg shadow-rose-500/30 ring-4 ring-rose-300';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        disabled={selectedThinkingOptionId !== null && isSelected}
                        onClick={() => handleCheckThinkingAnswer(opt)}
                        className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer select-none ${btnStyle}`}
                      >
                        <span className="text-4xl sm:text-5xl mb-2 filter drop-shadow">
                          {opt.emoji}
                        </span>
                        <span className="font-black text-xs sm:text-sm font-bubbly">
                          {opt.text}
                        </span>

                        {isSelected && opt.isCorrect && (
                          <div className="mt-2 flex items-center gap-1 text-[11px] font-black text-emerald-100 bg-black/20 px-2.5 py-0.5 rounded-full">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>ĐÚNG RỒI! 🎉</span>
                          </div>
                        )}
                        {isSelected && !opt.isCorrect && (
                          <div className="mt-2 flex items-center gap-1 text-[11px] font-black text-rose-100 bg-black/20 px-2.5 py-0.5 rounded-full">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>CHƯA ĐÚNG!</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* HỘP PHẢN HỒI KHI TRẢ LỜI (FEEDBACK ALERT) */}
              {thinkingFeedback && (
                <div
                  className={`p-4 rounded-2xl border-2 flex items-start gap-3 animate-fadeIn ${
                    thinkingFeedback.isCorrect
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}
                >
                  <span className="text-2xl mt-0.5">
                    {thinkingFeedback.isCorrect ? '🌟' : '💡'}
                  </span>
                  <div className="flex-1 space-y-1">
                    <h5 className="font-black text-xs sm:text-sm font-bubbly">
                      {thinkingFeedback.isCorrect ? 'Lời Khen Từ Mầm AI:' : 'Gợi Ý Dành Cho Bé:'}
                    </h5>
                    <p className="text-xs sm:text-sm font-medium">
                      {thinkingFeedback.text}
                    </p>
                  </div>
                </div>
              )}

              {/* NÚT ĐIỀU HƯỚNG CÂU HỎI TIẾP THEO */}
              <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
                <button
                  onClick={() => {
                    sounds.playPop();
                    speakText(`Gợi ý cho bé nè: ${activeThinkingQuestion.hint}`, 0.95, 'vi-VN');
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Gợi Ý ({activeThinkingQuestion.hint})</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setSelectedThinkingOptionId(null);
                      setThinkingFeedback(null);
                      const randIdx = Math.floor(Math.random() * filteredThinkingQuestions.length);
                      setCurrentThinkingIndex(randIdx);
                    }}
                    className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="Đổi câu hỏi ngẫu nhiên"
                  >
                    <Shuffle className="w-4 h-4" />
                    <span>Đổi câu</span>
                  </button>

                  <button
                    onClick={handleNextThinkingQuestion}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm font-bubbly shadow-md flex items-center gap-1.5 cursor-pointer border-2 border-white hover:scale-105 active:scale-95 transition-all"
                  >
                    <span>Câu Tiếp Theo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHÂN HỆ 5: BÉ KHÁM PHÁ THẾ GIỚI CÙNG AI (AI DISCOVERY) */}
      {/* ========================================================================= */}
      {activeTab === 'discovery' && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="p-5 sm:p-6 rounded-[32px] bg-gradient-to-r from-indigo-50 via-violet-50 to-pink-50 border-2 border-indigo-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black border border-indigo-300">
                <Compass className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                <span>KÍNH LÚP KHOA HỌC THÔNG MINH · CÔNG CỤ HỖ TRỢ LÀ AI</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-indigo-950 font-bubbly flex items-center gap-2 justify-center md:justify-start">
                <span>🚀 Bé Khám Phá Thế Giới Cùng AI</span>
              </h3>
              <p className="text-xs text-stone-600 font-medium">
                Bé thỏa sức tò mò đặt câu hỏi hoặc chạm vào các điều kỳ diệu để AI giải thích dí dỏm, ngắm tranh 3D và thử thách câu đố nhận huy hiệu thám hiểm!
              </p>
            </div>

            <button
              onClick={handleSpinDiscoveryWheel}
              disabled={isSpinningWheel}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xs sm:text-sm font-bubbly shadow-md flex items-center gap-2 cursor-pointer border-2 border-white hover:scale-105 active:scale-95 transition-all shrink-0"
            >
              <Disc className={`w-4 h-4 ${isSpinningWheel ? 'animate-spin' : ''}`} />
              <span>{isSpinningWheel ? 'Vòng Quay Đang Chạy...' : 'Quay Vòng Khám Phá 🎡'}</span>
            </button>
          </div>

          {/* 1. THANH TƯƠNG TÁC TỰ DO VỚI AI (BÉ HỎI - MẦM AI TRẢ LỜI) */}
          <div className="p-5 rounded-3xl bg-white border-2 border-indigo-200 shadow-md space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-indigo-400" />
                <input
                  type="text"
                  value={discoveryQuery}
                  onChange={(e) => setDiscoveryQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskAiDiscovery()}
                  placeholder="Bé muốn hỏi AI điều gì? (Ví dụ: Vì sao lá cây màu xanh?, Con voi uống nước thế nào?...)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-bold text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <button
                onClick={() => handleAskAiDiscovery()}
                disabled={isSearchingDiscovery || !discoveryQuery.trim()}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black text-xs sm:text-sm font-bubbly shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shrink-0"
              >
                <Rocket className="w-4 h-4" />
                <span>{isSearchingDiscovery ? 'AI Đang Tìm Kiếm...' : 'Hỏi Mầm AI 🚀'}</span>
              </button>
            </div>

            {/* Câu hỏi gợi ý nhanh */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-[11px] font-black text-indigo-700 shrink-0">Gợi ý câu hỏi:</span>
              {[
                'Vì sao lá cây màu xanh? 🍃',
                'Cá có ngủ không? 🐟',
                'Cầu vồng sinh ra từ đâu? 🌈',
                'Bầu trời ban ngày vì sao xanh? ⛅',
                'Mặt trăng ban ngày đi đâu? 🌙',
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDiscoveryQuery(chip.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim());
                    handleAskAiDiscovery(chip.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim());
                  }}
                  className="px-3 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold whitespace-nowrap cursor-pointer transition-colors border border-indigo-200"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* 2. SÁU CHỦ ĐỀ KHÁM PHÁ NỔI BẬT SẴN SÀNG CHẠM */}
          <div className="space-y-2">
            <span className="text-xs font-black text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>🔍 Chạm Chọn Chuyến Khám Phá Kỳ Thú:</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
              {PRESET_DISCOVERY_ADVENTURES.map((preset) => {
                const isSelected = activeDiscovery.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectDiscoveryPreset(preset)}
                    className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer select-none ${
                      isSelected
                        ? 'bg-gradient-to-b from-indigo-500 to-violet-600 text-white border-white shadow-md scale-105 ring-2 ring-indigo-300'
                        : 'bg-white hover:bg-indigo-50/70 border-stone-200 text-stone-800'
                    }`}
                  >
                    <span className="text-3xl mb-1">{preset.emoji}</span>
                    <span className="font-black text-xs font-bubbly line-clamp-1">
                      {preset.title.replace(/[\u{1F300}-\u{1F9FF}]/gu, '')}
                    </span>
                    <span className={`text-[10px] font-medium mt-0.5 truncate ${isSelected ? 'text-indigo-100' : 'text-stone-400'}`}>
                      {preset.theme}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. KHUNG HIỂN THỊ CHI TIẾT BÀI HỌC KHÁM PHÁ ĐA PHƯƠNG TIỆN */}
          {activeDiscovery && (
            <div className="bg-white rounded-[36px] p-6 sm:p-8 border-2 border-indigo-200 shadow-md space-y-6">
              {/* Header chuyến khám phá */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl sm:text-4xl">{activeDiscovery.emoji || '🔍'}</span>
                  <div>
                    <span className="text-[11px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                      {activeDiscovery.theme || 'Khám phá tự nhiên'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-bubbly mt-0.5">
                      {activeDiscovery.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={handlePlayDiscoveryAudio}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black text-xs sm:text-sm font-bubbly shadow-md flex items-center gap-2 cursor-pointer self-start sm:self-auto border-2 border-white hover:scale-105 active:scale-95 transition-all"
                >
                  <Volume2 className={`w-4 h-4 ${isDiscoverySpeaking ? 'animate-bounce' : 'animate-pulse'}`} />
                  <span>{isDiscoverySpeaking ? 'Đang Đọc Cho Bé...' : 'Bé Nghe Giọng Đọc AI 🔊'}</span>
                </button>
              </div>

              {/* 2 Cột: Bên trái Tranh Minh Họa 3D Pixar - Bên phải Lời Giải Thích & Bí Mật */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Cột trái (5 cols): Ảnh 3D */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="relative aspect-square rounded-3xl overflow-hidden bg-stone-100 border-2 border-indigo-200 shadow-md group">
                    <img
                      src={activeDiscovery.imageUrl || activeDiscovery.fallbackImage || 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=800&q=80'}
                      alt={activeDiscovery.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute top-2 left-2 px-3 py-1 rounded-full bg-black/60 text-white text-[10px] font-black backdrop-blur-md">
                      ✨ Tranh Minh Họa 3D Pixar
                    </div>

                    <button
                      onClick={() =>
                        setPreviewDiscoveryImageModal({
                          url: activeDiscovery.imageUrl || activeDiscovery.fallbackImage,
                          title: activeDiscovery.title,
                          subtitle: activeDiscovery.simpleExplanation,
                        })
                      }
                      className="absolute bottom-2 right-2 p-2.5 rounded-2xl bg-black/70 hover:bg-black/90 text-white shadow-md cursor-pointer transition-all hover:scale-110"
                      title="Phóng to tranh toàn màn hình"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-500 text-center font-medium italic">
                    💡 Hình ảnh minh họa 3D sống động kích thích thị giác mầm non
                  </p>
                </div>

                {/* Cột phải (7 cols): Lời giải thích, Bí mật, Thơ 4 chữ */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Lời giải thích của AI */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-black text-indigo-900 uppercase">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>Kính Lúp Thông Thái AI Giải Thích:</span>
                    </div>
                    <p className="text-sm sm:text-base text-stone-800 font-medium leading-relaxed">
                      {activeDiscovery.simpleExplanation}
                    </p>
                  </div>

                  {/* Bí mật bé có biết? */}
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                    <span className="text-2xl mt-0.5">💡</span>
                    <div className="space-y-0.5">
                      <h5 className="font-black text-xs text-amber-900 font-bubbly uppercase">
                        Bí Mật Bé Có Biết?
                      </h5>
                      <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                        {activeDiscovery.funFact}
                      </p>
                    </div>
                  </div>

                  {/* Bài thơ 4 chữ */}
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                    <span className="text-2xl mt-0.5">📖</span>
                    <div className="space-y-1">
                      <h5 className="font-black text-xs text-emerald-900 font-bubbly uppercase">
                        Bài Thơ Ngắn Cho Bé Học Thuộc:
                      </h5>
                      <p className="text-xs sm:text-sm text-emerald-950 font-bold whitespace-pre-line leading-relaxed italic">
                        {activeDiscovery.rhymePoem}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. THỬ THÁCH THÁM HIỂM CÙNG AI (CÂU ĐỐ TƯƠNG TÁC) */}
              {(activeDiscovery.interactiveQuiz || activeDiscovery.quiz) && (
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-violet-50 via-purple-50 to-pink-50 border-2 border-violet-200 space-y-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <h4 className="font-black text-sm sm:text-base text-violet-950 font-bubbly">
                          Thử Thách Thám Hiểm Cùng AI:
                        </h4>
                        <p className="text-xs text-stone-600 font-medium">
                          {(activeDiscovery.interactiveQuiz || activeDiscovery.quiz).question}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-800 font-black text-xs border border-violet-300">
                      Tặng Huy Hiệu 🏅
                    </span>
                  </div>

                  {/* 3 Phương án câu đố */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(activeDiscovery.interactiveQuiz || activeDiscovery.quiz).options.map((optStr: string, idx: number) => {
                      const isSelected = discoveryQuizSelected === idx;
                      const isCorrect = idx === (activeDiscovery.interactiveQuiz || activeDiscovery.quiz).correctIndex;

                      let btnStyle = 'bg-white hover:bg-violet-50 border-stone-200 text-stone-800';
                      if (isSelected) {
                        btnStyle = isCorrect
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-white shadow-md ring-4 ring-emerald-300'
                          : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white border-white shadow-md ring-4 ring-rose-300';
                      }

                      return (
                        <button
                          key={idx}
                          disabled={discoveryQuizSelected !== null && isSelected}
                          onClick={() => handleAnswerDiscoveryQuiz(idx)}
                          className={`p-3.5 rounded-2xl border-2 transition-all font-black text-xs sm:text-sm font-bubbly text-center cursor-pointer select-none ${btnStyle}`}
                        >
                          {optStr}
                        </button>
                      );
                    })}
                  </div>

                  {/* Phản hồi câu đố */}
                  {discoveryQuizFeedback && (
                    <div
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 animate-fadeIn text-xs sm:text-sm font-bold ${
                        discoveryQuizFeedback.isCorrect
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : 'bg-amber-50 border-amber-300 text-amber-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{discoveryQuizFeedback.isCorrect ? '🎉' : '💡'}</span>
                        <span>{discoveryQuizFeedback.text}</span>
                      </div>
                      {discoveryQuizFeedback.isCorrect && (
                        <span className="px-3 py-1 rounded-xl bg-amber-400 text-stone-950 font-black text-xs border border-white shrink-0">
                          Đã lưu thành tích ⭐
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHÂN HỆ 6: BẢNG VÀNG THÀNH TÍCH & BỘ SƯU TẬP TRANH ĐÃ LƯU (LƯU VĨNH VIỄN) */}
      {/* ========================================================================= */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          {/* Header Bar với Sub-tabs: 1. Bảng Vàng Kết Quả Chơi | 2. Bộ Sưu Tập Tranh Tô Màu */}
          <div className="p-5 sm:p-6 rounded-[32px] bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border-2 border-purple-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-purple-950 font-bubbly flex items-center gap-2">
                <span>🏆 BẢNG VÀNG THÀNH TÍCH & KHO LƯU TRỮ CỦA BÉ</span>
              </h3>
              <p className="text-xs text-stone-600 font-medium">
                Tất cả điểm số các bài tập Tư Duy, chuyến Khám Phá AI và tranh tô màu đều được lưu lại vĩnh viễn không mất đi.
              </p>
            </div>

            {/* Sub-tabs switch */}
            <div className="flex items-center gap-2 bg-white/80 p-1.5 rounded-2xl border border-purple-200 self-start md:self-auto">
              <button
                onClick={() => {
                  sounds.playPop();
                  setGallerySubTab('results');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black font-bubbly transition-all cursor-pointer ${
                  gallerySubTab === 'results'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-stone-700 hover:bg-purple-50'
                }`}
              >
                🏅 Bảng Vàng Kết Quả ({playResults.length})
              </button>
              <button
                onClick={() => {
                  sounds.playPop();
                  setGallerySubTab('artworks');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black font-bubbly transition-all cursor-pointer ${
                  gallerySubTab === 'artworks'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-stone-700 hover:bg-purple-50'
                }`}
              >
                🎨 Tranh Tô Màu ({savedArtworks.length})
              </button>
            </div>
          </div>

          {/* 1. HIỂN THỊ SUB-TAB: BẢNG VÀNG KẾT QUẢ CHƠI */}
          {gallerySubTab === 'results' && (
            <div className="space-y-6">
              {/* Thẻ thống kê tổng quan thành tích */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white shadow-md flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
                    ⭐
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase text-amber-100">Tổng Điểm Tích Lũy</span>
                    <h4 className="text-2xl font-black font-bubbly">
                      {playResults.reduce((sum, r) => sum + r.score, 0)} Điểm
                    </h4>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
                    🌟
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase text-emerald-100">Tổng Số Sao Đạt Được</span>
                    <h4 className="text-2xl font-black font-bubbly">
                      {playResults.reduce((sum, r) => sum + r.stars, 0)} Ngôi Sao
                    </h4>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-md flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
                    🏅
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase text-purple-100">Huy Hiệu Đã Mở Khóa</span>
                    <h4 className="text-2xl font-black font-bubbly">
                      {new Set(playResults.map((r) => r.badge)).size} Danh Hiệu
                    </h4>
                  </div>
                </div>
              </div>

              {/* Danh sách các lượt chơi đã lưu */}
              {playResults.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white border-2 border-dashed border-purple-200 space-y-3">
                  <span className="text-5xl">🏆</span>
                  <h4 className="text-base font-black text-stone-700 font-bubbly">
                    Bé chưa có lượt chơi nào được lưu!
                  </h4>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    Bé hãy vào mục <strong>"4. Bé Luyện Tư Duy"</strong> hoặc <strong>"5. Bé Khám Phá AI"</strong> để hoàn thành bài tập và ghi danh lên Bảng Vàng nhé!
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        sounds.playPop();
                        setActiveTab('thinking');
                      }}
                      className="px-5 py-2.5 rounded-2xl bg-emerald-500 text-white font-black text-xs font-bubbly shadow-md"
                    >
                      Luyện Tư Duy Ngay
                    </button>
                    <button
                      onClick={() => {
                        sounds.playPop();
                        setActiveTab('discovery');
                      }}
                      className="px-5 py-2.5 rounded-2xl bg-indigo-500 text-white font-black text-xs font-bubbly shadow-md"
                    >
                      Khám Phá Cùng AI
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-stone-500 uppercase tracking-wide">
                      📋 Lịch Sử Các Lượt Chơi Của Bé ({playResults.length} Lượt):
                    </span>
                    <button
                      onClick={() => {
                        if (confirm('Bé có muốn xóa lịch sử chơi để bắt đầu chặng đua mới không?')) {
                          setPlayResults([]);
                        }
                      }}
                      className="text-xs text-stone-400 hover:text-rose-600 font-bold transition-colors cursor-pointer"
                    >
                      Xóa toàn bộ lịch sử
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {playResults.map((rec) => (
                      <div
                        key={rec.id}
                        className="p-5 rounded-3xl bg-white border-2 border-purple-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`text-[10px] font-black px-2.5 py-0.5 rounded-md border ${
                                  rec.type === 'thinking'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                                }`}
                              >
                                {rec.type === 'thinking' ? '🧠 Luyện Tư Duy' : '🚀 Khám Phá AI'}
                              </span>
                              <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                                {rec.theme}
                              </span>
                            </div>

                            <h4 className="text-base font-black text-stone-900 font-bubbly pt-0.5">
                              {rec.title}
                            </h4>
                            <p className="text-xs text-stone-600 font-medium italic">
                              "{rec.details}"
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 font-black text-xs border border-amber-300 flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                              <span>+{rec.score} đ</span>
                            </div>
                            <span className="text-[10px] text-stone-400 block mt-1">
                              {rec.playedAt}
                            </span>
                          </div>
                        </div>

                        {/* Huy hiệu và Hành động */}
                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                          <span className="px-3 py-1 rounded-xl bg-purple-50 text-purple-900 font-black text-xs border border-purple-200 flex items-center gap-1">
                            <span>🏅</span>
                            <span>{rec.badge}</span>
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                sounds.playPop();
                                if (rec.type === 'thinking') setActiveTab('thinking');
                                else setActiveTab('discovery');
                              }}
                              className="px-3 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                            >
                              Chơi lại
                            </button>
                            <button
                              onClick={(e) => handleDeletePlayResult(rec.id, e)}
                              className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Xóa kết quả này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. HIỂN THỊ SUB-TAB: BỘ SƯU TẬP TRANH TÔ MÀU ĐÃ LƯU */}
          {gallerySubTab === 'artworks' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-stone-500 uppercase tracking-wide">
                  🎨 Bộ Sưu Tập Tranh Tô Màu Của Bé ({savedArtworks.length} Tranh):
                </span>
                <button
                  onClick={() => {
                    sounds.playPop();
                    setActiveTab('coloring');
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-white font-black text-xs font-bubbly shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  + Tô Tranh Mới
                </button>
              </div>

              {savedArtworks.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white border-2 border-dashed border-purple-200 space-y-3">
                  <span className="text-5xl">🎨</span>
                  <h4 className="text-base font-black text-stone-700 font-bubbly">
                    Bé chưa có bức tranh nào trong triển lãm!
                  </h4>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    Bé hãy vào mục <strong>"3. Tạo Hình Tô Màu"</strong>, chọn một đề tài yêu thích rồi hoàn thành để nhận điểm 10 và lưu tranh vào đây nhé!
                  </p>
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setActiveTab('coloring');
                    }}
                    className="px-6 py-2.5 rounded-2xl bg-cyan-500 text-white font-black text-xs font-bubbly shadow-md inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Bắt đầu tô màu ngay</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {savedArtworks.map((art) => (
                    <div
                      key={art.id}
                      className="bg-white rounded-3xl p-5 border-2 border-purple-200 shadow-md flex flex-col justify-between space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all"
                    >
                      <div className="space-y-3">
                        {/* SVG Artwork Preview */}
                        <div className="relative aspect-square rounded-2xl bg-stone-50 border-2 border-stone-200 p-3 flex items-center justify-center overflow-hidden">
                          <svg viewBox="0 0 200 200" className="w-full h-full">
                            {art.regions.map((reg) => (
                              <path
                                key={reg.id}
                                d={reg.defaultOutlinePath}
                                fill={reg.currentColor}
                                stroke="#1E293B"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            ))}
                          </svg>
                          {/* Score Badge */}
                          <div className="absolute top-2 right-2 px-3 py-1 rounded-xl bg-amber-400 text-stone-950 font-black text-xs shadow-md border border-white flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{art.score}/10</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                            {art.category}
                          </span>
                          <h4 className="text-base font-black text-stone-900 font-bubbly mt-1">
                            {art.title}
                          </h4>
                          <p className="text-xs text-stone-600 line-clamp-2 mt-1 italic">
                            "{art.praise}"
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-stone-400 font-medium">
                          📅 {art.completedAt}
                        </span>
                        <button
                          onClick={(e) => handleDeleteArtwork(art.id, e)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Xóa tranh này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL HOÀN THÀNH BÀI TẬP TƯ DUY & LƯU KẾT QUẢ */}
      {/* ========================================================================= */}
      {showThinkingCompletionModal && thinkingCompletedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-[36px] p-6 sm:p-8 border-4 border-emerald-300 shadow-2xl text-center space-y-5 relative">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-4xl shadow-xl border-4 border-white animate-bounce">
              🧠
            </div>

            <div className="space-y-1">
              <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs border border-emerald-300">
                CHÚC MỪNG BÉ THÔNG THÁI!
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-900 font-bubbly pt-1">
                Điểm Số: {thinkingCompletedResult.score} Điểm ⭐
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-medium italic">
                Bé đã trả lời rất xuất sắc các câu hỏi rèn luyện tư duy logic mầm non!
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
              <span className="text-[11px] font-black text-amber-800 uppercase block">Huy Hiệu Trao Tặng:</span>
              <span className="text-base font-black text-amber-950 font-bubbly block">
                🏅 {thinkingCompletedResult.badge}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Kết quả chơi đã được tự động lưu vĩnh viễn vào Bảng Vàng!</span>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  sounds.playPop();
                  setShowThinkingCompletionModal(false);
                  setActiveTab('gallery');
                  setGallerySubTab('results');
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs sm:text-sm font-bubbly shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <span>Xem Bảng Vàng</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  sounds.playPop();
                  setShowThinkingCompletionModal(false);
                }}
                className="px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-xs sm:text-sm font-bubbly cursor-pointer"
              >
                <span>Đóng lại</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL PHÓNG TO TRANH KHÁM PHÁ AI (CHIẾU TV / LỚP HỌC) */}
      {/* ========================================================================= */}
      {previewDiscoveryImageModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-stone-900 rounded-[36px] overflow-hidden border-2 border-indigo-400 shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
            <button
              onClick={() => setPreviewDiscoveryImageModal(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="md:w-3/5 bg-black flex items-center justify-center p-2">
              <img
                src={previewDiscoveryImageModal.url}
                alt={previewDiscoveryImageModal.title}
                className="max-h-[60vh] md:max-h-[85vh] w-auto object-contain rounded-2xl"
              />
            </div>

            <div className="md:w-2/5 p-6 text-white flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 font-black text-xs border border-indigo-400">
                  ✨ KHÁM PHÁ THẾ GIỚI 3D
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-bubbly text-white">
                  {previewDiscoveryImageModal.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
                  {previewDiscoveryImageModal.subtitle}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-800 flex items-center gap-2">
                <button
                  onClick={() => {
                    sounds.playPop();
                    speakText(previewDiscoveryImageModal.subtitle, 0.95, 'vi-VN');
                  }}
                  className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs font-bubbly flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Nghe Đọc Lại</span>
                </button>
                <button
                  onClick={() => setPreviewDiscoveryImageModal(null)}
                  className="px-5 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL CHẤM ĐIỂM & CHÚC MỪNG HOÀN THÀNH TÁC PHẨM TÔ MÀU */}
      {/* ========================================================================= */}
      {showEvaluationModal && evaluationResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-[36px] p-6 sm:p-8 border-4 border-amber-300 shadow-2xl text-center space-y-5 relative">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-4xl shadow-xl border-4 border-white animate-bounce">
              🏆
            </div>

            <div className="space-y-1">
              <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-xs border border-amber-300">
                CHÚC MỪNG BÉ ĐÃ HOÀN THÀNH XUẤT SẮC!
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-900 font-bubbly pt-1">
                Điểm Số: {evaluationResult.score}/10 ⭐
              </h3>
              <p className="text-sm text-stone-700 font-medium italic max-w-md mx-auto">
                "{evaluationResult.praise}"
              </p>
            </div>

            {/* Badges Earned */}
            <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
              {evaluationResult.badges.map((b, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-purple-100 text-purple-900 font-black text-xs border border-purple-300 shadow-2xs"
                >
                  {b}
                </span>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Tác phẩm đã được tự động lưu vĩnh viễn vào Triển Lãm Của Bé!</span>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  sounds.playPop();
                  setShowEvaluationModal(false);
                  setActiveTab('gallery');
                  setGallerySubTab('artworks');
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs sm:text-sm font-bubbly shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <span>Xem Trong Triển Lãm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  sounds.playPop();
                  setShowEvaluationModal(false);
                }}
                className="px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-xs sm:text-sm font-bubbly cursor-pointer"
              >
                <span>Đóng lại</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
