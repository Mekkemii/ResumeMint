const { estimateTokens, LIMITS } = require('../utils/tokens');

const SYS = "Ты помогаешь сжать текст до ключевых фактов без потери сущностей. Отвечай ТОЛЬКО текстом, без разметки.";

function makeUser(text, kind) {
  return `Сожми ${kind === "resume" ? "резюме" : "описание вакансии"} до 700–1200 слов, оставив:
- стек/технологии/инструменты,
- достижения с цифрами,
- названия компаний/проектов/ролей и годы,
- ключевые обязанности/результаты,
- для вакансии — требования в виде коротких пунктов.

Исходный текст:
${text}`;
}

async function llmCondenseIfHuge(text, kind, chatJson) {
  const cap = LIMITS[kind].hardCap;
  if (estimateTokens(text) <= cap * 1.3) return text; // не настолько огромный — пропускаем

  try {
    const { json, usage } = await chatJson([
      { role: "system", content: SYS },
      { role: "user", content: makeUser(text, kind) }
    ], {
      max_tokens: 900,
      temperature: 0.2,
      model: 'gpt-3.5-turbo' // используем более дешёвую модель для сжатия
    });

    // Возвращаем текст из JSON или raw ответ
    return (json._raw || JSON.stringify(json) || "").trim();
  } catch (error) {
    console.error('LLM condense error:', error);
    // В случае ошибки возвращаем исходный текст
    return text;
  }
}

module.exports = { llmCondenseIfHuge };
