import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext.jsx';
import { RegisterForm } from '../components/auth/registerForm.jsx';

/**
 * RegisterPage — public registration route.
 *
 * Renders a centered auth card with the app title, a RegisterForm,
 * and a link to the login page. On successful registration the user
 * is automatically logged in and redirected to /chat.
 *
 * Layout: no AppLayout chrome — this is a standalone auth page.
 */
export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles form submission. Delegates to the auth context's register
   * method (which calls AuthService.register synchronously). On success
   * navigates to /chat; on failure surfaces the error message.
   *
   * @param {{ email: string, password: string, displayName: string }} values
   */
  const handleSubmit = (values) => {
    setError('');
    setIsSubmitting(true);

    try {
      register(values.email, values.password, values.displayName);
      navigate('/chat', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md bg-surface rounded-2xl ring-1 ring-border p-8 shadow-lg">
        {/* App title */}
        <h1 className="text-5xl font-bold tracking-tighter text-text">
          ChatApp Demo
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-sm text-text-muted">
          Create your account
        </p>

        {/* Server / validation error banner */}
        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl bg-danger-bg px-4 py-3 text-sm text-danger"
          >
            {error}
          </div>
        )}

        {/* Registration form */}
        <div className="mt-6">
          <RegisterForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-accent hover:text-accent-hover underline underline-offset-2 transition-colors duration-150 motion-reduce:transition-none"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}