import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * NewConversationModal — modal overlay for creating a new DM or group conversation.
 *
 * Props:
 *   users          — Array of user objects (each with at least { id, displayName })
 *   currentUserId  — ID of the currently authenticated user (excluded from the list)
 *   onClose        — () => void, called when the modal should close
 *   onCreateDM     — (userId: string) => void, called with the selected user's ID
 *   onCreateGroup  — (name: string, memberIds: string[]) => void
 */
export default function NewConversationModal({
  users = [],
  currentUserId,
  onClose,
  onCreateDM,
  onCreateGroup,
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [groupName, setGroupName] = useState('');
  const modalRef = useRef(null);

  // ── Filter out the current user ──────────────────────────────────
  const availableUsers = users.filter((u) => u.id !== currentUserId);

  // ── Toggle a user's selection ────────────────────────────────────
  const toggleUser = useCallback((userId) => {
    setSelectedIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  }, []);

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

  const handleStartDM = useCallback(() => {
    if (selectedIds.length === 1) {
      onCreateDM(selectedIds[0]);
      onClose();
    }
  }, [selectedIds, onCreateDM, onClose]);

  const handleCreateGroup = useCallback(() => {
    const trimmed = groupName.trim();
    if (trimmed && selectedIds.length >= 2) {
      onCreateGroup(trimmed, selectedIds);
      onClose();
    }
  }, [groupName, selectedIds, onCreateGroup, onClose]);

  const isSingle = selectedIds.length === 1;
  const isMulti = selectedIds.length >= 2;
  const canCreateGroup = isMulti && groupName.trim().length > 0;

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="New conversation"
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
            New Conversation
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
            Select people
          </p>

          {availableUsers.length === 0 && (
            <p className="text-sm text-text-muted py-3 text-center">
              No other users available
            </p>
          )}

          <ul className="space-y-1 max-h-60 overflow-y-auto" role="listbox" aria-label="Select users">
            {availableUsers.map((user) => {
              const isSelected = selectedIds.includes(user.id);
              return (
                <li key={user.id}>
                  <label
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl
                      cursor-pointer
                      transition-colors duration-150
                      motion-reduce:transition-none
                      ${isSelected
                        ? 'bg-accent-muted ring-1 ring-accent/30'
                        : 'hover:bg-surface-2'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleUser(user.id)}
                      className="
                        sr-only
                      "
                    />
                    {/* Custom checkbox indicator */}
                    <span
                      className={`
                        flex-shrink-0 inline-flex items-center justify-center
                        w-5 h-5 rounded-md
                        ring-1
                        transition-all duration-150
                        motion-reduce:transition-none
                        ${isSelected
                          ? 'bg-accent ring-accent'
                          : 'ring-border bg-surface'
                        }
                      `}
                      aria-hidden="true"
                    >
                      {isSelected && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-3.5 h-3.5 text-accent-fg"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>

                    {/* Avatar placeholder + name */}
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
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Group name input (multi-select only) ────────────────── */}
        {isMulti && (
          <div className="mb-5">
            <label
              htmlFor="group-name-input"
              className="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2"
            >
              Group name
            </label>
            <input
              id="group-name-input"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Weekend Trip"
              maxLength={100}
              className="
                w-full rounded-xl
                bg-surface-2
                px-4 py-2.5
                text-sm text-text
                placeholder:text-text-muted
                ring-1 ring-border
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus
                transition-shadow duration-150
                motion-reduce:transition-none
              "
            />
          </div>
        )}

        {/* ── Action buttons ──────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3">
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

          {/* DM button — single user selected */}
          {isSingle && (
            <button
              type="button"
              onClick={handleStartDM}
              className="
                inline-flex items-center justify-center
                rounded-xl
                px-5 py-2.5
                text-sm font-medium
                bg-accent text-accent-fg
                hover:bg-accent-hover
                active:scale-[0.97]
                transition-all duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2
                motion-reduce:transition-none motion-reduce:transform-none
                cursor-pointer
              "
            >
              Start Chat
            </button>
          )}

          {/* Create Group button — 2+ users selected */}
          {isMulti && (
            <button
              type="button"
              onClick={handleCreateGroup}
              disabled={!canCreateGroup}
              className={`
                inline-flex items-center justify-center
                rounded-xl
                px-5 py-2.5
                text-sm font-medium
                transition-all duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2
                motion-reduce:transition-none motion-reduce:transform-none
                ${canCreateGroup
                  ? 'bg-accent text-accent-fg hover:bg-accent-hover active:scale-[0.97] cursor-pointer'
                  : 'bg-surface-3 text-text-muted cursor-not-allowed'
                }
              `}
            >
              Create Group
            </button>
          )}
        </div>
      </div>
    </div>
  );
}