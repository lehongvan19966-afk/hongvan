import { LessonPlan, TeachingPack } from '../types';

export interface LessonPlanParams {
  lessonType?: string;
  activityName?: string;
  theme?: string;
  topic: string;
  ageGroup: string;
  duration: string;
  teacherName?: string;
  schoolName?: string;
  childrenCount?: number;
  specialRequirements?: string;
  withEnglish?: boolean;
  hasSpecialNeeds?: boolean;
  domain?: string;
  specialNeeds?: string;
  methods?: string;
}

export interface LessonRefineParams {
  lessonPlan: LessonPlan;
  sectionKey: string;
  action: 'better' | 'shorter' | 'expand' | 'age_appropriate' | 'add_game' | 'add_questions' | 'english_buddy' | 'child_support' | string;
  customPrompt?: string;
}

export async function refineLessonSection(params: LessonRefineParams): Promise<any> {
  try {
    const res = await fetch('/api/gemini/lesson-refine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.updatedSection;
  } catch (error) {
    console.warn('Refine API error:', error);
    return null;
  }
}

export async function generateLessonPlan(params: LessonPlanParams): Promise<LessonPlan> {
  try {
    const res = await fetch('/api/gemini/lesson-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return {
      ...data,
      id: 'lp-' + Date.now(),
      createdAt: 'Vừa tạo xong',
      appliedCount: 0,
    };
  } catch (error) {
    console.warn('API error, falling back to client-side domain generation', error);
    const isCorner = params.lessonType === 'HOAT_DONG_GOC' || (params.activityName && params.activityName.toLowerCase().includes('góc'));

    if (isCorner) {
      return {
        id: 'lp-' + Date.now(),
        title: 'GIÁO ÁN HOẠT ĐỘNG GÓC',
        lessonType: 'HOAT_DONG_GOC',
        activityName: params.activityName || 'Hoạt động góc',
        theme: params.theme || 'Thế giới thực vật',
        topic: params.topic || 'Bé vui đón Tết',
        ageGroup: params.ageGroup,
        domain: params.domain || 'Phát triển nhận thức & Kỹ năng xã hội',
        duration: params.duration,
        teacherName: params.teacherName || 'Cô giáo Mầm non',
        schoolName: params.schoolName || 'Trường Mầm non Liên Minh A',
        childrenCount: params.childrenCount || 25,
        cornerProposals: [
          {
            cornerName: 'Góc đóng vai',
            activityContent: `Cửa hàng hoa quả bánh kẹo, gia đình sum họp, chế biến các món ngon phù hợp chủ đề ${params.topic}.`,
            materials: 'Gian hàng chợ, hoa quả nhựa, tạp dề, tiền giấy đồ chơi, khay đĩa.'
          },
          {
            cornerName: 'Góc xây dựng',
            activityContent: 'Xây dựng công viên hoa xuân, vườn hoa, trang trí lối đi đón Tết rực rỡ.',
            materials: 'Gạch nhựa đa sắc, hàng rào, thảm cỏ, cây hoa, xe chở vật liệu.'
          },
          {
            cornerName: 'Góc tạo hình',
            activityContent: 'Cắt dán hoa đào hoa mai, tô màu tranh ngày hội, nặn các loại quả ngày xuân.',
            materials: 'Giấy màu, kéo thủ công an toàn, hồ dán, đất nặn, bảng con.'
          },
          {
            cornerName: 'Góc học tập',
            activityContent: 'Phân loại các loại hoa quả theo màu sắc, đếm số lượng hoa quả theo độ tuổi.',
            materials: 'Thẻ số, lô tô hoa quả, tranh ghép hình 4-6 mảnh.'
          },
          {
            cornerName: 'Góc thư viện / sách',
            activityContent: 'Xem tranh ảnh, album ngày Tết, đọc thơ đồng dao về lễ hội.',
            materials: 'Sách tranh khổ lớn mầm non, tranh ảnh minh họa.'
          }
        ],
        objectives: {
          knowledge: [
            `Trẻ biết tên các góc chơi và đồ dùng đồ chơi ở từng góc theo chủ đề "${params.theme || 'Mầm non'} - ${params.topic}".`,
            'Trẻ hiểu và tái hiện lại hành động của các vai chơi (bác thợ xây, người bán hàng, người nội trợ).',
            'Trẻ biết sử dụng nguyên vật liệu mở để tạo ra sản phẩm và thỏa thuận vai chơi cùng bạn.'
          ],
          skills: [
            'Rèn luyện kỹ năng giao tiếp niềm nở, xưng hô lễ phép trong quá trình chơi.',
            'Phát triển sự khéo léo của bàn tay: xếp chồng khối xây dựng, cắt dán, nặn hoa quả.',
            'Rèn kỹ năng phối hợp nhóm và thói quen cất dọn đồ chơi đúng nơi quy định.'
          ],
          attitude: [
            'Trẻ chơi vui vẻ, đoàn kết, biết chia sẻ đồ chơi cùng bạn bè, không tranh giành.',
            'Có ý thức giữ gìn đồ dùng đồ chơi và môi trường lớp học sạch sẽ.'
          ]
        },
        preparation: {
          general: [
            'Bố trí không gian 5 góc chơi thoáng rộng, lối đi lại an toàn thuận tiện.',
            'Vệ sinh sạch sẽ đồ dùng đồ chơi trước giờ hoạt động.',
            'Nhạc nền không lời êm dịu lúc chơi và bài hát rộn ràng khi thu dọn đồ chơi.'
          ],
          teacher: [
            'Kế hoạch giáo án góc, sơ đồ phân bổ vị trí các góc.',
            'Tranh ảnh mẫu gợi mở công trình xây dựng và sản phẩm tạo hình.'
          ],
          children: [
            'Tâm thế vui tươi, sẵn sàng trải nghiệm cùng bạn bè.',
            'Ký hiệu nhận diện vai chơi cho từng nhóm.'
          ],
          byCorner: [
            {
              corner: 'Góc xây dựng',
              items: ['Gạch nhựa nhiều màu, khối gỗ, hàng rào, thảm cỏ, cây hoa Tết, xe rùa chở vật liệu.']
            },
            {
              corner: 'Góc đóng vai',
              items: ['Quầy kệ bán hàng, giỏ đựng, tiền giấy đồ chơi, các loại bánh trái ngày Tết.']
            },
            {
              corner: 'Góc tạo hình',
              items: ['Giấy màu đỏ/vàng, kéo an toàn, keo dán, sáp màu, đất nặn, khăn lau tay ẩm.']
            },
            {
              corner: 'Góc học tập',
              items: ['Bộ thẻ số, bộ lô tô hoa quả, tranh ghép mùa xuân 4-6 mảnh.']
            },
            {
              corner: 'Góc thư viện / sách',
              items: ['Sách tranh khổ lớn chủ đề Tết và Mùa xuân, kệ sách vừa tầm với của trẻ.']
            }
          ]
        },
        procedure: [
          {
            phase: '1. Thỏa thuận trước khi chơi (3–5 phút)',
            teacherActivity: 'Cô tập trung trẻ, hát bài hát về chủ đề. Trò chuyện tạo không khí vui tươi. Giới thiệu các góc chơi hôm nay. Cho trẻ thảo luận nhận vai chơi và bầu nhóm trưởng.',
            childrenActivity: 'Trẻ vui vẻ hưởng ứng, giơ tay nhận vai chơi mình yêu thích và cùng bạn về góc.',
            guidingQuestions: [
              'Hôm nay lớp chúng mình có những góc chơi nào?',
              'Con muốn về góc nào chơi? Khi chơi con cần làm gì?',
              'Khi chơi cùng bạn chúng mình phải nhớ điều gì?'
            ]
          },
          {
            phase: '2. Quá trình chơi - Trẻ về góc thực hiện (20–25 phút)',
            teacherActivity: 'Cô bao quát lớp, đến từng góc chơi khích lệ trẻ. Gợi mở cho các nhóm liên kết góc chơi (ví dụ: bác thợ xây qua mua nước giải khát). Hỗ trợ kịp thời trẻ nhút nhát.',
            childrenActivity: 'Trẻ say mê nhập vai: bác thợ xây xếp gạch, người bán hàng đon đả mời chào, nhóm tạo hình cặm cụi dán hoa...',
            guidingQuestions: [
              'Bác thợ xây đang xây công trình hoa viên đón Tết phải không?',
              'Hôm nay quán của bác có món bánh thơm ngon nào không?',
              'Bức tranh hoa mai của con sắp hoàn thành chưa?'
            ]
          },
          {
            phase: '3. Nhận xét sau khi chơi & Thu dọn (3–5 phút)',
            teacherActivity: 'Cô dùng hiệu lệnh xắc xô nhẹ nhàng báo hết giờ. Tập trung trẻ đến góc xây dựng trọng tâm hôm nay để chiêm ngưỡng. Khen ngợi tinh thần đoàn kết và hướng dẫn trẻ dọn đồ chơi.',
            childrenActivity: 'Trẻ cùng cô tham quan công trình, vỗ tay tuyên dương bạn và tự giác cất dọn đồ chơi gọn gàng.',
            guidingQuestions: [
              'Các con thấy công trình của góc xây dựng hôm nay đẹp không?',
              'Góc nào chơi ngoan và cất dọn nhanh nhất nào?'
            ]
          }
        ],
        englishIntegration: {
          vocabulary: [
            { word: 'Corner', ipa: '/ˈkɔːrnər/', meaning: 'Góc chơi' },
            { word: 'Play', ipa: '/pleɪ/', meaning: 'Chơi vui vẻ' },
            { word: 'Share', ipa: '/ʃer/', meaning: 'Chia sẻ cùng bạn' },
            { word: 'Flower', ipa: '/ˈflaʊər/', meaning: 'Bông hoa tươi' }
          ],
          classroomEnglish: [
            { en: 'Welcome to my shop!', vi: 'Chào mừng bạn đến với cửa hàng của tôi!' },
            { en: 'Let us share toys!', vi: 'Chúng mình cùng chia sẻ đồ chơi nhé!' },
            { en: 'Clean up time!', vi: 'Đến giờ thu dọn đồ chơi rồi!' }
          ],
          miniGame: 'Trò chơi phản xạ "Magic Corner" - Nhận diện góc chơi bằng tiếng Anh'
        },
        adaptation: 'Dành cho trẻ cần hỗ trợ: Chuẩn bị học liệu kích thước lớn, bạn trưởng góc kèm cặp và cô thường xuyên khen ngợi khích lệ.',
        aiNotice: 'Nội dung được AI hỗ trợ tạo. Giáo viên cần kiểm tra và điều chỉnh trước khi sử dụng với trẻ.',
        createdAt: 'Vừa tạo xong',
        appliedCount: 0
      };
    }

    // Instant fallback for standard
    return {
      id: 'lp-' + Date.now(),
      title: `GIÁO ÁN: ${(params.activityName || 'HOẠT ĐỘNG').toUpperCase()} - ${params.topic.toUpperCase()}`,
      lessonType: params.lessonType || 'HOAT_DONG_HOC',
      activityName: params.activityName || 'Hoạt động học',
      theme: params.theme || 'Thế giới quanh bé',
      topic: params.topic,
      ageGroup: params.ageGroup,
      domain: params.domain || 'Phát triển nhận thức',
      duration: params.duration,
      teacherName: params.teacherName || 'Cô giáo Mầm non',
      schoolName: params.schoolName || 'Trường Mầm non Liên Minh A',
      childrenCount: params.childrenCount || 20,
      objectives: {
        knowledge: [
          `Trẻ nhận biết tên gọi, màu sắc và đặc điểm chính của ${params.topic}.`,
          'Trẻ hiểu được lợi ích và ý nghĩa gần gũi trong đời sống hàng ngày.',
        ],
        skills: [
          'Rèn luyện kỹ năng quan sát trực quan, phối hợp đa giác quan.',
          'Phát triển khả năng biểu đạt ngôn ngữ mạch lạc, nói trọn câu.',
        ],
        attitude: [
          'Trẻ tích cực, vui vẻ tham gia cùng cô và các bạn.',
          'Hình thành thói quen giữ gìn vệ sinh và biết chia sẻ đồ chơi.',
        ],
      },
      preparation: {
        teacher: [
          `Mẫu vật thật hoặc học liệu trực quan về ${params.topic}.`,
          'Khay đĩa, dụng cụ hỗ trợ quan sát an toàn cho trẻ mầm non.',
          'Nhạc nền nhẹ nhàng, video bài hát sinh động.',
        ],
        children: [
          'Tâm thế hào hứng, sẵn sàng tham gia hoạt động.',
          'Chỗ ngồi thoáng mát, bố trí hình vòng cung/nhóm nhỏ.',
        ],
      },
      procedure: [
        {
          phase: '1. Ổn định - Gây hứng thú (3–5 phút)',
          teacherActivity: `Cô mang chiếc hộp thần kỳ xuất hiện, tạo tình huống bí mật để kích thích trí tò mò của trẻ về ${params.topic}.`,
          childrenActivity: 'Trẻ hào hứng vây quanh, đoán đồ vật qua tiếng động và câu đố vui.',
          guidingQuestions: [
            'Các con thử đoán xem trong chiếc hộp xinh xắn này có gì nào?',
            'Khi lắc nhẹ, con nghe thấy âm thanh gì?',
          ],
        },
        {
          phase: '2. Nội dung trọng tâm - Khám phá trải nghiệm (15–18 phút)',
          teacherActivity: `Cô hướng dẫn từng nhóm trẻ quan sát trực tiếp, sờ bề mặt, ngửi mùi hương và cùng thảo luận đặc điểm của ${params.topic}.`,
          childrenActivity: 'Trẻ dùng mắt ngắm nhìn, dùng tay cảm nhận và hào hứng phát biểu cảm nghĩ.',
          guidingQuestions: [
            'Con thấy màu sắc của vật này ra sao?',
            'Sờ vào thấy bề mặt nhẵn bóng hay ráp sần?',
            'Chúng mình có thể làm gì cùng với vật phẩm này?',
          ],
        },
        {
          phase: '3. Trò chơi củng cố: Bé thông minh nhanh nhẹn (5 phút)',
          teacherActivity: `Cô hướng dẫn luật chơi vận động nhẹ nhàng: phân loại thẻ hình ${params.topic} vào đúng giỏ màu theo tiếng nhạc.`,
          childrenActivity: 'Trẻ tích cực vận động, phối hợp nhịp nhàng cùng đồng đội.',
          guidingQuestions: [
            'Bé nào tìm được nhanh và đúng nhất nào?',
          ],
        },
        {
          phase: '4. Kết thúc & Giáo dục hành vi (2 phút)',
          teacherActivity: 'Cô khen ngợi, tuyên dương tinh thần học tập của cả lớp và dặn dò nhẹ nhàng.',
          childrenActivity: 'Trẻ cùng cô thu dọn đồ dùng học liệu ngăn nắp.',
          guidingQuestions: [
            'Hôm nay chúng mình cảm thấy vui nhất ở phần nào?',
          ],
        },
      ],
      englishIntegration: params.withEnglish
        ? {
            vocabulary: [
              { word: 'Orange', ipa: '/ˈɒrɪndʒ/', meaning: 'Quả cam' },
              { word: 'Round', ipa: '/raʊnd/', meaning: 'Hình tròn' },
              { word: 'Sweet', ipa: '/swiːt/', meaning: 'Ngọt' },
            ],
            classroomEnglish: [
              { en: 'What is this?', vi: 'Đây là gì nào?' },
              { en: 'Look closely!', vi: 'Nhìn kỹ nhé các bé!' },
              { en: 'Well done!', vi: 'Bé giỏi lắm!' },
            ],
            miniGame: 'Trò chơi phản xạ: "Touch the Color" (Chạm vào màu sắc tương ứng)',
          }
        : undefined,
      adaptation: params.specialNeeds || 'Tăng cường hình ảnh kích thước lớn và hỗ trợ cầm tay chỉ việc cho trẻ cần thêm thời gian.',
      aiNotice: 'Nội dung được AI hỗ trợ tạo. Giáo viên cần kiểm tra và điều chỉnh trước khi sử dụng với trẻ.',
      createdAt: 'Vừa tạo xong',
      appliedCount: 0,
    };
  }
}

export async function generateEnglishBuddy(topic: string, ageGroup: string) {
  try {
    const res = await fetch('/api/gemini/english-buddy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, ageGroup }),
    });
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch (error) {
    console.warn('English Buddy fallback triggered', error);
    return {
      topic,
      ageGroup,
      vocabulary: [
        { word: 'Orange', ipa: '/ˈɒr.ɪndʒ/', meaning: 'Quả cam', emoji: '🍊', usage: 'Giơ quả cam: "Look! An orange!"' },
        { word: 'Round', ipa: '/raʊnd/', meaning: 'Tròn xoe', emoji: '⚪', usage: 'Hai tay vẽ vòng tròn: "Big round shape!"' },
        { word: 'Sweet', ipa: '/swiːt/', meaning: 'Vị ngọt', emoji: '😋', usage: 'Xoa bụng vui vẻ: "Mmm, so sweet!"' },
        { word: 'Juice', ipa: '/dʒuːs/', meaning: 'Nước ép', emoji: '🥤', usage: 'Uống từng ngụm: "Orange juice is yummy!"' },
      ],
      classroomEnglish: [
        { phrase: 'What is this?', meaning: 'Cái gì đây nhỉ các bé?', bodyLanguage: 'Mắt mở to tò mò, tay chỉ vào vật phẩm' },
        { phrase: 'Touch it, please!', meaning: 'Con hãy sờ thử nhé!', bodyLanguage: 'Đưa quả cam lại gần tay bé nhẹ nhàng' },
        { phrase: 'Great job!', meaning: 'Bé làm tuyệt lắm!', bodyLanguage: 'Giơ 2 ngón tay cái và đập tay nhẹ với bé' },
        { phrase: 'Clean hands, please!', meaning: 'Chúng mình lau sạch tay nào!', bodyLanguage: 'Động tác xoa hai bàn tay vào nhau' },
      ],
      miniGame: {
        title: 'Pass the Magic Orange (Chuyền quả cam vui nhộn)',
        materials: '1 quả cam thật hoặc mô hình, bài nhạc thiếu nhi sôi động',
        howToPlay: 'Các bé ngồi thành vòng tròn chuyền quả cam theo điệu nhạc. Khi nhạc dừng, bé nào đang cầm quả cam sẽ cùng cả lớp hô to: "Orange! Sweet Orange!" và nhận sticker hoa bé ngoan!',
      },
      chant: {
        title: 'Orange Chant (Bài đồng dao quả cam)',
        lines: [
          'Orange, orange, round and bright, 🍊',
          'Smell so sweet and taste so right! 😋',
          'Peel it, eat it, share with friend, 🤲',
          'Happy smiles that never end! ✨',
        ],
        action: 'Vỗ tay theo nhịp 2/4, lắc lư vai nhẹ nhàng',
      },
      routine: [
        { step: '1. Hello Warm-up', time: '2 phút', description: 'Hát bài "Hello, hello, how are you today?"' },
        { step: '2. Magic Discovery', time: '3 phút', description: 'Khám phá từ vựng qua vật thật và biểu cảm' },
        { step: '3. Mini Play Time', time: '4 phút', description: 'Chơi trò chuyền quả cam theo nhịp điệu' },
        { step: '4. Goodbye Smile', time: '1 phút', description: 'Cùng vẫy tay hát "See you soon!"' },
      ],
    };
  }
}

export async function generateTeachingPack(topic: string, ageGroup: string, duration: string): Promise<TeachingPack> {
  try {
    const res = await fetch('/api/gemini/teaching-pack', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, ageGroup, duration }),
    });
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    return {
      ...data,
      id: 'pack-' + Date.now(),
    };
  } catch (error) {
    console.warn('Teaching pack fallback', error);
    return {
      id: 'pack-' + Date.now(),
      packTitle: `Trọn Gói Hoạt Động: ${topic}`,
      ageGroup,
      duration,
      planOverview: `Hoạt động toàn diện giúp trẻ ${ageGroup} trải nghiệm chủ đề ${topic} qua thơ ca, flashcards trực quan, trò chơi tương tác và hoạt động gia đình 10 phút.`,
      storyOrPoem: {
        type: 'Thơ mầm non',
        title: `Bài Thơ: Khám Phá ${topic}`,
        content: [
          `Bé yêu tìm hiểu ${topic}, 🌸`,
          'Mắt nhìn chăm chú, tay ngoan sờ đều.',
          'Cùng cô, cùng bạn sớm chiều,',
          'Bao điều kỳ diệu bé yêu thêm nhiều! ✨',
          'Học xong nhớ rửa tay ngoan,',
          'Bé là bông cúc ngập tràn niềm vui! 🌼',
        ],
      },
      flashcards: [
        { id: 1, title: 'Nhận biết màu sắc & hình khối', caption: 'Hình ảnh sắc nét, rõ ràng cho mắt trẻ', tag: 'Nhận thức' },
        { id: 2, title: 'Đặc điểm đặc trưng', caption: 'Bé sờ và gọi tên các bộ phận', tag: 'Khám phá' },
        { id: 3, title: 'Tác dụng & Lợi ích', caption: 'Gần gũi với thói quen sinh hoạt của trẻ', tag: 'Dinh dưỡng' },
        { id: 4, title: 'Bé cùng bạn chia sẻ', caption: 'Học cách yêu thương và giúp đỡ bạn', tag: 'Cảm xúc' },
      ],
      quiz: [
        {
          question: `Khi tham gia hoạt động tìm hiểu về ${topic}, các con cần làm gì?`,
          options: ['Chăm chú quan sát và lắng nghe cô', 'Chạy nhảy xô đẩy bạn', 'Nói chuyện to tiếng'],
          correctIndex: 0,
          explanation: 'Chính xác! Bé ngoan luôn chăm chú quan sát và biết chia sẻ cùng bạn!',
        },
        {
          question: 'Sau khi cùng cô khám phá xong, chúng mình sẽ làm gì?',
          options: ['Vứt đồ dùng bừa bãi', 'Cùng cô thu dọn và rửa tay sạch sẽ', 'Bỏ chạy ra sân chơi'],
          correctIndex: 1,
          explanation: 'Rất tuyệt vời! Bé ngoan luôn biết cất dọn đồ chơi và giữ bàn tay thơm tho!',
        },
      ],
      game: {
        title: 'Trò chơi: "Vòng tròn vui nhộn"',
        description: 'Các bé cùng nắm tay thành vòng tròn, vừa đi vừa hát theo nhịp điệu. Khi cô hô hiệu lệnh tên học liệu, bé nhanh chóng tạo dáng mô phỏng thật đáng yêu.',
      },
      englishMini: {
        words: [
          { en: 'Happy', vi: 'Vui vẻ', ipa: '/ˈhæp.i/' },
          { en: 'Friend', vi: 'Bạn bè', ipa: '/frend/' },
          { en: 'Share', vi: 'Chia sẻ', ipa: '/ʃer/' },
        ],
        sentences: [
          { en: 'Let’s play together!', vi: 'Chúng mình cùng chơi nào!' },
          { en: 'You are awesome!', vi: 'Bé tuyệt vời quá!' },
        ],
      },
      familyActivity: {
        title: 'Cùng con 10 phút tối nay: "Bé kể chuyện cho ba mẹ nghe"',
        steps: [
          'Ba mẹ ngồi cạnh lắng nghe bé kể lại hoạt động thú vị ở trường hôm nay.',
          'Cùng con xem tranh và đặt câu hỏi động viên bé biểu đạt cảm xúc.',
        ],
      },
    };
  }
}

