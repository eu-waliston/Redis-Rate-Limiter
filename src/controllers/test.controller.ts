import type { Request, Response } from 'express';

export function testController(_req: Request, res: Response): void {
  res.json({
    success: true,
    message: 'Request accepted by the Rate Limiter.',
    timestamp: new Date().toISOString()
  });
}
