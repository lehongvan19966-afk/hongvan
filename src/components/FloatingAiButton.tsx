import React, { useState } from 'react';
import { MamAiMascot } from './MamAiMascot';
import { X, Send, Sparkles, BookOpen, Globe, Search, MessageSquareHeart } from 'lucide-react';
import { chatWithMamAi } from '../services/aiService';
import { sounds } from '../utils/audioUtils';

interface FloatingAiButtonProps {
  onNavigate: (tab: string, extra?: Record<string, unknown>) => void;
}

export const FloatingAiButton: React.FC<FloatingAiButtonProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'ai' | 'user'; content: string }>>([
    {
      role: 'ai',
      content:
        'Xin chào cô ạ! 🌱 Mầm AI luôn sẵn sàng hỗ trợ cô chuẩn bị bài giảng, gợi ý trò chơi vui nhộn và tích hợp tiếng Anh tự nhiên. Hôm nay cô muốn Mầm AI giúp gì ạ?',
    },
  ]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    sounds.playPop();
    const userMsg = { role: 'user' as const, content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const reply = await chatWithMamAi(text, messages);
      setMessages((prev) => [...prev, { role: 'ai' as const, content: reply }]);
      sounds.playSuccess();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai' as const,
          content: 'Mầm AI luôn đồng hành cùng cô. Cô có thể bấm nút Soạn giáo án hoặc English Buddy để bắt đầu ngay nhé! 💖',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button - Warm Terracotta & Caramel Tone */}
      <div className="fixed bottom-22 right-4 sm:bottom-8 sm:right-8 z-40">
        <button
          onClick={() => {
            sounds.playPop();
            setIsOpen(!isOpen);
          }}
          className="group relative flex items-center gap-2 p-1.5 sm:px-3.5 sm:py-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-[0_8px_24px_rgba(234,88,12,0.35)] hover:shadow-[0_12px_32px_rgba(234,88,12,0.45)] hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/90 cursor-pointer"
          aria-label="Hỏi Mầm AI"
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
            <MamAiMascot size="sm" mood={isOpen ? 'happy' : 'idle'} />
          </div>
          <span className="hidden sm:inline-block font-black text-xs pr-1 tracking-tight font-['Quicksand']">
            Hỏi Mầm AI ✨
          </span>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange-600 border-2 border-white"></span>
          </span>
        </button>
      </div>

      {/* Slide-over Assistant Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/35 backdrop-blur-xs animate-fadeIn">
          <div
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-amber-200/80 flex flex-col max-h-[85vh] sm:max-h-[640px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-amber-100/90 via-[#FFF8F0] to-orange-100/80 border-b border-amber-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white shadow-2xs flex items-center justify-center border border-amber-200">
                  <MamAiMascot size="sm" mood="teaching" />
                </div>
                <div>
                  <h3 className="font-black text-amber-950 text-sm flex items-center gap-1.5 font-['Quicksand']">
                    Mầm AI – Trợ Lý Mầm Non
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  </h3>
                  <p className="text-[11px] text-stone-500 font-medium">
                    Cô hỏi gì, Mầm AI hỗ trợ nấy 🌸
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-500 hover:text-stone-800 flex items-center justify-center transition-all border border-amber-100 cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Suggestions */}
            <div className="p-3 bg-amber-50/60 border-b border-amber-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onNavigate('ai-assistant');
                }}
                className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[11px] whitespace-nowrap shadow-xs hover:from-orange-600 hover:to-amber-600 transition-all flex items-center gap-1 cursor-pointer font-['Quicksand']"
              >
                <span>🤖</span>
                <span>Trợ lý AI mầm non</span>
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onNavigate('lesson-studio');
                }}
                className="px-2.5 py-1 rounded-xl bg-white border border-amber-200 text-[11px] font-bold text-orange-800 whitespace-nowrap shadow-2xs hover:bg-orange-50 transition-all flex items-center gap-1 cursor-pointer"
              >
                <BookOpen className="w-3 h-3 text-orange-600" />
                Soạn giáo án
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onNavigate('english-buddy');
                }}
                className="px-2.5 py-1 rounded-xl bg-white border border-amber-200 text-[11px] font-bold text-amber-900 whitespace-nowrap shadow-2xs hover:bg-amber-50 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Globe className="w-3 h-3 text-amber-600" />
                English Buddy
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onNavigate('library');
                }}
                className="px-2.5 py-1 rounded-xl bg-white border border-amber-200 text-[11px] font-bold text-stone-700 whitespace-nowrap shadow-2xs hover:bg-stone-50 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Search className="w-3 h-3 text-stone-500" />
                Tìm học liệu
              </button>
              <button
                onClick={() => handleSendMessage('Gợi ý trò chơi vận động 5 phút cho trẻ 3-4 tuổi')}
                className="px-2.5 py-1 rounded-xl bg-white border border-amber-200 text-[11px] font-bold text-orange-800 whitespace-nowrap shadow-2xs hover:bg-orange-50 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-orange-500" />
                Game 5 phút
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FFFDF9]/60">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'ai' && (
                    <div className="w-7 h-7 rounded-full bg-white border border-amber-200 flex items-center justify-center shrink-0 shadow-2xs">
                      <MamAiMascot size="sm" mood="idle" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-tr-none shadow-2xs font-medium'
                        : 'bg-white text-stone-800 border border-amber-100/90 rounded-tl-none shadow-2xs font-medium'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2.5 items-center">
                  <div className="w-7 h-7 rounded-full bg-white border border-amber-200 flex items-center justify-center shadow-2xs">
                    <MamAiMascot size="sm" mood="thinking" />
                  </div>
                  <div className="bg-white border border-amber-100 p-2.5 rounded-2xl rounded-tl-none shadow-2xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
                    <span
                      className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0.15s' }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0.3s' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-amber-100 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Nhập câu hỏi hoặc yêu cầu cho Mầm AI..."
                className="flex-1 px-4 py-2.5 bg-amber-50/40 border border-amber-200/80 rounded-2xl text-xs sm:text-sm font-semibold text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="w-10 h-10 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-40 transition-all shadow-2xs cursor-pointer"
                aria-label="Gửi"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
