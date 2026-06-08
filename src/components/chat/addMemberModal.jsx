import { useCallback, useEffect, useRef } from 'react';

/**
 * AddMemberModal — modal overlay for adding a member to an existing group.
 *
 * Props:
 *   availableUsers — Array of user objects (each with at least { id, displayName })
 *                    representing users who are NOT already in the group.
 *   onAdd          — (userId: string) => void, called when a user is clicked.
 *   onClose        — () => void, called when the modal should close.
 */
export default function AddMemberModal({
  availableUsers = [],
  onAdd,
  onClose,
}) {
  const modalRef = useRef(null);

  // ── Close on Escape ──────────────────────────────────────────────
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // ── Focus trap: focus the modal on mount ─────────────────────────
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────
  const handleBackdropClick = useCallback(
    (e) => {
      // Only close if the backdrop itself was clicked (not the modal panel)
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  const handleAddUser = useCallback(
    (userId) => {
      onAdd(userId);
    },
    [onAdd],
  );

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Add member"
    >
      {/* Modal panel */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="
          relative w-full max-w-md
          bg-surface rounded-2xl ring-1 ring-border
          shadow-2xl p-6
          focus:outline-none
        "
      >
        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-text">
            Add Member
          </h2>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="
              inline-flex items-center justify-center
              w-8 h-8 rounded-xl
              text-text-muted hover:text-text hover:bg-surface-2
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2
              motion-reduce:transition-none
              cursor-pointer
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── User list ───────────────────────────────────────────── */}
        <div className="mb-5">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
            Available users
          </p>

          {availableUsers.length === 0 && (
            <p className="text-sm text-text-muted py-3 text-center">
              No other users available to add
            </p>
          )}

          <ul
            className="space-y-1 max-h-60 overflow-y-auto"
            role="listbox"
            aria-label="Available users to add"
          >
            {availableUsers.map((user) => (
              <li key={user.id}>
                <button
                  type="button"
                  onClick={() => handleAddUser(user.id)}
                  className="
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                    text-left
                    hover:bg-surface-2
                    transition-colors duration-150
                    motion-reduce:transition-none
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2
                    cursor-pointer
                  "
                >
                  {/* Avatar placeholder */}
                  <span
                    className="
                      flex-shrink-0 w-8 h-8 rounded-full
                      bg-surface-3
                      flex items-center justify-center
                      text-xs font-semibold text-text-muted
                    "
                    aria-hidden="true"
                  >
                    {user.displayName
                      ? user.displayName.charAt(0).toUpperCase()
                      : '?'}
                  </span>

                  <span className="flex-1 text-sm font-medium text-text truncate">
                    {user.displayName || 'Unknown'}
                  </span>

                  {/* Add icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-text-muted flex-shrink-0"
                    aria-hidden="true"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="
              inline-flex items-center justify-center
              rounded-xl
              px-4 py-2.5
              text-sm font-medium text-text-muted
              bg-surface ring-1 ring-border
              hover:bg-surface-2 hover:text-text
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2
              motion-reduce:transition-none
              cursor-pointer
            "
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}