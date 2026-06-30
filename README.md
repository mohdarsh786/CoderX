# CoderX

<p align="center">
  <h3 align="center">An AI coding assistant that generates, debugs, optimizes, and explains code through natural conversation.</h3>
</p>

<p align="center">
  <a href="https://coderx-seven.vercel.app/">
    <img src="https://img.shields.io/badge/TRY%20LIVE%20DEMO-Launch%20CoderX-f0d840?style=for-the-badge&logo=vercel&logoColor=black" alt="Live Demo"/>
  </a>
  &nbsp;
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/LLaMA_3.3_70B-Groq-F55036?style=for-the-badge&logo=meta&logoColor=white" alt="LLaMA"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
</p>

---

## About CoderX

CoderX is a full-stack SaaS coding assistant built for developers who want fast, accurate AI help without leaving their workflow. It supports code generation, debugging, optimization, documentation, and code review — all through a chat interface. Guest users get 3 real AI responses before being prompted to sign up. Authenticated users get 15 messages per 5-hour window with full chat history.

---

## 📸 Screenshots

> Screenshots from the platform.

### Landing Page
<p align="center">
<img src="./images/Landing Page.png" width="95%" alt="Landing Page"/>
</p>

### Chat Interface
<p align="center">
<img src="./images/homepage.png" width="95%" alt="Chat Interface"/>
</p>

### How chat would look like
<p align="center">
<img src="./images/Chatexample.png" width="95%" alt="Chat example"/>
</p>

---

## Features

- Code generation — produces clean, commented code from natural language prompts across multiple languages
- Debugging — identifies syntax and logical errors, explains the root cause, and suggests fixes
- Optimization — improves time complexity, memory usage, and applies industry best practices
- Documentation — generates inline comments, function descriptions, and README content
- Code review — detects code smells, naming issues, and refactoring opportunities
- File upload with RAG — users can attach code files, PDFs, and text documents; content is extracted and injected into the model context
- Guest mode — unauthenticated users get 3 real AI responses (LLaMA 3.3 70B) before sign-up is required
- Chat history — each conversation is stored per user with auto-generated titles and sidebar navigation
- Rate limiting — 15 messages per 5-hour window per user, tracked server-side in PostgreSQL
- Security pipeline — prompt injection filtering and PII scrubbing run on every message before it reaches the model

---

## Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-State-orange?style=for-the-badge)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Prism.js](https://img.shields.io/badge/Prism.js-Syntax-a8b9cc?style=for-the-badge)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-RS256-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-cost_12-333333?style=for-the-badge)
![Multer](https://img.shields.io/badge/Multer-File_Handling-blueviolet?style=for-the-badge)

### AI
![LLaMA](https://img.shields.io/badge/LLaMA_3.3_70B-Meta-0467DF?style=for-the-badge&logo=meta&logoColor=white)
![Groq](https://img.shields.io/badge/Inference-Groq-F55036?style=for-the-badge)

### Database
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

### Cloud
![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=for-the-badge&logo=render&logoColor=black)

---

## 🏗️ Architecture

```text
[Browser]
   │
   └──► [Vercel — React + Vite]
              │
              └──► [Render — Express API]
                         ├──► [Supabase — PostgreSQL]
                         │      users · refresh_tokens · rate_limits
                         ├──► [MongoDB Atlas]
                         │      chats · messages
                         └──► [Groq API — LLaMA 3.3 70B]
```

---

## Security

Every user message passes through a four-stage pipeline before reaching the model:

```text
User message
   │
   ├──► Prompt injection filter (regex — blocks system prompt override attempts)
   ├──► PII scrubber (strips emails, phone numbers, card numbers)
   ├──► LLaMA 3.3 70B  (temperature 0.2, JSON mode enforced)
   └──► Output validator (schema check + confidence scoring)
```

Additional security measures:

- JWT access tokens signed with RS256, 15-minute TTL, stored in memory
- Refresh tokens stored in HTTP-only SameSite=Strict cookies with rotation on every use
- Token theft detection — reuse of a rotated token invalidates the entire token family
- Passwords hashed with bcrypt at cost factor 12
- Rate limiting enforced server-side in PostgreSQL — client cannot bypass it
- Guest rate limiting enforced per IP in-memory — 3 requests per hour
- CORS restricted to explicit origin, credentials mode enabled
- File uploads processed in memory — no files written to disk or stored externally
- Multer fileFilter blocks unsupported extensions before processing begins

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Supabase project
- Groq API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mohdarsh786/coderx.git
   cd coderx
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example server/.env
   # Fill in the values listed in the Environment Variables section below
   ```

5. Set up the Supabase tables — refer to the private schema documentation.

6. Run both servers:
   ```bash
   # Terminal 1
   cd server
   npm run dev

   # Terminal 2
   cd client
   npm run dev
   ```

---

## Environment Variables

### Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Port the Express server runs on (default: 5000) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Frontend URL for CORS (e.g. `http://localhost:5173`) |
| `JWT_ACCESS_SECRET` | 64-character random string for signing access tokens |
| `JWT_REFRESH_SECRET` | 64-character random string for signing refresh tokens |
| `ACCESS_TOKEN_TTL` | Access token expiry (default: `15m`) |
| `REFRESH_TOKEN_TTL` | Refresh token expiry (default: `7d`) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (not the anon key) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `GROQ_API_KEY` | from groq.com
| `GROQ_MODEL` | Model name — `llama-3.3-70b-versatile` |

### Client (`client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (e.g. `http://localhost:5000`) |

Generate JWT secrets with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---


## Rate Limiting

CoderX enforces two independent rate limiting tiers.

Guest tier — 3 requests per IP per hour, tracked in memory. On the 4th request the server returns `429` with `{ signInRequired: true }`.

Authenticated tier — 15 messages per 5-hour rolling window per user, tracked in PostgreSQL. On the 16th request within the window the server returns `429` with `{ resetAt: <ISO timestamp>, waitMs: <milliseconds> }`. The frontend displays a live countdown timer and disables the input until the window resets.

---

## Project Structure

```text
CoderX/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── auth/        # Login and signup forms
│       │   ├── chat/        # ChatWindow, MessageList, MessageInput, QuotaBar
│       │   ├── landing/     # Landing page sections
│       │   ├── layout/      # Sidebar
│       │   └── ui/          # CodeBlock, Avatar, reusable elements
│       ├── hooks/           # useAuth, useChat, useQuota, useGuest
│       ├── pages/           # Landing, Chat, Login, Signup, NotFound
│       ├── services/        # API call functions (auth, chat, upload)
│       └── store/           # Zustand slices (auth state)
│
└── server/                  # Node.js + Express backend
    └── src/
        ├── config/          # Supabase client, MongoDB connection, Multer config
        ├── controllers/     # Route handlers (auth, chat, ai, user)
        ├── middleware/      # JWT auth, rate limiting, error handling
        ├── models/          # MongoDB schemas (Chat, Message)
        ├── pipeline/        # Prompt guard, PII scrub, Groq client, output validator
        ├── routes/          # Express routers
        └── services/        # Business logic (auth, token, chat, AI, rate limit)
```

---

## Author

Built by **Mohd. Arsh** — [![GitHub](https://img.shields.io/badge/GitHub-mohdarsh786-181717?style=flat&logo=github)](https://github.com/mohdarsh786)

contact details: In profile

---

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
