import React, { useState } from 'react';
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
} from 'lucide-react';
import { CommunityPost } from '../types';
import { MOCK_COMMUNITY_POSTS } from '../data/mockData';
import { sounds } from '../utils/audioUtils';
import { ExportShareModal } from '../components/ExportShareModal';
import { useAuth } from '../context/AuthContext';

interface CommunityViewProps {
  onUseTemplate: (post: CommunityPost) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ onUseTemplate }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [sharingPost, setSharingPost] = useState<CommunityPost | null>(null);

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
    <div className="space-y-6 animate-fadeIn pb-20">
      {/* Top Banner - Warm Terracotta Theme */}
      <div className="bg-gradient-to-r from-amber-100/90 via-[#FFF8F0] to-orange-100/80 rounded-3xl p-5 sm:p-7 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(180,83,9,0.06)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-orange-700 text-xs font-black mb-2 shadow-2xs border border-orange-200">
            <Users className="w-3.5 h-3.5 text-orange-600" />
            <span>Cộng Đồng Cô Giáo Sáng Tạo</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight font-['Quicksand']">
            Cùng Chia Sẻ – Cùng Lan Tỏa Yêu Thương
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
            Nơi hàng ngàn giáo viên mầm non giao lưu giáo án, sản phẩm AI và kinh nghiệm giờ dạy thực tế
          </p>
        </div>

        <button
          onClick={() => setShowNewPostModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xs shadow-md shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Đăng bài chia sẻ</span>
        </button>
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
                  className="flex items-center gap-1 font-bold hover:text-orange-600 transition-colors cursor-pointer"
                  title="Chia sẻ bài viết (Điện thoại & Máy tính)"
                >
                  <Share2 className="w-4 h-4 text-orange-600" />
                  <span>Chia sẻ</span>
                </button>
              </div>

              <span className="text-[11px] font-medium text-stone-400">
                {post.downloadsCount} lượt tải
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-amber-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-orange-600" />
                <h3 className="font-black text-amber-950 text-base font-['Quicksand']">
                  Chia Sẻ Kinh Nghiệm / Học Liệu
                </h3>
              </div>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="text-stone-400 hover:text-stone-600 font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  Nội dung chia sẻ:
                </label>
                <textarea
                  rows={4}
                  required
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Chia sẻ cách cô ứng dụng AI vào giờ học, phản ứng của trẻ, hoặc bí quyết dùng prompt..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-300 text-stone-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs shadow-md cursor-pointer hover:scale-102 active:scale-95"
                >
                  Đăng bài ngay 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cross-Device Export & Share Modal (Phone & Desktop) */}
      {sharingPost && (
        <ExportShareModal
          isOpen={!!sharingPost}
          onClose={() => setSharingPost(null)}
          item={{
            id: sharingPost.id,
            type: 'lesson_plan',
            title: `Bài chia sẻ: ${sharingPost.authorName}`,
            subtitle: sharingPost.content.substring(0, 100) + '...',
            author: sharingPost.authorName,
            school: sharingPost.authorSchool,
            data: sharingPost,
          }}
        />
      )}
    </div>
  );
};
