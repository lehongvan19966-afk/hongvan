import React, { useState, useEffect, useRef } from 'react';
import { MamAiMascot } from '../components/MamAiMascot';
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  Gamepad2,
  Globe,
  Home,
  Save,
  Printer,
  CheckCircle2,
  XCircle,
  Volume2,
  Share2,
  UploadCloud,
  FileText,
  Download,
  Eye,
  Trash2,
  Search,
  Filter,
  Plus,
  Check,
  ExternalLink,
  Layers,
  FileCheck,
  FolderHeart,
  Clock,
  User,
  Tag,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { TeachingPack } from '../types';
import { PRELOADED_SAMPLE_PACK } from '../data/mockData';
import { generateTeachingPack } from '../services/aiService';
import { sounds, speakText } from '../utils/audioUtils';
import { ExportShareModal } from '../components/ExportShareModal';
import { persistentDocStorage } from '../services/persistentDocStorage';

export interface PersistentDocument {
  id: string;
  title: string;
  type: string; // 'docx' | 'pdf' | 'text' | 'image' | 'video'
  category: string;
  sourceFunction?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileData?: string; // Data URL for persistent offline viewing
  author?: string;
  uploadedAt?: string;
  description?: string;
  content?: string;
  previewHtml?: string;
  tags?: string[];
}

interface TeachingPackViewProps {
  initialTopic?: string;
  initialAgeGroup?: string;
  initialPack?: TeachingPack;
  onSaveToLibrary: (pack: TeachingPack) => void;
  onOpenFamilyMode: () => void;
}

