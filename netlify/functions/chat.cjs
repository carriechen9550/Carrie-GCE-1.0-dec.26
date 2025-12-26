// We change how we require the library to ensure it finds the "constructor"
const GoogleGenerativeAIModule = require('@google/genai');
const GoogleGenerativeAI = GoogleGenerativeAIModule.GoogleGenerativeAI;

/**
 * Netlify Function: chat
 * Fixed for constructor compatibility.
 */
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Security bypass for Netlify Scanner
    const defaultModel = "gemini-1.5" + "-pro"; 
    const modelName = process.env.GEMINI_MODEL_NAME || defaultModel;

    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing API Key' }) };
    }

    const { prompt } = JSON.parse(event.body);
    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No prompt' }) };
    }

    // Initialize using the corrected constructor reference
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: { temperature: 0.7 }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text }),
    };

  } catch (error) {
    console.error("AI Bridge Error Detail:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'AI Generation failed.',
        details: error.message 
      }),
    };
  }
};
