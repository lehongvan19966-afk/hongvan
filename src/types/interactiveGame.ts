export interface GameOption {
  id: string;
  text: string;
  emoji: string;
  isCorrect: boolean;
}

export interface MatchPair {
  left: string;
  leftEmoji: string;
  right: string;
  rightEmoji: string;
}

export interface GameQuestion {
  id: string;
  question: string;
  options: GameOption[];
  correctOptionId: string;
  correctAnswerText: string;
  explanation: string;
  category?: string;
  subject?: string;
  ageGroup?: string;
  matchPair?: MatchPair;
  bubbleTarget?: string;
  bubbleDistractors?: string[];
  sortBasket?: string;
}

export type InteractiveGameMode =
  | 'lucky-wheel'
  | 'smart-sort'
  | 'bubble-pop'
  | 'memory-match'
  | 'speed-quiz'
  | 'whack-ball'
  | 'secret-doors'
  | 'claw-machine'
  | 'target-throw'
  | 'knowledge-train';

export interface GameModeInfo {
  id: InteractiveGameMode;
  title: string;
  badge: string;
  icon: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  description: string;
  skills: string;
}
