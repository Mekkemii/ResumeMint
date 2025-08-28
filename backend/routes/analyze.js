const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const OpenAI = require('openai');
const { toPlainText, normalizeExperience } = require('../services/normalize');
const { safeExtractJson } = require('../utils/safeJson');

const router = express.Router();

// Thin JSON chat wrapper using json_object for strict JSON
async function chatJSON(messages) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo-0125';
  const temperature = Number(process.env.OPENAI_TEMPERATURE ?? 0.2);
  const max_tokens = Number(process.env.MAX_TOKENS ?? 2000);

  const res = await client.chat.completions.create({
    model,
    temperature,
    max_tokens,
    response_format: { type: 'json_object' },
    messages
  });
  return res.choices?.[0]?.message?.content || '{}';
}

router.post('/analyze', async (req, res) => {
  try {
    const file = (req.file || (req.files && req.files[0])) || undefined;
    const { resumeText, jobText } = req.body || {};

    const raw = await toPlainText(file, resumeText);
    const normalized = normalizeExperience(raw);

    if (!normalized || normalized.trim().length < 20) {
      return res.status(400).json({ error: 'EMPTY_RESUME', message: 'Нужно передать текст резюме (>=20 символов)' });
    }

    const promptPath = path.join(__dirname, '..', 'prompts', 'universal_resume_v3_2.md');
    const systemPrompt = await fs.readFile(promptPath, 'utf8');

    const mode = jobText && String(jobText).trim() ? 'resume_plus_job' : 'resume_only';
    const userContent =
      `<RESUME_TEXT>\n${normalized}\n</RESUME_TEXT>\n` +
      `<JOB_TEXT>\n${jobText ? String(jobText) : ''}\n</JOB_TEXT>\n` +
      `<MODE>${mode}</MODE>`;

    const jsonStr = await chatJSON([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ]);

    let parsed;
    try {
      parsed = safeExtractJson(jsonStr);
    } catch (e) {
      return res.status(422).json({ error: 'BAD_MODEL_OUTPUT', message: 'LLM вернул не-JSON', raw_model_output: jsonStr });
    }

    // Soft schema validation for modes: require match/cover in resume_plus_job
    if (mode === 'resume_plus_job') {
      if (!parsed || typeof parsed !== 'object' || !parsed.match || !parsed.cover_letter || !parsed.job_analysis) {
        return res.status(422).json({ error: 'SCHEMA_MISMATCH', message: 'Отсутствуют job_analysis/match/cover_letter', raw_model_output: parsed });
      }
    }

    return res.json(parsed);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'SERVER_ERROR', message: e?.message || 'Unknown error' });
  }
});

module.exports = router;


