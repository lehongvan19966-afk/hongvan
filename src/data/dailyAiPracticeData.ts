export interface AiPracticeExercise {
  id: string;
  day: number;
  category: 'prompt' | 'image' | 'video';
  categoryLabel: string;
  categoryEmoji: string;
  title: string;
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  targetAge: string;
  tool: 'chatgpt' | 'canva' | 'both';
  toolName: string;
  toolUrl: string;
  toolAltUrl?: string;
  toolAltName?: string;
  timeMinutes: number;
  scenario: string;
  goal: string;
  steps: string[];
  samplePrompt: string;
  teacherTips: string;
  expectedResult: string;
}

export interface PreschoolTopicPreset {
  id: string;
  name: string;
  emoji: string;
  subTopics: string[];
}

export const PRESCHOOL_TOPIC_PRESETS: PreschoolTopicPreset[] = [
  {
    id: 'animals',
    name: 'Thế giới động vật',
    emoji: '🐾',
    subTopics: ['Chú Thỏ Trắng dễ thương', 'Gia đình Chú Gà Con', 'Các loài cá bơi lội', 'Chú Voi con trong rừng', 'Vật nuôi trong nhà', 'Thế giới côn trùng quanh bé'],
  },
  {
    id: 'plants',
    name: 'Thế giới thực vật',
    emoji: '🌱',
    subTopics: ['Khám phá Quả Cam chín mọng', 'Bông hoa mùa xuân rực rỡ', 'Cây xanh cho bóng mát', 'Vườn rau củ quả sạch của bé', 'Hạt mầm lớn lên thế nào'],
  },
  {
    id: 'transport',
    name: 'Phương tiện giao thông',
    emoji: '🚗',
    subTopics: ['Bé học đèn tín hiệu giao thông', 'Chuyến tàu hỏa xình xịch', 'Xe buýt chở bé đến trường', 'Máy bay trên bầu trời', 'Thuyền buồm lướt sóng'],
  },
  {
    id: 'family',
    name: 'Gia đình yêu thương',
    emoji: '🏡',
    subTopics: ['Mẹ và bé yêu', 'Bé giúp đỡ bố mẹ việc nhà', 'Ngôi nhà ấm cúng của em', 'Bữa cơm gia đình ấm áp', 'Tình cảm ông bà dành cho bé'],
  },
  {
    id: 'jobs',
    name: 'Nghề nghiệp quen thuộc',
    emoji: '👷',
    subTopics: ['Bác sĩ nha khoa khám răng cho bé', 'Chú bộ đội canh giữ biên cương', 'Cô giáo mầm non như người mẹ hiền', 'Bác nông dân gặt lúa', 'Chú cảnh sát giao thông'],
  },
  {
    id: 'school',
    name: 'Trường mầm non thân yêu',
    emoji: '🏫',
    subTopics: ['Lớp học mầm non vui tươi', 'Đồ chơi góc phân vai của bé', 'Bé tập rửa tay và cất dép', 'Giờ ra chơi ngoài sân trường', 'Bé cùng bạn chia sẻ đồ chơi'],
  },
  {
    id: 'self',
    name: 'Bản thân & Cơ thể bé',
    emoji: '🧒',
    subTopics: ['Năm giác quan kỳ diệu', 'Bé giữ gìn nụ cười xinh', 'Những cảm xúc vui buồn của bé', 'Bé khỏe mạnh nhờ vận động', 'Sở thích đáng yêu của bé'],
  },
  {
    id: 'nature',
    name: 'Nước & Hiện tượng tự nhiên',
    emoji: '🌈',
    subTopics: ['Cầu vồng 7 sắc sau mưa', 'Ích lợi của nước sạch', 'Bốn mùa Xuân - Hạ - Thu - Đông', 'Mặt trời ban mai và ánh trăng đêm', 'Bé cùng cô bảo vệ môi trường'],
  },
  {
    id: 'homeland',
    name: 'Quê hương & Bác Hồ',
    emoji: '🇻🇳',
    subTopics: ['Lăng Bác Hồ và đầm sen ngát hương', 'Cờ đỏ sao vàng tung bay', 'Hội đón Tết Trung Thu rước đèn', 'Bé đón Tết Nguyên Đán sum vầy', 'Cảnh đẹp quê hương Việt Nam'],
  },
];

