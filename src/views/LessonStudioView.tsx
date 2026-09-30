import React, { useState, useEffect } from 'react';
import { MamAiMascot } from '../components/MamAiMascot';
import {
  Sparkles,
  BookOpen,
  Clock,
  Users,
  CheckCircle2,
  RefreshCw,
  Save,
  Printer,
  Share2,
  Globe,
  Edit3,
  HeartHandshake,
  ArrowRight,
  HelpCircle,
  Volume2,
  Copy,
  FileText,
  Layout,
  Check,
  Building,
  School,
  Sparkle,
  Wand2,
  MessageSquare,
  HelpCircle as QuestionIcon,
  Gamepad2,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { LessonPlan, CornerProposal, CornerPreparation } from '../types';
import { generateLessonPlan, refineLessonSection } from '../services/aiService';
import { sounds, speakText } from '../utils/audioUtils';
import { useAuth } from '../context/AuthContext';
import { ExportShareModal } from '../components/ExportShareModal';

interface LessonStudioViewProps {
  initialTopic?: string;
  initialAgeGroup?: string;
  initialPlan?: LessonPlan;
  onSaveToLibrary: (plan: LessonPlan) => void;
  onOpenEnglishBuddy: (topic: string, ageGroup: string) => void;
  onOpenTeachingPack: (topic: string, ageGroup: string) => void;
  onShareToCommunity: (plan: LessonPlan) => void;
}

export const LessonStudioView: React.FC<LessonStudioViewProps> = ({
  initialTopic = 'Bé vui đón Tết',
  initialAgeGroup = '4–5 tuổi',
  initialPlan,
  onSaveToLibrary,
  onOpenEnglishBuddy,
  onOpenTeachingPack,
  onShareToCommunity,
}) => {
  const { user, savePlanToUser, isAuthenticated, openAuthModal } = useAuth();

  // 1. Form Inputs according to XVII-A
  const [lessonType, setLessonType] = useState<string>('HOAT_DONG_GOC');
  const [activityName, setActivityName] = useState<string>('Hoạt động góc');
  const [theme, setTheme] = useState<string>('Thế giới thực vật');
  const [topic, setTopic] = useState<string>(initialTopic);
  const [ageGroup, setAgeGroup] = useState<string>(initialAgeGroup);
  const [duration, setDuration] = useState<string>('30–35 phút');
  const [teacherName, setTeacherName] = useState<string>(user?.name || 'Cô Hồng Vân');
  const [schoolName, setSchoolName] = useState<string>(user?.school || 'Trường Mầm non Liên Minh A');
  const [childrenCount, setChildrenCount] = useState<number>(25);
  const [specialRequirements, setSpecialRequirements] = useState<string>('');
  const [withEnglish, setWithEnglish] = useState<boolean>(true);
  const [hasSpecialNeeds, setHasSpecialNeeds] = useState<boolean>(false);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<LessonPlan | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'document'>('card');
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Load initial shared plan if provided
  useEffect(() => {
    if (initialPlan) {
      setPlan(initialPlan);
      setTopic(initialPlan.topic || initialPlan.title);
      setAgeGroup(initialPlan.ageGroup);
      if (initialPlan.theme) setTheme(initialPlan.theme);
      if (initialPlan.teacherName) setTeacherName(initialPlan.teacherName);
      if (initialPlan.schoolName) setSchoolName(initialPlan.schoolName);
      if (initialPlan.lessonType) setLessonType(initialPlan.lessonType);
      if (initialPlan.activityName) setActivityName(initialPlan.activityName);
    }
  }, [initialPlan]);

  // Section Editing & AI Refine states
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [refiningKey, setRefiningKey] = useState<string | null>(null);

  // Update teacherName and schoolName when user profile is loaded
  useEffect(() => {
    if (user?.name && (teacherName === 'Cô Hồng Vân' || !teacherName)) {
      setTeacherName(user.name);
    }
    if (user?.school && (schoolName === 'Trường Mầm Non Họa Mi' || schoolName === 'Trường Mầm Non Hoa Sen – Hà Nội' || schoolName === 'Trường Mầm Non')) {
      setSchoolName(user.school);
    }
  }, [user]);

  // Adjust recommended duration based on ageGroup and lessonType
  const handleAgeChange = (newAge: string) => {
    setAgeGroup(newAge);
    if (lessonType === 'HOAT_DONG_GOC') {
      if (newAge.includes('Nhà trẻ')) setDuration('20–25 phút');
      else if (newAge.includes('3–4')) setDuration('25–30 phút');
      else if (newAge.includes('4–5')) setDuration('30–35 phút');
      else setDuration('35–40 phút');
    } else {
      if (newAge.includes('Nhà trẻ')) setDuration('15–20 phút');
      else if (newAge.includes('3–4')) setDuration('20–25 phút');
      else if (newAge.includes('4–5')) setDuration('25–30 phút');
      else setDuration('30–35 phút');
    }
  };

  const handleLessonTypeChange = (newType: string) => {
    setLessonType(newType);
    const typeNames: Record<string, string> = {
      HOAT_DONG_GOC: 'Hoạt động góc',
      HOAT_DONG_HOC: 'Hoạt động học',
      HOAT_DONG_NGOAI_TROI: 'Hoạt động ngoài trời',
      HOAT_DONG_CHIEU: 'Hoạt động chiều',
      HOAT_DONG_TRAI_NGHIEM: 'Hoạt động trải nghiệm',
      HOAT_DONG_TAO_HINH: 'Hoạt động tạo hình',
      LAM_QUEN_VAN_HOC: 'Làm quen văn học',
      KHAM_PHA: 'Khám phá khoa học - xã hội',
      LAM_QUEN_TOAN: 'Làm quen với toán',
      AM_NHAC: 'Giáo dục âm nhạc',
      PHAT_TRIEN_VAN_DONG: 'Phát triển vận động',
      HOAT_DONG_KHAC: 'Hoạt động khác',
    };
    setActivityName(typeNames[newType] || 'Hoạt động mầm non');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sounds.playPop();
    setIsLoading(true);
    setIsSaved(false);

    try {
      const generated = await generateLessonPlan({
        lessonType,
        activityName,
        theme,
        topic,
        ageGroup,
        duration,
        teacherName,
        schoolName,
        childrenCount,
        specialRequirements,
        withEnglish,
        hasSpecialNeeds,
      });

      setPlan(generated);
      sounds.playSuccess();
      showToast('🎉 Đã tạo giáo án mầm non thành công!');
    } catch (err) {
      console.error(err);
      sounds.playRetry();
      showToast('Có lỗi xảy ra khi tạo giáo án. Đã khôi phục dữ liệu mẫu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Section Refine Handler
  const handleRefineSection = async (sectionKey: string, action: string) => {
    if (!plan) return;
    setRefiningKey(`${sectionKey}-${action}`);
    sounds.playPop();

    try {
      const updatedSection = await refineLessonSection({
        lessonPlan: plan,
        sectionKey,
        action,
      });

      if (updatedSection) {
        setPlan((prev) => (prev ? { ...prev, [sectionKey]: updatedSection } : null));
        sounds.playSuccess();
        showToast(`✨ Đã tinh chỉnh phần "${sectionKey}" theo yêu cầu!`);
      }
    } catch (err) {
      console.error('Refine failed:', err);
      sounds.playRetry();
    } finally {
      setRefiningKey(null);
    }
  };

  // Save to Library & Database
  const handleSave = async () => {
    if (!plan) return;
    sounds.playSuccess();
    setIsSaved(true);

    // Save in context/local
    onSaveToLibrary({ ...plan, isSaved: true });

    // Save to user account persistent backend storage
    if (isAuthenticated) {
      const success = await savePlanToUser(plan);
      if (success) {
        showToast('💖 Đã lưu giáo án vĩnh viễn vào tài khoản của cô!');
      } else {
        showToast('Đã lưu giáo án vào bộ nhớ trình duyệt!');
      }
    } else {
      showToast('Đã lưu vào bộ sưu tập! Đăng nhập để đồng bộ trên mọi thiết bị.');
    }
  };

  // Copy full plan text
  const handleCopy = () => {
    if (!plan) return;
    const text = generatePlainTextLesson(plan);
    navigator.clipboard.writeText(text);
    setCopied(true);
    sounds.playSuccess();
    showToast('📋 Đã sao chép toàn bộ giáo án vào clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  // Export as Word (.doc)
  const handleExportWord = () => {
    if (!plan) return;
    sounds.playSuccess();

    const isCorner = plan.lessonType === 'HOAT_DONG_GOC' || plan.title.includes('GÓC');

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${plan.title}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.5; margin: 2cm; }
          .header-table { width: 100%; border: none; margin-bottom: 20px; }
          .header-left { text-align: center; width: 45%; vertical-align: top; }
          .header-right { text-align: center; width: 55%; vertical-align: top; }
          .bold { font-weight: bold; }
          .title { text-align: center; font-size: 18pt; font-weight: bold; margin: 25px 0 10px 0; }
          .subtitle { text-align: center; font-size: 15pt; font-weight: bold; margin-bottom: 15px; }
          .meta-info { margin-bottom: 20px; font-size: 13pt; }
          h2 { font-size: 14pt; font-weight: bold; text-transform: uppercase; margin-top: 15px; }
          h3 { font-size: 13pt; font-weight: bold; margin-top: 10px; }
          table.procedure-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          table.procedure-table th, table.procedure-table td { border: 1px solid black; padding: 8px; text-align: left; vertical-align: top; }
          table.procedure-table th { background-color: #f2f2f2; text-align: center; }
          ul { margin-top: 5px; margin-bottom: 5px; padding-left: 20px; }
        </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td class="header-left">
              <div class="bold">${plan.schoolName || user?.school || 'TRƯỜNG MẦM NON LIÊN MINH A'}</div>
              <div>Tổ Chuyên Môn Mầm Non</div>
            </td>
            <td class="header-right">
              <div class="bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div class="bold">Độc lập - Tự do - Hạnh phúc</div>
              <div>--------------------</div>
            </td>
          </tr>
        </table>

        <div class="title">GIÁO ÁN</div>
        <div class="subtitle">${plan.activityName ? plan.activityName.toUpperCase() : 'HOẠT ĐỘNG GÓC'}</div>

        <div class="meta-info">
          <p><strong>- Chủ đề:</strong> ${plan.theme || 'Thế giới quanh bé'}</p>
          <p><strong>- Đề tài / Nội dung:</strong> ${plan.topic || plan.title}</p>
          <p><strong>- Đối tượng:</strong> Trẻ ${plan.ageGroup}</p>
          <p><strong>- Số lượng trẻ:</strong> ${plan.childrenCount || 25} trẻ</p>
          <p><strong>- Thời gian thực hiện:</strong> ${plan.duration}</p>
          <p><strong>- Giáo viên thực hiện:</strong> ${plan.teacherName || 'Cô giáo'}</p>
        </div>

        ${
          isCorner && plan.cornerProposals && plan.cornerProposals.length > 0
            ? `
          <h2>I. DỰ KIẾN GÓC CHƠI</h2>
          <ul>
            ${plan.cornerProposals
              .map(
                (c) =>
                  `<li><strong>- ${c.cornerName}:</strong> ${c.activityContent} <em>(Chuẩn bị: ${c.materials || ''})</em></li>`
              )
              .join('')}
          </ul>
        `
            : ''
        }

        <h2>${isCorner ? 'II' : 'I'}. MỤC TIÊU</h2>
        <h3>1. Kiến thức:</h3>
        <ul>${plan.objectives.knowledge.map((k) => `<li>${k}</li>`).join('')}</ul>
        <h3>2. Kỹ năng:</h3>
        <ul>${plan.objectives.skills.map((s) => `<li>${s}</li>`).join('')}</ul>
        <h3>3. Thái độ:</h3>
        <ul>${plan.objectives.attitude.map((a) => `<li>${a}</li>`).join('')}</ul>

        <h2>${isCorner ? 'III' : 'II'}. CHUẨN BỊ</h2>
        ${
          plan.preparation.general && plan.preparation.general.length > 0
            ? `<h3>- Chuẩn bị chung:</h3><ul>${plan.preparation.general
                .map((g) => `<li>${g}</li>`)
                .join('')}</ul>`
            : ''
        }
        ${
          plan.preparation.byCorner && plan.preparation.byCorner.length > 0
            ? `<h3>- Chuẩn bị theo từng góc:</h3>
              <ul>${plan.preparation.byCorner
                .map((bc) => `<li><strong>+ ${bc.corner}:</strong> ${bc.items.join(', ')}</li>`)
                .join('')}</ul>`
            : `
              <h3>- Đồ dùng của cô:</h3><ul>${plan.preparation.teacher
                .map((t) => `<li>${t}</li>`)
                .join('')}</ul>
              <h3>- Đồ dùng của trẻ:</h3><ul>${plan.preparation.children
                .map((c) => `<li>${c}</li>`)
                .join('')}</ul>
            `
        }

        <h2>${isCorner ? 'IV' : 'III'}. TIẾN TRÌNH HOẠT ĐỘNG</h2>
        <table class="procedure-table">
          <thead>
            <tr>
              <th style="width: 25%;">Các bước tiến hành</th>
              <th style="width: 40%;">Hoạt động của giáo viên</th>
              <th style="width: 35%;">Hoạt động của trẻ</th>
            </tr>
          </thead>
          <tbody>
            ${plan.procedure
              .map(
                (step) => `
              <tr>
                <td><strong>${step.phase}</strong></td>
                <td>
                  <p>${step.teacherActivity}</p>
                  ${
                    step.guidingQuestions && step.guidingQuestions.length > 0
                      ? `<p><em>* Câu hỏi gợi mở:</em><br/>- ${step.guidingQuestions.join(
                          '<br/>- '
                        )}</p>`
                      : ''
                  }
                </td>
                <td>${step.childrenActivity}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        ${
          plan.englishIntegration
            ? `
          <h2>${isCorner ? 'V' : 'IV'}. TÍCH HỢP TIẾNG ANH (ENGLISH BUDDY)</h2>
          <p><strong>- Từ vựng:</strong> ${plan.englishIntegration.vocabulary
            .map((v) => `${v.word} (${v.meaning})`)
            .join(', ')}</p>
          <p><strong>- Khẩu lệnh giao tiếp:</strong> ${plan.englishIntegration.classroomEnglish
            .map((c) => `"${c.en || c.phrase}" - ${c.vi || c.meaning}`)
            .join(' | ')}</p>
          <p><strong>- Mini Game:</strong> ${plan.englishIntegration.miniGame || ''}</p>
        `
            : ''
        }

        ${
          plan.adaptation
            ? `
          <h2>${isCorner ? 'VI' : 'V'}. ĐIỀU CHỈNH HỖ TRỢ TRẺ</h2>
          <p>${plan.adaptation}</p>
        `
            : ''
        }

        <p style="margin-top: 40px; text-align: right; font-style: italic;">
          Ngày ...... tháng ...... năm 202...<br/>
          <strong>Giáo viên thực hiện</strong><br/><br/><br/>
          ${plan.teacherName || 'Cô giáo'}
        </p>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + htmlContent], {
      type: 'application/msword;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Giao_An_${(plan.topic || 'Mam_Non')
      .replace(/\s+/g, '_')
      .toLowerCase()}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('📄 Đã tải xuống file Word (.doc) thành công!');
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to generate clean plain text representation
  const generatePlainTextLesson = (p: LessonPlan): string => {
    const isCorner = p.lessonType === 'HOAT_DONG_GOC' || p.title.includes('GÓC');
    let text = `GIÁO ÁN: ${(p.activityName || p.title).toUpperCase()}\n`;
    text += `Chủ đề: ${p.theme || 'Thế giới quanh bé'}\n`;
    text += `Đề tài: ${p.topic || p.title}\n`;
    text += `Đối tượng: Trẻ ${p.ageGroup}\n`;
    text += `Thời gian: ${p.duration}\n`;
    text += `Giáo viên: ${p.teacherName || user?.name || 'Cô giáo'}\n`;
    text += `Trường: ${p.schoolName || user?.school || 'Trường Mầm non Liên Minh A'}\n\n`;

    if (isCorner && p.cornerProposals && p.cornerProposals.length > 0) {
      text += `I. DỰ KIẾN GÓC CHƠI:\n`;
      p.cornerProposals.forEach((c) => {
        text += `- ${c.cornerName}: ${c.activityContent} (Chuẩn bị: ${c.materials || ''})\n`;
      });
      text += `\n`;
    }

    text += `${isCorner ? 'II' : 'I'}. MỤC TIÊU:\n`;
    text += `1. Kiến thức:\n${p.objectives.knowledge.map((k) => `  - ${k}`).join('\n')}\n`;
    text += `2. Kỹ năng:\n${p.objectives.skills.map((s) => `  - ${s}`).join('\n')}\n`;
    text += `3. Thái độ:\n${p.objectives.attitude.map((a) => `  - ${a}`).join('\n')}\n\n`;

    text += `${isCorner ? 'III' : 'II'}. CHUẨN BỊ:\n`;
    if (p.preparation.general && p.preparation.general.length > 0) {
      text += `Chuẩn bị chung:\n${p.preparation.general.map((g) => `  - ${g}`).join('\n')}\n`;
    }
    if (p.preparation.byCorner && p.preparation.byCorner.length > 0) {
      text += `Chuẩn bị theo góc:\n`;
      p.preparation.byCorner.forEach((bc) => {
        text += `  + ${bc.corner}: ${bc.items.join(', ')}\n`;
      });
    } else {
      text += `Của cô:\n${p.preparation.teacher.map((t) => `  - ${t}`).join('\n')}\n`;
      text += `Của trẻ:\n${p.preparation.children.map((c) => `  - ${c}`).join('\n')}\n`;
    }
    text += `\n`;

    text += `${isCorner ? 'IV' : 'III'}. TIẾN TRÌNH HOẠT ĐỘNG:\n`;
    p.procedure.forEach((step, idx) => {
      text += `${idx + 1}. ${step.phase}\n`;
      text += `* Hoạt động của cô: ${step.teacherActivity}\n`;
      text += `* Hoạt động của trẻ: ${step.childrenActivity}\n`;
      if (step.guidingQuestions && step.guidingQuestions.length > 0) {
        text += `* Câu hỏi gợi mở: ${step.guidingQuestions.join('; ')}\n`;
      }
      text += `\n`;
    });

    if (p.englishIntegration) {
      text += `${isCorner ? 'V' : 'IV'}. TÍCH HỢP TIẾNG ANH (ENGLISH BUDDY):\n`;
      text += `Từ vựng: ${p.englishIntegration.vocabulary.map((v) => `${v.word} (${v.meaning})`).join(', ')}\n`;
      text += `Khẩu lệnh: ${p.englishIntegration.classroomEnglish.map((c) => `${c.en || c.phrase}: ${c.vi || c.meaning}`).join(' | ')}\n`;
      text += `Mini Game: ${p.englishIntegration.miniGame || ''}\n\n`;
    }

    if (p.adaptation) {
      text += `${isCorner ? 'VI' : 'V'}. ĐIỀU CHỈNH HỖ TRỢ TRẺ:\n${p.adaptation}\n\n`;
    }

    return text;
  };

  const isCorner = plan ? (plan.lessonType === 'HOAT_DONG_GOC' || plan.title.includes('GÓC')) : (lessonType === 'HOAT_DONG_GOC');

  return (
    <div className="space-y-6 animate-fadeIn pb-24 max-w-5xl mx-auto px-2 sm:px-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-stone-900/90 backdrop-blur-md text-white text-xs sm:text-sm font-bold shadow-xl border border-stone-700/80 animate-bounce flex items-center gap-2">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner - Vườn Ươm AI Style (Pastel Pink, Peach Orange, Lavender) */}
      <div className="bg-gradient-to-r from-pink-50 via-rose-50/70 to-purple-50/80 rounded-3xl p-5 sm:p-7 border border-pink-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_4px_24px_rgba(244,114,182,0.08)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-rose-700 text-xs font-black mb-2 shadow-2xs border border-pink-200">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>AI Lesson Studio · Chuẩn Chuyên Môn Mầm Non</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight font-['Quicksand'] flex items-center gap-2">
            <span>✨ AI Soạn Giáo Án Mầm Non</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium leading-relaxed">
            “Cô học AI – Bé học vui – Cộng đồng cùng lan tỏa.”
            <br />
            Soạn đúng cấu trúc <strong>Hoạt động góc</strong> & các lĩnh vực mầm non chuyên nghiệp của Bộ GD&ĐT.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <MamAiMascot size="lg" mood={isLoading ? 'thinking' : plan ? 'happy' : 'teaching'} />
        </div>
      </div>

      {/* Main Form - XVII-A */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-7 border border-pink-100 shadow-[0_4px_20px_rgba(244,114,182,0.06)] space-y-5">
        <div className="flex items-center justify-between border-b border-pink-100 pb-3">
          <h2 className="text-sm sm:text-base font-black text-stone-900 flex items-center gap-2 font-['Quicksand']">
            <BookOpen className="w-4 h-4 text-rose-500" />
            <span>Thông Tin Soạn Giáo Án Chuyên Môn</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </h2>
          <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            {lessonType === 'HOAT_DONG_GOC' ? 'Mẫu Hoạt Động Góc (5 Góc)' : 'Mẫu Giáo Án Chuẩn'}
          </span>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Loại hoạt động (Dropdown XVII-A) */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                1. Loại hoạt động <span className="text-rose-600">*</span>
              </label>
              <select
                value={lessonType}
                onChange={(e) => handleLessonTypeChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 text-xs sm:text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white cursor-pointer"
              >
                <option value="HOAT_DONG_GOC">🌟 Hoạt động góc (Chuẩn 5 góc)</option>
                <option value="HOAT_DONG_HOC">Hoạt động học</option>
                <option value="HOAT_DONG_NGOAI_TROI">Hoạt động ngoài trời</option>
                <option value="HOAT_DONG_CHIEU">Hoạt động chiều</option>
                <option value="HOAT_DONG_TRAI_NGHIEM">Hoạt động trải nghiệm</option>
                <option value="HOAT_DONG_TAO_HINH">Hoạt động tạo hình</option>
                <option value="LAM_QUEN_VAN_HOC">Làm quen văn học</option>
                <option value="KHAM_PHA">Khám phá khoa học - xã hội</option>
                <option value="LAM_QUEN_TOAN">Làm quen với toán</option>
                <option value="AM_NHAC">Âm nhạc</option>
                <option value="PHAT_TRIEN_VAN_DONG">Phát triển vận động</option>
                <option value="HOAT_DONG_KHAC">Hoạt động khác</option>
              </select>
            </div>

            {/* 2. Tên hoạt động */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                2. Tên hoạt động <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                placeholder="Ví dụ: Hoạt động góc, Khám phá..."
                required
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 text-xs sm:text-sm font-bold text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white"
              />
            </div>

            {/* 3. Chủ đề */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                3. Chủ đề lớn <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Ví dụ: Thế giới thực vật, Tết & Mùa xuân..."
                required
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 text-xs sm:text-sm font-bold text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white"
              />
            </div>

            {/* 4. Đề tài / Nội dung */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-stone-800 mb-1">
                4. Đề tài / Nội dung cụ thể <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ví dụ: Bé vui đón Tết, Làm bánh mứt, Khám phá quả cam..."
                required
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 text-xs sm:text-sm font-bold text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white"
              />
            </div>

            {/* 5. Độ tuổi (Dropdown XVII-A) */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                5. Độ tuổi của trẻ <span className="text-rose-600">*</span>
              </label>
              <select
                value={ageGroup}
                onChange={(e) => handleAgeChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 text-xs sm:text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white cursor-pointer"
              >
                <option value="Nhà trẻ 24–36 tháng">Nhà trẻ 24–36 tháng</option>
                <option value="3–4 tuổi">3–4 tuổi (Lớp Mầm)</option>
                <option value="4–5 tuổi">4–5 tuổi (Lớp Chồi)</option>
                <option value="5–6 tuổi">5–6 tuổi (Lớp Lá)</option>
              </select>
            </div>

            {/* 6. Thời gian thực hiện */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                6. Thời gian (AI gợi ý, có thể sửa)
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ví dụ: 30–35 phút"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 text-xs sm:text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white"
              />
            </div>

            {/* 7. Giáo viên (Tự động từ profile, cho phép sửa) */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                7. Giáo viên thực hiện
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="Tên giáo viên"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 text-xs sm:text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white"
              />
            </div>

            {/* 8. Số lượng trẻ (Không bắt buộc) */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                8. Số lượng trẻ (tùy chọn)
              </label>
              <input
                type="number"
                min={5}
                max={50}
                value={childrenCount}
                onChange={(e) => setChildrenCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pink-50/30 border border-pink-200 text-xs sm:text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white"
              />
            </div>
          </div>

          {/* 9. Yêu cầu riêng (Textarea XVII-A) */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              9. Yêu cầu riêng của cô
            </label>
            <textarea
              rows={2}
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              placeholder="Nhập những yêu cầu cô muốn AI chú ý (ví dụ: nhấn mạnh góc xây dựng chợ hoa, tận dụng nguyên vật liệu mở, tạo không khí vui tươi rộn ràng...)"
              className="w-full px-3.5 py-2 rounded-2xl bg-pink-50/20 border border-pink-200 text-xs font-medium text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white resize-none"
            />
          </div>

          {/* 10 & 11. Toggles (English Buddy & Hỗ trợ trẻ) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* 10. Tích hợp English Buddy */}
            <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-purple-50/70 to-pink-50/60 border border-purple-200/80 rounded-2xl">
              <div>
                <span className="text-xs font-black text-purple-900 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-purple-600" />
                  🌎 Tích hợp tiếng Anh như ngôn ngữ thứ hai
                </span>
                <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                  English Buddy gợi ý từ vựng, khẩu lệnh nhập vai góc chơi
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={withEnglish}
                  onChange={(e) => setWithEnglish(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* 11. Điều chỉnh cho trẻ */}
            <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-rose-50/70 to-amber-50/60 border border-rose-200/80 rounded-2xl">
              <div>
                <span className="text-xs font-black text-rose-900 flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-rose-600" />
                  ♡ Có trẻ cần hỗ trợ trong lớp
                </span>
                <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                  AI gợi ý điều chỉnh học liệu, bạn kèm và động viên tâm lý
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasSpecialNeeds}
                  onChange={(e) => setHasSpecialNeeds(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white font-black text-sm shadow-md shadow-pink-500/25 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>🌱 Mầm AI đang soạn giáo án theo mẫu chuẩn...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4.5 h-4.5 text-pink-200" />
                  <span>✨ TẠO GIÁO ÁN</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Loading Placeholder */}
      {isLoading && (
        <div className="p-8 rounded-3xl bg-white border border-pink-200 text-center space-y-4 animate-pulse shadow-sm">
          <div className="mx-auto w-20 h-20 flex items-center justify-center">
            <MamAiMascot size="lg" mood="thinking" />
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-stone-900 text-base font-['Quicksand']">
              🌱 Mầm AI đang áp dụng mẫu chuẩn {lessonType === 'HOAT_DONG_GOC' ? 'Hoạt Động Góc' : activityName}...
            </h3>
            <p className="text-xs text-stone-600 font-medium">
              Đang tối ưu 3 nhóm mục tiêu (Kiến thức, Kỹ năng, Thái độ), chuẩn bị học liệu từng góc và tiến trình tương tác sư phạm.
            </p>
          </div>
        </div>
      )}

      {/* Plan Result */}
      {plan && !isLoading && (
        <div className="space-y-4">
          {/* Action & View Mode Toolbar */}
          <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-pink-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            {/* View Mode Toggle: Card vs A4 Document */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('card')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'card'
                    ? 'bg-white text-rose-700 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Layout className="w-3.5 h-3.5" />
                <span>Thẻ trực quan</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('document')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'document'
                    ? 'bg-white text-rose-700 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Văn bản A4 chuẩn Word</span>
              </button>
            </div>

            {/* Action Buttons: Export Word, PDF, Copy, Save */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold border border-stone-200 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Sao chép toàn bộ văn bản"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportWord}
                className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-black border border-blue-200 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Tải file Microsoft Word"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Tải Word (.doc)</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold border border-stone-200 transition-all flex items-center gap-1.5 cursor-pointer"
                title="In hoặc Lưu PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">In / PDF</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaved}
                className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaved ? 'Đã lưu tài khoản 💖' : 'Lưu giáo án'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 via-rose-500 to-purple-600 text-white text-xs font-black shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Xuất & Chia sẻ dùng được cả trên điện thoại và máy tính"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Xuất & Chia sẻ (Đa thiết bị)</span>
              </button>
            </div>
          </div>

          {/* VIEW MODE 1: INTERACTIVE CARD VIEW */}
          {viewMode === 'card' && (
            <div className="bg-white/95 rounded-3xl p-5 sm:p-8 border border-pink-200/90 shadow-[0_6px_24px_rgba(244,114,182,0.08)] space-y-6">
              {/* Official Header Badge */}
              <div className="text-center space-y-2 pb-4 border-b border-pink-100">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-black border border-rose-200">
                  <span>🏛️ {plan.schoolName || user?.school || 'Trường Mầm non Liên Minh A'}</span>
                  <span>•</span>
                  <span>{plan.teacherName || user?.name || 'GIÁO VIÊN'}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight font-['Quicksand']">
                  {plan.title}
                </h2>

                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-stone-600 font-semibold">
                  <span className="bg-pink-100/80 text-rose-800 px-2.5 py-0.5 rounded-lg border border-pink-200">
                    Chủ đề: {plan.theme || 'Thế giới quanh bé'}
                  </span>
                  <span>•</span>
                  <span className="bg-purple-100/80 text-purple-800 px-2.5 py-0.5 rounded-lg border border-purple-200">
                    Đề tài: {plan.topic || plan.title}
                  </span>
                  <span>•</span>
                  <span>Đối tượng: Trẻ {plan.ageGroup}</span>
                  <span>•</span>
                  <span>Thời gian: {plan.duration}</span>
                </div>
              </div>

              {/* I. DỰ KIẾN GÓC CHƠI (Chỉ hiển thị cho Hoạt động góc) */}
              {isCorner && plan.cornerProposals && plan.cornerProposals.length > 0 && (
                <div className="space-y-3 p-4 sm:p-5 bg-gradient-to-r from-pink-50/50 via-rose-50/40 to-purple-50/40 rounded-2xl border border-pink-200/80">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2 font-['Quicksand']">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      I. Dự Kiến Góc Chơi (Đặc Thù Hoạt Động Góc)
                    </h3>

                    {/* Section AI Refine Bar */}
                    <div className="flex items-center gap-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => handleRefineSection('cornerProposals', 'expand')}
                        disabled={Boolean(refiningKey)}
                        className="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-700 font-bold border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        title="Mở rộng chi tiết nội dung chơi"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>Mở rộng góc</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {plan.cornerProposals.map((corner, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-3.5 bg-white rounded-xl border border-pink-200 shadow-2xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-rose-800 text-sm flex items-center gap-1.5">
                            <span className="text-base">
                              {cIdx === 0 ? '🎭' : cIdx === 1 ? '🧱' : cIdx === 2 ? '🎨' : cIdx === 3 ? '🔢' : '📚'}
                            </span>
                            {corner.cornerName}
                          </span>
                          <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md font-bold">
                            Góc {cIdx + 1}
                          </span>
                        </div>
                        <p className="text-stone-700 leading-relaxed font-medium">
                          {corner.activityContent}
                        </p>
                        {corner.materials && (
                          <div className="pt-1 border-t border-stone-100 text-[11px] text-stone-500">
                            <strong>Đồ dùng:</strong> {corner.materials}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* II. MỤC TIÊU (Objectives) - 3 Nhóm Chuẩn XVII-C */}
              <div className="space-y-3 p-4 sm:p-5 bg-gradient-to-r from-amber-50/50 via-rose-50/40 to-pink-50/40 rounded-2xl border border-pink-200/80">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2 font-['Quicksand']">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    {isCorner ? 'II' : 'I'}. Mục Tiêu Hoạt Động (3 Nhóm Chuẩn)
                  </h3>

                  {/* Refine Buttons */}
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleRefineSection('objectives', 'better')}
                      disabled={Boolean(refiningKey)}
                      className="px-2 py-1 rounded-lg bg-white hover:bg-amber-50 text-amber-800 font-bold border border-amber-200 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Viết hay hơn</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRefineSection('objectives', 'age_appropriate')}
                      disabled={Boolean(refiningKey)}
                      className="px-2 py-1 rounded-lg bg-white hover:bg-amber-50 text-amber-800 font-bold border border-amber-200 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <Users className="w-3 h-3 text-amber-500" />
                      <span>Chuẩn độ tuổi</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Kiến thức */}
                  <div className="p-3.5 bg-white rounded-xl border border-pink-200 shadow-2xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-black text-rose-700 text-xs">
                      <span>📖</span>
                      <span>1. Kiến thức:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-stone-700 font-medium">
                      {plan.objectives.knowledge.map((k, i) => (
                        <li key={i}>{k}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Kỹ năng */}
                  <div className="p-3.5 bg-white rounded-xl border border-pink-200 shadow-2xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-black text-amber-800 text-xs">
                      <span>🛠️</span>
                      <span>2. Kỹ năng:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-stone-700 font-medium">
                      {plan.objectives.skills.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Thái độ */}
                  <div className="p-3.5 bg-white rounded-xl border border-pink-200 shadow-2xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-black text-emerald-800 text-xs">
                      <span>🌱</span>
                      <span>3. Thái độ:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-stone-700 font-medium">
                      {plan.objectives.attitude.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* III. CHUẨN BỊ (Preparation) */}
              <div className="space-y-3 p-4 sm:p-5 bg-gradient-to-r from-purple-50/50 via-pink-50/40 to-rose-50/40 rounded-2xl border border-pink-200/80">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2 font-['Quicksand']">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    {isCorner ? 'III' : 'II'}. Chuẩn Bị Học Liệu
                  </h3>
                </div>

                {/* Chuẩn bị chung */}
                {plan.preparation.general && plan.preparation.general.length > 0 && (
                  <div className="p-3 bg-white/90 rounded-xl border border-purple-200 text-xs space-y-1">
                    <span className="font-black text-purple-900 block">✨ Chuẩn bị chung (Không gian, an toàn, âm nhạc):</span>
                    <ul className="list-disc list-inside space-y-0.5 text-stone-700 font-medium">
                      {plan.preparation.general.map((g, i) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Chuẩn bị theo góc (nếu có) */}
                {plan.preparation.byCorner && plan.preparation.byCorner.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                    {plan.preparation.byCorner.map((bc, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-pink-200 shadow-2xs space-y-1">
                        <span className="font-black text-rose-800 block">+{bc.corner}:</span>
                        <p className="text-stone-700 font-medium leading-relaxed">
                          {bc.items.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 bg-white rounded-xl border border-pink-200 shadow-2xs">
                      <span className="font-black text-stone-900 block mb-1">👩‍🏫 Đồ dùng của cô:</span>
                      <ul className="list-disc list-inside space-y-1 text-stone-700 font-medium">
                        {plan.preparation.teacher.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl border border-pink-200 shadow-2xs">
                      <span className="font-black text-stone-900 block mb-1">👶 Đồ dùng của trẻ:</span>
                      <ul className="list-disc list-inside space-y-1 text-stone-700 font-medium">
                        {plan.preparation.children.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* IV. TIẾN TRÌNH HOẠT ĐỘNG (Procedure) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2 font-['Quicksand']">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    {isCorner ? 'IV' : 'III'}. Tiến Trình Tổ Chức Hoạt Động
                  </h3>

                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleRefineSection('procedure', 'add_questions')}
                      disabled={Boolean(refiningKey)}
                      className="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-700 font-bold border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <QuestionIcon className="w-3 h-3" />
                      <span>Thêm câu hỏi gợi mở</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRefineSection('procedure', 'expand')}
                      disabled={Boolean(refiningKey)}
                      className="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-700 font-bold border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>Chi tiết lời thoại</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {plan.procedure.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-pink-200 shadow-2xs hover:border-rose-300 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-sm text-rose-800 font-['Quicksand']">
                          {step.phase}
                        </h4>
                        <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                          Giai đoạn {idx + 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-pink-50/40 rounded-xl border border-pink-100">
                          <span className="font-bold text-rose-950 block mb-1">
                            👩‍🏫 Hoạt động của cô:
                          </span>
                          <p className="text-stone-700 leading-relaxed font-medium">
                            {step.teacherActivity}
                          </p>
                        </div>

                        <div className="p-3 bg-purple-50/40 rounded-xl border border-purple-100">
                          <span className="font-bold text-purple-950 block mb-1">
                            👶 Hoạt động của trẻ:
                          </span>
                          <p className="text-stone-700 leading-relaxed font-medium">
                            {step.childrenActivity}
                          </p>
                        </div>
                      </div>

                      {step.guidingQuestions && step.guidingQuestions.length > 0 && (
                        <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200 text-xs">
                          <span className="font-bold text-amber-950 flex items-center gap-1 mb-1">
                            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                            Hệ thống câu hỏi gợi mở phát triển tư duy:
                          </span>
                          <ul className="list-disc list-inside space-y-0.5 text-amber-900 font-semibold">
                            {step.guidingQuestions.map((q, qIdx) => (
                              <li key={qIdx}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* V. TÍCH HỢP TIẾNG ANH (English Integration) */}
              {plan.englishIntegration && (
                <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-50 via-pink-50/50 to-purple-50 rounded-2xl border border-purple-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-purple-950 uppercase tracking-wider flex items-center gap-2 font-['Quicksand']">
                      <Globe className="w-4 h-4 text-purple-600" />
                      {isCorner ? 'V' : 'IV'}. Tích Hợp Tiếng Anh Mầm Non (English Buddy)
                    </h3>
                    <button
                      type="button"
                      onClick={() => onOpenEnglishBuddy(topic, ageGroup)}
                      className="text-xs font-black text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                    >
                      Luyện phát âm & Giáo án tiếng Anh <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                    {plan.englishIntegration.vocabulary.map((v, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-white rounded-xl border border-purple-200 flex items-center justify-between text-xs shadow-2xs"
                      >
                        <div>
                          <span className="font-black text-stone-900 text-sm block">{v.word}</span>
                          {v.ipa && <span className="text-[10px] text-stone-400 font-mono block">{v.ipa}</span>}
                          <span className="text-stone-600 text-[11px] font-medium">{v.meaning}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => speakText(`Từ ${v.meaning || v.word} nè cô và các bạn ơi!`, 1.05, 'vi-VN')}
                          className="w-7 h-7 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center justify-center transition-colors cursor-pointer"
                          title="Bé nghe đọc bằng tiếng Việt"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="text-xs text-stone-800 p-3 bg-white/90 rounded-xl border border-purple-200 space-y-1">
                    <span className="font-bold text-purple-950 block">Khẩu lệnh lớp học / vai chơi:</span>
                    {plan.englishIntegration.classroomEnglish.map((c, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="font-bold text-purple-800">“{c.en || c.phrase}”:</span>
                        <span className="text-stone-600 font-medium">{c.vi || c.meaning}</span>
                      </div>
                    ))}
                    {plan.englishIntegration.miniGame && (
                      <div className="pt-1.5 mt-1.5 border-t border-purple-100 text-purple-900 font-semibold">
                        🎮 <strong>Trò chơi tiếng Anh:</strong> {plan.englishIntegration.miniGame}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* VI. ĐIỀU CHỈNH CHO TRẺ HÒA NHẬP */}
              {plan.adaptation && (
                <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200 text-xs text-stone-800 flex items-start gap-2.5">
                  <HeartHandshake className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-black text-rose-950">{isCorner ? 'VI' : 'V'}. Điều chỉnh cho mọi trẻ em:</strong> {plan.adaptation}
                  </div>
                </div>
              )}

              {/* Teaching Pack Gateway */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 border border-pink-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎁</span>
                  <div>
                    <h4 className="font-black text-stone-900 text-sm sm:text-base font-['Quicksand']">
                      Xuất Trọn Bộ Học Liệu Cho Bài Này?
                    </h4>
                    <p className="text-xs text-stone-600 font-medium">
                      Tự động tạo kèm: Thơ mầm non, Flashcards 3D, Trò chơi nhóm và Bài tập 10 phút bố mẹ chơi cùng con.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenTeachingPack(topic, ageGroup)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white font-black text-xs shadow-md shadow-pink-500/25 hover:scale-105 active:scale-95 transition-all whitespace-nowrap flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-pink-200" />
                  <span>Mở Teaching Pack</span>
                </button>
              </div>

              {/* Mandatory AI Disclaimer */}
              <div className="text-[11px] text-stone-500 text-center italic pt-2">
                🛡️ {plan.aiNotice}
              </div>
            </div>
          )}

          {/* VIEW MODE 2: PROFESSIONAL A4 WORD DOCUMENT VIEW */}
          {viewMode === 'document' && (
            <div className="bg-white rounded-3xl p-6 sm:p-12 border border-stone-300 shadow-xl max-w-4xl mx-auto space-y-6 text-stone-900 font-['Times_New_Roman',serif] text-sm sm:text-base leading-relaxed">
              {/* Document Header Standard */}
              <div className="flex flex-col sm:flex-row justify-between items-center text-center gap-4 border-b border-stone-200 pb-4">
                <div className="space-y-0.5">
                  <div className="font-bold uppercase tracking-wider text-xs sm:text-sm">
                    {plan.schoolName || user?.school || 'TRƯỜNG MẦM NON LIÊN MINH A'}
                  </div>
                  <div className="text-xs font-semibold text-stone-600">
                    Tổ Chuyên Môn Mầm Non
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="font-bold uppercase text-xs sm:text-sm">
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                  </div>
                  <div className="font-bold text-xs sm:text-sm">
                    Độc lập - Tự do - Hạnh phúc
                  </div>
                  <div className="text-xs text-stone-400">————————————</div>
                </div>
              </div>

              {/* Document Title */}
              <div className="text-center space-y-1 pt-2">
                <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide">
                  GIÁO ÁN
                </h1>
                <h2 className="text-lg sm:text-xl font-bold text-stone-800">
                  {plan.activityName ? plan.activityName.toUpperCase() : 'HOẠT ĐỘNG GÓC'}
                </h2>
              </div>

              {/* Meta info box */}
              <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200 space-y-1 text-xs sm:text-sm">
                <p><strong>• Chủ đề:</strong> {plan.theme || 'Thế giới quanh bé'}</p>
                <p><strong>• Đề tài:</strong> {plan.topic || plan.title}</p>
                <p><strong>• Đối tượng:</strong> Trẻ {plan.ageGroup}</p>
                <p><strong>• Thời gian thực hiện:</strong> {plan.duration}</p>
                <p><strong>• Số lượng trẻ:</strong> {plan.childrenCount || 25} trẻ</p>
                <p><strong>• Giáo viên thực hiện:</strong> {plan.teacherName || 'Cô giáo'}</p>
              </div>

              {/* I. Dự kiến góc chơi */}
              {isCorner && plan.cornerProposals && plan.cornerProposals.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold text-base uppercase text-stone-900 border-b border-stone-200 pb-1">
                    I. DỰ KIẾN GÓC CHƠI
                  </h3>
                  <div className="space-y-2 pl-2">
                    {plan.cornerProposals.map((corner, cIdx) => (
                      <div key={cIdx} className="text-xs sm:text-sm">
                        <strong>- {corner.cornerName}:</strong> {corner.activityContent}
                        {corner.materials && (
                          <span className="italic text-stone-600 block pl-4">
                            (Đồ dùng chuẩn bị: {corner.materials})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mục tiêu */}
              <div className="space-y-2">
                <h3 className="font-bold text-base uppercase text-stone-900 border-b border-stone-200 pb-1">
                  {isCorner ? 'II' : 'I'}. MỤC TIÊU
                </h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div>
                    <strong>1. Kiến thức:</strong>
                    <ul className="list-disc list-inside pl-2 space-y-0.5 text-stone-800">
                      {plan.objectives.knowledge.map((k, i) => (
                        <li key={i}>{k}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <strong>2. Kỹ năng:</strong>
                    <ul className="list-disc list-inside pl-2 space-y-0.5 text-stone-800">
                      {plan.objectives.skills.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <strong>3. Thái độ:</strong>
                    <ul className="list-disc list-inside pl-2 space-y-0.5 text-stone-800">
                      {plan.objectives.attitude.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Chuẩn bị */}
              <div className="space-y-2">
                <h3 className="font-bold text-base uppercase text-stone-900 border-b border-stone-200 pb-1">
                  {isCorner ? 'III' : 'II'}. CHUẨN BỊ
                </h3>

                {plan.preparation.general && plan.preparation.general.length > 0 && (
                  <div className="text-xs sm:text-sm">
                    <strong>- Chuẩn bị chung:</strong>
                    <ul className="list-disc list-inside pl-2 text-stone-800">
                      {plan.preparation.general.map((g, i) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {plan.preparation.byCorner && plan.preparation.byCorner.length > 0 ? (
                  <div className="space-y-1 text-xs sm:text-sm">
                    <strong>- Chuẩn bị theo từng góc:</strong>
                    {plan.preparation.byCorner.map((bc, idx) => (
                      <div key={idx} className="pl-3">
                        <strong>+ {bc.corner}:</strong> {bc.items.join(', ')}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1 text-xs sm:text-sm">
                    <p><strong>- Đồ dùng của cô:</strong> {plan.preparation.teacher.join('; ')}</p>
                    <p><strong>- Đồ dùng của trẻ:</strong> {plan.preparation.children.join('; ')}</p>
                  </div>
                )}
              </div>

              {/* Tiến trình */}
              <div className="space-y-2">
                <h3 className="font-bold text-base uppercase text-stone-900 border-b border-stone-200 pb-1">
                  {isCorner ? 'IV' : 'III'}. TIẾN TRÌNH HOẠT ĐỘNG
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-stone-300 text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-stone-100">
                        <th className="border border-stone-300 p-2.5 text-center font-bold w-1/4">
                          Các bước
                        </th>
                        <th className="border border-stone-300 p-2.5 text-center font-bold w-5/12">
                          Hoạt động của giáo viên
                        </th>
                        <th className="border border-stone-300 p-2.5 text-center font-bold w-1/3">
                          Hoạt động của trẻ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {plan.procedure.map((step, idx) => (
                        <tr key={idx} className="align-top">
                          <td className="border border-stone-300 p-2.5 font-bold">
                            {step.phase}
                          </td>
                          <td className="border border-stone-300 p-2.5 space-y-1">
                            <p>{step.teacherActivity}</p>
                            {step.guidingQuestions && step.guidingQuestions.length > 0 && (
                              <div className="pt-1 text-[11px] sm:text-xs text-stone-700 italic">
                                <strong>* Câu hỏi gợi mở:</strong>
                                <ul className="list-disc list-inside">
                                  {step.guidingQuestions.map((q, qIdx) => (
                                    <li key={qIdx}>{q}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </td>
                          <td className="border border-stone-300 p-2.5">
                            {step.childrenActivity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tích hợp tiếng Anh */}
              {plan.englishIntegration && (
                <div className="space-y-1.5 text-xs sm:text-sm">
                  <h3 className="font-bold text-base uppercase text-stone-900 border-b border-stone-200 pb-1">
                    {isCorner ? 'V' : 'IV'}. TÍCH HỢP TIẾNG ANH (ENGLISH BUDDY)
                  </h3>
                  <p><strong>- Từ vựng mầm non:</strong> {plan.englishIntegration.vocabulary.map((v) => `${v.word} (${v.meaning})`).join(', ')}</p>
                  <p><strong>- Khẩu lệnh giao tiếp:</strong> {plan.englishIntegration.classroomEnglish.map((c) => `"${c.en || c.phrase}" - ${c.vi || c.meaning}`).join(' | ')}</p>
                  {plan.englishIntegration.miniGame && (
                    <p><strong>- Trò chơi tiếng Anh:</strong> {plan.englishIntegration.miniGame}</p>
                  )}
                </div>
              )}

              {/* Điều chỉnh */}
              {plan.adaptation && (
                <div className="space-y-1.5 text-xs sm:text-sm">
                  <h3 className="font-bold text-base uppercase text-stone-900 border-b border-stone-200 pb-1">
                    {isCorner ? 'VI' : 'V'}. ĐIỀU CHỈNH HỖ TRỢ TRẺ
                  </h3>
                  <p>{plan.adaptation}</p>
                </div>
              )}

              {/* Footer Signature */}
              <div className="pt-8 flex justify-end text-center">
                <div className="space-y-1">
                  <div className="italic text-xs">
                    Ngày ...... tháng ...... năm 202...
                  </div>
                  <div className="font-bold text-xs sm:text-sm">
                    GIÁO VIÊN THỰC HIỆN
                  </div>
                  <div className="h-16" />
                  <div className="font-bold text-xs sm:text-sm">
                    {plan.teacherName || 'Cô Hồng Vân'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cross-Device Export & Share Modal (Phone & Desktop) */}
      {plan && (
        <ExportShareModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          item={{
            id: plan.id,
            type: 'lesson_plan',
            title: plan.title,
            subtitle: `Chủ đề: ${plan.theme || ''} • Độ tuổi: ${plan.ageGroup}`,
            author: plan.teacherName,
            school: plan.schoolName,
            data: plan,
          }}
        />
      )}
    </div>
  );
};
