import Toast from './toast.jsx';

/**
 * ToastContainer — fixed-position notification stack.
 *
 * Renders up to 3 Toast notifications in a fixed-position container.
 * Desktop: anchored bottom-right. Mobile: anchored top, full-width.
 *
 * Props:
 *   notifications: Array<{ id: string, type: 'success'|'warning'|'danger'|'info',
 *                         title: string, message?: string, action?: { label: string, onClick: () => void } }>
 *   onDismiss: (id: string) => void
 *   onNavigate: (id: string) => void
 */
export default function ToastContainer({ notifications, onDismiss, onNavigate }) {
  // ── Guard: nothing to render ────────────────────────────────────
  if (!notifications || notifications.length === 0) {
    return null;
  }

  // ── Cap at 3 visible toasts ─────────────────────────────────────
  const visible = notifications.slice(0, 3);

  return (
    <div
      className={`
        fixed z-50
        /* Desktop: bottom-right stack */
        bottom-4 right-4
        /* Mobile: top, full-width */
        max-sm:top-4 max-sm:left-4 max-sm:right-4 max-sm:bottom-auto
      `}
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      <div className="flex flex-col gap-2 w-full sm:w-80">
        {visible.map((notification) => (
          <Toast
            key={notification.id}
            notification={notification}
            onDismiss={onDismiss}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}