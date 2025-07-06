import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1/',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, targetLang = 'en' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'OpenRouter API key not configured' });
    }

    const prompt = targetLang === 'en'
      ? `Create a checklist of key requirements and steps from this government policy text. Format as a numbered list. Focus on actionable items that people need to do or have. Keep it under 10 items:\n\n${text}`
      : `Create a checklist of key requirements and steps from this government policy text in ${targetLang}. Format as a numbered list. Focus on actionable items that people need to do or have. Keep it under 10 items:\n\n${text}`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates clear checklists from government policies.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.3,
    });

    const checklistText = completion.choices[0].message.content;
    const checklist = checklistText
      .split('\n')
      .filter(item => item.trim() && (item.match(/^\d+\./) || item.match(/^[-*]/)))
      .map(item => item.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim())
      .filter(item => item.length > 0);

    res.json({
      success: true,
      checklist,
      count: checklist.length,
      translated: targetLang !== 'en',
      targetLanguage: targetLang
    });

  } catch (error) {
    console.error('Error generating checklist:', error);
    res.status(500).json({
      error: 'Failed to generate checklist',
      message: error.message
    });
  }
} 