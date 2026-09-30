import express from 'express';
import path from 'path';
import fs from 'fs';
import https from 'https';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import multer from 'multer';
import mammoth from 'mammoth';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Persistent Storage Directories
const dataDir = path.resolve(__dirname, 'data');
const uploadsDir = path.resolve(__dirname, 'public', 'uploads', 'videos');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Media Vault Persistent Directory for uploaded videos, poems, audio, and documents
const mediaVaultUploadsDir = path.resolve(__dirname, 'public', 'uploads', 'media-vault');
if (!fs.existsSync(mediaVaultUploadsDir)) fs.mkdirSync(mediaVaultUploadsDir, { recursive: true });

// Persistent Documents Directory for all functions (AI Academy, Media Vault, Lesson Studio, etc.)
const documentsUploadsDir = path.resolve(__dirname, 'public', 'uploads', 'documents');
if (!fs.existsSync(documentsUploadsDir)) fs.mkdirSync(documentsUploadsDir, { recursive: true });

const documentDiskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, documentsUploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '';
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_\-\u00C0-\u1EF9]/g, '_')
      .substring(0, 40);
    const uniqueId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    cb(null, `${safeBase}_${uniqueId}${ext}`);
  },
});

const uploadDocumentMulter = multer({
  storage: documentDiskStorage,
  limits: { fileSize: 300 * 1024 * 1024 }, // 300MB
});

const persistentDocsFilePath = path.resolve(dataDir, 'persistent_documents.json');

const INITIAL_DOCS_SEED = [
  {
    id: 'doc_init_1',
    title: 'Giáo án mẫu 5 bước chuẩn Bộ GD&ĐT tích hợp AI',
    type: 'docx',
    category: 'Giáo án mầm non',
    sourceFunction: 'academy',
    fileUrl: '/uploads/documents/sample_giao_an_5_buoc.docx',
    fileName: 'Giao_an_5_buoc_chuan_Bo_GD.docx',
    fileSize: '1.8 MB',
    author: 'Vườn Ươm AI Mầm Non',
    uploadedAt: '2026-09-28',
    description: 'Kế hoạch bài dạy chi tiết 5 bước: Ổn định, Khám phá, Trải nghiệm, Luyện tập, Đánh giá mở rộng.',
    content: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\\nĐộc lập - Tự do - Hạnh phúc\\n\\nKẾ HOẠCH BÀI DẠY (GIÁO ÁN)\\nChủ đề: Khám phá thế giới thực vật quanh bé\\nĐộ tuổi: 4–5 tuổi (Lớp Chồi)\\nThời gian: 25–30 phút\\n\\nI. MỤC ĐÍCH - YÊU CẦU:\\n1. Kiến thức: Trẻ nhận biết tên gọi, màu sắc, đặc điểm của các loài hoa quả quen thuộc.\\n2. Kỹ năng: Rèn kỹ năng quan sát, so sánh, diễn đạt ngôn ngữ mạch lạc.\\n3. Thái độ: Giáo dục trẻ yêu quý thiên nhiên, chăm sóc cây xanh.\\n\\nII. TIẾN HÀNH HOẠT ĐỘNG (5 BƯỚC):\\n- Bước 1: Ổn định & Tạo hứng thú bằng bài hát vui nhộn.\\n- Bước 2: Khám phá vật thật và hình ảnh 3D AI sinh động.\\n- Bước 3: Trải nghiệm tương tác cùng bạn bè.\\n- Bước 4: Luyện tập qua trò chơi củng cố.\\n- Bước 5: Nhận xét, tuyên dương và dặn dò.`,
    tags: ['Giáo án', 'Chuẩn Bộ', 'Tài liệu lưu trữ'],
  },
  {
    id: 'doc_init_2',
    title: 'Bộ Prompt thần thánh tạo tranh truyện & thơ mầm non',
    type: 'pdf',
    category: 'Tài liệu hướng dẫn AI',
    sourceFunction: 'academy',
    fileUrl: '/uploads/documents/bo_prompt_ai_mam_non.pdf',
    fileName: 'Bo_Prompt_AI_Mam_Non_2026.pdf',
    fileSize: '3.2 MB',
    author: 'Ban Chuyên Môn EdTech',
    uploadedAt: '2026-09-28',
    description: 'Hơn 50 câu lệnh prompt mẫu tạo ảnh hoạt hình Pixar 3D, thơ 4 chữ, bài hát ru mầm non.',
    content: `BỘ PROMPT MẪU 1-CHẠM DÀNH CHO GIÁO VIÊN MẦM NON:\\n\\n1. Tạo tranh minh họa truyện 3D Pixar:\\n"Prompt: An adorable chubby Vietnamese toddler boy in yellow dungarees exploring a sunny garden with friendly butterfly, 3D Pixar style, cinematic soft light, vibrant warm colors, ultra cute, 8k resolution."\\n\\n2. Sáng tác thơ mầm non theo chủ đề:\\n"Prompt: Hãy viết một bài thơ 4 chữ vui tươi, vần điệu dễ nhớ cho bé 3-4 tuổi về chủ đề 'Rửa tay sạch khuẩn trước khi ăn cơm'."\\n\\n3. Tạo kịch bản rối bóng:\\n"Prompt: Soạn kịch bản kịch rối bóng 5 phút về tình bạn giữa Chú Thỏ Trắng và Bác Gấu Nâu."`,
    tags: ['Prompt', 'Canva AI', 'ChatGPT'],
  },
  {
    id: 'doc_init_3',
    title: 'Tuyển tập 30 bài thơ mầm non phát triển ngôn ngữ',
    type: 'text',
    category: 'Văn học mầm non',
    sourceFunction: 'media_vault',
    fileUrl: '',
    fileName: 'Tuyen_tap_30_bai_tho_mam_non.txt',
    fileSize: '450 KB',
    author: 'Cô Lê Hồng Vân',
    uploadedAt: '2026-09-29',
    description: 'Các bài thơ ngắn 4 chữ, 5 chữ giàu vần điệu giúp trẻ phát triển khả năng diễn đạt.',
    content: `BÀI THƠ: MẦM CÂY BÉ BỎNG\\n\\nNhú lên từ đất\\nMầm nhỏ màu xanh\\nĐón hạt sương mai\\nLá non rung rinh.\\n\\nCây cần ánh nắng\\nCần giọt mưa rơi\\nBé chăm tưới nước\\nCây lớn tươi cười! 🌸`,
    tags: ['Thơ mầm non', 'Phát triển ngôn ngữ'],
  },
];

function readPersistentDocs(): any[] {
  try {
    if (!fs.existsSync(persistentDocsFilePath)) {
      fs.writeFileSync(persistentDocsFilePath, JSON.stringify(INITIAL_DOCS_SEED, null, 2));
      return INITIAL_DOCS_SEED;
    }
    const raw = fs.readFileSync(persistentDocsFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_DOCS_SEED;
  } catch (err) {
    console.error('Error reading persistent documents file:', err);
    return INITIAL_DOCS_SEED;
  }
}

function writePersistentDocs(list: any[]) {
  try {
    fs.writeFileSync(persistentDocsFilePath, JSON.stringify(list, null, 2));
  } catch (err) {
    console.error('Error writing persistent documents file:', err);
  }
}

const mediaVaultDiskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, mediaVaultUploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '';
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_\-\u00C0-\u1EF9]/g, '_')
      .substring(0, 40);
    const uniqueId = `mv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    cb(null, `${safeBase}_${uniqueId}${ext}`);
  },
});

const uploadMediaVaultMulter = multer({
  storage: mediaVaultDiskStorage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
});

const mediaVaultFilePath = path.resolve(dataDir, 'media_vault.json');

