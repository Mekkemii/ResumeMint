import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function App() {
  const [activePage, setActivePage] = useState('home');

  const HomePage = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">ResumeMint.ru</h1>
            <nav className="space-x-8">
              <button 
                onClick={() => setActivePage('home')}
                className={`text-gray-500 hover:text-gray-900 ${activePage === 'home' ? 'text-blue-600' : ''}`}
              >
                Главная
              </button>
              <button 
                onClick={() => setActivePage('resume')}
                className={`text-gray-500 hover:text-gray-900 ${activePage === 'resume' ? 'text-blue-600' : ''}`}
              >
                Анализ резюме
              </button>
              <button 
                onClick={() => setActivePage('vacancy')}
                className={`text-gray-500 hover:text-gray-900 ${activePage === 'vacancy' ? 'text-blue-600' : ''}`}
              >
                Анализ вакансии
              </button>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {activePage === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                AI ассистент для анализа резюме
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Проверьте совместимость вашего резюме с HR и ATS системами
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Анализ резюме</h3>
                  <p className="text-gray-600 mb-4">
                    Загрузите резюме и получите детальный анализ уровня специалиста, 
                    ATS-совместимости и рекомендации по улучшению.
                  </p>
                  <button 
                    onClick={() => setActivePage('resume')}
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
                    onClick={() => setActivePage('vacancy')}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Анализ вакансии
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePage === 'resume' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Анализ резюме</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Вставьте текст вашего резюме:
                  </label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={10}
                    placeholder="Вставьте текст вашего резюме здесь..."
                  />
                </div>
                <div className="flex gap-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                    Анализировать резюме
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                    Загрузить пример
                  </button>
                  <button 
                    onClick={() => setActivePage('home')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Назад
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePage === 'vacancy' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Анализ вакансии</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Вставьте описание вакансии:
                  </label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={10}
                    placeholder="Вставьте описание вакансии здесь..."
                  />
                </div>
                <div className="flex gap-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                    Анализировать вакансию
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                    Загрузить пример
                  </button>
                  <button 
                    onClick={() => setActivePage('home')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Назад
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 ResumeMint.ru - AI ассистент для анализа резюме</p>
        </div>
      </footer>
    </div>
  );

  return (
    <>
      <HomePage />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </>
  );
}

export default App;
