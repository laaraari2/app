import express from 'express';
import cors from 'cors';
import { env } from '../src/config/env';
import { registerRepositories } from '../src/bootstrap/repositories';
import { registerServices } from '../src/bootstrap/services';
import apiV1Router from '../src/routes/v1';
import { tenantMiddleware } from '../src/middleware/tenant.middleware';
import { errorHandler } from '../src/middleware/error.middleware';

// Shared Express application for the Vercel function. The build bundles local
// TypeScript modules so Node does not have to resolve extensionless TS imports.
const app = express();

let initialized = false;
function initializeServices() {
  if (initialized) return;
  registerRepositories();
  registerServices();
  initialized = true;
}

app.use((req, _res, next) => {
  const route = req.query.__route;
  if (typeof route === 'string' && route.startsWith('/')) req.url = route;
  next();
});

app.use(cors({
  origin: env.CORS_ALLOWED_ORIGINS === '*' ? '*' : env.CORS_ALLOWED_ORIGINS.split(','),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  try {
    initializeServices();
    next();
  } catch (error) {
    next(error);
  }
});

app.use(tenantMiddleware as any);
app.use(env.API_PREFIX, apiV1Router);
app.use(errorHandler as any);

export default app;
