import express from 'express';
import path from 'path';
import cors from 'cors';

import { env } from './src/config/env';

import { registerRepositories } from './src/bootstrap/repositories';
import { registerServices } from './src/bootstrap/services';

import apiV1Router from './src/routes/v1';
import { tenantMiddleware } from './src/middleware/tenant.middleware';
import { errorHandler } from './src/middleware/error.middleware';




async function startServer() {

  registerRepositories();
registerServices();
  const app = express();
  const PORT = env.PORT || 3000;

  // 1. Basic Middlewares
  app.use(cors({
    origin: env.CORS_ALLOWED_ORIGINS === '*' ? '*' : env.CORS_ALLOWED_ORIGINS.split(','),
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 2. Run Migrations & Seed Database on startup
 

  // 3. Attach Tenant Context Resolution Middleware
  app.use(tenantMiddleware as any);

  // 4. Mount API v1 Routes
  app.use(env.API_PREFIX, apiV1Router);

  // 5. Global Standardized Error Handler for API
  app.use(errorHandler as any);

  // 6. Vite / Static Assets Handling
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 7. Listen on port 3000 and host 0.0.0.0
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Eduvora Core Platform running on http://0.0.0.0:${PORT}`);
    console.log(`📡 API Endpoints available at http://0.0.0.0:${PORT}${env.API_PREFIX}`);
  });
}

startServer().catch((err) => {
  console.error('💥 Fatal Server Boot Error:', err);
  process.exit(1);
});
