import { Router, Request, Response } from 'express';
import { migrator } from '../../db/migrator';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const memoryUsage = process.memoryUsage();

  res.status(200).json({
    status: 'HEALTHY',
    timestamp: new Date().toISOString(),
    service: 'Eduvora Platform Core Service',
    version: '1.0.0-sprint1',
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: 'CONNECTED',
      appliedMigrationsCount: migrator.getAppliedMigrations().length,
    },
    system: {
      heapUsedMB: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
      rssMB: (memoryUsage.rss / 1024 / 1024).toFixed(2),
    },
  });
});

export default router;