export async function askVideoMentor(question: string, videoTitle: string, transcript: string) {
  try {
    const res = await fetch('/api/gemini/video-rag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, videoTitle, transcript }),
    });
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    return data.answer;
  } catch (error) {
    console.warn('Video RAG fallback', error);
    return `Chào cô ạ! 🌸 Dựa theo bài học "${videoTitle}":

📍 **Nguồn tham khảo:** Đoạn **01:15 – 03:20**
Để tạo nhân vật nhất quán xuyên suốt các trang tranh mầm non:
1. **Cố định hạt giống nhận diện:** Luôn viết tên nhân vật (ví dụ bạn Mai) kèm 2 phụ kiện không đổi (mũ len vàng, yếm xanh bạc hà).
2. **Cố định phong cách:** Giữ cụm từ *"3D clay style, soft warm pastel, cute preschool character"*.
3. **Thay đổi hành động ở đuôi prompt:** Giữ nguyên nhân vật, chỉ đổi biểu cảm (cười vui, ngạc nhiên) và hành động (đang bóc vỏ quả cam, đang chuyền đồ chơi cho bạn).

Cô hãy thử ngay để tạo bộ truyện tranh sinh động cho lớp mình nhé! ✨`;
  }
}

export async function chatWithMamAi(message: string, history: Array<{ role: string; content: string }> = []) {
  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    return data.reply;
  } catch (error) {
    console.warn('Chatbot fallback', error);
    return `Chào cô giáo thân yêu! 🌱 Mầm AI rất vui được hỗ trợ cô.

Về nội dung "${message}":
- Cô có thể mở mục **Soạn giáo án AI** để tạo hoạt động chuẩn 5 bước chỉ trong 30 giây.
- Sử dụng **English Buddy** để có ngay từ vựng và câu khẩu lệnh lớp học thân thiện.
- Mầm AI luôn đồng hành giúp cô tiết kiệm thời gian chuẩn bị để dành nhiều nụ cười hơn cho các bé yêu! 💖`;
  }
}
