
export interface Lesson {
  id: string;
  title: string;
  content: string;
  pages: LessonPage[];
  createdAt: string;
  updatedAt: string;
}

export interface LessonPage {
  id: string;
  pageNumber: number;
  chunks: ContentChunk[];
}

export interface ContentChunk {
  id: string;
  text: string;
  recallText?: string; // Text with blanks for recall phase
  blanks?: Blank[];
}

export interface Blank {
  word: string;
  startIndex: number;
  endIndex: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface UserProgress {
  lessonId: string;
  currentPage: number;
  currentChunk: number;
  phase: 'typing' | 'recall' | 'quiz' | 'completed';
  completedChunks: string[];
  score: number;
  accuracy: number;
  lastActivity: string;
  completed?: boolean;
  overallProgress?: number;
}

export interface UserStats {
  totalLessons: number;
  completedLessons: number;
  totalScore: number;
  averageAccuracy: number;
  streak: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}
