const { estimateTokens } = require('../utils/tokens');
const { fastCondense } = require('../utils/condense');
const { llmCondenseIfHuge } = require('./llmCondense');

/**
 * Подготавливает текст для анализа с автоматическим ужиманием
 * @param {string} text - исходный текст
 * @param {string} kind - тип текста ("resume" или "jd")
 * @param {Function} chatJson - функция для LLM запросов
 * @returns {Promise<Object>} информация о предобработке
 */
async function prepareText(text, kind, chatJson) {
  const originalTokens = estimateTokens(text || "");
  let out = text || "";
  let method = "none";

  // быстрый, бесплатный проход
  const fast = fastCondense(out, kind);
  if (fast !== out) { 
    out = fast; 
    method = "fast"; 
  }

  // если всё ещё огромный — мини-LLM-ужимка
  if (chatJson) {
    const llm = await llmCondenseIfHuge(out, kind, chatJson);
    if (llm !== out) { 
      out = llm; 
      method = "llm"; 
    }
  }

  return {
    originalTokens,
    finalTokens: estimateTokens(out),
    condensed: method !== "none",
    method,
    text: out
  };
}

module.exports = { prepareText };
