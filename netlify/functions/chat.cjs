const { GoogleGenerativeAI } = require('@google/genai');

/**
 * Netlify Function: chat
 * This handles POST requests from the frontend and communicates with Gemini AI
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
    // 2. Validate API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY in Environment Variables");
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
        body: JSON.stringify({ error: 'No prompt provided in request body.' }),
      };
    }

    // 4. Initialize Gemini AI (Model: gemini-1.5-flash)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 5. Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 6. Return the successful response to the frontend
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text }),
    };

  } catch (error) {
    console.error("Gemini AI Error:", error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'AI Generation failed.',
        details: error.message 
      }),
    };
  }
};
