import axios, { AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, ApiError } from '../types';

// Создание экземпляра axios с базовой конфигурацией
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 30000, // 30 секунд
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для обработки запросов
api.interceptors.request.use(
  (config) => {
    // Добавляем логирование запросов в режиме разработки
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ответов
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Добавляем логирование ответов в режиме разработки
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error: AxiosError<ApiError>) => {
    console.error('API Response Error:', error);
    
    // Обработка различных типов ошибок
    if (error.response) {
      // Сервер вернул ответ с ошибкой
      const errorData = error.response.data;
      console.error('Server Error:', errorData);
      
      // Можно добавить обработку специфических ошибок
      if (error.response.status === 401) {
        // Обработка ошибки авторизации
        console.error('Unauthorized access');
      } else if (error.response.status === 429) {
        // Обработка ошибки rate limiting
        console.error('Rate limit exceeded');
      }
    } else if (error.request) {
      // Запрос был отправлен, но ответ не получен
      console.error('Network Error:', error.request);
    } else {
      // Ошибка при настройке запроса
      console.error('Request Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Типы для API методов
export interface ResumeUploadData {
  resumeText?: string;
  file?: File;
}

export interface VacancyAnalysisData {
  vacancyText?: string;
  vacancyUrl?: string;
  jobTitle?: string;
  company?: string;
}

export interface ComparisonData {
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

export interface ResumeEditData {
  originalResume: string;
  targetVacancy: {
    requirements: string[];
    requiredGrade: string;
  };
  focusAreas?: string[];
}

// API методы для работы с резюме
export const resumeAPI = {
  // Загрузка и анализ резюме
  uploadAndAnalyze: async (data: ResumeUploadData): Promise<ApiResponse<any>> => {
    const formData = new FormData();
    
    if (data.file) {
      formData.append('resume', data.file);
    }
    
    if (data.resumeText) {
      formData.append('resumeText', data.resumeText);
    }
    
    const response = await api.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Анализ текстового резюме
  analyzeText: async (resumeText: string): Promise<ApiResponse<any>> => {
    const response = await api.post('/resume/analyze-text', { resumeText });
    return response.data;
  },

  // Редактирование резюме
  editResume: async (data: ResumeEditData): Promise<ApiResponse<any>> => {
    const response = await api.post('/resume/edit', data);
    return response.data;
  },

  // Получение примера резюме
  getSample: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/resume/sample');
    return response.data;
  },

  // Валидация резюме
  validate: async (resumeText: string): Promise<ApiResponse<any>> => {
    const response = await api.post('/resume/validate', { resumeText });
    return response.data;
  },

  // Получение информации о форматах
  getFormats: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/resume/formats');
    return response.data;
  },
};

// API методы для работы с вакансиями
export const vacancyAPI = {
  // Анализ вакансии
  analyze: async (data: VacancyAnalysisData): Promise<ApiResponse<any>> => {
    const response = await api.post('/vacancy/analyze', data);
    return response.data;
  },

  // Парсинг вакансии по URL
  parseUrl: async (vacancyUrl: string): Promise<ApiResponse<any>> => {
    const response = await api.post('/vacancy/parse-url', { vacancyUrl });
    return response.data;
  },

  // Получение примера вакансии
  getSample: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/vacancy/sample');
    return response.data;
  },

  // Валидация вакансии
  validate: async (vacancyText: string): Promise<ApiResponse<any>> => {
    const response = await api.post('/vacancy/validate', { vacancyText });
    return response.data;
  },

  // Получение информации о грейдах
  getGradeInfo: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/vacancy/grade-info');
    return response.data;
  },
};

// API методы для комплексного анализа
export const analysisAPI = {
  // Сравнение резюме с вакансией
  compare: async (data: ComparisonData): Promise<ApiResponse<any>> => {
    const response = await api.post('/analysis/compare', data);
    return response.data;
  },

  // Генерация сопроводительного письма
  generateCoverLetter: async (data: ComparisonData): Promise<ApiResponse<any>> => {
    const response = await api.post('/analysis/cover-letter', data);
    return response.data;
  },

  // Генерация уточняющих вопросов
  generateQuestions: async (data: ComparisonData): Promise<ApiResponse<any>> => {
    const response = await api.post('/analysis/questions', data);
    return response.data;
  },

  // Полный анализ
  fullAnalysis: async (data: {
    resumeText: string;
    vacancyText: string;
    jobTitle?: string;
    company?: string;
  }): Promise<ApiResponse<any>> => {
    const response = await api.post('/analysis/full-analysis', data);
    return response.data;
  },

  // Получение примера сравнения
  getSampleComparison: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/analysis/sample-comparison');
    return response.data;
  },

  // Расчет ATS-совместимости
  calculateATSScore: async (data: {
    resumeText: string;
    targetKeywords?: string[];
  }): Promise<ApiResponse<any>> => {
    const response = await api.post('/analysis/ats-score', data);
    return response.data;
  },
};

// Общие API методы
export const commonAPI = {
  // Проверка здоровья API
  health: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/health');
    return response.data;
  },
};

// Вспомогательные функции
export const apiUtils = {
  // Обработка ошибок API
  handleError: (error: AxiosError<ApiError>): string => {
    if (error.response?.data?.error?.message) {
      return error.response.data.error.message;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return 'Произошла неизвестная ошибка';
  },

  // Проверка успешности ответа
  isSuccess: (response: ApiResponse<any>): boolean => {
    return response.success === true;
  },

  // Извлечение данных из ответа
  extractData: <T>(response: ApiResponse<T>): T => {
    return response.data;
  },
};

export default api;
