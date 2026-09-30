export interface StoredDocument {
  id: string;
  title: string;
  type: 'pdf' | 'docx' | 'pptx' | 'image' | 'video' | 'text' | 'audio';
  category: string;
  sourceFunction: 'academy' | 'media_vault' | 'lesson_studio' | 'teaching_pack' | 'general';
  fileUrl: string;
  fileName: string;
  fileSize?: string;
  fileData?: string; // Data URL / base64 for persistent offline access & viewing
  content?: string;  // text content for poems, stories, notes
  author: string;
  uploadedAt: string;
  description?: string;
  tags?: string[];
}

const STORAGE_KEY = 'vuon_uom_persistent_documents_v1';
const IDB_DB_NAME = 'vuon_uom_docs_db';
const IDB_STORE_NAME = 'documents';
const IDB_VERSION = 1;

// Initial preloaded curriculum documents for teachers
export const INITIAL_DOCUMENTS: StoredDocument[] = [
  {
    id: 'doc_init_1',
    title: 'Giáo án mẫu 5 bước chuẩn Bộ GD&ĐT tích hợp AI',
    type: 'docx',
    category: 'Giáo án mầm non',
    sourceFunction: 'academy',
    fileUrl: '/uploads/documents/sample_giao_an_5_buoc.docx',
    fileName: 'Giao_an_5_buoc_chuan_Bo_GD.docx',
    fileSize: '1.8 MB',
    author: 'Vườn Ươm AI Mầm Non',
    uploadedAt: '2026-09-28',
    description: 'Kế hoạch bài dạy chi tiết 5 bước: Ổn định, Khám phá, Trải nghiệm, Luyện tập, Đánh giá mở rộng.',
    content: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nKẾ HOẠCH BÀI DẠY (GIÁO ÁN)\nChủ đề: Khám phá thế giới thực vật quanh bé\nĐộ tuổi: 4–5 tuổi (Lớp Chồi)\nThời gian: 25–30 phút\n\nI. MỤC ĐÍCH - YÊU CẦU:\n1. Kiến thức: Trẻ nhận biết tên gọi, màu sắc, đặc điểm của các loài hoa quả quen thuộc.\n2. Kỹ năng: Rèn kỹ năng quan sát, so sánh, diễn đạt ngôn ngữ mạch lạc.\n3. Thái độ: Giáo dục trẻ yêu quý thiên nhiên, chăm sóc cây xanh.\n\nII. TIẾN HÀNH HOẠT ĐỘNG (5 BƯỚC):\n- Bước 1: Ổn định & Tạo hứng thú bằng bài hát vui nhộn.\n- Bước 2: Khám phá vật thật và hình ảnh 3D AI sinh động.\n- Bước 3: Trải nghiệm tương tác cùng bạn bè.\n- Bước 4: Luyện tập qua trò chơi củng cố.\n- Bước 5: Nhận xét, tuyên dương và dặn dò.`,
    tags: ['Giáo án', 'Chuẩn Bộ', 'Tài liệu lưu trữ'],
  },
  {
    id: 'doc_init_2',
    title: 'Bộ Prompt thần thánh tạo tranh truyện & thơ mầm non',
    type: 'pdf',
    category: 'Tài liệu hướng dẫn AI',
    sourceFunction: 'academy',
    fileUrl: '/uploads/documents/bo_prompt_ai_mam_non.pdf',
    fileName: 'Bo_Prompt_AI_Mam_Non_2026.pdf',
    fileSize: '3.2 MB',
    author: 'Ban Chuyên Môn EdTech',
    uploadedAt: '2026-09-28',
    description: 'Hơn 50 câu lệnh prompt mẫu tạo ảnh hoạt hình Pixar 3D, thơ 4 chữ, bài hát ru mầm non.',
    content: `BỘ PROMPT MẪU 1-CHẠM DÀNH CHO GIÁO VIÊN MẦM NON:\n\n1. Tạo tranh minh họa truyện 3D Pixar:\n"Prompt: An adorable chubby Vietnamese toddler boy in yellow dungarees exploring a sunny garden with friendly butterfly, 3D Pixar style, cinematic soft light, vibrant warm colors, ultra cute, 8k resolution."\n\n2. Sáng tác thơ mầm non theo chủ đề:\n"Prompt: Hãy viết một bài thơ 4 chữ vui tươi, vần điệu dễ nhớ cho bé 3-4 tuổi về chủ đề 'Rửa tay sạch khuẩn trước khi ăn cơm'."\n\n3. Tạo kịch bản rối bóng:\n"Prompt: Soạn kịch bản kịch rối bóng 5 phút về tình bạn giữa Chú Thỏ Trắng và Bác Gấu Nâu."`,
    tags: ['Prompt', 'Canva AI', 'ChatGPT'],
  },
  {
    id: 'doc_init_3',
    title: 'Tuyển tập 30 bài thơ mầm non phát triển ngôn ngữ',
    type: 'text',
    category: 'Văn học mầm non',
    sourceFunction: 'media_vault',
    fileUrl: '',
    fileName: 'Tuyen_tap_30_bai_tho_mam_non.txt',
    fileSize: '450 KB',
    author: 'Cô Lê Hồng Vân',
    uploadedAt: '2026-09-29',
    description: 'Các bài thơ ngắn 4 chữ, 5 chữ giàu vần điệu giúp trẻ phát triển khả năng diễn đạt.',
    content: `BÀI THƠ: MẦM CÂY BÉ BỎNG\n\nNhú lên từ đất\nMầm nhỏ màu xanh\nĐón hạt sương mai\nLá non rung rinh.\n\nCây cần ánh nắng\nCần giọt mưa rơi\nBé chăm tưới nước\nCây lớn tươi cười! 🌸`,
    tags: ['Thơ mầm non', 'Phát triển ngôn ngữ'],
  },
];

// Helper: Open IndexedDB for unlimited, permanent client-side document storage
function openDocsIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(IDB_DB_NAME, IDB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
        db.createObjectStore(IDB_STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbSaveDoc(doc: StoredDocument): Promise<void> {
  try {
    const db = await openDocsIDB();
    const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
    tx.objectStore(IDB_STORE_NAME).put(doc);
    return new Promise((res, rej) => {
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB save failed:', err);
  }
}

async function idbGetDoc(id: string): Promise<StoredDocument | null> {
  try {
    const db = await openDocsIDB();
    const tx = db.transaction(IDB_STORE_NAME, 'readonly');
    const req = tx.objectStore(IDB_STORE_NAME).get(id);
    return new Promise((res) => {
      req.onsuccess = () => res(req.result || null);
      req.onerror = () => res(null);
    });
  } catch {
    return null;
  }
}

async function idbGetAllDocs(): Promise<StoredDocument[]> {
  try {
    const db = await openDocsIDB();
    const tx = db.transaction(IDB_STORE_NAME, 'readonly');
    const req = tx.objectStore(IDB_STORE_NAME).getAll();
    return new Promise((res) => {
      req.onsuccess = () => res(req.result || []);
      req.onerror = () => res([]);
    });
  } catch {
    return [];
  }
}

async function idbDeleteDoc(id: string): Promise<void> {
  try {
    const db = await openDocsIDB();
    const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
    tx.objectStore(IDB_STORE_NAME).delete(id);
    return new Promise((res) => {
      tx.oncomplete = () => res();
      tx.onerror = () => res();
    });
  } catch {}
}

// In-memory cache for instant synchronous access
let docsMemoryCache: StoredDocument[] | null = null;

export const persistentDocStorage = {
  // Khởi tạo và đồng bộ với Server & IndexedDB
  async initStorage(): Promise<StoredDocument[]> {
    try {
      // 1. Load from IndexedDB
      const idbDocs = await idbGetAllDocs();
      if (idbDocs.length > 0) {
        docsMemoryCache = idbDocs;
      }
    } catch {}

    // 2. Fetch latest from Server
    try {
      const res = await fetch('/api/documents');
      if (res.ok) {
        const data = await res.json();
        if (data.documents && Array.isArray(data.documents) && data.documents.length > 0) {
          // Merge with IDB docs
          const mergedMap = new Map<string, StoredDocument>();
          (docsMemoryCache || []).forEach((d) => mergedMap.set(d.id, d));
          data.documents.forEach((d: StoredDocument) => {
            const existing = mergedMap.get(d.id);
            mergedMap.set(d.id, {
              ...d,
              fileData: existing?.fileData || d.fileData,
            });
          });
          const mergedList = Array.from(mergedMap.values());
          docsMemoryCache = mergedList;

          // Save back to IDB
          for (const d of mergedList) {
            idbSaveDoc(d).catch(() => {});
          }

          // Update light list in localStorage for instant sync reads
          try {
            const lightList = mergedList.map((d) => ({ ...d, fileData: undefined }));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(lightList));
          } catch {}

          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('persistent_document_saved'));
          }
          return mergedList;
        }
      }
    } catch (e) {
      console.warn('Network sync documents skipped:', e);
    }

    return this.getAllDocuments();
  },

  // Lấy toàn bộ tài liệu lưu trữ (đồng bộ ngay lập tức)
  getAllDocuments(): StoredDocument[] {
    if (docsMemoryCache && docsMemoryCache.length > 0) {
      return docsMemoryCache;
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed: StoredDocument[] = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          docsMemoryCache = parsed;
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading persistent documents:', e);
    }

    // Seed initial docs
    docsMemoryCache = INITIAL_DOCUMENTS;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DOCUMENTS));
    } catch {}

    // Async hydration in background
    setTimeout(() => {
      this.initStorage().catch(() => {});
    }, 100);

    return INITIAL_DOCUMENTS;
  },

  // Lấy chi tiết tài liệu (bao gồm cả fileData lớn từ IndexedDB nếu cần)
  async getDocumentById(id: string): Promise<StoredDocument | null> {
    const all = this.getAllDocuments();
    const found = all.find((d) => d.id === id);
    if (found?.fileData) return found;

    // Check IndexedDB for full fileData
    const fromIdb = await idbGetDoc(id);
    if (fromIdb) {
      if (found) {
        found.fileData = fromIdb.fileData;
      }
      return fromIdb;
    }

    return found || null;
  },

  // Lấy tài liệu theo chức năng
  getDocumentsByFunction(func: StoredDocument['sourceFunction']): StoredDocument[] {
    const all = this.getAllDocuments();
    return all.filter((d) => d.sourceFunction === func || d.sourceFunction === 'general');
  },

  // Lưu tài liệu mới bền vững (Hỗ trợ cả Server Disk + IndexedDB + LocalStorage)
  saveDocument(doc: Omit<StoredDocument, 'id' | 'uploadedAt'> & { id?: string }): StoredDocument {
    const all = this.getAllDocuments();
    const uniqueId = doc.id || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newDoc: StoredDocument = {
      ...doc,
      id: uniqueId,
      uploadedAt: new Date().toLocaleDateString('vi-VN'),
    };

    const updated = [newDoc, ...all.filter((d) => d.id !== newDoc.id)];
    docsMemoryCache = updated;

    // 1. Save full doc to IndexedDB (no 5MB limit, can store heavy blobs/base64)
    idbSaveDoc(newDoc).catch((e) => console.warn('IDB save error:', e));

    // 2. Save light version to LocalStorage for quick synchronous rendering
    try {
      const lightList = updated.map((d) => ({ ...d, fileData: undefined }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lightList));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    // 3. Post to Server backend for permanent disk storage
    fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDoc),
    }).catch(() => {});

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('persistent_document_saved', { detail: newDoc }));
    }
    return newDoc;
  },

  // Tải file tài liệu lên máy chủ bền vững (Hỗ trợ PDF, Word, PPTX, Video, Ảnh, Audio)
  async uploadDocumentFile(
    file: File,
    meta: {
      title?: string;
      category?: string;
      sourceFunction?: StoredDocument['sourceFunction'];
      author?: string;
      description?: string;
      content?: string;
      tags?: string[];
      type?: StoredDocument['type'];
    }
  ): Promise<StoredDocument> {
    const formData = new FormData();
    formData.append('file', file);
    if (meta.title) formData.append('title', meta.title);
    if (meta.category) formData.append('category', meta.category);
    if (meta.sourceFunction) formData.append('sourceFunction', meta.sourceFunction);
    if (meta.author) formData.append('author', meta.author);
    if (meta.description) formData.append('description', meta.description);
    if (meta.content) formData.append('content', meta.content);
    if (meta.tags) formData.append('tags', JSON.stringify(meta.tags));
    if (meta.type) formData.append('type', meta.type);

    let savedDoc: StoredDocument | null = null;

    try {
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
    } catch (err) {
      console.warn('Server upload failed, falling back to local persistent storage:', err);
    }

    // If server upload succeeded or failed, ensure we also read file as DataURL for offline preview
    const fileDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });

    if (!savedDoc) {
      // Fallback: create local doc with fileData
      const ext = file.name.split('.').pop()?.toLowerCase();
      let docType: StoredDocument['type'] = meta.type || 'pdf';
      if (!meta.type && ext) {
        if (ext === 'pdf') docType = 'pdf';
        else if (['doc', 'docx'].includes(ext)) docType = 'docx';
        else if (['ppt', 'pptx'].includes(ext)) docType = 'pptx';
        else if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) docType = 'image';
        else if (['mp4', 'mov', 'webm'].includes(ext)) docType = 'video';
        else if (['mp3', 'wav', 'm4a'].includes(ext)) docType = 'audio';
        else docType = 'text';
      }

      savedDoc = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: meta.title || file.name.replace(/\.[^/.]+$/, ''),
        type: docType,
        category: meta.category || 'Tài liệu hướng dẫn AI',
        sourceFunction: meta.sourceFunction || 'academy',
        fileUrl: '',
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        fileData: fileDataUrl,
        content: meta.content || meta.description || '',
        author: meta.author || 'Cô Lê Hồng Vân',
        uploadedAt: new Date().toLocaleDateString('vi-VN'),
        description: meta.description || '',
        tags: meta.tags || ['Tài liệu'],
      };
    } else {
      // Attach fileData for immediate offline rendering
      savedDoc.fileData = fileDataUrl;
    }

    // Persist to IndexedDB & memory
    await idbSaveDoc(savedDoc);
    const all = this.getAllDocuments();
    docsMemoryCache = [savedDoc, ...all.filter((d) => d.id !== savedDoc!.id)];

    try {
      const lightList = docsMemoryCache.map((d) => ({ ...d, fileData: undefined }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lightList));
    } catch {}

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('persistent_document_saved', { detail: savedDoc }));
    }

    return savedDoc;
  },

  // Xóa tài liệu
  deleteDocument(id: string): boolean {
    const all = this.getAllDocuments();
    const updated = all.filter((d) => d.id !== id);
    docsMemoryCache = updated;

    idbDeleteDoc(id).catch(() => {});

    try {
      const lightList = updated.map((d) => ({ ...d, fileData: undefined }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lightList));
    } catch {}

    // Delete on server
    fetch(`/api/documents/${id}`, { method: 'DELETE' }).catch(() => {});

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('persistent_document_saved'));
    }
    return true;
  },
};

// Auto-initialize background sync on module load
if (typeof window !== 'undefined') {
  persistentDocStorage.initStorage().catch(() => {});
}
