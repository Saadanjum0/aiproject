# Vercel Deployment Guide

## Quick Start

1. **Push to GitHub/GitLab/Bitbucket**
2. **Import to Vercel** at [vercel.com](https://vercel.com)
3. **Add Environment Variables** in Vercel dashboard:
   - `GRADIO_SPACE_SAAD=Saadanjum0/ai-twin-caht`
   - `GRADIO_SPACE_AMMAR=Saadanjum0/Ai-twin-chat`
4. **Deploy!**

## Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
GRADIO_SPACE_SAAD=Saadanjum0/ai-twin-caht
GRADIO_SPACE_AMMAR=Saadanjum0/Ai-twin-chat
```

## Project Structure

```
├── api/                    # Vercel serverless functions (production)
│   ├── chat.js            # /api/chat endpoint
│   ├── predict.js         # /api/predict endpoint
│   ├── health.js          # /api/health endpoint
│   └── gradio-utils.js    # Shared Gradio utilities
├── server.js              # Express server (development only)
├── src/                   # React frontend
├── vercel.json            # Vercel configuration
└── package.json
```

## How It Works

### Development
- Express server (`server.js`) runs on port 3001
- Vite dev server runs on port 5173
- Vite proxy forwards `/api/*` to Express server

### Production (Vercel)
- Frontend: Static files served from CDN
- API: Serverless functions in `/api` folder
- No Express server needed

## Current Status

- ✅ **Saad**: Fully configured and working (Space: `Saadanjum0/ai-twin-caht`)
- ✅ **Ammar**: Fully configured and working (Space: `Saadanjum0/Ai-twin-chat`)

## Testing Locally

```bash
# Test the build
npm run build

# Test with Vercel CLI (optional)
vercel dev
```

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify `npm run build` works locally

### API Returns 500 Error
- Check Vercel function logs
- Verify `GRADIO_SPACE_SAAD` and `GRADIO_SPACE_AMMAR` environment variables are set
- Check that Gradio Spaces are accessible

### CORS Issues
- Serverless functions include CORS headers automatically
- Check browser console for specific errors

