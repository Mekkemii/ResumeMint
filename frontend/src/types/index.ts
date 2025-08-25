// Типы для резюме
export interface ResumeAnalysis {
  grade: 'Junior' | 'Middle' | 'Senior' | 'Lead/Expert';
  gradeReasoning: string;
  atsCompatibility: {
    score: number;
    issues: string[];
    strengths: string[];
  };
  structure: {
    objective: string;
    experience: string;
    education: string;
    skills: string;
    courses: string;
    about: string;
    contacts: string;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  keywords: string[];
}

// Типы для вакансии
export interface VacancyAnalysis {
  requiredGrade: 'Junior' | 'Middle' | 'Senior' | 'Lead/Expert';
  gradeReasoning: string;
  requirements: {
    experience: string;
    technical: string[];
    soft: string[];
    responsibilities: string[];
  };
  keySkills: string[];
  difficulty: string;
  responsibility: string;
}

// Типы для сравнения
export interface ComparisonResult {
  gradeComparison: {
    candidateGrade: string;
    requiredGrade: string;
    match: 'Соответствует' | 'Выше' | 'Ниже';
    gap: string;
  };
  requirementsMatch: {
    covered: string[];
    missing: string[];
    coverage: number;
  };
  chances: 'Высокие' | 'Средние' | 'Низкие';
  chancesReasoning: string;
  developmentAreas: string[];
  recommendations: string[];
  strengths: string[];
}

// Типы для сопроводительного письма
export interface CoverLetter {
  coverLetter: string;
  keyPoints: string[];
  tone: string;
  length: string;
}

// Типы для уточняющих вопросов
export interface ClarificationQuestions {
  questions: Array<{
    category: string;
    question: string;
    purpose: string;
  }>;
  priority: string[];
  expectedAnswers: string;
}

// Типы для редактирования резюме
export interface ResumeEditResult {
  editedResume: string;
  changes: {
    experience: string;
    skills: string;
    keywords: string[];
  };
  atsOptimization: string;
  gradeAdaptation: string;
}

// Типы для API ответов
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

export interface ApiError {
  error: {
    message: string;
    code: string;
    timestamp: string;
    path: string;
    method: string;
  };
}

// Типы для состояния анализа
export interface AnalysisState {
  resume: {
    text: string;
    analysis: ResumeAnalysis | null;
    isLoading: boolean;
    error: string | null;
  };
  vacancy: {
    text: string;
    analysis: VacancyAnalysis | null;
    isLoading: boolean;
    error: string | null;
  };
  comparison: {
    result: ComparisonResult | null;
    isLoading: boolean;
    error: string | null;
  };
  coverLetter: {
    content: CoverLetter | null;
    isLoading: boolean;
    error: string | null;
  };
  questions: {
    list: ClarificationQuestions | null;
    isLoading: boolean;
    error: string | null;
  };
  editedResume: {
    content: ResumeEditResult | null;
    isLoading: boolean;
    error: string | null;
  };
}

// Типы для действий
export type AnalysisAction =
  | { type: 'SET_RESUME_TEXT'; payload: string }
  | { type: 'SET_RESUME_ANALYSIS'; payload: ResumeAnalysis }
  | { type: 'SET_RESUME_LOADING'; payload: boolean }
  | { type: 'SET_RESUME_ERROR'; payload: string | null }
  | { type: 'SET_VACANCY_TEXT'; payload: string }
  | { type: 'SET_VACANCY_ANALYSIS'; payload: VacancyAnalysis }
  | { type: 'SET_VACANCY_LOADING'; payload: boolean }
  | { type: 'SET_VACANCY_ERROR'; payload: string | null }
  | { type: 'SET_COMPARISON_RESULT'; payload: ComparisonResult }
  | { type: 'SET_COMPARISON_LOADING'; payload: boolean }
  | { type: 'SET_COMPARISON_ERROR'; payload: string | null }
  | { type: 'SET_COVER_LETTER'; payload: CoverLetter }
  | { type: 'SET_COVER_LETTER_LOADING'; payload: boolean }
  | { type: 'SET_COVER_LETTER_ERROR'; payload: string | null }
  | { type: 'SET_QUESTIONS'; payload: ClarificationQuestions }
  | { type: 'SET_QUESTIONS_LOADING'; payload: boolean }
  | { type: 'SET_QUESTIONS_ERROR'; payload: string | null }
  | { type: 'SET_EDITED_RESUME'; payload: ResumeEditResult }
  | { type: 'SET_EDITED_RESUME_LOADING'; payload: boolean }
  | { type: 'SET_EDITED_RESUME_ERROR'; payload: string | null }
  | { type: 'RESET_ANALYSIS' };

// Типы для файлов
export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

// Типы для форм
export interface ResumeFormData {
  resumeText: string;
  file: File | null;
}

export interface VacancyFormData {
  vacancyText: string;
  vacancyUrl: string;
  jobTitle: string;
  company: string;
}

export interface ComparisonFormData {
  resumeData: {
    grade: string;
    skills: string[];
    experience: any[];
    text: string;
  };
  vacancyData: {
    requiredGrade: string;
    requirements: string[];
    responsibilities: string[];
    jobTitle: string;
    company: string;
  };
}

// Типы для навигации
export interface NavigationItem {
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// Типы для уведомлений
export interface ToastNotification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
