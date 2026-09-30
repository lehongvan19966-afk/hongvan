import React, { useState, useRef, useEffect } from 'react';
import { MamAiMascot } from '../components/MamAiMascot';
import {
  Sparkles,
  Send,
  Volume2,
  Copy,
  Check,
  Bookmark,
  Share2,
  RefreshCw,
  Baby,
  BookOpen,
  Palette,
  Apple,
  HeartHandshake,
  GraduationCap,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Lightbulb,
} from 'lucide-react';
import { askPreschoolAssistant } from '../services/aiService';
import { sounds, speakText, stopSpeaking } from '../utils/audioUtils';
import { persistentDocStorage } from '../services/persistentDocStorage';

interface MessageItem {
  id: string;
  role: 'user' | 'ai';
  content: string;
  ageGroup?: string;
  topicCategory?: string;
  timestamp: string;
}

const AGE_GROUPS = [
  { id: '18–24 tháng (Nhà trẻ)', label: '👶 18–24 tháng', shortLabel: 'Nhà trẻ 1', sub: 'Tập đi, bi bô tập nói' },
  { id: '24–36 tháng (Nhà trẻ)', label: '🍼 24–36 tháng', shortLabel: 'Nhà trẻ 2', sub: 'Khám phá thế giới, nói câu đơn' },
  { id: '3–4 tuổi (Lớp Mầm)', label: '🌸 3–4 tuổi', shortLabel: 'Lớp Mầm', sub: 'Tò mò, ham hỏi, học tự lập' },
  { id: '4–5 tuổi (Lớp Chồi)', label: '🌿 4–5 tuổi', shortLabel: 'Lớp Chồi', sub: 'Trí tưởng tượng phong phú, vận động tinh' },
  { id: '5–6 tuổi (Lớp Lá)', label: '🌳 5–6 tuổi', shortLabel: 'Lớp Lá', sub: 'Tư duy logic, sẵn sàng vào lớp 1' },
];

const TOPIC_CATEGORIES = [
  {
    id: 'development',
    title: 'Sự phát triển của bé',
    icon: Baby,
    color: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    desc: 'Thể chất, ngôn ngữ, vận động, nhận thức thế giới',
  },
  {
    id: 'storytelling',
    title: 'Kể chuyện cho bé',
    icon: BookOpen,
    color: 'from-amber-500 to-orange-600',
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    desc: 'Truyện đạo đức, hạt giống tâm hồn, ru ngủ, sáng tạo AI',
  },
  {
    id: 'home_activity',
    title: 'Hoạt động tại nhà',
    icon: Palette,
    color: 'from-violet-500 to-purple-600',
    border: 'border-violet-200',
    bg: 'bg-violet-50',
    text: 'text-violet-800',
    desc: 'Trò chơi mẹ & bé, thí nghiệm mini, vận động không tốn kém',
  },
  {
    id: 'nutrition',
    title: 'Dinh dưỡng & Sức khỏe',
    icon: Apple,
    color: 'from-rose-500 to-pink-600',
    border: 'border-rose-200',
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    desc: 'Thực đơn ăn dặm, xử lý biếng ăn, giấc ngủ, vệ sinh',
  },
  {
    id: 'behavior',
    title: 'Tâm lý & Hành vi bé',
    icon: HeartHandshake,
    color: 'from-sky-500 to-blue-600',
    border: 'border-sky-200',
    bg: 'bg-sky-50',
    text: 'text-sky-800',
    desc: 'Khủng hoảng tuổi lên 3, mè nheo, nhút nhát, chia sẻ đồ chơi',
  },
  {
    id: 'pedagogy',
    title: 'Sư phạm mầm non',
    icon: GraduationCap,
    color: 'from-cyan-500 to-blue-600',
    border: 'border-cyan-200',
    bg: 'bg-cyan-50',
    text: 'text-cyan-800',
    desc: 'Ý tưởng góc chơi STEAM, thiết kế bài dạy, hồ sơ theo dõi trẻ',
  },
];

