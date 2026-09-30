import React, { useState, useRef } from 'react';
import {
  Video,
  X,
  Upload,
  Play,
  Camera,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Film,
  Image as ImageIcon,
  Tag,
  Lock,
  Globe,
  Users,
  BookOpen,
  GraduationCap,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { videoService } from '../services/videoService';
import { VideoItem, VideoPrivacy } from '../types';
import { sounds } from '../utils/audioUtils';
import { MamAiMascot } from './MamAiMascot';
import { useAuth } from '../context/AuthContext';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (video: VideoItem) => void;
  currentUser: {
    id: string;
    name: string;
    school: string;
    avatar: string;
  };
}

export const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentUser,
}) => {
  const { isEmailVerified, openAuthModal, isAuthenticated } = useAuth();
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('Canva AI');
  const [level, setLevel] = useState<'Cơ bản' | 'Trung bình' | 'Nâng cao'>('Cơ bản');
  const [targetAudience, setTargetAudience] = useState('Toàn bộ giáo viên mầm non');
  const [tagsInput, setTagsInput] = useState('CanvaAI, TruyenTranh, NgonNgu, MamNon');
  const [courseId, setCourseId] = useState('course-2');
  const [lessonId, setLessonId] = useState('lesson-auto');
  const [privacy, setPrivacy] = useState<VideoPrivacy>('public');
  const [transcriptNotes, setTranscriptNotes] = useState('');

  // Video & Thumbnail states
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [videoBase64, setVideoBase64] = useState<string>('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string>(
    'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80'
  );
  const [thumbnailBase64, setThumbnailBase64] = useState<string>('');
  const [createdVideo, setCreatedVideo] = useState<VideoItem | null>(null);

  // Recording state
  const [isRecordingWebcam, setIsRecordingWebcam] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const videoElemRef = useRef<HTMLVideoElement | null>(null);

  // Upload progress and status (XVI-D)
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'ai_processing' | 'ready' | 'error'
  >('idle');
  const [uploadPercent, setUploadPercent] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const thumbInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const topicsList = [
    'Canva AI',
    'ChatGPT',
    'Tạo video',
    'Tạo hình ảnh',
    'Giáo án AI',
    'Game AI',
    'PowerPoint',
    'English Buddy',
  ];

  const coursesList = [
    { id: 'course-1', title: 'Nhập môn AI Mầm non (ChatGPT & Prompting)' },
    { id: 'course-2', title: 'AI Tạo Tranh Ảnh & Truyện Tranh 3D (Canva AI)' },
    { id: 'course-3', title: 'Soạn Giáo Án 5 Bước Chuẩn Bộ GD&ĐT' },
    { id: 'course-4', title: 'Thiết Kế Trò Chơi Tương Tác & Game AI' },
    { id: 'course-5', title: 'English Buddy – Tích Hợp Song Ngữ Tiếng Anh' },
    { id: 'course-6', title: 'Tự Động Hóa Học Liệu & PowerPoint Giảng Dạy' },
    { id: 'course-7', title: 'Quản Lý Lớp Học & Chuyên Môn Sư Phạm AI' },
    { id: 'community-open', title: 'Kho Mở Cộng Đồng (Bài học độc lập)' },
  ];

  const thumbnailPresets = [
    {
      label: 'Sách tranh 3D',
      url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'Giáo án sinh động',
      url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'Trò chơi tương tác',
      url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'Song ngữ tiếng Anh',
      url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const handleSelectVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playPop();
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);

    // Read base64
    const reader = new FileReader();
    reader.onload = () => {
      setVideoBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectThumbFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playPop();
    setThumbnailFile(file);
    const url = URL.createObjectURL(file);
    setThumbnailPreviewUrl(url);

    const reader = new FileReader();
    reader.onload = () => {
      setThumbnailBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const startWebcamRecording = async () => {
    try {
      sounds.playPop();
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      webcamStreamRef.current = stream;
      if (videoElemRef.current) {
        videoElemRef.current.srcObject = stream;
        videoElemRef.current.play();
      }
      setIsRecordingWebcam(true);
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        setVideoPreviewUrl(url);
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideoBase64(reader.result as string);
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorder.start();
    } catch (err) {
      console.error('Webcam access error:', err);
      alert('Không thể mở camera. Vui lòng cho phép quyền camera và micro trên trình duyệt.');
    }
  };

  const stopWebcamRecording = () => {
    sounds.playSuccess();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsRecordingWebcam(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề video bài học');
      return;
    }
    if (!description.trim()) {
      alert('Vui lòng nhập mô tả nội dung video bài học');
      return;
    }

    sounds.playPop();
    setUploadStatus('uploading');
    setUploadPercent(10);
    setErrorMessage('');

    try {
      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      const created = await videoService.uploadVideo({
        title,
        description,
        topic,
        level,
        targetAudience,
        tags: parsedTags.length > 0 ? parsedTags : [topic, 'MầmNon'],
        courseId,
        lessonId: lessonId || 'lesson-1',
        privacy,
        videoFile,
        videoData: videoBase64 || undefined,
        videoUrl: videoPreviewUrl && !videoBase64 && !videoFile ? videoPreviewUrl : undefined,
        thumbnailFile,
        thumbnailData: thumbnailBase64 || undefined,
        thumbnailUrl: thumbnailPreviewUrl || undefined,
        transcript: transcriptNotes,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorSchool: currentUser.school,
        authorAvatar: currentUser.avatar,
        onProgress: (pct) => {
          setUploadPercent(pct);
          if (pct >= 95) {
            setUploadStatus('ai_processing');
          }
        },
      });

      setCreatedVideo(created);
      setUploadStatus('ready');
      sounds.playSuccess();
      // Instantly notify parent so video is in state even if user closes modal immediately
      onSuccess(created);
    } catch (err: any) {
      console.error('Upload error:', err);
      sounds.playRetry();
      setUploadStatus('error');
      setErrorMessage(err.message || 'Lỗi tải video lên. Vui lòng thử lại.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-amber-200/90 space-y-5 my-auto max-h-[94vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-amber-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/25">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-amber-950 font-['Quicksand']">
                  🎥 Tải Video Bài Học Lên Thư Viện
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold border border-orange-200">
                  Lưu trữ lâu dài
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                Video được lưu vĩnh viễn trên Cloud Storage · Tự động bóc tách transcript & bài tập AI
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (uploadStatus === 'uploading' || uploadStatus === 'ai_processing') {
                if (!confirm('Video đang được tải lên và xử lý AI. Không đóng modal để tránh mất tiến trình! Cô có chắc muốn dừng?')) return;
              }
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Không giới hạn số lượng video tải lên */}
        <div className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-950 gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 animate-pulse" />
            <span>
              <strong>Không giới hạn tải video:</strong> Cô có thể đăng tải số lượng video bài học tùy thích để lưu trữ vĩnh viễn và chia sẻ lâu dài cùng đồng nghiệp!
            </span>
          </div>
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-black text-[11px] shrink-0 border border-emerald-300">
            ♾️ Không giới hạn
          </span>
        </div>

        {/* Upload Progress Status Banner (XV-D) */}
        {uploadStatus === 'ready' && createdVideo ? (
          <div className="p-6 bg-gradient-to-b from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-3xl text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-black text-emerald-950 font-['Quicksand']">
                ✅ Video đã tải lên thành công!
              </h3>
              <p className="text-xs text-stone-600 mt-1 font-medium">
                Video <strong>&ldquo;{createdVideo.title}&rdquo;</strong> đã được lưu trữ vĩnh viễn và tạo gói tri thức học tập AI hoàn tất.
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-emerald-200 max-w-md mx-auto flex items-center gap-3 text-left shadow-2xs">
              <img
                src={createdVideo.thumbnailUrl}
                alt={createdVideo.title}
                className="w-18 h-12 object-cover rounded-xl border border-stone-200 shrink-0"
              />
              <div className="overflow-hidden">
                <span className="font-black text-xs text-amber-950 truncate block">
                  {createdVideo.title}
                </span>
                <span className="text-[10px] text-stone-500 block">
                  {createdVideo.topic} · {createdVideo.duration} · {createdVideo.level}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  sounds.playSuccess();
                  onSuccess(createdVideo);
                  onClose();
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>▶ XEM VIDEO</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onSuccess(createdVideo);
                  setUploadStatus('idle');
                  setTitle('');
                  setDescription('');
                  setVideoFile(null);
                  setVideoPreviewUrl('');
                  setVideoBase64('');
                  setCreatedVideo(null);
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-orange-50 text-orange-700 border-2 border-orange-300 font-black text-sm shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>+ Tải tiếp video khác (Không giới hạn)</span>
              </button>
            </div>
          </div>
        ) : (
          uploadStatus !== 'idle' && (
            <div
              className={`p-4 rounded-2xl border transition-all ${
                uploadStatus === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-amber-50/90 border-amber-200 text-amber-950 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-black mb-2 font-['Quicksand']">
                <div className="flex items-center gap-2">
                  {uploadStatus === 'uploading' && (
                    <span className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                  )}
                  {uploadStatus === 'ai_processing' && <Sparkles className="w-4 h-4 text-orange-600 animate-pulse" />}
                  {uploadStatus === 'error' && <AlertCircle className="w-4 h-4 text-rose-600" />}

                  <span>
                    {uploadStatus === 'uploading' && '🎥 Đang tải video lên...'}
                    {uploadStatus === 'ai_processing' && '🤖 Mầm AI đang bóc tách transcript & tạo quiz bài học...'}
                    {uploadStatus === 'error' && (errorMessage || 'Xử lý lỗi')}
                  </span>
                </div>

                <span className="font-mono text-orange-700 text-sm">{uploadPercent}%</span>
              </div>

              {/* Progress Bar (XV-D: ████████░░ 82%) */}
              <div className="w-full h-3 bg-stone-200/90 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    uploadStatus === 'error'
                      ? 'bg-rose-500'
                      : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600'
                  }`}
                  style={{ width: `${Math.max(5, uploadPercent)}%` }}
                />
              </div>

              <p className="text-[10px] text-stone-500 mt-1.5 flex items-center justify-between">
                <span>
                  {uploadStatus === 'uploading'
                    ? 'Vui lòng không đóng cửa sổ này khi thanh tiến trình đang chạy...'
                    : 'Hệ thống đang chuẩn bị tệp và dữ liệu bài học.'}
                </span>
                <span className="font-bold text-orange-700">Tiến trình: {uploadPercent}%</span>
              </p>

              {uploadStatus === 'error' && (
                <div className="mt-2.5 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-3.5 py-1.5 rounded-xl bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-orange-700 cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Thử tải lại</span>
                  </button>
                </div>
              )}
            </div>
          )
        )}

        {/* Video Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Section 1: File Picker / Webcam Record Area */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/90 space-y-3">
            <span className="font-black text-amber-950 block font-['Quicksand'] text-xs sm:text-sm">
              1. Chọn hoặc quay video bài học <span className="text-orange-600">*</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Select File */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-2xl bg-white border border-dashed border-amber-300 hover:border-orange-500 hover:bg-orange-50/30 transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[120px] shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 mb-1.5">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="font-bold text-amber-950">Chọn từ điện thoại / máy tính</span>
                <span className="text-[10px] text-stone-500 mt-0.5">MP4, MOV, WEBM (Tối đa 500MB)</span>
                {videoFile ? (
                  <span className="mt-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    ✓ {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(1)} MB)
                  </span>
                ) : (
                  <span className="mt-1.5 text-[10px] text-orange-700 font-medium">
                    Nhấn vào đây để tải tệp lên
                  </span>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleSelectVideoFile}
                  className="hidden"
                />
              </div>

              {/* Option B: Webcam Record */}
              <div className="p-4 rounded-2xl bg-white border border-dashed border-amber-300 hover:border-orange-500 hover:bg-orange-50/30 transition-all flex flex-col items-center justify-center text-center min-h-[120px] shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 mb-1.5">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="font-bold text-amber-950">Quay video trực tiếp</span>
                <span className="text-[10px] text-stone-500 mt-0.5">Camera máy tính hoặc điện thoại</span>

                {!isRecordingWebcam ? (
                  <button
                    type="button"
                    onClick={startWebcamRecording}
                    className="mt-2 px-3 py-1 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold text-[11px] cursor-pointer"
                  >
                    Bật Camera quay
                  </button>
                ) : (
                  <div className="mt-2 space-y-1">
                    <span className="text-rose-600 font-bold animate-pulse text-[11px] block">
                      ● Đang quay bài học...
                    </span>
                    <button
                      type="button"
                      onClick={stopWebcamRecording}
                      className="px-3 py-1 rounded-xl bg-rose-600 text-white font-bold text-[11px] cursor-pointer shadow-xs"
                    >
                      Dừng & Lưu video
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Option C: Direct Video Link (YouTube, Drive, MP4) */}
            <div className="pt-2 border-t border-amber-200/80">
              <label className="text-[11px] font-bold text-stone-700 flex items-center gap-1.5 mb-1">
                <Globe className="w-3.5 h-3.5 text-orange-600" />
                <span>Hoặc dán liên kết video (YouTube, Google Drive, MP4 trực tuyến):</span>
              </label>
              <input
                type="url"
                value={videoPreviewUrl && !videoFile && !videoBase64 ? videoPreviewUrl : ''}
                onChange={(e) => {
                  setVideoPreviewUrl(e.target.value.trim());
                  setVideoFile(null);
                  setVideoBase64('');
                }}
                placeholder="https://... (Ví dụ link MP4, Google Drive hoặc video chia sẻ)"
                className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-xs text-stone-900 focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            {/* Video Preview Player if chosen */}
            {videoPreviewUrl && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-amber-200 aspect-video max-h-48 mx-auto bg-black shadow-md">
                <video
                  ref={videoElemRef}
                  src={videoPreviewUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>

          {/* Section 2: Thumbnail selector */}
          <div className="p-4 rounded-2xl bg-amber-50/30 border border-amber-200/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-black text-amber-950 block font-['Quicksand'] text-xs">
                2. Hình thu nhỏ (Thumbnail bài học)
              </span>
              <button
                type="button"
                onClick={() => thumbInputRef.current?.click()}
                className="text-[11px] font-bold text-orange-700 hover:text-orange-800 flex items-center gap-1 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Tải ảnh từ máy</span>
              </button>
              <input
                ref={thumbInputRef}
                type="file"
                accept="image/*"
                onChange={handleSelectThumbFile}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {thumbnailPresets.map((pr, idx) => {
                const isSelected = thumbnailPreviewUrl === pr.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setThumbnailPreviewUrl(pr.url);
                    }}
                    className={`relative rounded-xl overflow-hidden border aspect-video cursor-pointer transition-all ${
                      isSelected
                        ? 'ring-2 ring-orange-500 border-orange-500 scale-102 shadow-2xs'
                        : 'border-amber-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={pr.url} alt={pr.label} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-stone-950/70 text-[9px] text-white font-bold py-0.5 text-center truncate px-1">
                      {pr.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Video Metadata Inputs (XVI-B) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Tiêu đề video (Bắt buộc) */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-amber-950 mb-1">
                Tiêu đề video bài học <span className="text-orange-600">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Cách tạo truyện tranh bằng Canva AI cho trẻ 3-4 tuổi"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200 text-xs sm:text-sm font-bold text-amber-950 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            {/* Mô tả video (Bắt buộc) */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-amber-950 mb-1">
                Mô tả nội dung bài học <span className="text-orange-600">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ví dụ: Video hướng dẫn giáo viên tạo truyện tranh bằng AI để sử dụng trong hoạt động kể chuyện và phát triển ngôn ngữ."
                className="w-full px-3.5 py-2 rounded-2xl bg-amber-50/30 border border-amber-200 text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            {/* Chủ đề (Bắt buộc) */}
            <div>
              <label className="block font-bold text-amber-950 mb-1">
                Chủ đề / Công cụ <span className="text-orange-600">*</span>
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200 font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
              >
                {topicsList.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Cấp độ (Bắt buộc) */}
            <div>
              <label className="block font-bold text-amber-950 mb-1">
                Cấp độ bài học <span className="text-orange-600">*</span>
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200 font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
              >
                <option value="Cơ bản">Cơ bản (Dành cho cô mới làm quen AI)</option>
                <option value="Trung bình">Trung bình (Đã biết viết prompt)</option>
                <option value="Nâng cao">Nâng cao (Tích hợp quy trình tự động)</option>
              </select>
            </div>

            {/* Chọn khóa học liên kết */}
            <div>
              <label className="block font-bold text-amber-950 mb-1">
                Khóa học liên kết
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200 font-medium text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer text-xs"
              >
                {coursesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Quyền xem (Privacy - Bắt buộc) */}
            <div>
              <label className="block font-bold text-amber-950 mb-1">
                Quyền riêng tư <span className="text-orange-600">*</span>
              </label>
              <select
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200 font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
              >
                <option value="public">🌐 Công khai (Cộng đồng cả nước xem được)</option>
                <option value="members">👥 Chỉ thành viên đã đăng ký</option>
                <option value="course_only">🎓 Chỉ học viên trong khóa học</option>
                <option value="private">🔒 Riêng tư (Chỉ mình cô xem)</option>
              </select>
            </div>

            {/* Đối tượng người học */}
            <div>
              <label className="block font-bold text-amber-950 mb-1">
                Đối tượng người học
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Ví dụ: Giáo viên Lớp Chồi 4-5 tuổi"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200 font-medium text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            {/* Thẻ từ khóa Tags */}
            <div>
              <label className="block font-bold text-amber-950 mb-1">
                Thẻ từ khóa (Tags)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="CanvaAI, TruyenTranh, NgonNgu, MamNon"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200 font-medium text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            {/* Transcript & Ghi chú giảng viên (cho AI tách tri thức) */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-amber-950 mb-1">
                Ghi chú nội dung / Transcript sơ bộ (AI dùng để tạo quiz & hỏi đáp)
              </label>
              <textarea
                rows={2}
                value={transcriptNotes}
                onChange={(e) => setTranscriptNotes(e.target.value)}
                placeholder="Nhập dàn ý các mốc thời gian cô muốn AI tạo câu hỏi đố và tóm tắt..."
                className="w-full px-3.5 py-2 rounded-2xl bg-amber-50/30 border border-amber-200 text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Lưu vĩnh viễn trên Cloud Storage & Database</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={uploadStatus === 'uploading' || uploadStatus === 'ai_processing'}
                className="px-4 py-2 rounded-2xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer disabled:opacity-50"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={uploadStatus === 'uploading' || uploadStatus === 'ai_processing'}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xs shadow-md shadow-orange-500/25 hover:scale-102 active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>
                  {uploadStatus === 'uploading'
                    ? `Đang tải: ${uploadPercent}%`
                    : uploadStatus === 'ai_processing'
                    ? 'AI đang xử lý...'
                    : '🚀 TẢI VIDEO LÊN'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

function ShieldCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
