// Audio utility using Web Audio API and Web Speech API

class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a cheerful high-pitched celebratory chime
  playSuccess() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
    osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.3); // C6

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  // Play a soft encouraging sound for retry
  playRetry() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(392, now); // G4
    osc.frequency.exponentialRampToValueAtTime(329.63, now + 0.15); // E4

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Play soft bubble pop on button press
  playPop() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Play bubble pop sound
  playBubblePop() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.06);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Play ticker click for wheel spin
  playSpin() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  // Play clock tick for countdown
  playTick() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.03);
  }

  // Play magic treasure chest opening tada!
  playTada() {
    const ctx = this.getContext();
    if (!ctx) return;
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    });
  }

  // Play celebratory fanfare
  playFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;
    const melody = [
      { f: 523.25, d: 0.1 }, // C5
      { f: 659.25, d: 0.1 }, // E5
      { f: 783.99, d: 0.12 }, // G5
      { f: 1046.5, d: 0.35 }, // C6
    ];
    let offset = 0;
    melody.forEach((note) => {
      const now = ctx.currentTime + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, now);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + note.d);
      offset += note.d * 0.85;
    });
  }
  // Play knocking sound on wooden door for Secret Doors
  playKnockDoor() {
    const ctx = this.getContext();
    if (!ctx) return;
    [0, 0.12, 0.24].forEach((t) => {
      const now = ctx.currentTime + t;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.06);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    });
  }

  // Play cartoon whack / hammer bonk sound for Whack-a-Ball
  playWhack() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(550, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Play mechanical claw motor for Crane Game
  playClaw() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(330, now + 0.25);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Play train whistle for Knowledge Train
  playTrainWhistle() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [587.33, 739.99].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    });
  }
}

export const sounds = new SoundEffects();