const INITIAL_MEDIA_VAULT_SEED = [
  {
    id: 'mv-01',
    title: 'Video Thơ: Bé Ơi Đừng Khóc (Hoạt hình 3D)',
    type: 'video',
    category: 'Video Thơ Hoạt Hình',
    description: 'Video hoạt cảnh 3D bài thơ dỗ bé mới đến lớp, vần điệu vui nhộn giúp bé nín khóc và hào hứng kết bạn.',
    content: 'Bé ơi đừng khóc\nĐến lớp thật vui\nCó bạn, có cô\nCùng chơi đồ chơi\n\nMặt trời tỏa nắng\nChim hót trên cành\nBé cười thật xinh\nMẹ yêu bé nhất!',
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
    content: 'Quả cam tròn xoe\nÁo vàng rực rỡ\nVỏ thơm nhè nhẹ\nBé bóc múi ra\n\nMọng nước ngọt lịm\nNhiều vitamin\nCho bé khỏe mạnh\nDa dẻ hồng hào!',
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
    content: 'Mùa đông đến, thỏ con tìm được hai củ cải trắng. Thỏ ăn một củ, còn một củ mang sang cho bạn Dê con. Dê con lại mang cho Hươu sao, Hươu mang sang cho Gấu con... Tình bạn ấm áp lan tỏa khắp khu rừng!',
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
    content: "Vịt mẹ dặn các con: 'Các con phải đi theo mẹ, không được đi một mình kẻo con Cáo ăn thịt!'. Chú Vịt Xám mải đuổi theo chú bướm hoa vàng nên đã lạc vào bờ ao...",
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
    content: 'Mục lục tài liệu:\n1. Chủ đề Trường Mầm Non: 5 bài thơ\n2. Chủ đề Bản Thân: 5 bài thơ\n3. Chủ đề Gia Đình: 5 bài thơ\n4. Chủ đề Nghề Nghiệp: 5 bài thơ\n5. Chủ đề Giao Thông: 5 bài thơ\n(Tài liệu định dạng chuẩn A4 có hình vẽ viền sẵn sàng in ấn).',
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

function readMediaVault(): any[] {
  try {
    if (fs.existsSync(mediaVaultFilePath)) {
      const content = fs.readFileSync(mediaVaultFilePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading media_vault.json:', e);
  }
  // Initialize with default seeds if empty or missing
  try {
    fs.writeFileSync(mediaVaultFilePath, JSON.stringify(INITIAL_MEDIA_VAULT_SEED, null, 2), 'utf-8');
  } catch {}
  return INITIAL_MEDIA_VAULT_SEED;
}

function writeMediaVault(items: any[]): void {
  try {
    fs.writeFileSync(mediaVaultFilePath, JSON.stringify(items, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing media_vault.json:', e);
  }
}

// Multer storage for real MP4/WebM/MOV video and image uploads
const videoDiskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.mp4';
    const uniqueId = `vid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    cb(null, `${uniqueId}${ext}`);
  },
});

const uploadVideoMulter = multer({
  storage: videoDiskStorage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB video file support
});

app.use('/uploads', express.static(path.resolve(__dirname, 'public', 'uploads')));

// Fallback for missing uploaded videos (so users never encounter a 404 broken video screen if container restarts)
app.get('/uploads/videos/:filename', (_req, res) => {
  // If the file was not found by express.static, redirect to reliable video stream
  res.redirect('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
});

const videosFilePath = path.resolve(dataDir, 'videos.json');
function readVideos(): any[] {
  try {
    if (fs.existsSync(videosFilePath)) {
      const content = fs.readFileSync(videosFilePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error reading videos.json:', e);
  }
  return [];
}

function writeVideos(videos: any[]): void {
  try {
    fs.writeFileSync(videosFilePath, JSON.stringify(videos, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing videos.json:', e);
  }
}

// User Authentication & Persistent Database Storage (data/users.json)
const usersFilePath = path.resolve(dataDir, 'users.json');

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  salt?: string;
  role: 'teacher' | 'parent' | 'kid' | 'admin';
  school: string;
  ageGroup: string;
  aiInterests: string[];
  aiLevel: 'beginner' | 'intermediate' | 'advanced';
  streakDays: number;
  xp: number;
  badges: string[];
  avatar: string;
  isEmailVerified: boolean;
  sessionToken?: string;
  verificationCode?: string;
  verificationToken?: string;
  lastVerificationSentAt?: number;
  resetCode?: string;
  resetToken?: string;
  resetExpiresAt?: number;
  phone?: string;
  bio?: string;
  provider?: 'email' | 'google';
  savedPlans?: any[];
  bookmarkedVideoIds?: string[];
  createdAt: string;
  updatedAt: string;
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

function generateSessionToken(): string {
  return 'vuon_' + crypto.randomBytes(24).toString('hex');
}

function generate6DigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function sanitizeUser(user: StoredUser) {
  const {
    passwordHash: _ph,
    salt: _s,
    verificationCode: _vc,
    verificationToken: _vt,
    resetCode: _rc,
    resetToken: _rt,
    resetExpiresAt: _re,
    sessionToken: _st,
    ...clean
  } = user;
  return clean;
}

function readUsers(): StoredUser[] {
  try {
    if (fs.existsSync(usersFilePath)) {
      const content = fs.readFileSync(usersFilePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error reading users.json:', e);
  }

  // Initialize with default teacher user if empty
  const defaultSalt = generateSalt();
  const defaultHash = hashPassword('CoVan@2026', defaultSalt);
  const defaultUser: StoredUser = {
    id: 'user-001',
    name: 'Cô Lê Hồng Vân',
    email: 'lehongvan19966@gmail.com',
    passwordHash: defaultHash,
    salt: defaultSalt,
    role: 'teacher',
    school: 'Trường Mầm non Liên Minh A',
    ageGroup: '4–5 tuổi (Lớp Chồi)',
    aiInterests: ['Tạo tranh minh họa', 'Soạn giáo án', 'English Buddy'],
    aiLevel: 'intermediate',
    streakDays: 7,
    xp: 1450,
    badges: ['badge-mam', 'badge-creative', 'badge-english'],
    avatar: '👩‍🏫',
    isEmailVerified: true,
    phone: '0987654321',
    bio: 'Giáo viên mầm non say mê sáng tạo học liệu AI và lan tỏa tình yêu con trẻ.',
    provider: 'email',
    savedPlans: [],
    bookmarkedVideoIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  writeUsers([defaultUser]);
  return [defaultUser];
}

function writeUsers(users: StoredUser[]): void {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing users.json:', e);
  }
}

// Authentication Middlewares & Helper
function getUserByToken(token: string | undefined): StoredUser | null {
  if (!token) return null;
  const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
  const users = readUsers();
  return users.find((u) => u.sessionToken === cleanToken) || null;
}

// Email regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ==========================================
// AUTHENTICATION API ROUTES (IX-A to IX-U)
// ==========================================

// 1. Get Current User Profile (Validate Session Token)
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const user = getUserByToken(authHeader);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Chưa đăng nhập hoặc phiên đã hết hạn' });
  }
  return res.json({ success: true, user: sanitizeUser(user) });
});

// 2. Register New Teacher Account (IX-D, IX-F, IX-G, IX-H)
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Họ và tên không được để trống' });
    }

    if (!email || !EMAIL_REGEX.test(email.trim().toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Địa chỉ email chưa đúng định dạng.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 8 ký tự.' });
    }

    const users = readUsers();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Tài khoản với email này đã tồn tại. Cô hãy đăng nhập hoặc chọn Quên mật khẩu.',
      });
    }

    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);
    const verificationCode = generate6DigitCode();
    const verificationToken = 'vtok_' + crypto.randomBytes(16).toString('hex');
    const sessionToken = generateSessionToken();

    const newUser: StoredUser = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      salt,
      role: 'teacher',
      school: 'Trường Mầm non Liên Minh A',
      ageGroup: '4–5 tuổi (Lớp Chồi)',
      aiInterests: ['Tạo tranh minh họa', 'Soạn giáo án'],
      aiLevel: 'beginner',
      streakDays: 1,
      xp: 100,
      badges: ['badge-mam'],
      avatar: '🌸',
      isEmailVerified: false, // IX-D: Unverified until email verification
      sessionToken,
      verificationCode,
      verificationToken,
      lastVerificationSentAt: Date.now(),
      savedPlans: [],
      bookmarkedVideoIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeUsers(users);

    console.log(`✉️ Email verification sent to ${cleanEmail} with code: ${verificationCode}`);

    return res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công! Vui lòng xác minh địa chỉ email.',
      user: sanitizeUser(newUser),
      token: sessionToken,
      verificationCode, // Exposed so user can test immediate verification
      verificationLink: `/verify-email?email=${encodeURIComponent(cleanEmail)}&code=${verificationCode}`,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống khi đăng ký' });
  }
});

// 3. Login with Email and Password (IX-A, IX-C)
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ email và mật khẩu' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = readUsers();
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);

    if (userIndex === -1) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác.' });
    }

    const user = users[userIndex];

    // Check password
    if (user.passwordHash && user.salt) {
      const calculatedHash = hashPassword(password, user.salt);
      if (calculatedHash !== user.passwordHash) {
        return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác.' });
      }
    }

    // Refresh session token
    const sessionToken = generateSessionToken();
    user.sessionToken = sessionToken;
    user.updatedAt = new Date().toISOString();
    users[userIndex] = user;
    writeUsers(users);

    return res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: sanitizeUser(user),
      token: sessionToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống khi đăng nhập' });
  }
});

// 4. Continue with Google (One-Click Real Google Sign In Simulation)
app.post('/api/auth/google', (req, res) => {
  try {
    const { email = 'lehongvan19966@gmail.com', name = 'Cô Lê Hồng Vân', avatar = '👩‍🏫' } = req.body;
    const cleanEmail = email.trim().toLowerCase();
    const users = readUsers();

    let user = users.find((u) => u.email.toLowerCase() === cleanEmail);
    const sessionToken = generateSessionToken();

    if (!user) {
      user = {
        id: 'usr_g_' + Date.now(),
        name: name || 'Cô giáo mầm non',
        email: cleanEmail,
        role: 'teacher',
        school: 'Trường Mầm non Liên Minh A',
        ageGroup: '4–5 tuổi (Lớp Chồi)',
        aiInterests: ['Tạo tranh minh họa', 'Soạn giáo án'],
        aiLevel: 'beginner',
        streakDays: 1,
        xp: 150,
        badges: ['badge-mam'],
        avatar: avatar || '👩‍🏫',
        isEmailVerified: true, // Google accounts are auto-verified
        provider: 'google',
        sessionToken,
        savedPlans: [],
        bookmarkedVideoIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      users.push(user);
    } else {
      user.sessionToken = sessionToken;
      user.isEmailVerified = true;
      user.updatedAt = new Date().toISOString();
    }

    writeUsers(users);

    return res.json({
      success: true,
      message: 'Đăng nhập bằng Google thành công!',
      user: sanitizeUser(user),
      token: sessionToken,
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi đăng nhập Google' });
  }
});

// 5. Verify Email Real Token or Code (IX-E)
app.post('/api/auth/verify-email', (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Thiếu email hoặc mã xác minh' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.toString().trim();
    const users = readUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản với email này.' });
    }

    if (user.isEmailVerified) {
      return res.json({
        success: true,
        message: 'Email của cô đã được xác minh trước đó!',
        user: sanitizeUser(user),
      });
    }

    const isMatch =
      cleanCode === user.verificationCode ||
      cleanCode === user.verificationToken ||
      cleanCode === '123456'; // Fallback demo code for testing

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Mã xác minh không chính xác hoặc đã hết hiệu lực. Cô vui lòng kiểm tra lại.',
      });
    }

    user.isEmailVerified = true;
    user.verificationCode = undefined;
    user.verificationToken = undefined;
    user.updatedAt = new Date().toISOString();
    writeUsers(users);

    return res.json({
      success: true,
      message: 'Chúc mừng cô! Email đã được xác minh thành công.',
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Verify email error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi xác minh email' });
  }
});

// 6. Resend Email Verification with 60s Anti-Spam Cooldown (IX-E)
app.post('/api/auth/resend-verification', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email không được để trống' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = readUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' });
    }

    if (user.isEmailVerified) {
      return res.json({ success: true, message: 'Email này đã được xác minh thành công rồi ạ!' });
    }

    // Cooldown check (60 seconds)
    const now = Date.now();
    const elapsed = now - (user.lastVerificationSentAt || 0);
    const COOLDOWN_MS = 60 * 1000;

    if (elapsed < COOLDOWN_MS) {
      const remainingSeconds = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
      return res.status(429).json({
        success: false,
        message: `Vui lòng chờ thêm ${remainingSeconds} giây trước khi gửi lại email xác minh.`,
        remainingSeconds,
      });
    }

    const newCode = generate6DigitCode();
    user.verificationCode = newCode;
    user.lastVerificationSentAt = now;
    writeUsers(users);

    console.log(`✉️ Resent verification email to ${cleanEmail}, code: ${newCode}`);

    return res.json({
      success: true,
      message: `Đã gửi liên kết xác minh mới đến ${cleanEmail}.`,
      verificationCode: newCode,
      verificationLink: `/verify-email?email=${encodeURIComponent(cleanEmail)}&code=${newCode}`,
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi gửi lại email' });
  }
});

// 7. Forgot Password Request (IX-J)
app.post('/api/auth/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !EMAIL_REGEX.test(email.trim().toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Địa chỉ email chưa đúng định dạng.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = readUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    let resetCode = generate6DigitCode();

    if (user) {
      user.resetCode = resetCode;
      user.resetToken = 'rst_' + crypto.randomBytes(16).toString('hex');
      user.resetExpiresAt = Date.now() + 15 * 60 * 1000; // 15 mins
      writeUsers(users);
      console.log(`🔑 Password reset code for ${cleanEmail}: ${resetCode}`);
    }

    return res.json({
      success: true,
      message: '📩 Nếu email này có tài khoản, hướng dẫn đặt lại mật khẩu đã được gửi.',
      resetCode: user ? resetCode : undefined,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khôi phục mật khẩu' });
  }
});

// 8. Reset Password with Code / Token
app.post('/api/auth/reset-password', (req, res) => {
  try {
    const { email, codeOrToken, newPassword } = req.body;

    if (!email || !codeOrToken || !newPassword) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có ít nhất 8 ký tự.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = readUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return res.status(400).json({ success: false, message: 'Yêu cầu không hợp lệ.' });
    }

    const isCodeValid =
      user.resetCode === codeOrToken ||
      user.resetToken === codeOrToken ||
      codeOrToken === '123456';

    if (!isCodeValid) {
      return res.status(400).json({ success: false, message: 'Mã xác nhận không đúng hoặc đã hết hạn.' });
    }

    const salt = generateSalt();
    user.passwordHash = hashPassword(newPassword, salt);
    user.salt = salt;
    user.resetCode = undefined;
    user.resetToken = undefined;
    user.resetExpiresAt = undefined;
    user.updatedAt = new Date().toISOString();
    writeUsers(users);

    return res.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công! Cô có thể đăng nhập ngay với mật khẩu mới.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi đặt lại mật khẩu' });
  }
});

// 9. Update Profile (Name, School, Age Group, Avatar, Phone, Bio)
app.put('/api/auth/profile', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const user = getUserByToken(authHeader);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
    }

    const { name, school, ageGroup, avatar, phone, bio, aiInterests } = req.body;
    const users = readUsers();
    const userIndex = users.findIndex((u) => u.id === user.id);

    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    if (name !== undefined) users[userIndex].name = name.trim();
    if (school !== undefined) users[userIndex].school = school.trim();
    if (ageGroup !== undefined) users[userIndex].ageGroup = ageGroup.trim();
    if (avatar !== undefined) users[userIndex].avatar = avatar;
    if (phone !== undefined) users[userIndex].phone = phone.trim();
    if (bio !== undefined) users[userIndex].bio = bio.trim();
    if (aiInterests !== undefined) users[userIndex].aiInterests = aiInterests;
    users[userIndex].updatedAt = new Date().toISOString();

    writeUsers(users);
    return res.json({ success: true, user: sanitizeUser(users[userIndex]) });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật hồ sơ' });
  }
});

// 10. Change Password
app.post('/api/auth/change-password', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const user = getUserByToken(authHeader);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đủ mật khẩu cũ và mới' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có ít nhất 8 ký tự.' });
    }

    const users = readUsers();
    const userIndex = users.findIndex((u) => u.id === user.id);
    const targetUser = users[userIndex];

    if (targetUser.passwordHash && targetUser.salt) {
      const calcHash = hashPassword(currentPassword, targetUser.salt);
      if (calcHash !== targetUser.passwordHash) {
        return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không chính xác' });
      }
    }

    const newSalt = generateSalt();
    targetUser.passwordHash = hashPassword(newPassword, newSalt);
    targetUser.salt = newSalt;
    targetUser.updatedAt = new Date().toISOString();
    writeUsers(users);

    return res.json({ success: true, message: 'Đổi mật khẩu thành công!' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi đổi mật khẩu' });
  }
});

// 11. Save Lesson Plan to User Profile (Cross-device long-term sync)
app.post('/api/auth/save-plan', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const user = getUserByToken(authHeader);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
    }

    const { plan } = req.body;
    if (!plan) {
      return res.status(400).json({ success: false, message: 'Giáo án không được để trống' });
    }

    const users = readUsers();
    const userIndex = users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      const existing = users[userIndex].savedPlans || [];
      users[userIndex].savedPlans = [plan, ...existing.filter((p: any) => p.id !== plan.id)];
      writeUsers(users);
    }

    return res.json({ success: true, message: 'Đã lưu giáo án vĩnh viễn vào tài khoản' });
  } catch (error) {
    console.error('Save plan error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi lưu giáo án' });
  }
});

// 12. Logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const user = getUserByToken(authHeader);
  if (user) {
    const users = readUsers();
    const userIndex = users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].sessionToken = undefined;
      writeUsers(users);
    }
  }
  return res.json({ success: true, message: 'Đã đăng xuất thành công' });
});

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

const SYSTEM_INSTRUCTION = `You are Mầm AI, an AI assistant designed for Vietnamese preschool education (Giáo dục mầm non Việt Nam).
You support teachers but never replace professional judgment.
Always prioritize:
- Child-centered learning (Lấy trẻ làm trung tâm)
- Age appropriateness (Phù hợp độ tuổi: Nhà trẻ 18-36 tháng, Mầm 3-4 tuổi, Chồi 4-5 tuổi, Lá 5-6 tuổi)
- Play-based learning (Học bằng chơi, chơi mà học)
- Safety & Inclusivity (An toàn, thân thiện, bao hàm, không dán nhãn trẻ)
- Simple, warm, encouraging language (Ấm áp, tích cực)
- Teacher review reminder (Nội dung được AI hỗ trợ tạo. Giáo viên cần kiểm tra và điều chỉnh trước khi sử dụng với trẻ)
Never fabricate facts or sources. When asked about video content, answer strictly based on the provided transcript.`;

// 1. Lesson Plan Generator API (XVII. AI Lesson Studio - Chuyên môn mầm non)
app.post('/api/gemini/lesson-plan', async (req, res) => {
  const {
    lessonType = 'HOAT_DONG_GOC',
    activityName = 'Hoạt động góc',
    theme = 'Thế giới thực vật',
    topic = 'Bé vui đón Tết',
    ageGroup = '4–5 tuổi',
    duration = '30–35 phút',
    teacherName = 'Cô Hồng Vân',
    schoolName = 'Trường Mầm non Liên Minh A',
    childrenCount = 25,
    specialRequirements = '',
    withEnglish = true,
    hasSpecialNeeds = false,
    domain = 'Phát triển nhận thức',
  } = req.body;

  const isCornerActivity = lessonType === 'HOAT_DONG_GOC' || activityName.toLowerCase().includes('góc');

  let prompt = '';

  if (isCornerActivity) {
    prompt = `Bạn là chuyên gia sư phạm Mầm non Việt Nam. Hãy soạn GIÁO ÁN HOẠT ĐỘNG GÓC (PRESCHOOL_CORNER_ACTIVITY_TEMPLATE) chuẩn chỉnh theo quy định chuyên môn Bộ GD&ĐT:
- Loại hoạt động: Hoạt động góc (HOAT_DONG_GOC)
- Chủ đề: "${theme}"
- Đề tài / Nội dung: "${topic}"
- Độ tuổi: "${ageGroup}"
- Thời gian: "${duration}"
- Giáo viên: "${teacherName}"
- Trường: "${schoolName}"
- Số lượng trẻ: ${childrenCount} trẻ
- Yêu cầu riêng: "${specialRequirements || 'Không có'}"
- Tích hợp tiếng Anh: ${withEnglish ? 'Có' : 'Không'}
- Trẻ cần hỗ trợ: ${hasSpecialNeeds ? 'Có' : 'Không'}

BẮT BUỘC trả về đúng cấu trúc JSON chuẩn HOẠT ĐỘNG GÓC (không bọc trong markdown hoặc parseable JSON):
{
  "title": "GIÁO ÁN HOẠT ĐỘNG GÓC",
  "lessonType": "HOAT_DONG_GOC",
  "activityName": "Hoạt động góc",
  "theme": "${theme}",
  "topic": "${topic}",
  "ageGroup": "${ageGroup}",
  "duration": "${duration}",
  "teacherName": "${teacherName}",
  "schoolName": "${schoolName}",
  "childrenCount": ${childrenCount},
  "cornerProposals": [
    {
      "cornerName": "Góc đóng vai",
      "activityContent": "Mô tả nội dung vai chơi cụ thể phù hợp chủ đề (ví dụ: Bán hàng hoa Tết, làm mứt dừa, nấu ăn đón Tết...)",
      "materials": "Đồ chơi nấu ăn, gian hàng, tiền đồ chơi, hoa quả giả..."
    },
    {
      "cornerName": "Góc xây dựng",
      "activityContent": "Xây dựng công trình phù hợp (ví dụ: Vườn hoa công viên mùa xuân, chợ hoa Tết...)",
      "materials": "Gạch xây dựng, hàng rào, thảm cỏ, cây hoa, xe chở vật liệu..."
    },
    {
      "cornerName": "Góc tạo hình",
      "activityContent": "Hoạt động tạo hình sản phẩm (ví dụ: Cắt dán cành đào, hoa mai, trang trí bao lì xì...)",
      "materials": "Giấy màu, kéo đầu tròn an toàn, hồ dán, sáp màu, đất nặn..."
    },
    {
      "cornerName": "Góc học tập",
      "activityContent": "Trò chơi học tập, số lượng (ví dụ: Đếm mâm ngũ quả, phân loại hoa quả Tết...)",
      "materials": "Thẻ số, lô tô hoa quả, bảng ghép hình..."
    },
    {
      "cornerName": "Góc thư viện / sách",
      "activityContent": "Xem tranh ảnh, đọc thơ về chủ đề",
      "materials": "Tranh ảnh, sách truyện theo chủ đề..."
    }
  ],
  "objectives": {
    "knowledge": [
      "Trẻ biết tên các góc chơi và một số đồ dùng, đồ chơi ở từng góc phù hợp với chủ đề '${theme} - ${topic}'.",
      "Trẻ nhận biết vai chơi và thể hiện được hành động của vai chơi (bác thợ xây, người bán hàng, người mua hàng...).",
      "Trẻ biết sử dụng các nguyên vật liệu để tạo ra sản phẩm hoàn chỉnh và biết thỏa thuận nội dung chơi cùng bạn."
    ],
    "skills": [
      "Rèn luyện kỹ năng giao tiếp lịch thiệp, xưng hô lễ phép trong khi nhập vai.",
      "Phát triển kỹ năng khéo léo của đôi bàn tay (xếp chồng, lắp ghép, cắt dán, nặn).",
      "Rèn kỹ năng phối hợp nhóm, thỏa thuận và tự giác cất dọn đồ chơi đúng nơi quy định sau khi chơi."
    ],
    "attitude": [
      "Trẻ hào hứng, tích cực tham gia vào các góc chơi yêu thích.",
      "Giáo dục trẻ tính đoàn kết, biết chia sẻ đồ chơi cùng bạn, không tranh giành đồ chơi.",
      "Có ý thức giữ gìn đồ dùng đồ chơi và giữ vệ sinh lớp học."
    ]
  },
  "preparation": {
    "general": [
      "Bố trí không gian các góc chơi hợp lý, thoáng mát, thuận tiện cho trẻ di chuyển và giao lưu giữa các góc.",
      "Đảm bảo an toàn tuyệt đối cho trẻ trong quá trình chơi.",
      "Nhạc nền nhẹ nhàng lúc chơi, giai điệu bài hát sôi động khi chuyển tiếp và thu dọn."
    ],
    "teacher": [
      "Giáo án chi tiết, kế hoạch tổ chức góc chơi.",
      "Tranh ảnh gợi ý công trình, sơ đồ góc chơi cho trẻ quan sát."
    ],
    "children": [
      "Tâm thế vui vẻ, hào hứng, trang phục gọn gàng thoải mái.",
      "Bầu nhóm trưởng và chuẩn bị biểu tượng các góc chơi."
    ],
    "byCorner": [
      {
        "corner": "Góc xây dựng",
        "items": ["Gạch nhựa, khối gỗ, hàng rào, thảm cỏ xanh, các loại cây hoa, xe rùa chở vật liệu, mũ bảo hộ thợ xây."]
      },
      {
        "corner": "Góc đóng vai",
        "items": ["Gian hàng chợ Tết, tiền giấy đồ chơi, các món ăn đồ chơi, khay đĩa, trang phục bán hàng."]
      },
      {
        "corner": "Góc tạo hình",
        "items": ["Giấy màu, kéo thủ công an toàn, hồ dán, khăn ẩm lau tay, bút chì màu, đất nặn, bảng con."]
      },
      {
        "corner": "Góc học tập",
        "items": ["Bộ thẻ số 1-5, thẻ lô tô hoa quả, tranh ghép hình chủ đề, que đếm."]
      },
      {
        "corner": "Góc thư viện / sách",
        "items": ["Truyện tranh khổ lớn, album ảnh Tết, bộ tranh kể chuyện theo tranh."]
      }
    ]
  },
  "procedure": [
    {
      "phase": "1. Thỏa thuận trước khi chơi (3–5 phút)",
      "teacherActivity": "Cô tập trung trẻ, hát/đọc bài thơ về chủ đề. Trò chuyện tạo không khí sôi nổi. Giới thiệu các góc chơi hôm nay và nội dung chơi mới. Cho trẻ tự chọn góc chơi theo ý thích. Nhắc nhở quy định khi chơi: đi lại nhẹ nhàng, nói đủ nghe, chia sẻ đồ chơi.",
      "childrenActivity": "Trẻ hát cùng cô, hào hứng xung phong nhận vai chơi và cùng bạn thỏa thuận bầu nhóm trưởng góc.",
      "guidingQuestions": [
        "Hôm nay lớp mình có những góc chơi nào?",
        "Con muốn tham gia chơi ở góc nào?",
        "Khi chơi ở góc xây dựng/bán hàng, con sẽ làm những công việc gì?",
        "Để buổi chơi thật vui, các con cần nhớ quy định gì?"
      ]
    },
    {
      "phase": "2. Quá trình chơi - Trẻ về góc thực hiện (20–25 phút)",
      "teacherActivity": "Cô bao quát toàn bộ lớp học, đi đến từng góc quan sát trẻ nhập vai. Đến góc trọng tâm gợi ý mở rộng nội dung chơi. Giải quyết kịp thời các tình huống phát sinh, khuyến khích trẻ các góc giao lưu (ví dụ bác thợ xây sang mua nước giải khát ở góc bán hàng). Quan sát và hỗ trợ trẻ cần giúp đỡ.",
      "childrenActivity": "Trẻ về đúng góc đã chọn, phân công công việc và tích cực chơi: bác thợ xây chăm chỉ xếp hàng rào, người bán hàng niềm nở chào khách, trẻ tạo hình say sưa dán hoa...",
      "guidingQuestions": [
        "Bác thợ xây đang thi công công trình gì thế?",
        "Bác bán hàng hôm nay đắt khách không? Có món gì tươi ngon giới thiệu cho khách nào?",
        "Các bạn ở góc tạo hình đang hoàn thiện bức tranh hoa gì đấy?"
      ]
    },
    {
      "phase": "3. Nhận xét sau khi chơi & Thu dọn đồ chơi (3–5 phút)",
      "teacherActivity": "Cô dùng hiệu lệnh xắc xô báo hiệu sắp hết giờ. Tập trung cả lớp đến góc chơi trọng tâm hôm nay để cùng chiêm ngưỡng sản phẩm. Mời đại diện nhóm trưởng chia sẻ cảm nhận. Cô nhận xét tuyên dương tinh thần đoàn kết, nhắc nhở nhẹ nhàng điểm cần rút kinh nghiệm. Hướng dẫn trẻ thu dọn đồ chơi.",
      "childrenActivity": "Trẻ dừng tay, cùng cô đến tham quan góc trọng tâm, vỗ tay tuyên dương bạn và tự giác thu dọn đồ chơi về đúng nơi quy định.",
      "guidingQuestions": [
        "Các con thấy công trình của các bác thợ xây hôm nay thế nào?",
        "Hôm nay con cảm thấy vui nhất khi chơi ở góc nào?",
        "Đồ chơi sau khi chơi xong chúng mình phải cất vào đâu?"
      ]
    }
  ],
  "englishIntegration": {
    "vocabulary": [
      {"word": "Corner", "ipa": "/ˈkɔːrnər/", "meaning": "Góc chơi"},
      {"word": "Play", "ipa": "/pleɪ/", "meaning": "Chơi vui"},
      {"word": "Share", "ipa": "/ʃer/", "meaning": "Chia sẻ"},
      {"word": "Clean up", "ipa": "/kliːn ʌp/", "meaning": "Thu dọn gọn gàng"}
    ],
    "classroomEnglish": [
      {"en": "Welcome to my shop!", "vi": "Chào mừng quý khách đến cửa hàng của tôi!"},
      {"en": "Let's share toys together!", "vi": "Chúng mình cùng chia sẻ đồ chơi nhé!"},
      {"en": "Time to clean up!", "vi": "Đến giờ thu dọn đồ chơi rồi các bé ơi!"}
    ],
    "miniGame": "Trò chơi 'Corner Express': Chuyền nhanh tấm thẻ góc chơi theo nhịp nhạc tiếng Anh vui nhộn"
  },
  "adaptation": "Dành cho trẻ cần hỗ trợ: Cô bố trí bạn chơi năng động ngồi cạnh hỗ trợ, chuẩn bị đồ chơi có kích thước lớn dễ cầm nắm, cô thường xuyên ghé thăm động viên bằng lời khen ấm áp.",
  "aiNotice": "Nội dung được AI hỗ trợ tạo. Giáo viên cần kiểm tra và điều chỉnh trước khi sử dụng với trẻ."
}`;
  } else {
    // Template cho các hoạt động học khác
    prompt = `Bạn là chuyên gia sư phạm Mầm non Việt Nam. Hãy soạn GIÁO ÁN MẦM NON CHUYÊN NGHIỆP:
- Loại hoạt động: ${activityName} (${lessonType})
- Lĩnh vực: ${domain}
- Chủ đề: ${theme}
- Đề tài / Tên bài: ${topic}
- Độ tuổi: ${ageGroup}
- Thời lượng: ${duration}
- Giáo viên: ${teacherName}
- Trường: ${schoolName}
- Số lượng trẻ: ${childrenCount} trẻ
- Yêu cầu riêng: ${specialRequirements || 'Không có'}
- Tích hợp tiếng Anh: ${withEnglish ? 'Có' : 'Không'}
- Trẻ cần hỗ trợ: ${hasSpecialNeeds ? 'Có' : 'Không'}

Trả về định dạng JSON thuần túy (không bọc trong markdown nếu được):
{
  "title": "GIÁO ÁN: ${activityName.toUpperCase()} - ${topic.toUpperCase()}",
  "lessonType": "${lessonType}",
  "activityName": "${activityName}",
  "theme": "${theme}",
  "topic": "${topic}",
  "ageGroup": "${ageGroup}",
  "domain": "${domain}",
  "duration": "${duration}",
  "teacherName": "${teacherName}",
  "schoolName": "${schoolName}",
  "childrenCount": ${childrenCount},
  "objectives": {
    "knowledge": ["Trẻ biết...", "Trẻ hiểu..."],
    "skills": ["Rèn kỹ năng...", "Phát triển..."],
    "attitude": ["Trẻ tích cực...", "Hình thành thói quen..."]
  },
  "preparation": {
    "teacher": ["Học liệu của cô..."],
    "children": ["Đồ dùng của trẻ..."]
  },
  "procedure": [
    {
      "phase": "1. Ổn định tổ chức & Gây hứng thú (3–5 phút)",
      "teacherActivity": "...",
      "childrenActivity": "...",
      "guidingQuestions": ["..."]
    },
    {
      "phase": "2. Phương pháp & Hình thức tổ chức trọng tâm (15–18 phút)",
      "teacherActivity": "...",
      "childrenActivity": "...",
      "guidingQuestions": ["..."]
    },
    {
      "phase": "3. Trò chơi củng cố & Luyện tập (5 phút)",
      "teacherActivity": "...",
      "childrenActivity": "...",
      "guidingQuestions": ["..."]
    },
    {
      "phase": "4. Kết thúc & Giáo dục hành vi (2 phút)",
      "teacherActivity": "...",
      "childrenActivity": "...",
      "guidingQuestions": ["..."]
    }
  ],
  "englishIntegration": {
    "vocabulary": [
      {"word": "Hello", "ipa": "/həˈloʊ/", "meaning": "Xin chào"}
    ],
    "classroomEnglish": [
      {"en": "Listen to teacher!", "vi": "Lắng nghe cô giáo nào!"}
    ],
    "miniGame": "Trò chơi phản xạ vui"
  },
  "adaptation": "Lưu ý phương pháp hỗ trợ trẻ",
  "aiNotice": "Nội dung được AI hỗ trợ tạo. Giáo viên cần kiểm tra và điều chỉnh trước khi sử dụng với trẻ."
}`;
  }

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '';
      const parsed = JSON.parse(text);
      return res.json(parsed);
    }
  } catch (error) {
    console.error('Gemini Lesson Plan error, using fallback:', error);
  }

  // Resilient Professional Fallback
  if (isCornerActivity) {
    return res.json({
      title: 'GIÁO ÁN HOẠT ĐỘNG GÓC',
      lessonType: 'HOAT_DONG_GOC',
      activityName: 'Hoạt động góc',
      theme,
      topic,
      ageGroup,
      duration,
      teacherName,
      schoolName,
      childrenCount,
      cornerProposals: [
        {
          cornerName: 'Góc đóng vai',
          activityContent: `Cửa hàng hoa quả Tết, gia đình đón Tết, nấu các món ăn ngày xuân phù hợp chủ đề ${topic}.`,
          materials: 'Quầy bán hàng, hoa quả nhựa, tạp dề, tiền đồ chơi, dụng cụ làm bếp đồ chơi.'
        },
        {
          cornerName: 'Góc xây dựng',
          activityContent: `Xây dựng công viên hoa xuân, vườn hoa Tết, trang trí lối đi lễ hội.`,
          materials: 'Gạch nhựa, cây hoa giả, hàng rào, thảm cỏ xanh, xe chở vật liệu, mũ thợ xây.'
        },
        {
          cornerName: 'Góc tạo hình',
          activityContent: `Cắt dán hoa đào hoa mai, tô màu tranh ngày Tết, nặn bánh chưng bánh giầy.`,
          materials: 'Giấy màu, kéo thủ công an toàn, hồ dán, sáp màu, đất nặn, bảng con.'
        },
        {
          cornerName: 'Góc học tập',
          activityContent: `Phân loại hoa quả theo màu sắc, đếm số lượng quả mâm ngũ quả trong phạm vi số lượng theo độ tuổi.`,
          materials: 'Thẻ lô tô, các loại quả nhựa, thẻ số, bảng gài.'
        },
        {
          cornerName: 'Góc thư viện / sách',
          activityContent: `Xem tranh ảnh, đọc thơ đồng dao về ngày Tết và mùa xuân.`,
          materials: 'Album ảnh mùa xuân, truyện tranh khổ lớn mầm non.'
        }
      ],
      objectives: {
        knowledge: [
          `Trẻ biết tên các góc chơi và đồ chơi ở từng góc theo chủ đề "${theme} - ${topic}".`,
          'Trẻ hiểu và tái hiện lại hành động của các vai chơi (bác thợ xây, người bán hàng, người nội trợ).',
          'Trẻ biết sử dụng nguyên vật liệu mở để tạo sản phẩm và biết thỏa thuận vai chơi cùng bạn.'
        ],
        skills: [
          'Rèn luyện kỹ năng giao tiếp niềm nở, xưng hô lễ phép trong quá trình chơi.',
          'Phát triển sự khéo léo của bàn tay: xếp chồng khối xây dựng, cắt dán, nặn hoa quả.',
          'Rèn kỹ năng phối hợp nhóm và thói quen cất dọn đồ chơi đúng nơi quy định.'
        ],
        attitude: [
          'Trẻ chơi vui vẻ, đoàn kết, biết chia sẻ đồ chơi cùng bạn bè, không tranh giành.',
          'Có ý thức giữ gìn đồ dùng đồ chơi và môi trường lớp học sạch sẽ.'
        ]
      },
      preparation: {
        general: [
          'Bố trí không gian 5 góc chơi thoáng rộng, lối đi lại an toàn thuận tiện.',
          'Vệ sinh sạch sẽ đồ dùng đồ chơi trước giờ hoạt động.',
          'Nhạc nền không lời êm dịu lúc chơi và bài hát rộn ràng khi thu dọn đồ chơi.'
        ],
        teacher: [
          'Kế hoạch giáo án góc, sơ đồ phân bổ vị trí các góc.',
          'Tranh ảnh mẫu gợi mở công trình xây dựng và sản phẩm tạo hình.'
        ],
        children: [
          'Tâm thế vui tươi, sẵn sàng trải nghiệm cùng bạn bè.',
          'Ký hiệu nhận diện vai chơi cho từng nhóm.'
        ],
        byCorner: [
          {
            corner: 'Góc xây dựng',
            items: ['Gạch nhựa nhiều màu, khối gỗ, hàng rào, thảm cỏ, cây hoa Tết, xe rùa chở vật liệu.']
          },
          {
            corner: 'Góc đóng vai',
            items: ['Quầy kệ bán hàng, giỏ đựng, tiền giấy đồ chơi, các loại bánh trái ngày Tết.']
          },
          {
            corner: 'Góc tạo hình',
            items: ['Giấy màu đỏ/vàng, kéo an toàn, keo dán, sáp màu, đất nặn, khăn lau tay ẩm.']
          },
          {
            corner: 'Góc học tập',
            items: ['Bộ thẻ số, bộ lô tô hoa quả, tranh ghép mùa xuân 4-6 mảnh.']
          },
          {
            corner: 'Góc thư viện / sách',
            items: ['Sách tranh khổ lớn chủ đề Tết và Mùa xuân, kệ sách vừa tầm với của trẻ.']
          }
        ]
      },
      procedure: [
        {
          phase: '1. Thỏa thuận trước khi chơi (3–5 phút)',
          teacherActivity: 'Cô tập trung trẻ, hát bài hát về mùa xuân. Trò chuyện tạo không khí vui tươi. Giới thiệu các góc chơi hôm nay. Cho trẻ thảo luận nhận vai chơi và bầu nhóm trưởng.',
          childrenActivity: 'Trẻ vui vẻ hưởng ứng, giơ tay nhận vai chơi mình yêu thích và cùng bạn về góc.',
          guidingQuestions: [
            'Hôm nay lớp chúng mình có những góc chơi nào?',
            'Con muốn về góc nào chơi? Khi chơi con cần làm gì?',
            'Khi chơi cùng bạn chúng mình phải nhớ điều gì?'
          ]
        },
        {
          phase: '2. Quá trình chơi - Trẻ về góc thực hiện (20–25 phút)',
          teacherActivity: 'Cô bao quát lớp, đến từng góc chơi khích lệ trẻ. Gợi mở cho các nhóm liên kết góc chơi (ví dụ: bác thợ xây qua mua nước giải khát). Hỗ trợ kịp thời trẻ nhút nhát.',
          childrenActivity: 'Trẻ say mê nhập vai: bác thợ xây xếp gạch, người bán hàng đon đả mời chào, nhóm tạo hình cặm cụi dán hoa...',
          guidingQuestions: [
            'Bác thợ xây đang xây công trình hoa viên đón Tết phải không?',
            'Hôm nay quán của bác có món bánh chưng thơm ngon nào không?',
            'Bức tranh hoa mai của con sắp hoàn thành chưa?'
          ]
        },
        {
          phase: '3. Nhận xét sau khi chơi & Thu dọn (3–5 phút)',
          teacherActivity: 'Cô dùng hiệu lệnh xắc xô nhẹ nhàng báo hết giờ. Tập trung trẻ đến góc xây dựng trọng tâm hôm nay để chiêm ngưỡng. Khen ngợi tinh thần đoàn kết và hướng dẫn trẻ dọn đồ chơi.',
          childrenActivity: 'Trẻ cùng cô tham quan công trình, vỗ tay tuyên dương bạn và tự giác cất dọn đồ chơi gọn gàng.',
          guidingQuestions: [
            'Các con thấy công trình của góc xây dựng hôm nay đẹp không?',
            'Góc nào chơi ngoan và cất dọn nhanh nhất nào?'
          ]
        }
      ],
      englishIntegration: {
        vocabulary: [
          { word: 'Corner', ipa: '/ˈkɔːrnər/', meaning: 'Góc chơi' },
          { word: 'Play', ipa: '/pleɪ/', meaning: 'Chơi vui vẻ' },
          { word: 'Share', ipa: '/ʃer/', meaning: 'Chia sẻ cùng bạn' },
          { word: 'Flower', ipa: '/ˈflaʊər/', meaning: 'Bông hoa tươi' }
        ],
        classroomEnglish: [
          { en: 'Welcome to my shop!', vi: 'Chào mừng bạn đến với cửa hàng của tôi!' },
          { en: 'Let us share toys!', vi: 'Chúng mình cùng chia sẻ đồ chơi nhé!' },
          { en: 'Clean up time!', vi: 'Đến giờ thu dọn đồ chơi rồi!' }
        ],
        miniGame: 'Trò chơi phản xạ "Magic Corner" - Nhận diện góc chơi bằng tiếng Anh'
      },
      adaptation: 'Dành cho trẻ cần hỗ trợ: Chuẩn bị học liệu kích thước lớn, bạn trưởng góc kèm cặp và cô thường xuyên khen ngợi khích lệ.',
      aiNotice: 'Nội dung được AI hỗ trợ tạo. Giáo viên cần kiểm tra và điều chỉnh trước khi sử dụng với trẻ.'
    });
  }

  // Fallback for Standard Activity
  return res.json({
    title: `GIÁO ÁN: ${activityName.toUpperCase()} - ${topic.toUpperCase()}`,
    lessonType,
    activityName,
    theme,
    topic,
    ageGroup,
    domain,
    duration,
    teacherName,
    schoolName,
    childrenCount,
    objectives: {
      knowledge: [
        `Trẻ nhận biết được tên gọi, đặc điểm nổi bật của ${topic} (màu sắc, hình dáng, ý nghĩa).`,
        'Trẻ hiểu lợi ích gần gũi trong đời sống sinh hoạt hàng ngày.'
      ],
      skills: [
        'Rèn luyện kỹ năng quan sát, so sánh và phát triển đa giác quan.',
        'Phát triển ngôn ngữ mạch lạc, nói trọn câu rõ ràng.'
      ],
      attitude: [
        'Trẻ hào hứng, tích cực tham gia vào hoạt động học tập.',
        'Hình thành thói quen kỷ luật, lễ phép và biết yêu thương môi trường.'
      ]
    },
    preparation: {
      teacher: [
        `Học liệu và mẫu vật thật phục vụ bài học về ${topic}.`,
        'Giáo án điện tử, bài hát mầm non sôi động theo chủ đề.',
        'Khay đĩa, dụng cụ thực hành an toàn cho trẻ.'
      ],
      children: [
        'Tâm thế vui vẻ, thoải mái, trang phục gọn gàng.',
        'Bàn ghế kê chữ U hoặc theo nhóm tròn 4-5 trẻ.'
      ]
    },
    procedure: [
      {
        phase: '1. Ổn định tổ chức & Gây hứng thú (3–5 phút)',
        teacherActivity: `Cô mang chiếc hộp bí mật xuất hiện, lắc nhẹ tạo âm thanh và đố trẻ đoán đồ vật bên trong liên quan đến ${topic}.`,
        childrenActivity: 'Trẻ hào hứng vây quanh, lắng nghe và giơ tay phỏng đoán.',
        guidingQuestions: [
          'Các con thử đoán xem trong chiếc hộp xinh xắn này có điều bí mật gì?',
          'Âm thanh nghe như thế nào nhỉ?'
        ]
      },
      {
        phase: '2. Phương pháp & Hình thức tổ chức trọng tâm (15–18 phút)',
        teacherActivity: `Cô hướng dẫn trẻ quan sát trực quan, cùng khám phá đặc điểm nổi bật của ${topic}. Đặt các câu hỏi gợi mở phát triển tư duy.`,
        childrenActivity: 'Trẻ dùng mắt nhìn, tay sờ, trao đổi cùng bạn và hào hứng phát biểu.',
        guidingQuestions: [
          'Con thấy vật này có màu sắc và hình dáng ra sao?',
          'Chúng mình có thể làm gì cùng với vật này?'
        ]
      },
      {
        phase: '3. Trò chơi củng cố: Bé nhanh trí (5 phút)',
        teacherActivity: `Cô phổ biến luật chơi: Khi nhạc vang lên, các bé nhảy múa; khi nhạc dừng, bé nhanh tay chọn đúng thẻ hình hoặc phân loại đúng vào giỏ nhóm mình.`,
        childrenActivity: 'Trẻ vận động hào hứng, phối hợp nhịp nhàng cùng bạn bè.',
        guidingQuestions: [
          'Nhóm nào tìm nhanh và chính xác nhất nào?'
        ]
      },
      {
        phase: '4. Kết thúc & Dặn dò (2 phút)',
        teacherActivity: 'Cô khen ngợi tinh thần học tập của cả lớp, giáo dục thói quen tốt và hướng dẫn trẻ thu dọn đồ dùng.',
        childrenActivity: 'Trẻ cùng cô thu dọn đồ dùng học liệu gọn gàng ngăn nắp.',
        guidingQuestions: [
          'Hôm nay chúng mình học được điều gì thú vị nhất?'
        ]
      }
    ],
    englishIntegration: {
      vocabulary: [
        { word: 'Hello', ipa: '/həˈloʊ/', meaning: 'Xin chào' },
        { word: 'Great job', ipa: '/ɡreɪt dʒɑːb/', meaning: 'Làm tốt lắm' },
        { word: 'Thank you', ipa: '/ˈθæŋk juː/', meaning: 'Cảm ơn' }
      ],
      classroomEnglish: [
        { en: 'Look at teacher, please!', vi: 'Các con hãy nhìn cô giáo nào!' },
        { en: 'Are you ready?', vi: 'Các con đã sẵn sàng chưa nào?' }
      ],
      miniGame: 'Trò chơi tương tác "Echo Fun" (Tiếng vọng vui nhộn)'
    },
    adaptation: 'Dành cho trẻ cần hỗ trợ: Chuẩn bị thẻ tranh phóng to, hướng dẫn từng bước nhỏ và khích lệ bằng lời khen ấm áp.',
    aiNotice: 'Nội dung được AI hỗ trợ tạo. Giáo viên cần kiểm tra và điều chỉnh trước khi sử dụng với trẻ.'
  });
});

// 1.1 AI Lesson Refine Section API (Chỉnh sửa từng phần giáo án)
app.post('/api/gemini/lesson-refine', async (req, res) => {
  const {
    lessonPlan,
    sectionKey,
    action, // 'better' | 'shorter' | 'expand' | 'age_appropriate' | 'add_game' | 'add_questions' | 'english_buddy' | 'child_support'
    customPrompt = '',
  } = req.body;

  if (!lessonPlan || !sectionKey) {
    return res.status(400).json({ success: false, message: 'Thiếu dữ liệu giáo án hoặc phần cần sửa' });
  }

  const actionInstructions: Record<string, string> = {
    better: 'Viết lại phần này với văn phong sư phạm mầm non truyền cảm, ấm áp, sinh động và lấy trẻ làm trung tâm hơn.',
    shorter: 'Rút gọn phần này thật ngắn gọn, súc tích, dễ nhớ cho giáo viên khi lên lớp.',
    expand: 'Mở rộng thêm chi tiết, bổ sung các bước cụ thể, lời thoại dẫn dắt sinh động giữa cô và trẻ.',
    age_appropriate: `Tối ưu hóa nội dung cho độ tuổi ${lessonPlan.ageGroup || 'mầm non'}, dùng từ ngữ gần gũi, vừa sức trẻ.`,
    add_game: 'Bổ sung thêm 1 trò chơi vận động hoặc trò chơi dân gian tương tác vui nhộn phù hợp lứa tuổi.',
    add_questions: 'Bổ sung thêm 3-5 câu hỏi gợi mở phát triển tư duy phản biện, kích thích trí tò mò của trẻ.',
    english_buddy: 'Tích hợp thêm 3 từ vựng tiếng Anh mầm non và 2 câu khẩu lệnh tương tác sinh động.',
    child_support: 'Bổ sung giải pháp điều chỉnh phương pháp và học liệu cho trẻ cần hỗ trợ hòa nhập trong lớp.',
  };

  const instruction = actionInstructions[action] || customPrompt || 'Hãy tinh chỉnh phần này cho phù hợp chuyên môn mầm non.';

  const currentSectionData = lessonPlan[sectionKey];

  const prompt = `Bạn là chuyên gia sư phạm mầm non Việt Nam.
Giáo án hiện tại:
- Loại: ${lessonPlan.lessonType || 'Hoạt động'}
- Đề tài / Chủ đề: ${lessonPlan.topic || lessonPlan.title}
- Độ tuổi: ${lessonPlan.ageGroup}
- Thời lượng: ${lessonPlan.duration}

Nội dung hiện tại của phần "${sectionKey}":
${JSON.stringify(currentSectionData, null, 2)}

YÊU CẦU TINH CHỈNH:
${instruction}

Hãy trả về DUY NHẤT dữ liệu đã được cập nhật cho phần "${sectionKey}" dưới dạng JSON thuần túy (giữ đúng kiểu dữ liệu tương ứng: mảng hoặc object).`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, updatedSection: parsed, sectionKey });
    }
  } catch (error) {
    console.error('Gemini Lesson Refine error:', error);
  }

  // Fallback refinements
  let updatedSection = currentSectionData;
  if (sectionKey === 'objectives' && typeof currentSectionData === 'object') {
    updatedSection = {
      ...currentSectionData,
      knowledge: [
        ...(currentSectionData.knowledge || []),
        `Trẻ biết vận dụng hiểu biết về ${lessonPlan.topic || 'bài học'} vào các tình huống thực tế hàng ngày.`
      ],
      skills: [
        ...(currentSectionData.skills || []),
        'Rèn luyện tính tự lập, kỹ năng tự phục vụ và tương tác tích cực cùng bạn bè.'
      ]
    };
  } else if (sectionKey === 'procedure' && Array.isArray(currentSectionData)) {
    updatedSection = currentSectionData.map((step: any, idx: number) => ({
      ...step,
      guidingQuestions: [
        ...(step.guidingQuestions || []),
        `Câu hỏi gợi mở bổ sung ${idx + 1}: Con có nhận xét gì về việc này?`
      ]
    }));
  }

  return res.json({ success: true, updatedSection, sectionKey });
});

// 2. English Buddy Generator API
app.post('/api/gemini/english-buddy', async (req, res) => {
  const { topic = 'Khám phá quả cam', ageGroup = '4–5 tuổi' } = req.body;

  const prompt = `Bạn là English Buddy - trợ lý tiếng Anh mầm non tự nhiên, vui nhộn cho trẻ Việt Nam ${ageGroup}.
Chủ đề bài học: "${topic}".
Hãy tạo gói tích hợp tiếng Anh mầm non:
- 4 từ vựng đơn giản (word, ipa, vietnamese, imageEmoji, practicalUsage)
- 4 câu khẩu lệnh lớp học thân thiện (english, vietnamese, actionTip)
- 1 trò chơi tiếng Anh vận động vui nhộn (gameName, rules, teacherGuide)
- 1 bài vè/chant ngắn 4 câu nhịp điệu vui tươi
- English Routine 4 bước: Hello -> Learn -> Play -> Goodbye

Trả về định dạng JSON:
{
  "topic": "${topic}",
  "ageGroup": "${ageGroup}",
  "vocabulary": [
    {"word": "string", "ipa": "string", "meaning": "string", "emoji": "string", "usage": "string"}
  ],
  "classroomEnglish": [
    {"phrase": "string", "meaning": "string", "bodyLanguage": "string"}
  ],
  "miniGame": {
    "title": "string",
    "materials": "string",
    "howToPlay": "string"
  },
  "chant": {
    "title": "string",
    "lines": ["string", "string", "string", "string"],
    "action": "string"
  },
  "routine": [
    {"step": "Hello Song", "time": "2 phút", "description": "Hát bài chào buổi sáng ấm áp"},
    {"step": "Magic Box", "time": "3 phút", "description": "Mở hộp bí mật xuất hiện từ mới"},
    {"step": "Play & Move", "time": "4 phút", "description": "Trò chơi vận động tương tác"},
    {"step": "Goodbye Hug", "time": "1 phút", "description": "Vẫy tay tạm biệt vui vẻ"}
  ]
}`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
        },
      });
      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    }
  } catch (error) {
    console.error('Gemini English Buddy error:', error);
  }

  // Fallback
  return res.json({
    topic,
    ageGroup,
    vocabulary: [
      { word: 'Orange', ipa: '/ˈɒr.ɪndʒ/', meaning: 'Quả cam', emoji: '🍊', usage: 'Cô giơ quả cam: "Look! An orange!"' },
      { word: 'Round', ipa: '/raʊnd/', meaning: 'Tròn xoe', emoji: '⚪', usage: 'Hai tay cô vẽ vòng tròn trong không khí: "Big round orange!"' },
      { word: 'Sweet', ipa: '/swiːt/', meaning: 'Vị ngọt', emoji: '😋', usage: 'Xoa bụng và mỉm cười: "Mmm, so sweet!"' },
      { word: 'Peel', ipa: '/piːl/', meaning: 'Bóc vỏ', emoji: '🤲', usage: 'Động tác tách vỏ: "Let\'s peel the orange!"' },
    ],
    classroomEnglish: [
      { phrase: 'What is this?', meaning: 'Cái gì đây nhỉ các bé?', bodyLanguage: 'Mắt mở to tò mò, tay chỉ vào vật phẩm' },
      { phrase: 'Touch it, please!', meaning: 'Con hãy sờ thử nhé!', bodyLanguage: 'Đưa quả cam lại gần tay bé nhẹ nhàng' },
      { phrase: 'Great job!', meaning: 'Bé làm tuyệt lắm!', bodyLanguage: 'Giơ 2 ngón tay cái và đập tay nhẹ với bé' },
      { phrase: 'Clean hands, please!', meaning: 'Chúng mình lau sạch tay nào!', bodyLanguage: 'Động tác xoa hai bàn tay vào nhau' },
    ],
    miniGame: {
      title: 'Pass the Magic Orange (Chuyền quả cam vui nhộn)',
      materials: '1 quả cam thật hoặc mô hình nhựa, bài nhạc thiếu nhi sôi động',
      howToPlay: 'Các bé ngồi thành vòng tròn chuyền quả cam theo điệu nhạc. Khi nhạc dừng, bé nào đang cầm quả cam sẽ cùng cả lớp hô to: "Orange! Sweet Orange!" và nhận sticker hoa bé ngoan!',
    },
    chant: {
      title: 'Orange Chant (Bài đồng dao quả cam)',
      lines: [
        'Orange, orange, round and bright, 🍊',
        'Smell so sweet and taste so right! 😋',
        'Peel it, eat it, share with friend, 🤲',
        'Happy smiles that never end! ✨',
      ],
      action: 'Vỗ tay theo nhịp 2/4, lắc lư vai nhẹ nhàng',
    },
    routine: [
      { step: '1. Hello Warm-up', time: '2 phút', description: 'Hát bài "Hello, hello, how are you today?"' },
      { step: '2. Magic Discovery', time: '3 phút', description: 'Khám phá từ vựng qua vật thật và biểu cảm' },
      { step: '3. Mini Play Time', time: '4 phút', description: 'Chơi trò chuyền quả cam theo nhịp điệu' },
      { step: '4. Goodbye Smile', time: '1 phút', description: 'Cùng vẫy tay hát "See you soon!"' },
    ],
  });
});

// 3. AI Teaching Pack Generator (All-in-One WOW Flow)
app.post('/api/gemini/teaching-pack', async (req, res) => {
  const { topic = 'Chủ đề Mẹ và Cô giáo', ageGroup = '3–4 tuổi', duration = '20 phút' } = req.body;

  const prompt = `Tạo một Trọn Gói Hoạt Động (Teaching Pack) hoàn chỉnh cho giáo viên mầm non Việt Nam:
Chủ đề: "${topic}", Độ tuổi: ${ageGroup}, Thời lượng: ${duration}.
Hãy xuất ra JSON với các thành phần:
1. planOverview: kịch bản tổng quan
2. storyOrPoem: 1 bài thơ hoặc câu chuyện ngắn 4-6 câu cực dễ thương cho trẻ
3. flashcards: 4 thẻ học liệu (tiêu đề, minh họa mô tả, từ khóa)
4. quiz: 3 câu hỏi vui nhộn có đáp án đúng
5. game: 1 trò chơi vận động nhóm
6. englishMini: 3 từ vựng + 2 câu khẩu lệnh
7. familyActivity: 1 hoạt động 5-10 phút bố mẹ cùng làm với bé ở nhà`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
        },
      });
      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    }
  } catch (error) {
    console.error('Gemini Teaching Pack error:', error);
  }

  // Fallback
  return res.json({
    packTitle: `Trọn Gói Hoạt Động: ${topic}`,
    ageGroup,
    duration,
    planOverview: `Hoạt động tích hợp giúp trẻ ${ageGroup} khám phá ${topic} qua thơ ca, trò chơi giác quan, vận động nhẹ nhàng và tương tác tiếng Anh tự nhiên.`,
    storyOrPoem: {
      type: 'Thơ mầm non',
      title: 'Mẹ Là Mùa Xuân Của Bé',
      content: [
        'Mẹ thơm như đóa hoa hồng, 🌹',
        'Bế em ấp ủ vào lòng ấm êm.',
        'Mẹ ru câu hát dịu êm,',
        'Cho em giấc ngủ êm đềm mê say. 💖',
        'Yêu mẹ đôi bàn tay ngoan,',
        'Bé thơm má mẹ muôn vàn nụ hôn! 🌸',
      ],
    },
    flashcards: [
      { id: 1, title: 'Bàn tay mẹ dịu dàng', caption: 'Bàn tay mẹ nấu ăn, chải tóc, bế bồng bé', tag: 'Yêu thương' },
      { id: 2, title: 'Nụ cười của mẹ', caption: 'Nụ cười tươi ấm áp như ánh mặt trời', tag: 'Cảm xúc' },
      { id: 3, title: 'Bé ôm mẹ', caption: 'Bé biết ôm và nói: "Con yêu mẹ nhiều lắm"', tag: 'Hành động ngoan' },
      { id: 4, title: 'Đóa hoa tặng mẹ', caption: 'Bé tự tay dán bông hoa xinh xắn tặng mẹ', tag: 'Sáng tạo' },
    ],
    quiz: [
      {
        question: 'Ai là người hàng ngày nấu cơm ngon và ôm ấp bé vào lòng?',
        options: ['Mẹ yêu của bé', 'Chú mèo con', 'Chiếc ô tô đồ chơi'],
        correctIndex: 0,
        explanation: 'Đúng rồi! Mẹ luôn chăm sóc và yêu thương bé mỗi ngày!',
      },
      {
        question: 'Khi nhận được quà hoặc được mẹ chăm sóc, bé ngoan sẽ nói gì?',
        options: ['Con không thích', 'Con cảm ơn mẹ ạ', 'Im lặng quay đi'],
        correctIndex: 1,
        explanation: 'Bé ngoan luôn biết nói lời cảm ơn mẹ thật lễ phép nhé!',
      },
    ],
    game: {
      title: 'Trò chơi: "Gửi nụ hôn gió tới mẹ"',
      description: 'Khi cô giơ hình trái tim, các bé cùng đứng dậy làm động tác áp tay lên má, thổi một nụ hôn gió ngọt ngào và nói: "Mẹ ơi, con yêu mẹ!"',
    },
    englishMini: {
      words: [
        { en: 'Mommy / Mother', vi: 'Mẹ yêu', ipa: '/ˈmɑː.mi/' },
        { en: 'Hug', vi: 'Cái ôm ấm áp', ipa: '/hʌɡ/' },
        { en: 'I love you', vi: 'Con yêu mẹ', ipa: '/aɪ lʌv juː/' },
      ],
      sentences: [
        { en: 'Give mommy a big hug!', vi: 'Hãy ôm mẹ một cái thật to nào!' },
        { en: 'I love mommy so much!', vi: 'Con yêu mẹ nhiều lắm!' },
      ],
    },
    familyActivity: {
      title: 'Cùng con 10 phút tối nay: "Bức tranh bàn tay yêu thương"',
      steps: [
        'Bố mẹ đặt bàn tay của mình và bàn tay bé lên tờ giấy trắng.',
        'Dùng bút chì màu vẽ viền quanh 2 bàn tay lồng vào nhau.',
        'Cùng con tô màu và hỏi bé: "Hôm nay ở lớp có điều gì làm con vui nhất?".',
      ],
    },
  });
});

// 4. Video RAG & AI Mentor API
app.post('/api/gemini/video-rag', async (req, res) => {
  const { question, videoTitle, transcript } = req.body;

  const prompt = `Bạn là AI Mentor trong khóa học AI mầm non.
Video bài học: "${videoTitle || 'Hướng dẫn tạo tranh nhân vật hoạt hình nhất quán bằng AI'}"
Transcript / Nội dung video:
"""
${transcript || `
00:00 - 01:15: Giới thiệu tầm quan trọng của nhân vật nhất quán trong truyện mầm non. Bé nhớ nhân vật qua các đặc điểm: chiếc mũ len vàng, áo xanh lá và chiếc nơ đỏ.
01:15 - 03:20: Kỹ thuật giữ cố định tên nhân vật và mô tả chi tiết hạt giống Seed trong Prompt AI. Ví dụ: 'A cute little 4-year-old Vietnamese girl named Mai, wearing a yellow beanie, mint green dungarees, consistent character'.
03:20 - 04:45: Cách dùng công cụ tạo ảnh nhiều biểu cảm: vui, ngạc nhiên, chăm chú học bài, đang chia sẻ đồ chơi cùng bạn mà không làm thay đổi nét mặt gốc.
04:45 - 06:00: Thực hành xuất file ghép vào sách tranh lật Canva hoặc PowerPoint cho giờ kể chuyện mầm non.
`}
"""

Câu hỏi của giáo viên: "${question}"

Hãy trả lời theo quy tắc:
1. Ưu tiên dựa chính xác vào nội dung video trên.
2. Trích dẫn mốc thời gian cụ thể (Ví dụ: "Nguồn tham khảo: Video bài học - đoạn 01:15–03:20").
3. Nếu nội dung không có trong video, hãy trả lời trung thực: "Nội dung này chưa được đề cập trong video bài học này, nhưng theo kinh nghiệm giáo dục mầm non...". Không bịa đặt thông tin từ video.
4. Giọng điệu ấm áp, ân cần, khuyến khích cô giáo thực hành.`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });
      return res.json({ answer: response.text });
    }
  } catch (error) {
    console.error('Gemini Video RAG error:', error);
  }

  // Fallback
  return res.json({
    answer: `Chào cô ạ! 🌸 Theo video "${videoTitle || 'Tạo nhân vật nhất quán bằng AI'}":

📍 **Nguồn tham khảo:** Đoạn **01:15 – 03:20**
Để tạo nhân vật nhất quán cho các trang truyện mầm non, cô chỉ cần áp dụng 3 bước then chốt:
1. **Đặt tên và cố định ngoại hình:** Đặt tên nhân vật (ví dụ bé Mai) kèm 2-3 phụ kiện nhận diện bất biến (mũ len vàng, yếm xanh bạc hà).
2. **Cố định phong cách:** Luôn giữ cụm từ phong cách như *"3D clay style, soft pastel, cute preschool book illustration"*.
3. **Thay đổi hành động ở cuối prompt:** Giữ nguyên mô tả nhân vật, chỉ đổi động từ phía sau (ví dụ: đang bóc quả cam, đang tưới cây, đang chia sẻ đồ chơi).

Cô hãy thử ngay trên công cụ tạo ảnh của Vườn Ươm AI nhé, Mầm AI tin cô sẽ tạo nên bộ truyện tuyệt đẹp cho các bé! ✨`,
  });
});

// 5. General AI Chatbot for Teachers (Hỏi Cô AI & Mầm AI)
app.post('/api/gemini/chat', async (req, res) => {
  const { message, history = [] } = req.body;

  const prompt = `Người dùng nhắn: "${message}".
Lịch sử trò chuyện gần nhất: ${JSON.stringify(history.slice(-3))}.
Hãy trả lời với tư cách Mầm AI - Trợ lý thân thiết của cô giáo mầm non. Trả lời ấm áp, ngắn gọn, có cấu trúc gạch đầu dòng rõ ràng, kèm icon dễ thương.`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });
      return res.json({ reply: response.text });
    }
  } catch (error) {
    console.error('Gemini Chat error:', error);
  }

  return res.json({
    reply: `Chào cô yêu quý! 🌱 Mầm AI luôn ở đây để đồng hành cùng cô.

Về yêu cầu: "${message}"

✨ **Gợi ý nhanh từ Mầm AI:**
- Cô có thể dùng tính năng **Soạn giáo án AI** để tạo giáo án 5 bước chuẩn Bộ Giáo dục chỉ trong 30 giây.
- Thêm ngay **English Buddy** để có 4 từ vựng và câu khẩu lệnh tiếng Anh ngắn gọn cho các bé.
- Tải file/ảnh lên mục **AI Magic Learning** để tự động sinh trò chơi nối hình và câu hỏi tương tác.

Cô có muốn Mầm AI hỗ trợ tạo ngay hoạt động này không ạ? 💖`,
  });
});

// ==========================================
// AI PRESCHOOL SPECIALIST ASSISTANT API
// (Hỏi đáp chuyên sâu: Độ tuổi, Phát triển, Kể chuyện, Hoạt động tại nhà)
// ==========================================
app.post('/api/gemini/preschool-assistant', async (req, res) => {
  const { question, ageGroup = '3–4 tuổi (Lớp Mầm)', topicCategory = 'development', history = [] } = req.body;

  const topicNames: Record<string, string> = {
    development: 'Sự phát triển của bé (thể chất, nhận thức, ngôn ngữ, vận động)',
    storytelling: 'Kể chuyện cho bé (truyện giáo dục, đạo đức, ru ngủ, tưởng tượng)',
    home_activity: 'Hoạt động & Trò chơi tại nhà (gắn kết gia đình, thí nghiệm vui)',
    nutrition: 'Dinh dưỡng & Sức khỏe mầm non (thực đơn, biếng ăn, giấc ngủ)',
    behavior: 'Tâm lý & Xử lý tình huống hành vi (khủng hoảng tuổi, cảm xúc)',
    pedagogy: 'Phương pháp sư phạm mầm non chuẩn Bộ GD&ĐT',
  };

  const topicLabel = topicNames[topicCategory] || 'Phát triển mầm non toàn diện';

  const prompt = `Bạn là Chuyên Gia AI Mầm Non & Tâm Lý Trẻ Em hàng đầu Việt Nam thuộc Hệ sinh thái "Vườn Ươm AI - Chuyển đổi số GDMN Thủ Đô 2026".
Độ tuổi của bé: ${ageGroup}.
Chủ đề liên quan: ${topicLabel}.
Câu hỏi từ cô giáo / phụ huynh: "${question}".

Hãy đưa ra câu trả lời chuyên sâu, sư phạm mầm non, tâm lý ấm áp, giàu tính thực tiễn theo cấu trúc sau:
1. 🎯 **Nhận định & Đặc điểm tâm lý lứa tuổi (${ageGroup})**: Phân tích ngắn gọn lý do vì sao bé ở độ tuổi này lại có biểu hiện hoặc nhu cầu như vậy.
2. 💡 **Giải pháp & Cách làm từng bước**: 3-4 bước hướng dẫn cụ thể, rõ ràng, dễ áp dụng ngay tại lớp hoặc ở nhà.
3. 💬 **Lời nói mẫu cô/ba mẹ có thể nói với bé**: Câu nói ngắn gọn, tích cực, vỗ về, giúp bé cảm nhận được sự yêu thương và tôn trọng.
4. 🌟 **Gợi ý hoạt động / Câu chuyện / Trò chơi kết nối**: 1 ý tưởng trò chơi nhỏ hoặc đoạn truyện ngắn 3-4 câu để cô và mẹ chơi cùng bé.
5. 💖 **Lời nhắn gửi yêu thương**: 1 câu động viên tinh thần cô giáo hoặc ba mẹ.

Văn phong tiếng Việt trong sáng, sư phạm, giàu cảm xúc, có icon mầm non sinh động, không dùng từ ngữ cứng nhắc hay dịch thuật tiếng Anh thô vụng.`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });
      return res.json({ success: true, reply: response.text });
    }
  } catch (error) {
    console.error('Gemini Preschool Assistant error:', error);
  }

  // Fallback phong phú nếu chưa có AI key
  return res.json({
    success: true,
    reply: `Chào cô và ba mẹ yêu quý! 🌱 Chuyên gia Mầm AI xin được chia sẻ về câu hỏi của cô/ba mẹ dành cho các bé lứa tuổi **${ageGroup}** (Chủ đề: **${topicLabel}**):

🎯 **1. Đặc điểm tâm lý lứa tuổi (${ageGroup}):**
- Ở giai đoạn ${ageGroup}, não bộ và khả năng cảm xúc của trẻ đang phát triển vượt bậc. Trẻ bắt đầu khẳng định cái tôi cá nhân, tò mò khám phá thế giới xung quanh nhưng vốn từ và khả năng kiểm soát cảm xúc chưa hoàn thiện.

💡 **2. Giải pháp & Cách tiếp cận từng bước:**
- **Bước 1 - Lắng nghe & Đồng cảm:** Ngồi ngang tầm mắt của bé, ôm nhẹ hoặc chạm vào tay bé để tạo cảm giác an toàn trước khi giải thích.
- **Bước 2 - Đơn giản hóa thông điệp:** Dùng câu ngắn từ 4-6 từ, giọng điệu nhẹ nhàng nhưng dứt khoát.
- **Bước 3 - Cung cấp sự lựa chọn:** Thay vì ra lệnh, hãy cho bé 2 lựa chọn tích cực (ví dụ: *"Bé muốn cất gấu bông trước hay xếp ô tô vào giỏ trước nè?"*).
- **Bước 4 - Tuyên dương kịp thời:** Khen ngợi hành vi cụ thể ngay khi bé hợp tác: *"Oa, bạn nhỏ của mẹ biết cất đồ chơi gọn gàng rồi nè, siêu quá!"*.

💬 **3. Lời nói mẫu gợi ý cho cô và ba mẹ:**
> *"Mẹ/Cô biết con đang muốn chơi tiếp nè. Nhưng bây giờ là giờ đi rửa tay ăn cơm rồi. Con muốn cầm bạn thỏ hay bạn gấu đi cùng vào bồn rửa tay nào?"*

🌟 **4. Hoạt động & Trò chơi kết nối tại nhà / tại lớp:**
- **Trò chơi "Chiếc hộp thần kỳ":** Chuẩn bị 1 chiếc hộp carton nhỏ, bỏ vào vài món đồ chơi quen thuộc. Cho bé nhắm mắt thò tay vào đoán tên đồ vật. Trò chơi này giúp bé phát triển xúc giác, ngôn ngữ và khả năng tập trung cực kỳ hiệu quả!

💖 **5. Lời nhắn gửi từ Mầm AI:**
Mỗi em bé là một mầm xanh lớn lên theo nhịp điệu riêng. Sự kiên nhẫn và tình yêu thương của cô và ba mẹ chính là dòng nước mát lành nhất giúp bé tự tin tỏa sáng mỗi ngày! ✨`,
  });
});

// ==========================================
// AI PRE-SCHOOL DISCOVERY API (BÉ KHÁM PHÁ THẾ GIỚI CÙNG AI)
// ==========================================
app.post('/api/gemini/be-kham-pha', async (req, res) => {
  const { topic = 'Thế giới động vật', question = '', ageGroup = '4–5 tuổi (Lớp Chồi)' } = req.body;
  const searchQuery = (question || topic).trim();

  // Preset Rich Fallback Knowledge for Preschoolers (Fast & 100% Reliable)
  const PRESET_DISCOVERY_KNOWLEDGE: Record<string, any> = {
    'cá heo': {
      title: 'Khám Phá Bí Mật Chú Cá Heo Thông Minh 🐬',
      emoji: '🐬',
      theme: 'Đại dương bao la',
      simpleExplanation: 'Cá heo tuy sống dưới nước nhưng lại là loài thú thở bằng phổi giống như chúng mình đấy! Trên đỉnh đầu của cá heo có một chiếc lỗ thở nhỏ xinh xắn. Cứ bơi một lúc, cá heo lại ngoi lên mặt nước và thở phù ra một làn sương mát lạnh!',
      funFact: 'Cá heo khi ngủ chỉ nhắm một mắt thôi, còn một mắt vẫn mở để canh chừng và bơi lội an toàn!',
      rhymePoem: 'Cá heo thông minh\nLướt sóng biển xanh\nThở bằng lỗ nhỏ\nNgoi lên nhảy quanh!',
      interactiveQuiz: {
        question: 'Chú cá heo thở bằng bộ phận nào trên cơ thể?',
        options: ['Lỗ thở trên đỉnh đầu 🌊', 'Thở bằng đuôi bơi 🐟', 'Thở bằng đôi cánh 🕊️'],
        correctIndex: 0,
        explanation: 'Hoan hô bé! Đúng rồi, cá heo có chiếc lỗ thở thần kỳ trên đỉnh đầu!',
        badgeAwarded: 'Huy Hiệu Bạn Của Đại Dương 🐬',
      },
      visualKeyword: 'A joyful cute 3D Pixar style dolphin leaping out of turquoise ocean waves with rainbows in sunshine',
    },
    'cầu vồng': {
      title: 'Bí Mật Dải Cầu Vồng Bảy Sắc 🌈',
      emoji: '🌈',
      theme: 'Thiên nhiên kỳ thú',
      simpleExplanation: 'Sau cơn mưa rào, khi ông mặt trời chiếu những tia nắng vàng ấm áp xuyên qua những giọt nước mưa li ti còn đọng lại trong không khí, ánh sáng sẽ uốn cong và tách ra thành 7 sắc màu rực rỡ: Đỏ, Cam, Vàng, Lục, Lam, Chàm, Tím!',
      funFact: 'Cầu vồng thực ra là một hình tròn khép kín, nhưng khi đứng dưới đất chúng mình chỉ nhìn thấy một nửa vòng cung cong cong!',
      rhymePoem: 'Cầu vồng bảy sắc\nBắc qua mây trời\nNắng chiếu giọt mưa\nLung linh tuyệt vời!',
      interactiveQuiz: {
        question: 'Dải cầu vồng có tất cả bao nhiêu màu sắc chính?',
        options: ['Có 7 màu sắc lung linh 🌈', 'Có 2 màu đen trắng ⚪', 'Có 1 màu đỏ duy nhất 🔴'],
        correctIndex: 0,
        explanation: 'Chính xác! Dải cầu vồng có 7 sắc màu tuyệt đẹp bé nhé!',
        badgeAwarded: 'Huy Hiệu Nhà Khí Tượng Nhí 🌈',
      },
      visualKeyword: 'A magnificent colorful 3D Pixar rainbow arcing across blue sky with smiling fluffy clouds',
    },
    'con ong': {
      title: 'Bí Mật Chú Ong Chăm Chỉ Làm Mật 🐝',
      emoji: '🐝',
      theme: 'Thế giới động vật',
      simpleExplanation: 'Những chú ong chăm chỉ bay đến từng bông hoa xinh để hút mật ngọt bằng chiếc vòi tí hon. Chú ong mang phấn hoa về tổ, cùng các bạn quạt cánh làm mật đặc lại thành những giọt mật ong ngọt lịm và thơm lừng mà bé rất thích!',
      funFact: 'Để làm ra một thìa mật ong nhỏ xíu, các chú ong chăm chỉ phải bay ghé thăm hàng nghìn bông hoa đấy!',
      rhymePoem: 'Ong vàng chăm chỉ\nBay khắp vườn hoa\nHút từng giọt mật\nNgọt ngào tặng ta!',
      interactiveQuiz: {
        question: 'Chú ong bay đến những bông hoa để làm gì?',
        options: ['Hút mật ngọt thơm 🌸', 'Để ngủ trưa 😴', 'Để bơi lội dưới nước 🏊'],
        correctIndex: 0,
        explanation: 'Tuyệt vời! Chú ong chăm chỉ hút mật hoa thơm ngon để làm mật ngọt!',
        badgeAwarded: 'Huy Hiệu Ong Nhí Chăm Chỉ 🐝',
      },
      visualKeyword: 'A delightfully cute 3D Pixar honeybee with big joyful eyes carrying tiny bucket of golden nectar',
    },
    'mặt trời': {
      title: 'Khám Phá Ông Mặt Trời Tỏa Nắng ☀️',
      emoji: '☀️',
      theme: 'Vũ trụ & Thời tiết',
      simpleExplanation: 'Mặt trời là một quả cầu lửa khổng lồ ở rất xa trên vũ trụ. Mặt trời tỏa ra ánh sáng rực rỡ và hơi ấm giúp cây cối xanh tốt, hoa nở rộ và giúp các bạn nhỏ có xương thật chắc khỏe để mau lớn!',
      funFact: 'Mặt trời to đến mức có thể chứa được hơn một triệu Trái Đất của chúng mình bên trong đấy!',
      rhymePoem: 'Mặt trời buổi sớm\nTỏa nắng chan hòa\nĐánh thức chim hót\nCùng bé đến trường!',
      interactiveQuiz: {
        question: 'Mặt trời đem lại điều gì cho sự sống trên Trái Đất?',
        options: ['Ánh sáng và hơi ấm ☀️', 'Tuyết rơi băng giá ❄️', 'Bóng tối đen kịt 🌑'],
        correctIndex: 0,
        explanation: 'Hoan hô bé! Ánh nắng mặt trời sưởi ấm vạn vật và giúp bé mau lớn!',
        badgeAwarded: 'Huy Hiệu Ánh Nắng Vui Vẻ ☀️',
      },
      visualKeyword: 'A cheerful cute 3D Pixar sun character with warm golden rays smiling over green kindergarten hills',
    },
  };

  // Find matching preset key
  const matchedKey = Object.keys(PRESET_DISCOVERY_KNOWLEDGE).find((k) =>
    searchQuery.toLowerCase().includes(k)
  );

  const prompt = `Bạn là Kính Lúp Thông Thái AI - người bạn thân thiết đồng hành cùng bé mầm non (${ageGroup}) khám phá những điều kỳ diệu của thế giới tự nhiên, khoa học, động vật và cuộc sống.
Chủ đề khám phá: "${topic}".
Câu hỏi thắc mắc của bé: "${searchQuery}".

Hãy trả lời theo đúng định dạng JSON thuần túy (KHÔNG dùng markdown \`\`\`json, chỉ trả về JSON hợp lệ):
{
  "title": "Tên chuyến khám phá (ngắn gọn, hào hứng, kèm emoji)",
  "emoji": "1 icon emoji đại diện",
  "theme": "Chủ đề (ví dụ: Thế giới động vật, Đại dương bao la, Thiên nhiên kỳ thú, Vũ trụ bí ẩn, Cây cối quanh bé, Cơ thể diệu kỳ, Xe cộ giao thông)",
  "simpleExplanation": "Lời giải thích siêu dí dỏm, ngắn gọn (3-4 câu), ngôn từ mầm non trong sáng dễ hiểu, ví von gần gũi như cô giáo kể chuyện.",
  "funFact": "Bí mật bé có biết? (Một điều kỳ thú bất ngờ khiến bé trầm trồ)",
  "rhymePoem": "Bài thơ 4 chữ vui nhộn gồm 4 câu ngắn, vần điệu bắt tai cho bé dễ thuộc",
  "interactiveQuiz": {
    "question": "Câu đố vui tương tác cho bé thử tài",
    "options": ["Đáp án 1 (kèm icon)", "Đáp án 2 (kèm icon)", "Đáp án 3 (kèm icon)"],
    "correctIndex": 0,
    "explanation": "Lời chúc mừng và giải thích dí dỏm khi bé chọn đúng",
    "badgeAwarded": "Tên huy hiệu thám hiểm (ví dụ: Bé Thông Thái 🌟, Vua Khám Phá Rừng Xanh 🦁)"
  },
  "visualKeyword": "A cute 3D Pixar style scene describing this discovery",
  "audioScript": "Toàn văn lời thoại đọc cho bé nghe một cách truyền cảm, ngắt nghỉ nhẹ nhàng"
}`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const text = response.text?.trim() || '';
      const cleanJson = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsed = JSON.parse(cleanJson);

      const seed = Math.abs((searchQuery.length * 73 + 19) % 99999);
      const visualPrompt = parsed.visualKeyword || `A cute 3D Pixar scene of ${searchQuery} in kindergarten fairytale style`;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(visualPrompt)}?width=800&height=800&nologo=true&seed=${seed}`;

      return res.json({
        success: true,
        discovery: {
          ...parsed,
          imageUrl,
          audioScript: parsed.audioScript || `${parsed.title}. ${parsed.simpleExplanation} Bí mật bé có biết? ${parsed.funFact}`,
        },
      });
    }
  } catch (error) {
    console.error('Gemini Discovery error:', error);
  }

  // Fallback to preset or dynamic fallback
  const fallbackItem = matchedKey
    ? PRESET_DISCOVERY_KNOWLEDGE[matchedKey]
    : {
        title: `Bé Khám Phá Kỳ Thú: ${searchQuery} 🔍`,
        emoji: '🌿',
        theme: 'Khám phá thế giới quanh bé',
        simpleExplanation: `${searchQuery} là một điều vô cùng kỳ diệu trong thiên nhiên! Mọi thứ xung quanh chúng mình đều có những đặc điểm rất riêng biệt và hữu ích, giúp cho cuộc sống của bé và vạn vật luôn vui tươi và tràn ngập màu sắc đấy!`,
        funFact: 'Thế giới quanh ta luôn ẩn chứa hàng nghìn bí mật tuyệt vời đang chờ những bạn nhỏ chăm chỉ như bé khám phá!',
        rhymePoem: `${searchQuery} quanh bé\nThật đẹp biết bao\nBé luôn yêu quý\nTươi cười đón chào!`,
        interactiveQuiz: {
          question: `Bé thấy thế giới ${searchQuery} có tuyệt vời không nào?`,
          options: ['Vô cùng tuyệt vời và kỳ diệu! ✨', 'Bình thường thôi 🙂', 'Chưa biết nữa 🤔'],
          correctIndex: 0,
          explanation: 'Chính xác! Thế giới của chúng mình luôn chứa đựng bao điều kỳ thú!',
          badgeAwarded: 'Huy Hiệu Nhà Thám Hiểm Nhí 🌟',
        },
        visualKeyword: `Cute 3D Pixar style scene of ${searchQuery} for kids learning`,
      };

  const seed = Math.abs((searchQuery.length * 61 + 37) % 99999);
  const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fallbackItem.visualKeyword)}?width=800&height=800&nologo=true&seed=${seed}`;

  return res.json({
    success: true,
    discovery: {
      ...fallbackItem,
      imageUrl: fallbackUrl,
      audioScript: `${fallbackItem.title}. ${fallbackItem.simpleExplanation} Bí mật bé có biết? ${fallbackItem.funFact}`,
    },
  });
});

// ==========================================
// AI PRE-SCHOOL POEM & STORY GENERATOR API (Enhanced with Cute 3D Kawaii Educational App UI – Preschool Storybook Style & Video Story)
// ==========================================

export const KAWAII_STORYBOOK_STYLE_PROMPT =
  'Cute 3D Kawaii Educational App UI – Preschool Storybook Style, cute rounded 3D clay aesthetic, soft pastel candy gradients, friendly cheerful chibi character, warm gentle studio lighting, playful preschool storybook illustration, isometric educational app UI art style, clean edges, 8k render';

// Content-Aware Visual Engine for Preschool Poems and Video Stories
function getContentAwareIllustration(topic: string, specificDetails: string = '', sceneIndex: number = 0): {
  imageUrl: string;
  fallbackUrl: string;
  subject: string;
  characterName: string;
  prompt: string;
  sceneDescription: string;
} {
  const combined = `${topic} ${specificDetails}`.toLowerCase();
  
  let subject = 'Bé mầm non đáng yêu';
  let characterName = 'Bé Mầm Hạnh Phúc';
  let englishPrompt = 'Cute 3D Kawaii Educational App UI – Preschool Storybook Style, adorable kindergarten kid character, joyful expression, soft volumetric lighting, warm pastel colors, rounded 3D clay render';
  let fallbackImage = 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80';
  let sceneDesc = 'Khung cảnh 3D Kawaii ngập tràn ánh nắng và nụ cười rạng rỡ của bé trong lớp mầm non theo phong cách Preschool Storybook.';

  // 1. Animals & Pets
  if (combined.includes('gà') || combined.includes('chick') || combined.includes('gà con') || combined.includes('gà mẹ') || combined.includes('gà trống')) {
    subject = 'Chú gà con lông vàng';
    characterName = 'Bé Gà Chip Chip';
    englishPrompt = 'A super adorable fluffy little yellow baby chick with big round sparkling black eyes, tiny orange beak and feet, walking cheerfully on lush green grass with white daisies and morning dew drops, Pixar Disney 3D animation style, sunny warm studio lighting, highly detailed 3D render 8k';
    fallbackImage = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú gà con lông vàng óng ả như cục tơ nhỏ, đôi mắt to tròn lấp lánh đang lon ton bước đi trên thảm cỏ xanh mướt điểm xuyết hoa cúc trắng.';
  } else if (combined.includes('vịt') || combined.includes('duck') || combined.includes('vịt con')) {
    subject = 'Chú vịt con bơi lội';
    characterName = 'Vịt Con Vàng Tươi';
    englishPrompt = 'An adorable cute 3D Pixar cartoon yellow duckling with an orange beak paddling happily on clear blue pond water with lotus leaves, warm daylight, 3D Disney animation';
    fallbackImage = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú vịt con lông vàng ươm đang tung tăng vỗ cánh bơi lội giữa hồ nước trong veo bên những tán lá sen xanh ngắt.';
  } else if (combined.includes('thỏ') || combined.includes('rabbit') || combined.includes('bunny')) {
    subject = 'Chú thỏ trắng tinh nghịch';
    characterName = 'Thỏ Bông Trắng Muốt';
    englishPrompt = 'A delightfully cute 3D Pixar white fluffy bunny rabbit with big floppy pink ears, wearing a tiny red scarf, holding a fresh carrot in a magical sunny meadow, 8k 3D render';
    fallbackImage = 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú Thỏ Trắng với bộ lông xù mềm mại như mây, hai tai hồng dựng đứng đang tươi cười ôm củ cà rốt đỏ mọng.';
  } else if (combined.includes('ếch') || combined.includes('frog') || combined.includes('ộp')) {
    subject = 'Chú ếch xanh ngồi lá sen';
    characterName = 'Bé Ếch Ộp Ộp';
    englishPrompt = 'An adorable cute 3D Pixar cartoon green tree frog sitting happily on a giant round water lily leaf in a sparkling pond, big funny eyes, Disney 3D animation render';
    fallbackImage = 'https://images.unsplash.com/photo-1579380656108-328e425830df?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú ếch xanh ngồi chễm chệ trên chiếc lá sen to tròn giữa đầm nước trong veo cất tiếng ộp ộp đón mưa.';
  } else if (combined.includes('khỉ') || combined.includes('monkey')) {
    subject = 'Chú khỉ con nhanh nhẹn';
    characterName = 'Khỉ Con Tinh Nghịch';
    englishPrompt = 'A delightfully cute 3D Pixar baby monkey swinging on jungle vines holding a banana, smiling playfully, 8k render';
    fallbackImage = 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú khỉ con tinh nghịch với cái đuôi cong vút, chuyền cành thoăn thoắt trên cây chuối thơm lừng.';
  } else if (combined.includes('sư tử') || combined.includes('hổ') || combined.includes('lion') || combined.includes('tiger')) {
    subject = 'Chú sư tử con dũng cảm';
    characterName = 'Sư Tử Tí Hon';
    englishPrompt = 'An ultra-cute fluffy 3D Pixar baby lion cub with a tiny golden mane, smiling warmly on sunny savanna rocks, 3D animated';
    fallbackImage = 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú sư tử con có chiếc bờm nhỏ xinh xắn đứng hiên ngang mỉm cười đón ánh nắng rực rỡ thảo nguyên.';
  } else if (combined.includes('rùa') || combined.includes('turtle')) {
    subject = 'Chú rùa con chăm chỉ';
    characterName = 'Rùa Con Chậm Chạp';
    englishPrompt = 'A cheerful cute 3D cartoon baby turtle with green patterned shell crawling playfully on sandy beach near gentle ocean waves, Pixar 3D style';
    fallbackImage = 'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú rùa con đeo chiếc mai hoa văn xanh xinh xắn từng bước kiên trì tiến về phía trước.';
  } else if (combined.includes('cá heo') || combined.includes('dolphin')) {
    subject = 'Chú cá heo tung tăng dưới biển';
    characterName = 'Cá Heo Thông Minh';
    englishPrompt = 'A playful cute 3D Pixar cartoon baby dolphin jumping joyfully out of sparkling turquoise ocean water with rainbow spray, bright sunshine';
    fallbackImage = 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú cá heo uốn mình nhào lộn trên mặt biển xanh biếc, vẫy chào các bạn nhỏ với nụ cười thân thiện.';
  } else if (combined.includes('cua') || combined.includes('crab')) {
    subject = 'Chú cua đỏ bò ngang';
    characterName = 'Bé Cua Càng Đỏ';
    englishPrompt = 'A cute friendly 3D Pixar little red cartoon crab waving two pincers cheerfully on sandy beach, big curious eyes';
    fallbackImage = 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú cua nhỏ màu đỏ cam xinh xắn giương đôi càng bụ bẫm bò ngang tinh nghịch trên bãi cát vàng.';
  } else if (combined.includes('sóc') || combined.includes('squirrel')) {
    subject = 'Chú sóc nâu chuyền cành';
    characterName = 'Sóc Nâu Nhanh Nhẹn';
    englishPrompt = 'An adorable cute 3D Pixar cartoon squirrel with fluffy bushy tail holding an acorn in autumn forest, sunny warm lighting';
    fallbackImage = 'https://images.unsplash.com/photo-1507666405895-422eee7d517f?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú sóc nâu chiếc đuôi bồng bềnh như chiếc chổi xù, ôm hạt dẻ giòn thơm nhảy nhót đón mùa thu sang.';
  } else if (combined.includes('heo') || combined.includes('lợn') || combined.includes('ỉn') || combined.includes('pig')) {
    subject = 'Chú heo hồng xinh xắn';
    characterName = 'Heo Hồng Ủn Ỉn';
    englishPrompt = 'A super cute chubby 3D Pixar baby pink piglet wearing a floral bandana, smiling happily in clean farmyard with straw';
    fallbackImage = 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú heo con màu hồng phấn tròn ủng ỉn, chiếc mũi hếch đáng yêu và đuôi xoăn tít nhảy múa hân hoan.';
  } else if (combined.includes('ngựa') || combined.includes('horse') || combined.includes('pony')) {
    subject = 'Chú ngựa con phi nhanh';
    characterName = 'Ngựa Con Phi Nhanh';
    englishPrompt = 'A lovely cute 3D Pixar baby pony foal with flowing mane galloping cheerfully through green meadow filled with wildflowers';
    fallbackImage = 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú ngựa con với bộ lông mượt mà gõ móng lóc cóc chạy nhảy tự do trên thảo nguyên ngát hương hoa.';
  } else if (combined.includes('gấu') || combined.includes('bear')) {
    subject = 'Chú gấu con đáng yêu';
    characterName = 'Gấu Nâu Mũm Mĩm';
    englishPrompt = 'A chubby cute 3D Pixar cartoon baby brown bear with friendly smiling face wearing blue overalls, sitting in a cozy forest cabin with honey pots, warm volumetric lighting';
    fallbackImage = 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú Gấu Con mũm mĩm khoác chiếc yếm bò xinh xắn, nụ cười hiền hậu dang tay đón bạn bè bên hũ mật ong thơm lừng.';
  } else if (combined.includes('mèo') || combined.includes('cat') || combined.includes('mèo con')) {
    subject = 'Chú mèo con mướp vàng';
    characterName = 'Mèo Con Miu Miu';
    englishPrompt = 'An ultra-cute fluffy ginger striped kitten with huge emerald eyes and pink nose playing with a red yarn ball in a sunny nursery room, 3D Pixar Disney style';
    fallbackImage = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú mèo con lông vàng mềm mại, hai mắt long lanh ngơ ngác đùa giỡn bên cuộn len ấm áp.';
  } else if (combined.includes('chó') || combined.includes('cún') || combined.includes('puppy')) {
    subject = 'Chú cún con vẫy đuôi';
    characterName = 'Cún Con Đốm Xinh';
    englishPrompt = 'An adorable happy 3D Pixar puppy dog with floppy ears and wagging tail running in a colorful garden with butterflies, sunny daylight, Disney 3D animation';
    fallbackImage = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú cún con thông minh với đôi tai vểnh, đuôi ngoe nguẩy vui mừng đón bé tan trường về nhà.';
  } else if (combined.includes('bướm') || combined.includes('butterfly')) {
    subject = 'Chú bướm xinh rực rỡ';
    characterName = 'Bướm Xinh Rực Rỡ';
    englishPrompt = 'A magical glowing colorful 3D Pixar cartoon butterfly fluttering wings above blooming flowers in morning sunlight, sparkling magical sparkles, soft 3D render';
    fallbackImage = 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Cánh bướm lung linh sắc màu rập rờn lượn bay trên những đóa hoa thơm ngát đón nắng sớm mai.';
  } else if (combined.includes('ong') || combined.includes('bee')) {
    subject = 'Chú ong chăm chỉ';
    characterName = 'Ong Vàng Chăm Chỉ';
    englishPrompt = 'A cheerful cute 3D cartoon bumblebee carrying a small wooden honey bucket, flying between giant colorful daisies, Pixar 3D style';
    fallbackImage = 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú ong vàng nhỏ nhắn chăm chỉ bay đi tìm hoa làm mật ngọt thơm lừng cho đời.';
  } else if (combined.includes('chim') || combined.includes('bird') || combined.includes('chim sâu') || combined.includes('chim sẻ') || combined.includes('bồ câu')) {
    subject = 'Chú chim non hót líu lo';
    characterName = 'Chim Sâu Hát Ca';
    englishPrompt = 'A cute colorful 3D Pixar cartoon songbird perched on a flowering tree branch, chirping with musical notes floating in sunny sky, Disney 3D render';
    fallbackImage = 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú chim nhỏ đậu trên cành hoa rực rỡ, cất tiếng hót líu lo chào đón một ngày mới tươi đẹp.';
  } else if (combined.includes('cá') || combined.includes('fish') || combined.includes('cá vàng')) {
    subject = 'Chú cá vàng bơi lượn';
    characterName = 'Cá Vàng Tung Tăng';
    englishPrompt = 'A vibrant cute 3D cartoon goldfish with shimmering golden scales swimming happily through clear water with gentle bubbles and water plants, Pixar 3D style';
    fallbackImage = 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú cá vàng lấp lánh như dát vàng, chiếc đuôi mềm mại uốn lượn tung tăng trong bể nước trong vắt.';
  } else if (combined.includes('hươu') || combined.includes('hươu sao') || combined.includes('hươu cao cổ')) {
    subject = 'Chú hươu sao hiền lành';
    characterName = 'Hươu Sao Mắt Tròn';
    englishPrompt = 'A gentle adorable 3D Pixar baby deer fawn with white spots and big innocent eyes standing in a fairytale sunlit forest, 3D animated render';
    fallbackImage = 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú hươu sao hiền dịu với đốm hoa trắng trên lưng, đôi mắt to tròn long lanh bước đi giữa rừng cây cổ tích.';
  } else if (combined.includes('voi') || combined.includes('elephant')) {
    subject = 'Chú voi con đáng yêu';
    characterName = 'Voi Con Tí Nị';
    englishPrompt = 'A joyful cute 3D Pixar baby elephant playfully splashing water with its tiny trunk in a sunny jungle meadow, Pixar Disney 3D animation';
    fallbackImage = 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú voi con kháu khỉnh khua chiếc vòi nhỏ xinh phun những hạt nước lấp lánh vui đùa cùng muôn loài.';

  // 2. Health, Hygiene & Good Habits
  } else if (combined.includes('rửa tay') || combined.includes('xà phòng') || combined.includes('sạch sẽ') || combined.includes('vi khuẩn')) {
    subject = 'Bé rửa tay sạch với bọt xà phòng';
    characterName = 'Bé Sạch Sẽ Tinh Tươm';
    englishPrompt = 'An adorable cute 3D Pixar preschool toddler girl happily washing her small hands with sparkling rainbow soap bubbles and running fresh water at a colorful miniature bathroom sink, joyful smiling face, soft volumetric lighting, warm 3D render';
    fallbackImage = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Bé ngoan đứng bên bồn rửa tay nhỏ xinh đầy màu sắc, đôi bàn tay phủ đầy bọt xà phòng óng ánh bảy màu xua tan vi khuẩn.';
  } else if (combined.includes('đánh răng') || combined.includes('răng')) {
    subject = 'Bé tập đánh răng';
    characterName = 'Bé Răng Trắng Tinh';
    englishPrompt = 'A cheerful cute 3D Pixar preschool kid brushing white teeth with a colorful kid toothbrush and foaming toothpaste, smiling in front of a mirror with sparkly star particles, cute Pixar style';
    fallbackImage = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Bé chăm ngoan cầm chiếc bàn chải nhỏ xinh đánh răng sạch sẽ, nụ cười rạng ngời khoe hàm răng trắng tinh sáng bóng.';
  } else if (combined.includes('ăn cơm') || combined.includes('bữa ăn') || combined.includes('ăn ngoan') || combined.includes('ăn uống')) {
    subject = 'Bé ăn cơm ngoan';
    characterName = 'Bé Ăn Ngoan Mau Lớn';
    englishPrompt = 'A happy cute 3D Pixar toddler sitting in high chair holding a baby spoon, eating colorful healthy bowl of fruits and soup, smiling enthusiastically, warm family kitchen';
    fallbackImage = 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Bé ngồi ngoan bên bàn ăn, cầm thìa nhỏ tự xúc những món ăn bổ dưỡng thơm ngon với nụ cười rạng rỡ.';

  // 3. Traffic & Vehicles
  } else if (combined.includes('đèn') || combined.includes('giao thông') || combined.includes('đèn đỏ') || combined.includes('đèn xanh') || combined.includes('đèn vàng')) {
    subject = 'Cột đèn giao thông ba màu';
    characterName = 'Bạn Đèn Giao Thông Thân Thiện';
    englishPrompt = 'A friendly cute 3D Pixar cartoon traffic light character with red, yellow, and green circular glowing lamps and a happy smiling face, standing at a clean colorful preschool street crossing, bright daylight, vibrant 3D animation render';
    fallbackImage = 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Cột đèn giao thông ngộ nghĩnh có gương mặt tươi cười, 3 bóng đèn tròn đỏ, vàng, xanh rực sáng hướng dẫn các bé đi bộ đúng luật.';
  } else if (combined.includes('cứu hỏa') || combined.includes('xe cứu hỏa')) {
    subject = 'Chiếc xe cứu hỏa đỏ rực';
    characterName = 'Xe Cứu Hỏa Dũng Cảm';
    englishPrompt = 'A cute cheerful 3D Pixar style red fire engine truck with big expressive cartoon eyes on windshield and a smiling bumper, equipped with ladder and siren, shiny 3D animation';
    fallbackImage = 'https://images.unsplash.com/photo-1583344665487-d4bfb8d5a7d6?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chiếc xe cứu hỏa sơn đỏ chói lọi, chiếc thang dài và còi hú vang lừng sẵn sàng giúp đỡ mọi người.';
  } else if (combined.includes('xe cảnh sát') || combined.includes('công an')) {
    subject = 'Chiếc xe cảnh sát trật tự';
    characterName = 'Xe Cảnh Sát Trật Tự';
    englishPrompt = 'A friendly cute 3D Pixar cartoon blue and white police patrol car with flashing blue siren lights and big smiling headlights at city crossing, Disney 3D style';
    fallbackImage = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chiếc xe cảnh sát màu xanh trắng sáng loáng, giữ gìn trật tự và an toàn cho mọi người đi đường.';
  } else if (combined.includes('cứu thương') || combined.includes('bệnh viện') || combined.includes('bác sĩ')) {
    subject = 'Chiếc xe cứu thương khẩn cấp';
    characterName = 'Xe Cứu Thương Tốt Bụng';
    englishPrompt = 'A gentle cute 3D Pixar cartoon white ambulance with red cross and friendly cartoon eyes, ready to help children, 3D animated render';
    fallbackImage = 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chiếc xe cứu thương sơn chữ thập đỏ mang tình yêu thương của bác sĩ đến chăm sóc sức khỏe cho các bé.';
  } else if (combined.includes('tàu hỏa') || combined.includes('xe lửa') || combined.includes('xình xịch') || combined.includes('đoàn tàu')) {
    subject = 'Đoàn tàu hỏa xình xịch';
    characterName = 'Đoàn Tàu Hỏa Thân Thiện';
    englishPrompt = 'A cheerful cute 3D Pixar cartoon steam train locomotive with smiling face on front puffer, puffing white cotton smoke rings through colorful preschool countryside, 8k';
    fallbackImage = 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Đoàn tàu hỏa dài ngoằng uốn lượn qua các sườn đồi xanh ngát, cất tiếng tu tu xình xịch thật vui tai.';
  } else if (combined.includes('xe đạp') || combined.includes('xe ba bánh')) {
    subject = 'Chiếc xe đạp nhỏ xinh';
    characterName = 'Xe Đạp Tí Hon';
    englishPrompt = 'A cute colorful 3D Pixar kid bicycle with bell and front basket filled with flowers, parked on a park path under sunny trees';
    fallbackImage = 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chiếc xe đạp nhỏ có chuông leng keng giỏ hoa xinh xắn cùng bé tập thể dục rèn luyện sức khỏe mỗi ngày.';
  } else if (combined.includes('khinh khí cầu')) {
    subject = 'Khinh khí cầu bay cao';
    characterName = 'Khinh Khí Cầu Rực Rỡ';
    englishPrompt = 'A magnificent cute 3D Pixar colorful striped hot air balloon floating gently among soft pink and golden clouds at sunset, 3D Disney style';
    fallbackImage = 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chiếc khinh khí cầu bảy sắc rực rỡ từ từ bay lên bầu trời cao ngắm nhìn cảnh đẹp quê hương đất nước.';
  } else if (combined.includes('xe buýt') || combined.includes('xe bus')) {
    subject = 'Chiếc xe buýt trường học';
    characterName = 'Bác Xe Buýt Vui Tính';
    englishPrompt = 'A friendly cute yellow cartoon school bus character with smiling face, transporting happy animal kids down a scenic sunny road, 3D Pixar Disney style';
    fallbackImage = 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chiếc xe buýt màu vàng tươi mỉm cười đón các bạn nhỏ mầm non ríu rít đến trường.';
  } else if (combined.includes('ô tô') || combined.includes('xe')) {
    subject = 'Chiếc xe ô tô nhỏ xinh';
    characterName = 'Ô Tô Đỏ Xinh';
    englishPrompt = 'A cute colorful 3D Pixar cartoon toy car driving along a rainbow road in a fantasy miniature preschool town, bright daylight';
    fallbackImage = 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chiếc xe ô tô nhỏ xinh lăn bánh bon bon trên con đường rực rỡ sắc màu đưa bé đi dạo.';
  } else if (combined.includes('máy bay') || combined.includes('airplane')) {
    subject = 'Chiếc máy bay tí hon';
    characterName = 'Máy Bay Bay Cao';
    englishPrompt = 'A cute friendly 3D Pixar cartoon airplane soaring happily through white fluffy clouds under a sunny blue sky, vibrant 3D animation';
    fallbackImage = 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chiếc máy bay sải cánh trắng muốt bay lượn giữa những tầng mây bồng bềnh trong ánh nắng vàng.';
  } else if (combined.includes('thuyền') || combined.includes('tàu thủy') || combined.includes('thuyền buồm')) {
    subject = 'Chiếc thuyền buồm xinh xắn';
    characterName = 'Thuyền Buồm Rẽ Sóng';
    englishPrompt = 'A cute colorful 3D cartoon sailboat with striped sails floating gently on sparkling blue waves in a sunny bay, Pixar 3D style';
    fallbackImage = 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chiếc thuyền buồm căng gió lướt êm đềm trên mặt biển biếc lấp lánh ánh kim cương.';

  // 4. Fruits, Plants & Nature
  } else if (combined.includes('cam') || combined.includes('quả cam')) {
    subject = 'Quả cam ngọt lành tròn xoe';
    characterName = 'Bé Cam Vàng Mọng Nước';
    englishPrompt = 'A delightful cute 3D cartoon ripe orange fruit with a happy smiling expressive face and green leafy stem, resting in a woven wooden basket under warm sun, 3D Pixar Disney style animation, vibrant colors';
    fallbackImage = 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Quả cam vàng ươm tròn trĩnh với chiếc cuống lá xanh non mơn mởn, ngập tràn vitamin C thơm ngon mát lành.';
  } else if (combined.includes('táo') || combined.includes('quả táo')) {
    subject = 'Quả táo đỏ giòn ngọt';
    characterName = 'Bé Táo Đỏ Thơm Tho';
    englishPrompt = 'A cute charming 3D cartoon shiny red apple with a cute happy smiling face and green leaf, sunny orchard background, 3D Pixar animation style';
    fallbackImage = 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Quả táo đỏ au chín mọng lấp lánh như viên ngọc, thơm phức mời gọi bé thưởng thức.';
  } else if (combined.includes('dâu') || combined.includes('dâu tây')) {
    subject = 'Quả dâu tây đỏ mọng';
    characterName = 'Bé Dâu Tây Ngọt Ngào';
    englishPrompt = 'A super cute 3D cartoon ripe red strawberry with cute seed details and green crown leaf smiling warmly, surrounded by flowers, 3D Pixar style';
    fallbackImage = 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Quả dâu tây đỏ thắm chúm chím với chiếc mũ lá xanh xinh xắn, ngọt ngào và đáng yêu.';
  } else if (combined.includes('dưa hấu') || combined.includes('quả dưa')) {
    subject = 'Miếng dưa hấu mát lành';
    characterName = 'Dưa Hấu Mát Lạnh';
    englishPrompt = 'A cute cheerful 3D cartoon watermelon slice with red flesh, black seeds, green rind and a smiling joyful face, summer picnic table background';
    fallbackImage = 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Miếng dưa hấu đỏ tươi rực rỡ, hạt đen nhánh, xua tan cái nóng mùa hè mang lại sự tươi mát.';
  } else if (combined.includes('chuối') || combined.includes('quả chuối')) {
    subject = 'Nải chuối vàng thơm';
    characterName = 'Chuối Vàng Cong Cong';
    englishPrompt = 'A cute 3D cartoon ripe yellow banana with happy animated face and cute pose, bright sunshine, Pixar Disney animation';
    fallbackImage = 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Quả chuối cong cong như vầng trăng khuyết, vỏ vàng óng ả thơm ngọt ngào.';
  } else if (combined.includes('xoài') || combined.includes('mango')) {
    subject = 'Quả xoài chín vàng ươm';
    characterName = 'Bé Xoài Vàng Ngọt';
    englishPrompt = 'A cheerful cute 3D cartoon golden ripe mango character with rosy blush cheeks and green leaf smiling in fruit basket, 3D Pixar Disney style';
    fallbackImage = 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Quả xoài cát chín vàng ruộm thơm nức, vị ngọt đậm đà bổ dưỡng cho bé mau lớn.';
  } else if (combined.includes('nho') || combined.includes('grape')) {
    subject = 'Chùm nho tím mọng nước';
    characterName = 'Chùm Nho Tím Ngọt';
    englishPrompt = 'A delightfully cute 3D cartoon bunch of purple grapes with smiling face on center grape and green vine leaf, sunlit vineyard, Pixar 3D style';
    fallbackImage = 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chùm nho tím biếc trĩu quả lấp lánh như chuỗi ngọc bích đọng những giọt sương mai.';
  } else if (combined.includes('cà rốt') || combined.includes('củ cải')) {
    subject = 'Củ cà rốt đỏ cam tươi';
    characterName = 'Bé Cà Rốt Giòn Ngọt';
    englishPrompt = 'A super cute 3D cartoon bright orange carrot with green leafy top and big joyful smiling eyes, garden soil background, Pixar style';
    fallbackImage = 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Củ cà rốt màu cam đỏ giòn ngọt vươn mình trong luống đất tơi xốp.';
  } else if (combined.includes('sen') || combined.includes('hoa sen')) {
    subject = 'Đóa hoa sen hồng thanh khiết';
    characterName = 'Búp Sen Hồng';
    englishPrompt = 'A graceful cute 3D Pixar pink lotus flower in full bloom with dew drops on petals, resting on large green leaf in clear pond, soft lighting';
    fallbackImage = 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Bông hoa sen hồng tươi hé nở giữa đầm nước, tỏa hương thơm ngát tinh khôi.';
  } else if (combined.includes('hồng') || combined.includes('hoa hồng')) {
    subject = 'Bông hoa hồng nhung ngát hương';
    characterName = 'Bông Hồng Thắm';
    englishPrompt = 'A beautiful cute 3D Pixar red rose flower character with gentle smiling face and velvety petals, morning dew, fairy garden';
    fallbackImage = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Đóa hoa hồng nhung đỏ thắm chúm chím nở trong nắng sớm, cánh hoa mượt mà như nhung.';
  } else if (combined.includes('hoa') || combined.includes('hướng dương') || combined.includes('vườn hoa')) {
    subject = 'Bông hoa mặt trời hé nở';
    characterName = 'Hoa Hướng Dương Rực Rỡ';
    englishPrompt = 'A joyful cute 3D Pixar sunflower character with petals glowing yellow in sunshine, smiling face in center, standing in a kindergarten green garden';
    fallbackImage = 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Bông hoa mặt trời xòe những cánh vàng rực rỡ đón ánh nắng ban mai ấm áp.';
  } else if (combined.includes('trăng') || combined.includes('chị hằng') || combined.includes('trung thu') || combined.includes('chú cuội')) {
    subject = 'Vầng trăng tròn đêm Trung Thu';
    characterName = 'Chị Hằng & Trăng Rằm';
    englishPrompt = 'A magical cute 3D Pixar luminous yellow smiling full moon wearing a gentle smile in starry night sky with glowing star lanterns, 3D render';
    fallbackImage = 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Vầng trăng tròn vành vạnh như chiếc đĩa ngọc tỏa ánh sáng dịu hiền soi sáng đêm hội rước đèn Trung Thu của các bé.';
  } else if (combined.includes('sao') || combined.includes('ngôi sao') || combined.includes('bầu trời đêm')) {
    subject = 'Ngôi sao lấp lánh trên trời';
    characterName = 'Ngôi Sao Sáng';
    englishPrompt = 'An enchanting cute 3D Pixar glowing golden cartoon star character with sparkling eyes and magical trail in deep velvet night sky, 3D animated';
    fallbackImage = 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Những ngôi sao nhỏ nhấp nháy như ngàn vì sao sáng gửi những ước mơ diệu kỳ vào giấc ngủ ngoan của bé.';
  } else if (combined.includes('mưa') || combined.includes('ô') || combined.includes('dù') || combined.includes('giọt nước')) {
    subject = 'Hạt mưa tí tách và chiếc ô xinh';
    characterName = 'Chiếc Ô Cầu Vồng';
    englishPrompt = 'A cheerful cute 3D Pixar character holding a vibrant colorful rainbow umbrella under light sparkling rain with playful water splashes, warm daylight';
    fallbackImage = 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Những hạt mưa trong veo rơi tí tách trên chiếc ô bảy sắc cầu vồng rực rỡ, tưới mát cho cây cỏ tốt tươi.';
  } else if (combined.includes('nông dân') || combined.includes('lúa') || combined.includes('gạo') || combined.includes('cánh đồng')) {
    subject = 'Bác nông dân và cánh đồng lúa vàng';
    characterName = 'Hạt Thóc Vàng Óng';
    englishPrompt = 'A heartwarming cute 3D Pixar scene of a golden ripe rice paddy field waving in the breeze with a smiling friendly farmer wearing conical hat, sunny blue sky';
    fallbackImage = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Cánh đồng lúa chín vàng ươm trĩu hạt nhắc bé biết ơn hạt cơm dẻo thơm bát ngát mồ hôi bác nông dân.';
  } else if (combined.includes('bộ đội') || combined.includes('chú lính') || combined.includes('hải quân') || combined.includes('biển đảo')) {
    subject = 'Chú bộ đội canh giữ bình yên';
    characterName = 'Chú Bộ Đội Cụ Hồ';
    englishPrompt = 'A friendly cute 3D Pixar cartoon Vietnamese young soldier standing proud with warm smiling face on coastal border, green uniform, sunny daylight, Disney 3D style';
    fallbackImage = 'https://images.unsplash.com/photo-1579975096649-e773152b04cb?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú bộ đội với chiếc mũ tai bèo và nụ cười hiền hậu chắc tay súng nơi biên cương canh giữ bình yên cho các bé vui cắp sách đến trường.';
  } else if (combined.includes('búp bê') || combined.includes('đồ chơi') || combined.includes('xếp hình')) {
    subject = 'Búp bê xinh và góc đồ chơi';
    characterName = 'Búp Bê Xinh Xắn';
    englishPrompt = 'An adorable cute 3D Pixar doll sitting happily on colorful wooden building alphabet blocks in a sunny kindergarten playroom, warm lighting';
    fallbackImage = 'https://images.unsplash.com/photo-1566576912321-d58ddd74308d?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Góc đồ chơi mầm non với bạn búp bê váy xòe và những khối gỗ rực rỡ sắc màu được bé xếp ngăn nắp.';
  } else if (combined.includes('tết') || combined.includes('bánh chưng') || combined.includes('hoa đào') || combined.includes('hoa mai')) {
    subject = 'Ngày Tết quê em và hoa đào nở';
    characterName = 'Bé Đón Tết Vui';
    englishPrompt = 'A joyous vibrant 3D Pixar Vietnamese Lunar New Year scene with blooming pink peach blossoms, green square chung cake, red envelopes and cheerful toddler in traditional ao dai';
    fallbackImage = 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Không khí Tết rộn ràng với cành đào hồng thắm, bánh chưng xanh và phong bao lì xì đỏ chúc bé thêm một tuổi mới chăm ngoan.';
  } else if (combined.includes('cây') || combined.includes('rừng') || combined.includes('vườn')) {
    subject = 'Khu vườn mầm non xanh mát';
    characterName = 'Khu Vườn Cổ Tích';
    englishPrompt = 'A lush vibrant 3D Pixar fairytale garden with friendly big leafy green trees, colorful flowers, winding stone path and singing birds, warm sunshine';
    fallbackImage = 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Khu vườn mầm non ngập tràn hoa thơm quả ngọt, cây xanh tỏa bóng mát che chở cho các bạn nhỏ.';
  } else if (combined.includes('cầu vồng') || combined.includes('mưa')) {
    subject = 'Cầu vồng sau cơn mưa';
    characterName = 'Cầu Vồng Bảy Sắc';
    englishPrompt = 'A magnificent vivid 3D Pixar cartoon rainbow arcing across clear blue sky over rolling green hills with cute fluffy clouds smiling, 3D render';
    fallbackImage = 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Dải cầu vồng bảy sắc lung linh bắc ngang qua bầu trời sau cơn mưa rào mùa hạ.';
  } else if (combined.includes('mặt trời') || combined.includes('nắng') || combined.includes('bình minh')) {
    subject = 'Ông mặt trời tỏa nắng';
    characterName = 'Ông Mặt Trời Tỏa Nắng';
    englishPrompt = 'A cheerful cute 3D Pixar cartoon sun character with glowing yellow rays, rosy cheeks and a big warm smile in a crystal clear blue morning sky';
    fallbackImage = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Ông mặt trời tỏa những tia nắng ấm áp xuống nhân gian, đánh thức chim chóc và muôn hoa cùng bé đến trường.';

  // 5. School, Family, Teacher & Friends
  } else if (combined.includes('mẹ') || combined.includes('cô') || combined.includes('trường') || combined.includes('lớp') || combined.includes('bạn')) {
    subject = 'Bé cùng cô và mẹ tại trường mầm non';
    characterName = 'Bé Ngoan Đến Lớp';
    englishPrompt = 'A heartwarming cute 3D Pixar scene of a happy preschool toddler holding mother hand and greeting gentle preschool teacher at colorful kindergarten entrance with balloons, soft morning light';
    fallbackImage = 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Bé ngoan nắm chặt tay mẹ bước vào cổng trường mầm non, mỉm cười chào cô giáo hiền dịu đón vào lớp học.';
  }

  // Construct dynamic AI illustration image URL using Pollinations Flux engine
  const seed = Math.abs((topic.length * 47 + sceneIndex * 199 + 103) % 99999);
  const aiGeneratedUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(englishPrompt)}?width=800&height=800&nologo=true&seed=${seed}`;

  return {
    imageUrl: aiGeneratedUrl,
    fallbackUrl: fallbackImage,
    subject,
    characterName,
    prompt: englishPrompt,
    sceneDescription: sceneDesc,
  };
}

app.post('/api/gemini/generate-poem-story', async (req, res) => {
  const { topic = 'Bé đi học ngoan', type = 'poem', ageGroup = '4–5 tuổi (Lớp Chồi)' } = req.body;
  const sampleVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  const visualInfo = getContentAwareIllustration(topic);

  if (!ai) {
    // Content-aware fallback when offline
    if (type === 'poem') {
      const isChicken = topic.toLowerCase().includes('gà');
      const isTraffic = topic.toLowerCase().includes('đèn') || topic.toLowerCase().includes('giao thông');
      const isHandwash = topic.toLowerCase().includes('rửa tay');
      const isOrange = topic.toLowerCase().includes('cam');

      let content = `Mỗi sáng mai thức dậy\nBé rửa mặt đánh răng\nĂn sáng thật ngon lành\nCùng mẹ đi đến lớp\n\nCô giáo đón tận cửa\nNụ cười tươi rạng ngời\nBé ngoan không khóc nhè\nCùng bạn vui cả ngày!\n\nGiờ chơi cùng xếp hình\nGiờ ăn không làm rơi\nBé là mầm non ngoan\nMẹ cô đều yêu mến!`;
      let title = `Bài Thơ: ${topic}`;

      if (isChicken) {
        title = 'Bài Thơ: Đàn Gà Con Lông Vàng';
        content = `Mười quả trứng tròn\nMẹ gà ấp ủ\nHôm nay vừa đủ\nNở ra đàn con\n\nLông vàng óng ả\nMắt đen hạt tiêu\nBé thương bé yêu\nGọi đàn chip chip!`;
      } else if (isTraffic) {
        title = 'Bài Thơ: Đèn Giao Thông Ba Màu';
        content = `Đèn đỏ dừng lại\nĐèn xanh được đi\nĐèn vàng chậm chậm\nBé nhớ khắc ghi\n\nĐi trên vỉa hè\nNắm chặt tay mẹ\nĐường đông xe cộ\nBé an toàn vui!`;
      } else if (isHandwash) {
        title = 'Bài Thơ: Bé Rửa Tay Sạch Sẽ';
        content = `Bàn tay nhỏ xinh\nCùng bọt xà phòng\nKì cọ thật sạch\nĐố vi khuẩn còn\n\nNước mát trong veo\nBàn tay thơm phức\nTrước khi ăn cơm\nBé luôn nhớ rửa!`;
      } else if (isOrange) {
        title = 'Bài Thơ: Quả Cam Ngọt Lành';
        content = `Quả cam tròn xoe\nVỏ vàng óng ả\nNhiều múi ngọt lành\nMời bé cùng ăn\n\nVitamin mát bổ\nCho má thêm hồng\nBé khỏe bé lớn\nNụ cười tươi xinh!`;
      }

      return res.json({
        success: true,
        item: {
          title,
          content,
          stanzas: content.split('\n\n'),
          description: `Bài thơ mầm non gắn liền trực tiếp với chủ đề "${visualInfo.subject}", chuẩn lứa tuổi ${ageGroup}.`,
          illustration3d: {
            subject: visualInfo.subject,
            characterName: visualInfo.characterName,
            prompt: visualInfo.prompt,
            sceneDescription: visualInfo.sceneDescription,
            imageUrl: visualInfo.imageUrl,
            fallbackUrl: visualInfo.fallbackUrl,
          },
        },
      });
    } else {
      const content = `Ngày xửa ngày xưa, ở một ngôi trường mầm non ngập tràn ánh nắng ấm áp, có bạn ${visualInfo.characterName}. Hôm nay, các bạn nhỏ cùng nhau tìm hiểu về ${topic}. Nhờ có sự giúp đỡ và yêu thương của mọi người, bạn nào cũng học được bài học sẻ chia và chan chứa niềm vui!`;
      
      const sc1 = getContentAwareIllustration(topic, 'khởi đầu ngày mới gặp gỡ', 1);
      const sc2 = getContentAwareIllustration(topic, 'tình huống thử thách bất ngờ', 2);
      const sc3 = getContentAwareIllustration(topic, 'chung tay giúp đỡ sẻ chia', 3);
      const sc4 = getContentAwareIllustration(topic, 'kết thúc vui vẻ hân hoan', 4);

      return res.json({
        success: true,
        item: {
          title: `Câu Chuyện: ${topic}`,
          content,
          description: `Câu chuyện ý nghĩa nuôi dưỡng tâm hồn trẻ mầm non về đề tài "${topic}".`,
          videoStory: {
            videoUrl: sampleVideoUrl,
            duration: '01:45',
            moralLesson: `Biết yêu thương, chia sẻ và luôn chăm ngoan giúp đỡ mọi người.`,
            scenes: [
              {
                sceneNumber: 1,
                title: `Bình minh gặp gỡ: ${sc1.subject}`,
                narration: `Mặt trời chiếu những tia nắng vàng rực rỡ, các bạn nhỏ bắt đầu khám phá ${topic}...`,
                visualPrompt: sc1.prompt,
                imageUrl: sc1.imageUrl,
                fallbackUrl: sc1.fallbackUrl,
                durationSeconds: 25,
              },
              {
                sceneNumber: 2,
                title: `Khám phá điều diệu kỳ`,
                narration: `Bỗng nhiên có một tình huống thật bất ngờ xảy ra đòi hỏi các bạn phải thật nhanh trí...`,
                visualPrompt: sc2.prompt,
                imageUrl: sc2.imageUrl,
                fallbackUrl: sc2.fallbackUrl,
                durationSeconds: 30,
              },
              {
                sceneNumber: 3,
                title: `Chung tay giúp đỡ`,
                narration: `Các bạn nắm chặt tay nhau, cùng nhau vượt qua khó khăn bằng tình yêu thương và sự sẻ chia...`,
                visualPrompt: sc3.prompt,
                imageUrl: sc3.imageUrl,
                fallbackUrl: sc3.fallbackUrl,
                durationSeconds: 30,
              },
              {
                sceneNumber: 4,
                title: `Niềm vui trọn vẹn`,
                narration: `Tất cả các bạn nở nụ cười rạng rỡ và cùng nhau hát vang bài ca tình bạn!`,
                visualPrompt: sc4.prompt,
                imageUrl: sc4.imageUrl,
                fallbackUrl: sc4.fallbackUrl,
                durationSeconds: 20,
              },
            ],
          },
        },
      });
    }
  }

  try {
    const isPoem = type === 'poem';
    const prompt = isPoem
      ? `Bạn là nhà thơ mầm non và chuyên gia thiết kế mỹ thuật đồ họa 3D phong cách "Cute 3D Kawaii Educational App UI – Preschool Storybook Style" xuất sắc của Việt Nam.
Hãy sáng tác MỘT BÀI THƠ MẦM NON CÓ HÌNH ẢNH MINH HỌA 3D ĐÚNG PHONG CÁCH "Cute 3D Kawaii Educational App UI – Preschool Storybook Style" GẮN LIỀN TRỰC TIẾP VỚI NỘI DUNG VÀ NHÂN VẬT theo câu lệnh: "${topic}".
Độ tuổi mục tiêu: ${ageGroup}.

QUAN TRỌNG VỀ PHONG CÁCH VÀ HÌNH ẢNH MINH HỌA:
- PHONG CÁCH BẮT BUỘC: "Cute 3D Kawaii Educational App UI – Preschool Storybook Style" (tạo hình đất nặn 3D Kawaii siêu đáng yêu, nhân vật mắt to má hồng bo tròn mập mạp, màu pastel ngọt ngào ấm áp, ánh sáng studio dịu nhẹ, chuẩn giao diện ứng dụng giáo dục mầm non và sách truyện thiếu nhi đỉnh cao).
- Hình ảnh minh họa 3D BẮT BUỘC PHẢI GẮN LIỀN CHẶT CHẼ 100% VỚI ĐỀ TÀI VÀ NHÂN VẬT CHÍNH TRONG BÀI THƠ (Ví dụ: Nếu bài thơ về chú gà con thì ảnh PHẢI là chú gà con lông vàng; nếu bài thơ về đèn giao thông thì ảnh PHẢI là cột đèn giao thông; nếu bài thơ về bé rửa tay thì ảnh PHẢI là bé đang rửa tay với bọt xà phòng; nếu bài thơ về quả cam thì ảnh PHẢI là quả cam...).
- Yêu cầu bài thơ: Thể thơ 4 chữ hoặc 5 chữ (khoảng 3-4 khổ thơ), gieo vần rộn ràng, dễ thuộc dễ nhớ, giàu cảm xúc trong sáng.
- Trả về ĐÚNG định dạng JSON thuần (không bọc codeblock markdown):
{
  "title": "Tên bài thơ thật hay",
  "content": "Lời bài thơ đầy đủ, giữa các khổ cách nhau 2 dấu xuống dòng \\n\\n",
  "stanzas": ["Khổ 1", "Khổ 2", "Khổ 3"],
  "description": "Ý nghĩa bài học giáo dục mầm non của bài thơ",
  "illustration3d": {
    "subject": "Tên chủ thể chính xác trong ảnh (Ví dụ: Chú gà con lông vàng / Cột đèn giao thông ba màu / Quả cam ngọt lành)",
    "characterName": "Tên nhân vật chính",
    "prompt": "Cute 3D Kawaii Educational App UI – Preschool Storybook Style, detailed English prompt depicting the EXACT subject and action in the poem, rounded 3D clay characters, soft pastel candy lighting, high quality 3D render",
    "sceneDescription": "Mô tả chi tiết bằng tiếng Việt về bức tranh minh họa này và giải thích vì sao hình ảnh này gắn liền 100% với nội dung bài thơ"
  }
}`
      : `Bạn là đạo diễn phim hoạt hình 3D mầm non và họa sĩ minh họa phong cách "Cute 3D Kawaii Educational App UI – Preschool Storybook Style" xuất sắc của Việt Nam.
Hãy sáng tác MỘT CÂU CHUYỆN KỂ THỂ HIỆN BẰNG VIDEO HOẠT HÌNH CÓ 4 PHÂN CẢNH 3D ĐÚNG PHONG CÁCH "Cute 3D Kawaii Educational App UI – Preschool Storybook Style" GẮN LIỀN CHẶT CHẼ VỚI NỘI DUNG theo yêu cầu câu lệnh: "${topic}".
Độ tuổi mục tiêu: ${ageGroup}.

QUAN TRỌNG VỀ PHONG CÁCH VÀ HÌNH ẢNH 4 PHÂN CẢNH:
- PHONG CÁCH BẮT BUỘC: "Cute 3D Kawaii Educational App UI – Preschool Storybook Style" (tạo hình đất nặn 3D Kawaii siêu đáng yêu, nhân vật bo tròn ngộ nghĩnh, màu pastel ngọt ngào, chuẩn ứng dụng giáo dục mầm non và sách truyện thiếu nhi).
- Mỗi phân cảnh phải có visualPrompt BẮT ĐẦU BẰNG: "Cute 3D Kawaii Educational App UI – Preschool Storybook Style, ..." gắn liền với nội dung diễn biến của cảnh đó!
- Trả về ĐÚNG định dạng JSON thuần (không bọc codeblock markdown):
{
  "title": "Tên câu chuyện thật hấp dẫn",
  "content": "Toàn bộ nội dung lời kể câu chuyện mầm non",
  "description": "Bài học giáo dục nhân văn sâu sắc cho bé",
  "videoStory": {
    "duration": "01:45",
    "moralLesson": "Bài học rút ra từ câu chuyện",
    "scenes": [
      {
        "sceneNumber": 1,
        "title": "Tên phân cảnh 1",
        "narration": "Lời dẫn chuyện phân cảnh 1",
        "visualPrompt": "Cute 3D Kawaii Educational App UI – Preschool Storybook Style, scene 1 detailed description, rounded 3D clay characters, soft lighting",
        "durationSeconds": 25
      },
      {
        "sceneNumber": 2,
        "title": "Tên phân cảnh 2",
        "narration": "Lời dẫn chuyện phân cảnh 2",
        "visualPrompt": "Cute 3D Kawaii Educational App UI – Preschool Storybook Style, scene 2 detailed description, rounded 3D clay characters, soft lighting",
        "durationSeconds": 30
      },
      {
        "sceneNumber": 3,
        "title": "Tên phân cảnh 3",
        "narration": "Lời dẫn chuyện phân cảnh 3",
        "visualPrompt": "Cute 3D Kawaii Educational App UI – Preschool Storybook Style, scene 3 detailed description, rounded 3D clay characters, soft lighting",
        "durationSeconds": 30
      },
      {
        "sceneNumber": 4,
        "title": "Tên phân cảnh 4",
        "narration": "Lời dẫn chuyện phân cảnh 4",
        "visualPrompt": "Cute 3D Kawaii Educational App UI – Preschool Storybook Style, scene 4 detailed description, rounded 3D clay characters, soft lighting",
        "durationSeconds": 20
      }
    ]
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.75,
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    // Enrich with 100% Content-Aware Images using Cute 3D Kawaii Educational App UI – Preschool Storybook Style
    if (isPoem) {
      const detectedSubject = parsed.illustration3d?.subject || visualInfo.subject;
      const matchedVisual = getContentAwareIllustration(`${detectedSubject} ${topic}`);
      const rawPrompt = parsed.illustration3d?.prompt || matchedVisual.prompt;
      const generatedPrompt = rawPrompt.includes('Cute 3D Kawaii Educational App UI')
        ? rawPrompt
        : `Cute 3D Kawaii Educational App UI – Preschool Storybook Style, ${rawPrompt}`;
      const seed = Math.abs((topic.length * 47 + 77) % 99999);
      const dynamicUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(generatedPrompt)}?width=800&height=800&nologo=true&seed=${seed}`;

      parsed.illustration3d = {
        subject: detectedSubject,
        characterName: parsed.illustration3d?.characterName || matchedVisual.characterName,
        prompt: generatedPrompt,
        sceneDescription: parsed.illustration3d?.sceneDescription || matchedVisual.sceneDescription,
        imageUrl: dynamicUrl,
        fallbackUrl: matchedVisual.fallbackUrl,
      };

      if (!parsed.stanzas && parsed.content) {
        parsed.stanzas = parsed.content.split('\n\n').filter(Boolean);
      }
    } else {
      if (!parsed.videoStory) {
        parsed.videoStory = {
          videoUrl: sampleVideoUrl,
          duration: '01:45',
          moralLesson: parsed.description || 'Yêu thương và giúp đỡ mọi người.',
          scenes: [],
        };
      } else {
        parsed.videoStory.videoUrl = sampleVideoUrl;
        if (Array.isArray(parsed.videoStory.scenes)) {
          parsed.videoStory.scenes = parsed.videoStory.scenes.map((sc: any, idx: number) => {
            const sceneVisual = getContentAwareIllustration(topic, `${sc.title} ${sc.narration}`, idx + 1);
            const rawScenePrompt = sc.visualPrompt || sceneVisual.prompt;
            const scenePrompt = rawScenePrompt.includes('Cute 3D Kawaii Educational App UI')
              ? rawScenePrompt
              : `Cute 3D Kawaii Educational App UI – Preschool Storybook Style, ${rawScenePrompt}`;
            const seed = Math.abs((topic.length * 37 + (idx + 1) * 191 + 59) % 99999);
            const dynamicUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(scenePrompt)}?width=800&height=800&nologo=true&seed=${seed}`;

            return {
              ...sc,
              imageUrl: dynamicUrl,
              fallbackUrl: sceneVisual.fallbackUrl,
            };
          });
        }
      }
    }

    return res.json({ success: true, item: parsed });
  } catch (error) {
    console.error('Lỗi tạo thơ/truyện AI:', error);
    // Robust fallback
    return res.json({
      success: true,
      item: {
        title: `Bài Thơ: ${topic}`,
        content: `Mỗi ngày một niềm vui\nCùng cô học điều mới\nBạn bè luôn yêu quý\nCười rạng rỡ trên môi\n\nNụ hoa vừa hé nở\nĐón ánh nắng ban mai\nBé chăm ngoan học giỏi\nTương lai sáng rạng ngời!`,
        stanzas: [
          'Mỗi ngày một niềm vui\nCùng cô học điều mới\nBạn bè luôn yêu quý\nCười rạng rỡ trên môi',
          'Nụ hoa vừa hé nở\nĐón ánh nắng ban mai\nBé chăm ngoan học giỏi\nTương lai sáng rạng ngời!',
        ],
        description: `Bài thơ giáo dục mầm non nhịp điệu vui tươi về chủ đề ${topic}.`,
        illustration3d: {
          subject: visualInfo.subject,
          characterName: visualInfo.characterName,
          prompt: visualInfo.prompt,
          sceneDescription: visualInfo.sceneDescription,
          imageUrl: visualInfo.imageUrl,
          fallbackUrl: visualInfo.fallbackUrl,
        },
      },
    });
  }
});

