import { useState } from 'react';

/**
 * RegisterForm — registration form with email, password, and display name fields.
 *
 * Props:
 *   onSubmit({ email, password, displayName }) — called on valid form submission
 *   error   (string|null) — inline error message displayed above the submit button
 *   loading (boolean)     — when true, disables the form and shows a loading state
 */
export function RegisterForm({ onSubmit, error, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    onSubmit({ email, password, displayName });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Display Name */}
      <div className="space-y-1.5">
        <label htmlFor="register-display-name" className="block text-sm font-medium text-text">
          Display Name
        </label>
        <input
          id="register-display-name"
          type="text"
          required
          autoComplete="name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Alice Demo"
          disabled={loading}
          className="w-full rounded-xl bg-surface ring-1 ring-border px-4 py-2.5 text-base text-text placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-shadow duration-150"
        />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="register-email" className="block text-sm font-medium text-text">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="alice@example.com"
          disabled={loading}
          className="w-full rounded-xl bg-surface ring-1 ring-border px-4 py-2.5 text-base text-text placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-shadow duration-150"
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="register-password" className="block text-sm font-medium text-text">
          Password
        </label>
        <input
          id="register-password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          disabled={loading}
          className="w-full rounded-xl bg-surface ring-1 ring-border px-4 py-2.5 text-base text-text placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-shadow duration-150"
        />
      </div>

      {/* Inline error */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-danger-bg px-4 py-3" role="alert">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 shrink-0 text-danger"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="7" />
            <path d="M8 5v3" />
            <circle cx="8" cy="11" r="0.5" fill="currentColor" stroke="none" />
          </svg>
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center rounded-xl bg-accent text-accent-fg px-5 py-2.5 text-sm font-medium hover:bg-accent-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-[transform,background-color,opacity] duration-150 motion-reduce:transition-none motion-reduce:transform-none"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="28"
                strokeDashoffset="8"
                strokeLinecap="round"
              />
            </svg>
            Creating account&hellip;
          </span>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
}