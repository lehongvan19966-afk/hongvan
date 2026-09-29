import React, { useState, useEffect, useRef } from 'react';
import { MamAiMascot } from '../components/MamAiMascot';
import { Pixar3DIcon } from '../components/Pixar3DIcon';
import { VideoUploadModal } from '../components/VideoUploadModal';
import { VideoPlayer, VideoPlayerRef } from '../components/VideoPlayer';
import { ExportShareModal } from '../components/ExportShareModal';
import {
  GraduationCap,
  PlayCircle,
  Play,
  CheckCircle,
  Copy,
  MessageSquare,
  Upload,
  Sparkles,
  Clock,
  Award,
  Flame,
  Search,
  BookOpen,
  Send,
  HelpCircle,
  Film,
  Filter,
  Eye,
  Bookmark,
  Share2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Tag,
  ArrowLeft,
  SlidersHorizontal,
  FolderHeart,
  Volume2,
  Lock,
  Globe,
  Users,
} from 'lucide-react';
import { Course, CourseLesson, VideoItem, UserProfile } from '../types';
import { MOCK_COURSES, INITIAL_USER } from '../data/mockData';
import { videoService } from '../services/videoService';
import { sounds } from '../utils/audioUtils';

interface AiAcademyViewProps {
  currentUser?: UserProfile;
  initialVideoId?: string;
  onEarnBadge?: (badgeId: string) => void;
}

