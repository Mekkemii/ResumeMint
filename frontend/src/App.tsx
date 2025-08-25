import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [resumeText, setResumeText] = useState('');
  const [vacancyText, setVacancyText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Простая функция анализа резюме (без backend)
  const analyzeResume = () => {
    if (!resumeText.trim()) {
      alert('Пожалуйста, введите текст резюме');
      return;
    }

    // Простой анализ на основе ключевых слов
    const text = resumeText.toLowerCase();
    let grade = 'Junior';
    let atsScore = 70;
    let strengths = [];
    let weaknesses = [];

    // Определение уровня
    if (text.includes('senior') || text.includes('lead') || text.includes('архитектор')) {
      grade = 'Senior/Lead';
    } else if (text.includes('middle') || text.includes('опыт 3') || text.includes('опыт 4') || text.includes('опыт 5')) {
      grade = 'Middle';
    }

    // Анализ навыков
    if (text.includes('react')) strengths.push('React');
    if (text.includes('typescript')) strengths.push('TypeScript');
    if (text.includes('javascript')) strengths.push('JavaScript');
    if (text.includes('node')) strengths.push('Node.js');
    if (text.includes('python')) strengths.push('Python');
    if (text.includes('java')) strengths.push('Java');

    // ATS анализ
    if (text.includes('опыт работы')) atsScore += 10;
    if (text.includes('образование')) atsScore += 10;
    if (text.includes('навыки')) atsScore += 10;
    if (text.includes('контакты')) atsScore += 10;

    if (atsScore < 80) weaknesses.push('Низкая ATS совместимость');
    if (!text.includes('опыт работы')) weaknesses.push('Отсутствует опыт работы');
    if (!text.includes('образование')) weaknesses.push('Отсутствует образование');

    setAnalysisResult({
      grade,
      atsScore,
      strengths,
      weaknesses,
      recommendations: [
        'Добавьте конкретные цифры и достижения',
        'Используйте ключевые слова из вакансии',
        'Структурируйте информацию по разделам'
      ]
    });
  };

  // Простая функция анализа вакансии
  const analyzeVacancy = () => {
    if (!vacancyText.trim()) {
      alert('Пожалуйста, введите описание вакансии');
      return;
    }

    const text = vacancyText.toLowerCase();
    let requiredGrade = 'Middle';
    let requirements = [];

    if (text.includes('senior') || text.includes('lead') || text.includes('архитектор')) {
      requiredGrade = 'Senior/Lead';
    } else if (text.includes('junior') || text.includes('стажер')) {
      requiredGrade = 'Junior';
    }

    if (text.includes('react')) requirements.push('React');
    if (text.includes('typescript')) requirements.push('TypeScript');
    if (text.includes('javascript')) requirements.push('JavaScript');
    if (text.includes('node')) requirements.push('Node.js');
    if (text.includes('python')) requirements.push('Python');
    if (text.includes('java')) requirements.push('Java');

    setAnalysisResult({
      requiredGrade,
      requirements,
      difficulty: text.includes('senior') ? 'Высокая' : 'Средняя',
      responsibilities: ['Разработка новых функций', 'Поддержка существующего кода', 'Работа в команде']
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Навигация */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">ResumeMint.ru</h1>
            </div>
            <div className="flex space-x-8">
              <button 
                onClick={() => setActiveTab('home')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'home' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Главная
              </button>
              <button 
                onClick={() => setActiveTab('resume')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'resume' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Анализ резюме
              </button>
              <button 
                onClick={() => setActiveTab('vacancy')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'vacancy' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Анализ вакансии
              </button>
              <button 
                onClick={() => setActiveTab('about')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'about' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                О нас
              </button>
              <button 
                onClick={() => setActiveTab('donate')}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
              >
                Донат
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Контент */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              AI ассистент для анализа резюме
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Проверьте совместимость вашего резюме с HR и ATS системами
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Анализ резюме</h3>
                <p className="text-gray-600 mb-4">
                  Загрузите резюме и получите детальный анализ уровня специалиста, 
                  ATS-совместимости и рекомендации по улучшению.
                </p>
                <button 
                  onClick={() => setActiveTab('resume')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Начать анализ резюме
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Анализ вакансии</h3>
                <p className="text-gray-600 mb-4">
                  Вставьте описание вакансии и узнайте требуемый уровень специалиста, 
                  ключевые требования и сложность.
                </p>
                <button 
                  onClick={() => setActiveTab('vacancy')}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Анализ вакансии
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Анализ резюме</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Вставьте текст вашего резюме:
                  </label>
                  <textarea 
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={10}
                    placeholder="Вставьте текст вашего резюме здесь..."
                  />
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={analyzeResume}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Анализировать резюме
                  </button>
                  <button 
                    onClick={() => setResumeText('Иван Иванов\nFrontend Developer\n\nОпыт работы: 2 года\nНавыки: React, TypeScript, JavaScript, HTML, CSS\nОбразование: Высшее техническое')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Загрузить пример
                  </button>
                </div>
              </div>
            </div>

            {analysisResult && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Результаты анализа</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Уровень специалиста:</h4>
                    <p className="text-blue-600 font-medium">{analysisResult.grade}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">ATS совместимость:</h4>
                    <p className="text-blue-600 font-medium">{analysisResult.atsScore}%</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Сильные стороны:</h4>
                    <ul className="list-disc list-inside text-green-600">
                      {analysisResult.strengths.map((strength: string, index: number) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Рекомендации:</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {analysisResult.recommendations.map((rec: string, index: number) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'vacancy' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Анализ вакансии</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Вставьте описание вакансии:
                  </label>
                  <textarea 
                    value={vacancyText}
                    onChange={(e) => setVacancyText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={10}
                    placeholder="Вставьте описание вакансии здесь..."
                  />
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={analyzeVacancy}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Анализировать вакансию
                  </button>
                  <button 
                    onClick={() => setVacancyText('Frontend Developer\n\nТребования:\n- React, TypeScript\n- 2+ года опыта\n- JavaScript, HTML, CSS\n\nОбязанности:\n- Разработка пользовательских интерфейсов\n- Работа в команде\n- Поддержка существующего кода')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Загрузить пример
                  </button>
                </div>
              </div>
            </div>

            {analysisResult && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Результаты анализа вакансии</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Требуемый уровень:</h4>
                    <p className="text-blue-600 font-medium">{analysisResult.requiredGrade}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Сложность:</h4>
                    <p className="text-blue-600 font-medium">{analysisResult.difficulty}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Ключевые требования:</h4>
                    <ul className="list-disc list-inside text-green-600">
                      {analysisResult.requirements.map((req: string, index: number) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Обязанности:</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {analysisResult.responsibilities.map((resp: string, index: number) => (
                        <li key={index}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">О нас</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  ResumeMint.ru - это AI-ассистент для анализа резюме и вакансий, 
                  созданный для помощи специалистам в IT-сфере.
                </p>
                <p>
                  Наша миссия - помочь кандидатам создать эффективные резюме, 
                  которые будут проходить через ATS системы и привлекать внимание HR-специалистов.
                </p>
                <p>
                  Мы используем современные технологии искусственного интеллекта 
                  для анализа структуры резюме, определения уровня специалиста 
                  и предоставления персонализированных рекомендаций.
                </p>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Наши возможности:</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Анализ структуры и содержания резюме</li>
                    <li>Определение уровня специалиста (Junior/Middle/Senior/Lead)</li>
                    <li>Проверка ATS-совместимости</li>
                    <li>Анализ требований вакансий</li>
                    <li>Персонализированные рекомендации по улучшению</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'donate' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Поддержать проект</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Если наш сервис помог вам в поиске работы или улучшении резюме, 
                  вы можете поддержать развитие проекта.
                </p>
                <p>
                  Ваша поддержка поможет нам:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Улучшить качество анализа</li>
                  <li>Добавить новые функции</li>
                  <li>Поддерживать сервис бесплатным</li>
                  <li>Развивать AI-технологии</li>
                </ul>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Способы поддержки:</h3>
                  <div className="space-y-2">
                    <p>💳 <strong>Банковская карта:</strong> 1234 5678 9012 3456</p>
                    <p>📱 <strong>СБП:</strong> +7 (999) 123-45-67</p>
                    <p>💎 <strong>Криптовалюта:</strong> bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
