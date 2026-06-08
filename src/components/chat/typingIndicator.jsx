import { useMemo } from 'react';

/**
 * TypingIndicator — displays an animated typing indicator bar.
 *
 * Shows who is currently typing in a conversation:
 *  - 1 name:  "Alice is typing..."
 *  - 2 names: "Alice and Bob are typing..."
 *  - 3+ names: "Several people are typing..."
 *  - 0 names: renders nothing (null)
 *
 * Includes three animated bouncing dots for visual feedback.
 *
 * @param {{ names: string[] }} props
 */
export default function TypingIndicator({ names }) {
  // ── Guard: nothing to render ────────────────────────────────────
  if (!names || names.length === 0) {
    return null;
  }

  // ── Format the text label ───────────────────────────────────────
  const label = useMemo(() => {
    const count = names.length;

    if (count === 1) {
      return `${names[0]} is typing...`;
    }

    if (count === 2) {
      return `${names[0]} and ${names[1]} are typing...`;
    }

    // 3 or more
    return 'Several people are typing...';
  }, [names]);

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div
      className="flex items-center gap-2 px-4 py-2 text-xs text-text-muted italic"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {/* Animated bouncing dots */}
      <span className="inline-flex items-center gap-1" aria-hidden="true">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-typing animate-typing-dot-1 motion-reduce:animate-none motion-reduce:opacity-100" />
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-typing animate-typing-dot-2 motion-reduce:animate-none motion-reduce:opacity-100" />
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-typing animate-typing-dot-3 motion-reduce:animate-none motion-reduce:opacity-100" />
      </span>

      {/* Text label */}
      <span>{label}</span>
    </div>
  );
}