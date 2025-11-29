/**
 * API utility for calling the Express proxy server
 * The proxy server handles the Gradio API connection
 */

// Use relative URL in development (Vite proxy handles it)
// Use full URL in production or if VITE_API_URL is set
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Call the /predict endpoint via proxy
 * @param {string} message - The message to send
 * @param {Array} history - The conversation history in Gradio format [[user, bot], ...]
 * @param {string} twinName - The twin name ('saad' or 'ammar'), defaults to 'saad'
 * @returns {Promise<string>} - The response text
 */
export async function predictWithSaad(message, history = [], twinName = 'saad') {
  try {
    const url = API_BASE_URL.startsWith('http') 
      ? `${API_BASE_URL}/api/predict` 
      : `${API_BASE_URL}/predict`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        history,  // ✅ Send history to server
        twinName   // ✅ Send twin name to server
      }),
    });

    if (!response.ok) {
      // Read response text first (can only read once)
      const text = await response.text();
      console.error(`❌ API Error (${response.status}):`, text);
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch (e) {
        // Not JSON, use raw text
        throw new Error(`HTTP ${response.status}: ${text || 'Unknown error'}`);
      }
      const errorMessage = errorData.error || errorData.message || `HTTP error! status: ${response.status}`;
      console.error('   Parsed error:', errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.response || data.message || 'No response received';
  } catch (error) {
    console.error('Error calling API:', error);
    throw error;
  }
}

/**
 * Call the /chat endpoint via proxy
 * @param {string} message - The message to send
 * @param {Array} history - The conversation history in Gradio format [[user, bot], ...]
 * @param {string} twinName - The twin name ('saad' or 'ammar'), defaults to 'saad'
 * @returns {Promise<string>} - The response text
 */
export async function chatWithSaad(message, history = [], twinName = 'saad') {
  try {
    const url = API_BASE_URL.startsWith('http') 
      ? `${API_BASE_URL}/api/chat` 
      : `${API_BASE_URL}/chat`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        history,  // ✅ Send history to server
        twinName   // ✅ Send twin name to server
      }),
    });

    if (!response.ok) {
      // Read response text first (can only read once)
      const text = await response.text();
      console.error(`❌ API Error (${response.status}):`, text);
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch (e) {
        // Not JSON, use raw text
        throw new Error(`HTTP ${response.status}: ${text || 'Unknown error'}`);
      }
      const errorMessage = errorData.error || errorData.message || `HTTP error! status: ${response.status}`;
      console.error('   Parsed error:', errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.response || data.message || 'No response received';
  } catch (error) {
    console.error('Error calling API:', error);
    throw error;
  }
}

/**
 * Call the /predict endpoint via proxy for Ammar
 * @param {string} message - The message to send
 * @param {Array} history - The conversation history in Gradio format [[user, bot], ...]
 * @param {string} twinName - The twin name ('saad' or 'ammar'), defaults to 'ammar'
 * @returns {Promise<string>} - The response text
 */
export async function predictWithAmmar(message, history = [], twinName = 'ammar') {
  try {
    // Force twinName to 'ammar' to ensure correct routing
    const actualTwinName = 'ammar';
    console.log('🔍 predictWithAmmar called');
    console.log('   Original twinName param:', twinName);
    console.log('   Using twinName:', actualTwinName);
    const url = API_BASE_URL.startsWith('http') 
      ? `${API_BASE_URL}/api/predict` 
      : `${API_BASE_URL}/predict`;
    const requestBody = { 
      message,
      history,
      twinName: actualTwinName
    };
    console.log('📤 Sending request to:', url);
    console.log('📦 Request body twinName:', requestBody.twinName);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      // Read response text first (can only read once)
      const text = await response.text();
      console.error(`❌ API Error (${response.status}):`, text);
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch (e) {
        // Not JSON, use raw text
        throw new Error(`HTTP ${response.status}: ${text || 'Unknown error'}`);
      }
      const errorMessage = errorData.error || errorData.message || `HTTP error! status: ${response.status}`;
      console.error('   Parsed error:', errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.response || data.message || 'No response received';
  } catch (error) {
    console.error('Error calling API:', error);
    throw error;
  }
}

/**
 * Call the /chat endpoint via proxy for Ammar
 * @param {string} message - The message to send
 * @param {Array} history - The conversation history in Gradio format [[user, bot], ...]
 * @param {string} twinName - The twin name ('saad' or 'ammar'), defaults to 'ammar'
 * @returns {Promise<string>} - The response text
 */
export async function chatWithAmmar(message, history = [], twinName = 'ammar') {
  try {
    // Force twinName to 'ammar' to ensure correct routing
    const actualTwinName = 'ammar';
    console.log('🔍 chatWithAmmar called');
    console.log('   Using twinName:', actualTwinName);
    const url = API_BASE_URL.startsWith('http') 
      ? `${API_BASE_URL}/api/chat` 
      : `${API_BASE_URL}/chat`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        history,
        twinName: actualTwinName
      }),
    });

    if (!response.ok) {
      // Read response text first (can only read once)
      const text = await response.text();
      console.error(`❌ API Error (${response.status}):`, text);
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch (e) {
        // Not JSON, use raw text
        throw new Error(`HTTP ${response.status}: ${text || 'Unknown error'}`);
      }
      const errorMessage = errorData.error || errorData.message || `HTTP error! status: ${response.status}`;
      console.error('   Parsed error:', errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.response || data.message || 'No response received';
  } catch (error) {
    console.error('Error calling API:', error);
    throw error;
  }
}
