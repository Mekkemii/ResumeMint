/**
 * Парсер оценок из различных форматов ответа модели
 * Возвращает null вместо 0, если оценка не найдена
 */

function parseScore(v) {
  if (typeof v === "number" && isFinite(v)) return clamp(v);
  
  if (typeof v === "string") {
    // Ловим "70/100", "70 из 100", "70%", "Оценка: 70"
    const mm = v.match(/(\d{1,3})(?=\s*(?:\/\s*100|%|$))/);
    if (mm) return clamp(Number(mm[1]));
    
    const any = v.match(/(\d{1,3})/);
    if (any) return clamp(Number(any[1]));
  }
  
  return null;
}

function clamp(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

module.exports = { parseScore };
