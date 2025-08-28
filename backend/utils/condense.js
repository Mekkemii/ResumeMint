const { estimateTokens, LIMITS } = require('./tokens');

// Удаляем шум, лишние контакты/ «Обо мне» без фактов, схлопываем пробелы
function normalize(text) {
  let t = (text || "").replace(/\r/g, "\n");

  // выкинем контакты/почту/телеграм/ссылки — они ни на что не влияют
  t = t.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "");
  t = t.replace(/https?:\/\/\S+/gi, "");
  t = t.replace(/(?:^|\n)\s*(тел\.?|phone|email|почта|ссылки|контакты)[^\n]*/gi, "");

  // заголовки-типа «Обо мне» оставляем только если в строке есть цифры/кириллица+тех.термины ниже
  t = t.replace(/(?:^|\n)\s*(Обо мне|About me)\s*\n[\s\S]{0,300}/gi, "\n");

  // схлопнем лишние пустые строки
  t = t.replace(/\n{3,}/g, "\n\n").trim();
  return t;
}

// Фильтрация «сигнальных» строк (цифры, технологии, достижения)
function keepSignalLines(text) {
  const lines = text.split("\n");
  const key = /(\b(?:python|sql|kafka|spark|aws|gcp|k8s|docker|terraform|react|node|java|golang|ml|osint|fraud|antifraud|aml|kyc|api)\b|\d{4}|\b\d+\+?\s*(лет|years|года?)\b)/i;

  const kept = lines.filter(l => {
    const s = l.trim();
    if (!s) return false;
    if (s.length < 3) return false;
    if (/^\W{1,3}$/.test(s)) return false;
    // оставляем заголовки разделов и строки с фактами/техами/цифрами
    return /^[-•*]/.test(s) || /^[A-ZА-Я].+:$/.test(s) || key.test(s);
  });

  // ограничим длину по строкам
  const maxLines = 180; // ~ пригодно для парсинга
  return kept.slice(0, maxLines).join("\n");
}

function fastCondense(text, kind) {
  const t0 = normalize(text);
  // если уже маленький — ничего не делаем
  const limit = LIMITS[kind].condenseIfOver;
  if (estimateTokens(t0) <= limit) return t0;

  const t1 = keepSignalLines(t0);

  // если всё ещё слишком большой — обрежем жестко (безопасный «хард-кэп»)
  const cap = LIMITS[kind].hardCap;
  let tFinal = t1;
  while (estimateTokens(tFinal) > cap) {
    // отрезаем 10% хвоста циклом
    tFinal = tFinal.slice(0, Math.floor(tFinal.length * 0.9));
  }
  return tFinal.trim();
}

module.exports = { normalize, fastCondense };
