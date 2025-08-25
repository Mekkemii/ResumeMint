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
  const strongPoints = [];
  const weakPoints = [];
  
  // Определение уровня
  if (text.includes('senior') || text.includes('lead') || text.includes('руководитель') || text.includes('5 лет') || text.includes('более 5')) {
    level = 'Senior/Lead';
    score += 20;
  } else if (text.includes('middle') || text.includes('опыт 3') || text.includes('опыт 4') || text.includes('3 года')) {
    level = 'Middle';
    score += 15;
  }
  
  // Поиск навыков
  const skillKeywords = [
    'react', 'javascript', 'typescript', 'node.js', 'python', 'java', 'c++', 'c#',
    'html', 'css', 'sql', 'mongodb', 'postgresql', 'docker', 'kubernetes', 'aws',
    'git', 'agile', 'scrum', 'figma', 'photoshop', 'illustrator', 'osint', 'kyc', 'aml'
  ];
  
  skillKeywords.forEach(skill => {
    if (text.includes(skill)) {
      skills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  });
  
  // Анализ структуры
  if (text.includes('телефон') || text.includes('email') || text.includes('контакт')) {
    strongPoints.push('Контактные данные указаны');
  } else {
    weakPoints.push('Отсутствуют контактные данные');
  }
  
  if (text.includes('опыт работы') || text.includes('место работы')) {
    strongPoints.push('Опыт работы структурирован');
  } else {
    weakPoints.push('Опыт работы не структурирован');
  }
  
  if (text.includes('образование')) {
    strongPoints.push('Образование указано');
  } else {
    weakPoints.push('Информация об образовании отсутствует');
  }
  
  if (text.includes('навыки') || text.includes('skills')) {
    strongPoints.push('Навыки выделены отдельным блоком');
  } else {
    weakPoints.push('Навыки не структурированы');
  }
  
  // Анализ достижений
  if (text.includes('%') || text.includes('процент') || text.includes('увеличил') || text.includes('снизил')) {
    strongPoints.push('Есть конкретные достижения с цифрами');
  } else {
    weakPoints.push('Отсутствуют конкретные достижения с цифрами');
  }
  
  // Анализ языков
  if (text.includes('английский') || text.includes('english')) {
    strongPoints.push('Указан уровень английского языка');
  } else {
    weakPoints.push('Не указан уровень английского языка');
  }
  
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
  if (!text.includes('достижения')) {
    recommendations.push('Добавьте конкретные достижения с цифрами');
  }
  
  // Увеличиваем оценку за наличие ключевых элементов
  if (text.includes('опыт работы')) score += 10;
  if (text.includes('образование')) score += 10;
  if (text.includes('навыки')) score += 10;
  if (text.includes('проект')) score += 5;
  if (text.includes('достижения')) score += 10;
  
  score = Math.min(score, 100);
  
  // Генерируем детальный анализ
  const analysis = {
    grade: level,
    atsScore: score,
    skills: skills,
    recommendations: recommendations,
    strongPoints: strongPoints,
    weakPoints: weakPoints,
    detailedAnalysis: generateDetailedAnalysis(resumeText, level, score, skills, strongPoints, weakPoints, recommendations)
  };
  
  return analysis;
}

