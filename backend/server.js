/**
 * Основной файл сервера ResumeMint.ru
 * Настройка Express сервера с middleware и маршрутами
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Импорт маршрутов
const resumeRoutes = require('./routes/resumeRoutes');
const vacancyRoutes = require('./routes/vacancyRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

// Импорт middleware
const errorHandler = require('./middleware/errorHandler');
const { validateApiKey } = require('./middleware/validation');

const app = express();
const PORT = process.env.PORT || 5000;

// Настройка rate limiting для защиты от DDoS
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 минут
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // максимум 100 запросов
  message: {
    error: 'Слишком много запросов. Попробуйте позже.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware для безопасности и производительности
app.use(helmet()); // Защита от уязвимостей
app.use(compression()); // Сжатие ответов
app.use(morgan('combined')); // Логирование запросов
app.use(limiter); // Ограничение частоты запросов

// CORS настройка для взаимодействия с frontend
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Парсинг JSON и URL-encoded данных
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Проверка API ключа OpenAI
app.use(validateApiKey);

// Статические файлы для загруженных резюме (если нужно)
app.use('/uploads', express.static('uploads'));

// Основные маршруты API
app.use('/api/resume', resumeRoutes);
app.use('/api/vacancy', vacancyRoutes);
app.use('/api/analysis', analysisRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'ResumeMint API',
    version: '1.0.0'
  });
});

// Обработка 404 ошибок
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Маршрут не найден',
    code: 'ROUTE_NOT_FOUND',
    path: req.originalUrl
  });
});

// Глобальный обработчик ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 ResumeMint API сервер запущен на порту ${PORT}`);
  console.log(`📊 Режим: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API доступен по адресу: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Получен сигнал SIGTERM, завершение работы сервера...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Получен сигнал SIGINT, завершение работы сервера...');
  process.exit(0);
});

module.exports = app;
