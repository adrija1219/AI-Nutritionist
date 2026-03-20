# 🥗 NutriLens - AI Nutritionist

An AI-powered nutrition analysis app that analyzes food images and provides detailed calorie counts, macronutrient breakdowns, and health assessments.

## ✨ Features

- 📷 Upload a food photo and get instant nutritional analysis
- 🔢 Detailed calorie count for each food item
- 💪 Macronutrient breakdown (Protein, Carbs, Fats)
- ✅ Health assessment of your meal
- 💬 Add extra context like portion size or cooking method

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **AI Model:** Mistral AI (Pixtral 12B Vision)

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- A free [Mistral AI API key](https://console.mistral.ai)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/ai-nutritionist.git
cd ai-nutritionist
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
MISTRAL_API_KEY=your_mistral_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser at `http://localhost:5173`

## 📦 Production Build

```bash
npm run build
npm start
```

## 🌐 Deployment

This app can be deployed on [Render](https://render.com) for free:

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set the start command to `node server.js`
5. Add environment variable `MISTRAL_API_KEY`
6. Deploy!

## 📸 How to Use

1. Upload a photo of your meal
2. Optionally add extra context (e.g., "cooked in olive oil", "half portion")
3. Click **"Tell me the total calories"**
4. Get instant nutritional analysis!

## ⚙️ Environment Variables

| Variable | Description |
|----------|-------------|
| `MISTRAL_API_KEY` | Your Mistral AI API key from [console.mistral.ai](https://console.mistral.ai) |
| `PORT` | Server port (default: 3002) |

## 📄 License

MIT License - feel free to use and modify!

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
## Preview
<img width="945" height="582" alt="image" src="https://github.com/user-attachments/assets/6f791fc0-65fd-4d7b-8d32-4ccfd74c3893" />
