import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FloatingAiButton } from './components/FloatingAiButton';
import { OnboardingModal } from './components/OnboardingModal';
import { SearchModal } from './components/SearchModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AuthModal } from './components/AuthModal';
import { PostLoginFlowModal } from './components/PostLoginFlowModal';
import { EmailVerificationBanner } from './components/EmailVerificationBanner';
import { ExportShareModal } from './components/ExportShareModal';
import { getShare } from './services/shareService';

// Views
import { HomeView } from './views/HomeView';
import { AiAssistantView } from './views/AiAssistantView';
import { LessonStudioView } from './views/LessonStudioView';
import { EnglishBuddyView } from './views/EnglishBuddyView';
import { TeachingPackView } from './views/TeachingPackView';
import { AiAcademyView } from './views/AiAcademyView';
import { AiCreateHubView } from './views/AiCreateHubView';
import { MagicLearningView } from './views/MagicLearningView';
import { VideoStoryVaultView } from './views/VideoStoryVaultView';
import { StoryPoemCreatorView } from './views/StoryPoemCreatorView';
import { BeVuiHocView } from './views/BeVuiHocView';
import { DailyAiPracticeView } from './views/DailyAiPracticeView';
import { LibraryView } from './views/LibraryView';
import { CommunityView } from './views/CommunityView';
import { FamilyModeView } from './views/FamilyModeView';
import { ImpactDashboardView } from './views/ImpactDashboardView';
import { ProfileView } from './views/ProfileView';