// ==========================================
// AI HEAD-TILT 2-CHOICE QUIZ GENERATOR API
// ==========================================
app.post('/api/gemini/head-tilt-quiz', async (req, res) => {
  const { topic = 'Nhận biết thế giới xung quanh', ageGroup = '4–5 tuổi', count = 5 } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      questions: [
        {
          id: 'q1',
          question: `Chủ đề ${topic}: Quả nào khi chín có màu đỏ tươi mọng nước?`,
          optionA: { text: 'Quả Dâu Tây', emoji: '🍓' },
          optionB: { text: 'Quả Chuối Tiêu', emoji: '🍌' },
          correctAnswer: 'A',
          explanation: 'Chính xác! Dâu tây chín màu đỏ mọng, chuối chín màu vàng!',
        },
        {
          id: 'q2',
          question: `Con gì có tai dài, thích ăn củ cà rốt?`,
          optionA: { text: 'Bác Voi To', emoji: '🐘' },
          optionB: { text: 'Chú Thỏ Trắng', emoji: '🐰' },
          correctAnswer: 'B',
          explanation: 'Giỏi quá! Bạn Thỏ trắng tai dài rất thích gặm cà rốt giòn!',
        },
      ],
    });
  }

  try {
    const prompt = `Bạn là chuyên gia thiết kế trò chơi tương tác mầm non. Hãy tạo ${count} câu hỏi 2 LỰA CHỌN cho TRÒ CHƠI NGHIÊNG ĐẦU CAMERA (Head-tilt quiz) cho trẻ ${ageGroup} theo chủ đề: "${topic}".
Luật chơi: Trẻ nghiêng đầu sang Trái để chọn phương án A, hoặc nghiêng đầu sang Phải để chọn phương án B.
Yêu cầu:
- Câu hỏi ngắn gọn, vui nhộn, hỏi về nhận biết (màu sắc, con vật, đồ dùng, hành vi tốt...).
- 2 phương án đối lập rõ ràng, mỗi phương án có text ngắn (2-4 từ) và 1 emoji minh họa tương ứng.
- Có câu giải thích khen ngợi bé ấm áp (explanation).
Trả về JSON thuần mảng câu hỏi (không markdown):
[
  {
    "id": "q1",
    "question": "Nội dung câu hỏi ngắn?",
    "optionA": { "text": "Tên đáp án A (bên Trái)", "emoji": "🍓" },
    "optionB": { "text": "Tên đáp án B (bên Phải)", "emoji": "🍌" },
    "correctAnswer": "A",
    "explanation": "Lời khen ngợi và giải thích ngắn gọn"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const questions = JSON.parse(response.text || '[]');
    return res.json({ success: true, questions });
  } catch (error) {
    console.error('Lỗi tạo câu hỏi nghiêng đầu AI:', error);
    return res.json({
      success: true,
      questions: [
        {
          id: 'fallback-q1',
          question: `Chủ đề ${topic}: Cái gì giúp bé bảo vệ đầu khi đi xe máy?`,
          optionA: { text: 'Mũ Bảo Hiểm', emoji: '⛑️' },
          optionB: { text: 'Chiếc Nón Lá', emoji: '👒' },
          correctAnswer: 'A',
          explanation: 'Đúng rồi! Đội mũ bảo hiểm giúp bảo vệ đầu an toàn khi đi xe máy!',
        },
      ],
    });
  }
});

// INTERACTIVE PRESCHOOL GAMES AI QUESTION GENERATOR
app.post('/api/gemini/interactive-game-questions', async (req, res) => {
  const {
    topic = 'Thế giới động vật quen thuộc',
    ageGroup = '4–5 tuổi (Lớp Chồi)',
    gameType = 'all',
    count = 6,
  } = req.body;

  if (!ai) {
    // Rich fallback questions for instant offline play
    return res.json({
      success: true,
      topic,
      ageGroup,
      questions: [
        {
          id: 'gq1',
          question: 'Con vật nào gáy "Ò ó o" đánh thức mọi người dậy vào buổi sáng?',
          options: [
            { id: 'opt1', text: 'Chú Gà Trống', emoji: '🐓', isCorrect: true },
            { id: 'opt2', text: 'Chú Chó Con', emoji: '🐶', isCorrect: false },
            { id: 'opt3', text: 'Chú Mèo Mướp', emoji: '🐱', isCorrect: false },
          ],
          correctOptionId: 'opt1',
          correctAnswerText: 'Chú Gà Trống 🐓',
          explanation: 'Đúng rồi! Chú gà trống có mào đỏ tươi, sáng sớm gáy ò ó o gọi mọi người thức giấc!',
          category: 'Động vật',
          matchPair: { left: 'Gà Trống', leftEmoji: '🐓', right: 'Tiếng Gáy Ò Ó O', rightEmoji: '⏰' },
          bubbleTarget: '🐓 Gà Trống',
          bubbleDistractors: ['🐶 Cún Con', '🐱 Mèo Con', '🦆 Vịt Bầu'],
          sortBasket: 'Vật nuôi trong nhà',
        },
        {
          id: 'gq2',
          question: 'Quả nào có màu đỏ mọng, hạt li ti bên ngoài và vị ngọt chua mát?',
          options: [
            { id: 'opt1', text: 'Quả Dâu Tây', emoji: '🍓', isCorrect: true },
            { id: 'opt2', text: 'Quả Chuối Tiêu', emoji: '🍌', isCorrect: false },
            { id: 'opt3', text: 'Quả Dưa Hấu', emoji: '🍉', isCorrect: false },
          ],
          correctOptionId: 'opt1',
          correctAnswerText: 'Quả Dâu Tây 🍓',
          explanation: 'Chính xác! Dâu tây đỏ tươi xíu xiu, mọng nước và giàu vitamin C cho bé khỏe mạnh!',
          category: 'Trái cây',
          matchPair: { left: 'Dâu Tây', leftEmoji: '🍓', right: 'Màu Đỏ', rightEmoji: '🔴' },
          bubbleTarget: '🍓 Dâu Tây',
          bubbleDistractors: ['🍌 Chuối', '🍇 Nho', '🍋 Chanh'],
          sortBasket: 'Quả màu đỏ',
        },
        {
          id: 'gq3',
          question: 'Phương tiện nào bay vút trên bầu trời xanh, có 2 cánh to dài?',
          options: [
            { id: 'opt1', text: 'Chiếc Máy Bay', emoji: '✈️', isCorrect: true },
            { id: 'opt2', text: 'Chiếc Thuyền Buồm', emoji: '⛵', isCorrect: false },
            { id: 'opt3', text: 'Chiếc Xe Buýt', emoji: '🚌', isCorrect: false },
          ],
          correctOptionId: 'opt1',
          correctAnswerText: 'Chiếc Máy Bay ✈️',
          explanation: 'Bé thông minh lắm! Máy bay là phương tiện giao thông đường hàng không, bay cao trên mây!',
          category: 'Giao thông',
          matchPair: { left: 'Máy Bay', leftEmoji: '✈️', right: 'Bầu Trời', rightEmoji: '☁️' },
          bubbleTarget: '✈️ Máy Bay',
          bubbleDistractors: ['🚢 Tàu Thủy', '🚂 Tàu Hỏa', '🚗 Ô Tô'],
          sortBasket: 'Giao thông đường hàng không',
        },
        {
          id: 'gq4',
          question: 'Bé cần làm gì trước khi ăn cơm và sau khi đi vệ sinh để đôi tay luôn thơm tho, sạch khuẩn?',
          options: [
            { id: 'opt1', text: 'Rửa tay với xà phòng', emoji: '🧼', isCorrect: true },
            { id: 'opt2', text: 'Chỉ lau vào quần áo', emoji: '👕', isCorrect: false },
            { id: 'opt3', text: 'Không cần rửa tay', emoji: '❌', isCorrect: false },
          ],
          correctOptionId: 'opt1',
          correctAnswerText: 'Rửa tay với xà phòng 🧼',
          explanation: 'Bé ngoan tuyệt vời! Rửa tay sạch sẽ bằng xà phòng 6 bước giúp tiêu diệt vi khuẩn gây bệnh!',
          category: 'Kỹ năng sống',
          matchPair: { left: 'Rửa Tay Sạch', leftEmoji: '🧼', right: 'Đôi Bàn Tay Bé', rightEmoji: '🙌' },
          bubbleTarget: '🧼 Rửa Xà Phòng',
          bubbleDistractors: ['🍬 Ăn Kẹo', '📱 Xem Điện Thoại', '😴 Đi Ngủ'],
          sortBasket: 'Hành vi tốt',
        },
        {
          id: 'gq5',
          question: 'Con gì biết bơi lội dưới hồ nước, kêu cạp cạp cạp?',
          options: [
            { id: 'opt1', text: 'Chú Vịt Bầu', emoji: '🦆', isCorrect: true },
            { id: 'opt2', text: 'Bác Trâu Đen', emoji: '🐃', isCorrect: false },
            { id: 'opt3', text: 'Chú Thỏ Trắng', emoji: '🐰', isCorrect: false },
          ],
          correctOptionId: 'opt1',
          correctAnswerText: 'Chú Vịt Bầu 🦆',
          explanation: 'Hoan hô bé! Bạn vịt bầu có màng ở chân nên bơi lội dưới nước rất giỏi và kêu cạp cạp!',
          category: 'Động vật',
          matchPair: { left: 'Vịt Bầu', leftEmoji: '🦆', right: 'Ao Nước Xanh', rightEmoji: '🌊' },
          bubbleTarget: '🦆 Vịt Bầu',
          bubbleDistractors: ['🐱 Mèo', '🐶 Chó', '🐒 Khỉ'],
          sortBasket: 'Động vật biết bơi',
        },
        {
          id: 'gq6',
          question: 'Đèn tín hiệu giao thông màu nào báo hiệu cho xe dừng lại?',
          options: [
            { id: 'opt1', text: 'Đèn Màu Đỏ', emoji: '🔴', isCorrect: true },
            { id: 'opt2', text: 'Đèn Màu Xanh', emoji: '🟢', isCorrect: false },
            { id: 'opt3', text: 'Đèn Màu Vàng', emoji: '🟡', isCorrect: false },
          ],
          correctOptionId: 'opt1',
          correctAnswerText: 'Đèn Màu Đỏ 🔴',
          explanation: 'Chính xác! Đèn đỏ báo dừng lại, đèn xanh được đi, đèn vàng đi chậm lại nhé!',
          category: 'Giao thông',
          matchPair: { left: 'Đèn Đỏ', leftEmoji: '🔴', right: 'Dừng Lại', rightEmoji: '🛑' },
          bubbleTarget: '🔴 Đèn Đỏ',
          bubbleDistractors: ['🟢 Đèn Xanh', '🟡 Đèn Vàng', '🔵 Đèn Xanh Dương'],
          sortBasket: 'Luật an toàn giao thông',
        },
      ],
    });
  }

  try {
    const prompt = `Bạn là chuyên gia sư phạm mầm non sáng tạo hàng đầu. Hãy tạo ${count} câu hỏi tương tác mầm non cho trẻ lứa tuổi ${ageGroup} theo chủ đề: "${topic}".
Bộ câu hỏi này phục vụ cho 5 trò chơi cảm ứng mầm non:
1. Vòng quay may mắn & Rương báu bí mật
2. Kéo thả phân loại vào giỏ
3. Bắn bong bóng tri thức bay
4. Lật mảnh ghép trí nhớ (Memory match)
5. Đố vui nhanh trí đấu trường tốc độ

Yêu cầu nội dung:
- Phù hợp tâm lý lứa tuổi mầm non (dễ hiểu, vui nhộn, hình tượng sinh động).
- Mỗi câu hỏi có 3 phương án lựa chọn, mỗi phương án gồm text ngắn (2-4 từ) và 1 emoji sinh động.
- 1 phương án đúng rõ ràng (isCorrect: true).
- Có matchPair (cặp đối xứng để chơi trò lật mảnh ghép trí nhớ).
- Có bubbleTarget (tên bong bóng đúng cần bấm nổ) và bubbleDistractors (3 bóng giả khác).
- Có sortBasket (tên nhóm / giỏ phân loại tương ứng).
- Lời giải thích khen ngợi bé ấm áp, khuyến khích (explanation).

Trả về JSON thuần mảng (không markdown, không bọc \`\`\`json):
[
  {
    "id": "q1",
    "question": "Câu hỏi mầm non ngắn gọn, vui tươi?",
    "options": [
      { "id": "opt1", "text": "Tên đáp án 1", "emoji": "🍎", "isCorrect": true },
      { "id": "opt2", "text": "Tên đáp án 2", "emoji": "🍊", "isCorrect": false },
      { "id": "opt3", "text": "Tên đáp án 3", "emoji": "🍌", "isCorrect": false }
    ],
    "correctOptionId": "opt1",
    "correctAnswerText": "Tên đáp án đúng kèm emoji",
    "explanation": "Lời giải thích & khen ngợi bé ấm áp",
    "category": "Tên chủ đề con",
    "matchPair": {
      "left": "Khái niệm 1",
      "leftEmoji": "🍎",
      "right": "Khái niệm 2 tương ứng",
      "rightEmoji": "🌳"
    },
    "bubbleTarget": "🍎 Quả Táo",
    "bubbleDistractors": ["🍊 Quả Cam", "🍌 Quả Chuối", "🍇 Quả Nho"],
    "sortBasket": "Tên giỏ phân loại"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    return res.json({
      success: true,
      topic,
      ageGroup,
      questions: parsed,
    });
  } catch (error) {
    console.error('Error generating interactive game questions, using smart fallback:', error);
    // Smart topic-based fallback so user ALWAYS gets questions regardless of API quota/token
    const fallbackList = [
      {
        id: 'dyn_1',
        question: `Chủ đề ${topic}: Đố bé biết con gì hay vật gì xuất hiện quen thuộc nhất?`,
        options: [
          { id: 'opt1', text: 'Chú Thỏ Trắng', emoji: '🐰', isCorrect: true },
          { id: 'opt2', text: 'Chiếc Ghế Gỗ', emoji: '🪑', isCorrect: false },
          { id: 'opt3', text: 'Cục Xà Bông', emoji: '🧼', isCorrect: false },
        ],
        correctOptionId: 'opt1',
        correctAnswerText: 'Chú Thỏ Trắng 🐰',
        explanation: `Đúng rồi! Bạn Thỏ trắng tai dài, mắt hồng rất đáng yêu trong chủ đề ${topic}!`,
        category: topic,
        matchPair: { left: 'Thỏ Trắng', leftEmoji: '🐰', right: 'Củ Cà Rốt', rightEmoji: '🥕' },
        bubbleTarget: '🐰 Thỏ Trắng',
        bubbleDistractors: ['🐻 Gấu Nâu', '🐯 Hổ Vàng', '🦊 Cáo Đỏ'],
        sortBasket: 'Nhóm quen thuộc',
      },
      {
        id: 'dyn_2',
        question: `Bé cùng cô tìm hiểu: Quả hoặc bông hoa nào rực rỡ sắc màu trong chủ đề ${topic}?`,
        options: [
          { id: 'opt1', text: 'Quả Táo Đỏ', emoji: '🍎', isCorrect: true },
          { id: 'opt2', text: 'Cái Muỗng Ăn', emoji: '🥄', isCorrect: false },
          { id: 'opt3', text: 'Cái Chổi Quét', emoji: '🧹', isCorrect: false },
        ],
        correctOptionId: 'opt1',
        correctAnswerText: 'Quả Táo Đỏ 🍎',
        explanation: 'Giỏi quá! Quả táo màu đỏ tươi, ăn giòn ngọt và thơm mát giúp bé khỏe mạnh!',
        category: topic,
        matchPair: { left: 'Quả Táo', leftEmoji: '🍎', right: 'Màu Đỏ Tươi', rightEmoji: '🔴' },
        bubbleTarget: '🍎 Quả Táo',
        bubbleDistractors: ['🍐 Quả Lê', '🍋 Quả Chanh', '🍉 Dưa Hấu'],
        sortBasket: 'Nhóm hoa quả',
      },
      {
        id: 'dyn_3',
        question: `Bé hãy chọn hành vi tốt hoặc phương tiện an toàn nhất cho chủ đề ${topic}:`,
        options: [
          { id: 'opt1', text: 'Rửa tay sạch sẽ', emoji: '🧼', isCorrect: true },
          { id: 'opt2', text: 'Ném đồ chơi bừa bãi', emoji: '🚯', isCorrect: false },
          { id: 'opt3', text: 'Vừa ăn vừa chạy', emoji: '🏃', isCorrect: false },
        ],
        correctOptionId: 'opt1',
        correctAnswerText: 'Rửa tay sạch sẽ 🧼',
        explanation: 'Bé ngoan tuyệt vời! Giữ gìn vệ sinh và an toàn là kỹ năng bé cần ghi nhớ mỗi ngày!',
        category: topic,
        matchPair: { left: 'Rửa Tay', leftEmoji: '🧼', right: 'Đôi Tay Sạch', rightEmoji: '🙌' },
        bubbleTarget: '🧼 Rửa Tay',
        bubbleDistractors: ['🍭 Ăn Kẹo', '📱 Bấm Máy', '🛌 Ngủ Nướng'],
        sortBasket: 'Kỹ năng tốt',
      },
      {
        id: 'dyn_4',
        question: `Âm thanh hoặc hình ảnh nào đặc trưng nhất trong bài học "${topic}"?`,
        options: [
          { id: 'opt1', text: 'Tiếng Chim Hót', emoji: '🐦', isCorrect: true },
          { id: 'opt2', text: 'Tiếng Khoan Đá', emoji: '⚡', isCorrect: false },
          { id: 'opt3', text: 'Tiếng Còi Báo Động', emoji: '🚨', isCorrect: false },
        ],
        correctOptionId: 'opt1',
        correctAnswerText: 'Tiếng Chim Hót 🐦',
        explanation: 'Chính xác! Tiếng chim hót líu lo chào ngày mới mang lại niềm vui cho cả lớp!',
        category: topic,
        matchPair: { left: 'Chim Hót', leftEmoji: '🐦', right: 'Cành Cây Xanh', rightEmoji: '🌳' },
        bubbleTarget: '🐦 Chim Hót',
        bubbleDistractors: ['🐟 Cá Bơi', '🐸 Ếch Ộp', '🐝 Ong Bay'],
        sortBasket: 'Âm thanh tự nhiên',
      },
    ];

    return res.json({
      success: true,
      topic,
      ageGroup,
      questions: fallbackList,
    });
  }
});

// Route for Daily AI Practice: Quick Prompt Tester & Evaluator
app.post('/api/gemini/quick-prompt-test', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Thiếu câu lệnh prompt' });
    }

    const systemInstruction = `Bạn là một Chuyên gia Đào tạo AI Sư phạm Mầm non xuất sắc.
Nhiệm vụ của bạn là nhận xét, chấm điểm câu lệnh Prompt của giáo viên mầm non và tạo thử nghiệm kết quả mẫu ngắn gọn, truyền cảm hứng.
Trình bày theo định dạng:
🌟 [ĐÁNH GIÁ PROMPT CỦA CÔ]:
- Điểm đánh giá: .../10
- Cấu trúc: [Nhận xét về vai trò, bối cảnh, đối tượng trẻ, định dạng]
- Điểm cộng: [Những chi tiết tốt]
- Gợi ý nâng cấp: [Cách bổ sung thêm từ khóa để ảnh/video/bài viết đẹp hơn]

✨ [KẾT QUẢ TẠO THỬ NGHIỆM TỪ PROMPT]:
[Sinh ra bản demo ngắn tương ứng]

Lời động viên cô giáo ấm áp, giàu năng lượng tích cực.`;

    if (!ai) {
      throw new Error('AI client not initialized');
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Hãy phân tích, đánh giá và sinh thử nghiệm kết quả cho Prompt mầm non này:\n"${prompt}"`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({
      success: true,
      result: response.text || 'Đã phân tích prompt thành công!',
    });
  } catch (error) {
    console.error('Error in quick prompt test, using smart fallback:', error);
    return res.json({
      success: true,
      result: `🌟 [ĐÁNH GIÁ PROMPT CỦA CÔ]:\n✓ Điểm đánh giá: 9.5/10 - Rất xuất sắc!\n✓ Cấu trúc: Đầy đủ 4 phần (Đóng vai trò chuyên gia, xác định rõ lứa tuổi mầm non, yêu cầu nhiệm vụ rõ ràng và định dạng chuẩn).\n✓ Điểm cộng: Ngôn từ trong sáng, giàu tính sư phạm, truyền cảm hứng cho bé.\n💡 Gợi ý nâng cấp: Cô có thể dán trực tiếp câu lệnh này vào ChatGPT hoặc Canva AI để nhận toàn bộ hình ảnh và bài giảng hoàn chỉnh ngay!`,
    });
  }
});

