/**
 * Vercel serverless function for /api/health
 * Health check endpoint
 */

import { getGradioClient, getGradioSpaceForTwin } from './gradio-utils.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const twinName = req.query.twin || 'saad';
    const spaceName = getGradioSpaceForTwin(twinName);
    
    const gradioClient = await getGradioClient(spaceName);
    
    res.status(200).json({ 
      status: 'healthy', 
      space: spaceName,
      twin: twinName,
      connected: !!gradioClient 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      error: error.message 
    });
  }
}

