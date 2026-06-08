/**
 * DeliveryStatusIcon — renders delivery status checkmark icons.
 *
 * Props:
 *   status: 'sent' | 'delivered' | 'read'
 *
 * - 'sent':      single gray checkmark (text-muted)
 * - 'delivered': double gray checkmarks (text-muted)
 * - 'read':      double accent checkmarks (text-accent)
 *
 * Uses inline SVG paths for crisp rendering at all sizes.
 */

export default function DeliveryStatusIcon({ status }) {
  const isRead = status === 'read';
  const isSent = status === 'sent';
  const colorClass = isRead ? 'text-accent' : 'text-muted';

  return (
    <span
      className={`inline-flex items-center ${colorClass}`}
      aria-label={
        isSent
          ? 'Sent'
          : isRead
            ? 'Read'
            : 'Delivered'
      }
      role="img"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* First checkmark — always visible */}
        <path d="M2 8l3 3 6-6" />

        {/* Second checkmark — only for delivered / read */}
        {!isSent && (
          <path
            d="M6 8l3 3 6-6"
            transform="translate(2, 0)"
            opacity="0.6"
          />
        )}
      </svg>
    </span>
  );
}