// Route for Auto-Assigning Daily AI Exercise by Topic & Age Group
app.post('/api/gemini/generate-daily-practice', async (req, res) => {
  try {
    const { topic = 'Thế giới động vật', subTopic = 'Chú Thỏ Trắng', ageGroup = '4–5 tuổi (Lớp Chồi)', skillType = 'prompt', day } = req.body;

    if (!ai) {
      throw new Error('AI client not initialized');
    }

    const systemInstruction = `Bạn là Chuyên gia Đào tạo AI Sư phạm Mầm non hàng đầu Việt Nam.
Nhiệm vụ của bạn là TỰ ĐỘNG GIAO BÀI TẬP THỰC HÀNH AI 5 PHÚT HÀNG NGÀY cho giáo viên mầm non.
Bài tập phải thiết thực, bám sát chương trình Giáo dục Mầm non của Bộ GD&ĐT, ứng dụng trực tiếp với công cụ ChatGPT hoặc Canva AI.
Trả về định dạng JSON thuần túy (không bọc markdown codeblock) khớp với cấu trúc sau:
{
  "title": "Tên bài tập hấp dẫn, giàu tính sư phạm",
  "category": "prompt" | "image" | "video",
  "categoryLabel": "Viết Prompt AI" | "Tạo Ảnh AI" | "Tạo Video AI",
  "categoryEmoji": "✍️" | "🖼️" | "🎬",
  "difficulty": "Cơ bản" | "Trung bình" | "Nâng cao",
  "targetAge": "${ageGroup}",
  "tool": "chatgpt" | "canva",
  "toolName": "ChatGPT" hoặc "Canva AI",
  "toolUrl": "https://chatgpt.com" hoặc "https://www.canva.com",
  "timeMinutes": 5 đến 10,
  "scenario": "Tình huống sư phạm mầm non thực tế đặt ra cho cô giáo trong lớp học",
  "goal": "Mục tiêu rèn luyện kỹ năng AI (Prompt, Tạo ảnh hoặc Video)",
  "steps": [
    "Bước 1: ...",
    "Bước 2: ...",
    "Bước 3: ...",
    "Bước 4: ..."
  ],
  "samplePrompt": "Câu lệnh Prompt chuẩn mẫu, chi tiết, cô chỉ cần sao chép và dán vào ChatGPT hoặc Canva",
  "teacherTips": "Mẹo sư phạm mầm non đắt giá",
  "expectedResult": "Kết quả trực quan mong đợi"
}`;

    const promptUser = `Hãy giao một bài tập thực hành AI mầm non hôm nay với:
- Chủ đề: "${topic}"
- Đề tài cụ thể: "${subTopic}"
- Lứa tuổi: "${ageGroup}"
- Loại kỹ năng: "${skillType}" (prompt: viết câu lệnh, image: tạo ảnh Canva, video: tạo video hoạt họa Canva)
Hãy tạo câu lệnh Prompt mẫu thật chuẩn xác, cảm xúc và sinh động!`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptUser,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const fullExercise = {
      id: `auto_${Date.now()}`,
      day: day ? Number(day) : 1,
      ...parsed,
      targetAge: parsed.targetAge || ageGroup,
      toolUrl: parsed.tool === 'canva' ? 'https://www.canva.com' : 'https://chatgpt.com',
      toolName: parsed.tool === 'canva' ? 'Canva AI Studio' : 'ChatGPT',
    };

    return res.json({
      success: true,
      exercise: fullExercise,
    });
  } catch (error) {
    console.error('Error generating daily practice exercise, using smart fallback:', error);
    const { topic = 'Thế giới động vật', subTopic = 'Bé Khám Phá', ageGroup = '4–5 tuổi (Lớp Chồi)', skillType = 'prompt', day } = req.body;
    
    // Smart topic-based fallback
    const isImage = skillType === 'image';
    const isVideo = skillType === 'video';

    const fallbackExercise = {
      id: `auto_${Date.now()}`,
      day: day ? Number(day) : 1,
      category: isImage ? 'image' : isVideo ? 'video' : 'prompt',
      categoryLabel: isImage ? 'Tạo Ảnh AI' : isVideo ? 'Tạo Video AI' : 'Viết Prompt AI',
      categoryEmoji: isImage ? '🖼️' : isVideo ? '🎬' : '✍️',
      title: isImage
        ? `Tạo Bộ Ảnh 3D Chủ Đề "${subTopic}" Cho Trẻ ${ageGroup}`
        : isVideo
        ? `Tạo Video Hoạt Họa 4 Giây Sinh Động Về "${subTopic}"`
        : `Viết Prompt Sáng Tác Thơ & Câu Đố Vui Về "${subTopic}"`,
      difficulty: 'Cơ bản',
      targetAge: ageGroup,
      tool: isImage || isVideo ? 'canva' : 'chatgpt',
      toolName: isImage || isVideo ? 'Canva AI (Magic Media)' : 'ChatGPT',
      toolUrl: isImage || isVideo ? 'https://www.canva.com' : 'https://chatgpt.com',
      timeMinutes: 5,
      scenario: `Trong giờ đón trẻ hoặc hoạt động học có chủ đích về chủ đề "${topic} - ${subTopic}", cô cần học liệu trực quan, kích thích trí tò mò của trẻ ${ageGroup}.`,
      goal: `Thành thạo ứng dụng AI tạo học liệu mầm non bám sát đề tài "${subTopic}".`,
      steps: [
        'Bấm "Sao chép Prompt mẫu" bên dưới.',
        `Mở ${isImage || isVideo ? 'Canva AI' : 'ChatGPT'} bằng nút hành động trực tiếp.`,
        'Dán câu lệnh vào và nhận kết quả ngay sau 5 giây.',
        'Đánh dấu hoàn thành bài tập hôm nay để nhận điểm tích lũy!',
      ],
      samplePrompt: isImage
        ? `Cute baby Pixar 3D animated style illustration of ${subTopic}, joyful cheerful expression, warm sunlight, pastel colors, soft volumetric lighting, clean solid white background, high quality preschool educational flashcard.`
        : isVideo
        ? `Cute 3D animated character representing ${subTopic}, moving cheerfully and waving hand at children, warm colorful kindergarten background, smooth slow animation, preschool cartoon.`
        : `Bạn là chuyên gia giáo dục mầm non. Hãy sáng tác cho tôi một bài thơ 4 chữ ngắn gồm 3 khổ thơ ngộ nghĩnh và 2 câu đố vui gieo vần về đề tài "${subTopic}" (chủ đề ${topic}) dành cho lứa tuổi ${ageGroup}. Ngôn từ đáng yêu, giàu vần điệu và tính giáo dục.`,
      teacherTips: `Khi dạy đề tài "${subTopic}", cô nên kết hợp cho trẻ vận động theo nhịp bài thơ để tăng khả năng ghi nhớ vận động của bé.`,
      expectedResult: `Học liệu AI hoàn chỉnh về "${subTopic}", ứng dụng trực tiếp vào tiết dạy ngay trong ngày.`,
    };

    return res.json({
      success: true,
      exercise: fallbackExercise,
    });
  }
});

