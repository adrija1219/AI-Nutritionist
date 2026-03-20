# AI Nutritionist

Upload a food photo and get instant calorie counts + nutrition analysis powered by Google Gemini AI.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create your .env file
```bash
cp .env.example .env
```
Then open `.env` and add your Google Gemini API key:
```
GOOGLE_API_KEY=your_key_here
```
Get a free key at: https://aistudio.google.com/app/apikey

### 3. Run in development mode
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### 4. Build for production
```bash
npm run build
npm start
```
Then open http://localhost:3001

## File Structure
```
ai-nutritionist/
├── server.js        ← Express backend (calls Gemini API)
├── index.html       ← Vite HTML entry
├── vite.config.js   ← Vite config (proxies /api to Express)
├── package.json
├── .env             ← Your API key goes here (create from .env.example)
└── src/
    ├── main.jsx     ← React entry
    ├── App.jsx      ← Main app component
    └── index.css    ← All styles
```
