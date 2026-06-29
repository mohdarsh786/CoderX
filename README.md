# CoderX

> An AI coding assistant for generating, explaining, and debugging code.

**Live demo:** [coderx.vercel.app](https://coderx.vercel.app)

---

## What it does

CoderX provides an intelligent chat interface tailored for software development tasks. It helps developers write, review, and troubleshoot code through conversational prompts. The system integrates file upload capabilities to extract context from codebase files and documents.

## Features

Generate boilerplate and feature implementations in multiple programming languages.
Identify errors and suggest fixes for broken code.
Suggest performance optimizations for provided code snippets.
Generate inline documentation and docstrings for functions and classes.
Perform structural reviews to improve code readability and maintainability.
Extract text from uploaded documents and code files to provide relevant context.
Allow non-authenticated users to interact with the AI assistant through a guest mode.
Persist conversation history and organize it by session.
Enforce usage limits per user to manage API resource consumption.

## Tech stack

| Category | Frontend | Backend |
| --- | --- | --- |
| Language/Runtime | TypeScript / Node.js | JavaScript / Node.js |
| Framework | React (Vite), TailwindCSS | Express.js |
| AI model | - | LLaMA 3.3 70B via Groq |
| Inference provider | - | Groq |
| Primary database | - | MongoDB Atlas |
| Document store | - | Supabase (PostgreSQL) |
| Auth | Zustand (State) | JWT RS256 with Rotation |
| File handling | - | Multer (In-memory storage) |
| Hosting | Vercel | Render / Heroku |

## Architecture

The application uses a multi-tenant authentication system relying on JWT RS256 signatures with secure refresh token rotation. Rate limiting is enforced via a PostgreSQL table on Supabase to track usage windows. The AI pipeline runs user inputs through a prompt injection guard and a PII scrubber before sending requests to LLaMA 3.3 70B via Groq. Responses are then parsed by an output validator and assigned a confidence score, while chat messages remain strictly isolated using unique conversation identifiers.

## Security

The prompt injection filter checks incoming queries to block malicious overrides before execution. A PII scrubber detects and redacts emails, phone numbers, and credit card numbers from user messages to prevent sensitive data from reaching the language model. Authentication relies on HTTP-only refresh token cookies to mitigate cross-site scripting attacks. Refresh token rotation implements theft detection by invalidating the entire token family if a reused token is detected. Row-level isolation is enforced at the application layer to ensure users can only access their own conversation data.

## Getting started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Supabase project
- Groq API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mohdarsh786/CoderX.git
   cd CoderX
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```

4. Copy the environment templates and configure variables:
   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

5. Start both development servers in separate terminal instances:
   ```bash
   # Terminal 1 (Server)
   cd server
   npm run dev

   # Terminal 2 (Client)
   cd client
   npm run dev
   ```

### Environment variables

#### Server `.env`
| Variable | Description |
| --- | --- |
| PORT | Port number for the Express server |
| NODE_ENV | Set to production to enable secure cookies |
| CLIENT_URL | URL of the frontend application |
| JWT_ACCESS_SECRET | Secret key for signing access tokens |
| JWT_REFRESH_SECRET | Secret key for signing refresh tokens |
| ACCESS_TOKEN_TTL | Time to live for access tokens (e.g., 15m) |
| REFRESH_TOKEN_TTL | Time to live for refresh tokens (e.g., 7d) |
| SUPABASE_URL | API URL for the Supabase project |
| SUPABASE_SERVICE_KEY | Service role key for backend operations |
| MONGO_URI | Connection string for MongoDB Atlas |
| GROQ_API_KEY | API key for Groq |
| GROQ_MODEL | Inference model (e.g., llama-3.3-70b-versatile) |
| SYSTEM_PROMPT | Override for default AI assistant behavior |
| RESPONSE_SCHEMA | Override for JSON response structure |
| VITE_API_URL | API URL fallback (optional on server) |

#### Client `.env`
| Variable | Description |
| --- | --- |
| VITE_API_URL | URL of the backend API server |

## API reference

| Method | Endpoint | Auth required | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Create a new user account |
| POST | `/api/auth/login` | No | Authenticate user and issue tokens |
| POST | `/api/auth/refresh` | No | Issue new access token using refresh cookie |
| POST | `/api/auth/logout` | Yes | Invalidate user session and clear cookies |
| POST | `/api/chats` | Yes | Initialize a new conversation |
| GET | `/api/chats` | Yes | Retrieve all conversations for the user |
| GET | `/api/chats/:conversationId` | Yes | Retrieve messages for a specific conversation |
| DELETE | `/api/chats/:conversationId` | Yes | Delete a specific conversation |
| POST | `/api/ai/message` | Yes | Process an authenticated chat message |
| POST | `/api/guest/message` | No | Process a chat message with guest rate limits |
| POST | `/api/upload` | Yes | Parse an uploaded file for context injection |
| GET | `/api/user/quota` | Yes | Retrieve the current usage and limits |

## Rate limiting

Guest users are limited to 3 messages per IP address every hour, tracked entirely in memory. Authenticated users are allocated 15 messages per 5-hour window, tracked persistently in PostgreSQL via Supabase. When a user exceeds their limit, the API returns a 429 status code containing a `resetAt` timestamp indicating when the quota resets.

## Project structure

```text
CoderX/
├── client/src/
│   ├── components/    # Reusable React UI components
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Route level page components
│   ├── services/      # API communication methods
│   └── store/         # Zustand state management
└── server/src/
    ├── config/        # Environment and service configurations
    ├── controllers/   # Route request handlers
    ├── middleware/    # Auth and request interceptors
    ├── models/        # Mongoose data schemas
    ├── pipeline/      # AI request processing and validation
    ├── routes/        # Express router definitions
    └── services/      # Business logic and external API integrations
```

## License

MIT
