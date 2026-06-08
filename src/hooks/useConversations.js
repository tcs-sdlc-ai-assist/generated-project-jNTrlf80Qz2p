import { useState, useEffect, useCallback } from 'react';

/**
 * Hook that loads and enriches the conversation list for the current user.
 *
 * Each conversation is decorated with:
 *  - lastMessage   — the most recent message in the conversation (or null)
 *  - unreadCount   — number of unread delivery records for the current user
 *  - otherUserName — for direct conversations, the display name of the other
 *                    participant; for groups, the conversation's own name
 *
 * The returned list is sorted by lastMessageAt descending (newest first).
 *
 * @param {Object} conversationRepository      - instance of ConversationRepository
 * @param {Object} messageDeliveryRepository   - instance of MessageDeliveryRepository
 * @param {Object} messageRepository           - instance of MessageRepository
 * @param {Object} userRepository              - instance of UserRepository
 * @param {string} currentUserId               - id of the currently authenticated user
 * @returns {{ conversations: Array, loading: boolean, refresh: Function }}
 */
export function useConversations(
  conversationRepository,
  messageDeliveryRepository,
  messageRepository,
  userRepository,
  currentUserId,
) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadConversations = useCallback(() => {
    setLoading(true);

    const convs = conversationRepository.findByUser(currentUserId);

    const enriched = convs.map((conv) => {
      // Last message
      const msgs = messageRepository.findByConversation(conv.id, { limit: 1 });
      const lastMessage = msgs.length > 0 ? msgs[0] : null;

      // Unread count
      const unreadCount = messageDeliveryRepository.findUnreadCount(
        conv.id,
        currentUserId,
      );

      // Display name for the conversation list
      let otherUserName = conv.name;
      if (conv.type === 'direct') {
        const otherId = conv.participantIds.find((id) => id !== currentUserId);
        const otherUser = otherId ? userRepository.findById(otherId) : null;
        otherUserName = otherUser ? otherUser.displayName : 'Unknown';
      }

      return { ...conv, lastMessage, unreadCount, otherUserName };
    });

    // Sort by lastMessageAt descending (newest first)
    enriched.sort(
      (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt),
    );

    setConversations(enriched);
    setLoading(false);
  }, [
    conversationRepository,
    messageDeliveryRepository,
    messageRepository,
    userRepository,
    currentUserId,
  ]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return { conversations, loading, refresh: loadConversations };
}