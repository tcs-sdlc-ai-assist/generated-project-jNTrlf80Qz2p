import { useMemo } from 'react';

/**
 * Extracts the first character of a display name for the avatar initial.
 * Falls back to "?" for empty / missing names.
 *
 * @param {string} name
 * @returns {string} Single uppercase character.
 */
function getInitial(name) {
  if (!name || typeof name !== 'string') return '?';
  const trimmed = name.trim();
  if (trimmed.length === 0) return '?';
  return trimmed.charAt(0).toUpperCase();
}

/**
 * MemberRow — a single member row displayed in the group info / member list panel.
 *
 * Displays:
 *  - Avatar circle with the member's initial
 *  - Display name
 *  - Role badge ("Admin" or "Member")
 *  - Remove button (X) when canRemove is true
 *
 * @param {{
 *   member: { id: string, displayName: string },
 *   role: 'admin' | 'member',
 *   isAdmin: boolean,
 *   canRemove: boolean,
 *   onRemove: (memberId: string) => void,
 * }} props
 */
export default function MemberRow({
  member,
  role,
  isAdmin,
  canRemove,
  onRemove,
}) {
  const initial = useMemo(
    () => getInitial(member?.displayName),
    [member?.displayName],
  );

  const isAdminRole = role === 'admin' || isAdmin;

  return (
    <div
      className="
        flex items-center gap-3 py-2
        motion-reduce:transition-none
      "
    >
      {/* ── Avatar circle ──────────────────────────────────────────── */}
      <div
        className="
          w-8 h-8 rounded-full
          bg-accent-muted text-accent
          flex items-center justify-center
          text-xs font-semibold
          flex-shrink-0
        "
        aria-hidden="true"
      >
        {initial}
      </div>

      {/* ── Display name ───────────────────────────────────────────── */}
      <span className="text-sm font-medium text-text truncate flex-1 min-w-0">
        {member?.displayName || 'Unknown'}
      </span>

      {/* ── Role badge ─────────────────────────────────────────────── */}
      <span
        className={`
          text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0
          ${
            isAdminRole
              ? 'bg-accent-muted text-accent'
              : 'bg-surface-3 text-text-muted'
          }
        `}
        aria-label={isAdminRole ? 'Admin' : 'Member'}
      >
        {isAdminRole ? 'Admin' : 'Member'}
      </span>

      {/* ── Remove button ──────────────────────────────────────────── */}
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(member?.id)}
          aria-label={`Remove ${member?.displayName || 'member'}`}
          className="
            flex-shrink-0
            w-6 h-6 rounded-full
            flex items-center justify-center
            text-text-muted
            hover:bg-danger-bg hover:text-danger
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-focus focus-visible:ring-offset-1
            transition-colors duration-150
            motion-reduce:transition-none
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}