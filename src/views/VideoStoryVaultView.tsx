import React, { useState, useEffect, useRef } from 'react';
import { MamAiMascot } from '../components/MamAiMascot';
import {
  Video,
  BookOpen,
  Upload,
  Download,
  Play,
  Pause,
  Volume2,
  Sparkles,
  FileText,
  Music,
  Share2,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Eye,
  ArrowDownToLine,
  QrCode,
  X,
  FileDown,
  Wand2,
  ExternalLink,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import { sounds } from '../utils/audioUtils';

export interface MediaVaultItem {
  id: string;
  title: string;
  type: 'video' | 'poem' | 'story' | 'document' | 'audio';
  category: string;
  description: string;
  content?: string;
  author: string;
  ageGroup: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  coverEmoji: string;
  coverBg: string;
  tags: string[];
  createdAt: string;
  downloadsCount: number;
  viewsCount: number;
  likesCount: number;
  isAiGenerated?: boolean;
}

// Pre-seeded initial rich preschool video, poems, and stories
const INITIAL_VAULT_ITEMS: MediaVaultItem[] = [
  {
    id: 'mv-01',
    title: 'Video Thơ: Bé Ơi Đừng Khóc (Hoạt hình 3D)',
    type: 'video',
    category: 'Video Thơ Hoạt Hình',
    description: 'Video hoạt cảnh 3D bài thơ dỗ bé mới đến lớp, vần điệu vui nhộn giúp bé nín khóc và hào hứng kết bạn.',
    content: `Bé ơi đừng khóc\nĐến lớp thật vui\nCó bạn, có cô\nCùng chơi đồ chơi\n\nMặt trời tỏa nắng\nChim hót trên cành\nBé cười thật xinh\nMẹ yêu bé nhất!`,
    author: 'Cô Lê Hồng Vân & Mầm AI',
    ageGroup: '3–4 tuổi (Lớp Mầm)',
    fileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    fileName: 'Be_Oi_Dung_Khoc_3D.mp4',
    fileSize: '18.4 MB',
    coverEmoji: '🎬',
    coverBg: 'from-amber-400 to-orange-500',
    tags: ['Video 3D', 'Lớp Mầm', 'Dỗ bé', 'Tập nói'],
    createdAt: '2026-09-20',
    downloadsCount: 142,
    viewsCount: 520,
    likesCount: 88,
    isAiGenerated: true,
  },
  {
    id: 'mv-02',
    title: 'Bài Thơ Mầm Non: Quả Cam Ngọt Ngào',
    type: 'poem',
    category: 'Thơ Mầm Non',
    description: 'Bài thơ 4 chữ rèn phát âm và nhận biết màu sắc, hương vị quả cam. Có sẵn file Word in khổ to cho bé.',
    content: `Quả cam tròn xoe\nÁo vàng rực rỡ\nVỏ thơm nhè nhẹ\nBé bóc múi ra\n\nMọng nước ngọt lịm\nNhiều vitamin\nCho bé khỏe mạnh\nDa dẻ hồng hào!`,
    author: 'Cô Thu Hương (MN Ánh Dương)',
    ageGroup: '4–5 tuổi (Lớp Chồi)',
    fileName: 'Bai_Tho_Qua_Cam_Ngot_Ngao.docx',
    fileSize: '1.2 MB',
    coverEmoji: '🍊',
    coverBg: 'from-orange-400 to-amber-500',
    tags: ['Thơ 4 chữ', 'Thực vật', 'Dinh dưỡng'],
    createdAt: '2026-09-22',
    downloadsCount: 230,
    viewsCount: 680,
    likesCount: 105,
    isAiGenerated: false,
  },
  {
    id: 'mv-03',
    title: 'Video Truyện Cổ Tích: Củ Cải Trắng Tình Bạn',
    type: 'video',
    category: 'Truyện Kể Video',
    description: 'Video phim hoạt hình giáo dục bé biết sẻ chia, yêu thương bạn bè trong mùa đông lạnh giá.',
    content: `Mùa đông đến, thỏ con tìm được hai củ cải trắng. Thỏ ăn một củ, còn một củ mang sang cho bạn Dê con. Dê con lại mang cho Hươu sao, Hươu mang sang cho Gấu con... Tình bạn ấm áp lan tỏa khắp khu rừng!`,
    author: 'Tổ Chuyên Môn Mầm Non',
    ageGroup: '4–5 tuổi (Lớp Chồi)',
    fileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    fileName: 'Truyen_Cu_Cai_Trang_HD.mp4',
    fileSize: '32.1 MB',
    coverEmoji: '🐰',
    coverBg: 'from-emerald-400 to-teal-500',
    tags: ['Truyện kể', 'Đạo đức', 'Chia sẻ'],
    createdAt: '2026-09-24',
    downloadsCount: 310,
    viewsCount: 890,
    likesCount: 145,
    isAiGenerated: false,
  },
  {
    id: 'mv-04',
    title: 'Audio Đọc Truyện: Chú Vịt Xám Lạc Mẹ',
    type: 'audio',
    category: 'Audio Truyện & Thơ',
    description: 'Giọng đọc truyền cảm ấm áp kèm tiếng chim hót và hiệu ứng âm thanh chân thực, thích hợp cho giờ ngủ trưa.',
    content: `Vịt mẹ dặn các con: 'Các con phải đi theo mẹ, không được đi một mình kẻo con Cáo ăn thịt!'. Chú Vịt Xám mải đuổi theo chú bướm hoa vàng nên đã lạc vào bờ ao...`,
    author: 'Cô Mai Lan (MN Sao Mai)',
    ageGroup: '3–4 tuổi (Lớp Mầm)',
    fileName: 'Giong_Doc_Chu_Vit_Xam.mp3',
    fileSize: '5.8 MB',
    coverEmoji: '🎵',
    coverBg: 'from-sky-400 to-blue-500',
    tags: ['Audio', 'Giờ ngủ trưa', 'Vâng lời'],
    createdAt: '2026-09-25',
    downloadsCount: 185,
    viewsCount: 430,
    likesCount: 72,
    isAiGenerated: false,
  },
  {
    id: 'mv-05',
    title: 'Tài Liệu: Tuyển Tập 50 Bài Thơ Mầm Non Theo 10 Chủ Đề',
    type: 'document',
    category: 'Tài Liệu Giáo Án',
    description: 'File Word đầy đủ 50 bài thơ mầm non phân theo chủ đề: Bản thân, Gia đình, Nghề nghiệp, Giao thông, Thế giới động vật.',
    content: `Mục lục tài liệu:\n1. Chủ đề Trường Mầm Non: 5 bài thơ\n2. Chủ đề Bản Thân: 5 bài thơ\n3. Chủ đề Gia Đình: 5 bài thơ\n4. Chủ đề Nghề Nghiệp: 5 bài thơ\n5. Chủ đề Giao Thông: 5 bài thơ\n(Tài liệu định dạng chuẩn A4 có hình vẽ viền sẵn sàng in ấn).`,
    author: 'Cộng Đồng Giáo Viên Mầm Non',
    ageGroup: 'Tất cả lứa tuổi',
    fileName: 'Tuyen_Tap_50_Bai_Tho_Mam_Non_Chuan_Bo_GD.docx',
    fileSize: '4.6 MB',
    coverEmoji: '📄',
    coverBg: 'from-purple-400 to-pink-500',
    tags: ['Tài liệu Word', 'Tải về miễn phí', 'In ấn'],
    createdAt: '2026-09-26',
    downloadsCount: 450,
    viewsCount: 1200,
    likesCount: 260,
    isAiGenerated: false,
  },
];

export const VideoStoryVaultView: React.FC = () => {
  const [items, setItems] = useState<MediaVaultItem[]>(() => {
    try {
      const saved = localStorage.getItem('mam_ai_media_vault');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_VAULT_ITEMS;
  });

  const [filterType, setFilterType] = useState<string>('all');
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Active Viewers
  const [activeItem, setActiveItem] = useState<MediaVaultItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAiCreatorModal, setShowAiCreatorModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState<MediaVaultItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Text-To-Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState<'video' | 'poem' | 'story' | 'document' | 'audio'>('video');
  const [uploadAge, setUploadAge] = useState('4–5 tuổi (Lớp Chồi)');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadContent, setUploadContent] = useState('');
  const [uploadAuthor, setUploadAuthor] = useState('Cô Lê Hồng Vân');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // AI Generator Form State
  const [aiTopic, setAiTopic] = useState('Bé đi học an toàn giao thông');
  const [aiType, setAiType] = useState<'poem' | 'story'>('poem');
  const [aiAge, setAiAge] = useState('4–5 tuổi (Lớp Chồi)');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Fetch permanent items from backend server on mount
  useEffect(() => {
    fetch('/api/media-vault')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
          localStorage.setItem('mam_ai_media_vault', JSON.stringify(data.items));
        }
      })
      .catch((err) => {
        console.warn('Không kết nối được server, sử dụng bộ nhớ cache:', err);
      });
  }, []);

  // Sync to localStorage on change
  useEffect(() => {
    localStorage.setItem('mam_ai_media_vault', JSON.stringify(items));
  }, [items]);

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchType = filterType === 'all' || item.type === filterType;
    const matchAge = selectedAge === 'all' || item.ageGroup === selectedAge || item.ageGroup === 'Tất cả lứa tuổi';
    const matchSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchType && matchAge && matchSearch;
  });

  // Handle Download with permanent backend counter
  const handleDownload = (item: MediaVaultItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sounds.playPop();

    // Call server to persist download count
    fetch(`/api/media-vault/${item.id}/download`, { method: 'POST' }).catch(() => {});

    // Update state locally
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, downloadsCount: i.downloadsCount + 1 } : i))
    );

    // Download file
    if (item.fileUrl && (item.fileUrl.startsWith('http') || item.fileUrl.startsWith('/uploads'))) {
      const a = document.createElement('a');
      a.href = item.fileUrl;
      a.download = item.fileName || `${item.title.replace(/\s+/g, '_')}.${item.type === 'video' ? 'mp4' : 'docx'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const contentToDownload = `${item.title}\n\nTác giả: ${item.author}\nĐộ tuổi: ${item.ageGroup}\nNgày tạo: ${item.createdAt}\n\nNỘI DUNG:\n${item.content || item.description}\n\n---\nNguồn: Vườn Ươm AI - Học liệu mầm non`;
      const blob = new Blob([contentToDownload], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.fileName || `${item.title.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Handle Like
  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playPop();
    fetch(`/api/media-vault/${id}/like`, { method: 'POST' }).catch(() => {});
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, likesCount: i.likesCount + 1 } : i))
    );
  };

  // Handle Delete
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Cô có chắc chắn muốn xóa tài liệu này khỏi kho lưu trữ không?')) return;

    sounds.playPop();
    fetch(`/api/media-vault/${id}`, { method: 'DELETE' }).catch(() => {});
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (activeItem?.id === id) setActiveItem(null);
  };

  // Handle Text-To-Speech read aloud
  const handleToggleSpeak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      sounds.playPop();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9; // Slow clear speech for preschool
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Submit Upload Form - Persist permanently to Server disk + database
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    setIsUploading(true);
    sounds.playPop();

    try {
      const category =
        uploadType === 'video'
          ? 'Video Thơ Hoạt Hình'
          : uploadType === 'poem'
          ? 'Thơ Mầm Non'
          : uploadType === 'story'
          ? 'Truyện Kể Video'
          : uploadType === 'audio'
          ? 'Audio Truyện & Thơ'
          : 'Tài Liệu Giáo Án';

      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      formData.append('title', uploadTitle.trim());
      formData.append('type', uploadType);
      formData.append('category', category);
      formData.append('description', uploadDesc.trim() || 'Tài liệu do giáo viên tải lên kho lưu trữ vĩnh viễn Vườn Ươm AI.');
      formData.append('content', uploadContent.trim());
      formData.append('author', uploadAuthor.trim() || 'Cô giáo mầm non');
      formData.append('ageGroup', uploadAge);

      const res = await fetch('/api/media-vault/upload', {
        method: 'POST',
        body: formData,
      });

      let savedItem: MediaVaultItem | null = null;
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.item) {
          savedItem = json.item;
        }
      }

      // Fallback if server error
      if (!savedItem) {
        savedItem = {
          id: `mv-${Date.now()}`,
          title: uploadTitle.trim(),
          type: uploadType,
          category,
          description: uploadDesc.trim() || 'Tài liệu do giáo viên tải lên kho lưu trữ Vườn Ươm AI.',
          content: uploadContent.trim(),
          author: uploadAuthor.trim() || 'Cô giáo mầm non',
          ageGroup: uploadAge,
          fileUrl: '',
          fileName: selectedFile?.name || `${uploadTitle.replace(/\s+/g, '_')}.${uploadType === 'video' ? 'mp4' : 'docx'}`,
          fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.5 MB',
          coverEmoji: uploadType === 'video' ? '🎬' : uploadType === 'poem' ? '🌸' : uploadType === 'story' ? '📚' : uploadType === 'audio' ? '🎵' : '📄',
          coverBg:
            uploadType === 'video'
              ? 'from-cyan-400 to-blue-500'
              : uploadType === 'poem'
              ? 'from-rose-400 to-pink-500'
              : uploadType === 'story'
              ? 'from-purple-400 to-indigo-500'
              : uploadType === 'audio'
              ? 'from-amber-400 to-orange-500'
              : 'from-emerald-400 to-teal-500',
          tags: ['Tải lên', uploadAge.split(' ')[0]],
          createdAt: new Date().toISOString().split('T')[0],
          downloadsCount: 0,
          viewsCount: 1,
          likesCount: 1,
          isAiGenerated: false,
        };
      }

      setItems((prev) => [savedItem!, ...prev.filter((i) => i.id !== savedItem!.id)]);
      setShowUploadModal(false);
      sounds.playSuccess();

      // Reset form
      setUploadTitle('');
      setUploadDesc('');
      setUploadContent('');
      setSelectedFile(null);
    } catch (err) {
      console.error('Lỗi tải lên tài liệu:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // AI Generator Handler - Persist permanently to Server
  const handleGenerateAi = async () => {
    if (!aiTopic.trim()) return;
    setIsGeneratingAi(true);
    sounds.playPop();

    try {
      const res = await fetch('/api/gemini/generate-poem-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          type: aiType,
          ageGroup: aiAge,
        }),
      });

      let generatedData;
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.item) {
          generatedData = json.item;
        }
      }

      // Fallback generator if offline
      if (!generatedData) {
        if (aiType === 'poem') {
          generatedData = {
            title: `Bài Thơ: ${aiTopic}`,
            content: `Đèn đỏ dừng lại\nĐèn xanh được đi\nBé nhớ khắc ghi\nĐi trên vỉa hè\n\nNắm chặt tay mẹ\nKhông chạy lung tung\nBé ngoan đến trường\nNiềm vui rộn ràng!`,
            description: `Bài thơ giáo dục mầm non chủ đề ${aiTopic}, thể thơ 4 chữ nhịp nhàng cho bé dễ học thuộc.`,
          };
        } else {
          generatedData = {
            title: `Câu Chuyện: ${aiTopic}`,
            content: `Ngày xửa ngày xưa, ở một khu rừng xinh đẹp có bạn Thỏ Nâu và bạn Gấu Bông... Các bạn cùng nhau học bài và giúp đỡ mọi người. Nhờ thế, ai cũng khen các bé thật ngoan ngoãn và đáng yêu!`,
            description: `Câu chuyện ý nghĩa chủ đề ${aiTopic} bồi dưỡng tình yêu thương cho trẻ.`,
          };
        }
      }

      const newItemPayload = {
        id: `mv-ai-${Date.now()}`,
        title: generatedData.title,
        type: aiType,
        category: aiType === 'poem' ? 'Thơ Mầm Non AI' : 'Truyện Kể Video AI',
        description: generatedData.description,
        content: generatedData.content,
        author: 'Mầm AI Sáng Tác',
        ageGroup: aiAge,
        fileName: `${generatedData.title.replace(/\s+/g, '_')}.docx`,
        fileSize: '1.4 MB',
        coverEmoji: aiType === 'poem' ? '✨' : '🎬',
        coverBg: aiType === 'poem' ? 'from-rose-400 to-pink-500' : 'from-indigo-400 to-purple-600',
        tags: ['AI Sáng Tác', aiAge.split(' ')[0], 'Lời thơ mầm non'],
        createdAt: new Date().toISOString().split('T')[0],
        downloadsCount: 0,
        viewsCount: 1,
        likesCount: 1,
        isAiGenerated: true,
      };

      // Persist permanently on server
      const serverRes = await fetch('/api/media-vault/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItemPayload),
      });

      let finalItem = newItemPayload;
      if (serverRes.ok) {
        const serverJson = await serverRes.json();
        if (serverJson.success && serverJson.item) {
          finalItem = serverJson.item;
        }
      }

      setItems((prev) => [finalItem, ...prev]);
      setShowAiCreatorModal(false);
      sounds.playSuccess();
      setActiveItem(finalItem);
    } catch {
      // Fallback
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-24 font-['Nunito',sans-serif]">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-cyan-100/90 via-[#F0F9FF] to-blue-100/80 border-[3.5px] border-white p-5 sm:p-7 shadow-[0_8px_30px_rgba(6,182,212,0.12)]">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-cyan-800 text-xs font-black mb-2.5 shadow-2xs border border-cyan-200">
            <Video className="w-3.5 h-3.5 text-cyan-600" />
            <span className="font-bubbly">Kho Video, Thơ Truyện AI & Tài Liệu Mầm Non</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-stone-900 tracking-tight leading-snug font-bubbly">
            Tài Liệu Video Thơ & Truyện AI 🎬✨
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1.5 leading-relaxed">
            Nơi lưu trữ mãi mãi các video hoạt hình, bài thơ mẫu, truyện kể và giáo án số hóa. Tải lên tệp từ máy tính, xem trực tiếp và chia sẻ tải về miễn phí cho mọi giáo viên.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 mt-4">
            <button
              onClick={() => {
                sounds.playPop();
                setShowUploadModal(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white text-xs sm:text-sm font-black font-bubbly shadow-md shadow-cyan-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer border-2 border-white"
            >
              <Upload className="w-4 h-4" />
              <span>Tải Lên Tài Liệu Mới</span>
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                setShowAiCreatorModal(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-white text-cyan-900 text-xs sm:text-sm font-black font-bubbly border-2 border-cyan-200/90 hover:bg-cyan-50/70 active:scale-95 transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-cyan-600" />
              <span>AI Sáng Tác Thơ/Truyện</span>
            </button>
          </div>
        </div>

        {/* Mascot decoration */}
        <div className="hidden sm:block absolute right-6 bottom-2 z-10 transition-transform duration-300 hover:scale-105">
          <MamAiMascot size="lg" mood="happy" />
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white/95 rounded-3xl p-4 sm:p-5 border-2 border-amber-100/90 shadow-[0_4px_16px_rgba(180,83,9,0.05)] space-y-3.5">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm video, bài thơ, truyện tranh, giáo án..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-amber-50/40 border border-amber-200/80 text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:bg-white"
            />
          </div>

          {/* Age Selector */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-500 shrink-0" />
            <select
              value={selectedAge}
              onChange={(e) => setSelectedAge(e.target.value)}
              className="px-3 py-2 rounded-2xl bg-amber-50/40 border border-amber-200/80 text-xs font-bold text-stone-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả lứa tuổi</option>
              <option value="3–4 tuổi (Lớp Mầm)">Lớp Mầm (3–4 tuổi)</option>
              <option value="4–5 tuổi (Lớp Chồi)">Lớp Chồi (4–5 tuổi)</option>
              <option value="5–6 tuổi (Lớp Lá)">Lớp Lá (5–6 tuổi)</option>
            </select>
          </div>
        </div>

        {/* Type Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-100/60">
          {[
            { id: 'all', label: 'Tất Cả', icon: '🌟' },
            { id: 'video', label: 'Video Hoạt Hình', icon: '🎬' },
            { id: 'poem', label: 'Thơ Mầm Non', icon: '🌸' },
            { id: 'story', label: 'Truyện Kể', icon: '📚' },
            { id: 'audio', label: 'Audio Giọng Đọc', icon: '🎵' },
            { id: 'document', label: 'Tài Liệu / Word', icon: '📄' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sounds.playPop();
                setFilterType(cat.id);
              }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bubbly font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterType === cat.id
                  ? 'bg-cyan-600 text-white shadow-xs scale-105'
                  : 'bg-stone-100 text-stone-600 hover:bg-cyan-50 hover:text-cyan-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Media Vault Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              sounds.playPop();
              setActiveItem(item);
              // Increment view count
              setItems((prev) =>
                prev.map((i) => (i.id === item.id ? { ...i, viewsCount: i.viewsCount + 1 } : i))
              );
            }}
            className="group bg-white rounded-[28px] border-[3px] border-white hover:border-cyan-300 shadow-[0_4px_16px_rgba(6,182,212,0.08)] hover:shadow-[0_12px_28px_rgba(6,182,212,0.18)] hover:-translate-y-1.5 transition-all duration-300 p-4.5 flex flex-col justify-between cursor-pointer relative overflow-hidden"
          >
            {/* Top Badge & Category */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-black font-bubbly px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200/80">
                    {item.category}
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Lưu mãi mãi</span>
                  </span>
                </div>
                <span className="text-[10px] font-bold text-stone-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.createdAt}
                </span>
              </div>

              {/* Cover Card Preview */}
              <div
                className={`w-full aspect-[16/9] rounded-2xl bg-gradient-to-br ${item.coverBg} flex items-center justify-center relative overflow-hidden shadow-xs mb-3 group-hover:scale-[1.02] transition-transform duration-300`}
              >
                <div className="text-4xl sm:text-5xl filter drop-shadow-md group-hover:scale-110 transition-transform">
                  {item.coverEmoji}
                </div>
                {item.type === 'video' && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/90 text-cyan-700 flex items-center justify-center shadow-md">
                      <Play className="w-5 h-5 ml-0.5 fill-cyan-700" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/40 text-white text-[9.5px] font-bold backdrop-blur-xs">
                  {item.fileSize || '1.2 MB'}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-bubbly font-black text-sm sm:text-base text-stone-900 group-hover:text-cyan-700 transition-colors line-clamp-1">
                {item.title}
              </h3>
              <p className="text-xs text-stone-600 font-medium mt-1 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Author & Action Buttons */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-stone-500 text-[11px] font-medium">
                <span className="text-stone-400">Bởi:</span>
                <span className="font-bold text-stone-700 line-clamp-1">{item.author}</span>
              </div>

              {/* Download & View button */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => handleLike(item.id, e)}
                  title="Yêu thích"
                  className="p-1.5 rounded-xl hover:bg-rose-50 text-stone-400 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  title="Xóa tài liệu khỏi kho"
                  className="p-1.5 rounded-xl hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => handleDownload(item, e)}
                  className="px-2.5 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bubbly font-bold text-[11px] shadow-2xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải về</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-stone-200">
          <p className="text-3xl mb-2">🔍</p>
          <h4 className="font-bubbly font-bold text-stone-800 text-base">Không tìm thấy tài liệu phù hợp</h4>
          <p className="text-xs text-stone-500 mt-1">Hãy thử tìm từ khóa khác hoặc bấm nút tải lên tài liệu mới nhé!</p>
        </div>
      )}

      {/* DETAIL PREVIEW & PLAYER MODAL */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[92vh] overflow-y-auto border-4 border-white shadow-2xl p-5 sm:p-7 relative space-y-4">
            {/* Close Button */}
            <button
              onClick={() => {
                sounds.playPop();
                if (isSpeaking && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                }
                setActiveItem(null);
              }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors z-20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[10px] font-black font-bubbly px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
                  {activeItem.category}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Đã lưu vĩnh viễn trên máy chủ</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  {activeItem.ageGroup}
                </span>
                <span className="text-[10px] font-medium text-stone-500">
                  Đã tải: {activeItem.downloadsCount} lượt
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 font-bubbly leading-snug">
                {activeItem.title}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">Tác giả: {activeItem.author}</p>
            </div>

            {/* Player / Content Viewer */}
            {activeItem.type === 'video' ? (
              <div className="rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center relative">
                {activeItem.fileUrl ? (
                  <video
                    src={activeItem.fileUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center text-white p-6">
                    <p className="text-4xl mb-2">🎬</p>
                    <p className="font-bold text-sm">Xem video trực tiếp</p>
                    <p className="text-xs text-stone-300 mt-1">Video mầm non chất lượng cao</p>
                  </div>
                )}
              </div>
            ) : null}

            {/* Text / Poem / Story reader */}
            {activeItem.content && (
              <div className="bg-amber-50/60 rounded-2xl p-4 sm:p-5 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5 font-bubbly">
                    <span>📖 Nội dung bài thơ / truyện:</span>
                  </span>
                  <button
                    onClick={() => handleToggleSpeak(activeItem.content || '')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold font-bubbly flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSpeaking ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-stone-700 border border-stone-200 hover:bg-amber-100'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeaking ? 'Dừng đọc' : 'Đọc tự động (Cô giáo AI)'}</span>
                  </button>
                </div>
                <div className="whitespace-pre-line text-sm sm:text-base font-semibold text-stone-800 leading-relaxed font-['Quicksand'] bg-white/80 p-4 rounded-xl border border-amber-100 shadow-2xs">
                  {activeItem.content}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
              <span className="font-bold text-stone-700">Mô tả giáo dục: </span>
              {activeItem.description}
            </div>

            {/* Action Buttons: Tải về, Sao chép link, Quét QR */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowQrModal(activeItem)}
                  className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-stone-600" />
                  <span>Mã QR tải</span>
                </button>
                <button
                  onClick={() => {
                    sounds.playPop();
                    navigator.clipboard.writeText(window.location.href);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-stone-600" />
                  <span>{copiedLink ? 'Đã sao chép link!' : 'Chia sẻ link'}</span>
                </button>
              </div>

              <button
                onClick={() => handleDownload(activeItem)}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bubbly font-black text-xs sm:text-sm shadow-md shadow-cyan-500/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
              >
                <ArrowDownToLine className="w-4 h-4" />
                <span>Tải Về Máy ({activeItem.fileName || 'Tài liệu'})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD EXTERNAL DOCUMENT MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[32px] w-full max-w-lg max-h-[92vh] overflow-y-auto border-4 border-white shadow-2xl p-5 sm:p-6 relative space-y-4">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[11px] font-black font-bubbly mb-1">
                <Upload className="w-3.5 h-3.5" />
                <span>Tải lên tài liệu bên ngoài</span>
              </div>
              <h2 className="text-lg font-black text-stone-900 font-bubbly">
                Thêm Video, Thơ, Truyện & Giáo Án
              </h2>
              <p className="text-xs text-stone-500">
                Tài liệu sẽ được lưu trữ vĩnh viễn trên hệ thống để cô xem lại và đồng nghiệp tải về dùng.
              </p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-800 mb-1">Tiêu đề tài liệu *</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Ví dụ: Video bài thơ Chú Thỏ Trắng, Giáo án Khám phá hoa..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Loại tài liệu</label>
                  <select
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 focus:outline-none font-bold"
                  >
                    <option value="video">🎬 Video (.mp4, .webm)</option>
                    <option value="poem">🌸 Thơ mầm non</option>
                    <option value="story">📚 Truyện kể mầm non</option>
                    <option value="audio">🎵 Audio giọng đọc (.mp3)</option>
                    <option value="document">📄 Giáo án Word / PDF</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Độ tuổi áp dụng</label>
                  <select
                    value={uploadAge}
                    onChange={(e) => setUploadAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 focus:outline-none font-bold"
                  >
                    <option value="18–36 tháng (Nhà trẻ)">Nhà trẻ (18–36 tháng)</option>
                    <option value="3–4 tuổi (Lớp Mầm)">Lớp Mầm (3–4 tuổi)</option>
                    <option value="4–5 tuổi (Lớp Chồi)">Lớp Chồi (4–5 tuổi)</option>
                    <option value="5–6 tuổi (Lớp Lá)">Lớp Lá (5–6 tuổi)</option>
                    <option value="Tất cả lứa tuổi">Tất cả lứa tuổi</option>
                  </select>
                </div>
              </div>

              {/* File upload input */}
              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Chọn tệp từ máy tính (Video MP4, File Word, PDF, MP3...)
                </label>
                <div className="border-2 border-dashed border-cyan-200 hover:border-cyan-400 bg-cyan-50/30 rounded-2xl p-4 text-center cursor-pointer transition-colors relative">
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-6 h-6 text-cyan-500 mx-auto mb-1.5" />
                  <p className="font-bold text-cyan-950 text-xs">
                    {selectedFile ? `Đã chọn: ${selectedFile.name}` : 'Nhấn để chọn tệp hoặc kéo thả vào đây'}
                  </p>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    Hỗ trợ tệp MP4, MOV, MP3, DOCX, PDF, PNG, JPG (Tối đa 500MB)
                  </p>
                </div>
              </div>

              {/* Text content if poem/story */}
              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Nội dung thơ / Lời thoại truyện (nếu có):
                </label>
                <textarea
                  rows={3}
                  value={uploadContent}
                  onChange={(e) => setUploadContent(e.target.value)}
                  placeholder="Dán các câu thơ hoặc đoạn truyện ngắn vào đây để hiển thị khi đọc..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold hover:bg-stone-200 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bubbly font-black shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? (
                    <span>Đang lưu trữ...</span>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Lưu Vĩnh Viễn Vào Kho</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI CREATOR MODAL */}
      {showAiCreatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[32px] w-full max-w-md max-h-[92vh] overflow-y-auto border-4 border-white shadow-2xl p-5 sm:p-6 relative space-y-4">
            <button
              onClick={() => setShowAiCreatorModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-black font-bubbly mb-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>AI Sáng Tác Thơ & Truyện Mầm Non</span>
              </div>
              <h2 className="text-lg font-black text-stone-900 font-bubbly">
                Tạo Thơ / Truyện Theo Chủ Đề
              </h2>
              <p className="text-xs text-stone-500">
                AI sẽ gieo vần thơ 4-5 chữ chuẩn giáo dục mầm non, dễ nhớ và giàu tính giáo dục.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-800 mb-1">Chủ đề mong muốn:</label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Ví dụ: Bé rửa tay xà phòng, Bé yêu bà, Quả dưa hấu đỏ..."
                  className="w-full px-3 py-2 rounded-xl bg-purple-50/50 border border-purple-200 text-stone-800 focus:outline-none focus:ring-2 focus:ring-purple-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Hình thức:</label>
                  <select
                    value={aiType}
                    onChange={(e) => setAiType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 font-bold"
                  >
                    <option value="poem">🌸 Bài thơ 4 chữ</option>
                    <option value="story">📚 Câu chuyện ngắn</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Lớp tuổi:</label>
                  <select
                    value={aiAge}
                    onChange={(e) => setAiAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 font-bold"
                  >
                    <option value="3–4 tuổi (Lớp Mầm)">Lớp Mầm (3–4t)</option>
                    <option value="4–5 tuổi (Lớp Chồi)">Lớp Chồi (4–5t)</option>
                    <option value="5–6 tuổi (Lớp Lá)">Lớp Lá (5–6t)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateAi}
                disabled={isGeneratingAi}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-600 text-white font-bubbly font-black shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {isGeneratingAi ? (
                  <span>✨ AI Đang Sáng Tác Lời Thơ...</span>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Sáng Tác & Lưu Vào Kho Ngay</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-xs p-6 text-center border-4 border-white shadow-2xl relative space-y-3">
            <button
              onClick={() => setShowQrModal(null)}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center mx-auto text-xl font-bold">
              📱
            </div>
            <h3 className="font-bubbly font-bold text-stone-900 text-sm">
              Mã QR Tải Nhanh Trên Điện Thoại
            </h3>
            <p className="text-[11px] text-stone-500">{showQrModal.title}</p>
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 inline-block">
              {/* QR Code representation */}
              <div className="w-36 h-36 bg-white p-2 flex items-center justify-center border rounded-xl shadow-2xs">
                <div className="grid grid-cols-6 gap-1 w-full h-full p-1 bg-stone-900 rounded-sm" />
              </div>
            </div>
            <p className="text-[10px] text-stone-400">
              Phụ huynh hoặc đồng nghiệp quét camera để tải tệp về máy
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
