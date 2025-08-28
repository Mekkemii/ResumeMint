/**
 * Тест улучшенного детектора опыта работы
 * Проверяет различные форматы записи опыта (HH, стандартные резюме, фриланс и т.д.)
 */

const { detectExperience, injectExperienceMarkers } = require('./backend/utils/experience');

// Тестовые резюме с разными форматами записи опыта
const testResumes = [
  {
    name: "Стандартное резюме с 'Опыт работы'",
    text: `
ИВАН ИВАНОВ
Frontend Developer

КОНТАКТЫ
Email: ivan.ivanov@email.com
Телефон: +7 (999) 123-45-67

ОПЫТ РАБОТЫ
Frontend Developer | ООО "Технологии будущего" | 2022 - настоящее время
• Разрабатывал пользовательские интерфейсы с использованием React.js
• Оптимизировал производительность приложений, улучшив время загрузки на 30%

НАВЫКИ
JavaScript, React, TypeScript
`
  },
  {
    name: "HH резюме с 'Специализации' вместо 'Опыт'",
    text: `
ПЕТР ПЕТРОВ
Backend Developer

СПЕЦИАЛИЗАЦИИ
Backend Developer | ООО "Банк России" | 2021 - 2023
• Разрабатывал микросервисы на Java Spring Boot
• Интегрировал системы KYC/AML, снизил время обработки на 40%

Backend Developer | ООО "Финтех Стартап" | 2023 - н.в.
• Создавал REST API для мобильного приложения
• Работал с PostgreSQL и Redis

НАВЫКИ
Java, Spring Boot, PostgreSQL
`
  },
  {
    name: "Резюме с 'Проекты' вместо 'Опыт'",
    text: `
АННА СИДОРОВА
Data Analyst

ПРОЕКТЫ
Data Analyst | ООО "Аналитика Плюс" | 2022 - н.в.
• Анализировал данные пользователей, создавал дашборды
• Повысил конверсию на 25% благодаря аналитике

Практика | ООО "Стартап" | 2021 - 2022
• Создавал отчеты в Power BI
• Работал с SQL и Python

ОБРАЗОВАНИЕ
Московский университет
`
  },
  {
    name: "Фриланс резюме",
    text: `
МАРИЯ КОЗЛОВА
UI/UX Designer

ФРИЛАНС
UI/UX Designer | Самозанятый | 2021 - н.в.
• Создавал дизайн для веб-сайтов и мобильных приложений
• Работал с Figma, Adobe XD

Консалтинг | ООО "Дизайн Агентство" | 2022 - 2023
• Консультировал по вопросам UX/UI
• Проводил пользовательские исследования

НАВЫКИ
Figma, Adobe XD, Sketch
`
  },
  {
    name: "Резюме с датами без явного заголовка",
    text: `
АЛЕКСЕЙ ВОЛКОВ
DevOps Engineer

2022 - н.в. | DevOps Engineer | ООО "Облачные технологии"
• Настраивал CI/CD пайплайны
• Работал с Docker и Kubernetes

2021 - 2022 | System Administrator | ООО "IT Компания"
• Администрировал Linux серверы
• Настраивал мониторинг

ОБРАЗОВАНИЕ
Технический университет
`
  },
  {
    name: "Резюме без опыта (только навыки)",
    text: `
ЕЛЕНА НОВИКОВА
Junior Developer

О СЕБЕ
Молодой специалист, ищущий первую работу в IT

НАВЫКИ
JavaScript, HTML, CSS, React

ОБРАЗОВАНИЕ
Московский университет | 2023
`
  }
];

// Функция для тестирования
function testExperienceDetection() {
  console.log('🧪 ТЕСТИРОВАНИЕ ДЕТЕКТОРА ОПЫТА РАБОТЫ\n');
  
  testResumes.forEach((resume, index) => {
    console.log(`\n${index + 1}. ${resume.name}`);
    console.log('─'.repeat(50));
    
    const evidence = detectExperience(resume.text);
    
    console.log(`Найден опыт: ${evidence.found ? '✅ ДА' : '❌ НЕТ'}`);
    console.log(`Количество строк с опытом: ${evidence.lines.length}`);
    console.log(`Количество блоков: ${evidence.spans.length}`);
    
    if (evidence.found) {
      console.log('\nНайденные строки с опытом:');
      evidence.lines.forEach((line, i) => {
        console.log(`  ${i + 1}. ${line.substring(0, 80)}${line.length > 80 ? '...' : ''}`);
      });
      
      console.log('\nБлоки опыта:');
      evidence.spans.forEach((span, i) => {
        console.log(`  Блок ${i + 1}: строки ${span.start + 1}-${span.end + 1}`);
      });
      
      // Тестируем маркировку
      const markedText = injectExperienceMarkers(resume.text, evidence.spans);
      const hasMarkers = markedText.includes('[EXPERIENCE]') && markedText.includes('[/EXPERIENCE]');
      console.log(`Маркеры добавлены: ${hasMarkers ? '✅ ДА' : '❌ НЕТ'}`);
      
      if (hasMarkers) {
        console.log('\nПример маркированного текста:');
        const lines = markedText.split('\n');
        const markedLines = lines.filter(line => line.includes('[EXPERIENCE]') || line.includes('[/EXPERIENCE]'));
        markedLines.slice(0, 4).forEach(line => {
          console.log(`  ${line}`);
        });
      }
    }
    
    console.log('\n' + '─'.repeat(50));
  });
  
  console.log('\n📊 СТАТИСТИКА:');
  const results = testResumes.map(resume => {
    const evidence = detectExperience(resume.text);
    return {
      name: resume.name,
      found: evidence.found,
      lines: evidence.lines.length,
      spans: evidence.spans.length
    };
  });
  
  const foundCount = results.filter(r => r.found).length;
  const totalCount = results.length;
  
  console.log(`Всего тестов: ${totalCount}`);
  console.log(`Опыт найден: ${foundCount}/${totalCount} (${Math.round(foundCount/totalCount*100)}%)`);
  
  results.forEach(r => {
    console.log(`  ${r.name}: ${r.found ? '✅' : '❌'} (${r.lines} строк, ${r.spans} блоков)`);
  });
}

// Запускаем тест
if (require.main === module) {
  testExperienceDetection();
}

module.exports = { testExperienceDetection };
