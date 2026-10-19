import { env } from '../../src/config/env';

export const AppConfig = {
  env,
  version: '2.0.0-enterprise',
  appName: 'Eduvora Enterprise SaaS',
  defaultTenant: 'tenant_marrakech',
  supportedLocales: ['en', 'fr', 'ar'],
};

export default AppConfig;
