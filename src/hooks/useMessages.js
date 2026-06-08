import { useState, useEffect, useCallback } from 'react';

const PAGE_SIZE = 30;

/**
 * Hook for fetching and paginating messages for a given conversation.
 *
 * @param {import('../repositories/messageRepository.js').MessageRepository} messageRepository
 * @param {string | null} conversationId
 * @returns {{
 *   messages: Array<import('../models/message.js').Message>,
 *   loading: boolean,
 *   hasMore: boolean,
 *   loadMore: () => void,
 *   refresh: () => void,
 * }}
 */
export function useMessages(messageRepository, conversationId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  const loadMessages = useCallback(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      setHasMore(false);
      return;
    }

    setLoading(true);
    const msgs = messageRepository.findByConversation(conversationId, {
      limit: PAGE_SIZE,
    });
    // findByConversation returns newest-first; reverse to chronological
    setMessages(msgs.reverse());
    setHasMore(msgs.length >= PAGE_SIZE);
    setLoading(false);
  }, [messageRepository, conversationId]);

  const loadMore = useCallback(() => {
    if (!hasMore || messages.length === 0) return;

    const oldest = messages[0];
    const older = messageRepository.findByConversation(conversationId, {
      before: oldest.id,
      limit: PAGE_SIZE,
    });

    if (older.length > 0) {
      setMessages((prev) => [...older.reverse(), ...prev]);
    }

    setHasMore(older.length >= PAGE_SIZE);
  }, [messageRepository, conversationId, hasMore, messages]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return { messages, loading, hasMore, loadMore, refresh: loadMessages };
}