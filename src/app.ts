import express from 'express';
import { redis } from './config/redis';
import { testRouter } from './routes/test.routes';

export const app = express();

app.disable('x-powered-by');
app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    const redisStatus = await redis.ping();
    res.json({ status: 'ok', redis: redisStatus === 'PONG' ? 'connected' : redisStatus });
  } catch {
    res.status(503).json({ status: 'degraded', redis: 'disconnected' });
  }
});

app.use('/api', testRouter);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: 'Route not found.'
  });
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[HTTP] unhandled error:', error);
  res.status(500).json({ success: false, error: 'INTERNAL_SERVER_ERROR' });
});
