# Vercel Deployment Guide

## Quick Start

1. **Push to GitHub/GitLab/Bitbucket**
2. **Import to Vercel** at [vercel.com](https://vercel.com)
3. **Add Environment Variables** in Vercel dashboard:
   - `GRADIO_SPACE_SAAD=Saadanjum0/ai-twin-caht`
   - `GRADIO_SPACE_AMMAR=Saadanjum0/Ai-twin-chat`
4. **Deploy!**

## Environment Variables

### Required Environment Variables

Add these in **Vercel Dashboard → Settings → Environment Variables**:

**For all environments (Production, Preview, Development):**

```
GRADIO_SPACE_SAAD=Saadanjum0/ai-twin-caht
GRADIO_SPACE_AMMAR=Saadanjum0/Ai-twin-chat
```

### Important Notes:
- These environment variables are **required** for the app to work
- Vercel serverless functions can access these via `process.env`
- The Gradio client will automatically connect to Hugging Face Spaces using these values
- No API keys needed - Gradio Spaces are publicly accessible

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

## Deployment Checklist

Before deploying, ensure:

- [ ] Code is pushed to GitHub/GitLab/Bitbucket
- [ ] Environment variables are set in Vercel dashboard:
  - [ ] `GRADIO_SPACE_SAAD=Saadanjum0/ai-twin-caht`
  - [ ] `GRADIO_SPACE_AMMAR=Saadanjum0/Ai-twin-chat`
- [ ] Build works locally: `npm run build`
- [ ] Both Gradio Spaces are running on Hugging Face:
  - [ ] https://huggingface.co/spaces/Saadanjum0/ai-twin-caht (Saad)
  - [ ] https://huggingface.co/spaces/Saadanjum0/Ai-twin-chat (Ammar)

## Post-Deployment Verification

After deployment:

1. Visit your Vercel URL
2. Test health endpoint: `https://your-domain.vercel.app/api/health?twin=saad`
3. Try chatting with both Saad and Ammar
4. Check Vercel function logs if there are any errors

## How Hugging Face Connection Works in Production

- ✅ **No API Keys Required**: Gradio Spaces are publicly accessible
- ✅ **Automatic Connection**: `@gradio/client` handles all connections
- ✅ **Works from Serverless**: Vercel serverless functions can connect to Hugging Face
- ✅ **CORS Handled**: All CORS headers are set in serverless functions
- ✅ **Error Handling**: Proper error responses for connection failures

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify `npm run build` works locally
- Ensure Node.js version is compatible (Vercel uses Node 20.x)

### API Returns 500 Error
- Check Vercel function logs (Vercel Dashboard → Your Project → Functions → View Logs)
- Verify `GRADIO_SPACE_SAAD` and `GRADIO_SPACE_AMMAR` environment variables are set
- Check that Gradio Spaces are running and accessible on Hugging Face
- Verify the space names match exactly (case-sensitive)

### CORS Issues
- Serverless functions include CORS headers automatically
- Check browser console for specific errors
- Verify the request is going to `/api/*` endpoints

### Connection to Hugging Face Fails
- Check Vercel function logs for detailed error messages
- Verify Gradio Spaces are running (not sleeping)
- Ensure space names are correct in environment variables
- Check Vercel function timeout (default 10s, can increase to 60s if needed)

