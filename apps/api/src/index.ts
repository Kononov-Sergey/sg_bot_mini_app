import Fastify from 'fastify';

const app = Fastify({
    logger: true,
});

app.get('/health', async () => {
    return { ok: true };
});

const start = async () => {
    try {
        const port = Number(process.env.PORT ?? 3000);
        await app.listen({ host: '0.0.0.0', port });
        app.log.info(`API started on :${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();