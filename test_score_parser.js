/**
 * Тест парсера оценок
 * Проверяет различные форматы оценок из ответа модели
 */

const { parseScore } = require('./backend/utils/score');

// Тестовые случаи
const testCases = [
  // Числовые значения
  { input: 85, expected: 85, description: "Число 85" },
  { input: 0, expected: 0, description: "Число 0" },
  { input: 100, expected: 100, description: "Число 100" },
  { input: 150, expected: 100, description: "Число больше 100 (должно обрезаться)" },
  { input: -10, expected: 0, description: "Отрицательное число (должно стать 0)" },
  
  // Строковые форматы
  { input: "70/100", expected: 70, description: "Формат '70/100'" },
  { input: "85%", expected: 85, description: "Формат '85%'" },
  { input: "Оценка: 75", expected: 75, description: "Формат 'Оценка: 75'" },
  { input: "Текст: 80 из 100", expected: 80, description: "Формат '80 из 100'" },
  { input: "Структура: 90", expected: 90, description: "Формат 'Структура: 90'" },
  
  // Граничные случаи
  { input: null, expected: null, description: "null" },
  { input: undefined, expected: null, description: "undefined" },
  { input: "", expected: null, description: "Пустая строка" },
  { input: "нет оценки", expected: null, description: "Строка без чисел" },
  { input: "abc", expected: null, description: "Только буквы" },
  
  // Сложные случаи
  { input: "Оценка текста: 65 баллов из 100", expected: 65, description: "Сложный формат с текстом" },
  { input: "ATS совместимость: 88%", expected: 88, description: "Формат с процентами" },
  { input: "Общая оценка 92", expected: 92, description: "Формат без разделителей" },
];

function testScoreParser() {
  console.log('🧪 ТЕСТИРОВАНИЕ ПАРСЕРА ОЦЕНОК\n');
  
  let passed = 0;
  let total = testCases.length;
  
  testCases.forEach((testCase, index) => {
    const result = parseScore(testCase.input);
    const success = result === testCase.expected;
    
    console.log(`${index + 1}. ${testCase.description}`);
    console.log(`   Вход: ${JSON.stringify(testCase.input)}`);
    console.log(`   Ожидалось: ${testCase.expected}`);
    console.log(`   Получено: ${result}`);
    console.log(`   Результат: ${success ? '✅ ПРОШЕЛ' : '❌ ПРОВАЛ'}`);
    console.log('');
    
    if (success) passed++;
  });
  
  console.log('📊 СТАТИСТИКА:');
  console.log(`Всего тестов: ${total}`);
  console.log(`Пройдено: ${passed}/${total} (${Math.round(passed/total*100)}%)`);
  
  if (passed === total) {
    console.log('🎉 Все тесты пройдены!');
  } else {
    console.log('⚠️  Есть проваленные тесты');
  }
}

// Запускаем тест
if (require.main === module) {
  testScoreParser();
}

module.exports = { testScoreParser };