const QUICK_PROMPT_MAP: Record<string, string[]> = {
  development: [
    'Làm thế nào để kích thích phát triển ngôn ngữ mạch lạc cho bé?',
    'Các mốc phát triển vận động tinh & thô quan trọng ở độ tuổi này?',
    'Cách rèn luyện khả năng tập trung và quan sát cho bé?',
    'Dấu hiệu nhận biết bé phát triển nhận thức tốt và cần hỗ trợ gì thêm?',
  ],
  storytelling: [
    'Hãy kể một câu chuyện ngắn 3 phút về bạn Thỏ Trắng biết chia sẻ đồ chơi',
    'Kể câu chuyện ru ngủ êm dịu về khu rừng đom đóm đưa bé vào giấc ngủ ngon',
    'Soạn mẩu chuyện ngộ nghĩnh giải thích vì sao bé phải đánh răng mỗi tối',
    'Kể câu chuyện về lòng biết ơn khi bé được cô giáo và ba mẹ chăm sóc',
  ],
  home_activity: [
    'Gợi ý 3 trò chơi giác quan sensory tại nhà bằng đồ dùng có sẵn',
    'Thí nghiệm khoa học mini: Cầu vồng sữa diệu kỳ an toàn cho bé chơi',
    'Trò chơi vận động giải phóng năng lượng trong phòng khách ngày mưa',
    'Hoạt động tạo hình vẽ tranh bằng ngón tay giúp bé phát triển sáng tạo',
  ],
  nutrition: [
    'Thực đơn 7 ngày giàu dinh dưỡng giúp bé thích thú ăn rau củ quả',
    'Bé hay ngậm cơm và không chịu nuốt, cô và mẹ nên xử lý tâm lý ra sao?',
    'Lịch sinh hoạt và giấc ngủ trưa khoa học cho bé mầm non',
    'Cách bổ sung vitamin và tăng cường sức đề kháng tự nhiên cho bé',
  ],
  behavior: [
    'Bé hay ăn vạ lăn ra đất khóc thét khi không vừa ý, xử lý thế nào?',
    'Bé ở lớp hay tranh giành đồ chơi và đánh bạn, cô giáo khuyên mẹ ra sao?',
    'Bé rất nhút nhát, bám chặt mẹ và sợ đi học mầm non, cách giúp bé tự tin?',
    'Bé hay sợ bóng tối hoặc sợ tiếng động lạ, cách vỗ về cảm xúc cho bé?',
  ],
  pedagogy: [
    'Ý tưởng thiết kế góc trải nghiệm STEAM sáng tạo từ nguyên liệu tái chế',
    'Cách tổ chức hoạt động ổn định lớp và thu hút sự chú ý của trẻ đầu giờ',
    'Phương pháp quan sát và ghi chép nhật ký phát triển của trẻ theo chỉ số',
    'Cách kết nối và trao đổi sư phạm hiệu quả với phụ huynh qua sổ liên lạc',
  ],
};

