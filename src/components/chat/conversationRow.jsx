import { useMemo } from 'react';

/**
 * Formats a relative timestamp string from an ISO-8601 date.
 *
 * Rules:
 *  - < 60 seconds → "just now"
 *  - < 60 minutes → "Xm ago"
 *  - < 24 hours   → "Xh ago"
 *  - < 7 days     → "Xd ago"
 *  - otherwise     → "MMM D" (e.g. "Jan 5")
 *
 * @param {string} isoString - ISO-8601 timestamp.
 * @returns {string} Human-readable relative time.
 */
function relativeTime(isoString) {
  if (!isoString) return '';

  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return 'just now';

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  // Older than a week: show abbreviated month + day
  const date = new Date(then);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
}

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
 * ConversationRow — a single row in the conversation list sidebar.
 *
 * Displays:
 *  - Avatar circle with the other user's initial
 *  - Contact / group name (truncated)
 *  - Last message preview (truncated, max 180 px)
 *  - Relative timestamp (e.g. "2m ago")
 *  - Unread count badge (amber pill, hidden when count is 0)
 *
 * Active rows receive a highlighted background; all rows have a hover
 * transition. Clicking the row fires the `onClick` callback.
 *
 * @param {{
 *   conversation: object,
 *   isActive: boolean,
 *   onClick: () => void,
 *   unreadCount: number,
 *   lastMessage: string,
 *   otherUserName: string,
 * }} props
 */
export default function ConversationRow({
  conversation,
  isActive,
  onClick,
  unreadCount,
  lastMessage,
  otherUserName,
}) {
  const initial = useMemo(() => getInitial(otherUserName), [otherUserName]);
  const timestamp = useMemo(
    () => relativeTime(conversation?.lastMessageAt),
    [conversation?.lastMessageAt],
  );

  const hasUnread = unreadCount > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Conversation with ${otherUserName || 'Unknown'}`}
      aria-current={isActive ? 'true' : undefined}
      className={`
        w-full flex items-center gap-3 px-4 py-3
        text-left
        transition-colors duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset
        focus-visible:ring-focus
        motion-reduce:transition-none
        ${isActive ? 'bg-surface-2' : 'bg-surface'}
        hover:bg-surface-2
      `}
    >
      {/* ── Avatar circle ────────────────────────────────────────── */}
      <div
        className="
          w-10 h-10 rounded-full
          bg-accent-muted text-accent
          flex items-center justify-center
          text-sm font-semibold
          flex-shrink-0
        "
        aria-hidden="true"
      >
        {initial}
      </div>

      {/* ── Text block ───────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {/* Row 1: name + timestamp */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-text truncate">
            {otherUserName || 'Unknown'}
          </span>
          <span className="text-xs text-text-muted tabular-nums flex-shrink-0">
            {timestamp}
          </span>
        </div>

        {/* Row 2: last message preview + unread badge */}
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <span className="text-xs text-text-muted truncate max-w-[180px]">
            {lastMessage || 'No messages yet'}
          </span>

          {hasUnread && (
            <span
              className="
                bg-accent text-accent-fg
                text-[10px] font-bold tabular-nums
                rounded-full
                min-w-[18px] h-[18px]
                flex items-center justify-center
                px-1 flex-shrink-0
              "
              aria-label={`${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}`}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}