import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Fetch the webpage
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract title
    const title = $('title').text() || $('h1').first().text() || 'Untitled Document';

    // Extract text content
    $('script, style, nav, header, footer, .nav, .header, .footer').remove();
    const text = $('body').text()
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 50000); // Limit text length

    res.json({
      success: true,
      text,
      title,
      url
    });

  } catch (error) {
    console.error('Error extracting text:', error);
    res.status(500).json({
      error: 'Failed to extract text',
      message: error.message
    });
  }
} 