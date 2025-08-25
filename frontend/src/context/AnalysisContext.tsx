import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AnalysisState, AnalysisAction } from '../types';

// Начальное состояние
const initialState: AnalysisState = {
  resume: {
    text: '',
    analysis: null,
    isLoading: false,
    error: null,
  },
  vacancy: {
    text: '',
    analysis: null,
    isLoading: false,
    error: null,
  },
  comparison: {
    result: null,
    isLoading: false,
    error: null,
  },
  coverLetter: {
    content: null,
    isLoading: false,
    error: null,
  },
  questions: {
    list: null,
    isLoading: false,
    error: null,
  },
  editedResume: {
    content: null,
    isLoading: false,
    error: null,
  },
};

// Reducer для управления состоянием
function analysisReducer(state: AnalysisState, action: AnalysisAction): AnalysisState {
  switch (action.type) {
    // Резюме
    case 'SET_RESUME_TEXT':
      return {
        ...state,
        resume: {
          ...state.resume,
          text: action.payload,
        },
      };
    case 'SET_RESUME_ANALYSIS':
      return {
        ...state,
        resume: {
          ...state.resume,
          analysis: action.payload,
          error: null,
        },
      };
    case 'SET_RESUME_LOADING':
      return {
        ...state,
        resume: {
          ...state.resume,
          isLoading: action.payload,
        },
      };
    case 'SET_RESUME_ERROR':
      return {
        ...state,
        resume: {
          ...state.resume,
          error: action.payload,
          isLoading: false,
        },
      };

    // Вакансия
    case 'SET_VACANCY_TEXT':
      return {
        ...state,
        vacancy: {
          ...state.vacancy,
          text: action.payload,
        },
      };
    case 'SET_VACANCY_ANALYSIS':
      return {
        ...state,
        vacancy: {
          ...state.vacancy,
          analysis: action.payload,
          error: null,
        },
      };
    case 'SET_VACANCY_LOADING':
      return {
        ...state,
        vacancy: {
          ...state.vacancy,
          isLoading: action.payload,
        },
      };
    case 'SET_VACANCY_ERROR':
      return {
        ...state,
        vacancy: {
          ...state.vacancy,
          error: action.payload,
          isLoading: false,
        },
      };

    // Сравнение
    case 'SET_COMPARISON_RESULT':
      return {
        ...state,
        comparison: {
          ...state.comparison,
          result: action.payload,
          error: null,
        },
      };
    case 'SET_COMPARISON_LOADING':
      return {
        ...state,
        comparison: {
          ...state.comparison,
          isLoading: action.payload,
        },
      };
    case 'SET_COMPARISON_ERROR':
      return {
        ...state,
        comparison: {
          ...state.comparison,
          error: action.payload,
          isLoading: false,
        },
      };

    // Сопроводительное письмо
    case 'SET_COVER_LETTER':
      return {
        ...state,
        coverLetter: {
          ...state.coverLetter,
          content: action.payload,
          error: null,
        },
      };
    case 'SET_COVER_LETTER_LOADING':
      return {
        ...state,
        coverLetter: {
          ...state.coverLetter,
          isLoading: action.payload,
        },
      };
    case 'SET_COVER_LETTER_ERROR':
      return {
        ...state,
        coverLetter: {
          ...state.coverLetter,
          error: action.payload,
          isLoading: false,
        },
      };

    // Уточняющие вопросы
    case 'SET_QUESTIONS':
      return {
        ...state,
        questions: {
          ...state.questions,
          list: action.payload,
          error: null,
        },
      };
    case 'SET_QUESTIONS_LOADING':
      return {
        ...state,
        questions: {
          ...state.questions,
          isLoading: action.payload,
        },
      };
    case 'SET_QUESTIONS_ERROR':
      return {
        ...state,
        questions: {
          ...state.questions,
          error: action.payload,
          isLoading: false,
        },
      };

    // Отредактированное резюме
    case 'SET_EDITED_RESUME':
      return {
        ...state,
        editedResume: {
          ...state.editedResume,
          content: action.payload,
          error: null,
        },
      };
    case 'SET_EDITED_RESUME_LOADING':
      return {
        ...state,
        editedResume: {
          ...state.editedResume,
          isLoading: action.payload,
        },
      };
    case 'SET_EDITED_RESUME_ERROR':
      return {
        ...state,
        editedResume: {
          ...state.editedResume,
          error: action.payload,
          isLoading: false,
        },
      };

    // Сброс всего состояния
    case 'RESET_ANALYSIS':
      return initialState;

    default:
      return state;
  }
}