interface AiAssistantViewProps {
  onNavigateToTab?: (tab: string) => void;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ onNavigateToTab }) => {
  const [selectedAge, setSelectedAge] = useState<string>('3–4 tuổi (Lớp Mầm)');
  const [selectedTopic, setSelectedTopic] = useState<string>('development');
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chatList, setChatList] = useState<MessageItem[]>([
    {
      id: 'welcome-init',
      role: 'ai',
      ageGroup: '3–4 tuổi (Lớp Mầm)',
      topicCategory: 'development',
      timestamp: 'Vừa xong',
      content: `Xin chào cô giáo và quý phụ huynh thân mến! 🌸
Tôi là **Trợ lý AI Mầm Non Thông Minh** thuộc Hệ sinh thái *Chuyển đổi số GDMN Thủ đô 2026*.

Tôi sẵn sàng giải đáp mọi thắc mắc chuyên sâu về:
🌱 **Sự phát triển toàn diện** của bé (thể chất, ngôn ngữ, vận động, nhận thức).
📖 **Kể chuyện & sáng tác thơ** nuôi dưỡng tâm hồn trẻ thơ.
🎨 **Hoạt động & trò chơi** thú vị gắn kết bé tại lớp và tại nhà.
🥗 **Dinh dưỡng, giấc ngủ & chăm sóc sức khỏe** mầm non.
❤️ **Tâm lý lứa tuổi & phương pháp ứng xử** nhẹ nhàng, sư phạm.

Cô và ba mẹ hãy chọn **Độ tuổi** và **Chủ đề** ở trên, hoặc bấm câu hỏi gợi ý bên dưới để cùng Mầm AI trò chuyện ngay nhé! ✨`,
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatList, isLoading]);

  const handleAskQuestion = async (queryText?: string) => {
    const text = (queryText || inputQuery).trim();
    if (!text || isLoading) return;

    sounds.playPop();
    const userMessage: MessageItem = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: text,
      ageGroup: selectedAge,
      topicCategory: selectedTopic,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatList((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const history = chatList.slice(-4).map((m) => ({ role: m.role, content: m.content }));
      const aiReply = await askPreschoolAssistant({
        question: text,
        ageGroup: selectedAge,
        topicCategory: selectedTopic,
        history,
      });

      const aiMessage: MessageItem = {
        id: `msg_${Date.now()}_ai`,
        role: 'ai',
        content: aiReply,
        ageGroup: selectedAge,
        topicCategory: selectedTopic,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setChatList((prev) => [...prev, aiMessage]);
      sounds.playSuccess();
    } catch (err) {
      console.error('Error asking assistant:', err);
      const fallbackMsg: MessageItem = {
        id: `msg_${Date.now()}_ai_err`,
        role: 'ai',
        content: `Mầm AI đã ghi nhận câu hỏi của cô/mẹ về độ tuổi **${selectedAge}**. Cô có thể thử chọn các câu hỏi mẫu gợi ý hoặc gửi lại câu hỏi nhé! 💖`,
        ageGroup: selectedAge,
        topicCategory: selectedTopic,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatList((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (msgId: string, content: string) => {
    if (speakingId === msgId) {
      stopSpeaking();
      setSpeakingId(null);
      return;
    }
    sounds.playPop();
    setSpeakingId(msgId);
    // Extract first 400 chars cleanly
    const cleanSpeech = content
      .replace(/[*#_~`\[\]>]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 450);
    speakText(cleanSpeech, 1.1, 'vi-VN');
  };

  const handleCopy = (msgId: string, content: string) => {
    sounds.playPop();
    navigator.clipboard.writeText(content);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSaveToDocs = async (msg: MessageItem) => {
    sounds.playSuccess();
    try {
      await persistentDocStorage.saveDocument({
        title: `Tư vấn AI: ${msg.content.slice(0, 50)}...`,
        category: 'Trợ lý AI Mầm Non',
        sourceFunction: 'academy',
        type: 'text',
        fileUrl: '',
        fileName: 'Tu_van_Mam_AI.txt',
        author: 'Trợ lý AI Mầm Non',
        description: `Giải đáp chuyên sâu cho độ tuổi ${msg.ageGroup || selectedAge}`,
        content: msg.content,
        tags: ['Trợ lý AI', msg.ageGroup || selectedAge, 'Tư vấn mầm non'],
      });
      setSavedId(msg.id);
      setTimeout(() => setSavedId(null), 3000);
      speakText('Đã lưu câu trả lời vào kho học liệu của cô rồi nhé!', 1.1, 'vi-VN');
    } catch (e) {
      console.warn('Save doc notice:', e);
    }
  };

  const currentTopicObj = TOPIC_CATEGORIES.find((t) => t.id === selectedTopic) || TOPIC_CATEGORIES[0];
  const quickPrompts = QUICK_PROMPT_MAP[selectedTopic] || QUICK_PROMPT_MAP.development;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-24 max-w-6xl mx-auto">
      {/* 1. TOP HEADER BANNER: TRỢ LÝ AI MẦM NON */}
      <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] bg-gradient-to-r from-[#021435] via-[#092b67] via-[#0284C7] to-[#021435] border-[3px] border-cyan-400/80 p-6 sm:p-8 shadow-[0_16px_45px_rgba(2,132,199,0.35)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#38BDF8_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-cyan-400/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/95 p-1 shadow-[0_0_25px_rgba(34,211,238,0.5)] border-2 border-cyan-300 flex items-center justify-center shrink-0">
              <MamAiMascot size="md" mood="teaching" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/70 text-cyan-200 text-[11px] font-black tracking-wide">
                <span>⚡ CHUYỂN ĐỔI SỐ GDMN THỦ ĐÔ 2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-bubbly text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-sky-200">
                TRỢ LÝ AI MẦM NON
              </h1>
              <p className="text-xs sm:text-sm text-cyan-100/90 font-medium max-w-xl">
                Người dùng hỏi & AI giải đáp chuyên sâu: Độ tuổi, sự phát triển, kể chuyện, hoạt động tại nhà, dinh dưỡng và tâm lý trẻ thơ.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
            <span className="px-3.5 py-1.5 rounded-2xl bg-cyan-950/80 border border-cyan-300/40 text-cyan-200 text-xs font-black flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Chuẩn Bộ GD&ĐT</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-2xl bg-amber-500/20 border border-amber-300/40 text-amber-200 text-xs font-black flex items-center gap-1.5">
              <span>💖 Sư phạm yêu thương</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. CONTROL PANEL: CHỌN ĐỘ TUỔI & CHỌN CHỦ ĐỀ */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-amber-200/80 shadow-[0_8px_30px_rgba(251,191,36,0.1)] space-y-5">
        {/* A. BỘ CHỌN ĐỘ TUỔI */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-black text-amber-950 font-bubbly flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">1</span>
              <span>Chọn Độ Tuổi Của Bé:</span>
            </label>
            <span className="text-xs text-orange-700 font-bold bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
              Đang chọn: {selectedAge}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {AGE_GROUPS.map((age) => {
              const isSelected = selectedAge === age.id;
              return (
                <button
                  key={age.id}
                  onClick={() => {
                    sounds.playPop();
                    setSelectedAge(age.id);
                  }}
                  className={`p-3 rounded-2xl text-left transition-all cursor-pointer border-2 ${
                    isSelected
                      ? 'bg-gradient-to-b from-orange-50 to-amber-50 border-orange-500 shadow-md scale-102 ring-2 ring-orange-400/20'
                      : 'bg-stone-50/70 hover:bg-stone-100/90 border-stone-200 text-stone-700'
                  }`}
                >
                  <div className="font-black text-xs sm:text-sm font-bubbly text-amber-950">{age.label}</div>
                  <div className="text-[10px] text-stone-500 font-medium truncate mt-0.5">{age.sub}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* B. BỘ CHỌN CHỦ ĐỀ */}
        <div className="space-y-2.5 pt-2 border-t border-amber-100">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-black text-amber-950 font-bubbly flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center text-xs font-bold">2</span>
              <span>Chọn Chủ Đề Cần Hỏi Đáp:</span>
            </label>
            <span className="text-xs text-stone-500 font-medium">Bấm để đổi chủ đề</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {TOPIC_CATEGORIES.map((topic) => {
              const isSelected = selectedTopic === topic.id;
              const Icon = topic.icon;
              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    sounds.playPop();
                    setSelectedTopic(topic.id);
                  }}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer border-2 ${
                    isSelected
                      ? `bg-white ${topic.border} shadow-md scale-102 ring-2 ring-orange-400/30`
                      : 'bg-stone-50/60 hover:bg-stone-100/80 border-stone-200 text-stone-600'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white bg-gradient-to-tr ${topic.color} shadow-sm mb-1.5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[11px] sm:text-xs font-black font-bubbly leading-tight ${isSelected ? topic.text : 'text-stone-800'}`}>
                    {topic.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* C. GỢI Ý CÂU HỎI 1 CHẠM THEO CHỦ ĐỀ & ĐỘ TUỔI */}
        <div className="space-y-2 pt-2 border-t border-amber-100">
          <div className="flex items-center gap-2 text-xs font-black text-stone-700">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Gợi ý câu hỏi nhanh (Chạm để hỏi ngay):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleAskQuestion(q)}
                disabled={isLoading}
                className="text-left px-3 py-1.5 rounded-xl bg-amber-50/80 hover:bg-amber-100 border border-amber-200/90 text-amber-950 text-xs font-semibold transition-all cursor-pointer hover:scale-102 active:scale-95 disabled:opacity-50"
              >
                <span>💡 {q}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. KHUNG HỘI THOẠI & GIẢI ĐÁP CỦA AI */}
      <div className="bg-white rounded-3xl border-2 border-stone-200/90 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Chat Thread Messages */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 bg-[#FAF7F2]/40">
          {chatList.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-4xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white border border-amber-200 shadow-sm p-0.5 shrink-0 flex items-center justify-center overflow-hidden">
                  {isUser ? (
                    <span className="text-xl">👩‍🏫</span>
                  ) : (
                    <MamAiMascot size="sm" mood="happy" />
                  )}
                </div>

                {/* Message Body */}
                <div
                  className={`rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-sm transition-all ${
                    isUser
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-tr-none font-medium'
                      : 'bg-white border-2 border-amber-100 text-stone-900 rounded-tl-none font-sans'
                  }`}
                >
                  {/* Meta tag for AI replies */}
                  {!isUser && msg.ageGroup && (
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-100 text-[11px] font-bold text-stone-500">
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                        👶 {msg.ageGroup}
                      </span>
                      <span>• {msg.timestamp}</span>
                    </div>
                  )}

                  {/* Formatted Content */}
                  <div className="whitespace-pre-wrap leading-relaxed space-y-2 font-medium">
                    {msg.content}
                  </div>

                  {/* Action Bar for AI response */}
                  {!isUser && (
                    <div className="mt-4 pt-3 border-t border-amber-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSpeak(msg.id, msg.content)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            speakingId === msg.id
                              ? 'bg-orange-500 text-white shadow-sm animate-pulse'
                              : 'bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200'
                          }`}
                          title="Nghe giọng đọc bé gái 5 tuổi"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{speakingId === msg.id ? 'Đang đọc...' : 'Nghe đọc'}</span>
                        </button>

                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                          title="Sao chép câu trả lời"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === msg.id ? 'Đã chép' : 'Sao chép'}</span>
                        </button>

                        <button
                          onClick={() => handleSaveToDocs(msg)}
                          className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                          title="Lưu vào Tủ tài liệu lưu trữ"
                        >
                          <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                          <span>{savedId === msg.id ? 'Đã lưu' : 'Lưu tài liệu'}</span>
                        </button>
                      </div>

                      <span className="text-[11px] text-stone-400 font-medium">Trợ lý AI mầm non</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3 p-4 rounded-3xl bg-white border border-cyan-200 max-w-md shadow-sm">
              <div className="w-9 h-9 rounded-2xl bg-cyan-50 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 animate-spin text-cyan-600" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-black text-amber-950 font-bubbly block">
                  Mầm AI đang soạn câu trả lời sư phạm...
                </span>
                <span className="text-[11px] text-stone-500">
                  Dành riêng cho lứa tuổi {selectedAge}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-amber-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskQuestion();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={`Đặt câu hỏi cho Mầm AI về bé ${selectedAge} (${currentTopicObj.title})...`}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-2xl bg-stone-50 border border-amber-200 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-5 sm:px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 font-bubbly active:scale-95 transition-all"
            >
              <span>Gửi</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
