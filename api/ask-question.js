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
    const { policyText, question, targetLang = 'en' } = req.body;

    if (!policyText || !question) {
      return res.status(400).json({ error: 'Policy text and question are required' });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'OpenRouter API key not configured' });
    }

    const prompt = targetLang === 'en'
      ? `Based on the following government policy text, please answer this question in clear, plain language:\n\nPolicy Text: ${policyText}\n\nQuestion: ${question}\n\nAnswer:`
      : `Based on the following government policy text, please answer this question in ${targetLang} using clear, plain language:\n\nPolicy Text: ${policyText}\n\nQuestion: ${question}\n\nAnswer:`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that explains government policies in clear, plain language. Always provide accurate, helpful answers based on the policy text provided.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });

    const answer = completion.choices[0].message.content;

    res.json({
      success: true,
      question,
      answer,
      translated: targetLang !== 'en',
      targetLanguage: targetLang
    });

  } catch (error) {
    console.error('Error answering question:', error);
    res.status(500).json({
      error: 'Failed to answer question',
      message: error.message
    });
  }
} 