export const TeachingPackView: React.FC<TeachingPackViewProps> = ({
  initialTopic = 'Chủ đề Mẹ và Bé',
  initialAgeGroup = '3–4 tuổi (Lớp Mầm)',
  initialPack,
  onSaveToLibrary,
  onOpenFamilyMode,
}) => {
  // Main Navigation: 'documents' (Tủ Tài Liệu Word & PDF Lưu Mãi) or 'generator' (Sinh Gói Hoạt Động AI)
  const [activeSubTab, setActiveSubTab] = useState<'documents' | 'generator'>('documents');

  // ==========================================
  // STATE CHO KHO TÀI LIỆU WORD & PDF (LƯU MÃI)
  // ==========================================
  const [documents, setDocuments] = useState<PersistentDocument[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [searchDocQuery, setSearchDocQuery] = useState('');
  const [filterDocType, setFilterDocType] = useState<'all' | 'docx' | 'pdf'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Upload Form State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Giáo án mầm non');
  const [uploadAuthor, setUploadAuthor] = useState('Cô Lê Hồng Vân');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadTags, setUploadTags] = useState('Word, Mầm non, Lưu trữ');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Document Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<PersistentDocument | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewViewMode, setPreviewViewMode] = useState<'formatted' | 'raw'>('formatted');

  // Open preview directly (Mở ra xem được luôn!)
  const handleOpenDocumentPreview = async (doc: PersistentDocument) => {
    sounds.playPop();
    setPreviewDoc(doc);
    setPreviewHtml(doc.previewHtml || '');
    setPreviewViewMode('formatted');

    const isDocx =
      doc.type === 'docx' ||
      (doc.fileName && (doc.fileName.toLowerCase().endsWith('.docx') || doc.fileName.toLowerCase().endsWith('.doc')));

    if (isDocx && !doc.previewHtml) {
      setIsLoadingPreview(true);
      try {
        const res = await fetch(`/api/documents/${doc.id}/preview`);
        const data = await res.json();
        if (data.success && data.html) {
          setPreviewHtml(data.html);
        }
      } catch (err) {
        console.warn('Error fetching preview html:', err);
      } finally {
        setIsLoadingPreview(false);
      }
    }
  };

  // Delete Confirm State
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);

  // ==========================================
  // STATE CHO BỘ SINH HOẠT ĐỘNG AI (GENERATOR)
  // ==========================================
  const [topic, setTopic] = useState(initialTopic);
  const [ageGroup, setAgeGroup] = useState(initialAgeGroup);
  const [duration, setDuration] = useState('20 phút');
  const [isLoading, setIsLoading] = useState(false);
  const [pack, setPack] = useState<TeachingPack>(initialPack || PRELOADED_SAMPLE_PACK);
  const [isSaved, setIsSaved] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Interactive Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<number, boolean>>({});

  // Load persistent documents from server & local persistent storage
  const fetchDocuments = async () => {
    setIsLoadingDocs(true);
    try {
      // 1. Nạp ngay từ persistentDocStorage (hiển thị lập tức, không bao giờ bị trắng trang)
      const localDocs = persistentDocStorage.getAllDocuments();
      if (localDocs.length > 0) {
        setDocuments(localDocs as any);
      }

      // 2. Đồng bộ thêm từ máy chủ
      const res = await fetch('/api/documents');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.documents)) {
          const merged = [...data.documents];
          localDocs.forEach((ld) => {
            if (!merged.some((md) => md.id === ld.id)) {
              merged.push(ld as any);
            }
          });
          setDocuments(merged);
        }
      }
    } catch (err) {
      console.warn('Notice fetching server documents, using local cache:', err);
      const localDocs = persistentDocStorage.getAllDocuments();
      if (localDocs.length > 0) {
        setDocuments(localDocs as any);
      }
    } finally {
      setIsLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (initialPack) {
      setPack(initialPack);
      if (initialPack.packTitle) setTopic(initialPack.packTitle);
      if (initialPack.ageGroup) setAgeGroup(initialPack.ageGroup);
    }
  }, [initialPack]);

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError('');
      // Auto-fill title if empty
      if (!uploadTitle.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setUploadTitle(cleanName);
      }
    }
  };

  // Upload Word / PDF file permanently with Dual Online + Offline Resilience
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !uploadTitle.trim()) {
      setUploadError('Vui lòng chọn 1 file Word hoặc PDF để tải lên');
      return;
    }

    sounds.playPop();
    setIsUploading(true);
    setUploadError('');

    try {
      let savedDoc: PersistentDocument | null = null;

      // 1. Đọc file dưới dạng Data URL trước để đảm bảo xem được ngay lập tức
      let fileDataUrl = '';
      if (selectedFile) {
        try {
          fileDataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => resolve('');
            reader.readAsDataURL(selectedFile);
          });
        } catch (fErr) {
          console.warn('FileReader notice:', fErr);
        }
      }

      // 2. Thử tải lên máy chủ
      try {
        const formData = new FormData();
        if (selectedFile) {
          formData.append('file', selectedFile);
        }
        formData.append('title', uploadTitle.trim());
        formData.append('category', uploadCategory);
        formData.append('author', uploadAuthor);
        formData.append('description', uploadDescription);
        formData.append('sourceFunction', 'teaching-pack');
        formData.append('tags', JSON.stringify(uploadTags.split(',').map((t) => t.trim()).filter(Boolean)));

        const res = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.document) {
            savedDoc = data.document;
          }
        }
      } catch (serverErr) {
        console.warn('Server upload notice, using persistent local storage fallback:', serverErr);
      }

      // 3. Cơ chế cứu nguy tự động: Nếu máy chủ bận hoặc mạng yếu, lưu an toàn vào IndexedDB / Storage ngay lập tức!
      if (!savedDoc) {
        const ext = selectedFile ? selectedFile.name.split('.').pop()?.toLowerCase() : 'docx';
        let docType = 'docx';
        if (ext === 'pdf') docType = 'pdf';
        else if (['doc', 'docx'].includes(ext || '')) docType = 'docx';
        else if (['ppt', 'pptx'].includes(ext || '')) docType = 'pptx';
        else if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) docType = 'image';
        else if (['mp4', 'mov', 'webm'].includes(ext || '')) docType = 'video';
        else if (['mp3', 'wav', 'm4a'].includes(ext || '')) docType = 'audio';
        else docType = 'text';

        savedDoc = {
          id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          title: uploadTitle.trim() || (selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, '') : 'Tài liệu giáo án'),
          type: docType,
          category: uploadCategory,
          sourceFunction: 'teaching_pack',
          fileUrl: fileDataUrl || '',
          fileName: selectedFile ? selectedFile.name : `${uploadTitle.trim()}.${docType}`,
          fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.0 MB',
          fileData: fileDataUrl || undefined,
          content: uploadDescription.trim() || 'Tài liệu giáo án mầm non lưu trữ',
          previewHtml: '',
          author: uploadAuthor.trim() || 'Cô giáo mầm non',
          uploadedAt: new Date().toLocaleDateString('vi-VN'),
          description: uploadDescription.trim(),
          tags: uploadTags.split(',').map((t) => t.trim()).filter(Boolean),
        };
      } else if (fileDataUrl) {
        savedDoc.fileData = fileDataUrl;
      }

      // Đồng bộ vào persistentDocStorage
      try {
        await persistentDocStorage.saveDocument({
          id: savedDoc.id,
          title: savedDoc.title,
          category: savedDoc.category,
          sourceFunction: 'teaching_pack',
          type: (savedDoc.type as any) || 'docx',
          fileUrl: savedDoc.fileUrl || '',
          fileName: savedDoc.fileName || `${savedDoc.title}.docx`,
          fileSize: savedDoc.fileSize || '1.0 MB',
          fileData: fileDataUrl || undefined,
          author: savedDoc.author || 'Cô giáo mầm non',
          description: savedDoc.description || '',
          content: savedDoc.content || '',
          tags: savedDoc.tags || ['Tài liệu'],
        });
      } catch (storeErr) {
        console.warn('Could not sync to persistentDocStorage:', storeErr);
      }

      sounds.playSuccess();
      speakText('Tuyệt vời! Tài liệu của cô đã được lưu trữ vĩnh viễn và mở ra xem ngay nhé!', 1.1, 'vi-VN');
      setDocuments((prev) => [savedDoc!, ...prev.filter((d) => d.id !== savedDoc!.id)]);

      // Reset form
      setSelectedFile(null);
      setUploadTitle('');
      setUploadDescription('');
      setIsUploadOpen(false);

      // Mở ra xem được luôn!
      handleOpenDocumentPreview(savedDoc);
    } catch (err: any) {
      console.error('Upload error:', err);
      // Ngay cả khi xảy ra lỗi bất ngờ, thông báo nhẹ nhàng
      sounds.playSuccess();
      setIsUploadOpen(false);
    } finally {
      setIsUploading(false);
    }
  };

  // Delete persistent document
  const handleDeleteDocument = async (id: string) => {
    sounds.playPop();
    try {
      persistentDocStorage.deleteDocument(id);
      await fetch(`/api/documents/${id}`, { method: 'DELETE' }).catch(() => {});
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      if (previewDoc?.id === id) setPreviewDoc(null);
    } catch (err) {
      console.error('Error deleting document:', err);
    } finally {
      setDeletingDocId(null);
    }
  };

  // Generate Teaching Pack
  const handleGenerate = async () => {
    sounds.playPop();
    setIsLoading(true);
    setIsSaved(false);
    setQuizAnswers({});
    setQuizSubmitted({});

    try {
      const generated = await generateTeachingPack(topic, ageGroup, duration);
      setPack(generated);
      sounds.playSuccess();
    } catch {
      sounds.playRetry();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuiz = (qIdx: number, optionIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optionIdx }));
    setQuizSubmitted((prev) => ({ ...prev, [qIdx]: true }));

    const isCorrect = optionIdx === pack.quiz[qIdx]?.correctIndex;
    if (isCorrect) {
      sounds.playSuccess();
    } else {
      sounds.playRetry();
    }
  };

  // Filtered documents
  const filteredDocuments = documents.filter((doc) => {
    const isDocx = doc.type === 'docx' || (doc.fileName && (doc.fileName.endsWith('.docx') || doc.fileName.endsWith('.doc')));
    const isPdf = doc.type === 'pdf' || (doc.fileName && doc.fileName.endsWith('.pdf'));

    const matchType =
      filterDocType === 'all' ||
      (filterDocType === 'docx' && isDocx) ||
      (filterDocType === 'pdf' && isPdf);

    const matchCat = filterCategory === 'all' || doc.category === filterCategory;

    const term = searchDocQuery.trim().toLowerCase();
    const matchSearch =
      !term ||
      doc.title.toLowerCase().includes(term) ||
      (doc.description && doc.description.toLowerCase().includes(term)) ||
      (doc.fileName && doc.fileName.toLowerCase().includes(term));

    return matchType && matchCat && matchSearch;
  });

  const wordCount = documents.filter(
    (d) => d.type === 'docx' || (d.fileName && (d.fileName.endsWith('.docx') || d.fileName.endsWith('.doc')))
  ).length;

  const pdfCount = documents.filter(
    (d) => d.type === 'pdf' || (d.fileName && d.fileName.endsWith('.pdf'))
  ).length;

  return (
    <div className="space-y-6 animate-fadeIn pb-24 font-['Nunito',sans-serif]">
      {/* Top Banner: Kiến thức AI */}
      <div className="bg-gradient-to-r from-amber-100/90 via-[#FFF8F0] via-orange-100/80 to-amber-100/90 rounded-[32px] p-5 sm:p-7 border-[3px] border-white flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-[0_6px_24px_rgba(180,83,9,0.08)]">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 text-orange-700 text-xs font-black shadow-2xs border border-orange-200">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span className="font-bubbly">Kiến Thức AI Mầm Non · Tủ Tài Liệu Word & PDF Lưu Trữ Vĩnh Viễn</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-950 tracking-tight font-bubbly">
            Kiến Thức AI & Tủ Tài Liệu Mầm Non
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
            Nơi cô giáo tải lên, lưu trữ mãi mãi các <strong>file Word (.doc, .docx)</strong> và <strong>file PDF (.pdf)</strong> về giáo án, thơ truyện, tài liệu tập huấn AI. Đọc trực tiếp, xem trước và tải về dùng bất cứ khi nào!
          </p>
        </div>

        {/* Quick Action Button & Stats */}
        <div className="shrink-0 flex flex-col sm:flex-row md:flex-col items-stretch gap-3">
          <button
            onClick={() => {
              sounds.playPop();
              setIsUploadOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-500/30 hover:scale-103 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer ring-2 ring-orange-300 font-bubbly"
          >
            <UploadCloud className="w-4 h-4 animate-bounce" />
            <span>📤 Tải Lên File Word / PDF (Lưu Mãi)</span>
          </button>

          {/* Quick Storage Stats */}
          <div className="flex items-center justify-between gap-3 bg-white/95 px-4 py-2.5 rounded-2xl border-2 border-orange-200 shadow-xs text-xs font-bold">
            <span className="text-stone-600">Đã lưu trữ:</span>
            <div className="flex items-center gap-2">
              <span className="text-blue-700 font-black">📄 {wordCount} Word</span>
              <span className="text-stone-300">|</span>
              <span className="text-red-700 font-black">📑 {pdfCount} PDF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Main Tabs: Tủ Tài Liệu Lưu Mãi vs Tạo Gói Hoạt Động AI */}
      <div className="flex items-center gap-2 border-b-2 border-amber-200 pb-2">
        <button
          onClick={() => {
            sounds.playPop();
            setActiveSubTab('documents');
          }}
          className={`px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bubbly font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'documents'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm ring-2 ring-orange-300'
              : 'bg-white hover:bg-amber-50 text-stone-700 border border-amber-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>📁 Tủ Tài Liệu Word & PDF (Lưu Mãi)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/25 text-white">
            {documents.length}
          </span>
        </button>

        <button
          onClick={() => {
            sounds.playPop();
            setActiveSubTab('generator');
          }}
          className={`px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bubbly font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'generator'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm ring-2 ring-orange-300'
              : 'bg-white hover:bg-amber-50 text-stone-700 border border-amber-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>⚡ Tạo Trọn Gói Hoạt Động AI (1-Chạm)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: KHO TÀI LIỆU WORD & PDF (LƯU MÃI) */}
      {/* ======================================================== */}
      {activeSubTab === 'documents' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-3xl border-2 border-amber-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchDocQuery}
                onChange={(e) => setSearchDocQuery(e.target.value)}
                placeholder="Tìm kiếm tài liệu Word, PDF..."
                className="w-full pl-9 pr-3.5 py-2 rounded-2xl bg-amber-50/40 border border-amber-200 text-xs text-amber-950 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            {/* Filter by Type & Category */}
            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
              {/* Type Pills */}
              <div className="inline-flex items-center p-1 bg-amber-50 rounded-2xl border border-amber-200">
                <button
                  onClick={() => {
                    sounds.playPop();
                    setFilterDocType('all');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filterDocType === 'all' ? 'bg-orange-500 text-white font-black shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Tất cả ({documents.length})
                </button>
                <button
                  onClick={() => {
                    sounds.playPop();
                    setFilterDocType('docx');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    filterDocType === 'docx' ? 'bg-blue-600 text-white font-black shadow-xs' : 'text-blue-700'
                  }`}
                >
                  <span>📄 Word</span>
                  <span>({wordCount})</span>
                </button>
                <button
                  onClick={() => {
                    sounds.playPop();
                    setFilterDocType('pdf');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    filterDocType === 'pdf' ? 'bg-red-600 text-white font-black shadow-xs' : 'text-red-700'
                  }`}
                >
                  <span>📑 PDF</span>
                  <span>({pdfCount})</span>
                </button>
              </div>

              {/* Category Dropdown */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs font-bold text-amber-950 focus:outline-none cursor-pointer"
              >
                <option value="all">Tất cả chủ đề</option>
                <option value="Giáo án mầm non">Giáo án mầm non</option>
                <option value="Tài liệu hướng dẫn AI">Tài liệu hướng dẫn AI</option>
                <option value="Văn học mầm non">Văn học mầm non</option>
                <option value="Kế hoạch tuần STEAM">Kế hoạch tuần STEAM</option>
                <option value="Sách tham khảo mầm non">Sách tham khảo</option>
              </select>

              <button
                onClick={() => {
                  sounds.playPop();
                  fetchDocuments();
                }}
                className="p-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 cursor-pointer"
                title="Làm mới danh sách"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Document Cards Grid */}
          {isLoadingDocs ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-amber-200 text-stone-500 font-bold">
              Đang tải danh sách tài liệu lưu trữ...
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border-2 border-dashed border-amber-300 space-y-3">
              <MamAiMascot size="md" mood="thinking" />
              <h3 className="text-base font-black text-amber-950 font-bubbly">
                Chưa tìm thấy tài liệu phù hợp
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Cô có thể bấm nút bên dưới để tải lên file Word (.doc, .docx) hoặc PDF (.pdf) đầu tiên và lưu trữ mãi mãi trên hệ thống!
              </p>
              <button
                onClick={() => {
                  sounds.playPop();
                  setIsUploadOpen(true);
                }}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs shadow-sm cursor-pointer hover:scale-105 transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Tải File Ngay</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((doc) => {
                const isDocx = doc.type === 'docx' || (doc.fileName && (doc.fileName.endsWith('.docx') || doc.fileName.endsWith('.doc')));
                const isPdf = doc.type === 'pdf' || (doc.fileName && doc.fileName.endsWith('.pdf'));

                return (
                  <div
                    key={doc.id}
                    className="bg-white rounded-3xl p-5 border-2 border-amber-200/90 hover:border-orange-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
                  >
                    {/* Top: Icon + Title + Badge */}
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        {/* Format icon */}
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs border ${
                            isDocx
                              ? 'bg-blue-50 text-blue-600 border-blue-200'
                              : isPdf
                              ? 'bg-red-50 text-red-600 border-red-200'
                              : 'bg-amber-50 text-amber-600 border-amber-200'
                          }`}
                        >
                          {isDocx ? (
                            <FileText className="w-6 h-6" />
                          ) : (
                            <BookOpen className="w-6 h-6" />
                          )}
                        </div>

                        {/* Badges */}
                        <div className="flex flex-col items-end gap-1">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300 flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" />
                            <span>LƯU MÃI</span>
                          </span>

                          <span className="text-[10px] font-bold text-stone-500">
                            {doc.fileSize || '1.5 MB'}
                          </span>
                        </div>
                      </div>

                      {/* Title & Metadata */}
                      <div
                        onClick={() => handleOpenDocumentPreview(doc)}
                        className="cursor-pointer"
                      >
                        <h3 className="font-black text-sm sm:text-base text-amber-950 font-['Quicksand'] line-clamp-2 leading-snug group-hover:text-orange-700 transition-colors">
                          {doc.title}
                        </h3>

                        <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium mt-1 flex-wrap">
                          <span className="bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md font-bold text-[10px]">
                            {doc.category || 'Tài liệu mầm non'}
                          </span>
                          <span>•</span>
                          <span>Tác giả: {doc.author || 'Cô giáo'}</span>
                          <span>•</span>
                          <span>{doc.uploadedAt || 'Gần đây'}</span>
                        </div>
                      </div>

                      {/* Description / Content snippet */}
                      <p className="text-xs text-stone-600 font-medium line-clamp-2 leading-relaxed bg-stone-50/70 p-2.5 rounded-xl border border-stone-200/60">
                        {doc.description || doc.content || 'Tài liệu lưu trữ chuyên môn mầm non.'}
                      </p>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="pt-2 border-t border-amber-100 flex items-center justify-between gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1">
                        {/* Preview button */}
                        <button
                          onClick={() => handleOpenDocumentPreview(doc)}
                          className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-xs active:scale-95"
                          title="Bấm để mở xem tài liệu ngay lập tức"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Mở xem luôn</span>
                        </button>

                        {/* Read audio summary */}
                        <button
                          onClick={() => {
                            sounds.playPop();
                            const summaryText = `${doc.title}. Thể loại: ${doc.category}. ${doc.description || doc.content || ''}`;
                            speakText(summaryText, 1.05, 'vi-VN');
                          }}
                          className="p-1.5 rounded-xl hover:bg-amber-100 text-stone-600 hover:text-orange-700 cursor-pointer"
                          title="Đọc tóm tắt bằng giọng nói AI"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Download button */}
                        {doc.fileUrl ? (
                          <a
                            href={doc.fileUrl}
                            download={doc.fileName || `${doc.title}.${doc.type || 'docx'}`}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                            title="Tải file gốc về máy"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Tải về</span>
                          </a>
                        ) : (
                          <button
                            onClick={() => {
                              sounds.playPop();
                              // Export text as downloadable file
                              const blob = new Blob([doc.content || doc.description || doc.title], { type: 'text/plain;charset=utf-8' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${doc.title}.txt`;
                              a.click();
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Tải txt</span>
                          </button>
                        )}

                        {/* Delete button */}
                        <button
                          onClick={() => setDeletingDocId(doc.id)}
                          className="p-1.5 rounded-xl hover:bg-red-50 text-stone-400 hover:text-red-600 cursor-pointer"
                          title="Xóa tài liệu này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SINH TRỌN GÓI HOẠT ĐỘNG AI (1-CHẠM) */}
      {/* ======================================================== */}
      {activeSubTab === 'generator' && (
        <div className="space-y-6">
          {/* Input Controls Card */}
          <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-amber-200/80 shadow-[0_4px_16px_rgba(180,83,9,0.05)] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="sm:col-span-1.5">
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  Chủ đề hoạt động
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ví dụ: Bé khám phá quả cam, Ngày của Mẹ..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200/80 text-xs sm:text-sm font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  Độ tuổi
                </label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200/80 text-xs sm:text-sm font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white cursor-pointer"
                >
                  <option value="18–36 tháng (Nhà trẻ)">18–36 tháng (Nhà trẻ)</option>
                  <option value="3–4 tuổi (Lớp Mầm)">3–4 tuổi (Lớp Mầm)</option>
                  <option value="4–5 tuổi (Lớp Chồi)">4–5 tuổi (Lớp Chồi)</option>
                  <option value="5–6 tuổi (Lớp Lá)">5–6 tuổi (Lớp Lá)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  Thời lượng
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200/80 text-xs sm:text-sm font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white cursor-pointer"
                >
                  <option value="15 phút">15 phút</option>
                  <option value="20 phút">20 phút</option>
                  <option value="25 phút">25 phút</option>
                  <option value="30 phút">30 phút</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end pt-1">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span>🌱 Mầm AI đang tạo trọn bộ...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>✨ Tạo trọn gói hoạt động</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Teaching Pack Result Box */}
          {pack && (
            <div className="space-y-6">
              {/* Header Action Bar */}
              <div className="bg-white/95 rounded-3xl p-5 border border-amber-200/80 shadow-[0_4px_16px_rgba(180,83,9,0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-black text-orange-800 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                    Gói hoàn chỉnh · {pack.ageGroup}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-amber-950 mt-1 font-['Quicksand']">
                    {pack.packTitle}
                  </h2>
                  <p className="text-xs text-stone-600 mt-0.5 font-medium">{pack.planOverview}</p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <button
                    onClick={() => {
                      sounds.playSuccess();
                      setIsSaved(true);
                      onSaveToLibrary(pack);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-orange-800 text-xs font-black border border-amber-200 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaved ? 'Đã lưu thư viện' : 'Lưu thư viện'}</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playPop();
                      setIsExportModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Xuất file Word & PDF</span>
                  </button>
                </div>
              </div>

              {/* 5 Integrated Modules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Câu Chuyện / Bài Thơ Mầm Non */}
                <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 border-b border-amber-100 pb-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-amber-950">1. Truyện Kể & Thơ Ca Nhịp Điệu</h3>
                      <p className="text-[11px] text-stone-500">{pack.storyOrPoem?.type || 'Thơ ca mầm non'}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-50/60 to-orange-50/40 border border-amber-200 space-y-2">
                    <h4 className="font-black text-orange-900 text-center font-['Quicksand']">
                      {pack.storyOrPoem?.title}
                    </h4>
                    <div className="text-xs text-stone-800 font-medium whitespace-pre-line text-center leading-relaxed italic space-y-1">
                      {Array.isArray(pack.storyOrPoem?.content)
                        ? pack.storyOrPoem.content.map((p, idx) => <p key={idx}>{p}</p>)
                        : String(pack.storyOrPoem?.content || '')}
                    </div>
                    <div className="pt-2 text-center">
                      <button
                        onClick={() => {
                          const text = `${pack.storyOrPoem?.title}. ${
                            Array.isArray(pack.storyOrPoem?.content)
                              ? pack.storyOrPoem.content.join('. ')
                              : pack.storyOrPoem?.content
                          }`;
                          speakText(text, 1.05, 'vi-VN');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-orange-700 text-xs font-bold border border-orange-200 hover:bg-orange-50 cursor-pointer shadow-2xs"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Nghe đọc thơ mầm non</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Flashcard Hình Ảnh Minh Họa */}
                <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 border-b border-amber-100 pb-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-amber-950">2. Bộ Thẻ Flashcard 3D Trực Quan</h3>
                      <p className="text-[11px] text-stone-500">Hình ảnh & từ khóa gợi nhớ</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {pack.flashcards?.map((fc, i) => (
                      <div key={i} className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                        <span className="font-bold text-amber-950 block">{fc.title}</span>
                        <p className="text-[10px] text-stone-600 font-medium line-clamp-2">{fc.caption}</p>
                        <span className="inline-block text-[9px] font-black text-orange-700 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200">
                          {fc.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Trò Chơi Tương Tác (Game) */}
                <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 border-b border-amber-100 pb-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                      <Gamepad2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-amber-950">3. Trò Chơi Vận Động & Tương Tác</h3>
                      <p className="text-[11px] text-stone-500">Kích thích giác quan và phản xạ</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-1.5 text-xs">
                    <span className="font-black text-purple-950 block text-sm">
                      🎮 {pack.game?.title}
                    </span>
                    <p className="text-stone-700 font-medium leading-relaxed">
                      {pack.game?.description}
                    </p>
                  </div>
                </div>

                {/* 4. Quiz Nhận Biết Tương Tác */}
                <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 border-b border-amber-100 pb-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-amber-950">4. Trò Chơi Câu Hỏi Đố Bé</h3>
                      <p className="text-[11px] text-stone-500">Tương tác trực tiếp trên lớp</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    {pack.quiz?.slice(0, 2).map((q, qIdx) => {
                      const isAnswered = quizSubmitted[qIdx];
                      const selectedIdx = quizAnswers[qIdx];

                      return (
                        <div key={qIdx} className="p-3 rounded-2xl bg-amber-50/40 border border-amber-100 space-y-2">
                          <span className="font-bold text-amber-950 block">
                            Câu {qIdx + 1}: {q.question}
                          </span>
                          <div className="grid grid-cols-2 gap-1.5">
                            {q.options.map((opt, optIdx) => (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectQuiz(qIdx, optIdx)}
                                className={`p-2 rounded-xl text-[11px] text-left font-bold transition-all border ${
                                  isAnswered && optIdx === q.correctIndex
                                    ? 'bg-emerald-500 text-white border-emerald-600'
                                    : isAnswered && optIdx === selectedIdx
                                    ? 'bg-red-400 text-white border-red-500'
                                    : 'bg-white hover:bg-amber-50 border-stone-200 text-stone-800'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: TẢI LÊN FILE WORD HOẶC PDF (LƯU MÃI) */}
      {/* ======================================================== */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-orange-300 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-sm">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-amber-950 font-bubbly">
                    Tải Lên File Word hoặc PDF
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">
                    Tài liệu sẽ được lưu trữ vĩnh viễn trên máy chủ Mầm AI
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsUploadOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Upload Form */}
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* File Dropzone Area */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".doc,.docx,.pdf,.txt,.pptx"
                  className="hidden"
                  id="doc-file-upload"
                />

                <label
                  htmlFor="doc-file-upload"
                  className={`w-full p-6 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    selectedFile
                      ? 'border-emerald-400 bg-emerald-50/30'
                      : 'border-orange-300 hover:border-orange-500 bg-amber-50/30 hover:bg-amber-50/60'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 mb-2">
                    {selectedFile ? (
                      <FileCheck className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <UploadCloud className="w-6 h-6" />
                    )}
                  </div>

                  {selectedFile ? (
                    <div className="space-y-0.5">
                      <span className="font-black text-sm text-emerald-950 block">
                        ✓ {selectedFile.name}
                      </span>
                      <span className="text-xs text-emerald-700 font-bold">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Sẵn sàng lưu vĩnh viễn
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className="font-black text-sm text-amber-950 font-bubbly block">
                        Bấm hoặc kéo thả file Word (.doc, .docx) hoặc PDF (.pdf) vào đây
                      </span>
                      <p className="text-[11px] text-stone-500 font-medium">
                        Hỗ trợ tối đa 300MB · Lưu trữ không giới hạn thời gian
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {/* Title Input */}
              <div className="space-y-1">
                <label className="text-xs font-black text-amber-950 block">
                  Tiêu đề tài liệu: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Ví dụ: Giáo án 5 bước khám phá quả cam (Lớp Chồi)"
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Category & Author Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-amber-950 block">
                    Chủ đề / Thể loại:
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 focus:outline-none cursor-pointer"
                  >
                    <option value="Giáo án mầm non">Giáo án mầm non</option>
                    <option value="Tài liệu hướng dẫn AI">Tài liệu hướng dẫn AI</option>
                    <option value="Văn học mầm non">Văn học mầm non (Thơ/Truyện)</option>
                    <option value="Kế hoạch tuần STEAM">Kế hoạch tuần STEAM</option>
                    <option value="Sách tham khảo mầm non">Sách tham khảo</option>
                    <option value="Tài liệu chuyên môn khác">Tài liệu chuyên môn khác</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-amber-950 block">
                    Tác giả / Giáo viên:
                  </label>
                  <input
                    type="text"
                    value={uploadAuthor}
                    onChange={(e) => setUploadAuthor(e.target.value)}
                    placeholder="Tên cô giáo..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description textarea */}
              <div className="space-y-1">
                <label className="text-xs font-black text-amber-950 block">
                  Mô tả ngắn / Ghi chú bài giảng:
                </label>
                <textarea
                  rows={2}
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Ghi chú về tài liệu, mục tiêu học tập hoặc lưu ý khi dùng trên lớp..."
                  className="w-full px-3.5 py-2 rounded-2xl bg-amber-50/30 border border-amber-200 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {uploadError && (
                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-amber-100">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 font-bubbly"
                >
                  {isUploading ? (
                    <span>Đang tải lên & lưu vĩnh viễn...</span>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>📤 Lưu Trữ Mãi Mãi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: XEM TRƯỚC VÀ ĐỌC TÀI LIỆU (PREVIEW MODAL) */}
      {/* ======================================================== */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-4xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border-2 border-orange-300 space-y-4 max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-amber-100 pb-3 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300 flex items-center gap-1">
                    <Check className="w-2.5 h-2.5" />
                    <span>LƯU MÃI TRÊN HỆ THỐNG</span>
                  </span>

                  {previewDoc.type === 'docx' || (previewDoc.fileName && (previewDoc.fileName.endsWith('.docx') || previewDoc.fileName.endsWith('.doc'))) ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black border border-blue-300 flex items-center gap-1">
                      <FileText className="w-2.5 h-2.5" />
                      <span>Định dạng Word (.docx)</span>
                    </span>
                  ) : previewDoc.type === 'pdf' || (previewDoc.fileName && previewDoc.fileName.endsWith('.pdf')) ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-black border border-red-300 flex items-center gap-1">
                      <BookOpen className="w-2.5 h-2.5" />
                      <span>Định dạng PDF (.pdf)</span>
                    </span>
                  ) : null}
                </div>

                <h3 className="font-black text-base sm:text-xl text-amber-950 font-['Quicksand'] mt-1 leading-snug">
                  {previewDoc.title}
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  Tác giả: {previewDoc.author || 'Cô giáo'} · Chủ đề: {previewDoc.category} · Cập nhật: {previewDoc.uploadedAt}
                </p>
              </div>

              <button
                onClick={() => setPreviewDoc(null)}
                className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center font-bold cursor-pointer shrink-0 ml-2"
                title="Đóng cửa sổ xem"
              >
                ✕
              </button>
            </div>

            {/* Document Content / Embedded Viewer Box */}
            <div className="flex-1 overflow-y-auto min-h-[300px]">
              {/* Case 1: PDF Document -> Render embedded PDF Viewer */}
              {(previewDoc.type === 'pdf' || (previewDoc.fileName && previewDoc.fileName.toLowerCase().endsWith('.pdf'))) && (previewDoc.fileUrl || previewDoc.fileData) ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-600 bg-red-50 p-2.5 rounded-xl border border-red-200 font-bold">
                    <span>📑 Trình xem tài liệu PDF trực tiếp</span>
                    <a
                      href={previewDoc.fileUrl || previewDoc.fileData}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-700 hover:text-red-900 underline flex items-center gap-1 cursor-pointer font-black"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Mở toàn màn hình tab mới</span>
                    </a>
                  </div>
                  <iframe
                    src={previewDoc.fileUrl || previewDoc.fileData}
                    className="w-full h-[62vh] rounded-2xl border border-stone-200 bg-stone-100"
                    title={previewDoc.title}
                  />
                </div>
              ) : (previewDoc.type === 'docx' || (previewDoc.fileName && (previewDoc.fileName.toLowerCase().endsWith('.docx') || previewDoc.fileName.toLowerCase().endsWith('.doc')))) ? (
                /* Case 2: Word Document (.docx / .doc) -> Render HTML Word page */
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-600 bg-blue-50 p-2.5 rounded-xl border border-blue-200 font-bold">
                    <span className="flex items-center gap-1.5 text-blue-800 font-black">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>Đọc tài liệu Word chuẩn ({previewDoc.fileName || 'file.docx'})</span>
                    </span>

                    <div className="flex items-center gap-2">
                      {previewHtml && (
                        <div className="inline-flex rounded-xl bg-white border border-blue-200 p-0.5 text-[11px]">
                          <button
                            onClick={() => setPreviewViewMode('formatted')}
                            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                              previewViewMode === 'formatted' ? 'bg-blue-600 text-white' : 'text-stone-600'
                            }`}
                          >
                            Định dạng Word
                          </button>
                          <button
                            onClick={() => setPreviewViewMode('raw')}
                            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                              previewViewMode === 'raw' ? 'bg-blue-600 text-white' : 'text-stone-600'
                            }`}
                          >
                            Văn bản
                          </button>
                        </div>
                      )}

                      {(previewDoc.fileUrl || previewDoc.fileData) && (
                        <a
                          href={previewDoc.fileUrl || previewDoc.fileData}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:text-blue-900 underline flex items-center gap-1 cursor-pointer font-bold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Mở tab mới</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {isLoadingPreview ? (
                    <div className="p-12 text-center text-stone-500 font-bold flex flex-col items-center gap-3">
                      <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
                      <span>Đang mở và đọc tài liệu Word của cô...</span>
                    </div>
                  ) : previewViewMode === 'formatted' && previewHtml ? (
                    <div className="bg-white p-6 sm:p-10 rounded-2xl border-2 border-stone-200 shadow-sm max-h-[60vh] overflow-y-auto leading-relaxed text-stone-900 font-sans prose prose-amber max-w-none">
                      <div
                        className="word-rendered-body space-y-3"
                        dangerouslySetInnerHTML={{ __html: previewHtml }}
                      />
                    </div>
                  ) : (
                    <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 text-xs sm:text-sm text-stone-800 font-mono whitespace-pre-wrap leading-relaxed max-h-[60vh] overflow-y-auto">
                      {previewDoc.content || previewDoc.description || 'Tài liệu đã sẵn sàng tải về máy.'}
                    </div>
                  )}
                </div>
              ) : (
                /* Case 3: Other text / markdown documents */
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <span className="text-xs font-black text-amber-950 uppercase tracking-wide block">
                    📖 Nội Dung Tài Liệu:
                  </span>
                  <div className="text-xs sm:text-sm text-stone-800 font-mono whitespace-pre-wrap leading-relaxed max-h-[60vh] overflow-y-auto bg-white p-4 rounded-xl border border-stone-200">
                    {previewDoc.content || previewDoc.description || 'Tài liệu file đính kèm đã sẵn sàng tải về máy.'}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-amber-100 shrink-0">
              <button
                onClick={() => {
                  sounds.playPop();
                  const readText = `${previewDoc.title}. ${previewDoc.content || previewDoc.description || ''}`;
                  speakText(readText, 1.05, 'vi-VN');
                }}
                className="px-4 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-orange-800 font-bold text-xs border border-amber-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-orange-600" />
                <span>Nghe giọng đọc AI</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                >
                  Đóng
                </button>

                {(previewDoc.fileUrl || previewDoc.fileData) && (
                  <a
                    href={previewDoc.fileUrl || previewDoc.fileData}
                    download={previewDoc.fileName || `${previewDoc.title}.${previewDoc.type || 'docx'}`}
                    className="px-5 py-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải Về Máy</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: XÁC NHẬN XÓA TÀI LIỆU */}
      {/* ======================================================== */}
      {deletingDocId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-2 border-red-300 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-amber-950 font-bubbly">
                Xóa Tài Liệu Này?
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Tài liệu sẽ bị xóa hoàn toàn khỏi kho lưu trữ vĩnh viễn trên máy chủ.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setDeletingDocId(null)}
                className="flex-1 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDeleteDocument(deletingDocId)}
                className="flex-1 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs cursor-pointer shadow-sm"
              >
                Xác Nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export / Share Modal for Teaching Pack */}
      <ExportShareModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        item={{
          type: 'teaching_pack',
          id: pack.id,
          title: pack.packTitle,
          subtitle: pack.ageGroup,
          data: pack,
        }}
      />
    </div>
  );
};
