import express from 'express';
import cors from 'cors';

import { env } from '../../src/config/env';
import { registerRepositories } from '../../src/bootstrap/repositories';
import { registerServices } from '../../src/bootstrap/services';
import apiV1Router from '../../src/routes/v1';
import { tenantMiddleware } from '../../src/middleware/tenant.middleware';
import { errorHandler } from '../../src/middleware/error.middleware';

// Vercel serverless entry point for /api/v1/*.
// Keep this handler separate from server.ts, which starts a long-running listener.
registerRepositories();
registerServices();

const app = express();

app.use(cors({
  origin: env.CORS_ALLOWED_ORIGINS === '*' ? '*' : env.CORS_ALLOWED_ORIGINS.split(','),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(tenantMiddleware as any);
app.use('/api/v1', apiV1Router);
app.use(errorHandler as any);

export default app;
