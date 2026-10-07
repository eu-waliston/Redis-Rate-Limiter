import { Router } from 'express';
import { testController } from '../controllers/test.controller';
import { defaultRateLimiter } from '../middleware/rateLimiter';

export const testRouter = Router();

testRouter.get('/test', defaultRateLimiter, testController);
