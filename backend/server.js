/**
 * Основной файл сервера ResumeMint.ru
 * Настройка Express сервера с middleware и маршрутами
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Инициализация OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here'
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `resume-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'application/pdf'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Неподдерживаемый тип файла. Разрешены: .docx, .doc, .txt, .pdf'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1
  }
});

// Простая функция для извлечения текста из файла
async function extractTextFromFile(file) {
  const filePath = file.path;
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (ext === '.txt') {
    return await fs.readFile(filePath, 'utf8');
  } else if (ext === '.pdf') {
    // Для PDF возвращаем заглушку, так как нужна библиотека pdf-parse
    return `[PDF файл: ${file.originalname}] Содержимое PDF файла будет извлечено при полной настройке.`;
  } else if (ext === '.docx' || ext === '.doc') {
    // Для Word файлов возвращаем заглушку
    return `[Word файл: ${file.originalname}] Содержимое Word файла будет извлечено при полной настройке.`;
  }
  
  return 'Неизвестный формат файла';
}

// Функция AI анализа с использованием OpenAI
async function analyzeResumeWithAI(resumeText) {
  try {
    const systemPrompt = `Ты — эксперт по резюме, ATS-системам, карьерному развитию и системе IT-грейдов. 

Твоя задача — проанализировать резюме кандидата и дать детальную оценку по следующим критериям:

1. Структура и содержание резюме
2. Совместимость с ATS-системами
3. Соответствие современным HR-стандартам
4. Определение IT-грейда (Junior/Middle/Senior/Lead)

Анализируй резюме на русском языке и давай ответ в следующем формате:

# Анализ резюме

## 1. Структура и содержание
- Контактные данные
- Цель / Желаемая должность
- Опыт работы
- Образование
- Навыки

## 2. Совместимость с ATS
- Формат резюме
- Ключевые слова
- Структура

## 3. Анализ по HR-стандартам
- Достижения с цифрами
- Уровень языков
- Релевантный опыт

## 4. Определение IT-грейда
- Опыт работы
- Навыки
- Самостоятельность
- Сложность задач
- Уровень ответственности

## Итоговый отчет
- Сильные стороны ✅
- Недочеты ⚠️
- Что добавить 🔧
- Итоговая оценка грейда

Также дай краткую оценку в JSON формате:
{
  "grade": "Junior/Middle/Senior/Lead",
  "atsScore": число от 0 до 100,
  "skills": ["найденные навыки"],
  "recommendations": ["рекомендации"],
  "strongPoints": ["сильные стороны"],
  "weakPoints": ["недочеты"]
}`;

    const userPrompt = `Проанализируй следующее резюме:

${resumeText}

Дай детальный анализ в указанном формате и JSON с оценкой.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const response = completion.choices[0].message.content;
    
    // Пытаемся извлечь JSON из ответа
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const jsonData = JSON.parse(jsonMatch[0]);
        return {
          ...jsonData,
          detailedAnalysis: response.replace(jsonMatch[0], '').trim()
        };
      } catch (e) {
        console.error('Ошибка парсинга JSON:', e);
      }
    }
    
    // Если JSON не найден, возвращаем базовый анализ
    return {
      grade: 'Не определен',
      atsScore: 60,
      skills: [],
      recommendations: ['Ошибка анализа'],
      strongPoints: [],
      weakPoints: [],
      detailedAnalysis: response
    };
    
  } catch (error) {
    console.error('Ошибка OpenAI API:', error);
    
    // Возвращаем базовый анализ при ошибке
    return {
      grade: 'Ошибка API',
      atsScore: 0,
      skills: [],
      recommendations: ['Ошибка подключения к AI. Попробуйте позже.'],
      strongPoints: [],
      weakPoints: [],
      detailedAnalysis: 'Ошибка подключения к AI сервису. Попробуйте позже.'
    };
  }
}



// API endpoints
app.post('/api/resume/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: 'Файл не загружен' }
      });
    }
    
    console.log('Обработка файла:', req.file.originalname);
    
    // Извлекаем текст из файла
    const resumeText = await extractTextFromFile(req.file);
    
    // Анализируем резюме
    const analysisResult = await analyzeResumeWithAI(resumeText);
    
    res.json({
      success: true,
      message: 'Резюме успешно проанализировано',
      data: analysisResult
    });
    
  } catch (error) {
    console.error('Ошибка при обработке файла:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Ошибка при обработке файла' }
    });
  }
});

app.post('/api/resume/analyze-text', async (req, res) => {
  try {
    const { resumeText } = req.body;
    
    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: { message: 'Текст резюме слишком короткий. Минимум 50 символов.' }
      });
    }
    
    console.log('Анализ текстового резюме');
    
    // Анализируем резюме
    const analysisResult = await analyzeResumeWithAI(resumeText.trim());
    
    res.json({
      success: true,
      message: 'Резюме успешно проанализировано',
      data: analysisResult
    });
    
  } catch (error) {
    console.error('Ошибка при анализе текста:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Ошибка при анализе резюме' }
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'ResumeMint API',
    version: '1.0.0'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Маршрут не найден',
    code: 'ROUTE_NOT_FOUND',
    path: req.originalUrl
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Ошибка сервера:', error);
  res.status(500).json({
    success: false,
    error: { message: error.message || 'Внутренняя ошибка сервера' }
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 ResumeMint API сервер запущен на порту ${PORT}`);
  console.log(`🔗 API доступен по адресу: http://localhost:${PORT}/api`);
});

module.exports = app;
