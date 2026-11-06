export type AcademicGroup = 'Science' | 'Business Studies' | 'Humanities' | 'General';

export type ExamVersion = 'Bangla Version' | 'English Version' | 'General / Both';

export type QuestionType = 'CQ' | 'MCQ' | 'Short';

export interface ExamQuestion {
  id: string;
  paperId: string;
  number: string;
  type: QuestionType;
  stem?: string | null;
  text: string;
  subQuestions?: string[];
  options?: string[];
  marks?: string | null;
  subject: string;
  subjectBn: string;
  batch: string;
  quizRound: string;
  yearLevel: string;
  group: AcademicGroup;
}

export interface ExamPaper {
  id: string;
  fileId: string;
  batch: string;
  batchNumber: number;
  session: string;
  group: AcademicGroup;
  groupBn: string;
  subject: string;
  subjectBn: string;
  version: ExamVersion;
  quizRound: string;
  yearLevel: string;
  format: 'image' | 'pdf';
  title: string;
  originalFileName: string;
  originalPath: string;
  driveUrl: string;
  previewUrl: string;
  downloadUrl: string;
  viewUrl: string;
  verified: boolean;
  hasExtractedQuestions: boolean;
  examHeader?: string | null;
  questionsCount: number;
  questions: ExamQuestion[];
}

export interface FilterState {
  searchQuery: string;
  batch: string;
  group: string;
  subject: string;
  version: string;
  yearLevel: string;
  format: string;
  hasExtractedQuestionsOnly: boolean;
  sortBy: 'newest' | 'oldest' | 'subject_asc' | 'subject_desc' | 'questions_count';
}

export interface ReadingPreferences {
  fontSize: 'standard' | 'medium' | 'large';
  readingWidth: 'standard' | 'wide' | 'full';
  preferViewMode: 'split' | 'digital' | 'original';
}

export interface BookmarkStore {
  savedPaperIds: string[];
  savedQuestionIds: string[];
}

export interface HistoryItem {
  id: string;
  type: 'paper' | 'question';
  title: string;
  subtitle: string;
  timestamp: number;
}
