import { useEffect, useRef, useCallback } from 'react';

/**
 * Toast — a single slide-in toast notification for new messages.
 *
 * Displays the sender's name and a truncated message preview inside a
 * card that auto-dismisses after 5 seconds. Clicking the card navigates
 * to the conversation; clicking the close button dismisses immediately.
 *
 * Animation: slides in from the right with a subtle fade. Respects
 * `prefers-reduced-motion` via the `motion-reduce:` variant.
 *
 * @param {{
 *   notification: {
 *     id: string,
 *     senderName: string,
 *     messagePreview: string,
 *     conversationId: string,
 *   },
 *   onDismiss: (id: string) => void,
 *   onNavigate: (conversationId: string) => void,
 * }} props
 */
export default function Toast({ notification, onDismiss, onNavigate }) {
  const timerRef = useRef(null);

  // ── Auto-dismiss after 5 seconds ──────────────────────────────────
  const dismiss = useCallback(() => {
    if (notification?.id) {
      onDismiss(notification.id);
    }
  }, [notification?.id, onDismiss]);

  useEffect(() => {
    if (!notification) return;

    timerRef.current = setTimeout(dismiss, 5000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [notification, dismiss]);

  // ── Click handler: navigate to conversation ───────────────────────
  const handleClick = () => {
    if (notification?.conversationId) {
      onNavigate(notification.conversationId);
    }
    dismiss();
  };

  // ── Close button handler ──────────────────────────────────────────
  const handleClose = (e) => {
    e.stopPropagation();
    dismiss();
  };

  // ── Guard: nothing to render ──────────────────────────────────────
  if (!notification) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`New message from ${notification.senderName || 'Unknown'}`}
      className="
        bg-surface rounded-2xl ring-1 ring-border shadow-lg
        p-4 max-w-sm cursor-pointer
        animate-slide-in-right
        motion-reduce:animate-none
        hover:shadow-xl hover:-translate-y-0.5
        transition-[box-shadow,transform] duration-200
        motion-reduce:transition-none motion-reduce:transform-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus
      "
      onClick={handleClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="flex items-start gap-3">
        {/* ── Avatar initial ────────────────────────────────────────── */}
        <div
          className="
            w-9 h-9 rounded-full
            bg-accent-muted text-accent
            flex items-center justify-center
            text-sm font-semibold
            flex-shrink-0
          "
          aria-hidden="true"
        >
          {notification.senderName
            ? notification.senderName.charAt(0).toUpperCase()
            : '?'}
        </div>

        {/* ── Text content ──────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text truncate">
            {notification.senderName || 'Unknown'}
          </p>
          <p className="text-xs text-text-muted truncate mt-0.5">
            {notification.messagePreview || 'New message'}
          </p>
        </div>

        {/* ── Close button ──────────────────────────────────────────── */}
        <button
          type="button"
          onClick={handleClose}
          className="
            flex-shrink-0
            w-6 h-6 rounded-full
            inline-flex items-center justify-center
            text-text-muted
            hover:bg-surface-2 hover:text-text
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus
            motion-reduce:transition-none
          "
          aria-label="Dismiss notification"
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
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}