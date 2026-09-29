import { UserProfile, AuthResponse, LessonPlan } from '../types';

const TOKEN_KEY = 'vuon_uom_ai_token';
const USER_KEY = 'vuon_uom_ai_user';

export const authService = {
  getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },

  setStoredToken(token: string, rememberMe = true): void {
    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, token);
      sessionStorage.removeItem(TOKEN_KEY);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  getStoredUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setStoredUser(user: UserProfile, rememberMe = true): void {
    const data = JSON.stringify(user);
    if (rememberMe) {
      localStorage.setItem(USER_KEY, data);
      sessionStorage.removeItem(USER_KEY);
    } else {
      sessionStorage.setItem(USER_KEY, data);
      localStorage.removeItem(USER_KEY);
    }
  },

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },

  async getMe(): Promise<AuthResponse> {
    const token = this.getStoredToken();
    if (!token) {
      return { success: false, message: 'Chưa đăng nhập' };
    }
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success && data.user) {
        this.setStoredUser(data.user, Boolean(localStorage.getItem(TOKEN_KEY)));
      }
      return data;
    } catch {
      return { success: false, message: 'Lỗi kết nối máy chủ' };
    }
  },

  async login(email: string, password: string, rememberMe = true): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });
      const data = await res.json();
      if (data.success && data.token && data.user) {
        this.setStoredToken(data.token, rememberMe);
        this.setStoredUser(data.user, rememberMe);
      }
      return data;
    } catch {
      return { success: false, message: 'Lỗi kết nối khi đăng nhập' };
    }
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (data.success && data.token && data.user) {
        // Register starts in unverified state, store session
        this.setStoredToken(data.token, true);
        this.setStoredUser(data.user, true);
      }
      return data;
    } catch {
      return { success: false, message: 'Lỗi kết nối khi đăng ký tài khoản' };
    }
  },

  async loginWithGoogle(email?: string, name?: string, avatar?: string): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, avatar }),
      });
      const data = await res.json();
      if (data.success && data.token && data.user) {
        this.setStoredToken(data.token, true);
        this.setStoredUser(data.user, true);
      }
      return data;
    } catch {
      return { success: false, message: 'Lỗi kết nối Google Auth' };
    }
  },

  async verifyEmail(email: string, codeOrToken: string): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: codeOrToken }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        this.setStoredUser(data.user, Boolean(localStorage.getItem(TOKEN_KEY)));
      }
      return data;
    } catch {
      return { success: false, message: 'Lỗi kết nối khi xác minh email' };
    }
  },

  async resendVerification(email: string): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return await res.json();
    } catch {
      return { success: false, message: 'Lỗi kết nối khi gửi lại email xác minh' };
    }
  },

  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return await res.json();
    } catch {
      return { success: false, message: 'Lỗi kết nối khi khôi phục mật khẩu' };
    }
  },

  async resetPassword(email: string, codeOrToken: string, newPassword: string): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, codeOrToken, newPassword }),
      });
      return await res.json();
    } catch {
      return { success: false, message: 'Lỗi kết nối khi đặt lại mật khẩu' };
    }
  },

  async updateProfile(profileData: Partial<UserProfile>): Promise<AuthResponse> {
    const token = this.getStoredToken();
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (data.success && data.user) {
        this.setStoredUser(data.user, Boolean(localStorage.getItem(TOKEN_KEY)));
      }
      return data;
    } catch {
      return { success: false, message: 'Lỗi kết nối khi cập nhật hồ sơ' };
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
    const token = this.getStoredToken();
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      return await res.json();
    } catch {
      return { success: false, message: 'Lỗi kết nối khi đổi mật khẩu' };
    }
  },

  async savePlan(plan: LessonPlan): Promise<AuthResponse> {
    const token = this.getStoredToken();
    try {
      const res = await fetch('/api/auth/save-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });
      return await res.json();
    } catch {
      return { success: false, message: 'Lỗi lưu giáo án lên máy chủ' };
    }
  },

  async logout(): Promise<void> {
    const token = this.getStoredToken();
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // ignore
    } finally {
      this.clearSession();
    }
  },
};
