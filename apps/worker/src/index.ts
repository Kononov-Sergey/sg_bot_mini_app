import 'dotenv/config';
import Redis from 'ioredis';
import pino from 'pino';

const logger = pino({ name: 'worker' });

const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
const redis = new Redis(redisUrl, { maxRetriesPerRequest: null });

redis.on('ready', () => {
    logger.info({ redisUrl }, 'worker started');
});

redis.on('error', (error) => {
    logger.error({ error }, 'redis connection error');
});

const shutdown = async () => {
    logger.info('worker shutting down');
    await redis.quit();
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);