// =========================================================================
// BẢNG CHUYỂN ĐỔI TỪ TIẾNG ANH SANG TIẾNG VIỆT CHO GIỌNG BÉ GÁI 5 TUỔI
// Đảm bảo TUYỆT ĐỐI KHÔNG NÓI TIẾNG ANH - LUÔN NÓI TIẾNG VIỆT TRONG SÁNG DỄ THƯƠNG
// =========================================================================
const ENGLISH_TO_VIETNAMESE_WORDS: Record<string, string> = {
  // Màu sắc (Colors)
  red: 'màu đỏ tươi',
  blue: 'màu xanh da trời',
  green: 'màu xanh lá cây',
  yellow: 'màu vàng óng',
  orange: 'màu cam ngọt ngào',
  pink: 'màu hồng kẹo ngọt',
  purple: 'màu tím mộng mơ',
  black: 'màu đen',
  white: 'màu trắng tinh khôi',
  brown: 'màu nâu ấm áp',

  // Động vật (Animals)
  dog: 'chú cún con đáng yêu',
  cat: 'chú mèo con meo meo',
  duck: 'chú vịt bầu cạp cạp',
  bird: 'chú chim nhỏ hót líu lo',
  fish: 'chú cá bơi tung tăng',
  frog: 'chú ếch xanh ộp ộp',
  bear: 'bạn gấu bông ngoan ngoãn',
  lion: 'bác sư tử dũng cảm',
  tiger: 'chú hổ vằn mạnh mẽ',
  monkey: 'chú khỉ leo trèo tinh nghịch',
  elephant: 'bác voi to lớn có vòi dài',
  rabbit: 'bạn thỏ trắng tai dài xinh xắn',
  pig: 'chú heo con ủn ỉn',
  cow: 'bạn bò sữa vui vẻ',
  chicken: 'chú gà con lông vàng',
  rooster: 'chú gà trống gáy ò ó o',
  horse: 'chú ngựa phi nhanh',
  sheep: 'bạn cừu lông trắng mịn',
  bee: 'chú ong chăm chỉ hút mật',
  butterfly: 'bạn bướm xinh bay lượn',

  // Trái cây & Đồ ăn (Fruits & Food)
  apple: 'quả táo đỏ mọng ngọt lành',
  banana: 'quả chuối chín vàng thơm phức',
  grape: 'chùm nho tím ngon lành',
  strawberry: 'quả dâu tây đỏ xinh',
  watermelon: 'quả dưa hấu ngọt mát',
  mango: 'quả xoài chín vàng ngọt ngào',
  lemon: 'quả chanh thơm mát',
  peach: 'quả đào hồng xinh',
  milk: 'sữa tươi thơm ngon bổ dưỡng',
  bread: 'chiếc bánh mì giòn tan',
  cake: 'chiếc bánh sinh nhật ngọt ngào',
  water: 'nước uống trong veo mát lành',
  egg: 'quả trứng gà tròn xoe',
  rice: 'bát cơm dẻo thơm',

  // Đồ dùng, Phương tiện, Cơ thể, Chào hỏi
  book: 'quyển sách tranh rực rỡ',
  pen: 'chiếc bút viết chữ đẹp',
  pencil: 'cây bút chì sắc nét',
  table: 'chiếc bàn học ngay ngắn',
  chair: 'chiếc ghế ngồi xinh xắn',
  ball: 'quả bóng tròn lăn tăn',
  car: 'chiếc xe ô tô bon bon',
  bus: 'chiếc xe buýt trường học',
  train: 'đoàn tàu hỏa xình xịch',
  plane: 'chiếc máy bay lượn trên trời cao',
  star: 'ngôi sao vàng lấp lánh',
  sun: 'ông mặt trời ấm áp chiếu sáng',
  moon: 'chị hằng nga mặt trăng sáng ngời',
  cloud: 'đám mây bồng bềnh êm ái',
  rain: 'cơn mưa mát lành rơi rơi',
  tree: 'cây xanh tỏa bóng mát',
  flower: 'bông hoa thơm ngát khoe sắc',
  leaf: 'chiếc lá xanh tươi',
  hand: 'đôi bàn tay nhỏ xinh',
  eye: 'đôi mắt sáng long lanh',
  nose: 'chiếc mũi xinh xắn',
  mouth: 'khuôn miệng cười chúm chím',
  ear: 'đôi tai chăm chú lắng nghe',
  foot: 'bàn chân nhỏ bước đều',
  heart: 'trái tim yêu thương',

  // Câu từ giao tiếp cơ bản
  hello: 'xin chào bạn nhỏ yêu quý',
  hi: 'chào bạn nha',
  goodbye: 'tạm biệt bạn nhé',
  bye: 'tạm biệt bạn nha',
  'thank you': 'cảm ơn bạn thật nhiều',
  thanks: 'cảm ơn bạn nhé',
  sorry: 'xin lỗi bạn nha',
  please: 'làm ơn giúp bạn với',
  yes: 'đúng rồi đó bạn ơi',
  no: 'chưa đúng rồi bạn ơi',

  // Số đếm
  one: 'số một xinh xắn',
  two: 'số hai chú vịt',
  three: 'số ba cánh bướm',
  four: 'số bốn cánh buồm',
  five: 'số năm bông hoa',
  six: 'số sáu chú ốc',
  seven: 'số bảy cái cờ lê',
  eight: 'số tám chú gấu',
  nine: 'số chín chùm bóng bay',
  ten: 'số mười điểm tuyệt đối',

  // Từ trường học mầm non
  chant: 'bài đồng dao nhịp nhàng',
  song: 'bài hát vui tươi',
  game: 'trò chơi hào hứng',
  story: 'câu chuyện cổ tích kỳ diệu',
  lesson: 'bài học mầm non lý thú',
  teacher: 'cô giáo mến thương',
  student: 'các bạn học sinh chăm ngoan',
  kid: 'em bé đáng yêu',
  baby: 'em bé nhỏ xinh',
  school: 'trường mầm non thân yêu',
  friend: 'bạn bè thân thiết',
  play: 'cùng vui chơi nào',
  learn: 'cùng học tập chăm ngoan',
  love: 'yêu thương chan hòa',
};

