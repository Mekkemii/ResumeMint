/**
 * Тест исправленной API системы
 * Проверяет работу строгого JSON-формата
 */

const { evaluateResumeStructured } = require('./backend/services/openaiStructured');

// Тестовое резюме с явным опытом (как в вашем примере)
const testResume = `
ИВАН ИВАНОВ
Специалист по антифроду и OSINT

ОПЫТ РАБОТЫ

Специалист по антифроду | МВД России | 2019 - настоящее время (5+ лет)
• Проводил расследования мошеннических схем, обработал 300+ обращений
• Снизил количество повторных обращений на 15% благодаря улучшенным процедурам
• Организовал 80+ профилактических мероприятий в месяц
• Повысил раскрываемость преступлений на 30% в 2024 году

Аналитик безопасности | Альфа-Банк | 2018 - 2019
• Анализировал подозрительные транзакции
• Работал с системами KYC/AML
• Выявлял схемы отмывания денег

НАВЫКИ
OSINT, антифрод, расследования, KYC/AML, аналитика данных, SQL, Python

ОБРАЗОВАНИЕ
Московский университет | Кибербезопасность | 2018
`;

async function testApiFix() {
  console.log('🧪 ТЕСТ ИСПРАВЛЕННОЙ API СИСТЕМЫ\n');
  
  try {
    console.log('📄 Тестовое резюме:');
    console.log('   - 5+ лет опыта в МВД');
    console.log('   - Работа в Альфа-Банке');
    console.log('   - Конкретные метрики и достижения');
    console.log('   - Ожидаемый грейд: Middle/Senior\n');
    
    const result = await evaluateResumeStructured(testResume);
    
    if (result.error) {
      console.log(`❌ Ошибка: ${result.error}`);
      return;
    }
    
    console.log('✅ Успешно обработано');
    console.log(`   Модель: ${result.model}`);
    console.log(`   Seed: ${result.meta?.seed}`);
    console.log(`   Температура: ${result.meta?.temperature}`);
    console.log(`   Токены: ${result.usage?.prompt_tokens}/${result.usage?.completion_tokens}\n`);
    
    const eval = result.evaluation;
    console.log('📊 РЕЗУЛЬТАТ ОЦЕНКИ:');
    console.log(`   Грейд: ${eval.grade.level} - ${eval.grade.reason}`);
    console.log(`   Оценки: text=${eval.scores.text}, structure=${eval.scores.structure}, overall=${eval.scores.overall}`);
    console.log(`   Сильные стороны: ${eval.strengths.length} шт`);
    console.log(`   Недостатки: ${eval.gaps.length} шт`);
    console.log(`   Рекомендации: ${eval.add.length} шт`);
    console.log(`   Вопросы: ${eval.questions.length} шт\n`);
    
    // Проверяем валидность структуры
    const isValid = validateStructure(eval);
    console.log(`🔍 Валидность структуры: ${isValid ? '✅ ДА' : '❌ НЕТ'}`);
    
    // Проверяем, что оценки не нулевые
    const hasValidScores = eval.scores.text > 0 && eval.scores.structure > 0 && eval.scores.overall > 0;
    console.log(`🔍 Оценки не нулевые: ${hasValidScores ? '✅ ДА' : '❌ НЕТ'}`);
    
    // Проверяем, что грейд не Junior (с таким опытом)
    const hasReasonableGrade = eval.grade.level !== 'Junior';
    console.log(`🔍 Разумный грейд (не Junior): ${hasReasonableGrade ? '✅ ДА' : '❌ НЕТ'}`);
    
    console.log('\n📋 СЫРОЙ ОТВЕТ МОДЕЛИ:');
    console.log(result.raw_model_output);
    
    console.log('\n📊 ИТОГОВАЯ СТАТИСТИКА:');
    console.log(`✅ Structured Outputs работает: ${isValid ? 'ДА' : 'НЕТ'}`);
    console.log(`✅ Оценки корректные: ${hasValidScores ? 'ДА' : 'НЕТ'}`);
    console.log(`✅ Грейд разумный: ${hasReasonableGrade ? 'ДА' : 'НЕТ'}`);
    console.log(`✅ Система готова к использованию: ${isValid && hasValidScores && hasReasonableGrade ? 'ДА' : 'НЕТ'}`);
    
  } catch (error) {
    console.error('❌ Исключение:', error.message);
  }
}

function validateStructure(evaluation) {
  try {
    // Проверяем обязательные поля
    if (!evaluation.grade?.level || !evaluation.grade?.reason) return false;
    if (!evaluation.scores?.text || !evaluation.scores?.structure || !evaluation.scores?.overall) return false;
    if (!Array.isArray(evaluation.strengths) || !Array.isArray(evaluation.gaps) || 
        !Array.isArray(evaluation.add) || !Array.isArray(evaluation.questions)) return false;
    
    // Проверяем типы оценок
    if (typeof evaluation.scores.text !== 'number' || 
        typeof evaluation.scores.structure !== 'number' || 
        typeof evaluation.scores.overall !== 'number') return false;
    
    // Проверяем диапазоны
    if (evaluation.scores.text < 0 || evaluation.scores.text > 100) return false;
    if (evaluation.scores.structure < 0 || evaluation.scores.structure > 100) return false;
    if (evaluation.scores.overall < 0 || evaluation.scores.overall > 100) return false;
    
    return true;
  } catch (error) {
    return false;
  }
}

// Запускаем тест
if (require.main === module) {
  testApiFix().catch(console.error);
}

module.exports = { testApiFix };
