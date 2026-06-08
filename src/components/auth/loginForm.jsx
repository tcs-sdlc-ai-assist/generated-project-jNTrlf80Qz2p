import { useState } from 'react';

/**
 * LoginForm — renders email/password fields with inline error and loading state.
 *
 * Props:
 *   onSubmit({ email, password }) — called on valid form submission
 *   error   (string|null)        — inline error message displayed above the button
 *   loading (boolean)            — when true, button is disabled and shows "Signing in…"
 */
export function LoginForm({ onSubmit, error, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    onSubmit({ email, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
    >
      {/* ---- Email ---- */}
      <div className="space-y-1.5">
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-text"
        >
          Email
        </label>
        <input
          id="login-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl bg-surface ring-1 ring-border px-4 py-2.5 text-base text-text placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-shadow duration-150"
        />
      </div>

      {/* ---- Password ---- */}
      <div className="space-y-1.5">
        <label
          htmlFor="login-password"
          className="block text-sm font-medium text-text"
        >
          Password
        </label>
        <input
          id="login-password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full rounded-xl bg-surface ring-1 ring-border px-4 py-2.5 text-base text-text placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-shadow duration-150"
        />
      </div>

      {/* ---- Inline error ---- */}
      {error && (
        <p
          role="alert"
          className="text-sm text-danger flex items-center gap-1.5"
        >
          <svg
            aria-hidden="true"
            className="h-4 w-4 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"
            />
          </svg>
          {error}
        </p>
      )}

      {/* ---- Submit ---- */}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-accent text-accent-fg px-5 py-2.5 text-sm font-semibold hover:bg-accent-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-[transform,background-color] duration-150 motion-reduce:transition-none motion-reduce:transform-none disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              aria-hidden="true"
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
              />
            </svg>
            Signing in…
          </span>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  );
}