import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, AuthResponse, LessonPlan } from '../types';
import { authService } from '../services/authService';
import { INITIAL_USER } from '../data/mockData';

interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<AuthResponse>;
  register: (name: string, email: string, password: string) => Promise<AuthResponse>;
  loginWithGoogle: (email?: string, name?: string, avatar?: string) => Promise<AuthResponse>;
  verifyEmail: (codeOrToken: string, email?: string) => Promise<AuthResponse>;
  resendVerification: (email?: string) => Promise<AuthResponse>;
  forgotPassword: (email: string) => Promise<AuthResponse>;
  resetPassword: (email: string, codeOrToken: string, newPass: string) => Promise<AuthResponse>;
  updateProfile: (data: Partial<UserProfile>) => Promise<AuthResponse>;
  changePassword: (oldPass: string, newPass: string) => Promise<AuthResponse>;
  savePlanToUser: (plan: LessonPlan) => Promise<boolean>;
  logout: () => Promise<void>;
  // Auth Modal helpers
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'verify' | 'forgot';
  authModalMessage: string;
  openAuthModal: (mode?: 'login' | 'register' | 'verify' | 'forgot', message?: string) => void;
  closeAuthModal: () => void;
  // Post-Login Welcome & Emotion Flow (Bảng riêng sau khi đăng nhập)
  showPostLoginModal: boolean;
  openPostLoginModal: () => void;
  closePostLoginModal: () => void;
  todayEmotion: 'vui' | 'buon' | 'de-thuong' | null;
  setTodayEmotion: (emotion: 'vui' | 'buon' | 'de-thuong') => void;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'verify' | 'forgot'>('login');
  const [authModalMessage, setAuthModalMessage] = useState<string>('');

  // Post-login board & Emotion state
  const [showPostLoginModal, setShowPostLoginModal] = useState<boolean>(false);
  const [todayEmotion, setTodayEmotionState] = useState<'vui' | 'buon' | 'de-thuong' | null>(() => {
    try {
      return (localStorage.getItem('mam_ai_today_emotion') as any) || null;
    } catch {
      return null;
    }
  });

  const setTodayEmotion = (emotion: 'vui' | 'buon' | 'de-thuong') => {
    setTodayEmotionState(emotion);
    try {
      localStorage.setItem('mam_ai_today_emotion', emotion);
    } catch {}
  };

  const openPostLoginModal = () => setShowPostLoginModal(true);
  const closePostLoginModal = () => setShowPostLoginModal(false);

  const isEmailVerified = Boolean(user.isEmailVerified);

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      setIsLoading(true);
      const storedUser = authService.getStoredUser();
      const storedToken = authService.getStoredToken();

      if (storedToken && storedUser) {
        if (
          storedUser.school === 'Trường Mầm Non Hoa Sen – Hà Nội' ||
          storedUser.school === 'Trường Mầm Non Họa Mi' ||
          storedUser.school === 'Trường Mầm Non'
        ) {
          storedUser.school = 'Trường Mầm non Liên Minh A';
          authService.setStoredUser(storedUser);
        }
        // optimistic state
        setUser(storedUser);
        setIsAuthenticated(true);

        // verify with backend server
        const res = await authService.getMe();
        if (isMounted) {
          if (res.success && res.user) {
            if (
              res.user.school === 'Trường Mầm Non Hoa Sen – Hà Nội' ||
              res.user.school === 'Trường Mầm Non Họa Mi' ||
              res.user.school === 'Trường Mầm Non'
            ) {
              res.user.school = 'Trường Mầm non Liên Minh A';
              authService.setStoredUser(res.user);
            }
            setUser(res.user);
            setIsAuthenticated(true);
          } else {
            // Token expired or invalid
            authService.clearSession();
            setIsAuthenticated(false);
          }
        }
      } else {
        // Default to initial teacher with verified email for smooth testing if no session
        const defaultTeacher: UserProfile = {
          ...INITIAL_USER,
          isEmailVerified: true,
          savedPlans: [],
          bookmarkedVideoIds: [],
        };
        setUser(defaultTeacher);
        setIsAuthenticated(false);
      }
      if (isMounted) {
        setIsLoading(false);
      }
    }

    initAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const openAuthModal = (
    mode: 'login' | 'register' | 'verify' | 'forgot' = 'login',
    message = ''
  ) => {
    setAuthModalMode(mode);
    setAuthModalMessage(message);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalMessage('');
  };

  const login = async (email: string, password: string, rememberMe = true): Promise<AuthResponse> => {
    setIsLoading(true);
    const res = await authService.login(email, password, rememberMe);
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthenticated(true);
      closeAuthModal();
      setShowPostLoginModal(true);
    }
    setIsLoading(false);
    return res;
  };

  const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    const res = await authService.register(name, email, password);
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthenticated(true);
      // Switch directly to verification screen
      setAuthModalMode('verify');
    }
    setIsLoading(false);
    return res;
  };

  const loginWithGoogle = async (email?: string, name?: string, avatar?: string): Promise<AuthResponse> => {
    setIsLoading(true);
    const res = await authService.loginWithGoogle(email, name, avatar);
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthenticated(true);
      closeAuthModal();
      setShowPostLoginModal(true);
    }
    setIsLoading(false);
    return res;
  };

  const verifyEmail = async (codeOrToken: string, targetEmail?: string): Promise<AuthResponse> => {
    const emailToVerify = targetEmail || user.email;
    const res = await authService.verifyEmail(emailToVerify, codeOrToken);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const resendVerification = async (targetEmail?: string): Promise<AuthResponse> => {
    const emailToResend = targetEmail || user.email;
    return await authService.resendVerification(emailToResend);
  };

  const forgotPassword = async (email: string): Promise<AuthResponse> => {
    return await authService.forgotPassword(email);
  };

  const resetPassword = async (email: string, codeOrToken: string, newPass: string): Promise<AuthResponse> => {
    return await authService.resetPassword(email, codeOrToken, newPass);
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<AuthResponse> => {
    const res = await authService.updateProfile(data);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const changePassword = async (oldPass: string, newPass: string): Promise<AuthResponse> => {
    return await authService.changePassword(oldPass, newPass);
  };

  const savePlanToUser = async (plan: LessonPlan): Promise<boolean> => {
    setUser((prev) => {
      const existing = prev.savedPlans || [];
      const updated = [plan, ...existing.filter((p) => p.id !== plan.id)];
      return { ...prev, savedPlans: updated };
    });

    if (isAuthenticated) {
      const res = await authService.savePlan(plan);
      return res.success;
    }
    return true;
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setIsAuthenticated(false);
    // Reset to guest
    const guestUser: UserProfile = {
      ...INITIAL_USER,
      id: 'guest',
      name: 'Cô giáo Mầm non',
      email: '',
      isEmailVerified: false,
      savedPlans: [],
      bookmarkedVideoIds: [],
    };
    setUser(guestUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isEmailVerified,
        isLoading,
        login,
        register,
        loginWithGoogle,
        verifyEmail,
        resendVerification,
        forgotPassword,
        resetPassword,
        updateProfile,
        changePassword,
        savePlanToUser,
        logout,
        isAuthModalOpen,
        authModalMode,
        authModalMessage,
        openAuthModal,
        closeAuthModal,
        showPostLoginModal,
        openPostLoginModal,
        closePostLoginModal,
        todayEmotion,
        setTodayEmotion,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
