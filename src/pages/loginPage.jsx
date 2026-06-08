import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext.jsx';
import { DemoUserList } from '../components/auth/demoUserList.jsx';
import { UserRepository } from '../repositories/userRepository.js';

/**
 * LoginPage — full-page auth screen for the ChatApp Demo.
 *
 * Renders a centered card with the app title, a login form,
 * a demo-user quick-login grid, a demo hint, and a link to
 * the registration page. On successful login the user is
 * redirected to /chat.
 *
 * Layout: min-h-screen flex centre, no layout chrome.
 * Uses design-system tokens exclusively (bg-bg, text-text, etc.).
 */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Demo users (one-off repository read) ──────────────────────
  const demoUsers = (() => {
    try {
      const repo = new UserRepository();
      return repo.findAll();
    } catch {
      return [];
    }
  })();

  // ── Handlers ──────────────────────────────────────────────────
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setError('');

      if (!email.trim() || !password.trim()) {
        setError('Please enter both email and password.');
        return;
      }

      setLoading(true);
      try {
        login(email.trim(), password);
        navigate('/chat', { replace: true });
      } catch (err) {
        setError(err.message || 'Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [email, password, login, navigate],
  );

  const handleDemoSelect = useCallback(
    (user) => {
      setError('');
      setLoading(true);
      try {
        login(user.email, user.password);
        navigate('/chat', { replace: true });
      } catch (err) {
        setError(err.message || 'Demo login failed.');
      } finally {
        setLoading(false);
      }
    },
    [login, navigate],
  );

  // ── Render ────────────────────────────────────────────────────
  return (
    <main className="min-h-screen flex items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-md bg-surface rounded-2xl ring-1 ring-border p-8 shadow-lg">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold tracking-tighter text-text">
            ChatApp Demo
          </h1>
          <p className="text-sm text-text-muted">
            Sign in to your account
          </p>
        </div>

        {/* ── Error banner ───────────────────────────────────── */}
        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl bg-danger-bg px-4 py-3 text-sm text-danger"
          >
            {error}
          </div>
        )}

        {/* ── Login form ─────────────────────────────────────── */}
        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
          {/* Email */}
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
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl bg-surface ring-1 ring-border px-4 py-2.5
                         text-base text-text placeholder:text-text-muted
                         focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none
                         transition-shadow duration-150
                         motion-reduce:transition-none"
            />
          </div>

          {/* Password */}
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl bg-surface ring-1 ring-border px-4 py-2.5
                         text-base text-text placeholder:text-text-muted
                         focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none
                         transition-shadow duration-150
                         motion-reduce:transition-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-xl
                       bg-accent text-accent-fg px-5 py-2.5 text-sm font-medium
                       hover:bg-accent-hover
                       active:scale-[0.97]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2
                       transition-[transform,background-color] duration-150
                       motion-reduce:transition-none motion-reduce:transform-none
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* ── Divider ────────────────────────────────────────── */}
        <div className="mt-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
            or
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* ── Demo users ─────────────────────────────────────── */}
        <div className="mt-6">
          <DemoUserList users={demoUsers} onSelect={handleDemoSelect} />
        </div>

        {/* ── Demo hint ──────────────────────────────────────── */}
        <p className="mt-4 text-xs text-text-muted leading-relaxed">
          Demo credentials — use any email/password to register, or select a
          pre-loaded user.
        </p>

        {/* ── Register link ──────────────────────────────────── */}
        <p className="mt-6 text-center text-sm text-text-muted">
          Don&rsquo;t have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-accent hover:text-accent-hover
                       underline underline-offset-2
                       transition-colors duration-150
                       motion-reduce:transition-none"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}