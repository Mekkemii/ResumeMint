import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  BarChart3, 
  Zap, 
  Shield, 
  Users, 
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero секция */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AI-ассистент для анализа{' '}
              <span className="text-primary-600">резюме</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Пришлите ваше резюме, я проверю его на совместимость с HR и ATS. 
              Получите детальный анализ, рекомендации по улучшению и персонализированное 
              сопроводительное письмо для любой вакансии.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/resume-analysis"
                className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2"
              >
                <FileText className="w-5 h-5" />
                <span>Начать анализ резюме</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/vacancy-analysis"
                className="btn-secondary text-lg px-8 py-4 flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Анализ вакансии</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Возможности */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Что умеет ResumeMint.ru
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Полный цикл анализа и оптимизации резюме с использованием 
              современных AI-технологий
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Анализ резюме */}
            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Анализ резюме
              </h3>
              <p className="text-gray-600 mb-4">
                Детальный анализ структуры, определение грейда кандидата, 
                проверка ATS-совместимости и выявление сильных сторон.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  <span>Определение грейда (Junior/Middle/Senior/Lead)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  <span>Проверка ATS-совместимости</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  <span>Анализ структуры и содержания</span>
                </li>
              </ul>
            </div>

            {/* Анализ вакансий */}
            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Анализ вакансий
              </h3>
              <p className="text-gray-600 mb-4">
                Парсинг и анализ требований вакансии, определение требуемого 
                грейда и ключевых навыков.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  <span>Определение требуемого грейда</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  <span>Выделение ключевых требований</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  <span>Анализ обязанностей</span>
                </li>
              </ul>
            </div>

            {/* Сравнение */}
            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Сравнение и рекомендации
              </h3>
              <p className="text-gray-600 mb-4">
                Детальное сравнение резюме с требованиями вакансии, 
                оценка шансов и персональные рекомендации.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  <span>Оценка соответствия грейдов</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  <span>Анализ покрытия требований</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  <span>Персональные рекомендации</span>
                </li>
              </ul>
            </div>

            {/* Редактирование */}
            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Редактирование резюме
              </h3>
              <p className="text-gray-600 mb-4">
                Адаптация резюме под конкретную вакансию с учетом 
                требуемого грейда и ключевых слов.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  <span>Адаптация под грейд</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  <span>Оптимизация для ATS</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  <span>Добавление ключевых слов</span>
                </li>
              </ul>
            </div>

            {/* Сопроводительное письмо */}
            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Сопроводительное письмо
              </h3>
              <p className="text-gray-600 mb-4">
                Генерация персонализированного сопроводительного письма 
                на основе анализа резюме и вакансии.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  <span>Персонализация под вакансию</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  <span>Подчеркивание сильных сторон</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  <span>Профессиональный тон</span>
                </li>
              </ul>
            </div>

            {/* Безопасность */}
            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Безопасность и конфиденциальность
              </h3>
              <p className="text-gray-600 mb-4">
                Ваши данные защищены. Резюме обрабатываются локально 
                и не сохраняются на сервере.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  <span>Локальная обработка</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  <span>Безопасное соединение</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  <span>Конфиденциальность данных</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Статистика */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Почему выбирают ResumeMint.ru
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Тысячи кандидатов уже улучшили свои резюме с помощью нашего AI-ассистента
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
              <div className="text-gray-600">Улучшение ATS-совместимости</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">87%</div>
              <div className="text-gray-600">Увеличение откликов</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">10k+</div>
              <div className="text-gray-600">Проанализированных резюме</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">4.9</div>
              <div className="text-gray-600">Средняя оценка пользователей</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Готовы улучшить свое резюме?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Пришлите ваше резюме и получите детальный анализ с рекомендациями 
            по улучшению уже через несколько минут.
          </p>
          <Link
            to="/resume-analysis"
            className="inline-flex items-center space-x-2 bg-white text-primary-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <FileText className="w-5 h-5" />
            <span>Начать анализ</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
