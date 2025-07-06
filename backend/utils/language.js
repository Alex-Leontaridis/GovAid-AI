import { franc } from 'franc';
import OpenAI from 'openai';
import config from '../config/config.js';

const openai = new OpenAI({ 
  apiKey: config.openrouter.apiKey,
  baseURL: config.openrouter.baseURL,
  defaultHeaders: {
    'HTTP-Referer': 'https://govaid-ai.com/',
    'X-Title': 'GovAid-AI',
  },
});

/**
 * Detect language of a text using franc
 * @param {string} text
 * @returns {string} ISO 639-1 code (e.g., 'en', 'es')
 */
export function detectLanguage(text) {
  const langCode = franc(text, { minLength: 10 });
  // Map franc's ISO 639-3 to ISO 639-1 for common languages
  const map = { spa: 'es', eng: 'en', fra: 'fr', deu: 'de', ita: 'it', por: 'pt', rus: 'ru', zho: 'zh', jpn: 'ja' };
  return map[langCode] || langCode;
}

/**
 * Translate text to a target language using OpenAI
 * @param {string} text
 * @param {string} targetLang - ISO 639-1 code (e.g., 'es')
 * @returns {Promise<string>} - Translated text
 */
export async function translateText(text, targetLang = 'es') {
  const prompt = `Translate the following text to ${targetLang === 'es' ? 'Spanish' : targetLang}:

${text}

Translation:`;
  const response = await openai.chat.completions.create({
    model: config.openrouter.model,
    messages: [
      { role: 'system', content: 'You are a professional translator.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: config.openrouter.maxTokens,
    temperature: 0.2,
  });
  return response.choices[0].message.content.trim();
} 