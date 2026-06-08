import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext.jsx';

/**
 * TopNav — top navigation bar rendered inside AppLayout.
 *
 * Displays the app name on the left, and the current user's display name,
 * a Settings link, and a Logout button on the right.
 *
 * Uses useAuth() for the current user and logout action, and useNavigate()
 * for programmatic navigation after logout and to the settings page.
 */
export function TopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-4 flex-shrink-0">
      {/* Left — app name */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-text">ChatApp</h1>
      </div>

      {/* Right — user info, settings, logout */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/settings')}
          className="text-sm text-text-muted hover:text-text transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
          aria-label="Settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="inline-block mr-1"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span className="hidden sm:inline">Settings</span>
        </button>

        <span className="text-sm text-text-muted truncate max-w-[120px]">
          {user?.displayName}
        </span>

        <button
          onClick={handleLogout}
          className="text-sm text-text-muted hover:text-danger transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
}