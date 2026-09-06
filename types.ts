
export interface Lesson {
  id: string;
  title: string;
  content: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  rationale: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  example?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  printifyUrl: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface UserProgressState {
  userId: string;
  lastCompletedStepId: string;
  lastCompletedModuleId?: string;
  completionPercentage: number;
  completedLessonIds: string[];
  completedQuizIds: string[];
  customDataJson?: string;
  updatedAt?: any;
}

export type StemDiscipline = 'Science' | 'Technology' | 'Engineering' | 'Mathematics';

export interface Citation {
  id: string;
  publication: string;
  title: string;
  institutionOrAuthors?: string;
  doiOrUrl?: string;
  date: string;
  region: string;
  peerReviewed: boolean;
}

export interface ConceptExplainer {
  term: string;
  definition: string;
  aiContext: string;
}

export interface StemArticle {
  id: string;
  date: string;
  discipline: StemDiscipline;
  headline: string;
  deck: string;
  readTime: string;
  aiFocusTag: string;
  author: string;
  content: string;
  keyDataPoints: { metric: string; value: string; context: string }[];
  concepts: ConceptExplainer[];
  citations: Citation[];
  regionFocus: string;
  verificationStatus: 'Verified Accredited' | 'Peer-Reviewed Journal' | 'Institutional Publication';
}

