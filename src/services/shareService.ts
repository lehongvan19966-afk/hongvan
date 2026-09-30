// Service for cross-platform sharing & exporting (Mobile & Desktop)

export interface ShareItemData {
  id?: string;
  type: 'lesson_plan' | 'teaching_pack' | 'video' | 'app';
  title: string;
  subtitle?: string;
  author?: string;
  school?: string;
  data: any;
  createdAt?: string;
  url?: string;
}

// 1. Save shared item to server or localStorage fallback
export async function createShare(item: ShareItemData): Promise<{
  success: boolean;
  shareId: string;
  shareUrl: string;
}> {
  const shareId = item.id || `sh_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${currentOrigin}/?share=${shareId}`;

  try {
    const res = await fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...item,
        id: shareId,
        createdAt: new Date().toISOString(),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        shareId: data.shareId || shareId,
        shareUrl: data.shareUrl || shareUrl,
      };
    }
  } catch (e) {
    console.warn('Backend share failed, falling back to local storage cache:', e);
  }

  // Fallback to local storage
  if (typeof window !== 'undefined') {
    try {
      const existing = JSON.parse(localStorage.getItem('vuon_uom_shares') || '{}');
      existing[shareId] = {
        ...item,
        id: shareId,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('vuon_uom_shares', JSON.stringify(existing));
    } catch {
      // ignore
    }
  }

  return {
    success: true,
    shareId,
    shareUrl,
  };
}

