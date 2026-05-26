import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { errorHandler } from './middleware/errorHandler.js';
import { apiRouter } from './routes/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
    : ['http://localhost:5173', 'http://127.0.0.1:5173'];
  app.use(cors({ origin: corsOrigin }));
  app.use(express.json({ limit: '1mb' }));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../dist')));
  }

  app.use('/api', apiRouter);

  // Return 404 JSON for unmatched /api/* routes (before SPA catch-all)
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  if (process.env.NODE_ENV === 'production') {
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../dist/index.html'));
    });
  }

  app.use(errorHandler);
  return app;
}