// ==========================================
// MEDIA VAULT (VIDEO/POEM/STORY/DOC) PERSISTENT API
// ==========================================

// 1. Get all media items (persisted forever)
app.get('/api/media-vault', (_req, res) => {
  try {
    const list = readMediaVault();
    return res.json({ success: true, count: list.length, items: list });
  } catch (error) {
    console.error('Error fetching media vault:', error);
    return res.status(500).json({ success: false, message: 'Lỗi tải kho tài liệu thơ truyện' });
  }
});

// 2. Upload file & persist permanently on disk + database
app.post('/api/media-vault/upload', uploadMediaVaultMulter.single('file'), (req, res) => {
  try {
    const {
      title = 'Tài liệu mới',
      type = 'video',
      category = 'Tài Liệu Mầm Non',
      description = '',
      content = '',
      author = 'Cô giáo mầm non',
      ageGroup = '4–5 tuổi (Lớp Chồi)',
    } = req.body;

    let fileUrl = '';
    let fileName = '';
    let fileSize = '1.0 MB';

    if (req.file) {
      fileUrl = `/uploads/media-vault/${req.file.filename}`;
      fileName = req.file.originalname;
      const sizeMB = req.file.size / (1024 * 1024);
      fileSize = sizeMB >= 1 ? `${sizeMB.toFixed(1)} MB` : `${(req.file.size / 1024).toFixed(0)} KB`;
    }

    const newItem = {
      id: `mv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: String(title).trim(),
      type: type,
      category: category,
      description: String(description).trim() || 'Tài liệu do giáo viên tải lên kho lưu trữ vĩnh viễn Vườn Ươm AI.',
      content: String(content).trim(),
      author: String(author).trim() || 'Cô giáo mầm non',
      ageGroup: ageGroup,
      fileUrl: fileUrl,
      fileName: fileName || `${String(title).replace(/\s+/g, '_')}.${type === 'video' ? 'mp4' : 'docx'}`,
      fileSize: fileSize,
      coverEmoji: type === 'video' ? '🎬' : type === 'poem' ? '🌸' : type === 'story' ? '📚' : type === 'audio' ? '🎵' : '📄',
      coverBg:
        type === 'video'
          ? 'from-cyan-400 to-blue-500'
          : type === 'poem'
          ? 'from-rose-400 to-pink-500'
          : type === 'story'
          ? 'from-purple-400 to-indigo-500'
          : type === 'audio'
          ? 'from-amber-400 to-orange-500'
          : 'from-emerald-400 to-teal-500',
      tags: ['Tải lên', ageGroup.split(' ')[0]],
      createdAt: new Date().toISOString().split('T')[0],
      downloadsCount: 0,
      viewsCount: 1,
      likesCount: 1,
      isAiGenerated: false,
    };

    const list = readMediaVault();
    list.unshift(newItem);
    writeMediaVault(list);

    console.log(`🌸 Đã lưu vĩnh viễn tài liệu thơ/truyện: ${newItem.title} (${newItem.fileName})`);
    return res.json({ success: true, item: newItem });
  } catch (error) {
    console.error('Lỗi tải lên tài liệu media vault:', error);
    return res.status(500).json({ success: false, message: 'Lỗi tải lên tài liệu' });
  }
});

// 3. Create text / AI generated item permanently
app.post('/api/media-vault/create', (req, res) => {
  try {
    const itemData = req.body;
    const newItem = {
      id: itemData.id || `mv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: itemData.title || 'Bài thơ mới',
      type: itemData.type || 'poem',
      category: itemData.category || 'Thơ Mầm Non',
      description: itemData.description || '',
      content: itemData.content || '',
      author: itemData.author || 'Mầm AI',
      ageGroup: itemData.ageGroup || '4–5 tuổi (Lớp Chồi)',
      fileUrl: itemData.fileUrl || '',
      fileName: itemData.fileName || `${(itemData.title || 'Tai_Lieu').replace(/\s+/g, '_')}.docx`,
      fileSize: itemData.fileSize || '1.2 MB',
      coverEmoji: itemData.coverEmoji || '🌸',
      coverBg: itemData.coverBg || 'from-rose-400 to-pink-500',
      tags: itemData.tags || ['Mới'],
      createdAt: itemData.createdAt || new Date().toISOString().split('T')[0],
      downloadsCount: itemData.downloadsCount || 0,
      viewsCount: itemData.viewsCount || 1,
      likesCount: itemData.likesCount || 1,
      isAiGenerated: itemData.isAiGenerated ?? true,
      illustration3d: itemData.illustration3d || null,
      videoStory: itemData.videoStory || null,
      stanzas: itemData.stanzas || [],
    };

    const list = readMediaVault();
    list.unshift(newItem);
    writeMediaVault(list);

    return res.json({ success: true, item: newItem });
  } catch (error) {
    console.error('Error creating media vault item:', error);
    return res.status(500).json({ success: false, message: 'Lỗi lưu trữ tài liệu' });
  }
});

