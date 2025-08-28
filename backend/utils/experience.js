/**
 * Детектор опыта работы в тексте резюме
 * Ищет признаки опыта с помощью регулярных выражений
 */

function detectExperience(text) {
  const src = (text || "").split(/\r?\n/).map(s => s.trim()).filter(Boolean);

  const patterns = [
    /\b(опыт работы|experience|employment|work history)\b/i,
    /\b(стаж|intern(ship)?|практика)\b/i,
    /\b(разработчик|аналитик|инженер|менеджер|администратор|data|ml|devops|fraud|антифрод)\b/i,
    /\b(ООО|АО|ПАО|банк|ltd|inc|corp|ООО\s+[«"]?.+?["»]?|банк\s+\S+)/i,
    /\b(20\d{2})\b.*\b(20\d{2}|по наст|наст\.|настоящее)\b/i, // годы
  ];

  const hits = [];
  for (const line of src) {
    if (patterns.some(p => p.test(line))) hits.push(line);
  }
  return { found: hits.length > 0, lines: hits.slice(0, 12) };
}

module.exports = { detectExperience };
