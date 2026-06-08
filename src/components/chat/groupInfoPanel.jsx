import { useState, useCallback, useRef, useEffect } from 'react';
import MemberList from './memberList.jsx';

/**
 * GroupInfoPanel — slide-in side panel for viewing and managing group details.
 *
 * Displays:
 *  - Group name (inline-editable by admin, read-only otherwise)
 *  - Member list via MemberList component
 *  - "Add Member" button (admin only)
 *  - Close (X) button in the top-right corner
 *
 * @param {{
 *   group: { id: string, name: string, adminId: string, participantIds: string[] } | null,
 *   isAdmin: boolean,
 *   members: Array<{ id: string, displayName: string, isAdmin?: boolean }>,
 *   onRename: (name: string) => void,
 *   onAddMember: () => void,
 *   onRemoveMember: (memberId: string) => void,
 *   onClose: () => void,
 * }} props
 */
export default function GroupInfoPanel({
  group,
  isAdmin = false,
  members = [],
  onRename,
  onAddMember,
  onRemoveMember,
  onClose,
}) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(group?.name || '');
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  // ── Sync draft name when group name changes externally ────────────
  useEffect(() => {
    if (!isEditingName) {
      setDraftName(group?.name || '');
    }
  }, [group?.name, isEditingName]);

  // ── Focus input when entering edit mode ───────────────────────────
  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  // ── Close on Escape ───────────────────────────────────────────────
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        if (isEditingName) {
          setIsEditingName(false);
          setDraftName(group?.name || '');
        } else {
          onClose();
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isEditingName, group?.name]);

  // ── Handlers ──────────────────────────────────────────────────────
  const handleStartEdit = useCallback(() => {
    if (!isAdmin) return;
    setDraftName(group?.name || '');
    setIsEditingName(true);
  }, [isAdmin, group?.name]);

  const handleSaveName = useCallback(() => {
    const trimmed = draftName.trim();
    if (trimmed && trimmed !== group?.name) {
      onRename?.(trimmed);
    }
    setIsEditingName(false);
  }, [draftName, group?.name, onRename]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        handleSaveName();
      } else if (e.key === 'Escape') {
        setDraftName(group?.name || '');
        setIsEditingName(false);
      }
    },
    [handleSaveName, group?.name],
  );

  // ── Guard: no group ───────────────────────────────────────────────
  if (!group) {
    return null;
  }

  // ── Render ────────────────────────────────────────────────────────
  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-30 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <aside
        ref={panelRef}
        className="
          fixed right-0 top-0 bottom-0
          w-80 max-w-[calc(100vw-2rem)]
          bg-surface border-l border-border
          shadow-2xl z-40
          flex flex-col
          animate-slide-in-right
          motion-reduce:animate-none
        "
        role="complementary"
        aria-label="Group information"
      >
        {/* ── Header: group name + close button ────────────────────── */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex-1 min-w-0 mr-3">
            {isAdmin && isEditingName ? (
              /* ── Inline editable input ──────────────────────────── */
              <input
                ref={inputRef}
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={handleKeyDown}
                maxLength={100}
                className="
                  w-full
                  bg-surface-2
                  rounded-xl
                  px-3 py-1.5
                  text-lg font-semibold text-text
                  ring-2 ring-accent
                  focus:outline-none
                "
                aria-label="Group name"
              />
            ) : (
              /* ── Read-only / clickable name ─────────────────────── */
              <h2
                className={`text-lg font-semibold text-text truncate ${
                  isAdmin
                    ? 'cursor-pointer hover:text-accent transition-colors duration-150 rounded-lg -ml-1 px-1'
                    : ''
                }`}
                onClick={handleStartEdit}
                title={isAdmin ? 'Click to rename' : undefined}
              >
                {group.name || 'Unnamed Group'}
              </h2>
            )}

            {/* Member count */}
            <p className="text-xs text-text-muted mt-0.5">
              {members.length} member{members.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close group info"
            className="
              inline-flex items-center justify-center
              w-8 h-8 rounded-xl flex-shrink-0
              text-text-muted
              hover:text-text hover:bg-surface-2
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

        {/* ── Divider ──────────────────────────────────────────────── */}
        <div className="border-t border-border-light" />

        {/* ── Members section ──────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">
            Members
          </h3>

          <MemberList
            members={members}
            isAdmin={isAdmin}
            onRemove={onRemoveMember}
          />
        </div>

        {/* ── Footer: Add Member button (admin only) ───────────────── */}
        {isAdmin && (
          <>
            <div className="border-t border-border-light" />
            <div className="p-4">
              <button
                type="button"
                onClick={onAddMember}
                className="
                  w-full
                  inline-flex items-center justify-center gap-2
                  rounded-xl
                  bg-surface ring-1 ring-border
                  px-4 py-2.5
                  text-sm font-medium text-text
                  hover:bg-surface-2 hover:ring-accent hover:text-accent
                  transition-all duration-150
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
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Member
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}