import OpenAI from 'openai';
import config from '../config/config.js';

// Initialize OpenRouter client (OpenAI-compatible)
const openai = new OpenAI({
  apiKey: config.openrouter.apiKey,
  baseURL: config.openrouter.baseURL,
  defaultHeaders: {
    'HTTP-Referer': 'https://govaid-ai.com/', // Optional, for OpenRouter leaderboard
    'X-Title': 'GovAid-AI', // Optional, for OpenRouter leaderboard
  },
});

/**
 * Generate a summary of government policy text using direct OpenAI API
 * @param {string} policyText - The policy text to summarize
 * @returns {Promise<string>} - Generated summary
 */
export async function generateSummary(policyText) {
  try {
    console.log(`📝 Generating summary for text (${policyText.length} characters)`);
    console.log(`🤖 Using model: ${config.openrouter.model}`);
    
    const completion = await openai.chat.completions.create({
      model: config.openrouter.model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes government aid policies in plain English. Focus on key points, benefits, eligibility requirements, and important details that citizens need to know about government assistance programs. Use ** ** for bold text and bullet lists in markdown format. Add line breaks between paragraphs and sections to improve readability.'
        },
        {
          role: 'user',
          content: `Please summarize the following government aid policy text in a clear and easy-to-understand way. Use proper formatting with line breaks between paragraphs and sections. Use ** for bold text and bullet points (• or -) for lists. Make sure each bullet point is on its own line:\n\n${policyText}`
        }
      ],
      max_tokens: config.openrouter.maxTokens,
      temperature: config.openrouter.temperature,
    });

    const summary = completion.choices[0].message.content.trim();
    console.log(`✅ Generated summary (${summary.length} characters)`);
    
    return summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    try {
      console.error('Error (JSON):', JSON.stringify(error, null, 2));
    } catch (e) {
      console.error('Error could not be stringified:', e);
    }
    console.error('Error (toString):', error.toString());
    if (error.stack) {
      console.error('Error stack:', error.stack);
    }
    // Log all error properties
    for (const key in error) {
      if (Object.prototype.hasOwnProperty.call(error, key)) {
        console.error(`Error property [${key}]:`, error[key]);
      }
    }
    if (error.response) {
      try {
        const errorText = await error.response.text?.();
        console.error('OpenAI error response:', errorText);
      } catch (e) {
        console.error('Failed to read error response:', e);
      }
    }
    throw new Error('Failed to generate summary. Please try again.');
  }
}

/**
 * Generate eligibility checklist from policy text using direct OpenAI API
 * @param {string} policyText - The policy text to analyze
 * @returns {Promise<string[]>} - Array of eligibility requirements
 */
export async function generateEligibilityChecklist(policyText) {
  try {
    console.log(`✅ Generating eligibility checklist for text (${policyText.length} characters)`);
    
    const completion = await openai.chat.completions.create({
      model: config.openrouter.model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates concise eligibility checklists for government aid policies. Extract ONLY the essential eligibility requirements (what someone needs to qualify). Do NOT include information about benefits, how to apply, how to check balance, or how to report fraud. Format as simple bullet points (• or -) with ** for key terms. Keep each item very brief. Return ONLY the bulleted eligibility requirements - no explanations, no titles, no extra formatting.'
        },
        {
          role: 'user',
          content: `Please create a concise checklist of ONLY the eligibility requirements from the following government aid policy text. Return ONLY the requirements as bullet points (use • or - for bullets), with ** for emphasis on key terms. Focus ONLY on what someone needs to qualify - do NOT include benefits, application process, or other information. Keep each item very brief:\n\n${policyText}`
        }
      ],
      max_tokens: config.openrouter.maxTokens,
      temperature: config.openrouter.temperature,
    });

    const checklistText = completion.choices[0].message.content.trim();
    
    // Parse the checklist text into an array
    const checklist = checklistText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Remove numbering (1., 2., etc.) and bullet points, but keep the content
        return line.replace(/^\d+\.\s*/, '').replace(/^[-*•]\s*/, '');
      });

    console.log(`✅ Generated checklist with ${checklist.length} items`);
    
    return checklist;
  } catch (error) {
    console.error('Error generating eligibility checklist:', error);
    throw new Error('Failed to generate eligibility checklist. Please try again.');
  }
}

/**
 * Answer a question about a policy using direct OpenAI API
 * @param {string} policyText - The policy text as context
 * @param {string} question - The user's question
 * @returns {Promise<string>} - Answer to the question
 */
export async function answerQuestion(policyText, question) {
  try {
    console.log(`❓ Answering question: "${question}" (policy text: ${policyText.length} chars)`);
    
    const completion = await openai.chat.completions.create({
      model: config.openrouter.model,
      messages: [
        {
          role: 'system',
          content: `You are GovAid AI, a helpful and knowledgeable assistant that specializes in government aid policies and benefits. You have access to the following government aid policy document and can answer questions about it in a conversational, helpful manner.

Your role is to:
- Answer questions about government aid policies clearly and accurately
- Provide helpful, actionable information about government assistance programs
- Be conversational and friendly, like ChatGPT
- If information is not in the provided context, say so clearly
- Always be helpful and supportive
- Use ** ** for bold text and bullet lists in markdown format to make your answers more readable and structured

Government Aid Policy Document:
${policyText}`
        },
        {
          role: 'user',
          content: question
        }
      ],
      max_tokens: config.openrouter.maxTokens,
      temperature: config.openrouter.temperature,
    });

    const answer = completion.choices[0].message.content.trim();
    console.log(`💡 Generated answer (${answer.length} characters)`);
    
    return answer;
  } catch (error) {
    console.error('Error answering question:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      type: error.type,
      code: error.code
    });
    throw new Error('Failed to answer question. Please try again.');
  }
}

/**
 * Generate a comprehensive analysis of a policy using direct OpenAI API
 * @param {string} policyText - The policy text to analyze
 * @returns {Promise<{summary: string, checklist: string[]}>} - Summary and eligibility checklist
 */
export async function generatePolicyAnalysis(policyText) {
  try {
    console.log(`🔍 Starting comprehensive policy analysis`);
    
    // Generate both summary and checklist in parallel
    const [summary, checklist] = await Promise.all([
      generateSummary(policyText),
      generateEligibilityChecklist(policyText)
    ]);

    console.log(`✅ Generated analysis: ${summary.length} chars summary, ${checklist.length} checklist items`);
    
    return {
      summary,
      checklist
    };

  } catch (error) {
    console.error('Error generating policy analysis:', error);
    throw new Error('Failed to generate policy analysis. Please try again.');
  }
} 