// Создание контекста
interface AnalysisContextType {
  state: AnalysisState;
  dispatch: React.Dispatch<AnalysisAction>;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

// Provider компонент
interface AnalysisProviderProps {
  children: ReactNode;
}

export function AnalysisProvider({ children }: AnalysisProviderProps) {
  const [state, dispatch] = useReducer(analysisReducer, initialState);

  return (
    <AnalysisContext.Provider value={{ state, dispatch }}>
      {children}
    </AnalysisContext.Provider>
  );
}

// Hook для использования контекста
export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}

// Вспомогательные функции для работы с состоянием
export function useResumeAnalysis() {
  const { state, dispatch } = useAnalysis();
  
  const setResumeText = (text: string) => {
    dispatch({ type: 'SET_RESUME_TEXT', payload: text });
  };
  
  const setResumeAnalysis = (analysis: any) => {
    dispatch({ type: 'SET_RESUME_ANALYSIS', payload: analysis });
  };
  
  const setResumeLoading = (loading: boolean) => {
    dispatch({ type: 'SET_RESUME_LOADING', payload: loading });
  };
  
  const setResumeError = (error: string | null) => {
    dispatch({ type: 'SET_RESUME_ERROR', payload: error });
  };
  
  return {
    resume: state.resume,
    setResumeText,
    setResumeAnalysis,
    setResumeLoading,
    setResumeError,
  };
}

export function useVacancyAnalysis() {
  const { state, dispatch } = useAnalysis();
  
  const setVacancyText = (text: string) => {
    dispatch({ type: 'SET_VACANCY_TEXT', payload: text });
  };
  
  const setVacancyAnalysis = (analysis: any) => {
    dispatch({ type: 'SET_VACANCY_ANALYSIS', payload: analysis });
  };
  
  const setVacancyLoading = (loading: boolean) => {
    dispatch({ type: 'SET_VACANCY_LOADING', payload: loading });
  };
  
  const setVacancyError = (error: string | null) => {
    dispatch({ type: 'SET_VACANCY_ERROR', payload: error });
  };
  
  return {
    vacancy: state.vacancy,
    setVacancyText,
    setVacancyAnalysis,
    setVacancyLoading,
    setVacancyError,
  };
}

export function useComparison() {
  const { state, dispatch } = useAnalysis();
  
  const setComparisonResult = (result: any) => {
    dispatch({ type: 'SET_COMPARISON_RESULT', payload: result });
  };
  
  const setComparisonLoading = (loading: boolean) => {
    dispatch({ type: 'SET_COMPARISON_LOADING', payload: loading });
  };
  
  const setComparisonError = (error: string | null) => {
    dispatch({ type: 'SET_COMPARISON_ERROR', payload: error });
  };
  
  return {
    comparison: state.comparison,
    setComparisonResult,
    setComparisonLoading,
    setComparisonError,
  };
}

export function useCoverLetter() {
  const { state, dispatch } = useAnalysis();
  
  const setCoverLetter = (content: any) => {
    dispatch({ type: 'SET_COVER_LETTER', payload: content });
  };
  
  const setCoverLetterLoading = (loading: boolean) => {
    dispatch({ type: 'SET_COVER_LETTER_LOADING', payload: loading });
  };
  
  const setCoverLetterError = (error: string | null) => {
    dispatch({ type: 'SET_COVER_LETTER_ERROR', payload: error });
  };
  
  return {
    coverLetter: state.coverLetter,
    setCoverLetter,
    setCoverLetterLoading,
    setCoverLetterError,
  };
}

export function useQuestions() {
  const { state, dispatch } = useAnalysis();
  
  const setQuestions = (list: any) => {
    dispatch({ type: 'SET_QUESTIONS', payload: list });
  };
  
  const setQuestionsLoading = (loading: boolean) => {
    dispatch({ type: 'SET_QUESTIONS_LOADING', payload: loading });
  };
  
  const setQuestionsError = (error: string | null) => {
    dispatch({ type: 'SET_QUESTIONS_ERROR', payload: error });
  };
  
  return {
    questions: state.questions,
    setQuestions,
    setQuestionsLoading,
    setQuestionsError,
  };
}

export function useEditedResume() {
  const { state, dispatch } = useAnalysis();
  
  const setEditedResume = (content: any) => {
    dispatch({ type: 'SET_EDITED_RESUME', payload: content });
  };
  
  const setEditedResumeLoading = (loading: boolean) => {
    dispatch({ type: 'SET_EDITED_RESUME_LOADING', payload: loading });
  };
  
  const setEditedResumeError = (error: string | null) => {
    dispatch({ type: 'SET_EDITED_RESUME_ERROR', payload: error });
  };
  
  return {
    editedResume: state.editedResume,
    setEditedResume,
    setEditedResumeLoading,
    setEditedResumeError,
  };
}

export function useResetAnalysis() {
  const { dispatch } = useAnalysis();
  
  const resetAnalysis = () => {
    dispatch({ type: 'RESET_ANALYSIS' });
  };
  
  return { resetAnalysis };
}
