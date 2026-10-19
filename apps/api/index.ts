/**
 * Eduvora Enterprise Express API Backend Application
 */
import router from '../../src/routes/v1';

export const ApiApp = {
  v1Router: router,
  version: 'v1',
};

export default router;
