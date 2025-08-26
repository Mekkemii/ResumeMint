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
console.log('=== INITIALIZATION DEBUG ===');
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);
console.log('OPENAI_API_KEY start:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) + '...' : 'none');
console.log('===========================');

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
async function analyzeResumeWithAI(resumeText, questions = {}) {
  try {
    // Проверяем, есть ли API ключ
    console.log('=== API KEY DEBUG ===');
    console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
    console.log('API Key length:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);
    console.log('API Key start:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 15) + '...' : 'none');
    console.log('====================');
    
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here' || process.env.OPENAI_API_KEY.length < 20) {
      console.log('❌ OpenAI API ключ не настроен или неверный');
      console.log('🔄 Используем локальный анализ...');
      return performLocalAnalysis(resumeText, questions);
    }
    
    console.log('✅ OpenAI API ключ найден, используем API');
    console.log('🚀 Отправляем запрос к OpenAI API...');

    const systemPrompt = `Ты — эксперт по резюме, ATS-системам и карьерному развитию в IT-сфере.

Твоя задача — провести детальный анализ резюме и дать профессиональную оценку кандидата.

Алгоритм анализа:

1. АНАЛИЗ СТРУКТУРЫ РЕЗЮМЕ
- Контактные данные (телефон, email, LinkedIn)
- Цель/желаемая должность
- Опыт работы (хронология, достижения, технологии)
- Образование и сертификации
- Навыки (технические и soft skills)
- Дополнительная информация

2. ОПРЕДЕЛЕНИЕ УРОВНЯ КАНДИДАТА
- Junior (0-2 года): базовые навыки, выполнение задач под контролем
- Middle (2-5 лет): уверенная работа, оптимизация решений, помощь коллегам
- Senior (5-8 лет): проектирование архитектуры, сложные задачи, наставничество
- Lead/Expert (8+ лет): руководство командами, стратегические решения

3. ATS-СОВМЕСТИМОСТЬ
- Проверка ключевых слов
- Структура документа
- Форматирование

4. HR-СТАНДАРТЫ 2024
- Конкретные достижения с цифрами
- Уровень английского языка
- Релевантный опыт
- Soft skills

Анализируй резюме на русском языке и давай ответ в следующем формате:

# Анализ резюме

## 1. Структура и содержание
[Оценка каждого раздела резюме]

## 2. Совместимость с ATS
[Оценка оптимизации под системы автоматического отбора]

## 3. Анализ по HR-стандартам
[Соответствие современным требованиям HR]

## 4. Определение уровня кандидата
[Детальное обоснование уровня с указанием ключевых факторов]

## Итоговый отчет
- ✅ Сильные стороны
- ⚠️ Недочеты  
- 🔧 Рекомендации по улучшению

В конце обязательно дай JSON с краткой оценкой:
{
  "grade": "Junior/Middle/Senior/Lead/Expert",
  "atsScore": число от 0 до 100,
  "skills": ["найденные технические навыки"],
  "recommendations": ["конкретные рекомендации"],
  "strongPoints": ["сильные стороны"],
  "weakPoints": ["слабые стороны"]
}`;

    // Формируем дополнительную информацию из вопросов
    let additionalInfo = '';
    if (questions && Object.keys(questions).length > 0) {
      additionalInfo = '\n\nДополнительная информация от кандидата:\n';
      if (questions.desiredPosition) additionalInfo += `- Желаемая должность: ${questions.desiredPosition}\n`;
      if (questions.experienceYears) additionalInfo += `- Опыт работы: ${questions.experienceYears}\n`;
      if (questions.englishLevel) additionalInfo += `- Уровень английского: ${questions.englishLevel}\n`;
      if (questions.desiredSalary) additionalInfo += `- Желаемая зарплата: ${questions.desiredSalary} руб/мес\n`;
      if (questions.relocation) additionalInfo += `- Готовность к переезду: ${questions.relocation}\n`;
    }

    const userPrompt = `Проанализируй следующее резюме:

${resumeText}${additionalInfo}

Дай детальный анализ в указанном формате и JSON с оценкой. Учитывай дополнительную информацию при определении грейда и рекомендаций.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 3000
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
    console.error('❌ Ошибка OpenAI API:', error.message);
    
    // Возвращаем локальный анализ при ошибке API
    console.log('🔄 Используем локальный анализ из-за ошибки API');
    return performLocalAnalysis(resumeText, questions);
  }
}

// Локальный анализ резюме (без OpenAI)
function performLocalAnalysis(resumeText, questions = {}) {
  const text = resumeText.toLowerCase();
  
  let level = 'Junior';
  let score = 60;
  const skills = [];
  const recommendations = [];
  const strongPoints = [];
  const weakPoints = [];
  
  // Определение уровня по новым критериям (с учетом вопросов)
  if (questions.experienceYears) {
    if (questions.experienceYears === '8+') {
      level = 'Lead/Expert';
      score += 25;
    } else if (questions.experienceYears === '5-8') {
      level = 'Senior';
      score += 20;
    } else if (questions.experienceYears === '3-5' || questions.experienceYears === '2-3') {
      level = 'Middle';
      score += 15;
    } else {
      level = 'Junior';
      score += 10;
    }
  } else {
    // Определение по тексту резюме
    if (text.includes('8 лет') || text.includes('более 8') || text.includes('expert') || text.includes('руководитель') || text.includes('team lead') || text.includes('директор')) {
      level = 'Lead/Expert';
      score += 25;
    } else if (text.includes('5 лет') || text.includes('более 5') || text.includes('senior') || text.includes('архитектор') || text.includes('проектирование') || text.includes('ведущий')) {
      level = 'Senior';
      score += 20;
    } else if (text.includes('3 года') || text.includes('4 года') || text.includes('middle') || text.includes('опыт 3') || text.includes('опыт 4')) {
      level = 'Middle';
      score += 15;
    } else if (text.includes('1 год') || text.includes('2 года') || text.includes('junior') || text.includes('опыт 1') || text.includes('опыт 2')) {
      level = 'Junior';
      score += 10;
    }
  }
  
  // Поиск навыков (универсальные)
  const skillKeywords = [
    // IT навыки
    'react', 'javascript', 'typescript', 'node.js', 'python', 'java', 'c++', 'c#',
    'html', 'css', 'sql', 'mongodb', 'postgresql', 'docker', 'kubernetes', 'aws',
    'git', 'agile', 'scrum', 'figma', 'photoshop', 'illustrator',
    // Бизнес навыки
    'excel', 'powerpoint', 'word', 'power bi', 'tableau', 'salesforce', 'crm',
    'маркетинг', 'продажи', 'аналитика', 'финансы', 'бухгалтерия', 'hr',
    // Языки
    'английский', 'english', 'немецкий', 'французский', 'китайский',
    // Другие
    'osint', 'kyc', 'aml', 'проект', 'менеджмент', 'лидерство'
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
  
  // Анализ языков (с учетом вопросов)
  if (questions.englishLevel) {
    strongPoints.push(`Указан уровень английского языка: ${questions.englishLevel}`);
    if (questions.englishLevel === 'C1' || questions.englishLevel === 'C2') {
      score += 15;
    } else if (questions.englishLevel === 'B2') {
      score += 10;
    } else if (questions.englishLevel === 'B1') {
      score += 5;
    }
  } else if (text.includes('английский') || text.includes('english')) {
    strongPoints.push('Указан уровень английского языка');
  } else {
    weakPoints.push('Не указан уровень английского языка');
  }
  
  // Рекомендации (с учетом вопросов)
  if (questions.desiredPosition) {
    strongPoints.push(`Указана желаемая должность: ${questions.desiredPosition}`);
    score += 5;
  }
  
  if (questions.desiredSalary) {
    strongPoints.push(`Указана желаемая зарплата: ${questions.desiredSalary} руб/мес`);
    score += 5;
  }
  
  if (questions.relocation) {
    const relocationText = questions.relocation === 'yes' ? 'готов к переезду' : 
                          questions.relocation === 'no' ? 'не готов к переезду' : 
                          'рассматривает предложения по переезду';
    strongPoints.push(`Готовность к переезду: ${relocationText}`);
  }
  
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
  
  // Для очень коротких текстов снижаем оценку
  if (text.length < 50) {
    score = Math.max(score - 30, 10); // Минимум 10%
  } else if (text.length < 100) {
    score = Math.max(score - 20, 20); // Минимум 20%
  }
  
  score = Math.min(score, 100);
  
  // Генерируем детальный анализ
  const detailedAnalysis = generateDetailedAnalysis(resumeText, level, score, skills, strongPoints, weakPoints, recommendations);
  
  return {
    grade: level,
    atsScore: score,
    skills: skills,
    recommendations: recommendations,
    strongPoints: strongPoints,
    weakPoints: weakPoints,
    detailedAnalysis: detailedAnalysis
  };
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
  
  // 4. Определение уровня
  analysis += `## 4. Определение уровня кандидата\n`;
  
  let experienceYears = 0;
  if (text.includes('5 лет') || text.includes('более 5')) experienceYears = 5;
  else if (text.includes('4 года') || text.includes('4 лет')) experienceYears = 4;
  else if (text.includes('3 года') || text.includes('3 лет')) experienceYears = 3;
  else if (text.includes('2 года') || text.includes('2 лет')) experienceYears = 2;
  else if (text.includes('1 год') || text.includes('1 лет')) experienceYears = 1;
  
  analysis += `Опыт: ${experienceYears > 0 ? experienceYears + ' лет' : 'Не указан'}\n`;
  analysis += `Навыки: ${skills.length} профессиональных навыков\n`;
  analysis += `Самостоятельность: ${text.includes('проект') ? 'Есть собственные проекты' : 'Не указано'}\n`;
  analysis += `Сложность задач: ${text.includes('руководитель') ? 'Высокая' : text.includes('middle') ? 'Средняя' : 'Базовая'}\n`;
  analysis += `Уровень ответственности: ${text.includes('руководитель') ? 'Высокий' : text.includes('проект') ? 'Средний' : 'Базовый'}\n\n`;
  
  analysis += `Оценка:\n`;
  analysis += `[${level}] — ${level === 'Lead/Expert' ? '8+ лет опыта, руководство командами, стратегические решения' : level === 'Senior' ? '5-8 лет опыта, проектирование решений, наставничество' : level === 'Middle' ? '2-5 лет опыта, самостоятельная работа, оптимизация решений' : '0-2 года опыта, базовые знания, наставничество'}.\n\n`;
  
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
  
  analysis += `Итоговая оценка:\n`;
  analysis += `[${level}] — обоснование: ${level === 'Lead/Expert' ? '8+ лет опыта, руководство командами, стратегические решения' : level === 'Senior' ? '5-8 лет опыта, проектирование решений, наставничество' : level === 'Middle' ? '2-5 лет опыта, самостоятельная работа, оптимизация решений' : '0-2 года опыта, базовые знания, наставничество'}.\n\n`;
  
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
    const { resumeText, questions } = req.body;
    
    console.log('Получен запрос на анализ текста, длина:', resumeText ? resumeText.length : 0);
    console.log('Данные вопросов:', questions);
    
    if (!resumeText || resumeText.trim().length < 10) {
      console.log('Текст слишком короткий:', resumeText);
      return res.status(400).json({
        success: false,
        error: { message: 'Текст резюме слишком короткий. Минимум 10 символов.' }
      });
    }
    
    console.log('Анализ текстового резюме, длина:', resumeText.trim().length);
    
    // Анализируем резюме с учетом вопросов
    const analysisResult = await analyzeResumeWithAI(resumeText.trim(), questions);
    
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
