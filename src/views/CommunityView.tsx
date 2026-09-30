import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { MamAiMascot } from '../components/MamAiMascot';
import {
  Users,
  Heart,
  MessageCircle,
  Download,
  Share2,
  CheckCircle2,
  PlusCircle,
  Sparkles,
  BookOpen,
  QrCode,
  ExternalLink,
  Copy,
  Check,
  UploadCloud,
  Edit3,
  Globe,
  MessageSquare,
  ShieldCheck,
  Eye,
  Camera,
  RefreshCw,
} from 'lucide-react';
import { CommunityPost } from '../types';
import { MOCK_COMMUNITY_POSTS } from '../data/mockData';
import { sounds, speakText } from '../utils/audioUtils';
import { ExportShareModal } from '../components/ExportShareModal';
import { useAuth } from '../context/AuthContext';

interface CommunityLinksState {
  facebookLink: string;
  facebookName: string;
  facebookDesc: string;
  zaloLink: string;
  zaloName: string;
  zaloDesc: string;
  zaloQrUrl: string;
}

const DEFAULT_LINKS: CommunityLinksState = {
  facebookLink: 'https://facebook.com/groups/mam.ai.giaovien.mamnon',
  facebookName: 'Cộng Đồng Giáo Viên Mầm Non Ứng Dụng AI Việt Nam',
  facebookDesc: 'Hơn 12,500 cô giáo cùng chia sẻ giáo án 5 bước, câu lệnh prompt tạo ảnh 3D và video hoạt hình mầm non.',
  zaloLink: 'https://zalo.me/g/mam-ai-mam-non',
  zaloName: 'Nhóm Zalo: Trao Đổi Giáo Án & Học Liệu AI Mầm Non',
  zaloDesc: 'Quét mã QR để tham gia nhóm Zalo kết nối và nhận thông báo học liệu mới hàng ngày.',
  zaloQrUrl: '',
};

