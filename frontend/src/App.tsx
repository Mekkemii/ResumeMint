import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Компоненты
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ResumeAnalysisPage from './pages/ResumeAnalysisPage';
import VacancyAnalysisPage from './pages/VacancyAnalysisPage';
import ComparisonPage from './pages/ComparisonPage';
import ResultsPage from './pages/ResultsPage';

// Контекст
import { AnalysisProvider } from './context/AnalysisContext';

function App() {
  return (
    <AnalysisProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/resume-analysis" element={<ResumeAnalysisPage />} />
              <Route path="/vacancy-analysis" element={<VacancyAnalysisPage />} />
              <Route path="/comparison" element={<ComparisonPage />} />
              <Route path="/results" element={<ResultsPage />} />
            </Routes>
          </main>
          
          <Footer />
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
    </AnalysisProvider>
  );
}

export default App;
