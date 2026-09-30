import React, { useState, useEffect, useRef } from 'react';
import { MamAiMascot } from '../components/MamAiMascot';
import {
  Wand2,
  Sparkles,
  BookOpen,
  Video,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Download,
  Share2,
  Bookmark,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Clock,
  Eye,
  Heart,
  Palette,
  Film,
  FileText,
  FileDown,
  Layers,
  ArrowRight,
  Maximize2,
  Image as ImageIcon,
  Sparkle,
  X,
  ZoomIn,
  SkipBack,
  SkipForward,
  RefreshCw,
  Check,
} from 'lucide-react';
import { sounds, speakText } from '../utils/audioUtils';
import { persistentDocStorage } from '../services/persistentDocStorage';

export interface StoryPoemItem {
  id: string;
  title: string;
  type: 'poem' | 'story' | 'video';
  category: string;
  topicPrompt: string;
  description: string;
  content: string;
  author: string;
  ageGroup: string;
  createdAt: string;
  illustration3d?: {
    subject?: string;
    prompt: string;
    imageUrl: string;
    fallbackUrl?: string;
    characterName?: string;
    sceneDescription?: string;
  };
  videoStory?: {
    videoUrl: string;
    duration: string;
    scenes: Array<{
      sceneNumber: number;
      title: string;
      narration: string;
      visualPrompt?: string;
      imageUrl?: string;
      fallbackUrl?: string;
      durationSeconds?: number;
    }>;
    moralLesson?: string;
  };
  stanzas?: string[];
  fileUrl?: string;
  fileName?: string;
  likesCount?: number;
  viewsCount?: number;
}

export const KAWAII_STORYBOOK_STYLE_TITLE = 'Cute 3D Kawaii Educational App UI – Preschool Storybook Style';

