import React, { useState, useRef } from 'react';
import { GameQuestion, GameOption } from '../../types/interactiveGame';
import { sounds } from '../../utils/audioUtils';
import {
  PRESCHOOL_SUBJECTS,
  PRESCHOOL_AGE_GROUPS,
  SUBJECT_QUESTION_BANKS,
} from '../../data/defaultGameQuestions';
import {
  Sparkles,
  Upload,
  Download,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  FileText,
  RotateCcw,
  Check,
  CheckSquare,
  Square,
  BookOpen,
  GraduationCap,
  Layers,
  Clipboard,
  Save,
} from 'lucide-react';

interface GameQuestionManagerProps {
  questions: GameQuestion[];
  onUpdateQuestions: (newQuestions: GameQuestion[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const GameQuestionManager: React.FC<GameQuestionManagerProps> = ({
  questions,
  onUpdateQuestions,
  isOpen,
  onClose,
}) => {
  // Mode selection: 'ai' | 'file' | 'manual'
  const [activeTab, setActiveTab] = useState<'ai' | 'file' | 'manual'>('ai');

  // Preschool Subject & Age State
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('math');
  const [selectedAgeName, setSelectedAgeName] = useState<string>('4–5 tuổi (Lớp Chồi)');
  const [customTopic, setCustomTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(6);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Manual Question Edit Form State
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editQuestionText, setEditQuestionText] = useState('');
  const [editOptions, setEditOptions] = useState<GameOption[]>([
    { id: 'opt1', text: 'Đáp án đúng', emoji: '⭐', isCorrect: true },
    { id: 'opt2', text: 'Đáp án sai 1', emoji: '🍎', isCorrect: false },
    { id: 'opt3', text: 'Đáp án sai 2', emoji: '🍌', isCorrect: false },
  ]);
  const [editExplanation, setEditExplanation] = useState('Bé thông minh tuyệt vời!');
  const [editCategory, setEditCategory] = useState('Toán mầm non');

  // Direct Text Paste / Paste Questions state
  const [pastedText, setPastedText] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const currentSubjectObj = PRESCHOOL_SUBJECTS.find((s) => s.id === selectedSubjectId) || PRESCHOOL_SUBJECTS[0];

  // 1. Load Preloaded Subject Bank directly
  const handleLoadSubjectBank = (subjectId: string) => {
    sounds.playFanfare();
    const bank = SUBJECT_QUESTION_BANKS[subjectId] || SUBJECT_QUESTION_BANKS.math;
    onUpdateQuestions(bank);
    const sub = PRESCHOOL_SUBJECTS.find((s) => s.id === subjectId);
    setStatusMessage({
      type: 'success',
      text: `Đã nạp ${bank.length} câu hỏi chuẩn môn "${sub?.name}" cho các bé!`,
    });
  };

  // 2. AI Quick Generate (with subject and ageGroup)
  const handleAiGenerate = async () => {
    sounds.playPop();
    setIsGenerating(true);
    setStatusMessage(null);

    const topicString = customTopic.trim() || `Môn ${currentSubjectObj.name} - ${currentSubjectObj.desc}`;

    try {
      const res = await fetch('/api/gemini/interactive-game-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicString,
          subject: currentSubjectObj.name,
          ageGroup: selectedAgeName,
          count: questionCount,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        sounds.playFanfare();
        // Enrich questions with selected subject and ageGroup
        const enriched = data.questions.map((q: GameQuestion) => ({
          ...q,
          subject: q.subject || currentSubjectObj.name,
          ageGroup: q.ageGroup || selectedAgeName,
        }));
        onUpdateQuestions(enriched);
        setStatusMessage({
          type: 'success',
          text: `Đã dùng AI tạo thành công ${enriched.length} câu hỏi môn "${currentSubjectObj.name}"!`,
        });
      } else {
        throw new Error(data.message || 'Không tạo được câu hỏi');
      }
    } catch (err: any) {
      console.warn('AI generate notice, using rich bank fallback:', err);
      // Fallback to rich subject bank
      const fallback = SUBJECT_QUESTION_BANKS[selectedSubjectId] || SUBJECT_QUESTION_BANKS.math;
      sounds.playSuccess();
      onUpdateQuestions(fallback);
      setStatusMessage({
        type: 'success',
        text: `Đã nạp ${fallback.length} câu hỏi tuyển chọn cho môn "${currentSubjectObj.name}"!`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // 3. Upload File (.json, .txt, .docx)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playPop();
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const parsed = JSON.parse(text);
          let list: GameQuestion[] = [];
          if (Array.isArray(parsed)) list = parsed;
          else if (parsed.questions && Array.isArray(parsed.questions)) list = parsed.questions;
          else throw new Error('File JSON không đúng cấu trúc mảng câu hỏi.');

          if (list.length === 0 || !list[0].question) {
            throw new Error('File không chứa câu hỏi hợp lệ.');
          }

          sounds.playFanfare();
          onUpdateQuestions(list);
          setStatusMessage({
            type: 'success',
            text: `Đã nạp thành công ${list.length} câu hỏi từ file "${file.name}"!`,
          });
        } catch (error: any) {
          sounds.playRetry();
          setStatusMessage({
            type: 'error',
            text: `Lỗi đọc file: ${error.message || 'File JSON không hợp lệ'}.`,
          });
        }
      };
      reader.readAsText(file);
    } else {
      // .txt or generic file: read text and parse lines
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const parsed = parseTextToQuestions(text);
          if (parsed.length > 0) {
            sounds.playFanfare();
            onUpdateQuestions(parsed);
            setStatusMessage({
              type: 'success',
              text: `Đã trích xuất ${parsed.length} câu hỏi từ file "${file.name}"!`,
            });
          } else {
            throw new Error('Chưa nhận diện được cấu trúc câu hỏi trong file văn bản.');
          }
        } catch (err: any) {
          sounds.playRetry();
          setStatusMessage({
            type: 'error',
            text: `Lỗi đọc file văn bản: ${err.message}`,
          });
        }
      };
      reader.readAsText(file);
    }

    e.target.value = '';
  };

  // Helper: Parse pasted text or text file into GameQuestion[]
  const parseTextToQuestions = (text: string): GameQuestion[] => {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const parsedList: GameQuestion[] = [];
    let currentQuestionText = '';
    let currentOptions: GameOption[] = [];

    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      const isQuestionLine = /^(câu\s*\d+[:.]|\d+[:.])/i.test(line);

      if (isQuestionLine) {
        if (currentQuestionText && currentOptions.length >= 2) {
          const correctOpt = currentOptions.find((o) => o.isCorrect) || currentOptions[0];
          parsedList.push({
            id: `imported_${Date.now()}_${idx}`,
            question: currentQuestionText,
            options: currentOptions,
            correctOptionId: correctOpt.id,
            correctAnswerText: correctOpt.text,
            explanation: 'Bé trả lời đúng rồi, giỏi quá!',
            subject: currentSubjectObj.name,
            ageGroup: selectedAgeName,
            category: currentSubjectObj.name,
            bubbleTarget: correctOpt.text,
            bubbleDistractors: currentOptions.filter((o) => !o.isCorrect).map((o) => o.text),
            sortBasket: currentSubjectObj.name,
          });
        }

        currentQuestionText = line.replace(/^(câu\s*\d+[:.]|\d+[:.])\s*/i, '').trim();
        currentOptions = [];
      } else if (/^[a-d][.:)]/i.test(line)) {
        // Option line e.g., "A. Con gà" or "A) Con gà *"
        const isMarkedCorrect = line.includes('*') || line.includes('[x]') || line.toLowerCase().includes('(đúng)');
        const cleanText = line
          .replace(/^[a-d][.:)]\s*/i, '')
          .replace(/(\*|\[x\]|\(đúng\))/gi, '')
          .trim();

        currentOptions.push({
          id: `opt_${Date.now()}_${currentOptions.length}`,
          text: cleanText,
          emoji: '⭐',
          isCorrect: isMarkedCorrect || (currentOptions.length === 0 && !line.includes('sai')),
        });
      }
    }

    if (currentQuestionText && currentOptions.length >= 2) {
      const correctOpt = currentOptions.find((o) => o.isCorrect) || currentOptions[0];
      parsedList.push({
        id: `imported_end_${Date.now()}`,
        question: currentQuestionText,
        options: currentOptions,
        correctOptionId: correctOpt.id,
        correctAnswerText: correctOpt.text,
        explanation: 'Bé trả lời đúng rồi, giỏi quá!',
        subject: currentSubjectObj.name,
        ageGroup: selectedAgeName,
        category: currentSubjectObj.name,
        bubbleTarget: correctOpt.text,
        bubbleDistractors: currentOptions.filter((o) => !o.isCorrect).map((o) => o.text),
        sortBasket: currentSubjectObj.name,
      });
    }

    return parsedList;
  };

  // 4. Handle Pasted Text parser
  const handleParsePastedText = () => {
    sounds.playPop();
    if (!pastedText.trim()) {
      setStatusMessage({ type: 'error', text: 'Vui lòng dán nội dung câu hỏi vào khung bên dưới.' });
      return;
    }
    const parsed = parseTextToQuestions(pastedText);
    if (parsed.length > 0) {
      sounds.playFanfare();
      onUpdateQuestions(parsed);
      setStatusMessage({
        type: 'success',
        text: `Đã nạp ${parsed.length} câu hỏi từ văn bản cô dán!`,
      });
      setPastedText('');
    } else {
      setStatusMessage({
        type: 'error',
        text: 'Chưa bóc tách được câu hỏi. Hãy định dạng: 1. Câu hỏi? A. Đáp án 1 * B. Đáp án 2',
      });
    }
  };

  // 5. Download Sample JSON Template
  const handleDownloadTemplate = () => {
    sounds.playPop();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `Bo_Cau_Hoi_Mam_Non_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // 6. Manual question builder: Start editing / creating
  const handleOpenEdit = (index: number) => {
    sounds.playPop();
    const q = questions[index];
    setEditingIndex(index);
    setEditQuestionText(q.question);
    setEditOptions(q.options.map((o) => ({ ...o })));
    setEditExplanation(q.explanation || 'Bé trả lời đúng rồi!');
    setEditCategory(q.category || currentSubjectObj.name);
  };

  const handleAddNewManual = () => {
    sounds.playPop();
    const newQ: GameQuestion = {
      id: `custom_${Date.now()}`,
      question: 'Câu hỏi mới cho các bé mầm non?',
      options: [
        { id: 'opt1', text: 'Đáp án ĐÚNG ⭐', emoji: '⭐', isCorrect: true },
        { id: 'opt2', text: 'Đáp án SAI 1 ❌', emoji: '🍎', isCorrect: false },
        { id: 'opt3', text: 'Đáp án SAI 2 ❌', emoji: '🍌', isCorrect: false },
      ],
      correctOptionId: 'opt1',
      correctAnswerText: 'Đáp án ĐÚNG ⭐',
      explanation: 'Bé trả lời siêu chuẩn! Hoan hô bé!',
      subject: currentSubjectObj.name,
      ageGroup: selectedAgeName,
      category: currentSubjectObj.name,
      bubbleTarget: 'Đáp án ĐÚNG ⭐',
      bubbleDistractors: ['Đáp án SAI 1 ❌', 'Đáp án SAI 2 ❌'],
      sortBasket: currentSubjectObj.name,
    };
    const updated = [newQ, ...questions];
    onUpdateQuestions(updated);
    setEditingIndex(0);
    setEditQuestionText(newQ.question);
    setEditOptions(newQ.options);
    setEditExplanation(newQ.explanation);
    setEditCategory(newQ.category || currentSubjectObj.name);
  };

  const handleSaveManualEdit = () => {
    if (editingIndex === null) return;
    sounds.playSuccess();

    // Verify at least one correct option
    const hasCorrect = editOptions.some((o) => o.isCorrect);
    const finalOptions = hasCorrect
      ? editOptions
      : editOptions.map((o, idx) => ({ ...o, isCorrect: idx === 0 }));

    const correctOpt = finalOptions.find((o) => o.isCorrect) || finalOptions[0];

    const updatedQ: GameQuestion = {
      ...questions[editingIndex],
      question: editQuestionText.trim() || 'Câu hỏi mầm non',
      options: finalOptions,
      correctOptionId: correctOpt.id,
      correctAnswerText: correctOpt.text,
      explanation: editExplanation.trim(),
      category: editCategory.trim(),
      subject: currentSubjectObj.name,
      ageGroup: selectedAgeName,
      bubbleTarget: correctOpt.text,
      bubbleDistractors: finalOptions.filter((o) => !o.isCorrect).map((o) => o.text),
    };

    const updatedList = [...questions];
    updatedList[editingIndex] = updatedQ;
    onUpdateQuestions(updatedList);
    setEditingIndex(null);
    setStatusMessage({ type: 'success', text: 'Đã lưu thay đổi câu hỏi thành công!' });
  };

  // Toggle Correct/Incorrect for an option in manual editor
  const handleToggleOptionCorrect = (optIdx: number) => {
    sounds.playPop();
    setEditOptions((prev) =>
      prev.map((opt, idx) => ({
        ...opt,
        isCorrect: idx === optIdx, // Exactly one correct answer
      }))
    );
  };

  const handleDeleteQuestion = (id: string) => {
    sounds.playPop();
    if (questions.length <= 2) {
      alert('Trò chơi cần tối thiểu 2 câu hỏi để vận hành.');
      return;
    }
    const updated = questions.filter((q) => q.id !== id);
    onUpdateQuestions(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/75 backdrop-blur-xs animate-fadeIn font-['Nunito',sans-serif]">
      <div className="w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border-2 border-amber-300 overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-sm text-xl">
              🎮
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black">
                <span>QUẢN LÝ CÂU HỎI 10 GAME TƯƠNG TÁC</span>
              </div>
              <h3 className="text-base sm:text-xl font-black text-amber-950 font-['Quicksand'] mt-0.5">
                Thiết Lập Câu Hỏi & Môn Học Mầm Non
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer transition-colors font-bold"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status notification */}
        {statusMessage && (
          <div
            className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-between gap-2 animate-fadeIn ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-stone-400 hover:text-stone-600 text-[10px] font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* KHỐI 1: CHỌN MÔN HỌC & ĐỘ TUỔI MẦM NON (BẮT BUỘC) */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-r from-amber-50/80 via-orange-50/50 to-amber-50/80 p-4 rounded-3xl border border-amber-200/90 space-y-3 shadow-2xs">
          {/* Môn Học Mầm Non */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-amber-950 flex items-center gap-1.5 uppercase tracking-wide">
                <BookOpen className="w-4 h-4 text-orange-600" />
                <span>1. Chọn Môn Học Thuộc Mầm Non:</span>
              </span>

              <button
                onClick={() => handleLoadSubjectBank(selectedSubjectId)}
                className="text-[11px] text-orange-700 hover:text-orange-900 bg-white px-2.5 py-1 rounded-xl border border-orange-200 font-black cursor-pointer shadow-2xs hover:scale-102 transition-all flex items-center gap-1"
                title="Nạp ngay bộ câu hỏi mẫu có sẵn của môn này"
              >
                <span>⚡ Nạp câu hỏi mẫu môn này</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {PRESCHOOL_SUBJECTS.map((sub) => {
                const isSelected = selectedSubjectId === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      sounds.playPop();
                      setSelectedSubjectId(sub.id);
                    }}
                    className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between min-h-[64px] ${
                      isSelected
                        ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-orange-500 shadow-md scale-102'
                        : 'bg-white text-stone-700 border-amber-200/80 hover:bg-amber-100/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{sub.icon}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="font-black text-xs leading-tight mt-1 line-clamp-1">
                      {sub.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Độ Tuổi Mầm Non */}
          <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-black text-amber-950 flex items-center gap-1.5 uppercase tracking-wide">
              <GraduationCap className="w-4 h-4 text-orange-600" />
              <span>2. Chọn Độ Tuổi:</span>
            </span>

            <div className="flex items-center gap-1.5 flex-wrap">
              {PRESCHOOL_AGE_GROUPS.map((age) => {
                const isSelected = selectedAgeName === age.name;
                return (
                  <button
                    key={age.id}
                    onClick={() => {
                      sounds.playPop();
                      setSelectedAgeName(age.name);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {age.shortName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* KHỐI 2: 3 PHƯƠNG THỨC TẠO CÂU HỎI (TABS) */}
        {/* ======================================================== */}
        <div className="space-y-3">
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-stone-200 pb-2 flex-wrap">
            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('ai');
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1. Tạo Tự Động Bằng AI (Nhanh 3s)</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('file');
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'file'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>2. Tải File Lên / Dán Câu Hỏi</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('manual');
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'manual'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>3. Tự Điền / Soạn Thủ Công (Có Đáp Án Đúng Sai)</span>
            </button>
          </div>

          {/* TAB 1: AI AUTO GENERATOR */}
          {activeTab === 'ai' && (
            <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-200 space-y-3 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-xs font-black text-amber-950 block">
                  Chủ đề chi tiết hoặc mục tiêu bài dạy (Có thể để trống để dùng mặc định):
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder={`Ví dụ: Khám phá các loài hoa mùa xuân, Đếm số lượng từ 1 đến 5...`}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-amber-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-400 font-medium"
                />
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
                  <span>Số lượng câu hỏi:</span>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="px-2.5 py-1.5 rounded-xl border border-amber-200 bg-white text-xs font-black text-amber-950"
                  >
                    <option value={4}>4 câu (Khởi động)</option>
                    <option value={6}>6 câu (Chuẩn tiết học)</option>
                    <option value={8}>8 câu (Sôi động)</option>
                    <option value={10}>10 câu (Đầy đủ)</option>
                  </select>
                </div>

                <button
                  onClick={handleAiGenerate}
                  disabled={isGenerating}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 font-bubbly active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>{isGenerating ? 'AI Đang Soạn Câu Hỏi...' : '✨ Tạo Bộ Câu Hỏi Tự Động'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD FILE & PASTE TEXT */}
          {activeTab === 'file' && (
            <div className="bg-blue-50/40 p-4 rounded-2xl border border-blue-200 space-y-3.5 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* File Upload Box */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-blue-300 bg-white flex flex-col justify-between gap-3 text-center sm:text-left">
                  <div>
                    <h5 className="font-black text-xs text-blue-950 flex items-center gap-1.5 justify-center sm:justify-start">
                      <Upload className="w-4 h-4 text-blue-600" />
                      <span>Tải file từ máy tính (.json, .txt, .docx)</span>
                    </h5>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Hỗ trợ file JSON cấu trúc game hoặc file văn bản có chứa danh sách câu hỏi.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs cursor-pointer shadow-xs"
                    >
                      Chọn file từ máy
                    </button>
                    <button
                      onClick={handleDownloadTemplate}
                      className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs border border-blue-200 cursor-pointer"
                      title="Tải file mẫu về máy để xem cấu trúc"
                    >
                      Tải file mẫu .json
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json,.txt,text/plain"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>

                {/* Direct Paste Box */}
                <div className="p-3.5 rounded-2xl border border-blue-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-blue-950 flex items-center gap-1">
                      <Clipboard className="w-3.5 h-3.5 text-blue-600" />
                      <span>Hoặc dán trực tiếp danh sách câu hỏi:</span>
                    </label>
                    <button
                      onClick={handleParsePastedText}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-black text-[11px] cursor-pointer hover:bg-blue-700 shadow-2xs"
                    >
                      Trích xuất câu hỏi ➔
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="1. Quả nào màu đỏ?&#10;A. Dâu tây *&#10;B. Chuối&#10;2. Đèn đỏ phải làm gì?&#10;A. Dừng lại *&#10;B. Chạy..."
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-blue-400 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MANUAL QUESTION BUILDER WITH CORRECT/INCORRECT TOGGLE */}
          {activeTab === 'manual' && (
            <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-200 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-emerald-600" />
                  <span>
                    {editingIndex !== null
                      ? `Chỉnh Sửa Câu Hỏi #${editingIndex + 1}`
                      : 'Soạn Thêm Câu Hỏi Mới Vào Trò Chơi'}
                  </span>
                </span>

                <button
                  onClick={handleAddNewManual}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Thêm câu hỏi mới</span>
                </button>
              </div>

              {/* Form editing card */}
              <div className="bg-white p-4 rounded-2xl border border-emerald-200 space-y-3 shadow-xs">
                <div className="space-y-1">
                  <label className="text-xs font-black text-stone-800 block">
                    Nội dung câu hỏi cho bé: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editQuestionText}
                    onChange={(e) => setEditQuestionText(e.target.value)}
                    placeholder="Ví dụ: Đố bé con vật nào biết gáy ò ó o?..."
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-bold"
                  />
                </div>

                {/* Options with clear TRUE / FALSE toggle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-stone-800 block">
                      Các phương án lựa chọn (Bấm nút xanh để chọn đáp án ĐÚNG):
                    </label>
                    <span className="text-[11px] text-stone-500 font-medium">
                      Bắt buộc có 1 đáp án Đúng
                    </span>
                  </div>

                  <div className="space-y-2">
                    {editOptions.map((opt, optIdx) => (
                      <div
                        key={opt.id}
                        className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                          opt.isCorrect
                            ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/40'
                            : 'bg-stone-50 border-stone-200'
                        }`}
                      >
                        {/* Correct / Incorrect Toggle Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleOptionCorrect(optIdx)}
                          className={`px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1 cursor-pointer transition-all ${
                            opt.isCorrect
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                          }`}
                          title="Bấm để đánh dấu đáp án này là Đúng hay Sai"
                        >
                          {opt.isCorrect ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>✓ ĐÚNG</span>
                            </>
                          ) : (
                            <span>✗ SAI</span>
                          )}
                        </button>

                        {/* Emoji box */}
                        <input
                          type="text"
                          value={opt.emoji}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditOptions((prev) =>
                              prev.map((o, idx) => (idx === optIdx ? { ...o, emoji: val } : o))
                            );
                          }}
                          placeholder="Emoji"
                          className="w-10 text-center px-1 py-1 rounded-lg bg-white border border-stone-200 text-sm"
                          title="Emoji minh họa"
                        />

                        {/* Option text */}
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditOptions((prev) =>
                              prev.map((o, idx) => (idx === optIdx ? { ...o, text: val } : o))
                            );
                          }}
                          placeholder={`Nội dung lựa chọn ${optIdx + 1}...`}
                          className="flex-1 px-3 py-1 rounded-lg bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-stone-800 block">
                    Lời giải thích & khen ngợi bé ấm áp khi trả lời đúng:
                  </label>
                  <input
                    type="text"
                    value={editExplanation}
                    onChange={(e) => setEditExplanation(e.target.value)}
                    placeholder="Chính xác! Bé thông minh và quan sát siêu quá!"
                    className="w-full px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-emerald-100">
                  <button
                    type="button"
                    onClick={() => setEditingIndex(null)}
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                  >
                    Hủy chỉnh sửa
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveManualEdit}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lưu Câu Hỏi Vào Game</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* KHỐI 3: DANH SÁCH CÂU HỎI HIỆN TẠI (CURRENT QUESTIONS) */}
        {/* ======================================================== */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-black text-amber-950 flex items-center gap-1.5 font-['Quicksand'] uppercase tracking-wide">
              <Layers className="w-4 h-4 text-orange-600" />
              <span>Danh Sách Câu Hỏi Đang Áp Dụng ({questions.length} câu):</span>
            </h4>

            <span className="text-[11px] text-stone-500 font-bold">
              Tự động dùng chung cho cả 10 trò chơi cảm ứng
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-3 rounded-2xl border border-amber-100 bg-stone-50 hover:bg-white hover:border-amber-300 transition-all flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-black text-amber-950 text-xs sm:text-sm leading-snug">
                      {q.question}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 pl-7 flex-wrap text-[11px]">
                    <span className="text-emerald-800 font-black bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300 flex items-center gap-1">
                      <span>✓ Đáp án đúng:</span>
                      <span>{q.correctAnswerText || q.options.find((o) => o.isCorrect)?.text}</span>
                    </span>

                    {q.subject && (
                      <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md text-[10px]">
                        {q.subject}
                      </span>
                    )}

                    {q.ageGroup && (
                      <span className="bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded-md text-[10px]">
                        {q.ageGroup}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 pt-0.5">
                  <button
                    onClick={() => {
                      setActiveTab('manual');
                      handleOpenEdit(idx);
                    }}
                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 cursor-pointer"
                    title="Sửa câu hỏi này"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="Xóa câu hỏi này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="pt-3 border-t border-amber-100 flex items-center justify-between gap-3">
          <button
            onClick={() => handleLoadSubjectBank(selectedSubjectId)}
            className="text-xs font-bold text-orange-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục câu hỏi mẫu</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer font-bubbly active:scale-95 transition-all"
          >
            Đóng & Bắt Đầu Chơi Ngay 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
