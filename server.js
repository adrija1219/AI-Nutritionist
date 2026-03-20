import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use((req, res, next) => {
  res.setTimeout(60000);
  next();
});

if (fs.existsSync(join(__dirname, 'dist'))) {
  app.use(express.static(join(__dirname, 'dist')));
}

if (!process.env.MISTRAL_API_KEY) {
  console.error('ERROR: MISTRAL_API_KEY is not set in your .env file!');
  process.exit(1);
}

const NUTRITION_PROMPT = `You are an expert nutritionist. Look at the food items in the image and calculate the total calories.
Provide details of every food item with its calorie count in the following format:
1. Item 1 - X calories
2. Item 2 - X calories
...
----
Total Calories: X calories
Then provide:
- Whether the meal is healthy or not, and why
- Macronutrient breakdown:
  - Protein: Xg
  - Carbohydrates: Xg
  - Fats: Xg
Be specific and accurate in your estimates.`;

app.post('/api/analyze', async (req, res) => {
  try {
    const { imageBase64, mimeType, extraInstructions } = req.body;

    if (!imageBase64 || !mimeType) {
      return res.status(400).json({ error: 'imageBase64 and mimeType are required' });
    }

    const prompt = extraInstructions
      ? `${NUTRITION_PROMPT}\n\nExtra instructions from user: ${extraInstructions}`
      : NUTRITION_PROMPT;

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'pixtral-12b-2409',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${imageBase64}`
                }
              },
              {
                type: 'text',
                text: prompt
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error?.message || 'Mistral API error');
    }

    const analysis = data.choices[0].message.content;

    const isHealthy =
      /healthy|nutritious|balanced|good choice|excellent/i.test(analysis) &&
      !/unhealthy|not healthy|poor choice|high in fat|high in sugar/i.test(analysis);

    res.json({ analysis, isHealthy });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to analyze image.' });
  }
});

app.get('*', (req, res) => {
  const distIndex = join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(distIndex)) {
    res.sendFile(distIndex);
  } else {
    res.status(404).send('Run "npm run build" first for production mode.');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});