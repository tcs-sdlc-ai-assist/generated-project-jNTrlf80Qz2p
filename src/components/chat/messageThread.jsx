import { useRef, useEffect, useCallback, useMemo } from 'react';
import MessageBubble from './messageBubble.jsx';
import DateSeparator from './dateSeparator.jsx';
import TypingIndicator from './typingIndicator.jsx';

/**
 * Groups an array of messages by their date (YYYY-MM-DD) while preserving
 * the original sort order. Returns an array of { date, messages } objects.
 *
 * @param {Object[]} messages – sorted message entities (oldest-first)
 * @returns {{ date: string, messages: Object[] }[]}
 */
function groupMessagesByDate(messages) {
  if (!messages || messages.length === 0) return [];

  const groups = [];
  let currentDate = null;
  let currentGroup = null;

  for (const msg of messages) {
    const date = msg.createdAt ? msg.createdAt.slice(0, 10) : 'unknown';

    if (date !== currentDate) {
      currentDate = date;
      currentGroup = { date, messages: [] };
      groups.push(currentGroup);
    }

    currentGroup.messages.push(msg);
  }

  return groups;
}

/**
 * Formats an ISO date string (YYYY-MM-DD) into a human-readable label.
 *
 * Rules:
 *  - Today     → "Today"
 *  - Yesterday → "Yesterday"
 *  - This year → "Mon D"    (e.g. "Jun 8")
 *  - Older     → "Mon D, YYYY" (e.g. "Jun 8, 2025")
 *
 * @param {string} dateStr – YYYY-MM-DD
 * @returns {string}
 */
function formatDateLabel(dateStr) {
  if (dateStr === 'unknown') return 'Unknown date';

  const [year, month, day] = dateStr.split('-').map(Number);
  const target = new Date(year, month - 1, day);
  const now = new Date();

  // Reset time portions for accurate day comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  if (targetDay.getTime() === today.getTime()) {
    return 'Today';
  }

  if (targetDay.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const monthLabel = monthNames[month - 1];

  if (target.getFullYear() === now.getFullYear()) {
    return `${monthLabel} ${day}`;
  }

  return `${monthLabel} ${day}, ${year}`;
}

/**
 * MessageThread — scrollable message display with date separators, typing
 * indicators, infinite-scroll upward pagination, and auto-scroll-to-bottom
 * on new messages.
 *
 * Props:
 *  - messages:       Object[]   – sorted oldest-first message entities
 *  - currentUserId:  string     – id of the currently authenticated user
 *  - conversation:   Object     – the active conversation entity
 *  - typingUsers:    string[]   – array of userIds currently typing
 *  - userRepository: Object     – repository with findById(id) returning a user entity
 *  - onLoadMore:     () => void – callback triggered when scrolling to top
 *  - hasMore:        boolean    – whether older messages are available
 *
 * @param {{
 *   messages: Object[],
 *   currentUserId: string,
 *   conversation: Object,
 *   typingUsers: string[],
 *   userRepository: { findById: (id: string) => Object | undefined },
 *   onLoadMore: () => void,
 *   hasMore: boolean,
 * }} props
 */
export default function MessageThread({
  messages,
  currentUserId,
  conversation,
  typingUsers,
  userRepository,
  onLoadMore,
  hasMore,
}) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const prevMessageCountRef = useRef(0);
  const isLoadingMoreRef = useRef(false);
  const prevScrollHeightRef = useRef(0);

  // ── Group messages by date ──────────────────────────────────────
  const dateGroups = useMemo(() => groupMessagesByDate(messages), [messages]);

  // ── Auto-scroll to bottom on new messages ───────────────────────
  useEffect(() => {
    const currentCount = messages.length;
    const prevCount = prevMessageCountRef.current;

    // Only auto-scroll if new messages were added (count increased)
    // and we're already near the bottom (or it's the initial load)
    if (currentCount > prevCount && prevCount > 0) {
      const container = containerRef.current;
      if (container) {
        const threshold = 150; // px from bottom to consider "near bottom"
        const distanceFromBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight;

        if (distanceFromBottom < threshold) {
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }

    // On initial load (prevCount was 0), always scroll to bottom
    if (prevCount === 0 && currentCount > 0) {
      // Use requestAnimationFrame to ensure DOM has painted
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'instant' });
      });
    }

    prevMessageCountRef.current = currentCount;
  }, [messages.length]);

  // ── Infinite scroll: load more when scrolling to top ────────────
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || !hasMore || isLoadingMoreRef.current) return;

    // Trigger when within 80px of the top
    if (container.scrollTop <= 80) {
      isLoadingMoreRef.current = true;
      prevScrollHeightRef.current = container.scrollHeight;

      onLoadMore();
    }
  }, [hasMore, onLoadMore]);

  // After messages change (due to onLoadMore), preserve scroll position
  useEffect(() => {
    if (isLoadingMoreRef.current) {
      const container = containerRef.current;
      if (container) {
        const newScrollHeight = container.scrollHeight;
        const heightDiff = newScrollHeight - prevScrollHeightRef.current;
        // Adjust scrollTop to keep the same visual position
        container.scrollTop = heightDiff;
      }
      isLoadingMoreRef.current = false;
    }
  }, [messages]);

  // ── Resolve typing user display names ───────────────────────────
  const typingDisplayNames = useMemo(() => {
    if (!typingUsers || typingUsers.length === 0) return [];
    return typingUsers
      .map((uid) => {
        // Don't show the current user as typing
        if (uid === currentUserId) return null;
        const user = userRepository.findById(uid);
        return user ? user.displayName : null;
      })
      .filter(Boolean);
  }, [typingUsers, currentUserId, userRepository]);

  // ── Empty state ─────────────────────────────────────────────────
  if (!messages || messages.length === 0) {
    return (
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-4"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-xs">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-surface-2 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-text-muted"
                aria-hidden="true"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-text">
              No messages yet
            </p>
            <p className="text-xs mt-1 text-text-muted leading-relaxed">
              Be the first to send a message in this conversation.
            </p>
          </div>
        </div>

        {/* Typing indicator still shows even when empty */}
        {typingDisplayNames.length > 0 && (
          <div className="sticky bottom-0 mt-4">
            <TypingIndicator names={typingDisplayNames} />
          </div>
        )}

        {/* Invisible anchor for auto-scroll */}
        <div ref={bottomRef} />
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-4 py-4"
      role="log"
      aria-label="Message thread"
      aria-live="polite"
    >
      {/* Loading indicator at top when more messages are available */}
      {hasMore && (
        <div className="flex justify-center py-3">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                        bg-surface-2 text-xs text-text-muted font-medium"
            role="status"
            aria-label="Loading older messages"
          >
            <svg
              className="animate-spin h-3.5 w-3.5 text-accent"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Loading older messages…</span>
          </div>
        </div>
      )}

      {/* Date-grouped messages */}
      {dateGroups.map((group) => (
        <div key={group.date} className="mb-6">
          {/* Date separator */}
          <DateSeparator label={formatDateLabel(group.date)} />

          {/* Messages in this date group */}
          <div className="space-y-1 mt-2">
            {group.messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === currentUserId}
                sender={userRepository.findById(msg.senderId)}
                conversation={conversation}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Typing indicator */}
      {typingDisplayNames.length > 0 && (
        <div className="mt-2 mb-2">
          <TypingIndicator names={typingDisplayNames} />
        </div>
      )}

      {/* Invisible anchor — auto-scroll target */}
      <div ref={bottomRef} />
    </div>
  );
}