import { maskEmail } from '../../utils/piiMasking.js';

/**
 * DemoUserList — renders a grid of clickable demo-user buttons for
 * one-click login on the auth screen.
 *
 * Props:
 *   users    — Array of user entities (must have `displayName` and `email`).
 *   onSelect — Callback invoked with the selected user entity.
 */
export function DemoUserList({ users, onSelect }) {
  if (!users || users.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-text-muted">Quick Login</p>

      <div className="grid gap-2 sm:grid-cols-2">
        {users.map((user) => (
          <button
            key={user.id}
            type="button"
            onClick={() => onSelect(user)}
            className="flex flex-col items-start rounded-xl bg-surface-2 px-4 py-3
                       text-sm font-medium text-text ring-1 ring-border
                       transition-colors duration-150
                       hover:bg-surface-3
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2
                       motion-reduce:transition-none"
          >
            <span className="truncate">{user.displayName}</span>
            <span className="text-xs font-normal text-text-muted">
              {maskEmail(user.email)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}