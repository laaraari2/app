// Keep Vercel's conventional /api/index.ts function entrypoint. The build
// bundles all local app modules into handler.bundle.js before deployment.
export { default } from './handler.bundle.js';
