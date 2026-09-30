import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  FileText,
  Calendar,
  User,
  Tag,
  Share2,
  Printer,
  Sparkles,
  ExternalLink,
  Volume2,
  Film,
  Eye,
} from 'lucide-react';
import { StoredDocument } from '../services/persistentDocStorage';
import { sounds } from '../utils/audioUtils';

interface DocumentViewerModalProps {
  document: StoredDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document: doc,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !doc) return null;

  const handleCopy = () => {
    sounds.playPop();
    const textToCopy = doc.content || `${doc.title}\n\nMô tả: ${doc.description || ''}\nTác giả: ${doc.author}`;
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    sounds.playSuccess();
    if (doc.fileUrl) {
      const a = window.document.createElement('a');
      a.href = doc.fileUrl;
      a.download = doc.fileName || `${doc.title}.${doc.type}`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
    } else if (doc.fileData) {
      const a = window.document.createElement('a');
      a.href = doc.fileData;
      a.download = doc.fileName || `${doc.title}.${doc.type === 'docx' ? 'docx' : doc.type === 'pdf' ? 'pdf' : 'txt'}`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
    } else {
      // Create blob download from content
      const content = doc.content || `${doc.title}\n\n${doc.description || ''}`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = doc.fileName || `${doc.title}.txt`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getTypeBadge = (type: StoredDocument['type']) => {
    switch (type) {
      case 'pdf':
        return { label: 'PDF', bg: 'bg-red-500 text-white' };
      case 'docx':
        return { label: 'DOCX (Word)', bg: 'bg-blue-600 text-white' };
      case 'pptx':
        return { label: 'PPTX (PowerPoint)', bg: 'bg-orange-600 text-white' };
      case 'image':
        return { label: 'Hình ảnh', bg: 'bg-purple-600 text-white' };
      case 'video':
        return { label: 'Video', bg: 'bg-pink-600 text-white' };
      case 'audio':
        return { label: 'Âm thanh', bg: 'bg-emerald-600 text-white' };
      case 'text':
      default:
        return { label: 'Văn bản', bg: 'bg-amber-600 text-white' };
    }
  };

  const typeInfo = getTypeBadge(doc.type);
  const mediaSource = doc.fileUrl || doc.fileData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-fadeIn font-['Nunito',sans-serif]">
      <div className="relative w-full max-w-3xl bg-[#FFFDF9] rounded-[36px] border-[4px] border-white shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-scale-in">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-200/80 bg-gradient-to-r from-amber-50/70 via-white to-orange-50/60 flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`w-11 h-11 rounded-2xl ${typeInfo.bg} flex items-center justify-center font-black text-xs shrink-0 shadow-sm`}
            >
              {typeInfo.label.split(' ')[0]}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold border border-amber-200">
                  {doc.category}
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                  ✓ Lưu trữ vĩnh viễn
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black font-bubbly text-stone-900 truncate">
                {doc.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-stone-500 font-medium mt-0.5">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  <span>{doc.author}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>{doc.uploadedAt}</span>
                </span>
                {doc.fileSize && (
                  <>
                    <span>•</span>
                    <span>{doc.fileSize}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center shadow-2xs transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Description Box */}
          {doc.description && (
            <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs text-amber-950 font-medium">
              <span className="font-bold text-orange-800 block mb-0.5">💡 Mô tả tài liệu:</span>
              <p>{doc.description}</p>
            </div>
          )}

          {/* Video Preview if video */}
          {doc.type === 'video' && mediaSource && (
            <div className="rounded-2xl overflow-hidden border border-amber-200 bg-stone-950 shadow-md">
              <video
                controls
                src={mediaSource}
                className="w-full max-h-[380px] object-contain mx-auto"
              />
            </div>
          )}

          {/* Audio Preview if audio */}
          {doc.type === 'audio' && mediaSource && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>Nghe tài liệu âm thanh / bài hát / đọc thơ mầm non</span>
              </div>
              <audio controls src={mediaSource} className="w-full mt-1" />
            </div>
          )}

          {/* PDF Preview if pdf with source */}
          {doc.type === 'pdf' && mediaSource && (
            <div className="rounded-2xl overflow-hidden border border-amber-200 shadow-sm bg-stone-100 flex flex-col">
              <div className="bg-amber-100/80 px-4 py-2 flex items-center justify-between text-xs text-amber-900 font-bold border-b border-amber-200">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-red-600" />
                  <span>Xem trực tiếp file PDF</span>
                </span>
                <span className="text-[11px] text-stone-500 truncate max-w-xs">{doc.fileName}</span>
              </div>
              <iframe
                src={mediaSource}
                title={doc.title}
                className="w-full h-[450px] border-0 bg-white"
              />
            </div>
          )}

          {/* Image Preview if image */}
          {doc.type === 'image' && mediaSource && (
            <div className="rounded-2xl overflow-hidden border border-amber-200 shadow-sm max-h-96 flex items-center justify-center bg-stone-50">
              <img
                src={mediaSource}
                alt={doc.title}
                className="max-h-96 object-contain w-full"
              />
            </div>
          )}

          {/* Text / Document Content Preview */}
          <div className="bg-white rounded-2xl border-2 border-amber-200/90 p-4 sm:p-5 shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-100">
              <span className="text-xs font-black font-bubbly text-stone-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-orange-600" />
                <span>Nội dung tài liệu:</span>
              </span>
              <span className="text-[11px] text-stone-400">
                {doc.fileName || `${doc.title}.txt`}
              </span>
            </div>

            <pre className="text-xs sm:text-sm font-sans text-stone-800 whitespace-pre-wrap leading-relaxed select-text font-normal max-h-96 overflow-y-auto">
              {doc.content ||
                'Tài liệu dạng đính kèm (Word / PDF / PowerPoint / Video). Cô có thể bấm nút "Tải tài liệu về máy" ở bên dưới để mở toàn vẹn bằng phần mềm chuyên dụng trên máy tính.'}
            </pre>
          </div>

          {/* Tags */}
          {doc.tags && doc.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <Tag className="w-3.5 h-3.5 text-stone-400" />
              {doc.tags.map((t) => (
                <span
                  key={t}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-bold"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-amber-200/80 bg-stone-50/70 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 text-stone-700 font-bold text-xs border border-amber-200/80 flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
              <span>{copied ? 'Đã sao chép!' : 'Sao chép văn bản'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black font-bubbly text-xs shadow-md shadow-orange-500/25 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-102"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải tài liệu về máy</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-xs cursor-pointer transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
