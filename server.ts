import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGenAIClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post('/api/suggest-gift', async (req, res) => {
    try {
      const {
        name = 'Friend',
        relationship = 'friend',
        age = 30,
        favoriteThings = [],
        notes = ''
      } = req.body || {};

      const likesList =
        Array.isArray(favoriteThings) && favoriteThings.length > 0
          ? favoriteThings.join(', ')
          : 'thoughtful keepsakes, artisan treats, cozy experiences';

      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY is not configured in Settings > Secrets.'
        });
      }

      const ai = getGenAIClient();

      const prompt = `Generate a personalized birthday gift recommendation for ${name} (Relationship: ${relationship}, Turning age: ${age || 'upcoming birthday'}).
Their favorite things and interests are: ${likesList}.
Additional notes: ${notes || 'None'}.
Provide one standout primary gift idea tailored directly to their favoriteThings, a warm explanation of why it fits them, an estimated price range, and a short search query to find it online.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are a thoughtful, creative gift concierge for PookieCal. Always ground your gift suggestion directly in the recipient’s favoriteThings list. Keep descriptions warm, specific, and concise.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: 'Specific, appealing name of the suggested gift item.'
              },
              reason: {
                type: Type.STRING,
                description:
                  '1-2 sentence explanation connecting the gift to their favoriteThings.'
              },
              priceRange: {
                type: Type.STRING,
                description: 'Estimated price range, e.g., "$35 – $60".'
              },
              matchedInterest: {
                type: Type.STRING,
                description: 'Which favoriteThing inspired this gift.'
              },
              searchQuery: {
                type: Type.STRING,
                description: 'Concise shopping search query for Amazon or Google Shopping.'
              }
            },
            required: ['title', 'reason', 'priceRange', 'matchedInterest', 'searchQuery']
          }
        }
      });

      const rawText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(rawText);
      return res.json({ suggestion: parsed });
    } catch (error: unknown) {
      const errMessage =
        error instanceof Error ? error.message : 'Failed to generate gift suggestion';
      console.error('Gemini /api/suggest-gift error:', errMessage);
      return res.status(500).json({ error: errMessage });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PookieCal server running on http://localhost:${PORT}`);
  });
}

startServer();
