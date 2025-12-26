const { GoogleGenerativeAI } = require('@google/genai');

/**
 * Netlify Function: chat
 * This handles POST requests from the frontend and communicates with the Gemini AI model.
 * The model name is managed via environment variables for easy future upgrades.
 */
exports.handler = async (event, context) => {
  // 1. Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed. Please use POST.' }),
    };
  }

  try {
    // 2. Load Configuration from Environment Variables
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Default to 'gemini-1.5-pro' if no model is specified in Netlify settings
    const modelName = process.env.GEMINI_MODEL_NAME || 'gemini-1.5-pro';

    if (!apiKey) {
      console.error("Configuration Error: GEMINI_API_KEY is missing.");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server configuration error: Missing API Key.' }),
      };
    }

    // 3. Parse the request body
    const { prompt } = JSON.parse(event.body);
    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No prompt provided.' }),
      };
    }

    // 4. Initialize Gemini AI with dynamic model selection
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });

    console.log(`Using model: ${modelName}`); // Helpful for debugging in Netlify logs

    // 5. Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 6. Return response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Optional: Helps with cross-origin issues
      },
      body: JSON.stringify({ text: text }),
    };

  } catch (error) {
    console.error("AI Bridge Error:", error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'AI Generation failed.',
        details: error.message 
      }),
    };
  }
};
