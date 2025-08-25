import React from 'react';
import { ResumeAnalysis } from '../types';
import { CheckCircle, AlertCircle, Star, TrendingUp, TrendingDown } from 'lucide-react';

interface ResumeAnalysisResultsProps {
  analysis: ResumeAnalysis;
}

const ResumeAnalysisResults: React.FC<ResumeAnalysisResultsProps> = ({ analysis }) => {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'Junior':
        return 'bg-blue-100 text-blue-800';
      case 'Middle':
        return 'bg-green-100 text-green-800';
      case 'Senior':
        return 'bg-purple-100 text-purple-800';
      case 'Lead/Expert':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getATSScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600';
    if (score >= 60) return 'text-warning-600';
    return 'text-error-600';
  };

  return (
    <div className="space-y-6">
      {/* Основная информация */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Результаты анализа резюме</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Грейд кандидата */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Определенный грейд</h3>
            <div className="flex items-center space-x-3">
              <span className={`badge ${getGradeColor(analysis.grade)}`}>
                {analysis.grade}
              </span>
              <Star className="w-5 h-5 text-warning-500" />
            </div>
            <p className="text-gray-600 mt-2 text-sm">{analysis.gradeReasoning}</p>
          </div>

          {/* ATS-совместимость */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">ATS-совместимость</h3>
            <div className="flex items-center space-x-3">
              <span className={`text-2xl font-bold ${getATSScoreColor(analysis.atsCompatibility.score)}`}>
                {analysis.atsCompatibility.score}%
              </span>
              {analysis.atsCompatibility.score >= 80 ? (
                <TrendingUp className="w-5 h-5 text-success-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-warning-500" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ATS-анализ */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Детальный ATS-анализ</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Сильные стороны */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-success-500" />
              <span>Сильные стороны</span>
            </h4>
            <ul className="space-y-2">
              {analysis.atsCompatibility.strengths.map((strength, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Проблемы */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-warning-500" />
              <span>Области для улучшения</span>
            </h4>
            <ul className="space-y-2">
              {analysis.atsCompatibility.issues.map((issue, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-warning-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Анализ структуры */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Анализ структуры резюме</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(analysis.structure).map(([section, evaluation]) => (
            <div key={section} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 capitalize">
                {section === 'objective' ? 'Цель' :
                 section === 'experience' ? 'Опыт' :
                 section === 'education' ? 'Образование' :
                 section === 'skills' ? 'Навыки' :
                 section === 'courses' ? 'Курсы' :
                 section === 'about' ? 'О себе' :
                 section === 'contacts' ? 'Контакты' : section}
              </h4>
              <p className="text-sm text-gray-600">{evaluation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Сильные стороны и слабости */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Сильные стороны */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-success-500" />
            <span>Сильные стороны</span>
          </h3>
          <ul className="space-y-2">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Области для улучшения */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-warning-500" />
            <span>Области для улучшения</span>
          </h3>
          <ul className="space-y-2">
            {analysis.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-warning-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Рекомендации */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Рекомендации по улучшению</h3>
        <ul className="space-y-3">
          {analysis.recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">
                {index + 1}
              </span>
              <span className="text-gray-700">{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Ключевые слова */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Ключевые слова для ATS</h3>
        <div className="flex flex-wrap gap-2">
          {analysis.keywords.map((keyword, index) => (
            <span
              key={index}
              className="badge badge-info"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalysisResults;
