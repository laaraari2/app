
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { testSupabaseConnection } from './lib/testSupabase';

if (import.meta.env.DEV) {
  void testSupabaseConnection();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