// Data & Types & Context
import { MOCK_RESOURCES } from './data/mockData';
import { UserRole, LessonPlan, ResourceItem, CommunityPost, TeachingPack } from './types';
import { sounds } from './utils/audioUtils';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const {
    user,
    isAuthenticated,
    isEmailVerified,
    isAuthModalOpen,
    authModalMode,
    authModalMessage,
    openAuthModal,
    closeAuthModal,
    savePlanToUser,
    setUser,
    showPostLoginModal,
    closePostLoginModal,
    setTodayEmotion,
  } = useAuth();

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [tabExtra, setTabExtra] = useState<Record<string, unknown>>({});

  // Resources state
  const [resources, setResources] = useState<ResourceItem[]>(MOCK_RESOURCES);
  const [savedPlans, setSavedPlans] = useState<LessonPlan[]>([]);

  // Modals
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isGlobalShareModalOpen, setIsGlobalShareModalOpen] = useState(false);

  // Sync saved plans from user profile on login/load
  useEffect(() => {
    if (user?.savedPlans && user.savedPlans.length > 0) {
      setSavedPlans(user.savedPlans);
    }
  }, [user?.savedPlans]);

  // Deep-linking & Cross-platform shared content detection on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const shareId = urlParams.get('share');
    const tabParam = urlParams.get('tab');
    const videoIdParam = urlParams.get('videoId');
    const topicParam = urlParams.get('topic');
    const ageGroupParam = urlParams.get('ageGroup');

    // 1. If opened with a shared item ID (?share=sh_...)
    if (shareId) {
      getShare(shareId).then((res) => {
        if (res.success && res.item) {
          const item = res.item;
          if (item.type === 'lesson_plan') {
            setCurrentTab('lesson-studio');
            setTabExtra({
              plan: item.data,
              topic: item.data?.topic || item.data?.title,
              ageGroup: item.data?.ageGroup,
            });
          } else if (item.type === 'teaching_pack') {
            setCurrentTab('teaching-pack');
            setTabExtra({
              pack: item.data,
              topic: item.data?.packTitle,
              ageGroup: item.data?.ageGroup,
            });
          } else if (item.type === 'video') {
            setCurrentTab('academy');
            setTabExtra({ videoId: item.id || item.data?.id });
          }
        }
      });
      return;
    }

    // 2. Direct tab and parameter deep links (?tab=...&videoId=...&topic=...)
    if (tabParam) {
      setCurrentTab(tabParam);
    }
    if (videoIdParam) {
      setCurrentTab('academy');
      setTabExtra({ videoId: videoIdParam });
    } else if (topicParam) {
      setTabExtra({ topic: topicParam, ageGroup: ageGroupParam || '4–5 tuổi' });
    }
  }, []);

  // Show onboarding once on initial visit
  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenOnboarding_v1');
    if (!hasSeen) {
      setShowOnboarding(true);
      localStorage.setItem('hasSeenOnboarding_v1', 'true');
    }
  }, []);

  const handleNavigate = (tab: string, extra?: Record<string, unknown>) => {
    sounds.playPop();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentTab(tab);
    if (extra) {
      setTabExtra(extra);
    }

    // Keep URL synchronized for cross-device copy & share without page reloads
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      if (extra?.videoId) {
        url.searchParams.set('videoId', String(extra.videoId));
      } else {
        url.searchParams.delete('videoId');
      }
      if (extra?.topic) {
        url.searchParams.set('topic', String(extra.topic));
      } else {
        url.searchParams.delete('topic');
      }
      url.searchParams.delete('share');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleRoleChange = (role: UserRole) => {
    sounds.playPop();
    setUser((prev) => ({ ...prev, role }));
    if (role === 'parent') {
      setCurrentTab('family-mode');
    } else if (role === 'kid') {
      setCurrentTab('teaching-pack');
    } else {
      setCurrentTab('home');
    }
  };

  const handleSavePlanToLibrary = (plan: LessonPlan) => {
    // 1. Save in local state
    setSavedPlans((prev) => [plan, ...prev.filter((p) => p.id !== plan.id)]);

    // 2. Persist permanently to server-side user database (data/users.json)
    savePlanToUser(plan);

    // 3. Also add to public library list
    const newRes: ResourceItem = {
      id: plan.id,
      title: 'Giáo án: ' + plan.title,
      type: 'lesson_plan',
      ageGroup: plan.ageGroup,
      domain: plan.domain,
      author: user.name,
      school: user.school,
      views: 1,
      downloads: 0,
      likes: 1,
      isFavorite: true,
      appliedCount: 1,
      tags: [plan.domain, plan.ageGroup.split('(')[0]],
      createdAt: 'Vừa xong',
      description: plan.objectives.knowledge[0] || 'Giáo án soạn thảo bởi AI Studio.',
    };
    setResources((prev) => [newRes, ...prev]);
  };

  const handleSavePackToLibrary = (pack: TeachingPack) => {
    const newRes: ResourceItem = {
      id: pack.id,
      title: pack.packTitle,
      type: 'story',
      ageGroup: pack.ageGroup,
      domain: 'Tích hợp toàn diện',
      author: user.name,
      school: user.school,
      views: 1,
      downloads: 0,
      likes: 1,
      isFavorite: true,
      appliedCount: 1,
      tags: ['Teaching Pack', pack.ageGroup.split('(')[0]],
      createdAt: 'Vừa xong',
      description: pack.planOverview,
    };
    setResources((prev) => [newRes, ...prev]);
  };

  const handleOpenResource = (res: ResourceItem) => {
    if (res.type === 'lesson_plan') {
      handleNavigate('lesson-studio', { topic: res.title.replace('Giáo án: ', ''), ageGroup: res.ageGroup });
    } else if (res.type === 'english') {
      handleNavigate('english-buddy', { topic: res.title, ageGroup: res.ageGroup });
    } else if (res.type === 'video') {
      handleNavigate('academy', { videoId: res.id });
    } else {
      handleNavigate('teaching-pack', { topic: res.title, ageGroup: res.ageGroup });
    }
  };

  const handleUseCommunityTemplate = (post: CommunityPost) => {
    sounds.playSuccess();
    handleNavigate('lesson-studio', { topic: post.mediaTitle || 'Khám phá quả cam', ageGroup: '4–5 tuổi (Lớp Chồi)' });
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-800 flex flex-col font-['Nunito',sans-serif]">
      {/* Email Verification Warning Banner (Section IX-E) */}
      <EmailVerificationBanner />

      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onTabChange={handleNavigate}
        userRole={user.role}
        onRoleChange={handleRoleChange}
        streakDays={user.streakDays}
        userName={user.name}
        isAuthenticated={isAuthenticated}
        isEmailVerified={isEmailVerified}
        onOpenAuth={() => openAuthModal('login')}
        onOpenSearch={() => setShowSearch(true)}
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenShare={() => setIsGlobalShareModalOpen(true)}
      />

      {/* Main Container - Optimized padding for Mobile (BottomNav) and Desktop */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-28 sm:pb-32 lg:pb-12">
        {currentTab === 'home' && (
          <HomeView user={user} onNavigate={handleNavigate} resources={resources} />
        )}

        {currentTab === 'lesson-studio' && (
          <LessonStudioView
            initialTopic={(tabExtra.topic as string) || 'Khám phá quả cam'}
            initialAgeGroup={(tabExtra.ageGroup as string) || user.ageGroup}
            initialPlan={tabExtra.plan as LessonPlan | undefined}
            onSaveToLibrary={handleSavePlanToLibrary}
            onOpenEnglishBuddy={(topic, ageGroup) =>
              handleNavigate('english-buddy', { topic, ageGroup })
            }
            onOpenTeachingPack={(topic, ageGroup) =>
              handleNavigate('teaching-pack', { topic, ageGroup })
            }
            onShareToCommunity={() => handleNavigate('community')}
          />
        )}

        {currentTab === 'ai-assistant' && (
          <AiAssistantView onNavigateToTab={handleNavigate} />
        )}

        {currentTab === 'english-buddy' && (
          <EnglishBuddyView
            initialTopic={(tabExtra.topic as string) || 'Khám phá quả cam'}
            initialAgeGroup={(tabExtra.ageGroup as string) || user.ageGroup}
          />
        )}

        {currentTab === 'teaching-pack' && (
          <TeachingPackView
            initialTopic={(tabExtra.topic as string) || 'Chủ đề Mẹ và Bé'}
            initialAgeGroup={(tabExtra.ageGroup as string) || user.ageGroup}
            initialPack={tabExtra.pack as TeachingPack | undefined}
            onSaveToLibrary={handleSavePackToLibrary}
            onOpenFamilyMode={() => handleNavigate('family-mode')}
          />
        )}

        {currentTab === 'academy' && (
          <AiAcademyView
            currentUser={user}
            initialVideoId={tabExtra.videoId as string}
          />
        )}

        {currentTab === 'create-hub' && (
          <AiCreateHubView onSelectTool={(toolId) => handleNavigate(toolId)} />
        )}

        {currentTab === 'interactive-games' || currentTab === 'magic-learning' || currentTab === 'game-builder' || currentTab === 'quiz-generator' ? (
          <MagicLearningView
            onNavigateToPack={() => handleNavigate('story-poem-creator')}
            initialOpenQuestions={Boolean(tabExtra?.setupQuestions)}
          />
        ) : null}

        {(currentTab === 'story-poem-creator' || currentTab === 'video-story-vault' || currentTab === 'story-maker') && (
          <StoryPoemCreatorView initialMode={(tabExtra.mode as 'poem' | 'video') || 'poem'} />
        )}

        {(currentTab === 'be-vui-hoc' || currentTab === 'kid-learning' || currentTab === 'coloring-studio') && (
          <BeVuiHocView onBackToHome={() => handleNavigate('home')} />
        )}

        {currentTab === 'daily-practice' && <DailyAiPracticeView />}

        {currentTab === 'library' && (
          <LibraryView
            resources={resources}
            onOpenResource={handleOpenResource}
            onCreateNew={() => handleNavigate('create-hub')}
          />
        )}

        {currentTab === 'community' && (
          <CommunityView onUseTemplate={handleUseCommunityTemplate} />
        )}

        {currentTab === 'family-mode' && <FamilyModeView />}

        {currentTab === 'impact-dashboard' && <ImpactDashboardView />}

        {currentTab === 'profile' && (
          <ProfileView
            user={user}
            savedPlans={savedPlans}
            onOpenPlan={(plan) =>
              handleNavigate('lesson-studio', { topic: plan.title, ageGroup: plan.ageGroup })
            }
            onLogout={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Floating AI Assistant Button (Always available on screen) */}
      <FloatingAiButton onNavigate={handleNavigate} />

      {/* Bottom Fixed Navigation Bar (Mobile) */}
      <BottomNav activeTab={currentTab} onSelectTab={handleNavigate} />

      {/* Authentication Modal (IX-A to IX-U) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
        message={authModalMessage}
      />

      {/* Post-Login Welcome & Emotion Check-in Board */}
      <PostLoginFlowModal
        isOpen={showPostLoginModal}
        onClose={closePostLoginModal}
        userName={user?.name || 'Cô và bé'}
        onSelectEmotion={(emotion) => setTodayEmotion(emotion)}
      />

      {/* Global Modals */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onNavigate={handleNavigate}
      />

      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onNavigate={handleNavigate}
      />

      {/* Global App Export & Share Modal (Works on Phone & Desktop) */}
      <ExportShareModal
        isOpen={isGlobalShareModalOpen}
        onClose={() => setIsGlobalShareModalOpen(false)}
        item={{
          type: 'app',
          title: 'Vườn Ươm AI – Hệ Sinh Thái AI Cho Giáo Viên & Trẻ Mầm Non',
          subtitle: 'Soạn giáo án, video học AI, Teaching Pack dùng mượt mà trên cả Điện thoại & Máy tính',
          data: {},
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

function AppInner() {
  return <AppContent />;
}
