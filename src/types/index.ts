export type UserRole = 'teacher' | 'parent' | 'kid' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  school: string;
  ageGroup: string;
  aiInterests: string[];
  aiLevel: 'beginner' | 'intermediate' | 'advanced';
  streakDays: number;
  xp: number;
  badges: string[];
  avatar: string;
  isEmailVerified?: boolean;
  phone?: string;
  bio?: string;
  provider?: 'email' | 'google';
  savedPlans?: LessonPlan[];
  bookmarkedVideoIds?: string[];
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: UserProfile;
  token?: string;
  verificationCode?: string;
  verificationLink?: string;
  resetToken?: string;
  resetCode?: string;
}

export interface LessonObjective {
  knowledge: string[];
  skills: string[];
  attitude: string[];
}

export interface LessonProcedureStep {
  phase: string;
  teacherActivity: string;
  childrenActivity: string;
  guidingQuestions: string[];
}

export interface VocabularyWord {
  word: string;
  ipa?: string;
  meaning: string;
  emoji?: string;
  usage?: string;
}

export interface ClassroomEnglishPhrase {
  phrase?: string;
  en?: string;
  meaning?: string;
  vi?: string;
  bodyLanguage?: string;
}

export interface EnglishIntegration {
  vocabulary: VocabularyWord[];
  classroomEnglish: ClassroomEnglishPhrase[];
  miniGame: string;
}

export interface CornerProposal {
  cornerName: string;
  activityContent: string;
  materials?: string;
}

export interface CornerPreparation {
  corner: string;
  items: string[];
}

export interface LessonPlan {
  id: string;
  title: string;
  lessonType?: string; // 'HOAT_DONG_GOC' | 'HOAT_DONG_HOC' | 'HOAT_DONG_NGOAI_TROI' | 'HOAT_DONG_CHIEU' | 'HOAT_DONG_TRAI_NGHIEM' | string;
  activityName?: string;
  theme?: string; // Chủ đề
  topic?: string; // Đề tài / Nội dung
  ageGroup: string;
  domain: string;
  duration: string;
  teacherName?: string;
  schoolName?: string;
  childrenCount?: number;
  specialRequirements?: string;
  // I. Dự kiến góc chơi (Cho Hoạt động góc)
  cornerProposals?: CornerProposal[];
  // II. Mục tiêu
  objectives: LessonObjective;
  // III. Chuẩn bị
  preparation: {
    general?: string[];
    teacher: string[];
    children: string[];
    byCorner?: CornerPreparation[];
  };
  // IV. Tiến trình hoạt động
  procedure: LessonProcedureStep[];
  englishIntegration?: EnglishIntegration;
  adaptation?: string;
  aiNotice: string;
  createdAt: string;
  isSaved?: boolean;
  appliedCount?: number;
}

export interface FlashcardItem {
  id: number;
  title: string;
  caption: string;
  tag: string;
  image?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TeachingPack {
  id: string;
  packTitle: string;
  ageGroup: string;
  duration: string;
  planOverview: string;
  storyOrPoem: {
    type: string;
    title: string;
    content: string[];
  };
  flashcards: FlashcardItem[];
  quiz: QuizQuestion[];
  game: {
    title: string;
    description: string;
  };
  englishMini: {
    words: { en: string; vi: string; ipa: string }[];
    sentences: { en: string; vi: string }[];
  };
  familyActivity: {
    title: string;
    steps: string[];
  };
}

export interface CourseChapter {
  time: string;
  title: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  videoPlaceholderUrl?: string;
  chapters: CourseChapter[];
  objectives: string[];
  summary: string[];
  promptTemplate: string;
  transcript: string;
  isCompleted?: boolean;
}

export interface Course {
  id: string;
  level: number;
  title: string;
  badge: string;
  description: string;
  lessonsCount: number;
  duration: string;
  progressPercent: number;
  lessons: CourseLesson[];
}

export type ResourceType =
  | 'lesson_plan'
  | 'story'
  | 'poem'
  | 'video'
  | 'flashcard'
  | 'game'
  | 'canva'
  | 'ppt'
  | 'worksheet'
  | 'english';

export interface ResourceItem {
  id: string;
  title: string;
  type: ResourceType;
  ageGroup: string;
  domain: string;
  author: string;
  school?: string;
  views: number;
  downloads: number;
  likes: number;
  isFavorite?: boolean;
  appliedCount: number;
  tags: string[];
  createdAt: string;
  description: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorSchool: string;
  authorAvatar: string;
  timeAgo: string;
  content: string;
  tags: string[];
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  downloadsCount: number;
  appliedCount: number;
  hasApplied?: boolean;
  mediaType?: 'image' | 'video' | 'lesson';
  mediaTitle?: string;
  mediaSnippet?: string;
}

export interface BadgeDetail {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedDate: string;
  unlocked: boolean;
}

export type VideoPrivacy = 'public' | 'members' | 'course_only' | 'private';

export interface VideoChapter {
  id: string;
  time: string;
  seconds: number;
  title: string;
  summary: string;
}

export interface VideoStudyMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'docx' | 'prompt' | 'canva' | 'ppt' | 'other';
  downloadUrl?: string;
  description: string;
}

export interface VideoComment {
  id: string;
  authorName: string;
  authorSchool: string;
  avatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface VideoAIKnowledge {
  transcript: string;
  chapters: VideoChapter[];
  summary: string[];
  keywords: string[];
  studyMaterials: VideoStudyMaterial[];
  quiz: QuizQuestion[];
  suggestedQuestions: string[];
  knowledgeChunks: Array<{ chunkId: string; timestamp: string; content: string }>;
}

export interface VideoProgress {
  currentTime: number;
  percentage: number;
  completed: boolean;
  lastWatchedDate: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  playbackUrl?: string;
  storagePath?: string;
  thumbnailUrl: string;
  duration: string;
  durationSeconds: number;
  topic: string;
  level: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  targetAudience: string;
  tags: string[];
  courseId?: string;
  lessonId?: string;
  privacy: VideoPrivacy;
  authorId: string;
  authorName: string;
  authorSchool: string;
  authorAvatar: string;
  createdAt: string;
  updatedAt: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  views: number;
  learnersCount: number;
  savesCount: number;
  aiQuestionsCount: number;
  userProgress?: VideoProgress;
  aiKnowledge: VideoAIKnowledge;
  comments: VideoComment[];
}
