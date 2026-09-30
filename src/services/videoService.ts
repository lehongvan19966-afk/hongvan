import { VideoItem, VideoComment, VideoProgress } from '../types';

const IDB_NAME = 'vuon_uom_video_vault_db';
const IDB_STORE = 'user_videos';
const IDB_VERSION = 1;

// Open or initialize IndexedDB for permanent local video vault (no 5MB limit, stores 50GB+)
function openVideoIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// Save video metadata and raw binary Blob to browser's permanent IndexedDB
export async function idbSaveUserVideo(video: VideoItem, blob?: Blob | File | null): Promise<void> {
  try {
    const db = await openVideoIDB();
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    store.put({
      id: video.id,
      video: {
        ...video,
        isStoredLocally: true,
      },
      blob: blob || null,
      updatedAt: Date.now(),
    });
    return new Promise((res, rej) => {
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
  } catch (e) {
    console.warn('idbSaveUserVideo error:', e);
  }
}

// Retrieve all user videos with active Blob URLs for permanent offline/reboot playback
export async function idbGetAllUserVideos(): Promise<VideoItem[]> {
  try {
    const db = await openVideoIDB();
    const tx = db.transaction(IDB_STORE, 'readonly');
    const store = tx.objectStore(IDB_STORE);
    const req = store.getAll();
    return new Promise((res) => {
      req.onsuccess = () => {
        const records: Array<{ id: string; video: VideoItem; blob?: Blob | null }> = req.result || [];
        const result: VideoItem[] = [];
        for (const r of records) {
          if (!r.video) continue;
          const v = { ...r.video };
          if (r.blob) {
            try {
              const blobUrl = URL.createObjectURL(r.blob);
              v.videoUrl = blobUrl;
              v.playbackUrl = blobUrl;
              v.isStoredLocally = true;
            } catch (err) {
              console.warn('Error creating object URL for video:', err);
            }
          }
          result.push(v);
        }
        res(result);
      };
      req.onerror = () => res([]);
    });
  } catch {
    return [];
  }
}

export async function idbDeleteUserVideo(id: string): Promise<void> {
  try {
    const db = await openVideoIDB();
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).delete(id);
    return new Promise((res) => {
      tx.oncomplete = () => res();
      tx.onerror = () => res();
    });
  } catch {}
}

export const videoService = {
  // Helper to persist user videos in IndexedDB, localStorage, and notify UI listeners
  cacheVideo(video: VideoItem, blob?: Blob | File | null): void {
    // 1. Permanent IndexedDB storage (carries binary video blob)
    idbSaveUserVideo(video, blob).catch((e) => console.warn('Cache video to IDB failed:', e));

    // 2. Light localStorage metadata cache
    try {
      const cached = localStorage.getItem('vuon_uom_cached_videos');
      const list: VideoItem[] = cached ? JSON.parse(cached) : [];
      const updated = [video, ...list.filter((v) => v.id !== video.id)];
      localStorage.setItem('vuon_uom_cached_videos', JSON.stringify(updated));
    } catch {}

    try {
      const userVideos = localStorage.getItem('vuon_uom_user_uploaded_videos');
      const list: VideoItem[] = userVideos ? JSON.parse(userVideos) : [];
      const updated = [video, ...list.filter((v) => v.id !== video.id)];
      localStorage.setItem('vuon_uom_user_uploaded_videos', JSON.stringify(updated));
    } catch {}

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('video_library_updated', { detail: video }));
    }
  },

  // 1. Fetch videos from persistent database + browser IndexedDB vault
  async fetchVideos(params?: {
    authorId?: string;
    privacy?: string;
    topic?: string;
    level?: string;
    q?: string;
    sort?: string;
  }): Promise<VideoItem[]> {
    let fetchedList: VideoItem[] = [];

    // 1. Fetch from server API
    try {
      const searchParams = new URLSearchParams();
      if (params?.authorId) searchParams.append('authorId', params.authorId);
      if (params?.privacy) searchParams.append('privacy', params.privacy);
      if (params?.topic && params.topic !== 'all') searchParams.append('topic', params.topic);
      if (params?.level && params.level !== 'all') searchParams.append('level', params.level);
      if (params?.q) searchParams.append('q', params.q);
      if (params?.sort) searchParams.append('sort', params.sort);

      const url = `/api/videos${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.videos && Array.isArray(data.videos)) {
          fetchedList = data.videos;
        }
      }
    } catch (err) {
      console.warn('Network fetch videos failed, falling back to permanent storage:', err);
    }

    // 2. Fetch from browser IndexedDB vault (survives app close & container reboots)
    let idbVideos: VideoItem[] = [];
    try {
      idbVideos = await idbGetAllUserVideos();
    } catch (e) {
      console.warn('Fetch from IndexedDB error:', e);
    }

    // 3. Merge with user uploaded videos from localStorage
    try {
      const userCached = localStorage.getItem('vuon_uom_user_uploaded_videos');
      const allCached = localStorage.getItem('vuon_uom_cached_videos');
      const userList: VideoItem[] = userCached ? JSON.parse(userCached) : [];
      const cacheList: VideoItem[] = allCached ? JSON.parse(allCached) : [];

      const map = new Map<string, VideoItem>();

      // A. Add server videos
      fetchedList.forEach((v) => map.set(v.id, v));

      // B. Add cached videos
      cacheList.forEach((v) => {
        if (!map.has(v.id)) map.set(v.id, v);
      });

      // C. Add user uploaded localStorage videos
      userList.forEach((v) => map.set(v.id, v));

      // D. Add IndexedDB videos (HIGHEST PRIORITY with working blob URLs)
      idbVideos.forEach((v) => {
        const existing = map.get(v.id);
        map.set(v.id, {
          ...(existing || {}),
          ...v,
          // Always prefer local blobUrl for instant offline playback
          videoUrl: v.videoUrl || existing?.videoUrl || '',
          playbackUrl: v.playbackUrl || existing?.playbackUrl || '',
          isStoredLocally: true,
        });
      });

      const merged = Array.from(map.values());

      try {
        localStorage.setItem('vuon_uom_cached_videos', JSON.stringify(merged));
      } catch {}

      // Auto re-sync missing user videos back to server in background so server data is restored
      if (idbVideos.length > 0 && fetchedList.length > 0) {
        for (const localVid of idbVideos) {
          const isMissingOnServer = !fetchedList.some((s) => s.id === localVid.id);
          if (isMissingOnServer) {
            fetch('/api/videos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...localVid,
                // Don't send blob URL to server, send placeholder or existing playbackUrl
                videoUrl: localVid.playbackUrl?.startsWith('blob:') ? '/uploads/sample_video.mp4' : localVid.videoUrl,
              }),
            }).catch(() => {});
          }
        }
      }

      return merged;
    } catch {}

    return fetchedList.length > 0 ? fetchedList : idbVideos;
  },

  // 2. Fetch single video by ID
  async fetchVideoById(id: string): Promise<VideoItem | null> {
    // Check IndexedDB first for instant local blob playback
    try {
      const idbList = await idbGetAllUserVideos();
      const foundInIdb = idbList.find((v) => v.id === id);
      if (foundInIdb) return foundInIdb;
    } catch {}

    try {
      const res = await fetch(`/api/videos/${id}`);
      if (res.ok) {
        const data = await res.json();
        return data.video || null;
      }
    } catch (err) {
      console.error('Error fetching video by id:', err);
    }
    // Fallback
    const list = await this.fetchVideos();
    return list.find((v) => v.id === id) || null;
  },

  // 3. Upload Video with Real Progress & Permanent IndexedDB storage
  async uploadVideo(payload: {
    title: string;
    description: string;
    topic: string;
    level: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
    targetAudience: string;
    tags: string[];
    privacy: 'public' | 'members' | 'course_only' | 'private';
    courseId?: string;
    lessonId?: string;
    videoFile?: File | null;
    videoData?: string;
    videoUrl?: string;
    thumbnailFile?: File | null;
    thumbnailData?: string;
    thumbnailUrl?: string;
    transcript?: string;
    authorId?: string;
    authorName?: string;
    authorSchool?: string;
    authorAvatar?: string;
    duration?: string;
    durationSeconds?: number;
    onProgress?: (pct: number) => void;
  }): Promise<VideoItem> {
    const rawFile = payload.videoFile;

    // If a real binary videoFile is provided, use FormData with real XHR progress
    if (rawFile) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/videos/upload');

        if (xhr.upload && payload.onProgress) {
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percent = Math.min(95, Math.round((event.loaded / event.total) * 100));
              payload.onProgress?.(percent);
            }
          };
        }

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              if (res.success && res.video) {
                payload.onProgress?.(100);

                // Create local object URL for instant, 100% reliable local playback
                const blobUrl = URL.createObjectURL(rawFile);
                const finalVideoItem: VideoItem = {
                  ...res.video,
                  videoUrl: blobUrl,
                  playbackUrl: blobUrl,
                  isStoredLocally: true,
                };

                // Cache both metadata and binary file blob in IndexedDB permanently
                this.cacheVideo(finalVideoItem, rawFile);
                resolve(finalVideoItem);
              } else {
                reject(new Error(res.message || 'Lỗi xử lý video từ máy chủ'));
              }
            } catch (err) {
              reject(new Error('Phản hồi từ máy chủ không hợp lệ'));
            }
          } else {
            let msg = 'Lỗi tải video lên máy chủ';
            try {
              const res = JSON.parse(xhr.responseText);
              if (res.message) msg = res.message;
            } catch {
              // ignore
            }
            reject(new Error(msg));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.'));
        };

        const formData = new FormData();
        formData.append('title', payload.title);
        formData.append('description', payload.description);
        formData.append('topic', payload.topic);
        formData.append('level', payload.level);
        formData.append('targetAudience', payload.targetAudience);
        formData.append('tags', JSON.stringify(payload.tags));
        formData.append('privacy', payload.privacy);
        if (payload.courseId) formData.append('courseId', payload.courseId);
        if (payload.lessonId) formData.append('lessonId', payload.lessonId);
        if (payload.transcript) formData.append('transcript', payload.transcript);
        if (payload.authorId) formData.append('authorId', payload.authorId);
        if (payload.authorName) formData.append('authorName', payload.authorName);
        if (payload.authorSchool) formData.append('authorSchool', payload.authorSchool);
        if (payload.authorAvatar) formData.append('authorAvatar', payload.authorAvatar);
        if (payload.duration) formData.append('duration', payload.duration);
        if (payload.durationSeconds) formData.append('durationSeconds', String(payload.durationSeconds));
        if (payload.thumbnailUrl) formData.append('thumbnailUrl', payload.thumbnailUrl);

        formData.append('video', rawFile);
        if (payload.thumbnailFile) {
          formData.append('thumbnail', payload.thumbnailFile);
        }

        xhr.send(formData);
      });
    }

    // JSON Fallback (for online video links, YouTube, Google Drive URLs)
    if (payload.onProgress) {
      payload.onProgress(20);
      setTimeout(() => payload.onProgress?.(55), 200);
      setTimeout(() => payload.onProgress?.(85), 450);
    }

    const res = await fetch('/api/videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Lỗi tải video lên máy chủ');
    }

    if (payload.onProgress) {
      payload.onProgress(100);
    }

    const data = await res.json();
    if (data.video) {
      this.cacheVideo(data.video);
    }
    return data.video;
  },

  // 3b. Verify video availability (XV-H)
  async verifyVideo(id: string): Promise<{ verified: boolean; status: string; video?: VideoItem }> {
    try {
      const res = await fetch(`/api/videos/${id}/verify`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('Verify error:', err);
    }
    return { verified: false, status: 'error' };
  },

  // 4. Update Video
  async updateVideo(id: string, payload: Partial<VideoItem>): Promise<VideoItem> {
    const res = await fetch(`/api/videos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Lỗi cập nhật video');
    const data = await res.json();
    if (data.video) {
      this.cacheVideo(data.video);
    }
    return data.video;
  },

  // 5. Delete Video
  async deleteVideo(id: string): Promise<boolean> {
    // 1. Delete from IndexedDB
    idbDeleteUserVideo(id).catch(() => {});

    // 2. Delete from localStorage
    try {
      const cached = localStorage.getItem('vuon_uom_cached_videos');
      if (cached) {
        const list: VideoItem[] = JSON.parse(cached);
        localStorage.setItem('vuon_uom_cached_videos', JSON.stringify(list.filter((v) => v.id !== id)));
      }
      const userCached = localStorage.getItem('vuon_uom_user_uploaded_videos');
      if (userCached) {
        const list: VideoItem[] = JSON.parse(userCached);
        localStorage.setItem('vuon_uom_user_uploaded_videos', JSON.stringify(list.filter((v) => v.id !== id)));
      }
    } catch {}

    // 3. Delete on server
    try {
      const res = await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return true;
    }
  },

  // 6. Like / Bookmark Video
  async toggleLikeVideo(id: string): Promise<{ likes: number; isLiked: boolean }> {
    try {
      const res = await fetch(`/api/videos/${id}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        return { likes: data.likes, isLiked: data.isLiked };
      }
    } catch (e) {
      console.error('Like video error:', e);
    }
    return { likes: 0, isLiked: false };
  },

  // 7. Save / Bookmark Video
  async toggleSaveVideo(id: string): Promise<{ savesCount: number; isSaved: boolean }> {
    try {
      const res = await fetch(`/api/videos/${id}/save`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        return { savesCount: data.savesCount, isSaved: data.isSaved };
      }
    } catch (e) {
      console.error('Save video error:', e);
    }
    return { savesCount: 0, isSaved: false };
  },

  // 8. Update User Watch Progress
  async updateProgress(id: string, progress: { currentTime: number; percentage: number; completed: boolean }): Promise<void> {
    try {
      await fetch(`/api/videos/${id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progress),
      });
    } catch {}
  },

  // 9. Post Comment
  async postComment(id: string, comment: { authorName: string; authorSchool: string; avatar: string; content: string }): Promise<VideoComment> {
    const res = await fetch(`/api/videos/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment),
    });
    if (!res.ok) throw new Error('Lỗi gửi bình luận');
    const data = await res.json();
    return data.comment;
  },

  // Alias for addComment
  async addComment(videoId: string, comment: { authorName: string; authorSchool: string; avatar: string; content: string }): Promise<VideoComment> {
    return this.postComment(videoId, comment);
  },

  // Alias for saveProgress
  async saveProgress(videoId: string, currentTime: number, percentage: number, completed: boolean): Promise<void> {
    return this.updateProgress(videoId, { currentTime, percentage, completed });
  },

  // 10. AI Mentor Question (RAG based on video transcript)
  async askMentor(id: string, question: string): Promise<{ answer: string; relevantTimestamp?: string; confidence?: number }> {
    const res = await fetch(`/api/videos/${id}/ai-mentor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    if (!res.ok) throw new Error('AI Mentor chưa thể trả lời lúc này');
    const data = await res.json();
    return data;
  },

  // Alias for askVideoMentor
  async askVideoMentor(videoId: string, question: string, _currentSecond?: number): Promise<{ answer: string; timestampRef?: string }> {
    const res = await this.askMentor(videoId, question);
    return {
      answer: res.answer,
      timestampRef: res.relevantTimestamp,
    };
  },

  // 11. Export Videos Backup (JSON string)
  async exportBackup(): Promise<string> {
    const list = await this.fetchVideos();
    return JSON.stringify(list, null, 2);
  },

  // 12. Import Videos Backup
  async importBackup(jsonString: string): Promise<number> {
    try {
      const imported: VideoItem[] = JSON.parse(jsonString);
      if (!Array.isArray(imported)) throw new Error('File sao lưu không hợp lệ');

      for (const v of imported) {
        this.cacheVideo(v);
        // Sync to server
        fetch('/api/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(v),
        }).catch(() => {});
      }
      return imported.length;
    } catch (e: any) {
      throw new Error(e.message || 'Lỗi đọc file sao lưu');
    }
  },
};
