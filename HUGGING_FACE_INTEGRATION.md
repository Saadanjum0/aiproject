# Hugging Face Integration Guide (Teacher-Friendly)

This document explains exactly **what the project is** and **how it connects to Hugging Face Spaces (Gradio)**—both locally and when deployed to Vercel—so it’s clear and repeatable.

---

## 1) What the Project Is
- A React + Vite frontend with a chat UI for two AI twins: **Saad** and **Ammar**.
- A thin backend layer that forwards chat requests to **Gradio Spaces** hosted on Hugging Face:
  - Saad’s Space: `Saadanjum0/ai-twin-caht`
  - Ammar’s Space: `Saadanjum0/Ai-twin-chat`
- In production, the backend runs as **Vercel serverless functions** (`/api/*`).
- In local development, an **Express server** (`server.js`) proxies to the same Hugging Face Spaces.

---

## 2) High-Level Architecture

```
Frontend (React/Vite)
  │
  │  HTTP POST /api/chat or /api/predict
  ▼
Backend
  - Local dev: Express server (server.js)
  - Production: Vercel serverless functions in /api
  │
  │  Gradio client
  ▼
Hugging Face Spaces (Gradio)
  - Saad: Saadanjum0/ai-twin-caht
  - Ammar: Saadanjum0/Ai-twin-chat
```

---

## 3) How the Connection to Hugging Face Works

### 3.1 Code Path (Serverless and Local)
- **Serverless (Vercel)**: Files in `/api` (`chat.js`, `predict.js`, `health.js`) use shared helpers in `api/gradio-utils.js`.
- **Local Dev (Express)**: `server.js` uses the same Gradio helpers to reach Hugging Face.
- **Gradio Client**: `@gradio/client` connects to the Space via `Client.connect(spaceName)` with a fallback to `client(spaceName)`.

### 3.2 Environment Variables (the only config you must set)
- `GRADIO_SPACE_SAAD=Saadanjum0/ai-twin-caht`
- `GRADIO_SPACE_AMMAR=Saadanjum0/Ai-twin-chat`
- (Optional legacy) `GRADIO_SPACE=Saadanjum0/ai-twin-caht`
- Local `.env` example provided in `.env.example`.
- Vercel: set these in **Project → Settings → Environment Variables** for all environments.

### 3.3 Request/Response Flow
1. **Frontend** calls `/api/chat` (or `/api/predict`) with JSON:
   ```json
   {
     "message": "Hi",
     "history": [["Hi", "Hello!"]],
     "twinName": "ammar"
   }
   ```
2. **Backend** picks the Space by `twinName`:
   - `saad` → `GRADIO_SPACE_SAAD`
   - `ammar` → `GRADIO_SPACE_AMMAR`
3. **Gradio Call**: `client.predict("/chat", [message, history])` (falls back to `/predict` if needed).
4. **Response Extraction**: The server extracts the bot reply from the Gradio result and returns `{ "response": "<text>" }`.

---

## 4) Files that Matter
- **Frontend**:
  - `src/components/Chat.jsx` – chat UI, builds `history`, sends `twinName`.
  - `src/api/gradio.js` – small fetch helpers; passes `twinName` through.
- **Backend (serverless)**:
  - `api/chat.js`, `api/predict.js`, `api/health.js` – Vercel functions.
  - `api/gradio-utils.js` – connects to Gradio, chooses Space, extracts response.
- **Local Dev Backend**:
  - `server.js` – Express proxy for local testing only (not used on Vercel).
- **Config/Docs**:
  - `vercel.json` – Vercel rewrites/headers.
  - `DEPLOYMENT.md` – deployment steps.
  - `.env.example` – required env vars.

---

## 5) Endpoints (Backend)
### `/api/chat` (POST)
- Body: `{ message: string, history: Array<[user, bot]>, twinName: "saad" | "ammar" }`
- Returns: `{ response: string }`

### `/api/predict` (POST)
- Same body as `/api/chat`. Kept for compatibility; uses same Gradio flow.

### `/api/health` (GET)
- Query: `?twin=saad` or `?twin=ammar`
- Returns Space connectivity status.

---

## 6) Gradio History Format
- Gradio expects: `[[user1, bot1], [user2, bot2], ...]`
- The frontend builds this from the message list and sends it each request to preserve context.

---

## 7) Error Handling
- Server returns `{ error, message }` on failures with HTTP 500.
- Common causes:
  1) Space not running (cold start or sleeping).
  2) Incorrect Space name (case-sensitive).
  3) Network hiccups/timeouts.
- Logs:
  - Local: terminal running `npm run server`.
  - Vercel: Project → Functions → Logs.

---

## 8) Local Development vs. Production
- **Local Dev**:
  - Start proxy: `npm run server` (Express on port 3001).
  - Start frontend: `npm run dev` (Vite on port 5173, proxied to 3001).
  - Or both: `npm run dev:all`.
  - Env vars from `.env`.
- **Production (Vercel)**:
  - No Express server used.
  - Vercel serverless functions in `/api` call Hugging Face directly.
  - Env vars set in Vercel dashboard.

---

## 9) Deployment (Vercel)
1) Push to GitHub.  
2) Import repo in Vercel.  
3) Set env vars (all environments):  
   - `GRADIO_SPACE_SAAD=Saadanjum0/ai-twin-caht`  
   - `GRADIO_SPACE_AMMAR=Saadanjum0/Ai-twin-chat`  
4) Deploy.  
5) Verify: `https://<your-domain>/api/health?twin=saad` and `...twin=ammar`.

---

## 10) How to Explain to a Teacher (Plain Language)
- We built a web chat for two AI personas (twins).
- The web app sends your message to a tiny backend.
- The backend forwards it to a hosted AI model on Hugging Face (Gradio Space).
- The AI replies, and we show the response in the chat.
- Two separate Hugging Face Spaces are used—one per twin. We pick which one based on `twinName`.
- No keys needed; Spaces are public. Env vars only tell us which Space to call.
- In production, Vercel serverless functions handle the forwarding; no long-running servers.

---

## 11) Quick Verification Checklist
- [ ] Env vars set for both twins (Saad and Ammar).
- [ ] Health check responds for both twins.
- [ ] Chat works locally (`npm run dev:all`).
- [ ] Vercel deploy succeeds (`vercel.json` present, build passes).
- [ ] Hugging Face Spaces are running (not sleeping) when testing.

---

## 12) Key Takeaways
- **Separation of concerns**: React UI + thin proxy + Hugging Face Spaces.
- **Config by env vars**: switch Spaces without code changes.
- **Serverless-friendly**: Works on Vercel; no custom servers in production.
- **Gradio-native**: Uses `@gradio/client` to talk directly to the Spaces.


