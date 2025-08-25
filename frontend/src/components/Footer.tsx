import React from 'react';
import { FileText, Github, Mail, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Логотип и описание */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                ResumeMint.ru
              </span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              AI-ассистент для анализа резюме, проверки совместимости с ATS-системами 
              и карьерного консультирования. Помогаем кандидатам создавать эффективные 
              резюме и находить подходящие вакансии.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="mailto:contact@resumemint.ru"
                className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">contact@resumemint.ru</span>
              </a>
            </div>
          </div>

          {/* Быстрые ссылки */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Функции
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/resume-analysis"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Анализ резюме
                </a>
              </li>
              <li>
                <a
                  href="/vacancy-analysis"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Анализ вакансий
                </a>
              </li>
              <li>
                <a
                  href="/comparison"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Сравнение
                </a>
              </li>
              <li>
                <a
                  href="/results"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Результаты
                </a>
              </li>
            </ul>
          </div>

          {/* Информация */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Информация
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  О проекте
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Политика конфиденциальности
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Условия использования
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Поддержка
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Нижняя часть футера */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-600 text-sm">
              <span>© {currentYear} ResumeMint.ru. Все права защищены.</span>
              <span className="flex items-center space-x-1">
                <span>Сделано с</span>
                <Heart className="w-4 h-4 text-red-500" />
                <span>в России</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/resumemint"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
