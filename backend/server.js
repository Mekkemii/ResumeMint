/**
 * Основной файл сервера ResumeMint.ru
 * Настройка Express сервера с middleware и маршрутами
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 5000;

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

// Простая функция AI анализа (заглушка)
function analyzeResumeWithAI(resumeText) {
  // Простой анализ на основе ключевых слов
  const text = resumeText.toLowerCase();
  
  let level = 'Junior';
  let score = 60;
  const skills = [];
  const recommendations = [];
  
  // Определение уровня
  if (text.includes('senior') || text.includes('lead') || text.includes('руководитель')) {
    level = 'Senior/Lead';
    score += 20;
  } else if (text.includes('middle') || text.includes('опыт 3') || text.includes('опыт 4')) {
    level = 'Middle';
    score += 15;
  }
  
  // Поиск навыков
  const skillKeywords = [
    'react', 'javascript', 'typescript', 'node.js', 'python', 'java', 'c++', 'c#',
    'html', 'css', 'sql', 'mongodb', 'postgresql', 'docker', 'kubernetes', 'aws',
    'git', 'agile', 'scrum', 'figma', 'photoshop', 'illustrator'
  ];
  
  skillKeywords.forEach(skill => {
    if (text.includes(skill)) {
      skills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  });
  
  // Рекомендации
  if (text.length < 200) {
    recommendations.push('Добавьте больше деталей о вашем опыте работы');
  }
  if (!text.includes('опыт')) {
    recommendations.push('Укажите ваш опыт работы');
  }
  if (!text.includes('образование')) {
    recommendations.push('Добавьте информацию об образовании');
  }
  if (skills.length < 3) {
    recommendations.push('Добавьте больше технических навыков');
  }
  
  // Увеличиваем оценку за наличие ключевых элементов
  if (text.includes('опыт работы')) score += 10;
  if (text.includes('образование')) score += 10;
  if (text.includes('навыки')) score += 10;
  if (text.includes('проект')) score += 5;
  
  score = Math.min(score, 100);
  
  return {
    grade: level,
    atsScore: score,
    skills: skills,
    recommendations: recommendations
  };
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
    const analysisResult = analyzeResumeWithAI(resumeText);
    
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
    const analysisResult = analyzeResumeWithAI(resumeText.trim());
    
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