// 2. Fetch shared item by ID
export async function getShare(shareId: string): Promise<{
  success: boolean;
  item?: ShareItemData;
  message?: string;
}> {
  try {
    const res = await fetch(`/api/share/${encodeURIComponent(shareId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.item) {
        return { success: true, item: data.item };
      }
    }
  } catch (e) {
    console.warn('Failed to fetch share from server:', e);
  }

  // Fallback to local storage
  if (typeof window !== 'undefined') {
    try {
      const existing = JSON.parse(localStorage.getItem('vuon_uom_shares') || '{}');
      if (existing[shareId]) {
        return { success: true, item: existing[shareId] };
      }
    } catch {
      // ignore
    }
  }

  return { success: false, message: 'Không tìm thấy nội dung chia sẻ hoặc liên kết đã hết hạn' };
}

// 3. Native mobile share with fallback to clipboard
export async function triggerMobileShare(options: {
  title: string;
  text: string;
  url: string;
}): Promise<{ shared: boolean; copied: boolean }> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: options.title,
        text: options.text,
        url: options.url,
      });
      return { shared: true, copied: false };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { shared: false, copied: false };
      }
    }
  }

  // Fallback: Copy link to clipboard
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(options.url);
      return { shared: false, copied: true };
    }
  } catch (e) {
    console.error('Clipboard copy failed:', e);
  }

  return { shared: false, copied: false };
}

// 4. Generate clean text formatted for Zalo / Chat / SMS
export function generateShareText(item: ShareItemData, shareUrl: string): string {
  const author = item.author ? `👩‍🏫 ${item.author}` : '';
  const school = item.school ? `🏛️ ${item.school}` : '';

  if (item.type === 'lesson_plan') {
    const plan = item.data;
    const isCorner = plan?.lessonType === 'HOAT_DONG_GOC' || plan?.title?.includes('GÓC');
    return `🌸 [GIÁO ÁN MẦM NON CHUẨN]
📖 ${plan?.title || item.title}
${author} ${school}
👶 Độ tuổi: ${plan?.ageGroup || 'Mầm non'}
⏱️ Thời gian: ${plan?.duration || '30 - 35 phút'}
🌟 Thể loại: ${isCorner ? 'Hoạt động góc (5 góc lấy trẻ làm trung tâm)' : 'Giáo án chuyên môn'}

🎯 MỤC TIÊU BÀI DẠY:
${plan?.objectives?.knowledge?.slice(0, 2).map((k: string) => `• ${k}`).join('\n') || ''}

📱 Xem trực tiếp & tương tác mượt mà trên cả Điện thoại & Máy tính:
👉 ${shareUrl}

(Tạo bởi Vườn Ươm AI - Hệ sinh thái AI mầm non)`;
  }

  if (item.type === 'teaching_pack') {
    const pack = item.data;
    return `🎁 [BỘ HỌC LIỆU HOẠT ĐỘNG TEACHING PACK]
✨ ${pack?.packTitle || item.title}
👶 Độ tuổi: ${pack?.ageGroup || 'Mầm non'}
⏱️ Thời gian: ${pack?.duration || '30 - 35 phút'}

Bộ học liệu gồm:
📖 1. Thơ / Truyện: "${pack?.storyOrPoem?.title || 'Thơ mầm non'}"
🖼️ 2. Flashcards 3D trực quan
🎲 3. Trò chơi tương tác nhóm
👨‍👩‍👧 4. Hoạt động 10 phút bố mẹ chơi cùng con tại nhà

📱 Mở ngay trên Điện thoại hoặc Máy tính để trình chiếu tại lớp:
👉 ${shareUrl}

(Vườn Ươm AI - Đồng hành cùng giáo viên mầm non Việt Nam)`;
  }

  if (item.type === 'video') {
    const video = item.data;
    return `🎥 [VIDEO HƯỚNG DẪN HỌC AI TỪ CƠ BẢN ĐẾN NÂNG CAO]
▶️ ${video?.title || item.title}
⏱️ Thời lượng: ${video?.duration || '12:45'}
🌱 Cấp độ: ${video?.level || 'Cơ bản'}
📚 Chủ đề: ${video?.topic || 'Ứng dụng AI'}

Xem trực tiếp video, tài liệu đính kèm, tóm tắt và hỏi đáp AI ngay trong app:
👉 ${shareUrl}`;
  }

  return `🌸 [VƯỜN ƯƠM AI]
${item.title}
Hệ sinh thái AI giáo dục mầm non: Cô học AI - Bé học vui - Soạn giáo án chuẩn - Video thực hành.
📱 Mở trên Điện thoại & Máy tính: ${shareUrl}`;
}

// 5. Generate Standalone HTML File (Works offline on 100% of Phones and Computers)
export function generateStandaloneHtml(item: ShareItemData, shareUrl: string): string {
  const isLesson = item.type === 'lesson_plan';
  const isPack = item.type === 'teaching_pack';
  const plan = isLesson ? item.data : null;
  const pack = isPack ? item.data : null;
  const isCorner = plan?.lessonType === 'HOAT_DONG_GOC' || plan?.title?.includes('GÓC');

  let bodyContent = '';

  if (isLesson && plan) {
    bodyContent = `
      <div class="official-header">
        <div class="school-tag">🏛️ ${plan.schoolName || 'TRƯỜNG MẦM NON'} • 👩‍🏫 ${plan.teacherName || 'GIÁO VIÊN'}</div>
        <h1 class="main-title">${plan.title}</h1>
        <div class="meta-pills">
          <span class="pill pill-theme">Chủ đề: ${plan.theme || 'Thế giới quanh bé'}</span>
          <span class="pill pill-topic">Đề tài: ${plan.topic || plan.title}</span>
          <span class="pill pill-age">👶 ${plan.ageGroup}</span>
          <span class="pill pill-time">⏱️ ${plan.duration}</span>
        </div>
      </div>

      ${isCorner && plan.cornerProposals && plan.cornerProposals.length > 0 ? `
        <div class="card">
          <h2 class="section-title">🌟 I. DỰ KIẾN CÁC GÓC CHƠI (LẤY TRẺ LÀM TRUNG TÂM)</h2>
          <div class="corner-grid">
            ${plan.cornerProposals.map((c: any) => `
              <div class="corner-card">
                <div class="corner-name">🎯 ${c.cornerName}</div>
                <div class="corner-content"><strong>Nội dung:</strong> ${c.activityContent}</div>
                ${c.materials ? `<div class="corner-mat"><strong>Chuẩn bị:</strong> ${c.materials}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="card">
        <h2 class="section-title">🎯 ${isCorner ? 'II' : 'I'}. MỤC TIÊU BÀI DẠY</h2>
        <div class="obj-box">
          <div class="obj-group">
            <h3>1. Kiến thức</h3>
            <ul>
              ${plan.objectives?.knowledge?.map((k: string) => `<li>${k}</li>`).join('') || ''}
            </ul>
          </div>
          <div class="obj-group">
            <h3>2. Kỹ năng</h3>
            <ul>
              ${plan.objectives?.skills?.map((s: string) => `<li>${s}</li>`).join('') || ''}
            </ul>
          </div>
          <div class="obj-group">
            <h3>3. Thái độ</h3>
            <ul>
              ${plan.objectives?.attitude?.map((a: string) => `<li>${a}</li>`).join('') || ''}
            </ul>
          </div>
        </div>
      </div>

      <div class="card">
        <h2 class="section-title">🎒 ${isCorner ? 'III' : 'II'}. CHUẨN BỊ ĐỒ DÙNG & HỌC LIỆU</h2>
        ${plan.preparation?.general && plan.preparation.general.length > 0 ? `
          <div class="prep-sub">
            <strong>Chuẩn bị chung:</strong>
            <ul>${plan.preparation.general.map((g: string) => `<li>${g}</li>`).join('')}</ul>
          </div>
        ` : ''}
        ${plan.preparation?.byCorner && plan.preparation.byCorner.length > 0 ? `
          <div class="prep-sub">
            <strong>Chuẩn bị theo từng góc:</strong>
            <ul>
              ${plan.preparation.byCorner.map((bc: any) => `<li><strong>${bc.corner}:</strong> ${bc.items?.join(', ')}</li>`).join('')}
            </ul>
          </div>
        ` : `
          <div class="prep-columns">
            <div class="prep-col">
              <strong>Của cô:</strong>
              <ul>${plan.preparation?.teacher?.map((t: string) => `<li>${t}</li>`).join('') || ''}</ul>
            </div>
            <div class="prep-col">
              <strong>Của trẻ:</strong>
              <ul>${plan.preparation?.children?.map((c: string) => `<li>${c}</li>`).join('') || ''}</ul>
            </div>
          </div>
        `}
      </div>

      <div class="card">
        <h2 class="section-title">📋 ${isCorner ? 'IV' : 'III'}. TIẾN TRÌNH HOẠT ĐỘNG (5 BƯỚC)</h2>
        <div class="steps-flow">
          ${plan.procedure?.map((step: any, idx: number) => `
            <div class="step-card">
              <div class="step-head">
                <span class="step-badge">Bước ${idx + 1}</span>
                <span class="step-phase">${step.phase}</span>
              </div>
              <div class="step-body">
                <div class="activity-block">
                  <div class="act-title">👩‍🏫 Hoạt động của cô:</div>
                  <p>${step.teacherActivity}</p>
                </div>
                <div class="activity-block">
                  <div class="act-title">👶 Hoạt động của trẻ:</div>
                  <p>${step.childrenActivity}</p>
                </div>
                ${step.guidingQuestions && step.guidingQuestions.length > 0 ? `
                  <div class="questions-block">
                    <div class="q-title">❓ Câu hỏi gợi mở:</div>
                    <ul>
                      ${step.guidingQuestions.map((q: string) => `<li>${q}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('') || ''}
        </div>
      </div>

      ${plan.englishIntegration ? `
        <div class="card english-card">
          <h2 class="section-title">🇬🇧 ${isCorner ? 'V' : 'IV'}. TÍCH HỢP TIẾNG ANH TỰ NHIÊN</h2>
          <div class="vocab-grid">
            ${plan.englishIntegration.vocabulary?.map((v: any) => `
              <div class="vocab-badge">
                <span class="vocab-word">${v.word}</span>
                <span class="vocab-ipa">${v.ipa || ''}</span>
                <span class="vocab-meaning">${v.meaning}</span>
              </div>
            `).join('') || ''}
          </div>
          ${plan.englishIntegration.classroomEnglish && plan.englishIntegration.classroomEnglish.length > 0 ? `
            <div class="english-phrases">
              <strong>Khẩu lệnh tiếng Anh trong lớp:</strong>
              <ul>
                ${plan.englishIntegration.classroomEnglish.map((p: any) => `
                  <li><strong>${p.en || p.phrase}</strong>: ${p.vi || p.meaning}</li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      ` : ''}

      ${plan.adaptation ? `
        <div class="card">
          <h2 class="section-title">💡 ${isCorner ? 'VI' : 'V'}. ĐIỀU CHỈNH HỖ TRỢ TRẺ</h2>
          <p>${plan.adaptation}</p>
        </div>
      ` : ''}

      <div class="sign-block">
        <p>Ngày ...... tháng ...... năm 202...</p>
        <p><strong>Người soạn:</strong> ${plan.teacherName || 'Giáo viên'}</p>
      </div>
    `;
  } else if (isPack && pack) {
    bodyContent = `
      <div class="official-header">
        <div class="school-tag">🎁 BỘ HỌC LIỆU MẦM NON TEACHING PACK</div>
        <h1 class="main-title">${pack.packTitle}</h1>
        <div class="meta-pills">
          <span class="pill pill-age">👶 ${pack.ageGroup}</span>
          <span class="pill pill-time">⏱️ ${pack.duration}</span>
        </div>
        <p class="pack-overview">${pack.planOverview}</p>
      </div>

      <div class="card">
        <h2 class="section-title">📖 1. ${pack.storyOrPoem?.type || 'Thơ / Truyện'}: ${pack.storyOrPoem?.title || ''}</h2>
        <div class="poem-lines">
          ${pack.storyOrPoem?.content?.map((line: string) => `<p>${line}</p>`).join('') || ''}
        </div>
      </div>

      <div class="card">
        <h2 class="section-title">🖼️ 2. BỘ THẺ FLASHCARDS TRỰC QUAN 3D</h2>
        <div class="fc-grid">
          ${pack.flashcards?.map((fc: any) => `
            <div class="fc-card">
              <div class="fc-tag">${fc.tag}</div>
              <div class="fc-title">${fc.title}</div>
              <div class="fc-cap">${fc.caption}</div>
            </div>
          `).join('') || ''}
        </div>
      </div>

      <div class="card">
        <h2 class="section-title">🎲 3. TRÒ CHƠI NHÓM: ${pack.game?.title || ''}</h2>
        <p class="game-desc">${pack.game?.description || ''}</p>
      </div>

      <div class="card">
        <h2 class="section-title">👨‍👩‍👧 4. 10 PHÚT BỐ MẸ CHƠI CÙNG CON: ${pack.familyActivity?.title || ''}</h2>
        <ul class="steps-list">
          ${pack.familyActivity?.steps?.map((step: string) => `<li>${step}</li>`).join('') || ''}
        </ul>
      </div>
    `;
  } else {
    bodyContent = `
      <div class="official-header">
        <h1 class="main-title">${item.title}</h1>
        <p class="pack-overview">${item.subtitle || ''}</p>
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>${item.title} - Vườn Ươm AI</title>
  <style>
    :root {
      --primary: #f97316;
      --primary-dark: #ea580c;
      --bg: #fffdf9;
      --card-bg: #ffffff;
      --border: #fed7aa;
      --text: #1c1917;
      --text-muted: #78716c;
      --shadow: 0 4px 20px rgba(249, 115, 22, 0.08);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 12px;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 860px;
      margin: 0 auto;
      padding-bottom: 60px;
    }
    /* Floating Cross-Device Toolbar */
    .top-bar {
      position: sticky;
      top: 10px;
      z-index: 100;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.06);
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .brand-pill {
      font-weight: 800;
      font-size: 13px;
      color: #9a3412;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .actions-group {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .btn {
      padding: 8px 14px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 700;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-primary {
      background: linear-gradient(135deg, #f97316, #ea580c);
      color: white;
    }
    .btn-secondary {
      background: #f5f5f4;
      color: #44403c;
      border: 1px solid #e7e5e4;
    }
    .btn:hover { opacity: 0.9; transform: translateY(-1px); }

    .official-header {
      background: white;
      border-radius: 24px;
      padding: 24px;
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      text-align: center;
      margin-bottom: 16px;
    }
    .school-tag {
      display: inline-block;
      font-size: 11px;
      font-weight: 800;
      color: #c2410c;
      background: #ffedd5;
      padding: 4px 12px;
      border-radius: 999px;
      margin-bottom: 8px;
    }
    .main-title {
      font-size: 22px;
      font-weight: 900;
      color: #292524;
      margin-bottom: 12px;
    }
    .meta-pills {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 700;
    }
    .pill {
      padding: 4px 10px;
      border-radius: 8px;
      border: 1px solid transparent;
    }
    .pill-theme { background: #fdf2f8; color: #9d174d; border-color: #fbcfe8; }
    .pill-topic { background: #f0fdf4; color: #166534; border-color: #bbf7d0; }
    .pill-age { background: #eff6ff; color: #1e40af; border-color: #bfdbfe; }
    .pill-time { background: #faf5ff; color: #6b21a8; border-color: #e9d5ff; }
    .pack-overview {
      margin-top: 12px;
      font-size: 13px;
      color: var(--text-muted);
    }

    .card {
      background: white;
      border-radius: 20px;
      padding: 20px;
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      margin-bottom: 16px;
    }
    .section-title {
      font-size: 16px;
      font-weight: 800;
      color: #431407;
      margin-bottom: 14px;
      border-bottom: 2px solid #ffedd5;
      padding-bottom: 6px;
    }

    /* Objectives */
    .obj-box {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }
    @media (min-width: 640px) {
      .obj-box { grid-template-columns: repeat(3, 1fr); }
    }
    .obj-group {
      background: #fafaf9;
      padding: 12px;
      border-radius: 14px;
      border: 1px solid #f5f5f4;
    }
    .obj-group h3 {
      font-size: 13px;
      font-weight: 800;
      color: #ea580c;
      margin-bottom: 6px;
    }
    .obj-group ul {
      padding-left: 18px;
      font-size: 12px;
    }

    /* Corners */
    .corner-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }
    @media (min-width: 640px) {
      .corner-grid { grid-template-columns: repeat(2, 1fr); }
    }
    .corner-card {
      background: #fff7ed;
      border: 1px solid #fed7aa;
      border-radius: 14px;
      padding: 12px;
      font-size: 12px;
    }
    .corner-name {
      font-weight: 800;
      color: #9a3412;
      font-size: 13px;
      margin-bottom: 4px;
    }

    /* Procedure Steps */
    .step-card {
      border: 1px solid #f5f5f4;
      border-radius: 16px;
      padding: 14px;
      margin-bottom: 12px;
      background: #fafaf9;
    }
    .step-head {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .step-badge {
      background: #ea580c;
      color: white;
      font-size: 11px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 6px;
    }
    .step-phase {
      font-weight: 800;
      font-size: 14px;
      color: #1c1917;
    }
    .activity-block {
      margin-bottom: 8px;
      font-size: 13px;
    }
    .act-title {
      font-weight: 700;
      color: #ea580c;
      margin-bottom: 2px;
    }
    .questions-block {
      background: #fff;
      border: 1px dashed #fed7aa;
      border-radius: 10px;
      padding: 8px 12px;
      font-size: 12px;
      margin-top: 6px;
    }
    .q-title {
      font-weight: 700;
      color: #c2410c;
    }
    .questions-block ul {
      padding-left: 18px;
    }

    /* Preparation */
    .prep-columns {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
      font-size: 13px;
    }
    @media (min-width: 640px) {
      .prep-columns { grid-template-columns: 1fr 1fr; }
    }
    .prep-col {
      background: #fafaf9;
      padding: 12px;
      border-radius: 12px;
    }
    .prep-col ul { padding-left: 18px; margin-top: 4px; }

    /* English */
    .vocab-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 10px;
    }
    .vocab-badge {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 6px 12px;
      border-radius: 10px;
      font-size: 12px;
      display: inline-flex;
      gap: 6px;
    }
    .vocab-word { font-weight: 800; color: #1e40af; }
    .vocab-ipa { color: #64748b; font-size: 11px; }
    .vocab-meaning { color: #334155; font-weight: 600; }
    .english-phrases {
      font-size: 12px;
      background: #f8fafc;
      padding: 10px;
      border-radius: 10px;
    }
    .english-phrases ul { padding-left: 18px; margin-top: 4px; }

    /* Teaching pack poem & flashcard */
    .poem-lines {
      text-align: center;
      font-weight: 700;
      font-size: 15px;
      color: #9a3412;
      background: #fff7ed;
      padding: 20px;
      border-radius: 16px;
      line-height: 2;
    }
    .fc-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }
    @media (min-width: 640px) {
      .fc-grid { grid-template-columns: repeat(2, 1fr); }
    }
    .fc-card {
      background: #fafaf9;
      border: 1px solid #e7e5e4;
      border-radius: 14px;
      padding: 12px;
    }
    .fc-tag { font-size: 10px; font-weight: 800; color: #ea580c; text-transform: uppercase; }
    .fc-title { font-size: 14px; font-weight: 800; margin: 4px 0; }
    .fc-cap { font-size: 12px; color: #78716c; }

    .game-desc, .steps-list { font-size: 13px; }
    .steps-list { padding-left: 18px; margin-top: 6px; }

    .sign-block {
      text-align: right;
      font-style: italic;
      margin-top: 24px;
      font-size: 13px;
    }

    /* Print styling */
    @media print {
      body { background: white; padding: 0; }
      .top-bar { display: none !important; }
      .card, .official-header { box-shadow: none !important; border: 1px solid #ccc !important; break-inside: avoid; }
      .container { max-width: 100%; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="top-bar">
      <div class="brand-pill">
        <span>🌸 Vườn Ươm AI</span>
        <span style="font-weight: 500; font-size: 11px; color: #78716c;">(Bản dùng trên Điện thoại & Máy tính)</span>
      </div>
      <div class="actions-group">
        <button class="btn btn-secondary" onclick="window.print()">
          🖨️ In / PDF
        </button>
        <button class="btn btn-secondary" onclick="navigator.clipboard?.writeText(window.location.href); alert('Đã sao chép liên kết!');">
          📋 Chép link
        </button>
        <a class="btn btn-primary" href="${shareUrl}" target="_blank" rel="noopener">
          ✨ Mở app Vườn Ươm AI
        </a>
      </div>
    </div>

    ${bodyContent}
  </div>
</body>
</html>`;
}

// 6. Download a generated file directly
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
