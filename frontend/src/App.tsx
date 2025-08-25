import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-2xl font-bold text-gray-900">ResumeMint.ru</h1>
              <nav className="space-x-8">
                <a href="/" className="text-gray-500 hover:text-gray-900">Главная</a>
                <a href="/resume-analysis" className="text-gray-500 hover:text-gray-900">Анализ резюме</a>
              </nav>
            </div>
          </div>
        </header>
        
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                AI ассистент для анализа резюме
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Проверьте совместимость вашего резюме с HR и ATS системами
              </p>
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Добро пожаловать в ResumeMint.ru
                </h3>
                <p className="text-gray-600 mb-6">
                  Наш AI ассистент поможет вам проанализировать резюме, определить уровень специалиста,
                  проверить совместимость с ATS системами и сравнить с требованиями вакансий.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Анализ резюме</h4>
                    <p className="text-blue-700 text-sm">Определение уровня специалиста и ATS совместимости</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Анализ вакансий</h4>
                    <p className="text-green-700 text-sm">Изучение требований и определение необходимого уровня</p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Сравнение</h4>
                    <p className="text-purple-700 text-sm">Сопоставление резюме с требованиями вакансии</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2024 ResumeMint.ru - AI ассистент для анализа резюме</p>
          </div>
        </footer>
      </div>
      
      {/* Уведомления */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  );
}

export default App;