interface CommunityViewProps {
  onUseTemplate: (post: CommunityPost) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ onUseTemplate }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [sharingPost, setSharingPost] = useState<CommunityPost | null>(null);

  // ==========================================
  // STATE: FACEBOOK GROUP LINK & ZALO QR CODE
  // ==========================================
  const [links, setLinks] = useState<CommunityLinksState>(() => {
    try {
      const saved = localStorage.getItem('mam_ai_community_links');
      return saved ? JSON.parse(saved) : DEFAULT_LINKS;
    } catch {
      return DEFAULT_LINKS;
    }
  });

  const [generatedZaloQr, setGeneratedZaloQr] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<'fb' | 'zalo' | null>(null);

  // Modals for editing links & QR
  const [showFbEditModal, setShowFbEditModal] = useState(false);
  const [showZaloEditModal, setShowZaloEditModal] = useState(false);
  const [showQrZoomModal, setShowQrZoomModal] = useState(false);

  // Edit Form Inputs
  const [editFbLink, setEditFbLink] = useState(links.facebookLink);
  const [editFbName, setEditFbName] = useState(links.facebookName);
  const [editFbDesc, setEditFbDesc] = useState(links.facebookDesc);

  const [editZaloLink, setEditZaloLink] = useState(links.zaloLink);
  const [editZaloName, setEditZaloName] = useState(links.zaloName);
  const [editZaloDesc, setEditZaloDesc] = useState(links.zaloDesc);
  const [uploadingQr, setUploadingQr] = useState(false);

  const zaloQrFileInputRef = useRef<HTMLInputElement>(null);

  // Fetch persistent links from backend
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await fetch('/api/community/links');
        const data = await res.json();
        if (data.success && data.links) {
          setLinks(data.links);
          setEditFbLink(data.links.facebookLink || DEFAULT_LINKS.facebookLink);
          setEditFbName(data.links.facebookName || DEFAULT_LINKS.facebookName);
          setEditFbDesc(data.links.facebookDesc || DEFAULT_LINKS.facebookDesc);
          setEditZaloLink(data.links.zaloLink || DEFAULT_LINKS.zaloLink);
          setEditZaloName(data.links.zaloName || DEFAULT_LINKS.zaloName);
          setEditZaloDesc(data.links.zaloDesc || DEFAULT_LINKS.zaloDesc);
        }
      } catch (err) {
        console.warn('Using local community links:', err);
      }
    };
    fetchLinks();
  }, []);

  // Generate fallback QR Code for Zalo link if no custom QR image uploaded
  useEffect(() => {
    if (!links.zaloQrUrl) {
      QRCode.toDataURL(links.zaloLink || 'https://zalo.me', {
        width: 300,
        margin: 2,
        color: {
          dark: '#0068FF',
          light: '#FFFFFF',
        },
      })
        .then((url) => setGeneratedZaloQr(url))
        .catch((err) => console.error('QR code gen error:', err));
    }
  }, [links.zaloQrUrl, links.zaloLink]);

  // Save links to server & localStorage
  const saveLinksToServer = async (newLinks: CommunityLinksState) => {
    setLinks(newLinks);
    try {
      localStorage.setItem('mam_ai_community_links', JSON.stringify(newLinks));
      await fetch('/api/community/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLinks),
      });
    } catch (err) {
      console.error('Error saving community links:', err);
    }
  };

  // Copy link handler
  const handleCopyLink = (text: string, type: 'fb' | 'zalo') => {
    sounds.playPop();
    navigator.clipboard.writeText(text);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  // Handle uploading Zalo QR Image
  const handleZaloQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playPop();
    setUploadingQr(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', 'Mã QR Nhóm Zalo Giáo Viên Mầm Non');
      formData.append('category', 'Cộng đồng mầm non');
      formData.append('sourceFunction', 'community');

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.document?.fileUrl) {
        const updated = {
          ...links,
          zaloQrUrl: data.document.fileUrl,
        };
        await saveLinksToServer(updated);
        sounds.playSuccess();
        speakText('Đã tải lên mã QR nhóm Zalo thành công rồi cô nhé!', 1.1, 'vi-VN');
      } else {
        // Fallback: Read as base64 data URL
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Url = reader.result as string;
          const updated = {
            ...links,
            zaloQrUrl: base64Url,
          };
          await saveLinksToServer(updated);
          sounds.playSuccess();
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('Error uploading Zalo QR:', err);
    } finally {
      setUploadingQr(false);
    }
  };

  // Save Facebook Group Link
  const handleSaveFacebookLink = async (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSuccess();
    const updated = {
      ...links,
      facebookLink: editFbLink.trim() || DEFAULT_LINKS.facebookLink,
      facebookName: editFbName.trim() || DEFAULT_LINKS.facebookName,
      facebookDesc: editFbDesc.trim() || DEFAULT_LINKS.facebookDesc,
    };
    await saveLinksToServer(updated);
    setShowFbEditModal(false);
    speakText('Đã gắn link nhóm Facebook thành công!', 1.1, 'vi-VN');
  };

  // Save Zalo Group Info
  const handleSaveZaloInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSuccess();
    const updated = {
      ...links,
      zaloLink: editZaloLink.trim() || DEFAULT_LINKS.zaloLink,
      zaloName: editZaloName.trim() || DEFAULT_LINKS.zaloName,
      zaloDesc: editZaloDesc.trim() || DEFAULT_LINKS.zaloDesc,
    };
    await saveLinksToServer(updated);
    setShowZaloEditModal(false);
    speakText('Đã cập nhật thông tin nhóm Zalo!', 1.1, 'vi-VN');
  };

  const handleLike = (id: string) => {
    sounds.playPop();
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const handleApplyPost = (id: string) => {
    sounds.playSuccess();
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id && !p.hasApplied
          ? { ...p, hasApplied: true, appliedCount: p.appliedCount + 1 }
          : p
      )
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    sounds.playSuccess();
    const newPost: CommunityPost = {
      id: 'post-' + Date.now(),
      authorName: user?.name || 'Cô Lê Hồng Vân',
      authorSchool: user?.school || 'Trường Mầm non Liên Minh A',
      authorAvatar: user?.avatar || '🌸',
      timeAgo: 'Vừa xong',
      content: newPostContent,
      tags: ['#ChiaSẻMầmNon', '#SángTạoAI'],
      likes: 1,
      isLiked: true,
      commentsCount: 0,
      downloadsCount: 0,
      appliedCount: 1,
      hasApplied: true,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setShowNewPostModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-24 font-['Nunito',sans-serif]">
      {/* Top Banner - Warm Terracotta Theme */}
      <div className="bg-gradient-to-r from-amber-100/90 via-[#FFF8F0] via-orange-100/80 to-amber-100/90 rounded-[32px] p-5 sm:p-7 border-[3px] border-white flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-[0_6px_24px_rgba(180,83,9,0.08)]">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 text-orange-700 text-xs font-black shadow-2xs border border-orange-200">
            <Users className="w-3.5 h-3.5 text-orange-600" />
            <span className="font-bubbly">Cộng Đồng Cô Giáo Mầm Non Sáng Tạo AI Việt Nam</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-950 tracking-tight font-bubbly">
            Cùng Chia Sẻ – Cùng Lan Tỏa Yêu Thương
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
            Kết nối hơn 12,000 giáo viên mầm non toàn quốc qua <strong>Nhóm Facebook</strong> và <strong>Nhóm Zalo</strong> để giao lưu giáo án Word, tải học liệu PDF 1-chạm và hỗ trợ ứng dụng AI giờ dạy thực tế.
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playPop();
            setShowNewPostModal(true);
          }}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 self-start md:self-auto shrink-0 cursor-pointer font-bubbly ring-2 ring-orange-300"
        >
          <PlusCircle className="w-4 h-4 animate-bounce" />
          <span>Đăng Bài Chia Sẻ Ngay</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* SECTION: LIÊN KẾT NHÓM FACEBOOK & MÃ QR NHÓM ZALO */}
      {/* ======================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-orange-600" />
            <h2 className="text-base sm:text-lg font-black text-amber-950 font-bubbly">
              Kênh Giao Lưu Chính Thức (Nhóm Facebook & Zalo)
            </h2>
          </div>
          <span className="text-xs font-bold text-stone-500 hidden sm:inline">
            Gắn link & quét mã QR tham gia ngay
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {/* ========================================= */}
          {/* CARD 1: NHÓM FACEBOOK (GẮN LINK LIÊN KẾT) */}
          {/* ========================================= */}
          <div className="bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/70 rounded-3xl p-5 sm:p-6 border-2 border-blue-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 relative overflow-hidden group">
            {/* Top decorative badge */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Facebook Official Icon */}
                  <div className="w-13 h-13 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1877F2] text-[10px] font-black border border-blue-200">
                      <span>Nhóm Facebook Chính Thức</span>
                      <span>• 12.5K+ Thành viên</span>
                    </div>

                    <h3 className="font-black text-base sm:text-lg text-slate-900 font-['Quicksand'] mt-1 leading-snug">
                      {links.facebookName}
                    </h3>
                  </div>
                </div>

                {/* Edit Link Button */}
                <button
                  onClick={() => {
                    sounds.playPop();
                    setEditFbLink(links.facebookLink);
                    setEditFbName(links.facebookName);
                    setEditFbDesc(links.facebookDesc);
                    setShowFbEditModal(true);
                  }}
                  className="p-2 rounded-xl bg-white hover:bg-blue-100 text-blue-700 border border-blue-200 shadow-2xs cursor-pointer transition-all"
                  title="Gắn link hoặc đổi nhóm Facebook khác"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed bg-white/80 p-3 rounded-2xl border border-blue-100">
                {links.facebookDesc}
              </p>

              {/* Current Link preview */}
              <div className="flex items-center justify-between text-xs bg-blue-50/80 px-3 py-2 rounded-xl border border-blue-200/80">
                <span className="text-[11px] text-blue-900 font-bold truncate max-w-[240px] sm:max-w-xs">
                  🔗 {links.facebookLink}
                </span>
                <button
                  onClick={() => handleCopyLink(links.facebookLink, 'fb')}
                  className="text-blue-700 hover:text-blue-900 font-black flex items-center gap-1 text-[11px] cursor-pointer shrink-0 ml-2"
                >
                  {copiedLink === 'fb' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink === 'fb' ? 'Đã chép link!' : 'Chép link'}</span>
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center gap-2 border-t border-blue-100">
              <a
                href={links.facebookLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.playPop()}
                className="flex-1 py-2.5 rounded-2xl bg-[#1877F2] hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-500/20 hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer font-bubbly"
              >
                <span>Tham Gia Nhóm Facebook</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => {
                  sounds.playPop();
                  setShowFbEditModal(true);
                }}
                className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-blue-50 text-blue-800 font-bold text-xs border border-blue-200 cursor-pointer shadow-xs whitespace-nowrap"
              >
                Gắn link nhóm của cô
              </button>
            </div>
          </div>

          {/* ========================================= */}
          {/* CARD 2: NHÓM ZALO (TẢI LÊN MÃ QR NHÓM) */}
          {/* ========================================= */}
          <div className="bg-gradient-to-br from-cyan-50/90 via-white to-blue-50/70 rounded-3xl p-5 sm:p-6 border-2 border-cyan-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Zalo Icon */}
                  <div className="w-13 h-13 rounded-2xl bg-[#0068FF] text-white flex items-center justify-center shadow-md shadow-cyan-500/25 shrink-0 group-hover:scale-105 transition-transform font-black text-xs font-['Quicksand']">
                    Zalo
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-100 text-[#0068FF] text-[10px] font-black border border-cyan-200">
                      <span>Nhóm Zalo Học Liệu 24/7</span>
                      <span>• 1,000 Thành viên</span>
                    </div>

                    <h3 className="font-black text-base sm:text-lg text-slate-900 font-['Quicksand'] mt-1 leading-snug">
                      {links.zaloName}
                    </h3>
                  </div>
                </div>

                {/* Edit Zalo Info Button */}
                <button
                  onClick={() => {
                    sounds.playPop();
                    setEditZaloLink(links.zaloLink);
                    setEditZaloName(links.zaloName);
                    setEditZaloDesc(links.zaloDesc);
                    setShowZaloEditModal(true);
                  }}
                  className="p-2 rounded-xl bg-white hover:bg-cyan-100 text-cyan-800 border border-cyan-200 shadow-2xs cursor-pointer transition-all"
                  title="Chỉnh sửa thông tin nhóm Zalo"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              {/* QR Code and Instructions Block */}
              <div className="bg-white/90 p-3.5 rounded-2xl border border-cyan-200/80 flex flex-col sm:flex-row items-center gap-4">
                {/* QR Code Image */}
                <div
                  onClick={() => {
                    sounds.playPop();
                    setShowQrZoomModal(true);
                  }}
                  className="w-28 h-28 bg-white p-2 rounded-2xl border-2 border-cyan-300 shadow-xs flex items-center justify-center cursor-pointer shrink-0 hover:scale-103 transition-transform relative group/qr"
                  title="Bấm để phóng to mã QR quét trên điện thoại"
                >
                  <img
                    src={links.zaloQrUrl || generatedZaloQr}
                    alt="Mã QR Nhóm Zalo"
                    className="w-full h-full object-contain rounded-xl"
                  />
                  <div className="absolute inset-0 bg-cyan-900/40 rounded-2xl opacity-0 group-hover/qr:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black">
                    🔍 Phóng to
                  </div>
                </div>

                {/* Description & Upload button */}
                <div className="space-y-2 flex-1 text-center sm:text-left">
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {links.zaloDesc}
                  </p>

                  <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                    {/* Hidden file input for Zalo QR */}
                    <input
                      type="file"
                      ref={zaloQrFileInputRef}
                      onChange={handleZaloQrUpload}
                      accept="image/*"
                      className="hidden"
                      id="zalo-qr-upload"
                    />

                    {/* Button trigger file upload */}
                    <button
                      onClick={() => {
                        sounds.playPop();
                        zaloQrFileInputRef.current?.click();
                      }}
                      disabled={uploadingQr}
                      className="px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 font-black text-xs border border-cyan-300 flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-cyan-700" />
                      <span>{uploadingQr ? 'Đang tải QR...' : '📤 Tải Lên Mã QR Nhóm'}</span>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playPop();
                        setShowQrZoomModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-cyan-50 text-slate-700 font-bold text-xs border border-stone-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-700" />
                      <span>Xem mã</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center gap-2 border-t border-cyan-100">
              <a
                href={links.zaloLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.playPop()}
                className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-[#0068FF] to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-black text-xs sm:text-sm shadow-md shadow-cyan-500/20 hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer font-bubbly"
              >
                <span>Vào Nhóm Bằng Link Zalo</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => handleCopyLink(links.zaloLink, 'zalo')}
                className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-cyan-50 text-cyan-900 font-bold text-xs border border-cyan-200 cursor-pointer shadow-xs whitespace-nowrap flex items-center gap-1"
              >
                {copiedLink === 'zalo' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink === 'zalo' ? 'Đã chép!' : 'Chép link Zalo'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Stream Header */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-base sm:text-lg font-black text-amber-950 font-bubbly">
          Bài Viết & Hoạt Động Của Giáo Viên Toàn Quốc
        </h2>
        <span className="text-xs text-stone-500 font-bold">
          {posts.length} bài chia sẻ
        </span>
      </div>

      {/* Feed Stream */}
      <div className="space-y-4 max-w-2xl mx-auto">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white/95 rounded-3xl p-5 border border-amber-100/90 shadow-[0_4px_16px_rgba(180,83,9,0.05)] hover:shadow-[0_8px_24px_rgba(234,88,12,0.1)] transition-all space-y-3.5"
          >
            {/* Author info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-lg border border-amber-200">
                  {post.authorAvatar}
                </div>
                <div>
                  <h3 className="font-black text-sm text-amber-950 leading-none font-['Quicksand']">
                    {post.authorName}
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-1 font-semibold">
                    {post.authorSchool} · {post.timeAgo}
                  </p>
                </div>
              </div>

              {post.hasApplied && (
                <span className="text-[11px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  ✓ Đã dạy tại lớp
                </span>
              )}
            </div>

            {/* Content Text */}
            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-line font-medium">
              {post.content}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="text-[10px] text-orange-800 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100 font-bold"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Attached Template Link (if any) */}
            {post.mediaTitle && (
              <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-600 shrink-0" />
                  <div>
                    <span className="font-black text-xs text-amber-950 block">
                      {post.mediaTitle}
                    </span>
                    <span className="text-[10px] text-stone-500 font-medium">
                      Bấm để mở và soạn chỉnh sửa theo ý cô
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onUseTemplate(post)}
                  className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-xs font-black hover:scale-105 active:scale-95 transition-all shadow-2xs whitespace-nowrap cursor-pointer"
                >
                  Dùng mẫu này ✨
                </button>
              </div>
            )}

            {/* Post Interaction Bar */}
            <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-xs text-stone-500">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1 font-bold transition-transform active:scale-90 cursor-pointer ${
                    post.isLiked ? 'text-orange-600' : 'hover:text-orange-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-orange-600' : ''}`} />
                  <span>{post.likes} Yêu thích</span>
                </button>

                <button
                  onClick={() => handleApplyPost(post.id)}
                  className={`flex items-center gap-1 font-bold cursor-pointer ${
                    post.hasApplied ? 'text-emerald-700 font-black' : 'hover:text-emerald-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{post.appliedCount} Cô đã áp dụng</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playPop();
                    setSharingPost(post);
                  }}
                  className="flex items-center gap-1 hover:text-stone-700 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Chia sẻ</span>
                </button>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-stone-400">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{post.commentsCount} Bình luận</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: GẮN LINK NHÓM FACEBOOK */}
      {/* ======================================================== */}
      {showFbEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-blue-300 space-y-4">
            <div className="flex items-center justify-between border-b border-blue-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  fb
                </div>
                <h3 className="font-black text-lg text-slate-900 font-bubbly">
                  Gắn Link Nhóm Facebook
                </h3>
              </div>
              <button
                onClick={() => setShowFbEditModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFacebookLink} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-800 block">
                  Đường dẫn liên kết nhóm Facebook: <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={editFbLink}
                  onChange={(e) => setEditFbLink(e.target.value)}
                  placeholder="https://facebook.com/groups/..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-blue-50/40 border border-blue-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-800 block">
                  Tên nhóm hiển thị:
                </label>
                <input
                  type="text"
                  value={editFbName}
                  onChange={(e) => setEditFbName(e.target.value)}
                  placeholder="Ví dụ: Hội Giáo Viên Mầm Non Sáng Tạo"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-800 block">
                  Mô tả giới thiệu nhóm:
                </label>
                <textarea
                  rows={2}
                  value={editFbDesc}
                  onChange={(e) => setEditFbDesc(e.target.value)}
                  placeholder="Mô tả về nhóm của cô..."
                  className="w-full px-3.5 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowFbEditModal(false)}
                  className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-[#1877F2] hover:bg-blue-700 text-white font-black text-xs shadow-md cursor-pointer font-bubbly"
                >
                  Lưu Liên Kết Facebook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: TẢI LÊN MÃ QR & CHỈNH SỬA NHÓM ZALO */}
      {/* ======================================================== */}
      {showZaloEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-cyan-300 space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-black text-xs">
                  Zalo
                </div>
                <h3 className="font-black text-lg text-slate-900 font-bubbly">
                  Tải Mã QR & Sửa Nhóm Zalo
                </h3>
              </div>
              <button
                onClick={() => setShowZaloEditModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveZaloInfo} className="space-y-3.5">
              {/* Upload QR Box */}
              <div>
                <label className="text-xs font-black text-slate-800 block mb-1.5">
                  Mã QR nhóm Zalo của cô:
                </label>
                <div className="flex items-center gap-3 bg-cyan-50/50 p-3 rounded-2xl border border-cyan-200">
                  <div className="w-16 h-16 bg-white rounded-xl border border-cyan-300 p-1 shrink-0 flex items-center justify-center">
                    <img
                      src={links.zaloQrUrl || generatedZaloQr}
                      alt="Zalo QR"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => zaloQrFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Chọn ảnh mã QR</span>
                    </button>
                    <p className="text-[10px] text-stone-500">
                      Chụp màn hình mã QR nhóm Zalo rồi tải lên đây
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-800 block">
                  Link tham gia nhóm Zalo (Nếu có):
                </label>
                <input
                  type="url"
                  value={editZaloLink}
                  onChange={(e) => setEditZaloLink(e.target.value)}
                  placeholder="https://zalo.me/g/..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-cyan-50/30 border border-cyan-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-800 block">
                  Tên nhóm Zalo:
                </label>
                <input
                  type="text"
                  value={editZaloName}
                  onChange={(e) => setEditZaloName(e.target.value)}
                  placeholder="Nhóm Zalo Giáo Viên..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-800 block">
                  Mô tả lời mời:
                </label>
                <textarea
                  rows={2}
                  value={editZaloDesc}
                  onChange={(e) => setEditZaloDesc(e.target.value)}
                  placeholder="Quét mã QR để vào nhóm Zalo nhận giáo án..."
                  className="w-full px-3.5 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowZaloEditModal(false)}
                  className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-[#0068FF] hover:bg-blue-700 text-white font-black text-xs shadow-md cursor-pointer font-bubbly"
                >
                  Lưu Thông Tin Zalo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: PHÓNG TO MÃ QR ZALO ĐỂ QUÉT VÀ TẢI VỀ */}
      {/* ======================================================== */}
      {showQrZoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-4 border-cyan-400 space-y-4 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-cyan-100">
              <span className="text-xs font-black text-[#0068FF] uppercase tracking-wider">
                MÃ QR NHÓM ZALO
              </span>
              <button
                onClick={() => setShowQrZoomModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900 font-['Quicksand']">
                {links.zaloName}
              </h3>
              <p className="text-xs text-stone-500">
                Mở ứng dụng Zalo trên điện thoại, bấm vào biểu tượng Quét mã để vào nhóm
              </p>
            </div>

            {/* Big QR Code display */}
            <div className="w-60 h-60 mx-auto bg-white p-4 rounded-3xl border-2 border-cyan-200 shadow-md flex items-center justify-center">
              <img
                src={links.zaloQrUrl || generatedZaloQr}
                alt="Mã QR Zalo lớn"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href={links.zaloQrUrl || generatedZaloQr}
                download="Ma_QR_Nhom_Zalo_Giao_Vien.png"
                className="flex-1 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Tải Ảnh QR Về Máy</span>
              </a>

              <a
                href={links.zaloLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-2xl bg-[#0068FF] hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Mở Trong Zalo</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border-2 border-amber-300 space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <h3 className="font-black text-lg text-amber-950 font-['Quicksand']">
                Đăng bài chia sẻ kinh nghiệm
              </h3>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center font-bold cursor-pointer hover:bg-stone-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <textarea
                rows={4}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Cô muốn chia sẻ giáo án, ý tưởng hoạt động hoặc kinh nghiệm ứng dụng AI nào hôm nay?..."
                required
                className="w-full p-3.5 rounded-2xl bg-amber-50/30 border border-amber-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-100">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2.5 rounded-2xl bg-stone-100 text-stone-700 font-bold text-xs cursor-pointer hover:bg-stone-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer hover:scale-103 active:scale-95 transition-all font-bubbly"
                >
                  Đăng Bài Ngay 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {sharingPost && (
        <ExportShareModal
          isOpen={!!sharingPost}
          onClose={() => setSharingPost(null)}
          item={{
            type: 'lesson_plan',
            id: sharingPost.id,
            title: `Bài chia sẻ từ ${sharingPost.authorName}`,
            subtitle: sharingPost.authorSchool,
            data: sharingPost,
          }}
        />
      )}
    </div>
  );
};
