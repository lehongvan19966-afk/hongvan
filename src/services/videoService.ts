import { VideoItem, VideoComment, VideoProgress } from '../types';

export const videoService = {
  // 1. Fetch videos from persistent database
  async fetchVideos(params?: {
    authorId?: string;
    privacy?: string;
    topic?: string;
    level?: string;
    q?: string;
    sort?: string;
  }): Promise<VideoItem[]> {
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
        if (data.videos) {
          // Cache in local storage for instant offline viewing
          try {
            localStorage.setItem('vuon_uom_cached_videos', JSON.stringify(data.videos));
          } catch {
            // ignore
          }
          return data.videos;
        }
      }
    } catch (err) {
      console.warn('Network fetch videos failed, falling back to cache:', err);
    }

    // Fallback from cache or default
    try {
      const cached = localStorage.getItem('vuon_uom_cached_videos');
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return [];
  },

  // 2. Fetch single video by ID
  async fetchVideoById(id: string): Promise<VideoItem | null> {
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

  // 3. Upload Video with Real Progress (XV-A, XV-C, XV-D)
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
    // If a real binary videoFile is provided, use FormData with real XHR progress
    if (payload.videoFile) {
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
                resolve(res.video);
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
          reject(new Error('Không thể kết nối đến máy chủ. Vui lòng thử lại.'));
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

        if (payload.videoFile) {
          formData.append('video', payload.videoFile);
        }
        if (payload.thumbnailFile) {
          formData.append('thumbnail', payload.thumbnailFile);
        }

        xhr.send(formData);
      });
    }

    // JSON Fallback
    if (payload.onProgress) {
      payload.onProgress(20);
      setTimeout(() => payload.onProgress?.(55), 300);
      setTimeout(() => payload.onProgress?.(85), 600);
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
    if (!res.ok) {
      throw new Error('Lỗi cập nhật video');
    }
    const data = await res.json();
    return data.video;
  },

  // 5. Delete Video
  async deleteVideo(id: string): Promise<boolean> {
    const res = await fetch(`/api/videos/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  },

  // 6. Save User Video Watching Progress (XVI-H)
  async saveProgress(
    id: string,
    currentTime: number,
    percentage: number,
    completed: boolean = false
  ): Promise<VideoProgress | null> {
    try {
      // Also cache in local storage for instant offline resumption
      try {
        localStorage.setItem(`vuon_uom_progress_${id}`, JSON.stringify({ currentTime, percentage, completed }));
      } catch {
        // ignore
      }

      const res = await fetch(`/api/videos/${id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentTime, percentage, completed }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.userProgress;
      }
    } catch (err) {
      console.warn('Could not persist progress to server, cached locally:', err);
    }
    return {
      currentTime,
      percentage,
      completed,
      lastWatchedDate: new Date().toISOString(),
    };
  },

  // 7. Ask AI Video Mentor (RAG based on transcript)
  async askVideoMentor(
    id: string,
    question: string,
    currentTime?: number
  ): Promise<{ answer: string; timestampRef?: string }> {
    const res = await fetch(`/api/videos/${id}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, currentTime }),
    });
    if (!res.ok) {
      throw new Error('Không thể kết nối trợ lý AI video');
    }
    const data = await res.json();
    return { answer: data.answer, timestampRef: data.timestampRef };
  },

  // 8. Add Video Comment
  async addComment(
    id: string,
    comment: { authorName: string; authorSchool: string; avatar: string; content: string }
  ): Promise<VideoComment> {
    const res = await fetch(`/api/videos/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment),
    });
    if (!res.ok) {
      throw new Error('Lỗi gửi bình luận');
    }
    const data = await res.json();
    return data.comment;
  },
};
