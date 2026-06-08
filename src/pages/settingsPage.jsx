import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext.jsx';
import { ProfileCard } from '../components/settings/profileCard.jsx';
import StorageUsage from '../components/settings/storageUsage.jsx';

/**
 * SettingsPage — user profile, storage usage, and demo information.
 *
 * Renders a simple single-column page with a back link to /chat,
 * the user's profile card, localStorage usage stats, and a brief
 * explanation of the demo's browser-only architecture.
 *
 * Layout: max-w-2xl centred, no layout chrome imported.
 */
export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* ── Back link ──────────────────────────────────────────── */}
        <Link
          to="/chat"
          className="mb-6 inline-block text-sm font-medium text-accent
                     transition-colors hover:text-accent-hover
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          &larr; Back to Chat
        </Link>

        {/* ── Page heading ───────────────────────────────────────── */}
        <h1 className="mb-8 text-2xl font-semibold text-text">Settings</h1>

        {/* ── Content cards ──────────────────────────────────────── */}
        <div className="space-y-6">
          <ProfileCard user={user} />
          <StorageUsage />

          {/* ── Demo info card ───────────────────────────────────── */}
          <div className="rounded-2xl bg-surface p-6 ring-1 ring-border">
            <h2 className="mb-2 text-lg font-semibold text-text">
              Demo Information
            </h2>
            <p className="text-sm leading-relaxed text-text-muted">
              This is a browser-only demo. Open a second tab, log in as a
              different user, and watch messages appear in real-time via
              BroadcastChannel.
            </p>
            <p className="mt-2 text-sm text-text-muted">
              All data is stored in your browser&apos;s localStorage only.
              Clearing browser data will reset the app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}