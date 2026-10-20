
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
const navigate = useNavigate();
const [error, setError] = useState('');
const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

 

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    await login(email, password);

    const savedUser = localStorage.getItem('eduvora_user');
    const user = savedUser ? JSON.parse(savedUser) : null;
    const roles: string[] = user?.roles ?? [];

    if (user?.role === 'SUPER_ADMIN' || roles.includes('SUPER_ADMIN')) {
      navigate('/platform', { replace: true });
    } else {
      navigate('/app', { replace: true });
    }
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'Échec de connexion. Veuillez réessayer.'
    );
  } finally {
    setIsLoading(false);
  }
}



  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="flex items-center justify-between px-6 py-5 md:px-12">
        <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900">
          Edu<span className="text-teal-600">vora</span>
        </Link>

        <Link to="/" className="text-sm text-slate-600 hover:text-teal-700">
          Retour à l’accueil
        </Link>
      </header>

      <div className="mx-auto grid min-h-[80vh] max-w-6xl items-center gap-12 px-6 py-10 md:grid-cols-2 md:px-12">
        <section className="hidden md:block">
          <p className="mb-4 font-semibold text-teal-700">
            EDUVORA · ÉDUCATION INTELLIGENTE
          </p>

          <h1 className="max-w-lg text-5xl font-bold leading-tight text-slate-900">
            Gérez votre établissement en toute simplicité.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Retrouvez vos outils de gestion scolaire, vos équipes et vos
            informations au même endroit.
          </p>

          <div className="mt-8 space-y-4 text-slate-700">
            <p>✓ Gestion centralisée de votre établissement</p>
            <p>✓ Suivi pédagogique et administratif</p>
            <p>✓ Accès adapté à votre rôle</p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Bienvenue sur Eduvora</h2>
            <p className="mt-3 text-slate-500">
              Connectez-vous à votre espace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nom@etablissement.ma"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                Mot de passe
              </label>

              <div className="flex rounded-xl border border-slate-300 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Votre mot de passe"
                  className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 text-sm text-slate-500 hover:text-teal-700"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? 'Masquer' : 'Afficher'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="accent-teal-600"
                />
                Se souvenir de moi
              </label>

              <button
                type="button"
                onClick={() => alert('Contactez votre administrateur pour réinitialiser votre mot de passe.')}
                className="font-medium text-teal-700 hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>

            
{error && (
  <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
    {error}
  </p>
)}


           
<button
  type="submit"
  disabled={isLoading}
  className="w-full rounded-xl bg-teal-600 px-4 py-3.5 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-teal-200"
>
  {isLoading ? 'Connexion en cours...' : 'Se connecter'}
</button>

          </form>

          <p className="mt-6 text-center text-xs leading-5 text-slate-500">
            L’accès est réservé aux utilisateurs autorisés de votre établissement.
          </p>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
