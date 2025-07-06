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
      ? `Please provide a clear, concise summary of the following government policy text. Focus on the key points, requirements, and benefits. Keep it under 200 words:\n\n${text}`
      : `Please provide a clear, concise summary of the following government policy text in ${targetLang}. Focus on the key points, requirements, and benefits. Keep it under 200 words:\n\n${text}`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes government policies in clear, plain language.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    const summary = completion.choices[0].message.content;

    res.json({
      success: true,
      summary,
      originalLength: text.length,
      translated: targetLang !== 'en',
      targetLanguage: targetLang
    });

  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({
      error: 'Failed to generate summary',
      message: error.message
    });
  }
} 