export const DAILY_AI_PRACTICE_EXERCISES: AiPracticeExercise[] = [
  // ==========================================
  // NHÓM 1: VIẾT PROMPT AI (CHATGPT / CLAUDE / GEMINI)
  // ==========================================
  {
    id: 'ex-prompt-01',
    day: 1,
    category: 'prompt',
    categoryLabel: 'Viết Prompt AI',
    categoryEmoji: '✍️',
    title: 'Viết Prompt Tạo Thơ 4 Chữ & Câu Đố Vui Về Quả Cam',
    difficulty: 'Cơ bản',
    targetAge: '4–5 tuổi (Lớp Chồi)',
    tool: 'chatgpt',
    toolName: 'ChatGPT',
    toolUrl: 'https://chatgpt.com',
    timeMinutes: 5,
    scenario: 'Cô đang chuẩn bị tiết học Khám phá khoa học về Quả Cam, cần 1 bài thơ 4 chữ dễ nhớ và 2 câu đố vui gieo vần để tạo hứng thú mở đầu giờ học.',
    goal: 'Nắm vững công thức Prompt 4 bước: [Đóng vai] + [Đối tượng học] + [Nhiệm vụ cụ thể] + [Yêu cầu định dạng & giọng điệu].',
    steps: [
      'Bấm nút "Sao chép Prompt mẫu" bên dưới.',
      'Mở ChatGPT bằng nút "Mở ChatGPT để thực hành 🚀".',
      'Dán prompt vào ô chat và gửi đi.',
      'Thử tinh chỉnh: Thay "Quả Cam" bằng một loại quả khác (Quả Dưa Hấu, Quả Xoài) và so sánh kết quả.',
      'Đánh dấu hoàn thành bài tập để nhận huy hiệu luyện tập hôm nay!',
    ],
    samplePrompt: `Bạn là một chuyên gia giáo dục mầm non giàu kinh nghiệm và rất yêu trẻ thơ.
Hãy sáng tác cho tôi:
1. Một bài thơ ngắn 4 chữ (khoảng 3-4 khổ thơ) về "Quả Cam chín mọng" dành cho trẻ 4–5 tuổi. Ngôn từ tươi vui, nhịp điệu rộn ràng, miêu tả vỏ màu cam sần sùi, múi mọng nước, vị ngọt thanh và giàu vitamin C giúp bé khỏe mạnh.
2. Hai câu đố vui có vần điệu dí dỏm về quả cam để cô giáo đố bé trong tiết học.
Định dạng trình bày rõ ràng, ấm áp, kèm các emoji sinh động.`,
    teacherTips: 'Khi viết prompt cho mầm non, luôn chỉ định rõ độ tuổi của trẻ (ví dụ: 3–4 tuổi hay 5–6 tuổi) để AI dùng vốn từ vựng và số câu chữ phù hợp với tầm nhận thức của bé.',
    expectedResult: 'Một bài thơ 4 chữ ngân vang vần điệu kèm 2 câu đố ngộ nghĩnh, dùng được ngay trên lớp.',
  },
  {
    id: 'ex-prompt-02',
    day: 2,
    category: 'prompt',
    categoryLabel: 'Viết Prompt AI',
    categoryEmoji: '✍️',
    title: 'Viết Prompt Kịch Bản Đóng Vai "Bé Đi Siêu Thị Cùng Mẹ"',
    difficulty: 'Trung bình',
    targetAge: '5–6 tuổi (Lớp Lá)',
    tool: 'chatgpt',
    toolName: 'ChatGPT',
    toolUrl: 'https://chatgpt.com',
    timeMinutes: 8,
    scenario: 'Cô tổ chức hoạt động góc Phân vai cho trẻ 5–6 tuổi với chủ đề Bé đi siêu thị, cần lời thoại ngắn, tự nhiên rèn kỹ năng giao tiếp lịch sự (chào hỏi, hỏi giá, cảm ơn).',
    goal: 'Biết cách đưa bối cảnh tình huống thực tế và các quy tắc giao tiếp xã hội vào câu lệnh AI.',
    steps: [
      'Sao chép prompt kịch bản đóng vai bên dưới.',
      'Mở ChatGPT và gửi câu lệnh.',
      'Yêu cầu AI bổ sung tình huống phát sinh: "Bé làm rơi đồ và bạn cùng nhặt giúp".',
      'Sao chép kịch bản vào sổ tay bài giảng của cô.',
    ],
    samplePrompt: `Hãy đóng vai một chuyên gia phương pháp mầm non Montessory và STEAM.
Tôi cần bạn viết kịch bản hoạt động góc Phân vai: "Bé Đi Siêu Thị" cho nhóm 3 bạn nhỏ 5–6 tuổi:
- Nhân vật: Bạn An (Khách mua hàng), Bạn Bình (Nhân viên thu ngân), Bạn Chi (Người bán rau củ).
- Yêu cầu:
1. Lời thoại ngắn gọn, trong sáng, mỗi lượt nói không quá 2 câu.
2. Lồng ghép kỹ năng chào hỏi lễ phép, nói lời cảm ơn, xin lỗi và xếp hàng văn minh.
3. Kèm theo lời hướng dẫn cô giáo quan sát và hỗ trợ trẻ khi cần.`,
    teacherTips: 'Kịch bản phân vai mầm non nên để mở để trẻ có thể tự do ứng biến ngôn ngữ của mình, AI chỉ cần đưa ra sườn đối thoại gợi mở.',
    expectedResult: 'Kịch bản 3 phân cảnh rõ ràng, dễ phân vai cho các góc chơi trong lớp học.',
  },
  {
    id: 'ex-prompt-03',
    day: 3,
    category: 'prompt',
    categoryLabel: 'Viết Prompt AI',
    categoryEmoji: '✍️',
    title: 'Viết Prompt Thiết Kế Kế Hoạch Tuần "Giao Thông An Toàn"',
    difficulty: 'Nâng cao',
    targetAge: '4–5 tuổi (Lớp Chồi)',
    tool: 'chatgpt',
    toolName: 'ChatGPT',
    toolUrl: 'https://chatgpt.com',
    timeMinutes: 10,
    scenario: 'Đầu tuần mới, cô cần lên khung kế hoạch giáo dục 5 ngày (Thứ 2 đến Thứ 6) tích hợp phát triển 5 lĩnh vực theo chuẩn Bộ GD&ĐT.',
    goal: 'Thành thạo kỹ thuật Prompt theo bảng biểu (Markdown Table) và chuẩn quy định giáo dục mầm non.',
    steps: [
      'Sao chép prompt kế hoạch tuần bên dưới.',
      'Mở ChatGPT và dán prompt để nhận bảng kế hoạch.',
      'Yêu cầu tinh chỉnh thêm phần "Hoạt động ngoài trời" cho từng ngày.',
      'Lưu kết quả về máy tính hoặc in ra bảng kế hoạch.',
    ],
    samplePrompt: `Bạn là Hiệu phó Chuyên môn trường Mầm non đạt chuẩn Quốc gia.
Hãy lập bảng kế hoạch giáo dục tuần chủ đề: "Phương tiện giao thông đường bộ" cho lứa tuổi 4–5 tuổi (Lớp Chồi) từ Thứ 2 đến Thứ 6.
Bảng gồm các cột:
- Thứ / Ngày
- Đón trẻ & Thể dục sáng
- Hoạt động học (Đủ 5 lĩnh vực: Thể chất, Nhận thức, Ngôn ngữ, Thẩm mỹ, Tình cảm - Kỹ năng xã hội)
- Hoạt động góc (Góc tạo hình, Góc xây dựng, Góc phân vai)
- Hoạt động chiều & Nêu gương
Yêu cầu: Các hoạt động phải an toàn, sáng tạo, lấy trẻ làm trung tâm và dùng nguyên vật liệu tái chế. Trình bày dạng bảng Markdown rõ ràng.`,
    teacherTips: 'Yêu cầu bảng Markdown giúp cô dễ dàng sao chép trực tiếp vào Word hoặc Excel mà không bị vỡ định dạng cột.',
    expectedResult: 'Bảng kế hoạch tuần 5 ngày chuẩn mực sư phạm, đầy đủ 5 lĩnh vực phát triển.',
  },

  // ==========================================
  // NHÓM 2: TẠO HÌNH ẢNH AI (CANVA AI / MIDJOURNEY / DALL-E)
  // ==========================================
  {
    id: 'ex-image-01',
    day: 4,
    category: 'image',
    categoryLabel: 'Tạo Ảnh AI',
    categoryEmoji: '🖼️',
    title: 'Tạo Bộ 3 Thẻ Flashcard Con Vật 3D Phong Cách Pixar Trên Canva AI',
    difficulty: 'Cơ bản',
    targetAge: '3–4 tuổi (Lớp Mầm)',
    tool: 'canva',
    toolName: 'Canva AI (Magic Media)',
    toolUrl: 'https://www.canva.com',
    timeMinutes: 5,
    scenario: 'Cô cần 3 hình ảnh con vật quen thuộc (Chú thỏ trắng, Chú cún con, Chú mèo tam thể) với phong cách hoạt hình 3D Pixar tươi sáng, nền trắng tách biệt để làm thẻ học Flashcard cho bé.',
    goal: 'Biết cách sử dụng các từ khóa phong cách ("3D Pixar animation", "cute chibi", "soft warm lighting", "isolated on solid white background") để tạo ảnh đồ họa mầm non.',
    steps: [
      'Sao chép prompt tạo ảnh tiếng Anh chuẩn bên dưới (Canva Magic Media hiểu tốt nhất bằng tiếng Anh).',
      'Bấm nút "Mở Canva AI Studio 🎨" để vào trang Canva.',
      'Tạo thiết kế mới cỡ "Bài đăng Instagram" (1080x1080px).',
      'Chọn mục "Ứng dụng" ➔ Tìm "Magic Media" (Phương tiện kỳ diệu) ➔ Chọn tab "Hình ảnh".',
      'Dán prompt vào ô mô tả, chọn phong cách "3D" và bấm "Tạo hình ảnh"!',
    ],
    samplePrompt: `Cute baby white bunny with big sparkling eyes and pink nose, holding a fresh orange carrot, 3D Pixar Disney animated style, joyful playful expression, soft volumetric lighting, vibrant pastel colors, clean solid white background, high resolution 8k, preschool educational flashcard illustration.`,
    teacherTips: 'Thêm từ khóa "clean solid white background" giúp cô dễ dàng dùng tính năng "Tách nền" (Remove Background) của Canva chỉ với 1 cú nhấp chuột.',
    expectedResult: 'Hình ảnh chú thỏ 3D dễ thương chuẩn phong cách hoạt hình Pixar, nền trắng sáng rõ nét.',
  },
  {
    id: 'ex-image-02',
    day: 5,
    category: 'image',
    categoryLabel: 'Tạo Ảnh AI',
    categoryEmoji: '🖼️',
    title: 'Tạo Tranh Minh Họa Góc Thiên Nhiên Mầm Non Bằng Canva AI',
    difficulty: 'Trung bình',
    targetAge: '4–5 tuổi (Lớp Chồi)',
    tool: 'canva',
    toolName: 'Canva AI',
    toolUrl: 'https://www.canva.com',
    toolAltName: 'ChatGPT (DALL-E 3)',
    toolAltUrl: 'https://chatgpt.com',
    timeMinutes: 7,
    scenario: 'Cô cần bức tranh phong cảnh khu vườn cổ tích với cầu vồng, đàn bướm bay và vườn hoa rực rỡ để làm hình nền trình chiếu PowerPoint hoặc phông nền sân khấu kể chuyện.',
    goal: 'Học cách mô tả ánh sáng, góc nhìn (wide angle panorama), gam màu ấm áp kích thích thị giác của trẻ mầm non.',
    steps: [
      'Sao chép prompt phong cảnh vườn cổ tích bên dưới.',
      'Mở Canva AI hoặc ChatGPT Plus.',
      'Tạo khổ ngang 16:9 (1920x1080px).',
      'Dán prompt và chọn phong cách "Tranh vẽ màu nước tươi vui" (Vibrant watercolor / Dreamy fairytale).',
      'Tải ảnh về máy và chèn vào bài giảng trình chiếu của cô.',
    ],
    samplePrompt: `Dreamy fairytale preschool garden landscape, lush green grass, blooming colorful flowers, giant friendly mushrooms, flying pastel butterflies, sparkling sunlight rays, beautiful rainbow in soft blue sky with fluffy white clouds, cute storybook watercolor art style, vibrant welcoming atmosphere, wide angle 16:9 horizontal format.`,
    teacherTips: 'Nếu ảnh tạo ra bị quá nhiều chi tiết rườm rà, cô có thể thêm từ khóa "simple clean composition for toddlers" để hình ảnh thoáng và dễ nhìn hơn với mắt trẻ.',
    expectedResult: 'Bức tranh phong cảnh vườn thần tiên tỉ lệ 16:9 ngập tràn sắc màu ấm áp.',
  },
  {
    id: 'ex-image-03',
    day: 6,
    category: 'image',
    categoryLabel: 'Tạo Ảnh AI',
    categoryEmoji: '🖼️',
    title: 'Tạo Nhân Vật Đồng Nhất: Bé Gái Mầm Non Mặc Áo Dài Đi Hội Xuân',
    difficulty: 'Nâng cao',
    targetAge: '5–6 tuổi (Lớp Lá)',
    tool: 'both',
    toolName: 'ChatGPT & Canva',
    toolUrl: 'https://chatgpt.com',
    toolAltName: 'Canva AI',
    toolAltUrl: 'https://www.canva.com',
    timeMinutes: 10,
    scenario: 'Cô muốn tạo 1 nhân vật bé gái xuyên suốt tập truyện tranh: cùng một khuôn mặt, cùng kiểu tóc bob cài nơ hoa mai, mặc áo dài màu vàng truyền thống ở các tư thế khác nhau.',
    goal: 'Thành thạo kỹ thuật "Character Sheet" (Bảng tạo hình nhân vật đồng nhất) qua nhiều hành động.',
    steps: [
      'Sao chép prompt tạo bảng biểu cảm nhân vật bên dưới.',
      'Mở ChatGPT (DALL-E 3) hoặc Canva Magic Media.',
      'Tạo ra bảng nhân vật đa góc nhìn (Multiple poses / expressions).',
      'Cắt rời từng tư thế của bé để ghép vào từng trang truyện tranh mầm non.',
    ],
    samplePrompt: `Character design sheet of a cute 5-year-old Vietnamese preschool girl named Mai, short bob hair with a yellow apricot blossom hairpin, wearing a traditional modern yellow Ao Dai with white collar. 
Show 4 different poses and facial expressions on one page:
1. Waving hand happily and smiling warmly.
2. Holding a small red lantern.
3. Reading an open picture book curiously.
4. Clapping hands excitedly.
Cute 3D Pixar character style, consistent face and hair, vibrant colors, white background.`,
    teacherTips: 'Kỹ thuật yêu cầu tạo "Character sheet with 4 poses on one page" là bí quyết số 1 để giữ nhân vật nhất quán 100% trong truyện tranh mầm non.',
    expectedResult: 'Một tấm ảnh chứa 4 tư thế khác nhau của cùng 1 bé gái, sẵn sàng cắt ghép vào truyện kể.',
  },

  // ==========================================
  // NHÓM 3: TẠO VIDEO & HOẠT HÌNH AI (CANVA MAGIC MEDIA / CHATGPT)
  // ==========================================
  {
    id: 'ex-video-01',
    day: 7,
    category: 'video',
    categoryLabel: 'Tạo Video AI',
    categoryEmoji: '🎬',
    title: 'Tạo Video Hoạt Họa 4 Giây: Chú Thỏ Trắng Vẫy Tay Chào Bé Trên Canva Video AI',
    difficulty: 'Cơ bản',
    targetAge: '3–4 tuổi (Lớp Mầm)',
    tool: 'canva',
    toolName: 'Canva AI Video (Runway / Magic Media)',
    toolUrl: 'https://www.canva.com',
    timeMinutes: 6,
    scenario: 'Cô muốn chèn 1 đoạn video hoạt họa ngắn 4 giây vào đầu slide PowerPoint mở đầu tiết học để chú thỏ chuyển động cử động tay chào mừng các bé.',
    goal: 'Làm quen với tính năng tạo video AI bằng văn bản (Text to Video) trên Canva.',
    steps: [
      'Sao chép prompt video hoạt họa bên dưới.',
      'Mở Canva bằng nút "Mở Canva AI Studio 🎨".',
      'Tạo thiết kế loại "Video" (1920x1080px).',
      'Vào mục Ứng dụng ➔ Magic Media ➔ Chọn tab "Video".',
      'Dán prompt vào ô tạo video, bấm "Tạo video" và chờ khoảng 1-2 phút để AI render chuyển động!',
    ],
    samplePrompt: `Cute baby 3D white bunny sitting on green grass in a sunny kindergarten playground, smiling cheerfully, raising its paw and waving gently at the camera, ears wiggling happily, colorful flowers in soft focus background, smooth slow animation, high quality preschool cartoon.`,
    teacherTips: 'Khi viết prompt video, hãy dùng các từ khóa chuyển động chậm và nhẹ nhàng như "waving gently", "slow animation" để video phù hợp với nhịp tiếp nhận êm dịu của trẻ nhỏ.',
    expectedResult: 'Video MP4 4 giây chú thỏ cử động chân thực, mượt mà và ngộ nghĩnh.',
  },
  {
    id: 'ex-video-02',
    day: 8,
    category: 'video',
    categoryLabel: 'Tạo Video AI',
    categoryEmoji: '🎬',
    title: 'Viết Kịch Bản Phân Cảnh (Storyboard) Cho Video Kể Chuyện AI 1 Phút',
    difficulty: 'Trung bình',
    targetAge: '4–5 tuổi (Lớp Chồi)',
    tool: 'chatgpt',
    toolName: 'ChatGPT & Canva Video',
    toolUrl: 'https://chatgpt.com',
    toolAltName: 'Canva Video',
    toolAltUrl: 'https://www.canva.com',
    timeMinutes: 8,
    scenario: 'Cô muốn làm 1 video ngắn 1 phút kể câu chuyện "Chú Vịt Xám Không Vâng Lời Mẹ" để chiếu trong giờ hoạt động góc, cần bảng phân cảnh 4 cảnh quay chi tiết gồm hình ảnh, âm thanh và lời bình.',
    goal: 'Nắm vững quy trình làm video AI mầm non chuẩn: Viết kịch bản phân cảnh ➔ Tạo hình ảnh ➔ Ghép video và lồng tiếng.',
    steps: [
      'Sao chép prompt phân cảnh Storyboard bên dưới.',
      'Mở ChatGPT để AI phân tích câu chuyện thành 4 cảnh quay.',
      'Mở Canva để tìm các clip/hình ảnh tương ứng với từng cảnh.',
      'Ghép nhạc nền vui nhộn và xuất bản video.',
    ],
    samplePrompt: `Bạn là một đạo diễn hoạt hình giáo dục mầm non.
Hãy xây dựng kịch bản phân cảnh chi tiết cho video hoạt hình ngắn 60 giây câu chuyện: "Chú Vịt Xám Không Vâng Lời Mẹ" dành cho trẻ 4–5 tuổi.
Chia thành 4 cảnh (mỗi cảnh 15 giây), trình bày bảng gồm:
1. Cảnh số & Thời lượng (0-15s, 15-30s...)
2. Mô tả hình ảnh chuyển động trực quan (Hình ảnh gì, nhân vật làm gì?)
3. Prompt tiếng Anh gợi ý để tôi đưa vào công cụ tạo ảnh/video AI
4. Lời thuyết minh / lời bình tiếng Việt của cô giáo (ấm áp, diễn cảm)
5. Hiệu ứng âm thanh & Nhạc nền gợi ý.`,
    teacherTips: 'Mỗi cảnh video cho trẻ mầm non không nên dài quá 15 giây để giữ được sự tập trung thị giác của trẻ.',
    expectedResult: 'Bảng storyboard 4 cảnh hoàn chỉnh từ prompt hình ảnh đến lời thuyết minh tiếng Việt.',
  },
  {
    id: 'ex-video-03',
    day: 9,
    category: 'video',
    categoryLabel: 'Tạo Video AI',
    categoryEmoji: '🎬',
    title: 'Tạo Video Bài Hát Mầm Non Chuyển Động Chữ & Hiệu Ứng Bắt Mắt Trên Canva',
    difficulty: 'Nâng cao',
    targetAge: '5–6 tuổi (Lớp Lá)',
    tool: 'canva',
    toolName: 'Canva Video Studio',
    toolUrl: 'https://www.canva.com',
    timeMinutes: 10,
    scenario: 'Cô cần dựng video bài hát "Đôi Bàn Tay Em" có chữ chạy karaoke (chữ đổi màu hoặc nảy nốt nhạc theo nhịp bài hát) để rèn khả năng nhận biết mặt chữ cho trẻ 5–6 tuổi.',
    goal: 'Ứng dụng tính năng tạo hoạt họa chữ (Text Animation) và nhịp điệu (Beat Sync) trên Canva để làm video dạy hát.',
    steps: [
      'Mở Canva Video ➔ Tạo trang trình chiếu bài hát.',
      'Gõ lời bài hát từng câu ngắn.',
      'Sử dụng tính năng "Hoạt ảnh" (Animate) ➔ Chọn kiểu "Bật lên" (Pop) hoặc "Gõ chữ" (Typewriter).',
      'Chèn các sticker động con vật, bàn tay xinh xắn.',
      'Khớp âm thanh nhạc bài hát và xuất video.',
    ],
    samplePrompt: `Gợi ý lời bài hát chia từng câu để làm video Canva:
[Cảnh 1] Hai bàn tay của em, đây em múa cho mẹ xem! (Sticker: Đôi bàn tay hoa vẫy chào)
[Cảnh 2] Hai bàn tay của em, như hai con bướm xinh xòe cánh! (Sticker: Hai chú bướm rực rỡ bay lượn)
[Cảnh 3] Khi em giơ tay lên, là bướm xinh bay lên trời! (Hiệu ứng chữ bay vút)
[Cảnh 4] Khi em giơ tay xuống, là con bướm đậu trên cành hồng! (Nốt nhạc nảy rộn ràng)`,
    teacherTips: 'Dùng màu chữ tương phản cao (vàng tươi trên nền xanh thẫm hoặc trắng trên nền tím) để trẻ ở khoảng cách xa vẫn nhìn rõ nét mặt chữ.',
    expectedResult: 'Video bài hát mầm non sinh động, lời bài hát chuyển động đồng bộ theo giai điệu.',
  },
];
