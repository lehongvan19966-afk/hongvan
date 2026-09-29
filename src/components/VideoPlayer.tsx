import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  FastForward,
  Rewind,
  AlertTriangle,
  RefreshCw,
  Clock,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { sounds } from '../utils/audioUtils';
import { MamAiMascot } from './MamAiMascot';

export interface VideoPlayerRef {
  seekTo: (seconds: number) => void;
  play: () => void;
  pause: () => void;
  getCurrentTime: () => number;
}

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title: string;
  initialTime?: number;
  onTimeUpdate?: (currentTime: number, duration: number, percentage: number) => void;
  onEnded?: () => void;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ src, poster, title, initialTime = 0, onTimeUpdate, onEnded }, ref) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Playback state
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState<number>(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Resume Prompt state (XV-K: "▶ Tiếp tục xem từ MM:SS")
    const [showResumeBanner, setShowResumeBanner] = useState(false);
    const [resumeSeconds, setResumeSeconds] = useState(0);

    // Controls visibility
    const [showControls, setShowControls] = useState(true);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Format seconds to mm:ss or hh:mm:ss
    const formatTime = (secs: number) => {
      if (isNaN(secs) || secs < 0) return '00:00';
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      const h = Math.floor(m / 60);
      if (h > 0) {
        const remM = m % 60;
        return `${h}:${remM < 10 ? '0' : ''}${remM}:${s < 10 ? '0' : ''}${s}`;
      }
      return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // Expose imperative methods to parent
    useImperativeHandle(ref, () => ({
      seekTo: (seconds: number) => {
        if (videoRef.current) {
          videoRef.current.currentTime = seconds;
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
          sounds.playPop();
        }
      },
      play: () => {
        videoRef.current?.play().catch(() => {});
        setIsPlaying(true);
      },
      pause: () => {
        videoRef.current?.pause();
        setIsPlaying(false);
      },
      getCurrentTime: () => {
        return videoRef.current ? videoRef.current.currentTime : 0;
      },
    }));

    // Auto resume check on load
    useEffect(() => {
      if (initialTime && initialTime > 5) {
        setResumeSeconds(initialTime);
        setShowResumeBanner(true);
      } else {
        setShowResumeBanner(false);
      }
    }, [initialTime, src]);

    // Handle play/pause
    const togglePlay = () => {
      sounds.playPop();
      if (!videoRef.current) return;
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch((err) => {
          console.warn('Playback error:', err);
        });
        setIsPlaying(true);
      }
    };

    // Handle rewind/forward 10s
    const handleRewind = () => {
      sounds.playPop();
      if (!videoRef.current) return;
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    };

    const handleForward = () => {
      sounds.playPop();
      if (!videoRef.current) return;
      videoRef.current.currentTime = Math.min(
        videoRef.current.duration || 1000,
        videoRef.current.currentTime + 10
      );
    };

    // Handle timeline scrubber
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const targetTime = parseFloat(e.target.value);
      setCurrentTime(targetTime);
      if (videoRef.current) {
        videoRef.current.currentTime = targetTime;
      }
    };

    // Volume controls
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      setVolume(val);
      if (videoRef.current) {
        videoRef.current.volume = val;
        videoRef.current.muted = val === 0;
        setIsMuted(val === 0);
      }
    };

    const toggleMute = () => {
      sounds.playPop();
      if (!videoRef.current) return;
      if (isMuted) {
        videoRef.current.muted = false;
        videoRef.current.volume = volume || 0.8;
        setIsMuted(false);
      } else {
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    };

    // Playback rate selector: 0.75x, 1x, 1.25x, 1.5x, 2x
    const handleRateChange = (rate: number) => {
      sounds.playPop();
      setPlaybackRate(rate);
      if (videoRef.current) {
        videoRef.current.playbackRate = rate;
      }
    };

    // Fullscreen toggle
    const toggleFullscreen = () => {
      sounds.playPop();
      if (!containerRef.current) return;

      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen?.().catch(() => {});
        setIsFullscreen(true);
      } else {
        document.exitFullscreen?.().catch(() => {});
        setIsFullscreen(false);
      }
    };

    // Resume watched position
    const applyResume = () => {
      sounds.playSuccess();
      if (videoRef.current) {
        videoRef.current.currentTime = resumeSeconds;
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
      setShowResumeBanner(false);
    };

    const cancelResume = () => {
      sounds.playPop();
      setShowResumeBanner(false);
    };

    // Auto hide controls after 3 seconds of inactivity
    const handleMouseMove = () => {
      setShowControls(true);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3500);
    };

    // Retry on error
    const handleRetry = () => {
      setHasError(false);
      setIsLoading(true);
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play().catch(() => {});
      }
    };

    return (
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-amber-200/90 select-none group"
      >
        {/* HTML5 Native Video Tag */}
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          playsInline
          preload="metadata"
          crossOrigin="anonymous"
          onTimeUpdate={() => {
            if (!videoRef.current) return;
            const cur = videoRef.current.currentTime;
            const dur = videoRef.current.duration || 0;
            setCurrentTime(cur);
            if (dur > 0) {
              const pct = Math.min(100, Math.round((cur / dur) * 100));
              onTimeUpdate?.(cur, dur, pct);
            }
          }}
          onLoadedMetadata={(e) => {
            const el = e.target as HTMLVideoElement;
            setDuration(el.duration || 0);
            setIsLoading(false);
            setHasError(false);
          }}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => {
            setIsLoading(false);
            setIsPlaying(true);
          }}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            onEnded?.();
          }}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
            setErrorMessage('⚠️ Video chưa thể phát. Vui lòng kiểm tra lại file hoặc mạng kết nối.');
          }}
          onClick={togglePlay}
          className="w-full h-full object-contain cursor-pointer"
        />

        {/* Loading Overlay */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex flex-col items-center justify-center pointer-events-none z-20 space-y-3">
            <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <div className="flex items-center gap-2 bg-amber-950/80 px-4 py-2 rounded-2xl border border-amber-500/40 text-amber-200 text-xs font-bold">
              <span>🌱 Mầm AI đang chuẩn bị bài học...</span>
            </div>
          </div>
        )}

        {/* Error State Overlay (XV-H, XV-U) */}
        {hasError && (
          <div className="absolute inset-0 bg-stone-950/90 flex flex-col items-center justify-center p-6 text-center z-30 space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-black text-white">
                {errorMessage || '⚠️ Video chưa thể phát. Vui lòng kiểm tra lại.'}
              </h4>
              <p className="text-xs text-stone-400 mt-1">
                Video có thể đang trong tiến trình mã hóa hoặc kết nối mạng không ổn định.
              </p>
            </div>
            <button
              onClick={handleRetry}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Thử lại</span>
            </button>
          </div>
        )}

        {/* Resume Banner Prompt (XV-K: "▶ Tiếp tục xem từ 08:42") */}
        {showResumeBanner && !isPlaying && (
          <div className="absolute top-4 left-4 right-4 z-30 animate-fadeIn">
            <div className="bg-amber-950/90 backdrop-blur-md border border-amber-500/50 text-white p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xl">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-orange-400 shrink-0" />
                <div>
                  <span className="text-xs sm:text-sm font-black text-amber-100 block">
                    Cô từng xem video này đến {formatTime(resumeSeconds)}
                  </span>
                  <span className="text-[11px] text-stone-300">
                    Hệ thống đã lưu lại tiến độ học tập của cô.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={cancelResume}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 text-xs font-bold cursor-pointer transition-all"
                >
                  Xem từ đầu
                </button>
                <button
                  onClick={applyResume}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-black shadow-md hover:scale-105 active:scale-95 cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>▶ Tiếp tục xem từ {formatTime(resumeSeconds)}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Center Big Play/Pause Button when paused */}
        {!isPlaying && !isLoading && !hasError && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-orange-600/90 hover:bg-orange-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
            title="Phát video"
          >
            <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
          </button>
        )}

        {/* Video Controls Bar (XV-E: Responsive, 16:9, Player Thật) */}
        <div
          className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-5 pt-8 transition-opacity duration-300 z-20 ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Interactive Timeline Scrub Bar */}
          <div className="relative flex items-center mb-3">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 sm:h-2 bg-stone-700/80 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:h-2.5 transition-all"
            />
          </div>

          {/* Bottom Controls Row */}
          <div className="flex items-center justify-between gap-2 flex-wrap text-white text-xs">
            {/* Left Controls: Play, Rewind, Forward, Time */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
                title={isPlaying ? 'Tạm dừng (Space)' : 'Phát (Space)'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              {/* Rewind 10s */}
              <button
                onClick={handleRewind}
                className="w-7 h-7 rounded-full hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Tua lùi 10 giây"
              >
                <Rewind className="w-4 h-4" />
              </button>

              {/* Forward 10s */}
              <button
                onClick={handleForward}
                className="w-7 h-7 rounded-full hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Tua tới 10 giây"
              >
                <FastForward className="w-4 h-4" />
              </button>

              {/* Current Time / Duration Display */}
              <div className="text-[11px] sm:text-xs font-mono font-bold text-stone-300 ml-1">
                <span className="text-white">{formatTime(currentTime)}</span>
                <span className="mx-1 text-stone-500">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right Controls: Volume, Speed, Fullscreen */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Volume Slider */}
              <div className="hidden sm:flex items-center gap-1.5 group/vol">
                <button
                  onClick={toggleMute}
                  className="w-7 h-7 rounded-full hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                  title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              {/* Playback Speed Selector (0.75x, 1x, 1.25x, 1.5x, 2x) */}
              <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/15 text-[10px] font-bold">
                {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handleRateChange(rate)}
                    className={`px-1.5 py-0.5 rounded-lg transition-all cursor-pointer ${
                      playbackRate === rate
                        ? 'bg-orange-500 text-white'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="w-7 h-7 rounded-full hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';
