# AI Twin Chat - Saad & Ammar

A React frontend with Express proxy server connecting to Gradio AI models on Hugging Face Spaces.

> 📖 **For comprehensive project documentation** (ideal for teachers, educators, and detailed understanding), see **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)** - This document explains what the project is, how it works, architecture, educational value, and much more!

## Architecture

```
React App (Frontend) → Express Proxy Server → Gradio API (Hugging Face Spaces)
```

The Express proxy server handles:
- CORS issues (browsers can't directly call external APIs)
- Error handling (timeouts, cold starts, etc.)
- Connection management to the Gradio Space

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3001
GRADIO_SPACE_SAAD=Saadanjum0/ai-twin-caht
# For backward compatibility
GRADIO_SPACE=Saadanjum0/ai-twin-caht
```

**Note:** Currently only Saad is configured. Ammar will use a different Gradio space when added.

### 3. Run the Application

#### Option A: Run Both Servers Separately

Terminal 1 - Start the Express proxy server:
```bash
npm run server
```

Terminal 2 - Start the React dev server:
```bash
npm run dev
```

#### Option B: Run Both Servers Together

```bash
npm run dev:all
```

This will start both the Express server (port 3001) and the Vite dev server (port 5173) concurrently.

## API Endpoints

### Express Proxy Server (Port 3001)

- `POST /api/chat` - Chat with the AI twin
- `POST /api/predict` - Predict endpoint (same as chat)
- `GET /api/health` - Health check

### Request Format

```json
{
  "message": "Hello, how are you?",
  "history": [],
  "twinName": "saad"
}
```

**Note:** `history` is an array of conversation pairs: `[["user message", "bot response"], ...]`

### Response Format

```json
{
  "response": "I'm doing well, thanks for asking!"
}
```

## Project Structure

```
├── server.js              # Express proxy server
├── src/
│   ├── api/
│   │   └── gradio.js      # API client (calls Express proxy)
│   ├── components/
│   │   ├── Chat.jsx       # Chat component
│   │   └── Chat.css       # Chat styles
│   └── App.jsx            # Main app component
├── package.json
└── vite.config.js         # Vite config with proxy setup
```

## How It Works

1. **React Frontend**: User sends a message through the chat interface
2. **API Client** (`src/api/gradio.js`): Makes a fetch request to the Express proxy
3. **Express Proxy** (`server.js`): 
   - Connects to Gradio Space using `@gradio/client`
   - Calls the appropriate endpoint
   - Returns the response to the frontend

## Troubleshooting

### Server won't start
- Make sure port 3001 is not in use
- Check that all dependencies are installed

### CORS errors
- The Express server should handle CORS automatically
- Make sure the proxy server is running

### Connection to Gradio fails
- Check that the Gradio Space is running on Hugging Face
- Verify the `GRADIO_SPACE` environment variable is correct
- Check the server logs for detailed error messages

## Development

- Frontend runs on: `http://localhost:5173`
- Backend API runs on: `http://localhost:3001`
- Vite proxy forwards `/api/*` requests to the Express server

## Deployment to Vercel

### Prerequisites

1. Install Vercel CLI (optional, for local testing):
```bash
npm i -g vercel
```

2. Push your code to GitHub/GitLab/Bitbucket

### Deploy Steps

1. **Import Project to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your repository

2. **Configure Environment Variables:**
   In Vercel dashboard, go to Settings → Environment Variables and add:
   ```
   GRADIO_SPACE_SAAD=Saadanjum0/ai-twin-caht
   ```
   (Optional: `GRADIO_SPACE` for backward compatibility)

3. **Build Settings:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### How It Works on Vercel

- **Frontend**: Built as static files and served from Vercel CDN
- **API Routes**: Serverless functions in `/api` folder handle backend requests
- **No Express Server**: The Express server (`server.js`) is only for local development
- **Production API**: Uses Vercel serverless functions (`/api/predict.js`, `/api/chat.js`)

### Current Status

- ✅ **Saad**: Fully configured and working
- ⏳ **Ammar**: Will be added later with a different Gradio space

### Adding Ammar Later

When ready to add Ammar:
1. Set `GRADIO_SPACE_AMMAR` environment variable in Vercel
2. Update `api/gradio-utils.js` to handle Ammar's space
3. The Chat component will automatically work with both twins
