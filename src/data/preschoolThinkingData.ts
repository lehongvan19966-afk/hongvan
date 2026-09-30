// =========================================================================
// PRESCHOOL THINKING & AI DISCOVERY DATA
// Phân hệ Tư Duy & Khám Phá Mầm Non Chuẩn Chương Trình GDMN
// =========================================================================

export interface ThinkingSubject {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

export interface ThinkingTheme {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgGradient: string;
}

export interface ThinkingQuestion {
  id: string;
  subjectId: string;
  themeId: string;
  title: string;
  voicePrompt: string;
  visualContext?: {
    type: 'sequence' | 'comparison' | 'group' | 'odd_one' | 'shadow' | 'pairing';
    items: string[];
    labels?: string[];
  };
  options: {
    id: string;
    text: string;
    emoji: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  hint: string;
  badgeAwarded: string;
}

export interface DiscoveryPreset {
  id: string;
  title: string;
  emoji: string;
  theme: string;
  question: string;
  simpleExplanation: string;
  funFact: string;
  rhymePoem: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    badgeAwarded: string;
  };
  visualKeyword: string;
  fallbackImage: string;
}

export interface PlayResultRecord {
  id: string;
  type: 'thinking' | 'discovery';
  title: string;
  theme: string;
  subject?: string;
  score: number;
  maxScore: number;
  stars: number;
  badge: string;
  playedAt: string;
  details?: string;
}

// 1. Môn học / Lĩnh vực phát triển nhận thức mầm non
export const THINKING_SUBJECTS: ThinkingSubject[] = [
  {
    id: 'all',
    name: 'Tất Cả Môn Học',
    emoji: '🌟',
    color: 'from-amber-400 to-orange-500',
    description: 'Trọn bộ bài tập tư duy đa lĩnh vực cho bé',
  },
  {
    id: 'math_patterns',
    name: 'Toán Học & Quy Luật',
    emoji: '📐',
    color: 'from-blue-500 to-indigo-600',
    description: 'Nhận biết quy luật chuỗi hình, so sánh kích thước, đếm và số lượng',
  },
  {
    id: 'science_nature',
    name: 'Khoa Học & Nhận Thức Thế Giới',
    emoji: '🔬',
    color: 'from-emerald-500 to-teal-600',
    description: 'Tìm điểm khác biệt, môi trường sống, ghép đôi mẹ con, bóng của vật',
  },
  {
    id: 'life_skills_eq',
    name: 'Kỹ Năng Sống & Cảm Xúc EQ',
    emoji: '❤️',
    color: 'from-rose-500 to-pink-600',
    description: 'Nhận diện cảm xúc, hành vi đúng sai, quy trình vòng đời lớn lên',
  },
];

// 2. Chủ đề mầm non quen thuộc theo Bộ GD&ĐT
export const THINKING_THEMES: ThinkingTheme[] = [
  {
    id: 'all',
    name: 'Tất Cả Chủ Đề',
    emoji: '🎈',
    color: 'text-amber-600',
    bgGradient: 'from-amber-50 to-orange-50 border-amber-200',
  },
  {
    id: 'animals',
    name: 'Thế Giới Động Vật',
    emoji: '🦁',
    color: 'text-emerald-600',
    bgGradient: 'from-emerald-50 to-teal-50 border-emerald-200',
  },
  {
    id: 'vehicles',
    name: 'Phương Tiện Giao Thông',
    emoji: '🚗',
    color: 'text-sky-600',
    bgGradient: 'from-sky-50 to-blue-50 border-sky-200',
  },
  {
    id: 'plants_fruits',
    name: 'Thực Vật & Hoa Quả',
    emoji: '🌸',
    color: 'text-rose-600',
    bgGradient: 'from-rose-50 to-pink-50 border-rose-200',
  },
  {
    id: 'family_body',
    name: 'Bản Thân & Gia Đình',
    emoji: '👨‍👩‍👧‍👦',
    color: 'text-purple-600',
    bgGradient: 'from-purple-50 to-indigo-50 border-purple-200',
  },
  {
    id: 'nature_weather',
    name: 'Thiên Nhiên & 4 Mùa',
    emoji: '🌈',
    color: 'text-cyan-600',
    bgGradient: 'from-cyan-50 to-teal-50 border-cyan-200',
  },
  {
    id: 'occupations',
    name: 'Nghề Nghiệp Xã Hội',
    emoji: '👩‍⚕️',
    color: 'text-orange-600',
    bgGradient: 'from-orange-50 to-amber-50 border-orange-200',
  },
];

// 3. Ngân hàng 24+ Bài tập tư duy chuẩn mầm non
export const PRESCHOOL_THINKING_QUESTIONS: ThinkingQuestion[] = [
  // ----------------------------------------------------
  // TOÁN HỌC & QUY LUẬT (MATH & PATTERNS)
  // ----------------------------------------------------
  {
    id: 'th-math-01',
    subjectId: 'math_patterns',
    themeId: 'animals',
    title: 'Bé hãy tìm con vật tiếp theo theo đúng quy luật!',
    voicePrompt: 'Bé hãy nhìn dãy hình: Vịt vàng, Gà con, Vịt vàng, Gà con. Hình tiếp theo vào dấu hỏi chấm là con gì nè?',
    visualContext: {
      type: 'sequence',
      items: ['🦆', '🐥', '🦆', '🐥', '❓'],
      labels: ['Vịt', 'Gà', 'Vịt', 'Gà', 'Tiếp theo?'],
    },
    options: [
      { id: 'opt-a', text: 'Chú vịt vàng', emoji: '🦆', isCorrect: true, explanation: 'Chính xác! Quy luật xen kẽ: Vịt rồi đến Gà, tiếp theo phải là Vịt vàng!' },
      { id: 'opt-b', text: 'Chú thỏ trắng', emoji: '🐰', isCorrect: false, explanation: 'Chưa đúng rồi! Trong dãy không có chú thỏ trắng nhé!' },
      { id: 'opt-c', text: 'Chú cá bơi', emoji: '🐟', isCorrect: false, explanation: 'Chưa đúng rồi! Bé nhìn kỹ dãy hình Vịt và Gà nhé!' },
    ],
    hint: 'Bé quan sát xem con vật nào đứng sau chú gà con nhé!',
    badgeAwarded: 'Thám Tử Quy Luật Mầm Non 🔍',
  },
  {
    id: 'th-math-02',
    subjectId: 'math_patterns',
    themeId: 'plants_fruits',
    title: 'Quả nào có kích thước TO NHẤT trong ba quả dưới đây?',
    voicePrompt: 'Trong ba quả: Quả dưa hấu, quả táo đỏ, và quả dâu tây, quả nào to nhất vậy bé?',
    visualContext: {
      type: 'comparison',
      items: ['🍉', '🍎', '🍓'],
      labels: ['Dưa hấu', 'Táo đỏ', 'Dâu tây'],
    },
    options: [
      { id: 'opt-a', text: 'Quả dưa hấu khổng lồ', emoji: '🍉', isCorrect: true, explanation: 'Xuất sắc! Quả dưa hấu to nhất, bé ôm cả hai tay mới vừa!' },
      { id: 'opt-b', text: 'Quả táo đỏ', emoji: '🍎', isCorrect: false, explanation: 'Quả táo vừa vặn trong lòng bàn tay, chưa phải to nhất đâu bé!' },
      { id: 'opt-c', text: 'Quả dâu tây nhỏ', emoji: '🍓', isCorrect: false, explanation: 'Quả dâu tây là quả bé nhất trong ba quả đấy!' },
    ],
    hint: 'Quả dưa hấu vỏ xanh ruột đỏ nặng nhất đấy bé!',
    badgeAwarded: 'Bậc Thầy So Sánh Kích Thước 🍉',
  },
  {
    id: 'th-math-03',
    subjectId: 'math_patterns',
    themeId: 'vehicles',
    title: 'Hình tiếp theo trong chuỗi màu sắc đèn giao thông là gì?',
    voicePrompt: 'Đèn đỏ dừng lại, đèn vàng chậm chậm, đèn xanh được đi. Đèn tiếp theo quay lại màu gì?',
    visualContext: {
      type: 'sequence',
      items: ['🔴', '🟡', '🟢', '❓'],
      labels: ['Đỏ', 'Vàng', 'Xanh', 'Tiếp theo?'],
    },
    options: [
      { id: 'opt-a', text: 'Đèn Đỏ dừng lại', emoji: '🔴', isCorrect: true, explanation: 'Đúng rồi! Chu trình đèn giao thông lặp lại bắt đầu bằng đèn đỏ!' },
      { id: 'opt-b', text: 'Đèn Tím', emoji: '🟣', isCorrect: false, explanation: 'Cột đèn giao thông không có màu tím đâu bé ơi!' },
      { id: 'opt-c', text: 'Đèn Xanh Lá', emoji: '🟢', isCorrect: false, explanation: 'Đèn xanh vừa sáng xong rồi, phải chuyển chu kỳ mới nhé!' },
    ],
    hint: 'Màu đèn báo hiệu các xe dừng lại là màu gì bé nhỉ?',
    badgeAwarded: 'Bé Hiểu Luật Giao Thông 🚦',
  },
  {
    id: 'th-math-04',
    subjectId: 'math_patterns',
    themeId: 'family_body',
    title: 'Đồ vật nào có HÌNH TRÒN giống như mặt trăng?',
    voicePrompt: 'Bé hãy tìm đồ vật có dạng hình tròn xoe trong các đồ vật sau đây nhé!',
    visualContext: {
      type: 'group',
      items: ['⚽', '📺', '📐'],
      labels: ['Quả bóng', 'Tivi chữ nhật', 'Thước tam giác'],
    },
    options: [
      { id: 'opt-a', text: 'Quả bóng đá', emoji: '⚽', isCorrect: true, explanation: 'Hoan hô bé! Quả bóng đá có hình tròn xoe có thể lăn bon bon!' },
      { id: 'opt-b', text: 'Màn hình Tivi', emoji: '📺', isCorrect: false, explanation: 'Tivi có hình chữ nhật với 4 góc vuông bé nha!' },
      { id: 'opt-c', text: 'Chiếc thước kẻ', emoji: '📐', isCorrect: false, explanation: 'Chiếc thước này có hình tam giác với 3 góc nhọn!' },
    ],
    hint: 'Đồ chơi nào lăn được trên sân bóng vậy bé?',
    badgeAwarded: 'Nhà Hình Khối Nhí ⚽',
  },
  {
    id: 'th-math-05',
    subjectId: 'math_patterns',
    themeId: 'nature_weather',
    title: 'Nhóm nào có số lượng NGÔI SAO NHIỀU HƠN?',
    voicePrompt: 'Bé đếm xem: nhóm A có 5 ngôi sao, nhóm B có 2 ngôi sao. Nhóm nào nhiều hơn?',
    visualContext: {
      type: 'comparison',
      items: ['⭐⭐⭐⭐⭐', '⭐⭐'],
      labels: ['Nhóm 5 sao', 'Nhóm 2 sao'],
    },
    options: [
      { id: 'opt-a', text: 'Nhóm A (5 ngôi sao lấp lánh)', emoji: '⭐', isCorrect: true, explanation: 'Chính xác! 5 ngôi sao nhiều hơn 2 ngôi sao (5 > 2)!' },
      { id: 'opt-b', text: 'Nhóm B (2 ngôi sao)', emoji: '✨', isCorrect: false, explanation: 'Nhóm B chỉ có 2 ngôi sao, ít hơn nhóm A bé nhé!' },
      { id: 'opt-c', text: 'Hai nhóm bằng nhau', emoji: '⚖️', isCorrect: false, explanation: 'Không bằng nhau đâu, 5 nhiều hơn 2 mà!' },
    ],
    hint: 'Bé xòe một bàn tay có 5 ngón, nhiều hơn 2 ngón tay đấy!',
    badgeAwarded: 'Bé Đếm Giỏi Nhất Lớp ⭐',
  },

  // ----------------------------------------------------
  // KHOA HỌC & NHẬN THỨC THẾ GIỚI (SCIENCE & NATURE)
  // ----------------------------------------------------
  {
    id: 'th-sci-01',
    subjectId: 'science_nature',
    themeId: 'animals',
    title: 'Tìm con vật KHÁC BIỆT không cùng nhóm sống dưới nước!',
    voicePrompt: 'Trong các bạn: Cá heo, Tôm nhỏ, Rùa biển và Chú chim sẻ. Bạn nào không sống dưới nước?',
    visualContext: {
      type: 'odd_one',
      items: ['🐬', '🦐', '🐢', '🐦'],
      labels: ['Cá heo', 'Tôm nhỏ', 'Rùa biển', 'Chim sẻ'],
    },
    options: [
      { id: 'opt-a', text: 'Chú chim sẻ biết bay trên trời', emoji: '🐦', isCorrect: true, explanation: 'Tuyệt vời! Chim sẻ có đôi cánh bay trên bầu trời, các bạn còn lại sống dưới nước!' },
      { id: 'opt-b', text: 'Chú cá heo', emoji: '🐬', isCorrect: false, explanation: 'Cá heo bơi lội dưới biển xanh mà bé!' },
      { id: 'opt-c', text: 'Chú rùa biển', emoji: '🐢', isCorrect: false, explanation: 'Rùa biển cũng bơi lội dưới đại dương bao la!' },
    ],
    hint: 'Bạn nào có lông vũ và đôi cánh để bay lượn trên cành cây?',
    badgeAwarded: 'Bác Sĩ Động Vật Nhí 🐦',
  },
  {
    id: 'th-sci-02',
    subjectId: 'science_nature',
    themeId: 'animals',
    title: 'Bé hãy tìm con non của bạn Gà Mẹ nhé!',
    voicePrompt: 'Bạn Gà Mẹ đang tìm con của mình. Ai là em bé của Gà Mẹ?',
    visualContext: {
      type: 'pairing',
      items: ['🐔', '❓'],
      labels: ['Gà Mẹ', 'Bé tìm gà con'],
    },
    options: [
      { id: 'opt-a', text: 'Gà con lông vàng (Chip chip)', emoji: '🐥', isCorrect: true, explanation: 'Hoan hô bé! Gà mẹ ấp trứng nở ra chú gà con lông vàng kêu chip chip!' },
      { id: 'opt-b', text: 'Chú vịt con', emoji: '🦆', isCorrect: false, explanation: 'Vịt con là con của Vịt Mẹ, biết bơi dưới ao cơ!' },
      { id: 'opt-c', text: 'Chú cún con', emoji: '🐶', isCorrect: false, explanation: 'Cún con là con của Chó Mẹ bé nha!' },
    ],
    hint: 'Gà con có bộ lông vàng óng và kêu chip chip gọi mẹ!',
    badgeAwarded: 'Trái Tim Yêu Thương Mẹ Con 🐣',
  },
  {
    id: 'th-sci-03',
    subjectId: 'science_nature',
    themeId: 'vehicles',
    title: 'Phương tiện nào di chuyển trên ĐƯỜNG THỦY (dưới nước)?',
    voicePrompt: 'Trong xe máy, máy bay và tàu thủy, phương tiện nào chở khách lướt trên sóng biển?',
    visualContext: {
      type: 'group',
      items: ['🏍️', '✈️', '🚢'],
      labels: ['Xe máy', 'Máy bay', 'Tàu thủy'],
    },
    options: [
      { id: 'opt-a', text: 'Tàu thủy to lớn lướt sóng', emoji: '🚢', isCorrect: true, explanation: 'Chuẩn xác! Tàu thủy chạy trên mặt nước, vượt qua sông lớn và đại dương!' },
      { id: 'opt-b', text: 'Máy bay vút cao', emoji: '✈️', isCorrect: false, explanation: 'Máy bay bay trên bầu trời cao (đường hàng không)!' },
      { id: 'opt-c', text: 'Xe máy', emoji: '🏍️', isCorrect: false, explanation: 'Xe máy chạy trên đường bộ trên cạn bé ơi!' },
    ],
    hint: 'Phương tiện nổi trên mặt nước và có chiếc còi tàu kêu tu tu!',
    badgeAwarded: 'Thủy Thủ Nhí Tài Ba 🚢',
  },
  {
    id: 'th-sci-04',
    subjectId: 'science_nature',
    themeId: 'occupations',
    title: 'Đồ dùng nào thuộc về BÁC SĨ để khám bệnh cho bé?',
    voicePrompt: 'Khi bé đi khám sức khỏe, Bác sĩ dùng đồ vật nào để nghe nhịp tim của bé?',
    visualContext: {
      type: 'group',
      items: ['🩺', '🚒', '🍳'],
      labels: ['Ống nghe tim', 'Xe cứu hỏa', 'Chảo rán'],
    },
    options: [
      { id: 'opt-a', text: 'Ống nghe nhịp tim y tế', emoji: '🩺', isCorrect: true, explanation: 'Đúng rồi! Bác sĩ đeo ống nghe để nghe tiếng đập thình thịch của trái tim bé!' },
      { id: 'opt-b', text: 'Chiếc xe cứu hỏa', emoji: '🚒', isCorrect: false, explanation: 'Xe cứu hỏa là của các chú lính cứu hỏa dũng cảm!' },
      { id: 'opt-c', text: 'Chảo rán nấu ăn', emoji: '🍳', isCorrect: false, explanation: 'Chảo rán là của đầu bếp nấu những món ăn ngon!' },
    ],
    hint: 'Bác sĩ đeo vào tai và áp đầu nghe vào ngực bé để kiểm tra!',
    badgeAwarded: 'Bác Sĩ Nhí Tương Lai 🩺',
  },
  {
    id: 'th-sci-05',
    subjectId: 'science_nature',
    themeId: 'nature_weather',
    title: 'Khi trời ĐỔ MƯA RÀO, bé cần dùng vật gì để không bị ướt?',
    voicePrompt: 'Bầu trời kéo mây đen và mưa rơi tí tách. Bé đi ra ngoài cần mang theo vật gì che mưa?',
    visualContext: {
      type: 'comparison',
      items: ['🌧️', '❓'],
      labels: ['Mưa rơi', 'Cần vật gì che?'],
    },
    options: [
      { id: 'opt-a', text: 'Chiếc Ô xinh xắn hoặc Áo Mưa', emoji: '☂️', isCorrect: true, explanation: 'Hoan hô bé! Chiếc ô và áo mưa che chở cho bé luôn khô ráo và không bị cảm lạnh!' },
      { id: 'opt-b', text: 'Quạt máy', emoji: '🪭', isCorrect: false, explanation: 'Quạt máy chỉ dùng khi trời nóng bức thôi bé nha!' },
      { id: 'opt-c', text: 'Kính râm chống nắng', emoji: '🕶️', isCorrect: false, explanation: 'Kính râm để đeo khi trời nắng to bé ơi!' },
    ],
    hint: 'Chiếc ô xòe tròn như cây nấm che mưa cho bé!',
    badgeAwarded: 'Bé Biết Chăm Sóc Bản Thân ☂️',
  },

  // ----------------------------------------------------
  // KỸ NĂNG SỐNG & CẢM XÚC EQ (LIFE SKILLS & EQ)
  // ----------------------------------------------------
  {
    id: 'th-eq-01',
    subjectId: 'life_skills_eq',
    themeId: 'family_body',
    title: 'Khuôn mặt nào thể hiện cảm xúc VUI MỪNG, HẠNH PHÚC?',
    voicePrompt: 'Khi được cô giáo khen và ba mẹ ôm ấp, khuôn mặt bé tươi cười rạng rỡ giống hình nào?',
    visualContext: {
      type: 'comparison',
      items: ['😄', '😢', '😠'],
      labels: ['Mỉm cười tươi', 'Khóc buồn', 'Tức giận'],
    },
    options: [
      { id: 'opt-a', text: 'Nụ cười tươi rạng rỡ', emoji: '😄', isCorrect: true, explanation: 'Chính xác! Nụ cười tươi với ánh mắt lấp lánh biểu lộ niềm vui ngập tràn!' },
      { id: 'opt-b', text: 'Khuôn mặt khóc nhè', emoji: '😢', isCorrect: false, explanation: 'Đây là khuôn mặt đang buồn và khóc nhè bé nha!' },
      { id: 'opt-c', text: 'Khuôn mặt nhăn nhó tức giận', emoji: '😠', isCorrect: false, explanation: 'Đây là khuôn mặt đang giận dữ, không phải vui vẻ đâu!' },
    ],
    hint: 'Miệng cười xinh tươi hé lộ hàm răng trắng muốt!',
    badgeAwarded: 'Em Bé Hạnh Phúc Lan Tỏa Nụ Cười 😄',
  },
  {
    id: 'th-eq-02',
    subjectId: 'life_skills_eq',
    themeId: 'family_body',
    title: 'Trước khi ăn cơm, bé ngoan cần làm hành động gì?',
    voicePrompt: 'Mẹ chuẩn bị bữa cơm trưa thơm phức. Để đôi tay sạch khuẩn, bé làm gì trước tiên?',
    visualContext: {
      type: 'comparison',
      items: ['🧼', '📱', '🛏️'],
      labels: ['Rửa tay xà phòng', 'Xem điện thoại', 'Đi ngủ'],
    },
    options: [
      { id: 'opt-a', text: 'Rửa tay sạch bằng xà phòng và nước sạch', emoji: '🧼', isCorrect: true, explanation: 'Xuất sắc! Rửa tay sạch sẽ giúp đuổi hết vi khuẩn, bảo vệ bụng bé luôn khỏe mạnh!' },
      { id: 'opt-b', text: 'Lấy đồ chơi ra chơi', emoji: '🧸', isCorrect: false, explanation: 'Đến giờ ăn rồi, bé hãy cất đồ chơi gọn gàng nhé!' },
      { id: 'opt-c', text: 'Không rửa tay mà bốc ăn luôn', emoji: '✋', isCorrect: false, explanation: 'Tay dơ vi khuẩn chui vào bụng làm đau bụng đấy, bé nhớ rửa tay nhé!' },
    ],
    hint: 'Bọt xà phòng trắng xóa kì cọ 6 bước sạch sẽ!',
    badgeAwarded: 'Bé Khỏe Vệ Sinh Sạch Sẽ 🧼',
  },
  {
    id: 'th-eq-03',
    subjectId: 'life_skills_eq',
    themeId: 'plants_fruits',
    title: 'Thứ tự đúng của VÒNG ĐỜI CÂY TÁO lớn lên là gì?',
    voicePrompt: 'Cây táo bắt đầu từ hạt giống, nảy mầm ra lá non, rồi đơm hoa kết thành quả táo ngọt ngào. Bắt đầu là gì bé nhỉ?',
    visualContext: {
      type: 'sequence',
      items: ['🌰', '🌱', '🌸', '🍎'],
      labels: ['1. Hạt giống', '2. Cây mầm', '3. Hoa nở', '4. Quả chín'],
    },
    options: [
      { id: 'opt-a', text: 'Gieo hạt -> Nảy mầm -> Ra hoa -> Kết quả', emoji: '🌱', isCorrect: true, explanation: 'Tuyệt cú mèo! Hạt giống uống nước đâm chồi, nở hoa rực rỡ rồi mới cho quả ngọt ngào!' },
      { id: 'opt-b', text: 'Quả táo biến thành hạt mầm', emoji: '🍎', isCorrect: false, explanation: 'Phải gieo hạt xuống đất trước tiên bé nhé!' },
      { id: 'opt-c', text: 'Cây táo mọc ra quả ngay lập tức', emoji: '⚡', isCorrect: false, explanation: 'Cây cần thời gian tưới tắm và chăm sóc mới lớn dần được!' },
    ],
    hint: 'Bé gieo hạt giống nhỏ xíu xuống đất đất ẩm trước tiên nha!',
    badgeAwarded: 'Nhà Làm Vườn Tí Hon 🌱',
  },
  {
    id: 'th-eq-04',
    subjectId: 'life_skills_eq',
    themeId: 'family_body',
    title: 'Khi được người lớn tặng quà hoặc giúp đỡ, bé nói lời gì?',
    voicePrompt: 'Bác tặng bé một món đồ chơi đẹp. Bé ngoan khoanh tay lại và nói lời gì lễ phép?',
    visualContext: {
      type: 'pairing',
      items: ['🎁', '🧒'],
      labels: ['Quà tặng', 'Bé đáp lễ'],
    },
    options: [
      { id: 'opt-a', text: 'Cháu cảm ơn Bác ạ! (Khoanh tay lễ phép)', emoji: '🙏', isCorrect: true, explanation: 'Bé ngoan lắm! Luôn biết nói lời cảm ơn khi nhận quà giúp bé được mọi người yêu mến!' },
      { id: 'opt-b', text: 'Cầm lấy và bỏ chạy đi', emoji: '🏃', isCorrect: false, explanation: 'Như vậy là chưa ngoan đâu, bé phải cảm ơn người lớn trước nhé!' },
      { id: 'opt-c', text: 'Nói xin lỗi', emoji: '🙇', isCorrect: false, explanation: 'Khi mình làm sai mới nói xin lỗi, còn nhận quà thì nói Cảm Ơn bé nha!' },
    ],
    hint: 'Lời nói cảm ơn kèm nụ cười tươi khoanh tay lễ phép!',
    badgeAwarded: 'Bé Lễ Phép Đáng Yêu 💖',
  },
];

// 4. Danh sách các chuyến phiêu lưu khám phá AI gợi ý sẵn
export const PRESET_DISCOVERY_ADVENTURES: DiscoveryPreset[] = [
  {
    id: 'disc-dolphin',
    title: 'Bí Mật Chú Cá Heo Thông Minh 🐬',
    emoji: '🐬',
    theme: 'Đại dương bao la',
    question: 'Cá heo sống dưới nước nhưng thở bằng gì?',
    simpleExplanation: 'Cá heo tuy bơi dưới nước như cá nhưng lại là loài thú thở bằng phổi giống chúng mình! Trên đỉnh đầu của cá heo có chiếc lỗ thở thần kỳ. Thỉnh thoảng cá heo lại phóng vút lên khỏi mặt nước và thở phù ra làn sương mát!',
    funFact: 'Cá heo khi ngủ chỉ nhắm 1 mắt thôi, mắt kia vẫn mở để canh chừng kẻ thù đấy!',
    rhymePoem: 'Cá heo thông minh\nLướt sóng biển xanh\nThở bằng lỗ nhỏ\nNgoi lên nhảy quanh!',
    quiz: {
      question: 'Cá heo thở bằng gì trên cơ thể?',
      options: ['Lỗ thở trên đỉnh đầu 🌊', 'Thở bằng đuôi cá 🐟', 'Thở bằng mang 🐠'],
      correctIndex: 0,
      explanation: 'Đúng rồi bé ơi! Cá heo có chiếc lỗ thở xinh xắn trên đỉnh đầu!',
      badgeAwarded: 'Huy Hiệu Nhà Hải Dương Nhí 🐬',
    },
    visualKeyword: 'A cheerful cute 3D Pixar dolphin leaping gracefully out of sparkling turquoise ocean water with sunny rainbows',
    fallbackImage: 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'disc-rainbow',
    title: 'Vì Sao Lại Có Cầu Vồng 7 Sắc? 🌈',
    emoji: '🌈',
    theme: 'Thiên nhiên kỳ thú',
    question: 'Cầu vồng sinh ra từ đâu sau cơn mưa rào?',
    simpleExplanation: 'Khi mưa vừa dứt, ông mặt trời chiếu những tia nắng vàng ấm áp xuyên qua những giọt nước mưa còn bay lơ lửng trong không khí. Ánh sáng bị uốn cong và tách ra thành 7 sắc màu rực rỡ tuyệt đẹp!',
    funFact: 'Cầu vồng thực chất là một vòng tròn khép kín, nhưng từ mặt đất chúng ta chỉ nhìn thấy một nửa vòng cung thôi!',
    rhymePoem: 'Cầu vồng bảy sắc\nBắc qua mây trời\nNắng chiếu giọt mưa\nLung linh tuyệt vời!',
    quiz: {
      question: 'Dải cầu vồng có tất cả bao nhiêu sắc màu?',
      options: ['Có 7 sắc màu rực rỡ 🌈', 'Có 2 màu trắng đen ⚪', 'Có 1 màu đỏ duy nhất 🔴'],
      correctIndex: 0,
      explanation: 'Hoan hô bé! 7 sắc màu: Đỏ, Cam, Vàng, Lục, Lam, Chàm, Tím!',
      badgeAwarded: 'Huy Hiệu Cầu Vồng Kỳ Diệu 🌈',
    },
    visualKeyword: 'A magnificent colorful 3D Pixar style rainbow arcing over green rolling preschool meadow with smiling flowers',
    fallbackImage: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'disc-bee',
    title: 'Chú Ong Nhỏ Làm Mật Bằng Cách Nào? 🐝',
    emoji: '🐝',
    theme: 'Thế giới động vật',
    question: 'Tại sao mật ong lại ngọt ngào và thơm lừng như vậy?',
    simpleExplanation: 'Những chú ong vàng chăm chỉ bay đến từng bông hoa xinh, dùng chiếc vòi nhỏ xíu hút những giọt mật ngọt. Sau đó ong mang về tổ, cùng các bạn quạt cánh cho mật đặc lại thành mật ong vàng ươm!',
    funFact: 'Để có một thìa mật ong nhỏ cho bé ăn, chú ong phải ghé thăm hơn một nghìn bông hoa đấy!',
    rhymePoem: 'Ong vàng chăm chỉ\nBay khắp vườn hoa\nHút từng giọt mật\nNgọt ngào tặng ta!',
    quiz: {
      question: 'Chú ong bay vào vườn hoa để tìm gì?',
      options: ['Hút mật ngọt thơm 🌸', 'Để ngủ trưa 😴', 'Để tắm mưa 🌧️'],
      correctIndex: 0,
      explanation: 'Chính xác! Chú ong hút mật hoa thơm ngon để mang về tổ làm mật!',
      badgeAwarded: 'Huy Hiệu Ong Nhí Chăm Chỉ 🐝',
    },
    visualKeyword: 'A super cute 3D Pixar honeybee with chubby cheeks and tiny wings holding a golden honey pot in flower garden',
    fallbackImage: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'disc-space',
    title: 'Mặt Trăng & Ngôi Sao Ban Ngày Đi Đâu? 🌙',
    emoji: '🌙',
    theme: 'Vũ trụ bí ẩn',
    question: 'Ban ngày mặt trăng và các ngôi sao trốn ở đâu?',
    simpleExplanation: 'Ban ngày, mặt trăng và các vì sao vẫn ở nguyên trên bầu trời đấy bé ơi! Nhưng vì ông mặt trời tỏa ra ánh sáng quá rực rỡ và chói lóa, nên mắt chúng mình tạm thời không nhìn thấy các bạn sao lấp lánh thôi!',
    funFact: 'Đến khi mặt trời đi ngủ lặn xuống phía Tây, bầu trời tối dần thì mặt trăng và hàng triệu vì sao lại lung linh tỏa sáng!',
    rhymePoem: 'Mặt trăng ban ngày\nVẫn ở trên mây\nNắng vàng che khuất\nTối về sáng ngay!',
    quiz: {
      question: 'Vì sao ban ngày bé khó nhìn thấy các ngôi sao?',
      options: ['Vì ánh nắng mặt trời quá sáng chói ☀️', 'Vì các ngôi sao rủ nhau đi ngủ 🛌', 'Vì sao rơi xuống đất 🌍'],
      correctIndex: 0,
      explanation: 'Đúng rồi! Nắng của mặt trời quá chói chang che mất ánh sáng dịu nhẹ của sao!',
      badgeAwarded: 'Nhà Thiên Văn Nhí 🔭',
    },
    visualKeyword: 'A whimsical cute 3D Pixar crescent moon wearing nightcap sitting with smiling yellow stars in dreamy pastel twilight',
    fallbackImage: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'disc-dino',
    title: 'Thế Giới Khủng Long Cổ Đại Kỳ Bí 🦕',
    emoji: '🦕',
    theme: 'Thế giới động vật',
    question: 'Khủng long ăn cỏ cổ dài to lớn như thế nào?',
    simpleExplanation: 'Cách đây hàng triệu năm, trên Trái Đất có những chú khủng long cổ dài to lớn bằng cả một tòa nhà 3 tầng! Dù khổng lồ nhưng bạn ấy chỉ thích ăn lá cây xanh ở trên ngọn cây cao vút và rất hiền lành!',
    funFact: 'Có những loài khủng long to lớn như một đoàn tàu, nhưng cũng có loài khủng long nhỏ xíu chỉ bằng một chú gà con!',
    rhymePoem: 'Khủng long cổ dài\nBước đi hiền lành\nVươn cao ngọn núi\nĂn búp lá xanh!',
    quiz: {
      question: 'Khủng long cổ dài to lớn thường ăn món gì?',
      options: ['Lá cây xanh trên cao 🍃', 'Bánh kem sô-cô-la 🎂', 'Cơm gà rán 🍗'],
      correctIndex: 0,
      explanation: 'Chuẩn luôn! Khủng long cổ dài là bạn khủng long ăn thực vật và lá cây!',
      badgeAwarded: 'Nhà Khảo Cổ Nhí 🦕',
    },
    visualKeyword: 'A friendly cute 3D Pixar baby Brachiosaurus with huge sweet green eyes eating leaves in lush prehistoric jungle',
    fallbackImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'disc-fire-truck',
    title: 'Chiếc Xe Cứu Hỏa Chữa Cháy Ra Sao? 🚒',
    emoji: '🚒',
    theme: 'Phương tiện giao thông',
    question: 'Tại sao xe cứu hỏa lại có màu đỏ rực rỡ và còi hú to?',
    simpleExplanation: 'Chiếc xe cứu hỏa được sơn màu đỏ chói lọi để từ xa mọi người đều nhìn thấy ngay lập tức. Khi có đám cháy, xe hú còi vang dội để các xe khác nhường đường, trên xe có vòi phun nước khổng lồ và chiếc thang dài vươn cao!',
    funFact: 'Chiếc thang trên xe cứu hỏa có thể vươn cao tới tận tầng 10 của các tòa nhà để cứu người và dập tắt ngọn lửa!',
    rhymePoem: 'Xe cứu hỏa đỏ\nCòi hú vang xa\nVòi rồng phun nước\nDập tắt lửa lò!',
    quiz: {
      question: 'Xe cứu hỏa dùng thứ gì để dập tắt đám cháy?',
      options: ['Nước mát từ vòi rồng phun mạnh 💦', 'Dùng cát và gió 🌪️', 'Dùng dầu ăn 🍳'],
      correctIndex: 0,
      explanation: 'Hoan hô bé! Nước mát từ vòi rồng dập tắt ngọn lửa và giải cứu mọi người!',
      badgeAwarded: 'Hiệp Sĩ Cứu Hỏa Nhí 🚒',
    },
    visualKeyword: 'A cute friendly 3D Pixar red fire truck with big happy eyes and long ladder spraying joyful water sparkles',
    fallbackImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
  },
];
