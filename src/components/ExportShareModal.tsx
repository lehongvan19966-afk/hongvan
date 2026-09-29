import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Share2,
  QrCode,
  Copy,
  Check,
  Download,
  FileCode,
  FileText,
  Printer,
  Smartphone,
  Laptop,
  Sparkles,
  ExternalLink,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { MamAiMascot } from './MamAiMascot';
import { sounds } from '../utils/audioUtils';
import {
  ShareItemData,
  createShare,
  generateShareText,
  generateStandaloneHtml,
  downloadFile,
  triggerMobileShare,
} from '../services/shareService';

interface ExportShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ShareItemData;
}

export const ExportShareModal: React.FC<ExportShareModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const [activeTab, setActiveTab] = useState<'share' | 'export' | 'pwa'>('share');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [isCopiedText, setIsCopiedText] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isMobile =
    typeof navigator !== 'undefined' &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Generate share link and QR code on open
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoading(true);

    async function initShare() {
      try {
        const result = await createShare(item);
        if (!isMounted) return;

        const url = result.shareUrl;
        setShareUrl(url);

        // Generate QR code
        try {
          const qr = await QRCode.toDataURL(url, {
            width: 320,
            margin: 2,
            color: {
              dark: '#9a3412',
              light: '#ffffff',
            },
          });
          if (isMounted) setQrDataUrl(qr);
        } catch (qrErr) {
          console.error('Failed to generate QR code:', qrErr);
        }
      } catch (err) {
        console.error('Error initiating share:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initShare();

    return () => {
      isMounted = false;
    };
  }, [isOpen, item]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    sounds.playPop();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      showToast('📋 Đã sao chép liên kết! Dùng được cả trên điện thoại và máy tính.');
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      showToast('⚠️ Không thể sao chép tự động, vui lòng chọn và copy liên kết.');
    }
  };

  const handleMobileShare = async () => {
    sounds.playPop();
    const shareText = generateShareText(item, shareUrl);
    const res = await triggerMobileShare({
      title: item.title,
      text: shareText,
      url: shareUrl,
    });

    if (res.shared) {
      showToast('🎉 Đã mở bảng chia sẻ ứng dụng của điện thoại!');
    } else if (res.copied) {
      setIsCopied(true);
      showToast('📋 Đã sao chép liên kết vào bộ nhớ tạm!');
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleCopyFormattedText = async () => {
    sounds.playPop();
    const formatted = generateShareText(item, shareUrl);
    try {
      await navigator.clipboard.writeText(formatted);
      setIsCopiedText(true);
      showToast('💬 Đã sao chép văn bản định dạng! Sẵn sàng dán vào nhóm Zalo / SMS.');
      setTimeout(() => setIsCopiedText(false), 2500);
    } catch {
      showToast('⚠️ Không thể sao chép văn bản.');
    }
  };

  const handleDownloadHtml = () => {
    sounds.playSuccess();
    const html = generateStandaloneHtml(item, shareUrl);
    const safeTitle = (item.title || 'Hoc_Lieu_Mam_Non').replace(/\s+/g, '_').toLowerCase();
    downloadFile(html, `${safeTitle}_vuon_uom_ai.html`, 'text/html;charset=utf-8');
    showToast('🌐 Đã tải file Web độc lập (.html)! Mở được trên 100% điện thoại và máy tính.');
  };

  const handleDownloadWord = () => {
    sounds.playSuccess();
    const html = generateStandaloneHtml(item, shareUrl);
    const safeTitle = (item.title || 'Giao_An_Mam_Non').replace(/\s+/g, '_').toLowerCase();
    downloadFile('\ufeff' + html, `${safeTitle}.doc`, 'application/msword;charset=utf-8');
    showToast('📄 Đã tải file Microsoft Word (.doc) cho máy tính!');
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    sounds.playSuccess();
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR_${(item.title || 'vuon_uom_ai').replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('📸 Đã tải ảnh mã QR xuống máy!');
  };

  const handlePrint = () => {
    sounds.playPop();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-60 bg-stone-900 text-white px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-xl border border-stone-700 flex items-center gap-2 animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-amber-200/90 shadow-[0_20px_60px_rgba(249,115,22,0.15)] max-w-2xl w-full overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-4 sm:p-5 relative shrink-0">
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
              <MamAiMascot size="sm" mood="happy" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black bg-white/25 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Xuất & Chia Sẻ
                </span>
                <span className="text-[11px] font-bold bg-amber-900/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  {isMobile ? <Smartphone className="w-3 h-3" /> : <Laptop className="w-3 h-3" />}
                  <span>{isMobile ? 'Điện thoại' : 'Máy tính'}</span>
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black font-['Quicksand'] mt-1 truncate max-w-md">
                {item.title}
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-100 font-medium">
                Tối ưu 100% để mở, xem và tương tác mượt mà trên cả <strong>Điện thoại</strong> lẫn{' '}
                <strong>Máy tính</strong>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-white/20">
            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('share');
              }}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'share'
                  ? 'bg-white text-orange-950 shadow-sm'
                  : 'text-amber-100 hover:bg-white/10'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>📱 Liên kết & QR</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('export');
              }}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'export'
                  ? 'bg-white text-orange-950 shadow-sm'
                  : 'text-amber-100 hover:bg-white/10'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>💾 Tải File Đa Thiết Bị</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('pwa');
              }}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'pwa'
                  ? 'bg-white text-orange-950 shadow-sm'
                  : 'text-amber-100 hover:bg-white/10'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>📲 Cài Đặt App</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* TAB 1: LIÊN KẾT & MÃ QR */}
          {activeTab === 'share' && (
            <div className="space-y-4">
              {/* Primary Mobile Share Button */}
              <button
                onClick={handleMobileShare}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>
                  {isMobile
                    ? '🚀 Chia sẻ ngay qua Zalo, Messenger, AirDrop...'
                    : '🚀 Mở Menu Chia Sẻ Nhanh'}
                </span>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-amber-50/60 p-4 sm:p-5 rounded-3xl border border-amber-200">
                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                  <div className="bg-white p-3 rounded-2xl border-2 border-amber-300 shadow-sm relative">
                    {isLoading ? (
                      <div className="w-44 h-44 flex flex-col items-center justify-center text-amber-700 text-xs gap-2">
                        <Sparkles className="w-6 h-6 animate-spin text-orange-500" />
                        <span>Đang tạo mã QR...</span>
                      </div>
                    ) : qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="Mã QR chia sẻ"
                        className="w-44 h-44 object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-44 h-44 flex items-center justify-center text-xs text-stone-500">
                        Không thể tạo QR
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-black text-amber-950 font-['Quicksand'] flex items-center justify-center gap-1">
                      <span>📸 Quét bằng Zalo hoặc Camera điện thoại</span>
                    </p>
                    <p className="text-[11px] text-stone-600">
                      Soạn trên máy tính ➔ quét mã để xem & dạy ngay trên điện thoại!
                    </p>
                  </div>

                  <button
                    onClick={handleDownloadQr}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-orange-600" />
                    <span>Tải ảnh mã QR</span>
                  </button>
                </div>

                {/* Direct Link & Quick Copy Actions */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-black text-stone-800 mb-1">
                      🔗 Đường dẫn truy cập trực tiếp:
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        readOnly
                        value={shareUrl || 'Đang tạo liên kết...'}
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-amber-200 text-xs font-mono font-medium text-stone-800 select-all focus:outline-none"
                      />
                      <button
                        onClick={handleCopyLink}
                        className={`px-3 py-2 rounded-xl text-xs font-black border transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-white hover:bg-amber-100 text-stone-800 border-amber-200 shadow-2xs'
                        }`}
                        title="Sao chép link"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Đã chép' : 'Sao chép'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Copy formatted text for chat */}
                  <div className="pt-2 border-t border-amber-200/80">
                    <p className="text-xs font-black text-stone-800 mb-1 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
                      <span>Gửi vào nhóm Zalo nhà trường / phụ huynh:</span>
                    </p>
                    <button
                      onClick={handleCopyFormattedText}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isCopiedText
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-white hover:bg-orange-50 text-orange-900 border-orange-200 shadow-2xs'
                      }`}
                    >
                      {isCopiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-orange-600" />}
                      <span>{isCopiedText ? 'Đã sao chép văn bản!' : '📋 Sao chép nội dung kèm link gửi Zalo'}</span>
                    </button>
                  </div>

                  <div className="p-3 bg-white/80 rounded-2xl border border-amber-100 text-[11px] text-stone-600 space-y-1">
                    <div className="flex items-center gap-1 text-emerald-700 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Tương thích đa nền tảng:</span>
                    </div>
                    <p>• <strong>iPhone / iPad</strong>: Safari, Chrome, Zalo webview</p>
                    <p>• <strong>Android</strong>: Samsung Internet, Chrome, Cốc Cốc</p>
                    <p>• <strong>Máy tính / Bảng tương tác</strong>: Windows, MacOS, Smart TV</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: XUẤT TỆP ĐA THIẾT BỊ */}
          {activeTab === 'export' && (
            <div className="space-y-3">
              <p className="text-xs text-stone-600 font-medium">
                Chọn định dạng xuất tệp phù hợp với thiết bị của cô hoặc người nhận:
              </p>

              {/* Option 1: Standalone HTML (Recommended for BOTH Mobile & Desktop) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-black text-amber-950 font-['Quicksand']">
                        File Web Độc Lập (.html)
                      </h4>
                      <span className="text-[10px] font-black bg-orange-500 text-white px-2 py-0.2 rounded-full">
                        🌟 Khuyên dùng
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium mt-0.5">
                      Mở được trên <strong>100% điện thoại (iPhone, Android)</strong> và máy tính mà không cần cài Word/Office. Hoạt động cả khi không có mạng Internet.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDownloadHtml}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải file .HTML</span>
                </button>
              </div>

              {/* Option 2: Microsoft Word (.doc) */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-blue-300 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-stone-900 font-['Quicksand']">
                      Microsoft Word (.doc)
                    </h4>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">
                      Mẫu văn bản tiêu chuẩn A4 để chỉnh sửa trên <strong>máy tính</strong>, nộp Ban Giám Hiệu hoặc Tổ Chuyên Môn.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDownloadWord}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-black text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Download className="w-4 h-4 text-blue-600" />
                  <span>Tải Word (.doc)</span>
                </button>
              </div>

              {/* Option 3: Print / Save as PDF */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-amber-300 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-stone-900 font-['Quicksand']">
                      In / Lưu PDF Trực Tiếp
                    </h4>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">
                      Tự động căn chỉnh khổ A4 chuẩn, ẩn các nút điều khiển khi in hoặc xuất PDF từ điện thoại & máy tính.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handlePrint}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-stone-600" />
                  <span>In / PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: HƯỚNG DẪN CÀI ĐẶT PWA */}
          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-950 font-medium">
                💡 Cài đặt <strong>Vườn Ươm AI</strong> thành ứng dụng trên màn hình để mở ngay lập tức, dùng mượt mà toàn màn hình không có thanh địa chỉ trình duyệt!
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* iPhone / iPad */}
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-stone-900 font-black text-xs sm:text-sm font-['Quicksand']">
                    <span>🍏</span>
                    <span>Trên iPhone / iPad (Safari)</span>
                  </div>
                  <ol className="text-xs text-stone-600 space-y-1.5 pl-4 list-decimal font-medium">
                    <li>Mở liên kết bằng trình duyệt <strong>Safari</strong>.</li>
                    <li>Nhấn vào biểu tượng <strong>Chia sẻ</strong> (hình ô vuông có mũi tên hướng lên ở dưới cùng).</li>
                    <li>Cuộn xuống và chọn <strong>&ldquo;Thêm vào Màn hình chính&rdquo; (Add to Home Screen)</strong>.</li>
                    <li>Nhấn <strong>Thêm</strong> ở góc trên bên phải.</li>
                  </ol>
                </div>

                {/* Android Phone */}
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-stone-900 font-black text-xs sm:text-sm font-['Quicksand']">
                    <span>🤖</span>
                    <span>Trên Điện thoại Android (Chrome)</span>
                  </div>
                  <ol className="text-xs text-stone-600 space-y-1.5 pl-4 list-decimal font-medium">
                    <li>Mở liên kết bằng <strong>Chrome</strong> hoặc Cốc Cốc.</li>
                    <li>Nhấn vào dấu <strong>3 chấm</strong> ở góc trên bên phải.</li>
                    <li>Chọn <strong>&ldquo;Cài đặt ứng dụng&rdquo;</strong> hoặc <strong>&ldquo;Thêm vào Màn hình chính&rdquo;</strong>.</li>
                    <li>Xác nhận để tạo biểu tượng mầm cây trên màn hình.</li>
                  </ol>
                </div>

                {/* PC / Laptop */}
                <div className="sm:col-span-2 p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-stone-900 font-black text-xs sm:text-sm font-['Quicksand']">
                    <span>💻</span>
                    <span>Trên Máy Tính / Laptop (Chrome / Edge)</span>
                  </div>
                  <p className="text-xs text-stone-600 font-medium">
                    Nhấn vào biểu tượng <strong>Cài đặt</strong> (hình máy tính nhỏ có mũi tên xuống ở cuối thanh địa chỉ URL) ➔ Chọn <strong>Cài đặt</strong> để mở ứng dụng trong cửa sổ riêng biệt không vướng thanh công cụ trình duyệt.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 px-4 sm:px-6 py-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 font-medium shrink-0">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Vườn Ươm AI · Công nghệ nâng bước cô nuôi dạy trẻ</span>
          </span>
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 font-bold border border-stone-300 transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
