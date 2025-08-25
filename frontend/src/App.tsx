import React, { useState } from 'react';

function App() {
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState<any>(null);

  const analyzeResume = () => {
    if (!resumeText.trim()) {
      alert('Введите текст резюме!');
      return;
    }

    // Простая логика анализа
    const text = resumeText.toLowerCase();
    let level = 'Junior';
    let score = 70;

    if (text.includes('senior') || text.includes('lead')) {
      level = 'Senior/Lead';
    } else if (text.includes('middle') || text.includes('опыт 3')) {
      level = 'Middle';
    }

    if (text.includes('опыт работы')) score += 10;
    if (text.includes('образование')) score += 10;
    if (text.includes('навыки')) score += 10;

    setResult({
      level,
      score,
      skills: text.includes('react') ? ['React'] : [],
      recommendations: ['Добавьте больше деталей', 'Используйте ключевые слова']
    });
  };

  const loadSample = () => {
    setResumeText('Иван Иванов\nFrontend Developer\n\nОпыт работы: 2 года\nНавыки: React, TypeScript, JavaScript\nОбразование: Высшее техническое');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb',
      fontFamily: 'system-ui, sans-serif',
      padding: '20px'
    }}>
      {/* Заголовок */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: '#111827',
          marginBottom: '10px'
        }}>
          ResumeMint.ru
        </h1>
        <p style={{ color: '#6b7280' }}>
          AI ассистент для анализа резюме
        </p>
      </div>

      {/* Навигация */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '10px', 
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={() => window.open('https://t.me/resumemint_support', '_blank')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          О нас
        </button>
        <button 
          onClick={() => window.open('https://www.tinkoff.ru/rm/ivanov.ivan123/1234567890', '_blank')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Донат
        </button>
      </div>

      {/* Форма анализа */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#111827' }}>
          Анализ резюме
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Вставьте текст вашего резюме:
          </label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '5px',
              minHeight: '150px',
              resize: 'vertical'
            }}
            placeholder="Вставьте текст вашего резюме здесь..."
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={analyzeResume}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Анализировать резюме
          </button>
          <button
            onClick={loadSample}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Загрузить пример
          </button>
        </div>

        {/* Результаты */}
        {result && (
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '20px',
            borderRadius: '5px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#111827' }}>
              Результаты анализа
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <strong>Уровень специалиста:</strong>
                <p style={{ color: '#3b82f6', margin: '5px 0' }}>{result.level}</p>
              </div>
              <div>
                <strong>ATS совместимость:</strong>
                <p style={{ color: '#3b82f6', margin: '5px 0' }}>{result.score}%</p>
              </div>
              <div>
                <strong>Найденные навыки:</strong>
                <ul style={{ color: '#10b981', margin: '5px 0', paddingLeft: '20px' }}>
                  {result.skills.map((skill: string, index: number) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Рекомендации:</strong>
                <ul style={{ color: '#6b7280', margin: '5px 0', paddingLeft: '20px' }}>
                  {result.recommendations.map((rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Информация о проекте */}
      <div style={{
        maxWidth: '600px',
        margin: '30px auto 0',
        textAlign: 'center',
        color: '#6b7280'
      }}>
        <p>
          ResumeMint.ru - AI-ассистент для анализа резюме и вакансий. 
          Мы помогаем IT-специалистам создавать эффективные резюме.
        </p>
      </div>
    </div>
  );
}

export default App;