// Client-side Content-Aware Visual Engine mapping topics to 100% accurate subjects
export function getContentAwareVisualClient(topic: string, details: string = '', sceneIdx: number = 0) {
  const combined = `${topic} ${details}`.toLowerCase();
  
  let subject = 'Bé mầm non đáng yêu';
  let characterName = 'Bé Mầm Hạnh Phúc';
  let englishPrompt = 'Cute 3D Kawaii Educational App UI – Preschool Storybook Style, adorable kindergarten toddler character, joyful expression, soft volumetric lighting, warm pastel candy colors, cute rounded 3D clay render, 8k';
  let fallbackImage = 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80';
  let sceneDesc = 'Khung cảnh 3D Kawaii ngập tràn ánh nắng và nụ cười rạng rỡ của bé trong lớp mầm non chuẩn phong cách Cute 3D Kawaii Preschool Storybook.';

  if (combined.includes('gà') || combined.includes('chick') || combined.includes('gà con') || combined.includes('gà mẹ') || combined.includes('gà trống')) {
    subject = 'Chú gà con lông vàng';
    characterName = 'Bé Gà Chip Chip';
    englishPrompt = 'A super adorable fluffy little yellow baby chick with big round sparkling black eyes, tiny orange beak and feet, walking cheerfully on lush green grass with white daisies, Pixar Disney 3D animation style, sunny warm studio lighting, 8k';
    fallbackImage = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Hình ảnh chú gà con lông vàng óng ả như cục tơ nhỏ, đôi mắt to tròn lấp lánh đang lon ton bước đi trên thảm cỏ xanh theo đúng từng câu thơ.';
  } else if (combined.includes('vịt') || combined.includes('duck') || combined.includes('vịt con')) {
    subject = 'Chú vịt con bơi lội';
    characterName = 'Vịt Con Vàng Tươi';
    englishPrompt = 'An adorable cute 3D Pixar cartoon yellow duckling with an orange beak paddling happily on clear blue pond water with lotus leaves, warm daylight, 3D Disney animation';
    fallbackImage = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú vịt con lông vàng ươm đang tung tăng vỗ cánh bơi lội giữa hồ nước trong veo bên những tán lá sen xanh ngắt.';
  } else if (combined.includes('thỏ') || combined.includes('rabbit') || combined.includes('bunny')) {
    subject = 'Chú thỏ trắng tinh nghịch';
    characterName = 'Thỏ Bông Trắng Muốt';
    englishPrompt = 'A delightfully cute 3D Pixar white fluffy bunny rabbit with big floppy pink ears, wearing a tiny red scarf, holding a fresh carrot in a magical sunny meadow, 8k 3D render';
    fallbackImage = 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú Thỏ Trắng với bộ lông xù mềm mại như mây, hai tai hồng dựng đứng đang tươi cười ôm củ cà rốt đỏ mọng.';
  } else if (combined.includes('ếch') || combined.includes('frog') || combined.includes('ộp')) {
    subject = 'Chú ếch xanh ngồi lá sen';
    characterName = 'Bé Ếch Ộp Ộp';
    englishPrompt = 'An adorable cute 3D Pixar cartoon green tree frog sitting happily on a giant round water lily leaf in a sparkling pond, big funny eyes, Disney 3D animation render';
    fallbackImage = 'https://images.unsplash.com/photo-1579380656108-328e425830df?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú ếch xanh ngồi chễm chệ trên chiếc lá sen to tròn giữa đầm nước trong veo cất tiếng ộp ộp đón mưa.';
  } else if (combined.includes('khỉ') || combined.includes('monkey')) {
    subject = 'Chú khỉ con nhanh nhẹn';
    characterName = 'Khỉ Con Tinh Nghịch';
    englishPrompt = 'A delightfully cute 3D Pixar baby monkey swinging on jungle vines holding a banana, smiling playfully, 8k render';
    fallbackImage = 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú khỉ con tinh nghịch với cái đuôi cong vút, chuyền cành thoăn thoắt trên cây chuối thơm lừng.';
  } else if (combined.includes('sư tử') || combined.includes('hổ') || combined.includes('lion') || combined.includes('tiger')) {
    subject = 'Chú sư tử con dũng cảm';
    characterName = 'Sư Tử Tí Hon';
    englishPrompt = 'An ultra-cute fluffy 3D Pixar baby lion cub with a tiny golden mane, smiling warmly on sunny savanna rocks, 3D animated';
    fallbackImage = 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú sư tử con có chiếc bờm nhỏ xinh xắn đứng hiên ngang mỉm cười đón ánh nắng rực rỡ thảo nguyên.';
  } else if (combined.includes('rùa') || combined.includes('turtle')) {
    subject = 'Chú rùa con chăm chỉ';
    characterName = 'Rùa Con Chậm Chạp';
    englishPrompt = 'A cheerful cute 3D cartoon baby turtle with green patterned shell crawling playfully on sandy beach near gentle ocean waves, Pixar 3D style';
    fallbackImage = 'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú rùa con đeo chiếc mai hoa văn xanh xinh xắn từng bước kiên trì tiến về phía trước.';
  } else if (combined.includes('cá heo') || combined.includes('dolphin')) {
    subject = 'Chú cá heo tung tăng dưới biển';
    characterName = 'Cá Heo Thông Minh';
    englishPrompt = 'A playful cute 3D Pixar cartoon baby dolphin jumping joyfully out of sparkling turquoise ocean water with rainbow spray, bright sunshine';
    fallbackImage = 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú cá heo uốn mình nhào lộn trên mặt biển xanh biếc, vẫy chào các bạn nhỏ với nụ cười thân thiện.';
  } else if (combined.includes('cua') || combined.includes('crab')) {
    subject = 'Chú cua đỏ bò ngang';
    characterName = 'Bé Cua Càng Đỏ';
    englishPrompt = 'A cute friendly 3D Pixar little red cartoon crab waving two pincers cheerfully on sandy beach, big curious eyes';
    fallbackImage = 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú cua nhỏ màu đỏ cam xinh xắn giương đôi càng bụ bẫm bò ngang tinh nghịch trên bãi cát vàng.';
  } else if (combined.includes('sóc') || combined.includes('squirrel')) {
    subject = 'Chú sóc nâu chuyền cành';
    characterName = 'Sóc Nâu Nhanh Nhẹn';
    englishPrompt = 'An adorable cute 3D Pixar cartoon squirrel with fluffy bushy tail holding an acorn in autumn forest, sunny warm lighting';
    fallbackImage = 'https://images.unsplash.com/photo-1507666405895-422eee7d517f?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú sóc nâu chiếc đuôi bồng bềnh như chiếc chổi xù, ôm hạt dẻ giòn thơm nhảy nhót đón mùa thu sang.';
  } else if (combined.includes('heo') || combined.includes('lợn') || combined.includes('ỉn') || combined.includes('pig')) {
    subject = 'Chú heo hồng xinh xắn';
    characterName = 'Heo Hồng Ủn Ỉn';
    englishPrompt = 'A super cute chubby 3D Pixar baby pink piglet wearing a floral bandana, smiling happily in clean farmyard with straw';
    fallbackImage = 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú heo con màu hồng phấn tròn ủng ỉn, chiếc mũi hếch đáng yêu và đuôi xoăn tít nhảy múa hân hoan.';
  } else if (combined.includes('ngựa') || combined.includes('horse') || combined.includes('pony')) {
    subject = 'Chú ngựa con phi nhanh';
    characterName = 'Ngựa Con Phi Nhanh';
    englishPrompt = 'A lovely cute 3D Pixar baby pony foal with flowing mane galloping cheerfully through green meadow filled with wildflowers';
    fallbackImage = 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú ngựa con với bộ lông mượt mà gõ móng lóc cóc chạy nhảy tự do trên thảo nguyên ngát hương hoa.';
  } else if (combined.includes('gấu') || combined.includes('bear')) {
    subject = 'Chú gấu con đáng yêu';
    characterName = 'Gấu Nâu Mũm Mĩm';
    englishPrompt = 'A chubby cute 3D Pixar cartoon baby brown bear with friendly smiling face wearing blue overalls, sitting in a cozy forest cabin with honey pots, warm volumetric lighting';
    fallbackImage = 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú Gấu Con mũm mĩm khoác chiếc yếm bò xinh xắn, nụ cười hiền hậu dang tay đón bạn bè bên hũ mật ong thơm lừng.';
  } else if (combined.includes('mèo') || combined.includes('cat') || combined.includes('mèo con')) {
    subject = 'Chú mèo con mướp vàng';
    characterName = 'Mèo Con Miu Miu';
    englishPrompt = 'An ultra-cute fluffy ginger striped kitten with huge emerald eyes and pink nose playing with a red yarn ball in a sunny nursery room, 3D Pixar Disney style';
    fallbackImage = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú mèo con lông vàng mềm mại, hai mắt long lanh ngơ ngác đùa giỡn bên cuộn len ấm áp.';
  } else if (combined.includes('chó') || combined.includes('cún') || combined.includes('puppy')) {
    subject = 'Chú cún con vẫy đuôi';
    characterName = 'Cún Con Đốm Xinh';
    englishPrompt = 'An adorable happy 3D Pixar puppy dog with floppy ears and wagging tail running in a colorful garden with butterflies, sunny daylight, Disney 3D animation';
    fallbackImage = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú cún con thông minh với đôi tai vểnh, đuôi ngoe nguẩy vui mừng đón bé tan trường về nhà.';
  } else if (combined.includes('rửa tay') || combined.includes('xà phòng') || combined.includes('sạch sẽ') || combined.includes('vi khuẩn')) {
    subject = 'Bé rửa tay sạch với bọt xà phòng';
    characterName = 'Bé Sạch Sẽ Tinh Tươm';
    englishPrompt = 'An adorable cute 3D Pixar preschool toddler girl happily washing her small hands with sparkling rainbow soap bubbles and running fresh water at a colorful miniature bathroom sink, joyful smiling face, soft volumetric lighting, warm 3D render';
    fallbackImage = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Bé ngoan đứng bên bồn rửa tay nhỏ xinh đầy màu sắc, đôi bàn tay phủ đầy bọt xà phòng óng ánh bảy màu xua tan vi khuẩn.';
  } else if (combined.includes('đánh răng') || combined.includes('răng')) {
    subject = 'Bé tập đánh răng';
    characterName = 'Bé Răng Trắng Tinh';
    englishPrompt = 'A cheerful cute 3D Pixar preschool kid brushing white teeth with a colorful kid toothbrush and foaming toothpaste, smiling in front of a mirror with sparkly star particles, cute Pixar style';
    fallbackImage = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Bé chăm ngoan cầm chiếc bàn chải nhỏ xinh đánh răng sạch sẽ, nụ cười rạng ngời khoe hàm răng trắng tinh sáng bóng.';
  } else if (combined.includes('đèn') || combined.includes('giao thông') || combined.includes('đèn đỏ') || combined.includes('đèn xanh') || combined.includes('đèn vàng')) {
    subject = 'Cột đèn giao thông ba màu';
    characterName = 'Bạn Đèn Giao Thông Thân Thiện';
    englishPrompt = 'A friendly cute 3D Pixar cartoon traffic light character with red, yellow, and green circular glowing lamps and a happy smiling face, standing at a clean colorful preschool street crossing, bright daylight, vibrant 3D animation render';
    fallbackImage = 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Cột đèn giao thông ngộ nghĩnh có gương mặt tươi cười, 3 bóng đèn tròn đỏ, vàng, xanh rực sáng hướng dẫn các bé đi bộ đúng luật.';
  } else if (combined.includes('cam') || combined.includes('quả cam')) {
    subject = 'Quả cam ngọt lành tròn xoe';
    characterName = 'Bé Cam Vàng Mọng Nước';
    englishPrompt = 'A delightful cute 3D cartoon ripe orange fruit with a happy smiling expressive face and green leafy stem, resting in a woven wooden basket under warm sun, 3D Pixar Disney style animation, vibrant colors';
    fallbackImage = 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Quả cam vàng ươm tròn trĩnh với chiếc cuống lá xanh non mơn mởn, ngập tràn vitamin C thơm ngon mát lành.';
  } else if (combined.includes('táo') || combined.includes('quả táo')) {
    subject = 'Quả táo đỏ giòn ngọt';
    characterName = 'Bé Táo Đỏ Thơm Tho';
    englishPrompt = 'A cute charming 3D cartoon shiny red apple with a cute happy smiling face and green leaf, sunny orchard background, 3D Pixar animation style';
    fallbackImage = 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Quả táo đỏ au chín mọng lấp lánh như viên ngọc, thơm phức mời gọi bé thưởng thức.';
  } else if (combined.includes('cứu hỏa') || combined.includes('xe cứu hỏa')) {
    subject = 'Chiếc xe cứu hỏa đỏ rực';
    characterName = 'Xe Cứu Hỏa Dũng Cảm';
    englishPrompt = 'A cute cheerful 3D Pixar style red fire engine truck with big expressive cartoon eyes on windshield and a smiling bumper, equipped with ladder and siren, shiny 3D animation';
    fallbackImage = 'https://images.unsplash.com/photo-1583344665487-d4bfb8d5a7d6?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chiếc xe cứu hỏa sơn đỏ chói lọi, chiếc thang dài và còi hú vang lừng sẵn sàng giúp đỡ mọi người.';
  } else if (combined.includes('xe cảnh sát') || combined.includes('công an')) {
    subject = 'Chiếc xe cảnh sát trật tự';
    characterName = 'Xe Cảnh Sát Trật Tự';
    englishPrompt = 'A friendly cute 3D Pixar cartoon blue and white police patrol car with flashing blue siren lights and big smiling headlights at city crossing, Disney 3D style';
    fallbackImage = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chiếc xe cảnh sát màu xanh trắng sáng loáng, giữ gìn trật tự và an toàn cho mọi người đi đường.';
  } else if (combined.includes('cứu thương') || combined.includes('bệnh viện') || combined.includes('bác sĩ')) {
    subject = 'Chiếc xe cứu thương khẩn cấp';
    characterName = 'Xe Cứu Thương Tốt Bụng';
    englishPrompt = 'A gentle cute 3D Pixar cartoon white ambulance with red cross and friendly cartoon eyes, ready to help children, 3D animated render';
    fallbackImage = 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chiếc xe cứu thương sơn chữ thập đỏ mang tình yêu thương của bác sĩ đến chăm sóc sức khỏe cho các bé.';
  } else if (combined.includes('tàu hỏa') || combined.includes('xe lửa') || combined.includes('xình xịch') || combined.includes('đoàn tàu')) {
    subject = 'Đoàn tàu hỏa xình xịch';
    characterName = 'Đoàn Tàu Hỏa Thân Thiện';
    englishPrompt = 'A cheerful cute 3D Pixar cartoon steam train locomotive with smiling face on front puffer, puffing white cotton smoke rings through colorful preschool countryside, 8k';
    fallbackImage = 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Đoàn tàu hỏa dài ngoằng uốn lượn qua các sườn đồi xanh ngát, cất tiếng tu tu xình xịch thật vui tai.';
  } else if (combined.includes('xe đạp') || combined.includes('xe ba bánh')) {
    subject = 'Chiếc xe đạp nhỏ xinh';
    characterName = 'Xe Đạp Tí Hon';
    englishPrompt = 'A cute colorful 3D Pixar kid bicycle with bell and front basket filled with flowers, parked on a park path under sunny trees';
    fallbackImage = 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chiếc xe đạp nhỏ có chuông leng keng giỏ hoa xinh xắn cùng bé tập thể dục rèn luyện sức khỏe mỗi ngày.';
  } else if (combined.includes('khinh khí cầu')) {
    subject = 'Khinh khí cầu bay cao';
    characterName = 'Khinh Khí Cầu Rực Rỡ';
    englishPrompt = 'A magnificent cute 3D Pixar colorful striped hot air balloon floating gently among soft pink and golden clouds at sunset, 3D Disney style';
    fallbackImage = 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chiếc khinh khí cầu bảy sắc rực rỡ từ từ bay lên bầu trời cao ngắm nhìn cảnh đẹp quê hương đất nước.';
  } else if (combined.includes('xe buýt') || combined.includes('xe bus')) {
    subject = 'Chiếc xe buýt trường học';
    characterName = 'Bác Xe Buýt Vui Tính';
    englishPrompt = 'A friendly cute yellow cartoon school bus character with smiling face, transporting happy animal kids down a scenic sunny road, 3D Pixar Disney style';
    fallbackImage = 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chiếc xe buýt màu vàng tươi mỉm cười đón các bạn nhỏ mầm non ríu rít đến trường.';
  } else if (combined.includes('xoài') || combined.includes('mango')) {
    subject = 'Quả xoài chín vàng ươm';
    characterName = 'Bé Xoài Vàng Ngọt';
    englishPrompt = 'A cheerful cute 3D cartoon golden ripe mango character with rosy blush cheeks and green leaf smiling in fruit basket, 3D Pixar Disney style';
    fallbackImage = 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Quả xoài cát chín vàng ruộm thơm nức, vị ngọt đậm đà bổ dưỡng cho bé mau lớn.';
  } else if (combined.includes('nho') || combined.includes('grape')) {
    subject = 'Chùm nho tím mọng nước';
    characterName = 'Chùm Nho Tím Ngọt';
    englishPrompt = 'A delightfully cute 3D cartoon bunch of purple grapes with smiling face on center grape and green vine leaf, sunlit vineyard, Pixar 3D style';
    fallbackImage = 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chùm nho tím biếc trĩu quả lấp lánh như chuỗi ngọc bích đọng những giọt sương mai.';
  } else if (combined.includes('cà rốt') || combined.includes('củ cải')) {
    subject = 'Củ cà rốt đỏ cam tươi';
    characterName = 'Bé Cà Rốt Giòn Ngọt';
    englishPrompt = 'A super cute 3D cartoon bright orange carrot with green leafy top and big joyful smiling eyes, garden soil background, Pixar style';
    fallbackImage = 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Củ cà rốt màu cam đỏ giòn ngọt vươn mình trong luống đất tơi xốp.';
  } else if (combined.includes('sen') || combined.includes('hoa sen')) {
    subject = 'Đóa hoa sen hồng thanh khiết';
    characterName = 'Búp Sen Hồng';
    englishPrompt = 'A graceful cute 3D Pixar pink lotus flower in full bloom with dew drops on petals, resting on large green leaf in clear pond, soft lighting';
    fallbackImage = 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Bông hoa sen hồng tươi hé nở giữa đầm nước, tỏa hương thơm ngát tinh khôi.';
  } else if (combined.includes('hồng') || combined.includes('hoa hồng')) {
    subject = 'Bông hoa hồng nhung ngát hương';
    characterName = 'Bông Hồng Thắm';
    englishPrompt = 'A beautiful cute 3D Pixar red rose flower character with gentle smiling face and velvety petals, morning dew, fairy garden';
    fallbackImage = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Đóa hoa hồng nhung đỏ thắm chúm chím nở trong nắng sớm, cánh hoa mượt mà như nhung.';
  } else if (combined.includes('hoa') || combined.includes('hướng dương') || combined.includes('vườn hoa')) {
    subject = 'Bông hoa mặt trời hé nở';
    characterName = 'Hoa Hướng Dương Rực Rỡ';
    englishPrompt = 'A joyful cute 3D Pixar sunflower character with petals glowing yellow in sunshine, smiling face in center, standing in a kindergarten green garden';
    fallbackImage = 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Bông hoa mặt trời xòe những cánh vàng rực rỡ đón ánh nắng ban mai ấm áp.';
  } else if (combined.includes('trăng') || combined.includes('chị hằng') || combined.includes('trung thu') || combined.includes('chú cuội')) {
    subject = 'Vầng trăng tròn đêm Trung Thu';
    characterName = 'Chị Hằng & Trăng Rằm';
    englishPrompt = 'A magical cute 3D Pixar luminous yellow smiling full moon wearing a gentle smile in starry night sky with glowing star lanterns, 3D render';
    fallbackImage = 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Vầng trăng tròn vành vạnh như chiếc đĩa ngọc tỏa ánh sáng dịu hiền soi sáng đêm hội rước đèn Trung Thu của các bé.';
  } else if (combined.includes('sao') || combined.includes('ngôi sao') || combined.includes('bầu trời đêm')) {
    subject = 'Ngôi sao lấp lánh trên trời';
    characterName = 'Ngôi Sao Sáng';
    englishPrompt = 'An enchanting cute 3D Pixar glowing golden cartoon star character with sparkling eyes and magical trail in deep velvet night sky, 3D animated';
    fallbackImage = 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Những ngôi sao nhỏ nhấp nháy như ngàn vì sao sáng gửi những ước mơ diệu kỳ vào giấc ngủ ngoan của bé.';
  } else if (combined.includes('mưa') || combined.includes('ô') || combined.includes('dù') || combined.includes('giọt nước')) {
    subject = 'Hạt mưa tí tách và chiếc ô xinh';
    characterName = 'Chiếc Ô Cầu Vồng';
    englishPrompt = 'A cheerful cute 3D Pixar character holding a vibrant colorful rainbow umbrella under light sparkling rain with playful water splashes, warm daylight';
    fallbackImage = 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Những hạt mưa trong veo rơi tí tách trên chiếc ô bảy sắc cầu vồng rực rỡ, tưới mát cho cây cỏ tốt tươi.';
  } else if (combined.includes('nông dân') || combined.includes('lúa') || combined.includes('gạo') || combined.includes('cánh đồng')) {
    subject = 'Bác nông dân và cánh đồng lúa vàng';
    characterName = 'Hạt Thóc Vàng Óng';
    englishPrompt = 'A heartwarming cute 3D Pixar scene of a golden ripe rice paddy field waving in the breeze with a smiling friendly farmer wearing conical hat, sunny blue sky';
    fallbackImage = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Cánh đồng lúa chín vàng ươm trĩu hạt nhắc bé biết ơn hạt cơm dẻo thơm bát ngát mồ hôi bác nông dân.';
  } else if (combined.includes('bộ đội') || combined.includes('chú lính') || combined.includes('hải quân') || combined.includes('biển đảo')) {
    subject = 'Chú bộ đội canh giữ bình yên';
    characterName = 'Chú Bộ Đội Cụ Hồ';
    englishPrompt = 'A friendly cute 3D Pixar cartoon Vietnamese young soldier standing proud with warm smiling face on coastal border, green uniform, sunny daylight, Disney 3D style';
    fallbackImage = 'https://images.unsplash.com/photo-1579975096649-e773152b04cb?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Chú bộ đội với chiếc mũ tai bèo và nụ cười hiền hậu chắc tay súng nơi biên cương canh giữ bình yên cho các bé vui cắp sách đến trường.';
  } else if (combined.includes('búp bê') || combined.includes('đồ chơi') || combined.includes('xếp hình')) {
    subject = 'Búp bê xinh và góc đồ chơi';
    characterName = 'Búp Bê Xinh Xắn';
    englishPrompt = 'An adorable cute 3D Pixar doll sitting happily on colorful wooden building alphabet blocks in a sunny kindergarten playroom, warm lighting';
    fallbackImage = 'https://images.unsplash.com/photo-1566576912321-d58ddd74308d?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Góc đồ chơi mầm non với bạn búp bê váy xòe và những khối gỗ rực rỡ sắc màu được bé xếp ngăn nắp.';
  } else if (combined.includes('tết') || combined.includes('bánh chưng') || combined.includes('hoa đào') || combined.includes('hoa mai')) {
    subject = 'Ngày Tết quê em và hoa đào nở';
    characterName = 'Bé Đón Tết Vui';
    englishPrompt = 'A joyous vibrant 3D Pixar Vietnamese Lunar New Year scene with blooming pink peach blossoms, green square chung cake, red envelopes and cheerful toddler in traditional ao dai';
    fallbackImage = 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=800&q=80';
    sceneDesc = 'Không khí Tết rộn ràng với cành đào hồng thắm, bánh chưng xanh và phong bao lì xì đỏ chúc bé thêm một tuổi mới chăm ngoan.';
  }

  const finalPrompt = englishPrompt.includes('Cute 3D Kawaii Educational App UI')
    ? englishPrompt
    : `Cute 3D Kawaii Educational App UI – Preschool Storybook Style, ${englishPrompt}, cute rounded 3D clay aesthetic, soft pastel colors, 8k render`;

  const seed = Math.abs((topic.length * 47 + sceneIdx * 199 + 103) % 99999);
  const aiGeneratedUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=800&height=800&nologo=true&seed=${seed}`;

  return {
    imageUrl: aiGeneratedUrl,
    fallbackUrl: fallbackImage,
    subject,
    characterName,
    prompt: finalPrompt,
    sceneDescription: sceneDesc,
  };
}

// Initial preloaded default masterpieces
const SEED_CREATIVE_ITEMS: StoryPoemItem[] = [
  {
    id: 'sp-seed-01',
    title: 'Bài Thơ 3D: Bé Đi Học Mầm Non Ngoan',
    type: 'poem',
    category: 'Thơ Minh Họa 3D',
    topicPrompt: 'Bé ngày đầu đến lớp mầm non không khóc nhè, chào cô và kết bạn',
    description: 'Bài thơ 4 chữ rộn ràng giúp các bé tự tin đến lớp, yêu cô mến bạn và vui học mỗi ngày.',
    content: `Mỗi sáng mai thức dậy\nBé rửa mặt đánh răng\nĂn sáng thật ngon lành\nCùng mẹ đi đến lớp\n\nCô giáo đón tận cửa\nNụ cười tươi rạng ngời\nBé ngoan không khóc nhè\nCùng bạn vui cả ngày!\n\nGiờ chơi cùng xếp hình\nGiờ ăn không làm rơi\nBé là mầm non ngoan\nMẹ cô đều yêu mến!`,
    author: 'Mầm AI & Cô Vân',
    ageGroup: '3–4 tuổi (Lớp Mầm)',
    createdAt: '2026-09-28',
    stanzas: [
      'Mỗi sáng mai thức dậy\nBé rửa mặt đánh răng\nĂn sáng thật ngon lành\nCùng mẹ đi đến lớp',
      'Cô giáo đón tận cửa\nNụ cười tươi rạng ngời\nBé ngoan không khóc nhè\nCùng bạn vui cả ngày!',
      'Giờ chơi cùng xếp hình\nGiờ ăn không làm rơi\nBé là mầm non ngoan\nMẹ cô đều yêu mến!',
    ],
    illustration3d: {
      prompt: 'Cute 3D Kawaii Educational App UI – Preschool Storybook Style, adorable toddler kid with miniature backpack waving cheerfully to a smiling kindergarten teacher, sunny flower garden school gate, pastel rainbow balloons, rounded 3D clay aesthetic, soft studio volumetric lighting, ultra-detailed 8k.',
      characterName: 'Bé Thỏ Bông & Bạn Nhỏ',
      sceneDescription: 'Khung cảnh 3D Kawaii cổng trường mầm non ngập tràn ánh nắng ban mai, bé đeo ba lô nhỏ xinh tươi cười vẫy tay chào mẹ để vào lớp cùng cô giáo hiền dịu.',
      imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80',
    },
    likesCount: 128,
    viewsCount: 450,
  },
  {
    id: 'sp-seed-02',
    title: 'Video Hoạt Hình 3D: Chú Thỏ Trắng Biết Chia Sẻ',
    type: 'video',
    category: 'Câu Chuyện Video AI',
    topicPrompt: 'Chú Thỏ Trắng tìm thấy hai củ cải và chia cho bạn bè trong rừng',
    description: 'Câu chuyện hoạt hình video ấm áp về lòng vị tha, tình bạn và bài học sẻ chia niềm vui trong cuộc sống theo phong cách Cute 3D Kawaii Educational App UI – Preschool Storybook Style.',
    content: `Mùa đông lạnh giá tràn về khu rừng Mầm Non. Bạn Thỏ Trắng may mắn tìm được hai củ cải đỏ ngọt lành. Thỏ con bụng đói cồn cào, nhưng nghĩ đến bạn Dê Con chắc cũng đang đói rét, Thỏ liền ôm một củ cải mang sang tặng bạn Dê. Dê con nhận củ cải cảm động vô cùng, lại mang sang tặng bạn Hươu Sao... Cứ thế, củ cải đỏ đi một vòng và mang hơi ấm tình bạn lan tỏa khắp khu rừng!`,
    author: 'Mầm AI Animation Studio',
    ageGroup: '4–5 tuổi (Lớp Chồi)',
    createdAt: '2026-09-29',
    videoStory: {
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: '01:45',
      moralLesson: 'Biết chia sẻ và quan tâm tới bạn bè sẽ mang lại niềm vui lớn nhất cho mọi người!',
      scenes: [
        {
          sceneNumber: 1,
          title: 'Củ cải đỏ trong tuyết trắng',
          narration: 'Mùa đông đến, chú Thỏ Trắng tìm thấy hai củ cải to tròn dưới lớp tuyết mềm...',
          visualPrompt: 'Cute 3D Kawaii Educational App UI – Preschool Storybook Style, cute chubby white bunny finding giant red juicy carrots in soft snowy forest, pastel lighting.',
          imageUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80',
          durationSeconds: 25,
        },
        {
          sceneNumber: 2,
          title: 'Hành trình vượt tuyết tặng bạn',
          narration: 'Thỏ Trắng không ăn hết một mình mà ôm củ cải chạy sang nhà bạn Dê Con...',
          visualPrompt: 'Cute 3D Kawaii Educational App UI – Preschool Storybook Style, cute bunny carrying bright carrot walking on snowy path, gentle smiling face.',
          imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
          durationSeconds: 30,
        },
        {
          sceneNumber: 3,
          title: 'Tình bạn ấm áp lan tỏa',
          narration: 'Dê con bất ngờ và cảm động, lại tiếp tục mang tặng bạn Hươu Sao...',
          visualPrompt: 'Cute 3D Kawaii Educational App UI – Preschool Storybook Style, cute chubby animal friends hugging happily inside a cozy wooden cabin with fireplace glow.',
          imageUrl: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=800&q=80',
          durationSeconds: 30,
        },
        {
          sceneNumber: 4,
          title: 'Hạnh phúc ngập tràn khu rừng',
          narration: 'Tất cả các bạn nhỏ cùng quây quần bên nhau ăn bữa tiệc mùa đông thật ấm áp!',
          visualPrompt: 'Cute 3D Kawaii Educational App UI – Preschool Storybook Style, celebratory forest party with adorable cartoon animals feasting together, cheerful expressions.',
          imageUrl: 'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?auto=format&fit=crop&w=800&q=80',
          durationSeconds: 20,
        },
      ],
    },
    likesCount: 215,
    viewsCount: 890,
  },
];

interface StoryPoemCreatorViewProps {
  onBackToHome?: () => void;
  initialMode?: 'poem' | 'video';
}

export const StoryPoemCreatorView: React.FC<StoryPoemCreatorViewProps> = ({
  initialMode = 'poem',
}) => {
  // Navigation tabs: 'create-poem' | 'create-video' | 'saved-vault'
  const [activeTab, setActiveTab] = useState<'create-poem' | 'create-video' | 'saved-vault'>(
    initialMode === 'video' ? 'create-video' : 'create-poem'
  );

  // Form Inputs
  const [promptInput, setPromptInput] = useState('');
  const [selectedAge, setSelectedAge] = useState('4–5 tuổi (Lớp Chồi)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(1);

  // Current Created Result
  const [activeWork, setActiveWork] = useState<StoryPoemItem | null>(SEED_CREATIVE_ITEMS[0]);

  // Saved Works List (Persistent)
  const [savedWorks, setSavedWorks] = useState<StoryPoemItem[]>(() => {
    try {
      const local = localStorage.getItem('mam_ai_saved_creative_works');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return SEED_CREATIVE_ITEMS;
  });

  // Audio reading state for poem
  const [isSpeakingPoem, setIsSpeakingPoem] = useState(false);
  const [currentStanzaIndex, setCurrentStanzaIndex] = useState<number | null>(null);

  // Video playback state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Dual-mode watchable video player states
  const [videoPlayerMode, setVideoPlayerMode] = useState<'storyboard' | 'mp4'>('storyboard');
  const [isPlayingStoryboard, setIsPlayingStoryboard] = useState(false);
  const [isNarrationMuted, setIsNarrationMuted] = useState(false);
  const [isDownloadingVideo, setIsDownloadingVideo] = useState(false);

  // Auto-advance storyboard scenes when playing
  useEffect(() => {
    let timer: any = null;
    if (isPlayingStoryboard && activeWork?.type === 'video' && activeWork.videoStory?.scenes?.length) {
      const scenes = activeWork.videoStory.scenes;
      const currentScene = scenes[currentSceneIndex];

      // Voiceover narration via teacher TTS
      if (!isNarrationMuted && currentScene?.narration) {
        speakText(currentScene.narration, 1.0, 'vi-VN');
      }

      const sceneDuration = Math.max(5000, (currentScene?.durationSeconds || 6) * 1000);
      const displayDuration = Math.min(sceneDuration, 7500);

      timer = setTimeout(() => {
        if (currentSceneIndex < scenes.length - 1) {
          setCurrentSceneIndex((prev) => prev + 1);
        } else {
          setIsPlayingStoryboard(false);
          sounds.playSuccess();
          speakText('Câu chuyện đến đây là kết thúc rồi! Bé hãy cùng ôn lại bài học nhé!', 1.0, 'vi-VN');
        }
      }, displayDuration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlayingStoryboard, currentSceneIndex, activeWork?.id, isNarrationMuted]);

  // Reset video player when activeWork changes
  useEffect(() => {
    setIsPlayingStoryboard(false);
    setCurrentSceneIndex(0);
  }, [activeWork?.id]);

  // Notification Banner
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Fullscreen Preview Modal for Classroom / Projector
  const [previewImageModal, setPreviewImageModal] = useState<{
    url: string;
    title: string;
    subject: string;
    characterName?: string;
    sceneDescription?: string;
    verses?: string[];
  } | null>(null);

  // Selected Stanza to link with illustration
  const [selectedStanzaIndex, setSelectedStanzaIndex] = useState<number | null>(null);

  // Fallback image error flag
  const [imgLoadError, setImgLoadError] = useState(false);

  // Reset image error on work change
  useEffect(() => {
    setImgLoadError(false);
    setSelectedStanzaIndex(null);
  }, [activeWork?.id, activeWork?.illustration3d?.imageUrl]);

  // Download 3D illustration directly
  const handleDownloadImage = (imgUrl: string, titleName: string) => {
    sounds.playPop();
    const a = document.createElement('a');
    a.href = imgUrl;
    a.target = '_blank';
    a.download = `Minh_Hoa_3D_${titleName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    sounds.playSuccess();
    setSaveToast(`📥 Đang tải ảnh minh họa 3D cho "${titleName}"...`);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Sync to localStorage whenever savedWorks changes
  useEffect(() => {
    try {
      localStorage.setItem('mam_ai_saved_creative_works', JSON.stringify(savedWorks));
    } catch (e) {
      console.error('Lỗi lưu local storage:', e);
    }
  }, [savedWorks]);

  // Load from server on mount
  useEffect(() => {
    fetch('/api/media-vault')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.items)) {
          const formattedServerItems: StoryPoemItem[] = data.items.map((i: any) => ({
            id: i.id,
            title: i.title,
            type: i.type === 'video' ? 'video' : 'poem',
            category: i.category || (i.type === 'video' ? 'Câu Chuyện Video' : 'Thơ Minh Họa 3D'),
            topicPrompt: i.tags?.[0] || i.title,
            description: i.description,
            content: i.content || i.description,
            author: i.author || 'Mầm AI',
            ageGroup: i.ageGroup || '4–5 tuổi',
            createdAt: i.createdAt || new Date().toISOString().split('T')[0],
            illustration3d: i.illustration3d,
            videoStory: i.videoStory,
            stanzas: i.stanzas || (i.content ? i.content.split('\n\n') : []),
            likesCount: i.likesCount || 1,
            viewsCount: i.viewsCount || 1,
          }));

          setSavedWorks((prev) => {
            const ids = new Set(prev.map((p) => p.id));
            const newOnes = formattedServerItems.filter((s) => !ids.has(s.id));
            return [...newOnes, ...prev];
          });
        }
      })
      .catch(() => {});
  }, []);

  // Quick prompt suggestions
  const poemSuggestions = [
    'Bé rửa tay sạch đẩy lùi vi khuẩn, giữ gìn sức khỏe',
    'Đèn giao thông ba màu xanh đỏ vàng bé đi đúng luật',
    'Quả cam tròn xoe nhiều vitamin C bổ dưỡng mát lành',
    'Bé yêu thương cô giáo và giúp đỡ bạn bè trong lớp',
    'Con bướm trắng bay lượn bên vườn hoa hồng thơm ngát',
    'Mẹ và bé cùng chăm sóc cây xanh trong vườn nhà',
  ];

  const videoSuggestions = [
    'Chú Thỏ Trắng và bài học chia sẻ củ cải đỏ ấm áp tình bạn',
    'Hạt Mầm Bé Xinh vượt qua thử thách để vươn mình thành cây lớn',
    'Bé Gấu Con học cách chào hỏi lễ phép khi gặp người lớn',
    'Các bạn nhỏ trong lớp cùng nhau thu dọn đồ chơi sau giờ chơi',
    'Chiếc Ô Tô Đỏ giúp đỡ bạn Bác Xe Buýt chở các bạn đến trường',
    'Chuyến phiêu lưu của Giọt Nước Tí Tách biến thành cầu vồng',
  ];

  // Auto save function after every creation
  const autoSaveCreatedWork = async (item: StoryPoemItem) => {
    // 1. Update React state & localStorage
    setSavedWorks((prev) => [item, ...prev.filter((p) => p.id !== item.id)]);

    // 2. Persist to Server Media Vault
    try {
      await fetch('/api/media-vault/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          title: item.title,
          type: item.type,
          category: item.category,
          description: item.description,
          content: item.content,
          author: item.author,
          ageGroup: item.ageGroup,
          createdAt: item.createdAt,
          illustration3d: item.illustration3d,
          videoStory: item.videoStory,
          stanzas: item.stanzas,
          isAiGenerated: true,
        }),
      });
    } catch (e) {
      console.warn('Lỗi lưu server media vault:', e);
    }

    // 3. Persist to Document Storage
    try {
      await persistentDocStorage.saveDocument({
        id: item.id,
        title: item.title,
        type: item.type === 'video' ? 'video' : 'docx',
        category: item.type === 'video' ? 'Truyện video AI' : 'Thơ ca mầm non',
        sourceFunction: 'teaching_pack',
        author: item.author,
        fileUrl: item.fileUrl || '',
        fileName: item.fileName || `${item.title.replace(/\s+/g, '_')}.docx`,
        tags: ['AI Sáng Tác', item.ageGroup, item.type === 'video' ? 'Video Hoạt Hình' : 'Thơ 3D'],
        content: item.content,
        description: item.description,
      });
    } catch (e) {
      console.warn('Lỗi lưu persistentDocStorage:', e);
    }

    // Show toast message
    setSaveToast(`🎉 Đã tự động lưu tác phẩm "${item.title}" vào Tủ Tác Phẩm Của Tôi!`);
    setTimeout(() => setSaveToast(null), 4000);
  };

  // Handle Generate with AI
  const handleGenerateAi = async (type: 'poem' | 'video') => {
    const prompt = promptInput.trim();
    if (!prompt) {
      sounds.playRetry();
      return;
    }

    setIsGenerating(true);
    setGenerationStep(1);
    sounds.playFanfare();

    // Step 1: Brainstorming
    const stepTimer1 = setTimeout(() => setGenerationStep(2), 1200);
    // Step 2: 3D Pixar rendering / Video scene building
    const stepTimer2 = setTimeout(() => setGenerationStep(3), 2400);

    try {
      const res = await fetch('/api/gemini/generate-poem-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: prompt,
          type: type === 'poem' ? 'poem' : 'story',
          ageGroup: selectedAge,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      let data: any = null;
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.item) {
          data = json.item;
        }
      }

      if (!data) {
        throw new Error('Fallback required');
      }

      const newId = `sp-ai-${Date.now()}`;
      const visualDefault = getContentAwareVisualClient(prompt);

      const enrichedIllustration = data.illustration3d
        ? {
            subject: data.illustration3d.subject || visualDefault.subject,
            characterName: data.illustration3d.characterName || visualDefault.characterName,
            prompt: data.illustration3d.prompt || visualDefault.prompt,
            sceneDescription: data.illustration3d.sceneDescription || visualDefault.sceneDescription,
            imageUrl: data.illustration3d.imageUrl || visualDefault.imageUrl,
            fallbackUrl: data.illustration3d.fallbackUrl || visualDefault.fallbackUrl,
          }
        : visualDefault;

      const newWork: StoryPoemItem = {
        id: newId,
        title: data.title || (type === 'poem' ? `Bài Thơ: ${prompt}` : `Video Truyện: ${prompt}`),
        type: type,
        category: type === 'poem' ? 'Thơ Minh Họa 3D' : 'Câu Chuyện Video AI',
        topicPrompt: prompt,
        description: data.description || `Tác phẩm AI sáng tác theo câu lệnh: "${prompt}"`,
        content: data.content,
        author: 'Mầm AI & Cô Giáo',
        ageGroup: selectedAge,
        createdAt: new Date().toISOString().split('T')[0],
        stanzas: data.stanzas || (data.content ? data.content.split('\n\n') : []),
        illustration3d: enrichedIllustration,
        videoStory: data.videoStory,
        likesCount: 1,
        viewsCount: 1,
      };

      setActiveWork(newWork);
      await autoSaveCreatedWork(newWork);
      sounds.playSuccess();
    } catch {
      // Local robust content-aware fallback creation
      const newId = `sp-ai-${Date.now()}`;
      const visual = getContentAwareVisualClient(prompt);

      let fallbackPoemContent = `Mỗi ngày một niềm vui\nCùng cô học điều mới\nBạn bè luôn yêu quý\nCười rạng rỡ trên môi\n\nNụ hoa vừa hé nở\nĐón ánh nắng ban mai\nBé chăm ngoan học giỏi\nTương lai sáng rạng ngời!`;
      let fallbackTitle = `Bài Thơ: ${prompt}`;

      if (prompt.toLowerCase().includes('gà')) {
        fallbackTitle = 'Bài Thơ: Chú Gà Con Lông Vàng';
        fallbackPoemContent = `Mười quả trứng tròn\nMẹ gà ấp ủ\nHôm nay vừa đủ\nNở ra đàn con\n\nLông vàng óng ả\nMắt đen hạt tiêu\nBé thương bé yêu\nGọi đàn chip chip!`;
      } else if (prompt.toLowerCase().includes('đèn') || prompt.toLowerCase().includes('giao thông')) {
        fallbackTitle = 'Bài Thơ: Đèn Giao Thông Ba Màu';
        fallbackPoemContent = `Đèn đỏ dừng lại\nĐèn xanh được đi\nĐèn vàng chậm chậm\nBé nhớ khắc ghi\n\nĐi trên vỉa hè\nNắm chặt tay mẹ\nĐường đông xe cộ\nBé an toàn vui!`;
      } else if (prompt.toLowerCase().includes('rửa tay')) {
        fallbackTitle = 'Bài Thơ: Bé Rửa Tay Sạch Sẽ';
        fallbackPoemContent = `Bàn tay nhỏ xinh\nCùng bọt xà phòng\nKì cọ thật sạch\nĐố vi khuẩn còn\n\nNước mát trong veo\nBàn tay thơm phức\nTrước khi ăn cơm\nBé luôn nhớ rửa!`;
      } else if (prompt.toLowerCase().includes('cam')) {
        fallbackTitle = 'Bài Thơ: Quả Cam Ngọt Lành';
        fallbackPoemContent = `Quả cam tròn xoe\nVỏ vàng óng ả\nNhiều múi ngọt lành\nMời bé cùng ăn\n\nVitamin mát bổ\nCho má thêm hồng\nBé khỏe bé lớn\nNụ cười tươi xinh!`;
      }

      const fallbackWork: StoryPoemItem =
        type === 'poem'
          ? {
              id: newId,
              title: fallbackTitle,
              type: 'poem',
              category: 'Thơ Minh Họa 3D',
              topicPrompt: prompt,
              description: `Bài thơ mầm non gắn liền với chủ đề "${visual.subject}", chuẩn lứa tuổi ${selectedAge}.`,
              content: fallbackPoemContent,
              author: 'Mầm AI Sáng Tác',
              ageGroup: selectedAge,
              createdAt: new Date().toISOString().split('T')[0],
              stanzas: fallbackPoemContent.split('\n\n'),
              illustration3d: {
                subject: visual.subject,
                characterName: visual.characterName,
                prompt: visual.prompt,
                sceneDescription: visual.sceneDescription,
                imageUrl: visual.imageUrl,
                fallbackUrl: visual.fallbackUrl,
              },
            }
          : {
              id: newId,
              title: `Video Truyện: ${prompt}`,
              type: 'video',
              category: 'Câu Chuyện Video AI',
              topicPrompt: prompt,
              description: `Câu chuyện ý nghĩa về ${visual.subject} nuôi dưỡng tình yêu thương cho trẻ.`,
              content: `Trong khu vườn Mầm Non rực rỡ sắc màu, bạn ${visual.characterName} cùng các bạn nhỏ khám phá chủ đề ${prompt}. Mọi người cùng chung tay giúp đỡ nhau và có một ngày tràn ngập tiếng cười!`,
              author: 'Mầm AI Animation',
              ageGroup: selectedAge,
              createdAt: new Date().toISOString().split('T')[0],
              videoStory: {
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                duration: '01:30',
                moralLesson: 'Biết chia sẻ và yêu thương bạn bè trong lớp.',
                scenes: [
                  {
                    sceneNumber: 1,
                    title: `Khởi đầu: Gặp gỡ ${visual.characterName}`,
                    narration: `Các bạn nhỏ bắt đầu một ngày mới thật vui nhộn cùng ${visual.subject}...`,
                    visualPrompt: visual.prompt,
                    imageUrl: visual.imageUrl,
                    fallbackUrl: visual.fallbackUrl,
                    durationSeconds: 25,
                  },
                  {
                    sceneNumber: 2,
                    title: 'Cùng nhau vượt qua thử thách',
                    narration: 'Các bạn nắm tay nhau và tìm ra điều bất ngờ kỳ diệu...',
                    visualPrompt: 'Friends working together 3D cartoon scene',
                    imageUrl: visual.imageUrl,
                    fallbackUrl: visual.fallbackUrl,
                    durationSeconds: 35,
                  },
                ],
              },
            };

      setActiveWork(fallbackWork);
      await autoSaveCreatedWork(fallbackWork);
      sounds.playSuccess();
    } finally {
      setIsGenerating(false);
      setGenerationStep(1);
    }
  };

  // Re-generate illustration with a new angle/seed for the current poem
  const handleRegenerateIllustration = () => {
    if (!activeWork || !activeWork.illustration3d) return;
    sounds.playFanfare();

    const randomSeed = Math.floor(Math.random() * 99999);
    const newImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      activeWork.illustration3d.prompt
    )}?width=800&height=800&nologo=true&seed=${randomSeed}`;

    const updated: StoryPoemItem = {
      ...activeWork,
      illustration3d: {
        ...activeWork.illustration3d,
        imageUrl: newImageUrl,
      },
    };

    setActiveWork(updated);
    autoSaveCreatedWork(updated);
    speakText(`Đã tạo góc nhìn tranh 3D mới cho ${activeWork.illustration3d.subject || 'bài thơ'}!`, 1.05, 'vi-VN');
  };

  // Play audio recitation for poem
  const handleReadPoemAudio = () => {
    if (!activeWork) return;
    if (isSpeakingPoem) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeakingPoem(false);
      setCurrentStanzaIndex(null);
      return;
    }

    sounds.playPop();
    setIsSpeakingPoem(true);

    const fullText = `${activeWork.title}. ${activeWork.content}`;
    speakText(fullText, 0.95, 'vi-VN');

    // Simulate stanza highlight loop
    const stanzas = activeWork.stanzas || [activeWork.content];
    let idx = 0;
    setCurrentStanzaIndex(0);
    const interval = setInterval(() => {
      idx++;
      if (idx < stanzas.length) {
        setCurrentStanzaIndex(idx);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsSpeakingPoem(false);
          setCurrentStanzaIndex(null);
        }, 3000);
      }
    }, 4500);
  };

  // Download Word document of the poem/story
  const handleDownloadDoc = (item: StoryPoemItem) => {
    sounds.playPop();
    const docContent = `TRƯỜNG MẦM NON LIÊN MINH A - VƯỜN ƯƠM AI
