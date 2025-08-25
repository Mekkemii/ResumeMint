import React from 'react';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          color: '#111827', 
          marginBottom: '1rem' 
        }}>
          ResumeMint.ru
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#6b7280' 
        }}>
          AI ассистент для анализа резюме
        </p>
        <div style={{ marginTop: '2rem' }}>
          <p style={{ color: '#9ca3af' }}>
            Добро пожаловать! Приложение успешно загружено.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
