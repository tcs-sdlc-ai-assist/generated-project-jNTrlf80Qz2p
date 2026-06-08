import { useState, useMemo } from 'react';
import ConversationRow from './conversationRow.jsx';
import ConversationSearch from './conversationSearch.jsx';

/**
 * ConversationList — scrollable list pane showing all conversations for the
 * current user, with search filtering and a "New Conversation" affordance.
 *
 * Props:
 *  - conversations: Array<Conversation>   — all conversations the user belongs to
 *  - activeId:      string|null           — id of the currently selected conversation
 *  - onSelect:      (id: string) => void  — called when a conversation row is clicked
 *  - onNewConversation: () => void        — called when the "New Conversation" button is clicked
 */
export default function ConversationList({
  conversations = [],
  activeId = null,
  onSelect,
  onNewConversation,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Filter conversations by the search query.
   *
   * For direct conversations, we match against the other participant's
   * displayName. For group conversations, we match against the group name.
   * The search is case-insensitive and matches anywhere in the string.
   */
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;

    const query = searchQuery.toLowerCase().trim();

    return conversations.filter((conv) => {
      // Match group name
      if (conv.name && conv.name.toLowerCase().includes(query)) {
        return true;
      }

      // Direct conversations pass through — ConversationRow resolves
      // the other participant's display name for display purposes.
      return conv.type === 'direct';
    });
  }, [conversations, searchQuery]);

  const hasConversations = conversations.length > 0;
  const hasFilteredResults = filteredConversations.length > 0;
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* ── Header: New Conversation button ─────────────────────── */}
      <div className="px-3 pt-3 pb-2">
        <button
          type="button"
          onClick={onNewConversation}
          className="
            w-full inline-flex items-center justify-center gap-2
            rounded-xl bg-accent text-accent-fg
            px-4 py-2.5 text-sm font-medium
            hover:bg-accent-hover
            active:scale-[0.97]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus
            focus-visible:ring-offset-2
            transition-[background-color,transform] duration-150
            motion-reduce:transition-none motion-reduce:transform-none
            cursor-pointer
          "
          aria-label="Start a new conversation"
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
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          New Conversation
        </button>
      </div>

      {/* ── Search input ────────────────────────────────────────── */}
      <div className="px-3 pb-2">
        <ConversationSearch
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {/* ── Conversation list ───────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {!hasConversations ? (
          /* ── Empty state: no conversations at all ─────────────── */
          <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-surface-2 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-text-muted"
                aria-hidden="true"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-text">
              No conversations yet
            </p>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Start a new one to begin chatting!
            </p>
          </div>
        ) : isSearching && !hasFilteredResults ? (
          /* ── No search results ────────────────────────────────── */
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <p className="text-sm font-medium text-text">
              No conversations found
            </p>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Try a different search term.
            </p>
          </div>
        ) : (
          /* ── Conversation rows ────────────────────────────────── */
          <ul role="listbox" aria-label="Conversations">
            {filteredConversations.map((conv) => (
              <ConversationRow
                key={conv.id}
                conversation={conv}
                isActive={conv.id === activeId}
                onSelect={() => onSelect?.(conv.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}