import DeliveryStatusIcon from './deliveryStatusIcon.jsx';

/**
 * Formats an ISO-8601 timestamp into a human-readable string.
 * - Today: "HH:MM" (24h)
 * - This year: "MMM D" (e.g. "Jun 8")
 * - Older: "MMM D, YYYY"
 *
 * @param {string} isoString
 * @returns {string}
 */
function formatTimestamp(isoString) {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  if (date.getFullYear() === now.getFullYear()) {
    return `${months[date.getMonth()]} ${date.getDate()}`;
  }

  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * MessageBubble — renders a single chat message bubble.
 *
 * Layout rules:
 *  - Own messages:   right-aligned, amber-muted background, rounded-2xl with
 *                    a sharper bottom-right corner (rounded-br-md).
 *  - Others' messages: left-aligned, surface-2 background, rounded-2xl with
 *                      a sharper bottom-left corner (rounded-bl-md).
 *  - Group chats show the sender's name above the bubble when showSender is true.
 *  - Own messages display a delivery-status icon next to the timestamp.
 *
 * @param {{
 *   message:      { id: string, body: string, createdAt: string, status?: string },
 *   isOwn:        boolean,
 *   sender?:      { displayName: string },
 *   conversation?: { type: string },
 * }} props
 */
export default function MessageBubble({
  message,
  isOwn,
  sender,
  conversation,
}) {
  const { body, createdAt, status } = message;
  const timestamp = formatTimestamp(createdAt);

  // Derive from sender and conversation
  const senderName = sender?.displayName || 'Unknown';
  const showSender = conversation?.type === 'group' && !isOwn;
  const deliveryStatus = status;

  // ── Bubble shape classes ──────────────────────────────────────
  const bubbleClasses = isOwn
    ? 'bg-accent-muted text-text rounded-2xl rounded-br-md'
    : 'bg-surface-2 text-text rounded-2xl rounded-bl-md';

  // ── Alignment ─────────────────────────────────────────────────
  const rowClasses = isOwn
    ? 'flex flex-col items-end'
    : 'flex flex-col items-start';

  return (
    <div className={`${rowClasses} max-w-[75%] ${isOwn ? 'self-end' : 'self-start'}`}>
      {/* ── Sender name (group chat, not own) ─────────────────── */}
      {showSender && senderName && (
        <span className="text-xs font-medium text-text-muted mb-1 ml-1 truncate max-w-full">
          {senderName}
        </span>
      )}

      {/* ── Bubble body ───────────────────────────────────────── */}
      <div className={`px-4 py-2.5 ${bubbleClasses}`}>
        <p className="text-base leading-relaxed whitespace-pre-wrap break-words">
          {body}
        </p>
      </div>

      {/* ── Timestamp + delivery status ───────────────────────── */}
      <div
        className={`flex items-center gap-1.5 mt-1 ${
          isOwn ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <time
          dateTime={createdAt}
          className="text-[11px] text-text-muted tabular-nums font-mono select-none"
        >
          {timestamp}
        </time>

        {isOwn && deliveryStatus && (
          <DeliveryStatusIcon status={deliveryStatus} />
        )}
      </div>
    </div>
  );
}