export const AiAcademyView: React.FC<AiAcademyViewProps> = ({
  currentUser = INITIAL_USER,
  initialVideoId,
  onEarnBadge,
}) => {
  // Navigation mode: 'videos' (Video Knowledge Library) or 'courses' (7 Level Curriculum)
  const [activeTabMode, setActiveTabMode] = useState<'videos' | 'courses'>('videos');

  // Video Library State
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState<boolean>(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedScope, setSelectedScope] = useState<'all' | 'mine' | 'saved'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'saved'>('newest');

  // Courses Curriculum State
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('course-2');
  const [activeCourseLessonId, setActiveCourseLessonId] = useState<string>('c2-l1');

  // Active Video Knowledge Hub Sub-tab (XV-I: Nội dung, Tóm tắt, Hỏi AI, Quiz, Tài liệu)
  const [videoHubTab, setVideoHubTab] = useState<
    'content' | 'summary' | 'mentor' | 'quiz' | 'materials' | 'comments'
  >('content');

  // Video Player Ref & State
  const videoPlayerRef = useRef<VideoPlayerRef | null>(null);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);

  // Video AI Mentor RAG State
  const [mentorQuestion, setMentorQuestion] = useState('');
  const [isAskingMentor, setIsAskingMentor] = useState(false);
  const [mentorChatHistory, setMentorChatHistory] = useState<
    Array<{ q: string; a: string; timestamp?: string }>
  >([]);

  // Quiz Interaction State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);

  // Comments State
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Copy state
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Load persistent videos on mount
  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setIsLoadingVideos(true);
    try {
      const list = await videoService.fetchVideos();
      setVideos(list);

      // Auto select video if initialVideoId is specified or default to first video
      if (initialVideoId) {
        const found = list.find((v) => v.id === initialVideoId);
        if (found) setSelectedVideo(found);
      }
    } catch (err) {
      console.error('Error loading videos:', err);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  // Sync selected video's mentor history and reset quiz when video changes
  useEffect(() => {
    if (selectedVideo) {
      setSelectedAnswers({});
      setSubmittedQuiz(false);
      setMentorQuestion('');

      // Initialize default mentor response based on video title
      setMentorChatHistory([
        {
          q: `Video "${selectedVideo.title}" có gì nổi bật cho giờ dạy mầm non?`,
          a: `Chào cô ${currentUser.name.split(' ').pop()}! 🌸\n\nVideo **"${selectedVideo.title}"** được thiết kế đặc biệt cho khối **${selectedVideo.targetAudience || 'mầm non'}**.\n\n📍 **Các nội dung trọng tâm:**\n${
            selectedVideo.aiKnowledge?.summary?.map((s) => `• ${s}`).join('\n') ||
            '• Hướng dẫn ứng dụng công nghệ trực quan, dễ hiểu.\n• Tối ưu thời gian chuẩn bị học liệu cho cô giáo.'
          }\n\nCô có thể bấm vào mục **Nội dung** để nhảy đến từng mốc thực hành, hoặc hỏi Mầm AI bất kỳ câu hỏi nào về video nhé! ✨`,
          timestamp: '00:00',
        },
      ]);
    }
  }, [selectedVideo?.id]);

  // Video Time Update & Periodic Progress Saving (XV-K: Tự động lưu vị trí đang xem)
  const handlePlayerTimeUpdate = (cur: number, dur: number, pct: number) => {
    if (!selectedVideo) return;
    setVideoCurrentTime(cur);
    setVideoDuration(dur);

    // Save every ~10 seconds of watch time to server and local storage
    if (Math.floor(cur) > 0 && Math.floor(cur) % 10 === 0) {
      videoService.saveProgress(selectedVideo.id, cur, pct, pct >= 90);
    }
  };

  const handleVideoEnded = () => {
    if (!selectedVideo) return;
    sounds.playSuccess();
    videoService.saveProgress(selectedVideo.id, videoDuration, 100, true);

    // Update local state
    setVideos((prev) =>
      prev.map((v) =>
        v.id === selectedVideo.id
          ? {
              ...v,
              userProgress: {
                currentTime: videoDuration,
                percentage: 100,
                completed: true,
                lastWatchedDate: new Date().toISOString(),
              },
            }
          : v
      )
    );
  };

  // Jump Video to Specific Second via VideoPlayer imperative ref (XV-R)
  const jumpToTime = (seconds: number) => {
    sounds.playPop();
    videoPlayerRef.current?.seekTo(seconds);
  };

  // Ask Video AI Mentor (RAG based on video transcript)
  const handleAskMentor = async (questionText?: string) => {
    const q = questionText || mentorQuestion;
    if (!q.trim() || !selectedVideo) return;

    sounds.playPop();
    setIsAskingMentor(true);
    setMentorQuestion('');

    try {
      const res = await videoService.askVideoMentor(selectedVideo.id, q, videoCurrentTime);
      setMentorChatHistory((prev) => [
        ...prev,
        {
          q,
          a: res.answer,
          timestamp: res.timestampRef,
        },
      ]);
      sounds.playSuccess();
    } catch {
      sounds.playRetry();
      setMentorChatHistory((prev) => [
        ...prev,
        {
          q,
          a: 'Mầm AI đang tạm thời bận. Cô hãy thử lại sau giây lát hoặc xem lại phần tóm tắt nhé! 🌸',
        },
      ]);
    } finally {
      setIsAskingMentor(false);
    }
  };

  // Add Comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedVideo) return;

    sounds.playPop();
    setIsSubmittingComment(true);

    try {
      const created = await videoService.addComment(selectedVideo.id, {
        authorName: currentUser.name,
        authorSchool: currentUser.school,
        avatar: currentUser.avatar || '🌸',
        content: newCommentText.trim(),
      });

      setSelectedVideo((prev) =>
        prev
          ? {
              ...prev,
              comments: [created, ...(prev.comments || [])],
            }
          : null
      );
      setNewCommentText('');
      sounds.playSuccess();
    } catch {
      sounds.playRetry();
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Copy Prompt
  const handleCopyPrompt = (id: string, text: string) => {
    sounds.playPop();
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  // Handle Video Upload Success (XVI-C: Lưu lâu dài không bị mất)
  const handleUploadSuccess = (newVideo: VideoItem) => {
    sounds.playSuccess();
    setVideos((prev) => [newVideo, ...prev]);
    setSelectedVideo(newVideo);
    setActiveTabMode('videos');
  };

  // Filtered Video List
  const filteredVideos = videos.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      v.authorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTopic = selectedTopic === 'all' || v.topic.toLowerCase() === selectedTopic.toLowerCase();
    const matchesLevel = selectedLevel === 'all' || v.level === selectedLevel;

    let matchesScope = true;
    if (selectedScope === 'mine') {
      matchesScope = v.authorId === currentUser.id;
    } else if (selectedScope === 'saved') {
      matchesScope = (v.savesCount || 0) > 0;
    }

    return matchesSearch && matchesTopic && matchesLevel && matchesScope;
  });

  // Topics for Filter Pills
  const topicsList = [
    { id: 'all', label: 'Tất cả chủ đề' },
    { id: 'Canva AI', label: '🎨 Canva AI' },
    { id: 'ChatGPT', label: '🤖 ChatGPT' },
    { id: 'Tạo video', label: '🎬 Tạo video' },
    { id: 'Tạo hình ảnh', label: '🖼️ Tạo hình ảnh' },
    { id: 'Giáo án AI', label: '📝 Giáo án AI' },
    { id: 'Game AI', label: '🎮 Game AI' },
    { id: 'PowerPoint', label: '📊 PowerPoint' },
    { id: 'English Buddy', label: '🌎 English Buddy' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-24">
      {/* ======================================================== */}
      {/* TOP HERO BANNER & PROMINENT XVI-B UPLOAD BUTTON */}
      {/* ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-100/95 via-[#FFF8F0] to-orange-100/90 border border-amber-200/90 p-5 sm:p-7 shadow-[0_4px_24px_rgba(180,83,9,0.08)]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 text-orange-700 text-xs font-black shadow-2xs border border-orange-200">
              <Film className="w-3.5 h-3.5 text-orange-600" />
              <span>Hệ Thống Video Tri Thức · Lưu Trữ Lâu Dài Vĩnh Viễn</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-950 tracking-tight font-['Quicksand']">
              Thư Viện Video Học Tập Lâu Dài
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
              Mọi video chia sẻ từ giáo viên cả nước được lưu trữ vĩnh viễn trên Cloud.
              Tự động bóc tách transcript, tóm tắt bài giảng & tích hợp AI Mentor hỏi đáp thông minh.
            </p>
          </div>

          {/* Prominent Button: 🎥 + Tải video bài học (XVI-B) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => {
                sounds.playPop();
                setIsUploadModalOpen(true);
              }}
              className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/30 hover:scale-103 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer ring-2 ring-orange-400/40"
            >
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="font-['Quicksand'] tracking-wide">🎥 + Tải video bài học</span>
            </button>
          </div>
        </div>

        {/* Mascot decoration */}
        <div className="hidden lg:block absolute right-8 -bottom-3 z-0 opacity-40 hover:opacity-100 transition-opacity">
          <MamAiMascot size="lg" mood="teaching" />
        </div>
      </div>

      {/* ======================================================== */}
      {/* DUAL MODE SELECTOR: VIDEO LIBRARY vs 7-LEVEL CURRICULUM */}
      {/* ======================================================== */}
      <div className="flex items-center justify-between border-b border-amber-200/70 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2 p-1 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
          <button
            onClick={() => {
              sounds.playPop();
              setActiveTabMode('videos');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTabMode === 'videos'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-2xs'
                : 'text-stone-700 hover:text-orange-700'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Thư Viện Video Tri Thức ({videos.length})</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setActiveTabMode('courses');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTabMode === 'courses'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-2xs'
                : 'text-stone-700 hover:text-orange-700'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Lộ Trình 7 Cấp Độ AI</span>
          </button>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3 text-xs text-stone-500 font-bold">
          <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-amber-100 shadow-2xs">
            <Users className="w-3.5 h-3.5 text-orange-600" />
            <span>{videos.filter((v) => v.authorId === currentUser.id).length} video của cô</span>
          </span>
          <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-amber-100 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Lưu vĩnh viễn trên Cloud</span>
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODE 1: ACTIVE VIDEO PLAYER & KNOWLEDGE HUB DETAIL */}
      {/* ======================================================== */}
      {selectedVideo ? (
        <div className="space-y-6">
          {/* Back button */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                sounds.playPop();
                setSelectedVideo(null);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-50 border border-amber-200 text-xs font-black text-amber-950 flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-orange-600" />
              <span>← Quay lại kho video bài học</span>
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-black">
                {selectedVideo.topic}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-900 font-black">
                {selectedVideo.level}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 font-bold">
                {selectedVideo.privacy === 'public'
                  ? '🌐 Công khai'
                  : selectedVideo.privacy === 'members'
                  ? '👥 Thành viên'
                  : '🔒 Riêng tư'}
              </span>
            </div>
          </div>

          {/* Main Grid: Left 2 Cols (Video + Hub Tabs), Right 1 Col (Chapters & Course Playlist) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols */}
            <div className="lg:col-span-2 space-y-5">
              {/* Production Real Video Player (XV-E, XV-H, XV-N) */}
              <VideoPlayer
                ref={videoPlayerRef}
                src={selectedVideo.playbackUrl || selectedVideo.videoUrl}
                poster={selectedVideo.thumbnailUrl}
                title={selectedVideo.title}
                initialTime={selectedVideo.userProgress?.currentTime || 0}
                onTimeUpdate={handlePlayerTimeUpdate}
                onEnded={handleVideoEnded}
              />

              {/* Video Title & Author Metadata */}
              <div className="bg-white/95 rounded-3xl p-5 border border-amber-200/80 shadow-[0_4px_16px_rgba(180,83,9,0.04)] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-amber-950 tracking-tight font-['Quicksand']">
                      {selectedVideo.title}
                    </h2>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {selectedVideo.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        sounds.playPop();
                        setIsExportModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 cursor-pointer transition-all active:scale-95 shadow-2xs"
                      title="Xuất & Chia sẻ video bài học (Điện thoại & Máy tính)"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        sounds.playPop();
                        setSelectedVideo((prev) =>
                          prev
                            ? {
                                ...prev,
                                savesCount: (prev.savesCount || 0) + 1,
                              }
                            : null
                        );
                      }}
                      className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-orange-800 font-bold text-xs border border-amber-200 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Bookmark className="w-4 h-4 text-orange-600" />
                      <span>{selectedVideo.savesCount || 0} Lưu</span>
                    </button>
                  </div>
                </div>

                {/* Author Info Bar */}
                <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm border border-orange-200">
                      {selectedVideo.authorAvatar || '🌸'}
                    </div>
                    <div>
                      <span className="font-black text-amber-950 block">
                        {selectedVideo.authorName}
                      </span>
                      <span className="text-[10px] text-stone-500">
                        {selectedVideo.authorSchool || 'Giáo viên mầm non'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-stone-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{selectedVideo.views} lượt xem</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{selectedVideo.duration}</span>
                    </span>
                    <span className="font-mono text-orange-700 font-bold">
                      {selectedVideo.userProgress?.percentage
                        ? `${selectedVideo.userProgress.percentage}% đã học`
                        : 'Mới bắt đầu'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* VIDEO KNOWLEDGE HUB TABS (XV-I: Nội dung, Tóm tắt, Hỏi AI, Quiz, Tài liệu) */}
              {/* ======================================================== */}
              <div className="bg-white/95 rounded-3xl border border-amber-200/80 shadow-[0_4px_16px_rgba(180,83,9,0.05)] overflow-hidden">
                {/* Hub Navigation Bar */}
                <div className="flex items-center gap-1 p-2 bg-amber-50/60 border-b border-amber-100 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'content', label: '📖 Nội dung', icon: BookOpen },
                    { id: 'summary', label: '📝 Tóm tắt', icon: CheckCircle },
                    { id: 'mentor', label: '💬 Hỏi AI', icon: MessageSquare },
                    { id: 'quiz', label: '🎯 Quiz', icon: HelpCircle },
                    { id: 'materials', label: '📚 Tài liệu', icon: Copy },
                    { id: 'comments', label: `💬 Thảo luận (${selectedVideo.comments?.length || 0})`, icon: Users },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isTabActive = videoHubTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          sounds.playPop();
                          setVideoHubTab(tab.id as any);
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                          isTabActive
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-2xs'
                            : 'text-stone-700 hover:bg-amber-100/50'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-5">
                  {/* TAB 1: 📖 NỘI DUNG & TRANSCRIPT CÓ MỐC THỜI GIAN */}
                  {videoHubTab === 'content' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-medium text-stone-500">
                        <span className="font-bold text-amber-950 font-['Quicksand']">
                          Dàn Ý Bài Học & Transcript Tương Tác
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                          Chạm vào câu để xem ngay
                        </span>
                      </div>

                      {/* Chapters Timeline List inside Content Tab */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {selectedVideo.aiKnowledge?.chapters?.map((ch) => (
                          <button
                            key={ch.id}
                            onClick={() => jumpToTime(ch.seconds)}
                            className="text-left p-3 rounded-2xl bg-amber-50/40 hover:bg-orange-50 border border-amber-200/80 hover:border-orange-300 transition-all text-xs cursor-pointer group"
                          >
                            <span className="font-mono text-orange-700 font-black text-[11px] block group-hover:underline">
                              ⏱ {ch.time}
                            </span>
                            <span className="font-bold text-amber-950 block mt-1 truncate">
                              {ch.title}
                            </span>
                            <p className="text-[10px] text-stone-500 line-clamp-2 mt-0.5">
                              {ch.summary}
                            </p>
                          </button>
                        ))}
                      </div>

                      {/* Transcript Full View */}
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                        <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide">
                          Toàn văn Transcript Bài Giảng
                        </h4>
                        <div className="text-xs text-stone-700 font-medium leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto pr-2">
                          {selectedVideo.aiKnowledge?.transcript ||
                            'Transcript đang được hệ thống tự động nhận dạng và chuẩn hóa.'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: 📝 TÓM TẮT & TỪ KHÓA BÀI HỌC */}
                  {videoHubTab === 'summary' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-black text-xs sm:text-sm text-amber-950 mb-2 font-['Quicksand']">
                          Điểm Then Chốt Của Bài Học
                        </h4>
                        <ul className="space-y-2 text-xs text-stone-700 font-medium">
                          {selectedVideo.aiKnowledge?.summary?.map((sm, i) => (
                            <li key={i} className="flex items-start gap-2 bg-amber-50/30 p-2.5 rounded-xl border border-amber-100">
                              <span className="text-orange-500 font-black text-base leading-none">•</span>
                              <span>{sm}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-3 border-t border-amber-100">
                        <h4 className="font-black text-xs sm:text-sm text-amber-950 mb-2 font-['Quicksand']">
                          Từ Khóa Quan Trọng & Thẻ Bài Học
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedVideo.aiKnowledge?.keywords?.map((kw, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-orange-800 font-bold text-xs shadow-2xs"
                            >
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: 💬 HỎI AI (VIDEO AI MENTOR RAG) */}
                  {videoHubTab === 'mentor' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-medium text-stone-500">
                        <span>Hỏi đáp bám sát nội dung và mốc thời gian của video</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold">
                          RAG Model
                        </span>
                      </div>

                      {/* Q&A List */}
                      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                        {mentorChatHistory.map((item, idx) => (
                          <div key={idx} className="space-y-2 text-xs">
                            {/* Question */}
                            <div className="flex justify-end">
                              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white max-w-[85%] rounded-tr-xs shadow-2xs font-medium">
                                {item.q}
                              </div>
                            </div>

                            {/* Answer with citation */}
                            <div className="flex justify-start gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                                <MamAiMascot size="sm" mood="idle" />
                              </div>
                              <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 text-stone-800 max-w-[88%] rounded-tl-xs shadow-2xs leading-relaxed font-medium">
                                <p className="whitespace-pre-line">{item.a}</p>
                              </div>
                            </div>
                          </div>
                        ))}

                        {isAskingMentor && (
                          <div className="flex items-center gap-2 text-xs text-stone-500 italic p-3 bg-amber-50/40 rounded-2xl border border-amber-100 w-fit">
                            <span className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                            <span>Mầm AI đang đối chiếu transcript video...</span>
                          </div>
                        )}
                      </div>

                      {/* Suggested Questions */}
                      {selectedVideo.aiKnowledge?.suggestedQuestions && (
                        <div className="space-y-1.5 pt-2">
                          <span className="text-[11px] font-bold text-stone-500 block">
                            Gợi ý câu hỏi nhanh:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {selectedVideo.aiKnowledge.suggestedQuestions.map((sq, i) => (
                              <button
                                key={i}
                                onClick={() => handleAskMentor(sq)}
                                className="px-3 py-1 rounded-xl bg-amber-50 hover:bg-orange-100 text-orange-900 border border-amber-200 text-[11px] font-medium transition-all cursor-pointer"
                              >
                                {sq}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Input Box */}
                      <div className="pt-2 flex items-center gap-2">
                        <input
                          type="text"
                          value={mentorQuestion}
                          onChange={(e) => setMentorQuestion(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAskMentor()}
                          placeholder="Hỏi về nội dung video (ví dụ: 'Đoạn nào hướng dẫn viết prompt?')"
                          className="flex-1 px-4 py-2.5 rounded-2xl bg-amber-50/40 border border-amber-200 text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                        <button
                          onClick={() => handleAskMentor()}
                          disabled={!mentorQuestion.trim() || isAskingMentor}
                          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/25 disabled:opacity-50 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Gửi</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: 🎯 QUIZ TRẮC NGHIỆM TƯƠNG TÁC */}
                  {videoHubTab === 'quiz' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-xs sm:text-sm text-amber-950 font-['Quicksand']">
                          Câu Hỏi Trắc Nghiệm Tương Tác AI
                        </h4>
                        <span className="text-[11px] text-stone-500 font-medium">
                          Kiểm tra nhanh mức độ tiếp thu bài học
                        </span>
                      </div>

                      <div className="space-y-4">
                        {selectedVideo.aiKnowledge?.quiz?.map((qItem, qIdx) => {
                          const userAns = selectedAnswers[qIdx];
                          const isAnswered = userAns !== undefined;
                          const isCorrect = userAns === qItem.correctIndex;

                          return (
                            <div
                              key={qIdx}
                              className="p-4 rounded-2xl bg-amber-50/30 border border-amber-200 space-y-3"
                            >
                              <span className="font-black text-xs sm:text-sm text-amber-950 block">
                                Câu {qIdx + 1}: {qItem.question}
                              </span>

                              <div className="space-y-2">
                                {qItem.options.map((opt, optIdx) => {
                                  const isSelected = userAns === optIdx;
                                  return (
                                    <button
                                      key={optIdx}
                                      onClick={() => {
                                        sounds.playPop();
                                        setSelectedAnswers((prev) => ({
                                          ...prev,
                                          [qIdx]: optIdx,
                                        }));
                                      }}
                                      className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                                        isSelected
                                          ? 'bg-orange-50 border-orange-500 font-bold text-orange-950'
                                          : 'bg-white border-amber-100 hover:border-amber-300'
                                      }`}
                                    >
                                      <span>{opt}</span>
                                      {submittedQuiz && optIdx === qItem.correctIndex && (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>

                              {submittedQuiz && isAnswered && (
                                <div
                                  className={`p-3 rounded-xl text-xs font-medium ${
                                    isCorrect
                                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                                      : 'bg-rose-50 text-rose-900 border border-rose-200'
                                  }`}
                                >
                                  {isCorrect ? '✅ Chính xác! ' : '❌ Chưa chính xác. '}
                                  <span>{qItem.explanation}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => {
                            sounds.playSuccess();
                            setSubmittedQuiz(true);
                          }}
                          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs shadow-md cursor-pointer hover:scale-103 active:scale-95 transition-all"
                        >
                          Kiểm tra đáp án
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: 📚 TÀI LIỆU BÀI HỌC (XV-J: PDF, Word, PowerPoint, Prompt, File mẫu, Hình ảnh) */}
                  {videoHubTab === 'materials' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-black text-xs sm:text-sm text-amber-950 font-['Quicksand']">
                            📚 TÀI LIỆU BÀI HỌC ĐÍNH KÈM
                          </h4>
                          <p className="text-[11px] text-stone-500 font-medium">
                            Giáo viên có thể tải hoặc xem tài liệu trực tiếp theo quyền truy cập
                          </p>
                        </div>
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                          Đầy đủ giáo án & prompt
                        </span>
                      </div>

                      {/* Default Comprehensive Materials Suite */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* 1. PDF Bản tóm tắt & Giáo trình */}
                        <div className="p-3.5 rounded-2xl bg-red-50/60 border border-red-200 flex items-center justify-between gap-3 shadow-2xs">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="w-9 h-9 rounded-xl bg-red-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                              PDF
                            </div>
                            <div className="overflow-hidden">
                              <span className="font-black text-xs text-amber-950 truncate block">
                                Giáo trình tóm tắt: {selectedVideo.title}
                              </span>
                              <span className="text-[10px] text-stone-500 block">
                                Định dạng PDF · 2.4 MB · Bản in màu
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              sounds.playSuccess();
                              alert(`Đang mở tải tài liệu PDF bài học: "${selectedVideo.title}"`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-red-50 text-red-700 font-bold text-xs border border-red-200 cursor-pointer shrink-0"
                          >
                            Tải về
                          </button>
                        </div>

                        {/* 2. Word Kế hoạch bài dạy 5 bước */}
                        <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-center justify-between gap-3 shadow-2xs">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                              DOC
                            </div>
                            <div className="overflow-hidden">
                              <span className="font-black text-xs text-amber-950 truncate block">
                                Kế hoạch bài dạy mẫu 5 bước
                              </span>
                              <span className="text-[10px] text-stone-500 block">
                                Định dạng Word (.docx) · Chuẩn Bộ GD&ĐT
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              sounds.playSuccess();
                              alert(`Đang tải giáo án mẫu Word cho bài: "${selectedVideo.title}"`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200 cursor-pointer shrink-0"
                          >
                            Tải về
                          </button>
                        </div>

                        {/* 3. PowerPoint Trình chiếu minh họa */}
                        <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200 flex items-center justify-between gap-3 shadow-2xs">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                              PPT
                            </div>
                            <div className="overflow-hidden">
                              <span className="font-black text-xs text-amber-950 truncate block">
                                Slide trình chiếu bài giảng AI
                              </span>
                              <span className="text-[10px] text-stone-500 block">
                                PowerPoint (.pptx) · 12 slide minh họa
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              sounds.playSuccess();
                              alert(`Đang tải slide bài giảng PowerPoint: "${selectedVideo.title}"`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-orange-50 text-orange-700 font-bold text-xs border border-orange-200 cursor-pointer shrink-0"
                          >
                            Tải về
                          </button>
                        </div>

                        {/* 4. Kho hình ảnh & tư liệu mẫu */}
                        <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200 flex items-center justify-between gap-3 shadow-2xs">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                              ZIP
                            </div>
                            <div className="overflow-hidden">
                              <span className="font-black text-xs text-amber-950 truncate block">
                                Bộ hình ảnh & tranh minh họa 3D
                              </span>
                              <span className="text-[10px] text-stone-500 block">
                                Tệp nén (.zip) · 15 hình 4K sắc nét
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              sounds.playSuccess();
                              alert(`Đang tải gói hình ảnh tư liệu của bài học!`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200 cursor-pointer shrink-0"
                          >
                            Tải về
                          </button>
                        </div>
                      </div>

                      {/* Prompts list */}
                      <div className="space-y-3 pt-2">
                        <span className="text-xs font-black text-amber-950 uppercase tracking-wide block">
                          Câu lệnh Prompt AI Thực Hành Trong Video
                        </span>
                        {selectedVideo.aiKnowledge?.studyMaterials?.map((mat) => {
                          const isCopied = copiedPromptId === mat.id;
                          return (
                            <div
                              key={mat.id}
                              className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 flex items-center justify-between gap-3"
                            >
                              <div className="space-y-1">
                                <span className="font-black text-xs sm:text-sm text-amber-950 block">
                                  {mat.title}
                                </span>
                                <p className="text-[11px] text-stone-600 font-medium">
                                  {mat.description}
                                </p>
                              </div>

                              <button
                                onClick={() =>
                                  handleCopyPrompt(
                                    mat.id,
                                    `Prompt mẫu từ video bài học: ${mat.title}\n${mat.description}`
                                  )
                                }
                                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-orange-50 text-orange-800 font-bold text-xs border border-amber-200 flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                <span>{isCopied ? 'Đã copy! ✓' : 'Sao chép prompt'}</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TAB 6: 💬 THẢO LUẬN & BÌNH LUẬN */}
                  {videoHubTab === 'comments' && (
                    <div className="space-y-4">
                      {/* New Comment Box */}
                      <form onSubmit={handleAddComment} className="flex gap-2">
                        <input
                          type="text"
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          placeholder="Viết cảm nhận hoặc câu hỏi trao đổi cùng cộng đồng..."
                          className="flex-1 px-4 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                        <button
                          type="submit"
                          disabled={!newCommentText.trim() || isSubmittingComment}
                          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs disabled:opacity-50 cursor-pointer"
                        >
                          Gửi
                        </button>
                      </form>

                      {/* Comment List */}
                      <div className="space-y-3 pt-2">
                        {selectedVideo.comments && selectedVideo.comments.length > 0 ? (
                          selectedVideo.comments.map((cmt) => (
                            <div
                              key={cmt.id}
                              className="p-3.5 rounded-2xl bg-amber-50/20 border border-amber-100 space-y-1.5"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-black text-amber-950">
                                  {cmt.authorName} ({cmt.authorSchool})
                                </span>
                                <span className="text-[10px] text-stone-400">
                                  {cmt.createdAt}
                                </span>
                              </div>
                              <p className="text-xs text-stone-700 font-medium">
                                {cmt.content}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-stone-400 text-center py-4">
                            Chưa có bình luận nào. Hãy là người đầu tiên trao đổi!
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Chapters & Course Playlist (XV-O) */}
            <div className="space-y-5">
              {/* Chapters & Time Jump */}
              <div className="bg-white/95 rounded-3xl p-5 border border-amber-200/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-amber-950 flex items-center gap-2 font-['Quicksand']">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span>Mốc Thời Gian (Chapters)</span>
                  </h3>
                  <span className="text-[10px] text-stone-500 font-bold">Chạm để tua</span>
                </div>

                <div className="space-y-2">
                  {selectedVideo.aiKnowledge?.chapters?.map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => jumpToTime(ch.seconds)}
                      className="w-full text-left p-3 rounded-2xl bg-amber-50/30 hover:bg-orange-50 border border-amber-100 hover:border-orange-300 transition-all text-xs cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-orange-700 font-black text-[11px] group-hover:underline">
                          ⏱ {ch.time}
                        </span>
                        <PlayCircle className="w-3.5 h-3.5 text-stone-400 group-hover:text-orange-600" />
                      </div>
                      <span className="font-bold text-amber-950 block mt-1">
                        {ch.title}
                      </span>
                      <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                        {ch.summary}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Course Playlist / Danh Sách Bài Trong Khóa Học (XV-O) */}
              <div className="bg-white/95 rounded-3xl p-5 border border-amber-200/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-950">
                    <BookOpen className="w-4 h-4 text-orange-600" />
                    <h4 className="font-black text-xs sm:text-sm font-['Quicksand']">
                      Danh Sách Bài Trong Khóa Học
                    </h4>
                  </div>
                  <span className="text-[10px] text-orange-700 font-bold">
                    {courses.find((c) => c.id === selectedVideo.courseId)?.title?.split(':')[0] || 'Khóa học'}
                  </span>
                </div>

                {/* Lessons in current course */}
                <div className="space-y-2">
                  {(courses.find((c) => c.id === selectedVideo.courseId)?.lessons || courses[1].lessons).map((lsn, lIdx) => {
                    const isCurrent = lsn.id === selectedVideo.lessonId || lIdx === 0;
                    const isCompleted = lsn.isCompleted || (isCurrent && selectedVideo.userProgress?.completed);
                    return (
                      <div
                        key={lsn.id}
                        className={`p-3 rounded-2xl border text-xs transition-all flex items-center justify-between gap-2.5 ${
                          isCurrent
                            ? 'bg-orange-50/80 border-orange-300 font-bold text-orange-950 ring-1 ring-orange-200'
                            : 'bg-stone-50/60 border-stone-200 hover:border-amber-300 text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-500 text-white'
                              : isCurrent
                              ? 'bg-orange-600 text-white'
                              : 'bg-stone-200 text-stone-600'
                          }`}>
                            {lIdx + 1}
                          </span>
                          <div className="overflow-hidden">
                            <span className="truncate block font-bold">{lsn.title}</span>
                            <span className="text-[10px] text-stone-400 block">{lsn.duration}</span>
                          </div>
                        </div>

                        {/* Status badge: Chưa học / Đang học / Hoàn thành */}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isCurrent
                            ? 'bg-orange-100 text-orange-800 animate-pulse'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {isCompleted ? 'Hoàn thành ✓' : isCurrent ? 'Đang học ▶' : 'Chưa học'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress & Badge */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-3xl p-5 border border-amber-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-amber-950">
                  <Award className="w-4.5 h-4.5 text-orange-600" />
                  <h4 className="font-black text-xs sm:text-sm font-['Quicksand']">
                    Tiến Độ & Chứng Nhận Bài Học
                  </h4>
                </div>
                <div className="p-3 bg-white/80 rounded-2xl border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Hoàn thành bài học</span>
                    <span className="text-orange-700">
                      {selectedVideo.userProgress?.completed
                        ? '100% ✓'
                        : `${selectedVideo.userProgress?.percentage || 0}%`}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-300"
                      style={{
                        width: `${selectedVideo.userProgress?.percentage || 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeTabMode === 'videos' ? (
        /* ======================================================== */
        /* MODE 2: VIDEO KNOWLEDGE LIBRARY LISTING GRID (XVI-A) */
        /* ======================================================== */
        <div className="space-y-6">
          {/* Search & Topic Filters Bar */}
          <div className="bg-white/95 rounded-3xl p-4 sm:p-5 border border-amber-200/80 shadow-[0_4px_16px_rgba(180,83,9,0.04)] space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm video bài học theo tên, công cụ, giáo viên, nội dung..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            {/* Topic Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {topicsList.map((t) => {
                const isActive = selectedTopic === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      sounds.playPop();
                      setSelectedTopic(t.id);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-2xs'
                        : 'bg-amber-50/70 hover:bg-amber-100/70 text-stone-700 border border-amber-200/80'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Secondary Filter: Scope & Level */}
            <div className="flex items-center justify-between pt-2 border-t border-amber-100 flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-stone-400 font-bold">Phạm vi:</span>
                {(['all', 'mine', 'saved'] as const).map((sc) => (
                  <button
                    key={sc}
                    onClick={() => {
                      sounds.playPop();
                      setSelectedScope(sc);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                      selectedScope === sc
                        ? 'bg-orange-100 text-orange-900 border border-orange-200'
                        : 'text-stone-600 hover:text-orange-700'
                    }`}
                  >
                    {sc === 'all'
                      ? 'Tất cả cộng đồng'
                      : sc === 'mine'
                      ? `Video của tôi (${videos.filter((v) => v.authorId === currentUser.id).length})`
                      : 'Đã lưu'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-stone-400 font-bold">Cấp độ:</span>
                {['all', 'Cơ bản', 'Trung bình', 'Nâng cao'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      sounds.playPop();
                      setSelectedLevel(lvl);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                      selectedLevel === lvl
                        ? 'bg-orange-100 text-orange-900 border border-orange-200'
                        : 'text-stone-600 hover:text-orange-700'
                    }`}
                  >
                    {lvl === 'all' ? 'Tất cả' : lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Video Grid Cards */}
          {isLoadingVideos ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-stone-500">Đang tải thư viện video lâu dài...</p>
            </div>
          ) : filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVideos.map((vid) => {
                const hasProgress = vid.userProgress && vid.userProgress.percentage > 0;
                return (
                  <div
                    key={vid.id}
                    onClick={() => {
                      sounds.playPop();
                      setSelectedVideo(vid);
                    }}
                    className="group bg-white rounded-3xl overflow-hidden border border-amber-200/80 hover:border-orange-400 shadow-[0_4px_16px_rgba(180,83,9,0.06)] hover:shadow-[0_8px_24px_rgba(234,88,12,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    {/* Thumbnail & Badges */}
                    <div className="relative aspect-video bg-stone-900 overflow-hidden">
                      <img
                        src={vid.thumbnailUrl}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                      {/* Play overlay button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 text-orange-600 flex items-center justify-center shadow-lg group-hover:scale-115 transition-transform">
                          <PlayCircle className="w-7 h-7 fill-white" />
                        </div>
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-stone-900/80 text-white font-black text-[10px] backdrop-blur-xs">
                          {vid.topic}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-orange-600/90 text-white font-black text-[10px] backdrop-blur-xs">
                          {vid.level}
                        </span>
                      </div>

                      {/* Duration bottom right */}
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-stone-900/85 text-white font-mono text-[10px] font-bold">
                        {vid.duration}
                      </div>

                      {/* Watch Progress Bar bottom of thumbnail */}
                      {hasProgress && (
                        <div className="absolute bottom-0 inset-x-0 h-1 bg-stone-700">
                          <div
                            className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                            style={{ width: `${vid.userProgress?.percentage}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <h3 className="font-black text-xs sm:text-sm text-amber-950 tracking-tight font-['Quicksand'] line-clamp-2 group-hover:text-orange-600 transition-colors">
                          {vid.title}
                        </h3>
                        <p className="text-[11px] text-stone-500 font-medium line-clamp-2">
                          {vid.description}
                        </p>
                      </div>

                      {/* Author & Stats Footer */}
                      <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                        <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                          <span>{vid.authorAvatar || '🌸'}</span>
                          <span className="truncate font-bold text-amber-950">
                            {vid.authorName}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span>{vid.views} xem</span>
                          <span>·</span>
                          <span className="text-orange-700 font-bold">
                            {vid.userProgress?.completed
                              ? 'Đã xong ✓'
                              : vid.userProgress?.percentage
                              ? `${vid.userProgress.percentage}%`
                              : 'Xem bài'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/95 rounded-3xl border border-dashed border-amber-200 p-8 space-y-4">
              <Film className="w-12 h-12 text-stone-300 mx-auto" />
              <div className="space-y-1">
                <h4 className="font-black text-sm text-amber-950">
                  Không tìm thấy video bài học phù hợp
                </h4>
                <p className="text-xs text-stone-500">
                  Thử tìm với từ khóa khác hoặc tải lên video bài học đầu tiên của cô!
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs cursor-pointer"
              >
                🎥 + Tải video bài học ngay
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ======================================================== */
        /* MODE 3: 7 LEVELS CURRICULUM SYLLABUS */
        /* ======================================================== */
        <div className="space-y-6">
          {/* Level Island Bar */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
            {courses.map((c) => {
              const isSelected = c.id === selectedCourseId;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    sounds.playPop();
                    setSelectedCourseId(c.id);
                    if (c.lessons.length > 0) {
                      setActiveCourseLessonId(c.lessons[0].id);
                    }
                  }}
                  className={`p-3.5 rounded-2xl border text-left shrink-0 w-44 sm:w-52 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-tr from-amber-500 to-orange-600 text-white border-orange-600 shadow-sm scale-102'
                      : 'bg-white/95 hover:bg-amber-50/60 border-amber-200/80 text-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className={isSelected ? 'text-amber-200' : 'text-orange-700'}>
                      Cấp độ {c.level}
                    </span>
                    <span className="text-[10px] opacity-80">{c.lessonsCount} bài</span>
                  </div>
                  <h4 className="font-black text-xs sm:text-sm line-clamp-1 font-['Quicksand']">
                    {c.title}
                  </h4>
                  <div className="mt-2 flex items-center justify-between text-[10px] opacity-90 font-medium">
                    <span>{c.progressPercent}% hoàn thành</span>
                    <span>{c.duration}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Lessons in Selected Course */}
          {(() => {
            const currentCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-sm sm:text-base text-amber-950 font-['Quicksand']">
                    {currentCourse.title}
                  </h3>
                  <span className="text-xs text-stone-500">
                    {currentCourse.lessons.length} bài học thực hành
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentCourse.lessons.map((lsn, idx) => (
                    <div
                      key={lsn.id}
                      onClick={() => {
                        sounds.playPop();
                        // Find matching video or create view for lesson
                        const matched = videos.find(
                          (v) => v.courseId === currentCourse.id || v.title.includes(lsn.title)
                        );
                        if (matched) {
                          setSelectedVideo(matched);
                        } else if (videos.length > 0) {
                          setSelectedVideo(videos[0]);
                        }
                      }}
                      className="p-4 rounded-3xl bg-white border border-amber-200/80 hover:border-orange-400 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-orange-700">
                            Bài {idx + 1}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {lsn.duration}
                          </span>
                        </div>
                        <h4 className="font-black text-xs sm:text-sm text-amber-950 group-hover:text-orange-600 transition-colors">
                          {lsn.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 line-clamp-1">
                          {lsn.summary[0] || 'Xem video & thực hành prompt cùng Mầm AI'}
                        </p>
                      </div>

                      <div className="w-10 h-10 rounded-2xl bg-amber-50 group-hover:bg-orange-600 group-hover:text-white text-orange-600 flex items-center justify-center shrink-0 transition-colors">
                        <PlayCircle className="w-5 h-5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIDEO UPLOAD MODAL (XVI-B, XVI-C, XVI-D) */}
      {/* ======================================================== */}
      <VideoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
        currentUser={{
          id: currentUser.id,
          name: currentUser.name,
          school: currentUser.school,
          avatar: currentUser.avatar || '🌸',
        }}
      />

      {/* Cross-Device Export & Share Modal for Video (Phone & Desktop) */}
      {selectedVideo && (
        <ExportShareModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          item={{
            id: selectedVideo.id,
            type: 'video',
            title: selectedVideo.title,
            subtitle: `${selectedVideo.topic} • ${selectedVideo.level} • ${selectedVideo.duration}`,
            author: selectedVideo.authorName,
            school: selectedVideo.authorSchool,
            data: selectedVideo,
          }}
        />
      )}
    </div>
  );
};