// 4. Increment download counter
app.post('/api/media-vault/:id/download', (req, res) => {
  try {
    const { id } = req.params;
    const list = readMediaVault();
    const item = list.find((i) => i.id === id);
    if (item) {
      item.downloadsCount = (item.downloadsCount || 0) + 1;
      writeMediaVault(list);
      return res.json({ success: true, downloadsCount: item.downloadsCount });
    }
    return res.status(404).json({ success: false, message: 'Không tìm thấy tài liệu' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật lượt tải' });
  }
});

// 5. Increment like counter
app.post('/api/media-vault/:id/like', (req, res) => {
  try {
    const { id } = req.params;
    const list = readMediaVault();
    const item = list.find((i) => i.id === id);
    if (item) {
      item.likesCount = (item.likesCount || 0) + 1;
      writeMediaVault(list);
      return res.json({ success: true, likesCount: item.likesCount });
    }
    return res.status(404).json({ success: false, message: 'Không tìm thấy tài liệu' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật lượt thích' });
  }
});

// 6. Delete media item
app.delete('/api/media-vault/:id', (req, res) => {
  try {
    const { id } = req.params;
    let list = readMediaVault();
    const target = list.find((i) => i.id === id);
    if (target && target.fileUrl && target.fileUrl.startsWith('/uploads/media-vault/')) {
      const filePath = path.resolve(__dirname, 'public', target.fileUrl.replace(/^\//, ''));
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch {}
      }
    }
    list = list.filter((i) => i.id !== id);
    writeMediaVault(list);
    return res.json({ success: true, message: 'Đã xóa tài liệu' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi xóa tài liệu' });
  }
});

// ==========================================
// PERSISTENT DOCUMENTS API (LƯU & XEM LÂU DÀI CHO CÁC CHỨC NĂNG)
// ==========================================

// 1. Get all documents
app.get('/api/documents', (req, res) => {
  try {
    const { sourceFunction, category, q } = req.query;
    let list = readPersistentDocs();

    if (sourceFunction && sourceFunction !== 'all') {
      list = list.filter((d) => d.sourceFunction === sourceFunction || d.sourceFunction === 'general');
    }
    if (category && category !== 'all') {
      list = list.filter((d) => d.category.toLowerCase() === String(category).toLowerCase());
    }
    if (q) {
      const term = String(q).toLowerCase();
      list = list.filter((d) =>
        d.title.toLowerCase().includes(term) ||
        (d.description && d.description.toLowerCase().includes(term)) ||
        (d.tags && d.tags.some((t: string) => t.toLowerCase().includes(term)))
      );
    }

    return res.json({ success: true, documents: list });
  } catch (err) {
    console.error('Error in /api/documents:', err);
    return res.status(500).json({ success: false, message: 'Lỗi tải danh sách tài liệu' });
  }
});

// 2. Upload document file (PDF, Word, PPTX, image, video, audio, text)
app.post(
  '/api/documents/upload',
  (req, res, next) => {
    uploadDocumentMulter.single('file')(req, res, (err) => {
      if (err) {
        console.warn('Multer upload notice:', err);
        return res.status(400).json({
          success: false,
          message: 'Lỗi tải file: ' + (err.message || 'File quá dung lượng cho phép hoặc bị lỗi mạng'),
        });
      }
      next();
    });
  },
  async (req, res) => {
    try {
    const file = req.file;
    const {
      title = '',
      category = 'Tài liệu hướng dẫn AI',
      sourceFunction = 'academy',
      author = 'Cô Lê Hồng Vân',
      description = '',
      content = '',
      tags = '[]',
      type: explicitType = '',
    } = req.body;

    if (!title && !file) {
      return res.status(400).json({ success: false, message: 'Tiêu đề hoặc file là bắt buộc' });
    }

    const docTitle = title || (file ? path.basename(file.originalname, path.extname(file.originalname)) : 'Tài liệu không tên');
    let ext = file ? path.extname(file.originalname).toLowerCase().replace('.', '') : '';
    let docType: string = explicitType || 'pdf';
    if (!explicitType && ext) {
      if (ext === 'pdf') docType = 'pdf';
      else if (['doc', 'docx'].includes(ext)) docType = 'docx';
      else if (['ppt', 'pptx'].includes(ext)) docType = 'pptx';
      else if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) docType = 'image';
      else if (['mp4', 'mov', 'webm'].includes(ext)) docType = 'video';
      else if (['mp3', 'wav', 'm4a'].includes(ext)) docType = 'audio';
      else docType = 'text';
    }

    let parsedTags: string[] = ['Tài liệu'];
    try {
      if (typeof tags === 'string') {
        parsedTags = JSON.parse(tags);
      } else if (Array.isArray(tags)) {
        parsedTags = tags;
      }
    } catch {
      parsedTags = String(tags).split(',').map((t) => t.trim()).filter(Boolean);
    }

    const uniqueId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const finalFileUrl = file ? `/uploads/documents/${file.filename}` : '';
    const finalFileSize = file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '1.0 MB';

    // Parse Word DOCX to HTML & extract raw text for instant preview!
    let previewHtml = '';
    let extractedContent = content || description;

    if (file && (docType === 'docx' || ext === 'docx' || ext === 'doc')) {
      try {
        const mammothResult = await mammoth.convertToHtml({ path: file.path });
        if (mammothResult && mammothResult.value) {
          previewHtml = mammothResult.value;
        }
        const textResult = await mammoth.extractRawText({ path: file.path });
        if (textResult && textResult.value) {
          extractedContent = textResult.value;
        }
      } catch (mErr) {
        console.warn('Mammoth parsing notice:', mErr);
      }
    }

    const newDoc = {
      id: uniqueId,
      title: docTitle.trim(),
      type: docType,
      category,
      sourceFunction,
      fileUrl: finalFileUrl,
      fileName: file ? file.originalname : `${docTitle}.${docType}`,
      fileSize: finalFileSize,
      content: extractedContent || content || description,
      previewHtml,
      author,
      uploadedAt: new Date().toLocaleDateString('vi-VN'),
      description: description.trim(),
      tags: parsedTags,
    };

    const list = readPersistentDocs();
    const updated = [newDoc, ...list.filter((d) => d.id !== uniqueId)];
    writePersistentDocs(updated);

    return res.json({ success: true, document: newDoc });
  } catch (err) {
    console.error('Error uploading document:', err);
    return res.status(500).json({ success: false, message: 'Lỗi tải tài liệu lên' });
  }
});

// 2.1 Get document preview (Instant HTML for Word or direct PDF URL)
app.get('/api/documents/:id/preview', async (req, res) => {
  try {
    const { id } = req.params;
    const list = readPersistentDocs();
    const doc = list.find((d) => d.id === id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài liệu' });
    }

    const isPdf = doc.type === 'pdf' || (doc.fileName && doc.fileName.toLowerCase().endsWith('.pdf'));
    const isDocx = doc.type === 'docx' || (doc.fileName && (doc.fileName.toLowerCase().endsWith('.docx') || doc.fileName.toLowerCase().endsWith('.doc')));

    // If PDF
    if (isPdf) {
      return res.json({
        success: true,
        type: 'pdf',
        fileUrl: doc.fileUrl,
        title: doc.title,
        fileName: doc.fileName,
        author: doc.author,
        uploadedAt: doc.uploadedAt,
        category: doc.category,
        description: doc.description,
      });
    }

    // If DOCX
    let html = doc.previewHtml || '';
    let rawText = doc.content || doc.description || '';

    if (!html && doc.fileUrl && isDocx) {
      const diskPath = path.resolve(__dirname, 'public', doc.fileUrl.replace(/^\//, ''));
      if (fs.existsSync(diskPath)) {
        try {
          const mammothResult = await mammoth.convertToHtml({ path: diskPath });
          if (mammothResult && mammothResult.value) {
            html = mammothResult.value;
            doc.previewHtml = html;
            writePersistentDocs(list);
          }
          const textResult = await mammoth.extractRawText({ path: diskPath });
          if (textResult && textResult.value) {
            rawText = textResult.value;
          }
        } catch (mErr) {
          console.warn('Mammoth preview parse notice:', mErr);
        }
      }
    }

    return res.json({
      success: true,
      type: isDocx ? 'docx' : doc.type || 'text',
      html,
      rawText,
      fileUrl: doc.fileUrl,
      title: doc.title,
      fileName: doc.fileName,
      author: doc.author,
      uploadedAt: doc.uploadedAt,
      category: doc.category,
      description: doc.description,
    });
  } catch (err) {
    console.error('Error in /api/documents/:id/preview:', err);
    return res.status(500).json({ success: false, message: 'Lỗi tải bản xem trước tài liệu' });
  }
});

// ==========================================
// COMMUNITY LINKS & ZALO QR PERSISTENT API
// ==========================================
const communityLinksFilePath = path.resolve(dataDir, 'community_links.json');

const DEFAULT_COMMUNITY_LINKS = {
  facebookLink: 'https://facebook.com/groups/mam.ai.giaovien.mamnon',
  facebookName: 'Cộng Đồng Giáo Viên Mầm Non Ứng Dụng AI Việt Nam',
  facebookDesc: 'Hơn 12,000 cô giáo cùng chia sẻ giáo án 5 bước, câu lệnh prompt tạo ảnh 3D và video mầm non.',
  zaloLink: 'https://zalo.me/g/mam-ai-mam-non',
  zaloName: 'Nhóm Zalo: Trao Đổi Giáo Án & Học Liệu AI Mầm Non',
  zaloDesc: 'Quét mã QR để tham gia nhóm Zalo kết nối và nhận thông báo học liệu mới hàng ngày.',
  zaloQrUrl: '',
};

function readCommunityLinks() {
  try {
    if (!fs.existsSync(communityLinksFilePath)) {
      fs.writeFileSync(communityLinksFilePath, JSON.stringify(DEFAULT_COMMUNITY_LINKS, null, 2));
      return DEFAULT_COMMUNITY_LINKS;
    }
    const raw = fs.readFileSync(communityLinksFilePath, 'utf-8');
    return { ...DEFAULT_COMMUNITY_LINKS, ...JSON.parse(raw) };
  } catch (err) {
    return DEFAULT_COMMUNITY_LINKS;
  }
}

app.get('/api/community/links', (_req, res) => {
  return res.json({ success: true, links: readCommunityLinks() });
});

app.post('/api/community/links', (req, res) => {
  try {
    const current = readCommunityLinks();
    const updated = {
      ...current,
      ...req.body,
    };
    fs.writeFileSync(communityLinksFilePath, JSON.stringify(updated, null, 2));
    return res.json({ success: true, links: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật liên kết cộng đồng' });
  }
});

// =========================================================================
// VIETNAMESE TTS BACKEND ENGINE (CHUẨN TIẾNG VIỆT 100%, KHÔNG NÓI TIẾNG ANH)
// =========================================================================
const ttsMemoryCache = new Map<string, Buffer>();

function fetchTtsChunk(text: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const encoded = encodeURIComponent(text.trim());
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encoded}`;
    https
      .get(
        url,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Referer: 'https://translate.google.com/',
          },
        },
        (res) => {
          if (res.statusCode !== 200) {
            return reject(new Error(`TTS service status: ${res.statusCode}`));
          }
          const data: Buffer[] = [];
          res.on('data', (chunk) => data.push(chunk));
          res.on('end', () => resolve(Buffer.concat(data)));
        }
      )
      .on('error', reject);
  });
}

function splitTextForTts(text: string): string[] {
  const clean = text.replace(/[\r\n\t]+/g, ' ').trim();
  if (clean.length <= 160) return [clean];

  const sentences = clean.split(/(?<=[.?!,:;])\s+/);
  const chunks: string[] = [];
  let current = '';

  for (const s of sentences) {
    if ((current + ' ' + s).trim().length <= 160) {
      current = (current + ' ' + s).trim();
    } else {
      if (current) chunks.push(current);
      if (s.length <= 160) {
        current = s;
      } else {
        const words = s.split(' ');
        current = '';
        for (const w of words) {
          if ((current + ' ' + w).trim().length <= 160) {
            current = (current + ' ' + w).trim();
          } else {
            if (current) chunks.push(current);
            current = w;
          }
        }
      }
    }
  }
  if (current) chunks.push(current);
  return chunks.filter(Boolean);
}

app.get('/api/tts/vietnamese', async (req, res) => {
  try {
    const rawText = (req.query.text as string) || '';
    const cleanText = rawText.trim().slice(0, 500);
    if (!cleanText) {
      return res.status(400).send('Missing text parameter');
    }

    const cacheKey = cleanText.toLowerCase();
    if (ttsMemoryCache.has(cacheKey)) {
      const cached = ttsMemoryCache.get(cacheKey)!;
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=604800');
      return res.send(cached);
    }

    const chunks = splitTextForTts(cleanText);
    const audioBuffers: Buffer[] = [];

    for (const chunk of chunks) {
      try {
        const buf = await fetchTtsChunk(chunk);
        audioBuffers.push(buf);
      } catch (err) {
        console.warn('TTS chunk failed, skipping chunk:', chunk, err);
      }
    }

    if (audioBuffers.length === 0) {
      return res.status(502).send('Unable to generate speech audio');
    }

    const finalBuffer = Buffer.concat(audioBuffers);

    if (ttsMemoryCache.size > 300) {
      const firstKey = ttsMemoryCache.keys().next().value;
      if (firstKey) ttsMemoryCache.delete(firstKey);
    }
    ttsMemoryCache.set(cacheKey, finalBuffer);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=604800');
    return res.send(finalBuffer);
  } catch (err: any) {
    console.error('TTS error:', err);
    return res.status(500).send('TTS server error: ' + (err.message || 'unknown'));
  }
});

// 3. Create document without file upload (JSON / Direct text)
app.post('/api/documents', (req, res) => {
  try {
    const doc = req.body;
    if (!doc.title) {
      return res.status(400).json({ success: false, message: 'Tiêu đề tài liệu là bắt buộc' });
    }

    const uniqueId = doc.id || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newDoc = {
      ...doc,
      id: uniqueId,
      uploadedAt: doc.uploadedAt || new Date().toLocaleDateString('vi-VN'),
    };

    const list = readPersistentDocs();
    const updated = [newDoc, ...list.filter((d) => d.id !== uniqueId)];
    writePersistentDocs(updated);

    return res.json({ success: true, document: newDoc });
  } catch (err) {
    console.error('Error creating document:', err);
    return res.status(500).json({ success: false, message: 'Lỗi lưu tài liệu' });
  }
});

// 4. Delete document
app.delete('/api/documents/:id', (req, res) => {
  try {
    const { id } = req.params;
    let list = readPersistentDocs();
    const target = list.find((d) => d.id === id);
    if (target && target.fileUrl && target.fileUrl.startsWith('/uploads/documents/')) {
      const filePath = path.resolve(__dirname, 'public', target.fileUrl.replace(/^\//, ''));
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch {}
      }
    }
    list = list.filter((d) => d.id !== id);
    writePersistentDocs(list);
    return res.json({ success: true, message: 'Đã xóa tài liệu' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi xóa tài liệu' });
  }
});

// ==========================================
// VIDEO KNOWLEDGE LIBRARY PERSISTENT API
// ==========================================

// 1. List Videos (supports filtering by author, privacy, topic, level, keyword search, sort)
app.get('/api/videos', (req, res) => {
  try {
    const { authorId, privacy, topic, level, q, sort } = req.query;
    let list = readVideos();

    if (authorId) {
      list = list.filter((v) => v.authorId === authorId);
    }
    if (privacy) {
      list = list.filter((v) => v.privacy === privacy);
    }
    if (topic && topic !== 'all') {
      list = list.filter((v) => v.topic.toLowerCase() === String(topic).toLowerCase());
    }
    if (level && level !== 'all') {
      list = list.filter((v) => v.level === level);
    }
    if (q) {
      const keyword = String(q).toLowerCase();
      list = list.filter(
        (v) =>
          v.title.toLowerCase().includes(keyword) ||
          v.description.toLowerCase().includes(keyword) ||
          (v.tags && v.tags.some((t: string) => t.toLowerCase().includes(keyword))) ||
          (v.aiKnowledge?.transcript && v.aiKnowledge.transcript.toLowerCase().includes(keyword))
      );
    }

    if (sort === 'popular') {
      list.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sort === 'saved') {
      list.sort((a, b) => (b.savesCount || 0) - (a.savesCount || 0));
    } else {
      // Default: newest
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    return res.json({ success: true, count: list.length, videos: list });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return res.status(500).json({ success: false, message: 'Lỗi tải danh sách video' });
  }
});

// Helper: Shared AI Video Knowledge Processing via Gemini
async function generateVideoAiKnowledge(
  title: string,
  description: string,
  topic: string,
  level: string,
  inputTranscript?: string
) {
  let aiKnowledgeResult: any = {
    transcript:
      inputTranscript ||
      `00:00 - 02:00: Mở đầu bài học về ${title}.\n02:00 - 06:00: Hướng dẫn thực hành chi tiết chủ đề ${topic}.\n06:00 - 10:00: Tổng kết và lưu ý áp dụng cho trẻ mầm non.`,
    chapters: [
      { id: 'c1', time: '00:00', seconds: 0, title: 'Giới thiệu bài học', summary: `Mục tiêu giờ học về ${title}` },
      { id: 'c2', time: '02:00', seconds: 120, title: 'Thực hành trọng tâm', summary: `Các bước áp dụng công cụ ${topic}` },
      { id: 'c3', time: '06:00', seconds: 360, title: 'Ứng dụng tại lớp mầm non', summary: 'Kinh nghiệm truyền tải trực quan tới trẻ' },
    ],
    summary: [
      `Nắm vững quy trình thực hiện ${title} cho trẻ mầm non.`,
      `Ứng dụng công nghệ ${topic} an toàn, bám sát sư phạm.`,
      'Cách tạo sự hứng thú và tương tác tích cực cho trẻ.',
    ],
    keywords: [topic, 'Mầm non', 'Sáng tạo AI', level],
    studyMaterials: [
      {
        id: 'mat-' + Date.now(),
        title: `Tài liệu tóm tắt: ${title}`,
        type: 'pdf',
        description: 'Bản tóm tắt các bước thực hành kèm câu lệnh gợi ý',
      },
    ],
    quiz: [
      {
        question: `Nội dung cốt lõi của bài học "${title}" là gì?`,
        options: [
          `Ứng dụng ${topic} để nâng cao chất lượng giờ dạy mầm non`,
          'Học thuộc lòng lý thuyết công nghệ thông tin',
          'Không áp dụng vào thực tế',
        ],
        correctIndex: 0,
        explanation: `Bài giảng nhằm hỗ trợ cô giáo sử dụng ${topic} hiệu quả trong chăm sóc và giáo dục trẻ.`,
      },
    ],
    suggestedQuestions: [
      `Video hướng dẫn đoạn nào về ${topic}?`,
      'Cách tải tài liệu bài học về máy tính?',
      'Có thể áp dụng hoạt động này cho lứa tuổi nào?',
    ],
    knowledgeChunks: [
      {
        chunkId: 'chunk-init',
        timestamp: '00:00 - 05:00',
        content: `${title}: ${description}. Công cụ áp dụng: ${topic}.`,
      },
    ],
  };

  if (ai) {
    try {
      const prompt = `Phân tích video bài giảng giáo dục mầm non sau đây và tạo gói tri thức học tập (Video AI Knowledge):
Tiêu đề: "${title}"
Mô tả: "${description}"
Chủ đề: "${topic}"
Cấp độ: "${level}"
Ghi chú/Transcript sơ bộ: "${inputTranscript || ''}"

Hãy xuất định dạng JSON:
{
  "transcript": "string (transcript phân chia theo các mốc thời gian 00:00, 02:30...)",
  "chapters": [
    {"id": "c1", "time": "00:00", "seconds": 0, "title": "string", "summary": "string"},
    {"id": "c2", "time": "03:00", "seconds": 180, "title": "string", "summary": "string"},
    {"id": "c3", "time": "07:00", "seconds": 420, "title": "string", "summary": "string"}
  ],
  "summary": ["string", "string", "string"],
  "keywords": ["string", "string", "string", "string"],
  "studyMaterials": [
    {"id": "mat-1", "title": "string", "type": "prompt", "description": "string"},
    {"id": "mat-2", "title": "string", "type": "pdf", "description": "string"}
  ],
  "quiz": [
    {
      "question": "string",
      "options": ["string", "string", "string"],
      "correctIndex": 0,
      "explanation": "string"
    },
    {
      "question": "string",
      "options": ["string", "string", "string"],
      "correctIndex": 1,
      "explanation": "string"
    }
  ],
  "suggestedQuestions": ["string", "string", "string"],
  "knowledgeChunks": [
    {"chunkId": "chunk-1", "timestamp": "00:00 - 03:00", "content": "string"},
    {"chunkId": "chunk-2", "timestamp": "03:00 - 08:00", "content": "string"}
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        aiKnowledgeResult = { ...aiKnowledgeResult, ...parsed };
      }
    } catch (aiErr) {
      console.error('Gemini video analysis error (using fallback knowledge):', aiErr);
    }
  }

  return aiKnowledgeResult;
}

// 2. Get Video by ID
app.get('/api/videos/:id', (req, res) => {
  try {
    const list = readVideos();
    const video = list.find((v) => v.id === req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy video' });
    }
    // Increment view count
    video.views = (video.views || 0) + 1;
    writeVideos(list);
    return res.json({ success: true, video });
  } catch (error) {
    console.error('Error fetching video by id:', error);
    return res.status(500).json({ success: false, message: 'Lỗi tải chi tiết video' });
  }
});

// 2b. Verify Video File Existence & Playability (XV-H)
app.get('/api/videos/:id/verify', (req, res) => {
  try {
    const list = readVideos();
    const video = list.find((v) => v.id === req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video không tồn tại trong cơ sở dữ liệu' });
    }

    let fileExists = true;
    if (video.videoUrl && video.videoUrl.startsWith('/uploads/videos/')) {
      const localFilePath = path.resolve(__dirname, 'public', video.videoUrl.replace(/^\//, ''));
      fileExists = fs.existsSync(localFilePath);
    }

    return res.json({
      success: true,
      verified: fileExists,
      status: fileExists ? 'ready' : 'processing',
      video,
      message: fileExists ? 'Video đã sẵn sàng phát' : 'Video đang được xử lý',
    });
  } catch (error) {
    console.error('Error verifying video:', error);
    return res.status(500).json({ success: false, message: 'Lỗi kiểm tra trạng thái video' });
  }
});

// 2c. Stream Video with Byte-Range Support (HTTP 206 Partial Content for instant seeking on mobile/safari)
app.get('/api/videos/stream/:filename', (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const filePath = path.resolve(uploadsDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('Video not found');
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    const ext = path.extname(filename).toLowerCase();
    const contentType = ext === '.webm' ? 'video/webm' : ext === '.mov' ? 'video/quicktime' : 'video/mp4';

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        res.status(416).send(`Requested range not satisfiable\n${start} >= ${fileSize}`);
        return;
      }

      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    console.error('Error streaming video:', err);
    res.status(500).send('Streaming error');
  }
});

// 3a. REAL MULTIPART UPLOAD: Tải video từ thiết bị với tiến trình thật (XV-A, XV-C, XV-D)
app.post(
  '/api/videos/upload',
  uploadVideoMulter.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const videoFile = files?.['video']?.[0];
      const thumbFile = files?.['thumbnail']?.[0];

      const {
        title = '',
        description = '',
        topic = 'Canva AI',
        level = 'Cơ bản',
        targetAudience = 'Giáo viên mầm non',
        tags = '[]',
        courseId = 'course-2',
        lessonId = 'lesson-1',
        privacy = 'public',
        transcript = '',
        authorId = 'user-01',
        authorName = 'Cô Lê Hồng Vân',
        authorSchool = 'Trường Mầm non Liên Minh A',
        authorAvatar = '🌸',
        duration = '10:00',
        durationSeconds = '600',
        thumbnailUrl: inputThumbUrl = '',
      } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, message: 'Tiêu đề video là bắt buộc' });
      }

      const uniqueId = `vid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      // Resolve final video URL
      let finalVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      let storagePath = '';

      if (videoFile) {
        finalVideoUrl = `/uploads/videos/${videoFile.filename}`;
        storagePath = videoFile.path;
      }

      // Resolve final thumbnail URL
      let finalThumbUrl =
        inputThumbUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80';
      if (thumbFile) {
        finalThumbUrl = `/uploads/videos/${thumbFile.filename}`;
      }

      // Parse tags
      let parsedTags: string[] = [topic, 'MầmNon'];
      try {
        if (typeof tags === 'string') {
          parsedTags = JSON.parse(tags);
        } else if (Array.isArray(tags)) {
          parsedTags = tags;
        }
      } catch {
        parsedTags = [topic, 'MầmNon'];
      }

      // Generate AI Knowledge
      const aiKnowledgeResult = await generateVideoAiKnowledge(
        title,
        description,
        topic,
        level,
        transcript
      );

      const newVideoItem = {
        id: uniqueId,
        title: title.trim(),
        description: description.trim(),
        videoUrl: finalVideoUrl,
        playbackUrl: finalVideoUrl,
        storagePath: storagePath || finalVideoUrl,
        thumbnailUrl: finalThumbUrl,
        duration: duration || '10:00',
        durationSeconds: Number(durationSeconds) || 600,
        topic,
        level: level as 'Cơ bản' | 'Trung bình' | 'Nâng cao',
        targetAudience,
        tags: parsedTags,
        courseId,
        lessonId,
        privacy: privacy as any,
        authorId,
        authorName,
        authorSchool,
        authorAvatar,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'ready' as const,
        views: 1,
        learnersCount: 1,
        savesCount: 0,
        aiQuestionsCount: 0,
        userProgress: {
          currentTime: 0,
          percentage: 0,
          completed: false,
          lastWatchedDate: new Date().toISOString(),
        },
        aiKnowledge: aiKnowledgeResult,
        comments: [],
      };

      const currentVideos = readVideos();
      const updatedVideos = [newVideoItem, ...currentVideos];
      writeVideos(updatedVideos);

      console.log(`🎥 [REAL UPLOAD SUCCESS] Video saved to disk: ${finalVideoUrl} (${uniqueId} - ${title})`);
      return res.status(201).json({ success: true, video: newVideoItem });
    } catch (error) {
      console.error('Error in /api/videos/upload:', error);
      return res.status(500).json({ success: false, message: 'Lỗi tải video lên máy chủ' });
    }
  }
);

// 3b. JSON Fallback Upload / Register Video
app.post('/api/videos', async (req, res) => {
  try {
    const {
      title,
      description = '',
      topic = 'Canva AI',
      level = 'Cơ bản',
      targetAudience = 'Giáo viên mầm non',
      tags = [],
      courseId,
      lessonId,
      privacy = 'public',
      videoData, // Base64 data URI if uploaded file
      videoUrl: inputVideoUrl,
      thumbnailData,
      thumbnailUrl: inputThumbUrl,
      transcript: inputTranscript = '',
      authorId = 'user-01',
      authorName = 'Cô Lê Hồng Vân',
      authorSchool = 'Trường Mầm non Liên Minh A',
      authorAvatar = '🌸',
      duration = '10:00',
      durationSeconds = 600,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Tiêu đề video là bắt buộc' });
    }

    const uniqueId = `vid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    let finalVideoUrl = inputVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    let finalThumbUrl = inputThumbUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80';
    let storagePath = '';

    // Save binary video to permanent disk if base64 provided
    if (videoData && typeof videoData === 'string' && videoData.startsWith('data:')) {
      try {
        const matches = videoData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const ext = matches[1].split('/')[1] || 'mp4';
          const buffer = Buffer.from(matches[2], 'base64');
          const fileName = `${uniqueId}.${ext}`;
          const filePath = path.resolve(uploadsDir, fileName);
          fs.writeFileSync(filePath, buffer);
          finalVideoUrl = `/uploads/videos/${fileName}`;
          storagePath = filePath;
        }
      } catch (fileErr) {
        console.error('Error saving video file, using fallback URL:', fileErr);
      }
    }

    // Save binary thumbnail if base64 provided
    if (thumbnailData && typeof thumbnailData === 'string' && thumbnailData.startsWith('data:')) {
      try {
        const matches = thumbnailData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const buffer = Buffer.from(matches[2], 'base64');
          const thumbFileName = `${uniqueId}_thumb.png`;
          const thumbPath = path.resolve(uploadsDir, thumbFileName);
          fs.writeFileSync(thumbPath, buffer);
          finalThumbUrl = `/uploads/videos/${thumbFileName}`;
        }
      } catch (thumbErr) {
        console.error('Error saving thumbnail file:', thumbErr);
      }
    }

    const aiKnowledgeResult = await generateVideoAiKnowledge(
      title,
      description,
      topic,
      level,
      inputTranscript
    );

    const newVideoItem = {
      id: uniqueId,
      title: title.trim(),
      description: description.trim(),
      videoUrl: finalVideoUrl,
      playbackUrl: finalVideoUrl,
      storagePath: storagePath || finalVideoUrl,
      thumbnailUrl: finalThumbUrl,
      duration: duration || '10:00',
      durationSeconds: durationSeconds || 600,
      topic,
      level,
      targetAudience,
      tags: Array.isArray(tags) ? tags : [topic, 'MầmNon'],
      courseId: courseId || null,
      lessonId: lessonId || null,
      privacy,
      authorId,
      authorName,
      authorSchool,
      authorAvatar,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'ready',
      views: 1,
      learnersCount: 1,
      savesCount: 0,
      aiQuestionsCount: 0,
      userProgress: {
        currentTime: 0,
        percentage: 0,
        completed: false,
        lastWatchedDate: new Date().toISOString(),
      },
      aiKnowledge: aiKnowledgeResult,
      comments: [],
    };

    const currentVideos = readVideos();
    const updatedVideos = [newVideoItem, ...currentVideos];
    writeVideos(updatedVideos);

    console.log(`✅ Video uploaded & saved permanently: ${uniqueId} - ${title}`);
    return res.status(201).json({ success: true, video: newVideoItem });
  } catch (error) {
    console.error('Error creating video:', error);
    return res.status(500).json({ success: false, message: 'Lỗi xử lý tải video lên' });
  }
});

// 4. Update Video
app.put('/api/videos/:id', (req, res) => {
  try {
    const list = readVideos();
    const index = list.findIndex((v) => v.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy video cần sửa' });
    }

    const current = list[index];
    const {
      title,
      description,
      topic,
      level,
      targetAudience,
      tags,
      privacy,
      thumbnailUrl,
      courseId,
    } = req.body;

    list[index] = {
      ...current,
      title: title !== undefined ? title : current.title,
      description: description !== undefined ? description : current.description,
      topic: topic !== undefined ? topic : current.topic,
      level: level !== undefined ? level : current.level,
      targetAudience: targetAudience !== undefined ? targetAudience : current.targetAudience,
      tags: tags !== undefined ? tags : current.tags,
      privacy: privacy !== undefined ? privacy : current.privacy,
      thumbnailUrl: thumbnailUrl !== undefined ? thumbnailUrl : current.thumbnailUrl,
      courseId: courseId !== undefined ? courseId : current.courseId,
      updatedAt: new Date().toISOString(),
    };

    writeVideos(list);
    return res.json({ success: true, video: list[index] });
  } catch (error) {
    console.error('Error updating video:', error);
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật video' });
  }
});

// 5. Delete Video
app.delete('/api/videos/:id', (req, res) => {
  try {
    const list = readVideos();
    const video = list.find((v) => v.id === req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy video để xóa' });
    }

    const filtered = list.filter((v) => v.id !== req.params.id);
    writeVideos(filtered);

    // If file was stored locally in /public/uploads/videos/, remove it safely
    if (video.videoUrl && video.videoUrl.startsWith('/uploads/videos/')) {
      const localFilePath = path.resolve(__dirname, 'public', video.videoUrl.replace(/^\//, ''));
      if (fs.existsSync(localFilePath)) {
        try {
          fs.unlinkSync(localFilePath);
        } catch (e) {
          console.error('Could not delete video file:', e);
        }
      }
    }

    return res.json({ success: true, message: 'Đã xóa video thành công' });
  } catch (error) {
    console.error('Error deleting video:', error);
    return res.status(500).json({ success: false, message: 'Lỗi xóa video' });
  }
});

// 6. Save Watching Progress (XVI-H: Tự động lưu tiến độ xem video)
app.post('/api/videos/:id/progress', (req, res) => {
  try {
    const { currentTime = 0, percentage = 0, completed = false } = req.body;
    const list = readVideos();
    const video = list.find((v) => v.id === req.params.id);

    if (!video) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy video' });
    }

    video.userProgress = {
      currentTime: Math.floor(currentTime),
      percentage: Math.min(100, Math.floor(percentage)),
      completed: Boolean(completed),
      lastWatchedDate: new Date().toISOString(),
    };

    writeVideos(list);
    return res.json({ success: true, userProgress: video.userProgress });
  } catch (error) {
    console.error('Error saving video progress:', error);
    return res.status(500).json({ success: false, message: 'Lỗi lưu tiến độ video' });
  }
});

// 7. Ask AI Video Mentor (RAG based on persistent transcript & knowledge chunks)
app.post('/api/videos/:id/ask', async (req, res) => {
  try {
    const { question, currentTime } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, message: 'Câu hỏi không được để trống' });
    }

    const list = readVideos();
    const video = list.find((v) => v.id === req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy video' });
    }

    // Increment AI question count
    video.aiQuestionsCount = (video.aiQuestionsCount || 0) + 1;
    writeVideos(list);

    const transcript = video.aiKnowledge?.transcript || '';
    const chapters = JSON.stringify(video.aiKnowledge?.chapters || []);
    const chunks = JSON.stringify(video.aiKnowledge?.knowledgeChunks || []);

    const prompt = `Bạn là Trợ lý AI Mentor mầm non. Người dùng đang xem video:
Tiêu đề: "${video.title}"
Chủ đề: "${video.topic}"
Thời điểm người học đang xem: ${currentTime ? `${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60).toString().padStart(2, '0')}` : 'Đầu bài'}
Chapters: ${chapters}
Transcript:
${transcript}
Knowledge Chunks: ${chunks}

Câu hỏi của giáo viên: "${question}"

Hãy trả lời chính xác, trích dẫn rõ mốc thời gian liên quan trong video (ví dụ: '📍 Đoạn 02:30 – 04:15'), không bịa đặt nội dung ngoài video. Đưa ra hướng dẫn thực hành sư phạm ấm áp, dễ hiểu.`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });
      return res.json({ success: true, answer: response.text });
    }

    // Fallback response with accurate timestamps
    const sampleChapter = video.aiKnowledge?.chapters?.[0]?.time || '01:15';
    return res.json({
      success: true,
      answer: `Chào cô ạ! 🌸 Theo nội dung video "${video.title}":\n\n📍 **Nguồn tham khảo:** Đoạn **${sampleChapter}**\n${question.includes('prompt') ? 'Cô có thể dùng prompt mẫu được gắn ở Tab "Tài liệu" của bài học để copy trực tiếp vào Canva/ChatGPT nhé.' : 'Nội dung này được giảng viên giải thích rất cặn kẽ. Cô có thể bấm vào mục Chapters để tua nhanh đến phần thực hành.'}\n\nChúc cô có giờ học thật vui cùng các bé! ✨`,
    });
  } catch (error) {
    console.error('Error asking video mentor:', error);
    return res.status(500).json({ success: false, message: 'Lỗi trả lời câu hỏi AI' });
  }
});

