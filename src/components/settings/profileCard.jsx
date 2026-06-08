import { maskEmail } from '../../utils/piiMasking.js';

/**
 * ProfileCard — displays the current user's profile information
 * in a card format for the settings page.
 *
 * Props:
 *   user — User entity object (must have `displayName`, `email`).
 */
export function ProfileCard({ user }) {
  if (!user) {
    return (
      <div
        className="rounded-2xl bg-surface p-6 ring-1 ring-border"
        role="status"
        aria-label="No user data available"
      >
        <p className="text-sm text-text-muted">No user information available.</p>
      </div>
    );
  }

  const initial = user.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : '?';

  return (
    <div className="rounded-2xl bg-surface p-6 ring-1 ring-border">
      <div className="flex items-center gap-4">
        {/* Avatar circle with initial */}
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center
                     rounded-full bg-accent-muted text-2xl font-bold text-accent"
          aria-hidden="true"
        >
          {initial}
        </div>

        {/* Name + email */}
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold text-text">
            {user.displayName || 'Unknown User'}
          </h2>
          <p className="truncate font-mono text-sm text-text-muted">
            {maskEmail(user.email)}
          </p>
        </div>
      </div>
    </div>
  );
}