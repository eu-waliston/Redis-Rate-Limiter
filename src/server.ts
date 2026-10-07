import { app } from './app';
import { connectRedis, disconnectRedis } from './config/redis';
import { env } from './config/env';

async function bootstrap(): Promise<void> {
  await connectRedis();

  app.set('trust proxy', env.trustProxy);

  const server = app.listen(env.port, () => {
    console.log(`\n🚦 Redis Rate Limiter`);
    console.log(`   API:    http://localhost:${env.port}`);
    console.log(`   Health: http://localhost:${env.port}/health`);
    console.log(`   Test:   http://localhost:${env.port}/api/test`);
    console.log(`   Limit:  ${env.rateLimitMaxRequests} req / ${env.rateLimitWindowSeconds}s\n`);
  });

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down...`);
    server.close(async () => {
      await disconnectRedis();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
