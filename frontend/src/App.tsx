import React, { useState } from 'react';

// Vercel cache bust - 2024-12-19 15:30
function App() {
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      alert('Введите текст резюме!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Простая клиентская логика для тестирования
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
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Ошибка анализа');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setResumeText('Иван Иванов\nFrontend Developer\n\nОпыт работы: 2 года\nНавыки: React, TypeScript, JavaScript\nОбразование: Высшее техническое');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Навигация */}
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#111827',
            margin: 0
          }}>
            ResumeMint.ru
          </h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}>
              Анализ резюме
            </button>
            <button 
              onClick={() => window.open('https://t.me/resumemint_support', '_blank')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              О нас
            </button>
            <button 
              onClick={() => window.open('https://www.tinkoff.ru/rm/ivanov.ivan123/1234567890', '_blank')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Донат
            </button>
          </div>
        </div>
      </nav>

      {/* Основной контент */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            AI ассистент для анализа резюме
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#6b7280',
            marginBottom: '2rem'
          }}>
            Проверьте совместимость вашего резюме с HR и ATS системами
          </p>
        </div>

        {/* Форма анализа */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '1.5rem'
          }}>
            Анализ резюме
          </h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Вставьте текст вашего резюме:
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                minHeight: '200px',
                resize: 'vertical'
              }}
              placeholder="Вставьте текст вашего резюме здесь..."
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={analyzeResume}
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Анализируем...' : 'Анализировать резюме'}
            </button>
            <button
              onClick={loadSample}
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              Загрузить пример
            </button>
          </div>

          {/* Ошибка */}
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1rem',
              color: '#dc2626'
            }}>
              <strong>Ошибка:</strong> {error}
            </div>
          )}

          {/* Результаты */}
          {result && (
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Результаты анализа
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <strong style={{ color: '#374151' }}>Уровень специалиста:</strong>
                  <p style={{ color: '#3b82f6', fontWeight: '500', margin: '0.25rem 0' }}>
                    {result.level}
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#374151' }}>ATS совместимость:</strong>
                  <p style={{ color: '#3b82f6', fontWeight: '500', margin: '0.25rem 0' }}>
                    {result.score}%
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#374151' }}>Найденные навыки:</strong>
                  <ul style={{ color: '#10b981', margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
                    {result.skills.map((skill: string, index: number) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong style={{ color: '#374151' }}>Рекомендации:</strong>
                  <ul style={{ color: '#6b7280', margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
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
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          maxWidth: '800px',
          margin: '2rem auto 0',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            О проекте
          </h3>
          <p style={{
            color: '#6b7280',
            lineHeight: '1.6',
            marginBottom: '1rem'
          }}>
            ResumeMint.ru - это AI-ассистент для анализа резюме и вакансий. 
            Мы помогаем IT-специалистам создавать эффективные резюме, 
            которые проходят через ATS системы.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <span style={{
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              padding: '0.5rem 1rem',
              borderRadius: '2rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Анализ резюме
            </span>
            <span style={{
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              padding: '0.5rem 1rem',
              borderRadius: '2rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              ATS совместимость
            </span>
            <span style={{
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              padding: '0.5rem 1rem',
              borderRadius: '2rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Рекомендации
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
