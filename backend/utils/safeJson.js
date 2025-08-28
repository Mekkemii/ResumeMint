/**
 * Безопасный экстрактор JSON из текста ответа модели
 * Если модель вернула текст с JSON внутри, извлекает его
 */

function safeExtractJson(txt) {
  if (!txt || typeof txt !== 'string') return null;
  
  // Вытаскиваем первый JSON-блок
  const m = txt.match(/\{[\s\S]*\}$/m) || txt.match(/\{[\s\S]*?\}/m);
  if (!m) return null;
  
  try { 
    return JSON.parse(m[0]); 
  } catch (e) { 
    console.warn('Failed to parse extracted JSON:', e.message);
    return null; 
  }
}

module.exports = { safeExtractJson };