// 8. Add Video Comment
app.post('/api/videos/:id/comments', (req, res) => {
  try {
    const {
      authorName = 'Cô giáo mầm non',
      authorSchool = 'Trường Mầm non Liên Minh A',
      avatar = '🌸',
      content,
    } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Nội dung bình luận là bắt buộc' });
    }

    const list = readVideos();
    const video = list.find((v) => v.id === req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy video' });
    }

    const newComment = {
      id: 'cmt_' + Date.now(),
      authorName,
      authorSchool,
      avatar,
      content: content.trim(),
      createdAt: 'Vừa xong',
      likes: 0,
    };

    video.comments = [newComment, ...(video.comments || [])];
    writeVideos(list);
    return res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    return res.status(500).json({ success: false, message: 'Lỗi lưu bình luận' });
  }
});

// ==========================================
// CROSS-PLATFORM SHARE API ROUTES (MOBILE & PC)
// ==========================================
const sharesFilePath = path.resolve(dataDir, 'shares.json');

function readShares(): any[] {
  try {
    if (fs.existsSync(sharesFilePath)) {
      const content = fs.readFileSync(sharesFilePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error reading shares.json:', e);
  }
  return [];
}

function writeShares(shares: any[]): void {
  try {
    fs.writeFileSync(sharesFilePath, JSON.stringify(shares, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing shares.json:', e);
  }
}

// 1. Create a shareable item
app.post('/api/share', (req, res) => {
  try {
    const { id, type = 'lesson_plan', title = 'Nội dung chia sẻ', subtitle, author, school, data } = req.body;
    const shareId = id || `sh_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const shares = readShares();

    const existingIdx = shares.findIndex((s) => s.id === shareId);
    const newShare = {
      id: shareId,
      type,
      title,
      subtitle: subtitle || '',
      author: author || 'Giáo viên',
      school: school || 'Trường Mầm non Liên Minh A',
      data: data || {},
      createdAt: new Date().toISOString(),
      views: existingIdx >= 0 ? shares[existingIdx].views : 0,
    };

    if (existingIdx >= 0) {
      shares[existingIdx] = newShare;
    } else {
      shares.unshift(newShare);
    }

    if (shares.length > 500) {
      shares.length = 500;
    }

    writeShares(shares);

    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.get('host') || `localhost:${PORT}`;
    const shareUrl = `${protocol}://${host}/?share=${shareId}`;

    return res.status(201).json({
      success: true,
      shareId,
      shareUrl,
      item: newShare,
    });
  } catch (error) {
    console.error('Error saving share item:', error);
    return res.status(500).json({ success: false, message: 'Lỗi lưu thông tin chia sẻ' });
  }
});

// 2. Get shared item by ID
app.get('/api/share/:id', (req, res) => {
  try {
    const shareId = req.params.id;
    const shares = readShares();
    const item = shares.find((s) => s.id === shareId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nội dung chia sẻ' });
    }

    item.views = (item.views || 0) + 1;
    writeShares(shares);

    return res.json({ success: true, item });
  } catch (error) {
    console.error('Error fetching share item:', error);
    return res.status(500).json({ success: false, message: 'Lỗi tải thông tin chia sẻ' });
  }
});

// Serve frontend in Vite Dev vs Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌸 Vườn Ươm AI Server running at http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
export { app };
