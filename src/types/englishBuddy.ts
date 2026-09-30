export interface StickerItem {
  id: string;
  name: string;
  icon: string;
  title: string;
  description: string;
  rarity: 'gold' | 'rainbow' | 'silver' | 'pink' | 'emerald';
  unlockedAt?: string;
}

export type KidRank = 'xuat_sac' | 'gioi' | 'kha';

export interface GameHonorRecord {
  id: string;
  kidName: string;
  kidAvatar: string;
  gameTitle: string;
  score: number;
  maxScore: number;
  stars: number;
  rank: KidRank;
  rankTitle: string;
  stickerEarned: StickerItem;
  timestamp: string;
}

export interface KidProfile {
  name: string;
  avatar: string; // emoji or icon id
  totalScore: number;
  stickers: StickerItem[];
}

export interface DailyKidSummary {
  kidName: string;
  kidAvatar: string;
  totalScore: number;
  totalGamesPlayed: number;
  totalStars: number;
  stickersEarned: StickerItem[];
  highestRank: KidRank;
  lastPlayedAt: string;
}

