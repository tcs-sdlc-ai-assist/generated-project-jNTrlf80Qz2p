import { useState, useEffect } from 'react';

/**
 * useTypingIndicator — polls the TypingManager every 500ms for the list
 * of userIds currently typing in the given conversation.
 *
 * @param {import('../services/typingManager').TypingManager} typingManager
 * @param {string} conversationId
 * @returns {{ typingUsers: string[] }}
 */
export function useTypingIndicator(typingManager, conversationId) {
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    if (!conversationId) {
      setTypingUsers([]);
      return;
    }

    const interval = setInterval(() => {
      setTypingUsers(typingManager.getTypingUsers(conversationId));
    }, 500);

    return () => clearInterval(interval);
  }, [typingManager, conversationId]);

  return { typingUsers };
}