function generateDetailedAnalysis(resumeText, level, score, skills, strongPoints, weakPoints, recommendations) {
  const text = resumeText.toLowerCase();
  
  let analysis = `# Анализ резюме\n\n`;
  
  // 1. Структура и содержание
  analysis += `## 1. Структура и содержание\n`;
  
  if (text.includes('телефон') || text.includes('email')) {
    analysis += `Контактные данные: ${text.includes('телефон') && text.includes('email') ? 'Полные' : 'Частично указаны'}, включают ${text.includes('телефон') ? 'телефон' : ''}${text.includes('телефон') && text.includes('email') ? ', ' : ''}${text.includes('email') ? 'email' : ''} — ${text.includes('телефон') && text.includes('email') ? 'отлично' : 'требует дополнения'}.\n\n`;
  } else {
    analysis += `Контактные данные: Отсутствуют — критично для HR.\n\n`;
  }
  
  if (text.includes('цель') || text.includes('должность')) {
    analysis += `Цель / Желаемая должность: ${text.includes('цель') ? 'Указана' : 'Не указана'} — ${text.includes('цель') ? 'хорошо' : 'нужно добавить'}.\n\n`;
  } else {
    analysis += `Цель / Желаемая должность: Не указана — рекомендуется добавить.\n\n`;
  }
  
  if (text.includes('опыт работы')) {
    analysis += `Опыт работы: ${text.includes('опыт работы') ? 'Приведен' : 'Не структурирован'}. ${text.includes('достижения') ? 'Есть описание достижений' : 'Нет конкретных достижений'}.\n\n`;
  } else {
    analysis += `Опыт работы: Не структурирован — критично для оценки кандидата.\n\n`;
  }
  
  if (text.includes('образование')) {
    analysis += `Образование: Указано — хорошо для HR-оценки.\n\n`;
  } else {
    analysis += `Образование: Не указано — может снизить шансы.\n\n`;
  }
  
  if (skills.length > 0) {
    analysis += `Навыки: Выделены отдельным блоком (${skills.join(', ')}).\n\n`;
  } else {
    analysis += `Навыки: Не структурированы — рекомендуется выделить отдельным блоком.\n\n`;
  }
  
  // 2. Совместимость с ATS
  analysis += `## 2. Совместимость с ATS\n`;
  analysis += `Формат резюме: ${text.includes('pdf') ? 'PDF формат' : 'Текстовый формат'} — ${text.includes('pdf') ? 'хорошо для ATS' : 'подходит для ATS'}.\n\n`;
  
  if (text.includes('таблица') || text.includes('график')) {
    analysis += `Внимание: Использование таблиц или графиков может затруднить сканирование ATS.\n\n`;
  } else {
    analysis += `Отсутствуют сложные графические элементы — отлично для ATS.\n\n`;
  }
  
  if (skills.length > 0) {
    analysis += `Ключевые слова: ${skills.length} технических навыков обнаружено — ${skills.length >= 5 ? 'хорошо' : 'можно добавить больше'}.\n\n`;
  } else {
    analysis += `Ключевые слова: Недостаточно технических терминов — критично для ATS.\n\n`;
  }
  
  // 3. Анализ по HR-стандартам
  analysis += `## 3. Анализ по современным HR-стандартам (2024-2025)\n`;
  
  if (text.includes('%') || text.includes('процент')) {
    analysis += `Достижения с цифрами: Есть — отлично для HR.\n\n`;
  } else {
    analysis += `Достижения с цифрами: Отсутствуют — рекомендуется добавить.\n\n`;
  }
  
  if (text.includes('английский') || text.includes('english')) {
    analysis += `Уровень английского: Указан — соответствует стандартам.\n\n`;
  } else {
    analysis += `Уровень английского: Не указан — может снизить шансы.\n\n`;
  }
  
  if (text.includes('опыт') && (text.includes('3') || text.includes('4') || text.includes('5'))) {
    analysis += `Релевантный опыт: Есть — соответствует требованиям рынка.\n\n`;
  } else {
    analysis += `Релевантный опыт: Недостаточно детализирован.\n\n`;
  }
  
  // 4. Определение IT-грейда
  analysis += `## 4. Определение IT-грейда кандидата\n`;
  
  let experienceYears = 0;
  if (text.includes('5 лет') || text.includes('более 5')) experienceYears = 5;
  else if (text.includes('4 года') || text.includes('4 лет')) experienceYears = 4;
  else if (text.includes('3 года') || text.includes('3 лет')) experienceYears = 3;
  else if (text.includes('2 года') || text.includes('2 лет')) experienceYears = 2;
  else if (text.includes('1 год') || text.includes('1 лет')) experienceYears = 1;
  
  analysis += `Опыт: ${experienceYears > 0 ? experienceYears + ' лет' : 'Не указан'}\n`;
  analysis += `Навыки: ${skills.length} технических навыков\n`;
  analysis += `Самостоятельность: ${text.includes('проект') ? 'Есть собственные проекты' : 'Не указано'}\n`;
  analysis += `Сложность задач: ${text.includes('руководитель') ? 'Высокая' : text.includes('middle') ? 'Средняя' : 'Базовая'}\n`;
  analysis += `Уровень ответственности: ${text.includes('руководитель') ? 'Высокий' : text.includes('проект') ? 'Средний' : 'Базовый'}\n\n`;
  
  analysis += `Оценка:\n`;
  analysis += `[${level}] — ${level === 'Senior/Lead' ? 'Опыт более 5 лет, сложные задачи, высокая ответственность' : level === 'Middle' ? 'Опыт 3-5 лет, средняя сложность задач' : 'Начальный уровень, базовые задачи'}.\n\n`;
  
  // Итоговый отчет
  analysis += `## Итоговый отчет\n`;
  
  if (strongPoints.length > 0) {
    analysis += `Сильные стороны ✅\n`;
    strongPoints.forEach(point => {
      analysis += `${point}\n`;
    });
    analysis += `\n`;
  }
  
  if (weakPoints.length > 0) {
    analysis += `Недочеты ⚠️\n`;
    weakPoints.forEach(point => {
      analysis += `${point}\n`;
    });
    analysis += `\n`;
  }
  
  if (recommendations.length > 0) {
    analysis += `Что добавить 🔧\n`;
    recommendations.forEach(rec => {
      analysis += `${rec}\n`;
    });
    analysis += `\n`;
  }
  
  analysis += `Пока итог:\n`;
  analysis += `[${level}] — обоснование: ${level === 'Senior/Lead' ? '5+ лет опыта, проекты с самостоятельной ответственностью' : level === 'Middle' ? '3-5 лет опыта, средняя сложность задач' : 'Начальный уровень, базовые навыки'}.\n\n`;
  
  analysis += `ATS-оценка: ${score}/100 — ${score >= 80 ? 'Отлично' : score >= 60 ? 'Хорошо' : 'Требует доработки'}.\n`;
  
  return analysis;
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
