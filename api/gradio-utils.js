/**
 * Shared utilities for Gradio API calls
 * Used by both Express server (dev) and Vercel serverless functions (production)
 */

import { Client, client } from '@gradio/client';

// Cache for Gradio clients (per space)
const gradioClients = {};

/**
 * Connect to Gradio Space
 * @param {string} spaceName - The Gradio Space name (e.g., 'Saadanjum0/ai-twin-caht')
 */
export async function getGradioClient(spaceName) {
  if (!gradioClients[spaceName]) {
    try {
      console.log(`Connecting to Gradio Space: ${spaceName}`);
      // Try Client.connect() first, fallback to client() function
      try {
        gradioClients[spaceName] = await Client.connect(spaceName);
      } catch (error) {
        console.log('Client.connect() failed, trying client() function...');
        gradioClients[spaceName] = await client(spaceName);
      }
      console.log('✅ Connected to Gradio Space:', spaceName);
      return gradioClients[spaceName];
    } catch (error) {
      console.error('❌ Failed to connect to Gradio Space:', error);
      throw error;
    }
  }
  return gradioClients[spaceName];
}

/**
 * Call Gradio endpoint with message AND HISTORY
 */
export async function callGradioEndpoint(gradioClient, message, history = []) {
  let result;
  let lastError = null;

  // Log what we're sending
  console.log('📤 Sending to Gradio:');
  console.log('   Message:', message);
  console.log('   History length:', history.length);
  
  // ✅ Try /chat with BOTH message and history (positional arguments)
  try {
    console.log('Trying /chat API endpoint with history...');
    result = await gradioClient.predict("/chat", [
      message,
      history
    ]);
    console.log('✅ Success with /chat');
    return result;
  } catch (error) {
    console.log('/chat with history failed:', error.message);
    lastError = error;
  }
  
  // Try without history as fallback (for compatibility)
  try {
    console.log('Trying /chat API endpoint without history...');
    result = await gradioClient.predict("/chat", [message]);
    console.log('✅ Success with /chat (no history)');
    return result;
  } catch (error) {
    console.log('/chat without history failed:', error.message);
    lastError = error;
  }
  
  // ✅ Try /predict with history (positional arguments)
  try {
    console.log('Trying /predict API endpoint with history...');
    result = await gradioClient.predict("/predict", [
      message,
      history
    ]);
    console.log('✅ Success with /predict');
    return result;
  } catch (error) {
    console.log('/predict with history failed:', error.message);
    lastError = error;
  }

  throw lastError || new Error('Could not find working endpoint');
}

/**
 * Extract response from Gradio result
 */
export function extractResponse(result) {
  let response = result;
  
  if (result && result.data) {
    if (Array.isArray(result.data) && result.data.length > 0) {
      response = result.data[0];
      
      // Handle nested arrays (chat history format)
      if (Array.isArray(response) && response.length > 0) {
        const lastMessage = response[response.length - 1];
        if (Array.isArray(lastMessage) && lastMessage.length > 1) {
          response = lastMessage[1]; // [user, bot] format
        } else {
          response = lastMessage;
        }
      }
    } else {
      response = result.data;
    }
  }
  
  // Ensure response is a string
  if (typeof response !== 'string') {
    response = String(response);
  }
  
  return response;
}

/**
 * Get Gradio Space name for a twin
 */
export function getGradioSpaceForTwin(twinName) {
  if (twinName === 'saad') {
    return process.env.GRADIO_SPACE_SAAD || process.env.GRADIO_SPACE || 'Saadanjum0/ai-twin-caht';
  }
  if (twinName === 'ammar') {
    return process.env.GRADIO_SPACE_AMMAR || 'Saadanjum0/Ai-twin-chat';
  }
  throw new Error(`Unknown twin "${twinName}". Available twins: saad, ammar`);
}

