import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Extract main text content from a URL
 * @param {string} url - The URL to extract text from
 * @returns {Promise<{text: string, title: string}>} - Extracted text and page title
 */
export async function extractTextFromUrl(url) {
  try {
    // Validate URL
    const urlObj = new URL(url);
    
    // Fetch HTML content
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Remove script, style, nav, header, footer, and other non-content elements
    $('script, style, nav, header, footer, .nav, .header, .footer, .sidebar, .advertisement, .ads').remove();

    // Extract title
    const title = $('title').text().trim() || $('h1').first().text().trim() || 'Untitled';

    // Extract main content
    let mainContent = '';

    // Try to find main content areas
    const contentSelectors = [
      'main',
      'article',
      '.content',
      '.main-content',
      '#content',
      '#main',
      '.post-content',
      '.entry-content'
    ];

    for (const selector of contentSelectors) {
      const content = $(selector);
      if (content.length > 0) {
        mainContent = content.text().trim();
        break;
      }
    }

    // If no main content found, extract from body
    if (!mainContent) {
      mainContent = $('body').text().trim();
    }

    // Clean up the text
    const cleanedText = mainContent
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
      .trim();

    if (!cleanedText) {
      throw new Error('No text content found on the page');
    }

    return {
      text: cleanedText,
      title: title
    };

  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      throw new Error('Invalid URL or website not found');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - website took too long to respond');
    } else if (error.response) {
      throw new Error(`HTTP ${error.response.status}: ${error.response.statusText}`);
    } else {
      throw new Error(`Failed to extract text: ${error.message}`);
    }
  }
}

/**
 * Validate if a string is a valid URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid URL
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
} 