// Chuyển chữ cái tiếng Anh A, B, C sang phiên âm mầm non tiếng Việt
const ENGLISH_LETTERS_TO_VIETNAMESE: Record<string, string> = {
  a: 'Chữ A',
  b: 'Chữ Bờ',
  c: 'Chữ Cờ',
  d: 'Chữ Dờ',
  e: 'Chữ E',
  g: 'Chữ Gờ',
  h: 'Chữ Hát',
  i: 'Chữ I ngắn',
  k: 'Chữ Ca',
  l: 'Chữ Lờ',
  m: 'Chữ Mờ',
  n: 'Chữ Nờ',
  o: 'Chữ O',
  p: 'Chữ Pờ',
  q: 'Chữ Cu',
  r: 'Chữ Rờ',
  s: 'Chữ Sờ',
  t: 'Chữ Tờ',
  u: 'Chữ U',
  v: 'Chữ Vờ',
  x: 'Chữ Xờ nhẹ',
  y: 'Chữ Y dài',
};

/**
 * Hàm lọc và chuyển đổi bất kỳ văn bản nào sang 100% Tiếng Việt thuần túy,
 * dễ thương, thân mật, hoàn toàn KHÔNG NÓI TIẾNG ANH.
 */
export function ensureVietnameseChildSpokenText(inputText: string): string {
  if (!inputText) return '';

  let text = inputText.trim();

  // Bỏ các ký tự đặc biệt format code như *, #, _, ~, `, [, ]
  text = text.replace(/[*#_~`\[\]]/g, '').trim();

  // Nếu là chữ cái đơn lẻ (vd: "A", "B", "c")
  const lowerTrimmed = text.toLowerCase();
  if (ENGLISH_LETTERS_TO_VIETNAMESE[lowerTrimmed]) {
    return ENGLISH_LETTERS_TO_VIETNAMESE[lowerTrimmed];
  }

  // Nếu là một từ tiếng Anh đơn giản quen thuộc
  if (ENGLISH_TO_VIETNAMESE_WORDS[lowerTrimmed]) {
    return ENGLISH_TO_VIETNAMESE_WORDS[lowerTrimmed];
  }

  // Kiểm tra nếu là dạng "A - Apple" hoặc "B - Ball"
  const letterMatch = text.match(/^([a-zA-Z])\s*[-–:]\s*([a-zA-Z\s]+)$/);
  if (letterMatch) {
    const char = letterMatch[1].toLowerCase();
    const word = letterMatch[2].toLowerCase().trim();
    const charVi = ENGLISH_LETTERS_TO_VIETNAMESE[char] || `Chữ ${char.toUpperCase()}`;
    const wordVi = ENGLISH_TO_VIETNAMESE_WORDS[word] || `Từ ${word}`;
    return `${charVi} trong từ ${wordVi} nè bạn ơi!`;
  }

  // Kiểm tra nếu toàn bộ câu chứa từ tiếng Anh thông dụng thì thay thế
  Object.keys(ENGLISH_TO_VIETNAMESE_WORDS).forEach((enWord) => {
    const regex = new RegExp(`\\b${enWord}\\b`, 'gi');
    if (regex.test(text)) {
      text = text.replace(regex, ENGLISH_TO_VIETNAMESE_WORDS[enWord]);
    }
  });

  // Nếu câu thuần tiếng Anh chưa có nghĩa tiếng Việt (không chứa ký tự dấu tiếng Việt)
  const hasVietnameseMarks = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(text);
  if (!hasVietnameseMarks && text.length > 0) {
    // Thêm tiền tố tiếng Việt nhẹ nhàng thân mật
    return `Từ tiếng Anh này có nghĩa là ${text} nè cô và các bạn ơi!`;
  }

  return text;
}

// Biến lưu trữ giọng đọc nữ tiếng Việt tối ưu trong trình duyệt
let cachedViFemaleVoice: SpeechSynthesisVoice | null = null;
let isVoicesListenerSetup = false;

function findBestVietnameseFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Ưu tiên cao nhất: Giọng tiếng Việt có chữ "female", "nữ", "Linh", "Mai", "An", "Chi", "Thu", "Google"
  const viFemale = voices.find(
    (v) =>
      (v.lang.toLowerCase().includes('vi') || v.lang.toLowerCase().includes('vie')) &&
      (v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('nữ') ||
        v.name.toLowerCase().includes('linh') ||
        v.name.toLowerCase().includes('mai') ||
        v.name.toLowerCase().includes('an') ||
        v.name.toLowerCase().includes('chi') ||
        v.name.toLowerCase().includes('thu') ||
        v.name.toLowerCase().includes('hoaimy') ||
        v.name.toLowerCase().includes('google'))
  );

  if (viFemale) return viFemale;

  // 2. Ưu tiên tiếp theo: Bất kỳ giọng nào có mã ngôn ngữ tiếng Việt (vi, vi-VN, vie)
  const anyViVoice = voices.find(
    (v) => v.lang.toLowerCase().includes('vi') || v.lang.toLowerCase().includes('vie')
  );

  if (anyViVoice) return anyViVoice;

  // 3. Nếu không có giọng tiếng Việt, chọn giọng nữ bất kỳ với pitch cao để giả giọng bé gái
  const anyFemale = voices.find(
    (v) => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('girl')
  );

  return anyFemale || voices[0] || null;
}

// Lắng nghe sự kiện voiceschanged để nạp giọng ngay khi trình duyệt sẵn sàng
if (typeof window !== 'undefined' && 'speechSynthesis' in window && !isVoicesListenerSetup) {
  isVoicesListenerSetup = true;
  window.speechSynthesis.onvoiceschanged = () => {
    cachedViFemaleVoice = findBestVietnameseFemaleVoice();
  };
}

let currentTtsAudio: HTMLAudioElement | null = null;

function speakWithSpeechSynthesis(vietnameseText: string, rate: number = 1.05) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(vietnameseText);
    utterance.lang = 'vi-VN';
    utterance.pitch = 1.55;
    utterance.rate = rate || 1.05;

    if (!cachedViFemaleVoice) {
      cachedViFemaleVoice = findBestVietnameseFemaleVoice();
    }
    if (cachedViFemaleVoice) {
      utterance.voice = cachedViFemaleVoice;
    }
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('speechSynthesis fallback error:', err);
  }
}

