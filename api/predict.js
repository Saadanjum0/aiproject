/**
 * Vercel serverless function for /api/predict
 * Handles chat predictions with history support
 */

import { getGradioClient, callGradioEndpoint, extractResponse, getGradioSpaceForTwin } from './gradio-utils.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history = [], twinName = 'saad' } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }
    
    // Validate history format
    if (!Array.isArray(history)) {
      return res.status(400).json({ error: 'History must be an array' });
    }

    // Get the appropriate Gradio space for this twin
    const spaceName = getGradioSpaceForTwin(twinName);
    
    console.log('\n📨 Received request:');
    console.log('   Twin:', twinName);
    console.log('   Message:', message);
    console.log('   History items:', history.length);
    
    const gradioClient = await getGradioClient(spaceName);
    
    // Pass history to Gradio
    const result = await callGradioEndpoint(gradioClient, message, history);
    const response = extractResponse(result);
    
    console.log('📤 Sending response:', response);
    
    res.status(200).json({ response });
    
  } catch (error) {
    console.error('Error in /api/predict:', error);
    res.status(500).json({ 
      error: 'Failed to get response from AI', 
      message: error.message 
    });
  }
}

