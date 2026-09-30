import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  Tag,
  BookOpen,
} from 'lucide-react';
import { persistentDocStorage, StoredDocument } from '../services/persistentDocStorage';
import { sounds } from '../utils/audioUtils';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceFunction?: StoredDocument['sourceFunction'];
  defaultCategory?: string;
  onSuccess?: (doc: StoredDocument) => void;
  authorName?: string;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  sourceFunction = 'academy',
  defaultCategory = 'Tài liệu hướng dẫn AI',
  onSuccess,
  authorName = 'Cô Lê Hồng Vân',
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('TaiLieu, AI, MamNon');
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<string>('');
  const [fileType, setFileType] = useState<StoredDocument['type']>('pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    sounds.playPop();
    setFile(selected);
    if (!title) {
      setTitle(selected.name.replace(/\.[^/.]+$/, ''));
    }

    // Determine type
    const ext = selected.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') setFileType('pdf');
    else if (['doc', 'docx'].includes(ext || '')) setFileType('docx');
    else if (['ppt', 'pptx'].includes(ext || '')) setFileType('pptx');
    else if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) setFileType('image');
    else if (['mp4', 'mov', 'webm'].includes(ext || '')) setFileType('video');
    else if (['mp3', 'wav', 'm4a'].includes(ext || '')) setFileType('audio');
    else setFileType('text');

    // Read base64 for persistent storage
    const reader = new FileReader();
    reader.onload = () => {
      setFileData(reader.result as string);
    };
    reader.readAsDataURL(selected);

    // If it's a text file, read text content
    if (ext === 'txt') {
      const textReader = new FileReader();
      textReader.onload = () => {
        setContent(textReader.result as string);
      };
      textReader.readAsText(selected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !file) {
      alert('Vui lòng nhập tên tài liệu hoặc chọn file');
      return;
    }

    sounds.playSuccess();
    setIsSubmitting(true);

    const docTitle = title.trim() || (file ? file.name.replace(/\.[^/.]+$/, '') : 'Tài liệu không tên');
    const parsedTags = tags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    try {
      let newDoc: StoredDocument;

      if (file) {
        newDoc = await persistentDocStorage.uploadDocumentFile(file, {
          title: docTitle,
          type: fileType,
          category,
          sourceFunction,
          author: authorName,
          description: description.trim(),
          content: content.trim() || description.trim(),
          tags: parsedTags,
        });
      } else {
        newDoc = persistentDocStorage.saveDocument({
          title: docTitle,
          type: fileType,
          category,
          sourceFunction,
          fileUrl: '',
          fileName: `${docTitle.replace(/\s+/g, '_')}.${fileType === 'docx' ? 'docx' : fileType === 'pdf' ? 'pdf' : 'txt'}`,
          fileSize: '1.0 MB',
          fileData: fileData || undefined,
          content: content.trim() || description.trim(),
          author: authorName,
          description: description.trim(),
          tags: parsedTags,
        });
      }

      if (onSuccess) onSuccess(newDoc);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error('Lỗi lưu tài liệu:', err);
      setIsSubmitting(false);
      alert('Không thể lưu tài liệu. Vui lòng thử lại!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-fadeIn font-['Nunito',sans-serif]">
      <div className="relative w-full max-w-lg bg-[#FFFDF9] rounded-[36px] border-[4px] border-white shadow-2xl p-5 sm:p-7 overflow-hidden flex flex-col max-h-[92vh] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-200 text-xs font-black font-bubbly mb-1">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Lưu Trữ Bền Vững Lâu Dài</span>
            </div>
            <h3 className="text-xl font-black font-bubbly text-stone-900">
              Tải Lên Tài Liệu Mới 📚
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Tài liệu sẽ được lưu an toàn, xem và tải về lâu dài bất cứ lúc nào
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="py-4 overflow-y-auto space-y-3.5 text-xs">
          {/* File Picker Drag & Drop Box */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Chọn tệp tài liệu (PDF, Word .docx, PowerPoint .pptx, Ảnh, Text):
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`p-4 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer ${
                file
                  ? 'bg-emerald-50/70 border-emerald-400'
                  : 'bg-amber-50/40 hover:bg-amber-100/50 border-amber-300'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
                onChange={handleSelectFile}
                className="hidden"
              />
              <Upload className="w-7 h-7 text-orange-600 mx-auto mb-1.5" />
              {file ? (
                <div className="space-y-0.5">
                  <span className="font-black font-bubbly text-emerald-800 text-xs block">
                    ✓ Đã chọn: {file.name}
                  </span>
                  <span className="text-[10px] text-stone-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB · Định dạng {fileType.toUpperCase()}
                  </span>
                </div>
              ) : (
                <div>
                  <span className="font-bold text-stone-700 block">
                    Bấm để chọn tệp từ máy tính / điện thoại
                  </span>
                  <span className="text-[10px] text-stone-400">
                    Hỗ trợ file PDF, Word, PowerPoint, Text, Hình ảnh
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Tên tài liệu: <span className="text-orange-600">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Giáo án 5 bước khám phá rau củ..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white border-2 border-amber-200 text-xs font-bold text-stone-900 focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Chuyên mục:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl bg-white border border-amber-200 text-xs font-bold text-stone-800 focus:outline-none focus:border-orange-500"
              >
                <option value="Tài liệu hướng dẫn AI">Tài liệu hướng dẫn AI</option>
                <option value="Giáo án mầm non">Giáo án mầm non</option>
                <option value="Văn học & Thơ truyện">Văn học & Thơ truyện</option>
                <option value="English Buddy">English Buddy</option>
                <option value="Trò chơi & Học liệu">Trò chơi & Học liệu</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Định dạng file:</label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-2xl bg-white border border-amber-200 text-xs font-bold text-stone-800 focus:outline-none focus:border-orange-500"
              >
                <option value="docx">Word (.docx)</option>
                <option value="pdf">PDF (.pdf)</option>
                <option value="pptx">PowerPoint (.pptx)</option>
                <option value="text">Văn bản (.txt)</option>
                <option value="image">Hình ảnh (.png, .jpg)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Mô tả ngắn gọn:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Giới thiệu đôi nét về tài liệu để đồng nghiệp và cô dễ tra cứu..."
              rows={2}
              className="w-full px-3.5 py-2 rounded-2xl bg-white border border-amber-200 text-xs text-stone-900 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Content / Notes */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Nội dung văn bản / Ghi chú chi tiết:
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập hoặc dán nội dung giáo án, bài thơ, prompt để xem trực tiếp không cần tải..."
              rows={3}
              className="w-full px-3.5 py-2 rounded-2xl bg-white border border-amber-200 text-xs text-stone-900 focus:outline-none focus:border-orange-500 font-mono"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-amber-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-xs cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black font-bubbly text-xs shadow-md shadow-orange-500/25 cursor-pointer transition-all hover:scale-102 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Lưu tài liệu vĩnh viễn</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