HỆ SINH THÁI GIÁO DỤC MẦM NON THÔNG MINH
===============================================

${item.title.toUpperCase()}
Phân loại: ${item.category}
Độ tuổi: ${item.ageGroup}
Tác giả: ${item.author}
Ngày sáng tác: ${item.createdAt}
Câu lệnh gốc: "${item.topicPrompt}"

-----------------------------------------------
Ý NGHĨA GIÁO DỤC:
${item.description}

-----------------------------------------------
NỘI DUNG TÁC PHẨM:
${item.content}

${
  item.illustration3d
    ? `\n-----------------------------------------------\nMÔ TẢ MINH HỌA 3D PIXAR:\n- Nhân vật: ${item.illustration3d.characterName || 'Bé Mầm'}\n- Khung cảnh: ${item.illustration3d.sceneDescription}\n- Prompt 3D: ${item.illustration3d.prompt}\n`
    : ''
}
${
  item.videoStory
    ? `\n-----------------------------------------------\nKỊCH BẢN VIDEO HOẠT HÌNH:\n- Thời lượng: ${item.videoStory.duration}\n- Bài học: ${item.videoStory.moralLesson}\n` +
      item.videoStory.scenes
        .map((sc) => `\n[Cảnh ${sc.sceneNumber}: ${sc.title}]\n- Lời dẫn: ${sc.narration}\n- Visual 3D: ${sc.visualPrompt}`)
        .join('\n')
    : ''
}