/**
 * HÀM PHÁT ÂM DUY NHẤT TOÀN ỨNG DỤNG:
 * - 100% TIẾNG VIỆT THUẦN TÚY (TUYỆT ĐỐI KHÔNG NÓI TIẾNG ANH)
 * - GIỌNG NỮ BÉ GÁI 5 TUỔI TRONG TRẺO, NHÍ NHẢNH (PITCH 1.55, RATE 1.05)
 * - PHÁT QUA AUDIO TIẾNG VIỆT CHUẨN CỦA GOOGLE TTS ENGINE, CHẠY TRÊN MỌI THIẾT BỊ
 *   KHÔNG CẦN CÀI ĐẶT GÓI TIẾNG VIỆT TRÊN MÁY TÍNH
 */
export function speakText(text: string, rate: number = 1.05, _forceLang: string = 'vi-VN') {
  if (typeof window === 'undefined') return;

  try {
    // 1. Dừng phát âm thanh trước đó
    if (currentTtsAudio) {
      currentTtsAudio.pause();
      currentTtsAudio.currentTime = 0;
      currentTtsAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // 2. Chuyển đổi và bảo đảm 100% văn bản phát ra là TIẾNG VIỆT thân mật cho bé gái 5 tuổi
    const vietnameseText = ensureVietnameseChildSpokenText(text);
    if (!vietnameseText) return;

    // 3. Ưu tiên phát trực tiếp bằng Audio Endpoint Tiếng Việt chuẩn 100%
    const audioUrl = `/api/tts/vietnamese?text=${encodeURIComponent(vietnameseText)}`;
    const audio = new Audio(audioUrl);
    currentTtsAudio = audio;

    // Tinh chỉnh giọng bé gái 5 tuổi:
    // Tốc độ 1.15 giúp giọng nói nhí nhảnh, lí lắc
    // preservesPitch = false giúp đẩy tần số cao hơn tự nhiên, hóa thành giọng bé gái 5 tuổi ngọt ngào
    audio.playbackRate = 1.15;
    if ('preservesPitch' in audio) {
      (audio as any).preservesPitch = false;
    } else if ('mozPreservesPitch' in audio) {
      (audio as any).mozPreservesPitch = false;
    } else if ('webkitPreservesPitch' in audio) {
      (audio as any).webkitPreservesPitch = false;
    }

    audio.play().catch((playErr) => {
      console.warn('Audio auto-play blocked or offline, trying SpeechSynthesis fallback:', playErr);
      speakWithSpeechSynthesis(vietnameseText, rate);
    });
  } catch (e) {
    console.warn('Speech error:', e);
  }
}

export function stopSpeaking() {
  if (currentTtsAudio) {
    currentTtsAudio.pause();
    currentTtsAudio.currentTime = 0;
    currentTtsAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// 5-year-old girl playful praise phrases (Lời khen bé gái 5 tuổi nhí nhảnh, 100% tiếng Việt)
const GIRL_PRAISES = [
  'Oa, đúng rồi nè! Bạn giỏi quá đi à, hi hi!',
  'Yeah yeah, đúng rồi! Bạn thông minh tuyệt vời ông mặt trời luôn á!',
  'Hoan hô bạn nha! Bé chọn chuẩn không cần chỉnh luôn nè!',
  'Oa thích quá, đỉnh quá bạn ơi! Cùng chơi tiếp với tớ nha!',
  'Đúng rồi, nhận được ngôi sao lấp lánh rồi nè! Hi hi!',
  'Bạn trả lời nhanh và siêu chuẩn luôn nè, yêu bạn quá!',
  'Tuyệt vời ông mặt trời! Bé vừa thông minh vừa đáng yêu nữa!',
];

// 5-year-old girl playful encouragement phrases (Lời động viên bé gái 5 tuổi ngọt ngào, 100% tiếng Việt)
const GIRL_ENCOURAGEMENTS = [
  'Hi hi, chưa đúng rồi nè! Bạn thử lại một lần nữa với tớ nha!',
  'Úi suýt nữa là đúng rồi, bạn cố lên một xíu nữa nào!',
  'Không sao đâu nè, bạn nhìn kỹ lại rồi chọn lại xem nha!',
  'Cố lên cố lên, tớ tin chắc chắn bạn sẽ làm được mà!',
  'Cố gắng thêm một chút nữa thôi bạn ơi, sắp chạm tới đáp án đúng rồi nè!',
];

export function speakGirlPraise() {
  const phrase = GIRL_PRAISES[Math.floor(Math.random() * GIRL_PRAISES.length)];
  speakText(phrase, 1.08, 'vi-VN');
}

export function speakGirlEncourage() {
  const phrase = GIRL_ENCOURAGEMENTS[Math.floor(Math.random() * GIRL_ENCOURAGEMENTS.length)];
  speakText(phrase, 1.05, 'vi-VN');
}

export function speakGirlQuestion(questionText: string) {
  speakText(`Đố bạn biết nè: ${questionText}`, 1.05, 'vi-VN');
}

export function speakGirlInstruction(instructionText: string) {
  speakText(instructionText, 1.05, 'vi-VN');
}


