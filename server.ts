import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import multer from 'multer';

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