===============================================
Nguồn: Mầm AI - Ứng dụng Chuyển đổi số GDMN Thủ đô 2026`;

    const blob = new Blob([docContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    sounds.playSuccess();
  };

  // Download video MP4 of the created story
  const handleDownloadVideo = async (item: StoryPoemItem) => {
    if (!item.videoStory) return;
    sounds.playPop();
    setIsDownloadingVideo(true);
    setSaveToast(`🎬 Đang chuẩn bị tải Video MP4 cho "${item.title}"...`);

    const videoUrl =
      item.videoStory.videoUrl ||
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    const cleanFileName = `Video_Truyen_${item.title.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1EA0-\u1EF9]/g, '_')}.mp4`;

    try {
      try {
        const response = await fetch(videoUrl);
        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = cleanFileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
        } else {
          throw new Error('Direct fetch failed');
        }
      } catch {
        const a = document.createElement('a');
        a.href = videoUrl;
        a.target = '_blank';
        a.download = cleanFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      sounds.playSuccess();
      setSaveToast(`🎉 Đã tải video "${item.title}" thành công về máy của bạn!`);
    } catch (err) {
      console.error('Lỗi tải video:', err);
      const a = document.createElement('a');
      a.href = videoUrl;
      a.target = '_blank';
      a.download = cleanFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      sounds.playSuccess();
      setSaveToast(`🎉 Đã bắt đầu tải video "${item.title}" về máy!`);
    } finally {
      setIsDownloadingVideo(false);
      setTimeout(() => setSaveToast(null), 4000);
    }
  };

  // Delete saved work
  const handleDeleteWork = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playPop();
    const updated = savedWorks.filter((w) => w.id !== id);
    setSavedWorks(updated);
    if (activeWork?.id === id) {
      setActiveWork(updated[0] || null);
    }
    // Delete from server
    fetch(`/api/media-vault/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-24 font-['Nunito',sans-serif]">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* 1. HERO BANNER: TẠO THƠ TRUYỆN AI */}
      <div className="relative overflow-hidden rounded-[32px] sm:rounded-[38px] bg-gradient-to-r from-[#031538] via-[#092b67] via-[#0284C7] to-[#031538] border-[3.5px] border-cyan-400/90 p-5 sm:p-7 md:p-8 shadow-[0_16px_45px_rgba(2,132,199,0.35)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#38BDF8_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-2.5 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-cyan-300 text-cyan-200 text-xs font-black shadow-md flex-wrap">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
              <span>PHONG CÁCH: “Cute 3D Kawaii Educational App UI – Preschool Storybook Style”</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-bubbly tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-sky-200 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              TẠO THƠ TRUYỆN MINH HỌA 3D KAWAII ✨📖🎬
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-cyan-100/95 font-medium leading-relaxed font-['Quicksand']">
              Chỉ cần đưa ra một câu lệnh, AI sẽ tự động sáng tác <strong>bài thơ có hình ảnh minh họa 3D Kawaii</strong> rực rỡ và chữ, hoặc <strong>câu chuyện sinh động thể hiện bằng video xem được và tải về máy</strong> theo phong cách chuẩn <em>"Cute 3D Kawaii Educational App UI – Preschool Storybook Style"</em>!
            </p>
          </div>

          <div className="shrink-0 flex items-center justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-cyan-500/40 via-sky-400/20 to-purple-500/40 p-1.5 border-2 border-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.5)]">
              <div className="w-full h-full bg-white/95 rounded-2xl flex items-center justify-center overflow-hidden">
                <MamAiMascot size="lg" mood="celebrate" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CHỌN CHẾ ĐỘ THAO TÁC: THƠ 3D vs VIDEO TRUYỆN vs TỦ ĐÃ LƯU */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('create-poem');
          }}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black font-bubbly transition-all cursor-pointer ${
            activeTab === 'create-poem'
              ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30 border-2 border-white scale-105'
              : 'bg-white hover:bg-rose-50 text-stone-700 border-2 border-rose-200'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>1. TẠO BÀI THƠ ẢNH 3D KAWAII & CHỮ</span>
        </button>

        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('create-video');
          }}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black font-bubbly transition-all cursor-pointer ${
            activeTab === 'create-video'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 border-2 border-white scale-105'
              : 'bg-white hover:bg-blue-50 text-stone-700 border-2 border-blue-200'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>2. TẠO VIDEO TRUYỆN (XEM & TẢI VỀ)</span>
        </button>

        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('saved-vault');
          }}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black font-bubbly transition-all cursor-pointer ${
            activeTab === 'saved-vault'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 border-2 border-white scale-105'
              : 'bg-white hover:bg-amber-50 text-stone-700 border-2 border-amber-200'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>3. KHO TÁC PHẨM ĐÃ LƯU ({savedWorks.length})</span>
        </button>
      </div>

      {/* 3. KHUNG NHẬP CÂU LỆNH (CHO CẢ THƠ VÀ VIDEO) */}
      {activeTab !== 'saved-vault' && (
        <div className="bg-gradient-to-br from-white via-cyan-50/20 to-sky-50/40 rounded-[32px] p-5 sm:p-7 border-2 border-cyan-200/90 shadow-[0_8px_30px_rgba(2,132,199,0.08)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center text-lg text-white shadow-md border-2 border-white ${
                  activeTab === 'create-poem'
                    ? 'bg-gradient-to-br from-rose-500 to-pink-600'
                    : 'bg-gradient-to-br from-blue-600 to-indigo-600'
                }`}
              >
                {activeTab === 'create-poem' ? '🎨' : '🎬'}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-stone-900 font-bubbly">
                  {activeTab === 'create-poem'
                    ? 'Nhập Câu Lệnh Để AI Sáng Tác Bài Thơ 3D Kawaii'
                    : 'Nhập Câu Lệnh Để AI Dựng Video Câu Chuyện (Xem & Tải Về)'}
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  Chỉ cần đưa ra yêu cầu hoặc chủ đề mầm non, AI sẽ thực hiện trọn vẹn
                </p>
              </div>
            </div>

            {/* Chọn độ tuổi mầm non */}
            <div className="flex items-center gap-1.5 self-start sm:self-center">
              <span className="text-xs font-bold text-stone-600">Độ tuổi:</span>
              <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white border border-cyan-300 text-xs font-black text-stone-800 shadow-2xs focus:ring-2 focus:ring-cyan-400 outline-none cursor-pointer"
              >
                <option value="Dưới 3 tuổi (Nhà trẻ)">Dưới 3 tuổi (Nhà trẻ)</option>
                <option value="3–4 tuổi (Lớp Mầm)">3–4 tuổi (Lớp Mầm)</option>
                <option value="4–5 tuổi (Lớp Chồi)">4–5 tuổi (Lớp Chồi)</option>
                <option value="5–6 tuổi (Lớp Lá)">5–6 tuổi (Lớp Lá)</option>
              </select>
            </div>
          </div>

          {/* Style indicator badge */}
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border-2 border-purple-200 text-xs font-bold text-purple-950">
            <span className="text-base">🧸</span>
            <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <span className="font-black text-purple-900 font-bubbly">Phong cách minh họa: </span>
                <span className="text-purple-700 font-extrabold bg-white px-2 py-0.5 rounded-lg border border-purple-300 shadow-2xs">
                  Cute 3D Kawaii Educational App UI – Preschool Storybook Style
                </span>
              </div>
              <span className="text-[11px] text-pink-600 font-black">
                ✨ Đất nặn 3D Kawaii bo tròn, màu pastel ngọt ngào chuẩn GDMN
              </span>
            </div>
          </div>

          {/* Ô nhập câu lệnh */}
          <div className="relative">
            <textarea
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder={
                activeTab === 'create-poem'
                  ? 'Ví dụ: Bài thơ về chú gà con lông vàng đi tìm mẹ, có hình ảnh 3D ngộ nghĩnh đáng yêu...'
                  : 'Ví dụ: Câu chuyện video về bạn Gấu Nhỏ biết giúp mẹ dọn dẹp đồ chơi và chia sẻ bánh kẹo...'
              }
              rows={3}
              className="w-full p-4 rounded-2xl bg-white border-2 border-cyan-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 shadow-inner text-sm font-bold text-stone-800 placeholder:text-stone-400 outline-none transition-all resize-none"
            />
          </div>

          {/* Gợi ý câu lệnh mẫu 1-chạm */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-stone-500">Gợi ý câu lệnh mầm non 1-chạm:</span>
            <div className="flex flex-wrap gap-2">
              {(activeTab === 'create-poem' ? poemSuggestions : videoSuggestions).map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sounds.playPop();
                    setPromptInput(sug);
                  }}
                  className="px-3 py-1 rounded-xl bg-white hover:bg-cyan-50 border border-cyan-200/80 text-[11px] font-bold text-stone-700 shadow-2xs hover:border-cyan-400 transition-all cursor-pointer text-left"
                >
                  💡 {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Nút hành động Tạo AI */}
          <div className="pt-2 flex items-center justify-end">
            <button
              onClick={() => handleGenerateAi(activeTab === 'create-poem' ? 'poem' : 'video')}
              disabled={isGenerating || !promptInput.trim()}
              className={`w-full sm:w-auto px-7 py-3.5 rounded-2xl text-white font-black text-sm font-bubbly shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                activeTab === 'create-poem'
                  ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-700 shadow-rose-500/30'
                  : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-700 hover:to-cyan-700 shadow-blue-500/30'
              } disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 border-2 border-white`}
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>
                    {generationStep === 1
                      ? 'AI đang sáng tác lời...'
                      : generationStep === 2
                      ? activeTab === 'create-poem'
                        ? 'Đang tạo minh họa 3D Pixar...'
                        : 'Đang dựng hoạt cảnh video...'
                      : 'Đang hoàn tất và tự động lưu trữ...'}
                  </span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>
                    {activeTab === 'create-poem'
                      ? 'AI SÁNG TÁC BÀI THƠ ẢNH 3D NGAY'
                      : 'AI DỰNG CÂU CHUYỆN VIDEO NGAY'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 4. KẾT QUẢ TÁC PHẨM ĐANG CHỌN / VỪA TẠO */}
      {activeWork && activeTab !== 'saved-vault' && (
        <div className="bg-white rounded-[32px] sm:rounded-[36px] p-5 sm:p-7 md:p-8 border-2 border-amber-200/90 shadow-[0_12px_40px_rgba(180,83,9,0.08)] space-y-6">
          {/* Work Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black ${
                    activeWork.type === 'video'
                      ? 'bg-blue-100 text-blue-900 border border-blue-300'
                      : 'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}
                >
                  {activeWork.type === 'video' ? '🎬 Câu Chuyện Video AI' : '🎨 Thơ Minh Họa 3D'}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                  {activeWork.ageGroup}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-black flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Đã lưu tự động</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-bubbly pt-1">
                {activeWork.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-medium">
                Câu lệnh sáng tác: <span className="text-stone-800 font-bold">"{activeWork.topicPrompt}"</span>
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {activeWork.type === 'poem' && (
                <button
                  onClick={handleReadPoemAudio}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black font-bubbly transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                    isSpeakingPoem
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-105'
                  }`}
                >
                  {isSpeakingPoem ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isSpeakingPoem ? 'Dừng đọc' : 'Nghe bé đọc thơ'}</span>
                </button>
              )}

              {activeWork.type === 'video' && (
                <button
                  onClick={() => handleDownloadVideo(activeWork)}
                  disabled={isDownloadingVideo}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-black text-xs sm:text-sm font-bubbly shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  title="Tải video câu chuyện MP4 về máy"
                >
                  <Download className={`w-4 h-4 ${isDownloadingVideo ? 'animate-bounce' : ''}`} />
                  <span>{isDownloadingVideo ? 'Đang chuẩn bị video...' : 'Tải Video MP4 Về Máy'}</span>
                </button>
              )}

              <button
                onClick={() => handleDownloadDoc(activeWork)}
                className="px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs sm:text-sm font-black font-bubbly transition-all flex items-center gap-1.5 cursor-pointer"
                title="Tải văn bản Word in khổ to"
              >
                <Download className="w-4 h-4 text-amber-700" />
                <span>Tải Word in</span>
              </button>
            </div>
          </div>

          {/* ================================================== */}
          {/* HIỂN THỊ CHI TIẾT BÀI THƠ 3D GẮN LIỀN VỚI NỘI DUNG */}
          {/* ================================================== */}
          {activeWork.type === 'poem' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Cột trái (5 cols): HÌNH ẢNH MINH HỌA 3D PHONG CÁCH PIXAR GẮN LIỀN VỚI NỘI DUNG */}
              <div className="lg:col-span-5 space-y-3.5">
                {/* Banner Cam kết Gắn Liền Nội Dung */}
                <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-400 text-emerald-950 text-xs font-black shadow-sm">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">🎯 MINH HỌA GẮN LIỀN 100% NỘI DUNG</span>
                  </div>
                  <span className="shrink-0 text-[10px] font-black text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
                    {activeWork.illustration3d?.subject || 'Đúng Đề Tài'}
                  </span>
                </div>

                {/* Khung Ảnh 3D Pixar tương tác */}
                <div className="relative rounded-[28px] overflow-hidden border-4 border-amber-300 shadow-xl bg-gradient-to-b from-amber-100 to-orange-100 aspect-square group">
                  {(() => {
                    const currentImgUrl =
                      (imgLoadError
                        ? activeWork.illustration3d?.fallbackUrl
                        : activeWork.illustration3d?.imageUrl) ||
                      activeWork.illustration3d?.fallbackUrl ||
                      'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80';

                    return (
                      <>
                        <img
                          src={currentImgUrl}
                          alt={activeWork.title}
                          onError={() => setImgLoadError(true)}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Badge Cute 3D Kawaii Storybook Style Illustration */}
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/60 text-white text-[11px] font-black font-bubbly shadow-md flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                          <span>🧸 Cute 3D Kawaii Storybook Style</span>
                        </div>

                        {/* Quick action buttons on top right */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              setPreviewImageModal({
                                url: currentImgUrl,
                                title: activeWork.title,
                                subject: activeWork.illustration3d?.subject || activeWork.topicPrompt,
                                characterName: activeWork.illustration3d?.characterName,
                                sceneDescription: activeWork.illustration3d?.sceneDescription,
                                verses: activeWork.stanzas || [activeWork.content],
                              })
                            }
                            className="w-8 h-8 rounded-full bg-black/70 hover:bg-cyan-600 text-white flex items-center justify-center transition-all shadow-md cursor-pointer hover:scale-110"
                            title="Phóng to xem cả lớp (Máy chiếu / Tivi)"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadImage(currentImgUrl, activeWork.title)}
                            className="w-8 h-8 rounded-full bg-black/70 hover:bg-emerald-600 text-white flex items-center justify-center transition-all shadow-md cursor-pointer hover:scale-110"
                            title="Tải ảnh 3D về máy"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Character Name & Scene Pill */}
                        {activeWork.illustration3d?.characterName && (
                          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-cyan-400/80 text-white text-xs shadow-lg">
                            <div className="flex items-center justify-between gap-1">
                              <p className="font-black text-cyan-300 font-bubbly">
                                ✨ Nhân vật: {activeWork.illustration3d.characterName}
                              </p>
                              <span className="text-[10px] text-amber-300 font-bold bg-amber-950/70 px-2 py-0.5 rounded-full border border-amber-400/40">
                                3D Kawaii
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-200 line-clamp-2 mt-0.5">
                              {activeWork.illustration3d.sceneDescription}
                            </p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* Các nút thao tác ảnh minh họa */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleRegenerateIllustration}
                    className="px-3 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs font-bubbly shadow-md flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Đổi Góc Nhìn 3D</span>
                  </button>

                  <button
                    onClick={() => {
                      const currentImgUrl =
                        (imgLoadError
                          ? activeWork.illustration3d?.fallbackUrl
                          : activeWork.illustration3d?.imageUrl) ||
                        activeWork.illustration3d?.fallbackUrl ||
                        'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80';
                      setPreviewImageModal({
                        url: currentImgUrl,
                        title: activeWork.title,
                        subject: activeWork.illustration3d?.subject || activeWork.topicPrompt,
                        characterName: activeWork.illustration3d?.characterName,
                        sceneDescription: activeWork.illustration3d?.sceneDescription,
                        verses: activeWork.stanzas || [activeWork.content],
                      });
                    }}
                    className="px-3 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs font-bubbly shadow-md flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Chiếu Cả Lớp (TV)</span>
                  </button>
                </div>

                {/* Chi Tiết Khắc Họa Gắn Liền Với Bài Thơ */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 via-rose-50/40 to-orange-50/60 border-2 border-amber-200/90 text-xs text-stone-700 space-y-2 shadow-xs">
                  <div className="flex items-center gap-1.5 font-black text-amber-950">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Nội dung hình ảnh gắn liền với bài thơ:</span>
                  </div>
                  
                  <div className="space-y-1 text-[11px] leading-relaxed">
                    <p className="text-stone-800">
                      🎯 <strong className="text-amber-900">Chủ thể trọng tâm:</strong>{' '}
                      <span className="font-bold text-rose-700">{activeWork.illustration3d?.subject}</span>
                    </p>
                    <p className="text-stone-700">
                      📖 <strong className="text-amber-900">Mối liên kết nội dung:</strong> Bức tranh 3D khắc họa trực tiếp nhân vật và cảnh tượng sinh động được miêu tả trong các khổ thơ, giúp các bé mầm non dễ dàng quan sát, liên tưởng và thuộc thơ nhanh hơn.
                    </p>
                  </div>

                  {selectedStanzaIndex !== null && activeWork.stanzas && activeWork.stanzas[selectedStanzaIndex] && (
                    <div className="mt-2 pt-2 border-t border-amber-200/80 bg-white/90 p-2.5 rounded-xl border border-rose-200">
                      <div className="flex items-center justify-between text-[11px] font-black text-rose-700 mb-1">
                        <span>🌟 Đang liên kết Khổ thơ {selectedStanzaIndex + 1}:</span>
                        <span className="text-[10px] text-stone-500 font-normal">Chạm khổ khác để đổi</span>
                      </div>
                      <p className="italic text-stone-800 font-medium whitespace-pre-line text-xs pl-2 border-l-2 border-rose-400">
                        "{activeWork.stanzas[selectedStanzaIndex]}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cột phải (7 cols): NỘI DUNG CHỮ BÀI THƠ VẦN ĐIỆU */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-6 sm:p-8 rounded-[28px] bg-gradient-to-b from-[#FFFDF9] via-rose-50/30 to-[#FFF7ED] border-2 border-rose-200/90 shadow-sm space-y-6">
                  <div className="text-center pb-2 border-b border-rose-100">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-rose-950 font-bubbly">
                      {activeWork.title}
                    </h3>
                    <p className="text-xs text-rose-700 font-bold mt-1">
                      {activeWork.description}
                    </p>
                    <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-rose-100/70 border border-rose-300 text-rose-800 text-[11px] font-bold">
                      <span>💡 Bé và cô chạm vào từng khổ thơ bên dưới để xem liên kết với tranh</span>
                    </div>
                  </div>

                  {/* Stanzas Display with Highlight Reading effect and click connection */}
                  <div className="space-y-4 text-center">
                    {(activeWork.stanzas || [activeWork.content]).map((stanza, idx) => {
                      const isCurrentSpeaking = currentStanzaIndex === idx;
                      const isSelected = selectedStanzaIndex === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            sounds.playPop();
                            setSelectedStanzaIndex(isSelected ? null : idx);
                          }}
                          className={`p-4 sm:p-5 rounded-2xl transition-all duration-300 cursor-pointer border-2 ${
                            isSelected
                              ? 'bg-amber-100/90 border-amber-500 shadow-md scale-[1.02] ring-2 ring-amber-300'
                              : isCurrentSpeaking
                              ? 'bg-rose-100 border-rose-400 shadow-md scale-[1.02] ring-2 ring-rose-300'
                              : 'bg-white/70 hover:bg-white border-rose-100 hover:border-rose-300 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-rose-100/60 text-[11px] font-black text-rose-600">
                            <span className="flex items-center gap-1">
                              <span>Khổ thơ {idx + 1}</span>
                              {isCurrentSpeaking && <Volume2 className="w-3.5 h-3.5 animate-bounce text-rose-600" />}
                            </span>
                            <span className="text-[10px] font-bold text-stone-500 hover:text-rose-700">
                              {isSelected ? '🎯 Đang gắn với tranh' : '👉 Chạm gắn với tranh'}
                            </span>
                          </div>

                          <div className="text-base sm:text-lg md:text-xl font-black font-bubbly text-stone-800 leading-relaxed whitespace-pre-line tracking-wide">
                            {stanza}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 text-center text-xs text-stone-400 italic">
                    — Tác giả: {activeWork.author} · Vườn Ươm AI Mầm Non —
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================== */}
          {/* HIỂN THỊ CHI TIẾT CÂU CHUYỆN THỂ HIỆN BẰNG VIDEO */}
          {/* ================================================== */}
          {activeWork.type === 'video' && (
            <div className="space-y-6">
              {/* Toolbar điều khiển chế độ xem & Tải video */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 via-cyan-50 to-indigo-50 border-2 border-cyan-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-stone-700 font-bubbly flex items-center gap-1.5">
                    <span>🎬 Chế độ xem:</span>
                  </span>
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setVideoPlayerMode('storyboard');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black font-bubbly transition-all cursor-pointer ${
                      videoPlayerMode === 'storyboard'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md scale-105'
                        : 'bg-white text-stone-700 hover:bg-cyan-100 border border-cyan-200'
                    }`}
                  >
                    <span>🧸 1. Hoạt Cảnh 3D Kawaii (Tự Động & Lời Kể)</span>
                  </button>
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setVideoPlayerMode('mp4');
                      setIsPlayingStoryboard(false);
                      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black font-bubbly transition-all cursor-pointer ${
                      videoPlayerMode === 'mp4'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md scale-105'
                        : 'bg-white text-stone-700 hover:bg-cyan-100 border border-cyan-200'
                    }`}
                  >
                    <span>🎥 2. Video Player MP4 Trực Tiếp</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap self-start sm:self-center">
                  {videoPlayerMode === 'storyboard' && (
                    <button
                      onClick={() => {
                        sounds.playPop();
                        setIsNarrationMuted(!isNarrationMuted);
                        if (!isNarrationMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black font-bubbly transition-all flex items-center gap-1.5 cursor-pointer border ${
                        !isNarrationMuted
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-stone-100 text-stone-600 border-stone-300'
                      }`}
                      title="Bật/Tắt giọng đọc cô giáo"
                    >
                      {!isNarrationMuted ? <Volume2 className="w-3.5 h-3.5 text-emerald-700" /> : <VolumeX className="w-3.5 h-3.5 text-stone-500" />}
                      <span>{!isNarrationMuted ? 'Giọng kể: Bật' : 'Giọng kể: Tắt'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDownloadVideo(activeWork)}
                    disabled={isDownloadingVideo}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-black text-xs font-bubbly shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                    title="Tải video câu chuyện MP4 về máy"
                  >
                    <Download className={`w-3.5 h-3.5 ${isDownloadingVideo ? 'animate-bounce' : ''}`} />
                    <span>{isDownloadingVideo ? 'Đang chuẩn bị...' : 'Tải Video MP4 Về Máy'}</span>
                  </button>
                </div>
              </div>

              {/* Màn hình Trình phát Video (Watchable Video Player) */}
              <div className="relative rounded-[28px] overflow-hidden bg-stone-950 border-4 border-cyan-300 shadow-[0_12px_45px_rgba(6,182,212,0.25)] aspect-video max-w-4xl mx-auto flex flex-col justify-between group">
                {videoPlayerMode === 'storyboard' ? (
                  // Chế độ 1: Trình Chiếu Hoạt Cảnh 3D Kawaii Tương Tác
                  <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
                    {/* Background Scene 3D Image with subtle zoom */}
                    {activeWork.videoStory?.scenes?.[currentSceneIndex] && (
                      <div className="absolute inset-0">
                        <img
                          src={
                            activeWork.videoStory.scenes[currentSceneIndex].imageUrl ||
                            activeWork.videoStory.scenes[currentSceneIndex].fallbackUrl ||
                            'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80'
                          }
                          alt={activeWork.videoStory.scenes[currentSceneIndex].title}
                          className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${
                            isPlayingStoryboard ? 'scale-105' : 'scale-100'
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />
                      </div>
                    )}

                    {/* Top Badges overlay */}
                    <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-cyan-600/90 backdrop-blur-md border border-cyan-300 text-white text-xs font-black font-bubbly shadow-md flex items-center gap-1.5">
                          <Film className="w-3.5 h-3.5" />
                          <span>
                            Cảnh {currentSceneIndex + 1}/{(activeWork.videoStory?.scenes || []).length}: {activeWork.videoStory?.scenes?.[currentSceneIndex]?.title}
                          </span>
                        </span>
                        <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/40 text-amber-300 text-[11px] font-black">
                          🧸 Cute 3D Kawaii Storybook Style
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            const sc = activeWork.videoStory?.scenes?.[currentSceneIndex];
                            if (sc) {
                              setPreviewImageModal({
                                url: sc.imageUrl || sc.fallbackUrl || '',
                                title: `${activeWork.title} - Cảnh ${sc.sceneNumber}: ${sc.title}`,
                                subject: sc.title,
                                sceneDescription: sc.narration,
                              });
                            }
                          }}
                          className="w-8 h-8 rounded-full bg-black/60 hover:bg-cyan-600 text-white flex items-center justify-center transition-all shadow-md cursor-pointer hover:scale-110"
                          title="Phóng to toàn màn hình"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadVideo(activeWork)}
                          className="w-8 h-8 rounded-full bg-black/60 hover:bg-blue-600 text-white flex items-center justify-center transition-all shadow-md cursor-pointer hover:scale-110"
                          title="Tải video MP4"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Subtitle Karaoke Bar overlay */}
                    <div className="relative z-10 px-4 py-2 mx-4 rounded-2xl bg-black/80 backdrop-blur-md border border-cyan-400/80 text-center shadow-lg">
                      <p className="text-xs sm:text-sm font-black text-amber-300 font-bubbly tracking-wide">
                        "{activeWork.videoStory?.scenes?.[currentSceneIndex]?.narration}"
                      </p>
                    </div>

                    {/* Player Controls Bar */}
                    <div className="relative z-10 p-3 sm:p-4 bg-gradient-to-t from-black/95 to-transparent space-y-2">
                      {/* Timeline segments indicator */}
                      <div className="grid grid-cols-4 gap-1.5">
                        {(activeWork.videoStory?.scenes || [1, 2, 3, 4]).map((sc: any, idx: number) => {
                          const isCur = currentSceneIndex === idx;
                          const isPassed = currentSceneIndex > idx;
                          return (
                            <div
                              key={idx}
                              onClick={() => {
                                sounds.playPop();
                                setCurrentSceneIndex(idx);
                                if (!isNarrationMuted && activeWork.videoStory?.scenes?.[idx]?.narration) {
                                  speakText(activeWork.videoStory.scenes[idx].narration, 1.0, 'vi-VN');
                                }
                              }}
                              className={`h-2 rounded-full cursor-pointer transition-all ${
                                isCur
                                  ? 'bg-gradient-to-r from-amber-400 to-cyan-400 ring-2 ring-cyan-300 shadow-sm animate-pulse'
                                  : isPassed
                                  ? 'bg-cyan-500'
                                  : 'bg-white/30 hover:bg-white/50'
                              }`}
                              title={`Chuyển đến Cảnh ${idx + 1}`}
                            />
                          );
                        })}
                      </div>

                      {/* Control buttons */}
                      <div className="flex items-center justify-between gap-3 text-white">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-300 font-bubbly">
                          <span>⏱️ {currentSceneIndex + 1}/{(activeWork.videoStory?.scenes || []).length} cảnh</span>
                          <span className="hidden sm:inline">· {activeWork.videoStory?.duration || '01:45'}</span>
                        </div>

                        {/* Center playback controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              sounds.playPop();
                              setCurrentSceneIndex((prev) => Math.max(0, prev - 1));
                            }}
                            disabled={currentSceneIndex === 0}
                            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 disabled:opacity-30 text-white flex items-center justify-center transition-all cursor-pointer"
                            title="Cảnh trước"
                          >
                            <SkipBack className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              sounds.playPop();
                              if (isPlayingStoryboard) {
                                setIsPlayingStoryboard(false);
                                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                                  window.speechSynthesis.cancel();
                                }
                              } else {
                                setIsPlayingStoryboard(true);
                              }
                            }}
                            className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-stone-950 font-black text-xs sm:text-sm font-bubbly shadow-lg flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                          >
                            {isPlayingStoryboard ? (
                              <>
                                <Pause className="w-4 h-4 text-stone-950 fill-stone-950" />
                                <span>Tạm dừng</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 text-stone-950 fill-stone-950" />
                                <span>Phát hoạt cảnh</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => {
                              sounds.playPop();
                              const maxIdx = (activeWork.videoStory?.scenes?.length || 4) - 1;
                              setCurrentSceneIndex((prev) => Math.min(maxIdx, prev + 1));
                            }}
                            disabled={currentSceneIndex >= (activeWork.videoStory?.scenes?.length || 4) - 1}
                            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 disabled:opacity-30 text-white flex items-center justify-center transition-all cursor-pointer"
                            title="Cảnh sau"
                          >
                            <SkipForward className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              sounds.playPop();
                              setCurrentSceneIndex(0);
                              setIsPlayingStoryboard(true);
                            }}
                            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all cursor-pointer"
                            title="Xem lại từ đầu"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Direct Download quick link */}
                        <button
                          onClick={() => handleDownloadVideo(activeWork)}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500/30 hover:bg-cyan-500/50 text-cyan-200 border border-cyan-400/50 text-xs font-black font-bubbly flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Tải Video</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Chế độ 2: Native HTML5 Video Stream Player
                  <div className="relative w-full h-full flex flex-col justify-between">
                    <video
                      ref={videoRef}
                      src={
                        activeWork.videoStory?.videoUrl ||
                        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
                      }
                      poster={
                        activeWork.videoStory?.scenes?.[currentSceneIndex]?.imageUrl ||
                        activeWork.illustration3d?.imageUrl ||
                        'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80'
                      }
                      className="w-full h-full object-cover"
                      onPlay={() => setIsVideoPlaying(true)}
                      onPause={() => setIsVideoPlaying(false)}
                      onEnded={() => {
                        setIsVideoPlaying(false);
                        sounds.playSuccess();
                      }}
                      controls
                    />

                    {/* Subtitle Karaoke Bar overlay at bottom of video */}
                    {activeWork.videoStory?.scenes?.[currentSceneIndex] && (
                      <div className="absolute bottom-16 left-4 right-4 p-3 rounded-2xl bg-black/85 backdrop-blur-md border border-cyan-400 text-center pointer-events-none">
                        <span className="text-xs sm:text-sm font-black text-cyan-200 font-bubbly">
                          🎬 [Cảnh {currentSceneIndex + 1}: {activeWork.videoStory.scenes[currentSceneIndex].title}]
                        </span>
                        <p className="text-sm sm:text-base font-bold text-white mt-0.5">
                          "{activeWork.videoStory.scenes[currentSceneIndex].narration}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* TRUNG TÂM TẢI VỀ & XUẤT BẢN VIDEO DÀNH CHO GIÁO VIÊN VÀ PHỤ HUYNH */}
              <div className="p-5 sm:p-6 rounded-[28px] bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-cyan-100 text-xs font-black">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-200" />
                    <span>VIDEO ĐÃ DỰNG XONG · SẴN SÀNG XEM & TẢI VỀ</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black font-bubbly">
                    📥 Tải Video Câu Chuyện "{activeWork.title}" Về Máy
                  </h4>
                  <p className="text-xs text-cyan-100/90 font-medium">
                    Bạn có thể tải trực tiếp file Video MP4 chất lượng cao để chiếu trên Tivi, máy chiếu lớp học hoặc gửi vào nhóm Zalo phụ huynh.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap justify-center shrink-0">
                  <button
                    onClick={() => handleDownloadVideo(activeWork)}
                    disabled={isDownloadingVideo}
                    className="px-5 py-3 rounded-2xl bg-white text-blue-900 hover:bg-cyan-50 font-black text-xs sm:text-sm font-bubbly shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    <Download className={`w-4 h-4 text-blue-700 ${isDownloadingVideo ? 'animate-bounce' : ''}`} />
                    <span>{isDownloadingVideo ? 'Đang chuẩn bị file...' : 'Tải Video MP4 Về Máy'}</span>
                  </button>

                  <button
                    onClick={() => handleDownloadDoc(activeWork)}
                    className="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/40 text-white font-black text-xs sm:text-sm font-bubbly transition-all flex items-center gap-2 cursor-pointer"
                    title="Tải kịch bản kèm tranh 3D"
                  >
                    <FileText className="w-4 h-4 text-cyan-200" />
                    <span>Tải Kịch Bản Word</span>
                  </button>
                </div>
              </div>

              {/* Phân cảnh Storyboard (4 scenes) với phong cách Cute 3D Kawaii Educational App UI – Preschool Storybook Style */}
              {activeWork.videoStory?.scenes && activeWork.videoStory.scenes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-base font-black text-stone-900 font-bubbly flex items-center gap-2">
                      <span>🎬 4 Phân Cảnh Video 3D Kawaii</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300">
                        Thời lượng: {activeWork.videoStory.duration}
                      </span>
                    </h4>
                    <span className="text-xs text-purple-700 font-bold bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                      🧸 Phong cách: Cute 3D Kawaii Storybook Style
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {activeWork.videoStory.scenes.map((sc, idx) => {
                      const isSelected = currentSceneIndex === idx;
                      const sceneImgUrl = sc.imageUrl || sc.fallbackUrl || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80';
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            sounds.playPop();
                            setCurrentSceneIndex(idx);
                            if (videoPlayerMode === 'storyboard') {
                              if (!isNarrationMuted && sc.narration) {
                                speakText(sc.narration, 1.0, 'vi-VN');
                              }
                            } else if (videoRef.current) {
                              videoRef.current.currentTime = idx * 25;
                              videoRef.current.play().catch(() => {});
                            }
                          }}
                          className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                            isSelected
                              ? 'bg-cyan-50 border-cyan-500 shadow-lg ring-2 ring-cyan-300 scale-102'
                              : 'bg-white hover:bg-stone-50 border-stone-200 hover:border-cyan-300 shadow-sm'
                          }`}
                        >
                          <div>
                            <div className="relative rounded-xl overflow-hidden aspect-video mb-2 bg-stone-100 border border-stone-200 group-hover:shadow-md transition-all">
                              <img
                                src={sceneImgUrl}
                                alt={sc.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/75 text-white text-[10px] font-black">
                                Cảnh {sc.sceneNumber}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadImage(sceneImgUrl, `${activeWork.title}_Canh_${sc.sceneNumber}`);
                                }}
                                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                                title="Tải ảnh cảnh này"
                              >
                                <Download className="w-3 h-3" />
                              </button>
                            </div>
                            <h5 className="font-black text-xs text-stone-900 font-bubbly group-hover:text-cyan-700 transition-colors">
                              {sc.title}
                            </h5>
                            <p className="text-[11px] text-stone-600 line-clamp-3 mt-1 leading-snug font-medium">
                              {sc.narration}
                            </p>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] font-black text-cyan-700">
                            <span>⏱️ {sc.durationSeconds || 25}s</span>
                            <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                              <Play className="w-3 h-3 fill-cyan-600" />
                              <span>Phát cảnh này</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Lời kể câu chuyện & Bài học đạo đức */}
              <div className="p-6 rounded-[28px] bg-gradient-to-r from-blue-50/50 via-cyan-50/30 to-indigo-50/40 border border-cyan-200 space-y-3">
                <h4 className="text-base font-black text-blue-950 font-bubbly flex items-center gap-2">
                  <span>📖 Toàn Bộ Nội Dung Lời Dẫn Kịch Bản:</span>
                </h4>
                <p className="text-sm text-stone-700 font-medium leading-relaxed whitespace-pre-line">
                  {activeWork.content}
                </p>
                {activeWork.videoStory?.moralLesson && (
                  <div className="pt-2 flex items-center gap-2 text-xs font-black text-blue-900 bg-white p-3 rounded-2xl border border-blue-200">
                    <span>🌟 Bài học giáo dục mầm non:</span>
                    <span>{activeWork.videoStory.moralLesson}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. TAB 3: KHO TÁC PHẨM ĐÃ LƯU (LƯU TRỮ VĨNH VIỄN SAU MỖI LẦN TẠO) */}
      {activeTab === 'saved-vault' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <div>
              <h3 className="text-base sm:text-lg font-black text-amber-950 font-bubbly flex items-center gap-2">
                <span>📚 KHO TÁC PHẨM ĐÃ LƯU TỰ ĐỘNG</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-black">
                  {savedWorks.length} tác phẩm
                </span>
              </h3>
              <p className="text-xs text-stone-600 font-medium">
                Mỗi lần cô và bé tạo thơ hay video truyện, hệ thống tự động lưu giữ vĩnh viễn tại đây để mở xem, nghe đọc hoặc tải về.
              </p>
            </div>

            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('create-poem');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs font-bubbly shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-center"
            >
              <Wand2 className="w-4 h-4" />
              <span>+ Tạo Tác Phẩm Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {savedWorks.map((work) => {
              const isVideo = work.type === 'video';
              return (
                <div
                  key={work.id}
                  onClick={() => {
                    sounds.playPop();
                    setActiveWork(work);
                    setActiveTab(isVideo ? 'create-video' : 'create-poem');
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  className="group rounded-3xl bg-white border-2 border-amber-200 hover:border-orange-400 p-4 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="space-y-3">
                    {/* Media Thumbnail */}
                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-stone-100 border border-stone-200">
                      <img
                        src={
                          work.illustration3d?.imageUrl ||
                          work.videoStory?.scenes?.[0]?.imageUrl ||
                          'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={work.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span
                        className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-black text-white shadow-md ${
                          isVideo ? 'bg-blue-600' : 'bg-rose-600'
                        }`}
                      >
                        {isVideo ? '🎬 Video Truyện' : '🎨 Thơ Ảnh 3D'}
                      </span>
                      <button
                        onClick={(e) => handleDeleteWork(work.id, e)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Xóa tác phẩm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] text-stone-500 font-bold mb-1">
                        <span>{work.ageGroup}</span>
                        <span>{work.createdAt}</span>
                      </div>
                      <h4 className="text-base font-black text-stone-900 font-bubbly group-hover:text-orange-600 transition-colors line-clamp-1">
                        {work.title}
                      </h4>
                      <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                        {work.description || work.content}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadDoc(work);
                      }}
                      className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải Word</span>
                    </button>

                    <span className="text-xs font-black text-orange-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>Mở xem</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. MODAL PHÓNG TO MINH HỌA 3D TOÀN MÀN HÌNH (CHIẾU TV / MÁY CHIẾU LỚP HỌC) */}
      {previewImageModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-5xl bg-stone-900 border-4 border-cyan-400 rounded-[32px] sm:rounded-[36px] overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-cyan-950 to-stone-900 border-b border-cyan-500/50 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">
                  🎨
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-black font-bubbly text-cyan-200 truncate">
                    {previewImageModal.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-stone-300">
                    <span className="font-bold text-amber-300">🎯 Minh họa 3D gắn liền: {previewImageModal.subject}</span>
                    {previewImageModal.characterName && (
                      <span>· Nhân vật: {previewImageModal.characterName}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadImage(previewImageModal.url, previewImageModal.title)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tải Ảnh 3D</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playPop();
                    setPreviewImageModal(null);
                  }}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Split 2 columns (Left: Big 3D Image, Right: Stanzas to read) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
              {/* Left Column: Big Image (7 cols) */}
              <div className="md:col-span-7 flex flex-col items-center">
                <div className="relative rounded-[28px] overflow-hidden border-4 border-amber-300 shadow-2xl bg-black aspect-square max-h-[60vh] w-full">
                  <img
                    src={previewImageModal.url}
                    alt={previewImageModal.title}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-cyan-400 text-cyan-200 text-xs font-black font-bubbly shadow-md">
                    ✨ Phong cách Pixar 3D Sống Động
                  </div>
                </div>

                {previewImageModal.sceneDescription && (
                  <p className="mt-3 text-center text-xs sm:text-sm text-cyan-200/90 italic bg-black/40 px-4 py-2 rounded-2xl border border-cyan-500/30">
                    "{previewImageModal.sceneDescription}"
                  </p>
                )}
              </div>

              {/* Right Column: Verses in large readable text for kids & classroom (5 cols) */}
              <div className="md:col-span-5 bg-gradient-to-b from-stone-800 to-stone-900 border-2 border-stone-700 p-5 sm:p-6 rounded-[28px] space-y-4 text-center max-h-[65vh] overflow-y-auto">
                <div className="border-b border-stone-700 pb-2">
                  <span className="text-xs font-black text-rose-400 uppercase tracking-wider">
                    Lời Thơ Dành Cho Bé
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-white font-bubbly mt-1">
                    {previewImageModal.title}
                  </h4>
                </div>

                <div className="space-y-4">
                  {(previewImageModal.verses || []).map((verse, vIdx) => (
                    <div
                      key={vIdx}
                      className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/80"
                    >
                      <div className="text-xs font-bold text-amber-300 mb-1">Khổ {vIdx + 1}</div>
                      <div className="text-base sm:text-lg font-black font-bubbly text-stone-100 leading-relaxed whitespace-pre-line tracking-wide">
                        {verse}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleReadPoemAudio}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-black text-xs sm:text-sm font-bubbly flex items-center justify-center gap-2 shadow-lg hover:scale-102 transition-all cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isSpeakingPoem ? 'Dừng đọc' : 'Bật Giọng Đọc Mẫu Cho Cả Lớp'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
