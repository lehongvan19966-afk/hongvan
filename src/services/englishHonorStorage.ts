import { GameHonorRecord, DailyKidSummary, StickerItem, KidRank } from '../types/englishBuddy';
import { PRESCHOOL_STICKERS, INITIAL_HONOR_LEADERBOARD } from '../data/stickersData';

export const getTodayKey = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const STORAGE_KEY_PREFIX = 'english_buddy_records_';

export const getTodayGameRecords = (): GameHonorRecord[] => {
  try {
    const key = STORAGE_KEY_PREFIX + getTodayKey();
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    // Initial seed for demonstration if first time
    const seeded = INITIAL_HONOR_LEADERBOARD.map((item) => ({
      ...item,
      id: item.id + '_' + Date.now(),
      timestamp: 'Hôm nay, ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    }));
    localStorage.setItem(key, JSON.stringify(seeded));
    return seeded;
  } catch {
    return INITIAL_HONOR_LEADERBOARD;
  }
};

export const saveTodayGameRecord = (record: GameHonorRecord): void => {
  try {
    const key = STORAGE_KEY_PREFIX + getTodayKey();
    const existing = getTodayGameRecords();
    const updated = [record, ...existing];
    localStorage.setItem(key, JSON.stringify(updated));

    // Also update generic latest leaderboard
    localStorage.setItem('english_buddy_leaderboard', JSON.stringify(updated.slice(0, 25)));

    // Dispatch custom event for real-time live update on right-hand honor board
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('english_buddy_new_record', { detail: record }));
    }
  } catch (e) {
    console.error('Error saving game record:', e);
  }
};

export const getDailyKidSummaries = (): DailyKidSummary[] => {
  const records = getTodayGameRecords();
  const summaryMap: Record<string, DailyKidSummary> = {};

  for (const rec of records) {
    const name = rec.kidName.trim() || 'Bé Yêu';
    if (!summaryMap[name]) {
      summaryMap[name] = {
        kidName: name,
        kidAvatar: rec.kidAvatar || '👧',
        totalScore: 0,
        totalGamesPlayed: 0,
        totalStars: 0,
        stickersEarned: [],
        highestRank: 'kha',
        lastPlayedAt: rec.timestamp,
      };
    }

    const current = summaryMap[name];
    current.totalScore += rec.score;
    current.totalGamesPlayed += 1;
    current.totalStars += rec.stars;
    if (rec.stickerEarned && !current.stickersEarned.some((s) => s.id === rec.stickerEarned.id)) {
      current.stickersEarned.push(rec.stickerEarned);
    }

    // Determine highest rank achieved
    if (rec.rank === 'xuat_sac') {
      current.highestRank = 'xuat_sac';
    } else if (rec.rank === 'gioi' && current.highestRank !== 'xuat_sac') {
      current.highestRank = 'gioi';
    }
  }

  // Convert to array and sort descending by totalScore, then by totalGamesPlayed
  return Object.values(summaryMap).sort((a, b) => {
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }
    return b.totalGamesPlayed - a.totalGamesPlayed;
  });
};

export const resetTodayRecords = (): void => {
  try {
    const key = STORAGE_KEY_PREFIX + getTodayKey();
    localStorage.removeItem(key);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('english_buddy_new_record'));
    }
  } catch (e) {
    console.error('Error resetting records:', e);
  }
};
