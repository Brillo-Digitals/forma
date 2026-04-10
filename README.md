# FORMA

FORMA is a Next.js page-builder app with AI section generation, drag-and-drop editing, and publishing.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create local environment variables:

```bash
copy .env.example .env.local
```

3. Update .env.local with your Gemini key:

```env
GEMINI_API_KEY=your_real_key
GEMINI_MODEL=gemini-2.0-flash
```

4. Start the app:

```bash
npm run dev
```

5. Open http://localhost:3000

## AI configuration

The AI endpoint is at src/app/api/generate/route.ts.

- GEMINI_API_KEY: required, used by the server route.
- GEMINI_MODEL: optional, defaults to gemini-2.0-flash.

If GEMINI_API_KEY is missing, the API returns a clear configuration error.

## Security note

If you have ever pasted an API key into chat, logs, or source files, rotate it immediately in Google AI Studio and use a new key in .env.local.
