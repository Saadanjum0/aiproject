import express from 'express';
import cors from 'cors';
import { Client, client } from '@gradio/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Gradio Space URLs (deployed on Hugging Face Spaces)
// Currently only Saad is configured, Ammar will be added later
const GRADIO_SPACE_SAAD = process.env.GRADIO_SPACE_SAAD || process.env.GRADIO_SPACE || 'Saadanjum0/ai-twin-caht';

// Cache for Gradio clients (per space)
const gradioClients = {};

/**
 * Connect to Gradio Space
 * @param {string} spaceName - The Gradio Space name
 */
async function getGradioClient(spaceName) {
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
      console.log('🔍 Space URL:', gradioClients[spaceName].config?.space_id || 'unknown');
      
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
async function callGradioEndpoint(client, message, history = []) {
  let result;
  let lastError = null;

  // Log what we're sending
  console.log('📤 Sending to Gradio:');
  console.log('   Message:', message);
  console.log('   History length:', history.length);
  console.log('   History:', JSON.stringify(history));
  
  // ✅ FIXED: Try /chat with BOTH message and history (positional arguments)
  try {
    console.log('Trying /chat API endpoint with history...');
    result = await client.predict("/chat", [
      message,
      history  // ✅ Include history as positional argument!
    ]);
    console.log('✅ Success with /chat');
    console.log('📥 Raw result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.log('/chat with history failed:', error.message);
    lastError = error;
  }
  
  // Try without history as fallback (for compatibility)
  try {
    console.log('Trying /chat API endpoint without history...');
    result = await client.predict("/chat", [message]);
    console.log('✅ Success with /chat (no history)');
    console.log('📥 Raw result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.log('/chat without history failed:', error.message);
    lastError = error;
  }
  
  // ✅ Try /predict with history (positional arguments)
  try {
    console.log('Trying /predict API endpoint with history...');
    result = await client.predict("/predict", [
      message,
      history
    ]);
    console.log('✅ Success with /predict');
    console.log('📥 Raw result:', JSON.stringify(result, null, 2));
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
function extractResponse(result) {
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
 * POST /api/chat - Chat endpoint WITH HISTORY SUPPORT
 */
app.post('/api/chat', async (req, res) => {
  try {
    // ✅ FIXED: Get message, history, and twinName from request
    const { message, history = [], twinName = 'saad' } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }
    
    // Validate history format
    if (!Array.isArray(history)) {
      return res.status(400).json({ error: 'History must be an array' });
    }
    
    console.log('\n📨 Received request:');
    console.log('   Twin:', twinName);
    console.log('   Message:', message);
    console.log('   History items:', history.length);
    
    // Get the appropriate Gradio space for this twin
    // Currently only Saad is configured
    const spaceName = twinName === 'saad' 
      ? (process.env.GRADIO_SPACE_SAAD || process.env.GRADIO_SPACE || 'Saadanjum0/ai-twin-caht')
      : null;
    
    if (!spaceName) {
      return res.status(400).json({ error: `Twin "${twinName}" is not yet configured. Only Saad is available.` });
    }
    
    const client = await getGradioClient(spaceName);
    
    // ✅ Pass history to Gradio
    const result = await callGradioEndpoint(client, message, history);
    const response = extractResponse(result);
    
    console.log('📤 Sending response:', response);
    
    res.json({ response });
    
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ 
      error: 'Failed to get response from AI', 
      message: error.message 
    });
  }
});

/**
 * POST /api/predict - Predict endpoint (single message, no history)
 */
app.post('/api/predict', async (req, res) => {
  try {
    const { message, history = [], twinName = 'saad' } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }
    
    // Get the appropriate Gradio space for this twin
    // Currently only Saad is configured
    const spaceName = twinName === 'saad' 
      ? (process.env.GRADIO_SPACE_SAAD || process.env.GRADIO_SPACE || 'Saadanjum0/ai-twin-caht')
      : null;
    
    if (!spaceName) {
      return res.status(400).json({ error: `Twin "${twinName}" is not yet configured. Only Saad is available.` });
    }
    
    const client = await getGradioClient(spaceName);
    
    // Pass history to Gradio
    const result = await callGradioEndpoint(client, message, history);
    const response = extractResponse(result);
    
    res.json({ response });
    
  } catch (error) {
    console.error('Error in /api/predict:', error);
    res.status(500).json({ 
      error: 'Failed to get response from AI', 
      message: error.message 
    });
  }
});

/**
 * GET /api/health - Health check
 */
app.get('/api/health', async (req, res) => {
  try {
    const twinName = req.query.twin || 'saad';
    const spaceName = twinName === 'saad' ? GRADIO_SPACE_SAAD : null;
    
    if (!spaceName) {
      return res.status(400).json({ 
        status: 'unhealthy', 
        error: `Twin "${twinName}" is not yet configured` 
      });
    }
    
    const client = await getGradioClient(spaceName);
    res.json({ 
      status: 'healthy', 
      space: spaceName,
      twin: twinName,
      connected: !!client 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      error: error.message 
    });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Express proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Saad's Gradio Space: ${GRADIO_SPACE_SAAD}`);
  
  // Pre-connect to Gradio Space on startup (optional, for faster first request)
  try {
    await getGradioClient(GRADIO_SPACE_SAAD);
    console.log('✅ Ready to accept requests!');
  } catch (error) {
    console.error('❌ Failed to pre-connect to Gradio Space:', error.message);
    console.log('⚠️  Server will try to connect on first request');
  }
});
