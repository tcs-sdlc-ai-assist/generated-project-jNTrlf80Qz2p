import { useState, useCallback } from 'react';

/**
 * Hook for group conversation management operations.
 *
 * Provides group metadata, admin status, and mutation functions
 * (rename, add/remove members) that persist via the repository and
 * broadcast changes to other tabs via BroadcastChannel.
 *
 * @param {import('../repositories/conversationRepository.js').ConversationRepository} conversationRepository
 * @param {import('../services/broadcastService.js').BroadcastService} broadcastService
 * @param {import('../repositories/userRepository.js').UserRepository} userRepository
 * @param {string | null} conversationId - id of the group conversation, or null
 * @param {string} currentUserId - id of the currently authenticated user
 * @returns {{
 *   group: Object | null,
 *   isAdmin: boolean,
 *   renameGroup: (name: string) => void,
 *   addMember: (userId: string) => void,
 *   removeMember: (userId: string) => void,
 *   getMembers: () => Array<Object>,
 * }}
 */
export function useGroupManagement(
  conversationRepository,
  broadcastService,
  userRepository,
  conversationId,
  currentUserId,
) {
  const [group, setGroup] = useState(() =>
    conversationId ? conversationRepository.findById(conversationId) : null,
  );

  const isAdmin = group ? group.adminId === currentUserId : false;

  const renameGroup = useCallback(
    (name) => {
      if (!group || !isAdmin) return;
      const updated = conversationRepository.update(group.id, { name });
      setGroup(updated);
      broadcastService.publish('conversation.updated', {
        conversation: updated,
      });
    },
    [group, isAdmin, conversationRepository, broadcastService],
  );

  const addMember = useCallback(
    (userId) => {
      if (!group || !isAdmin) return;
      conversationRepository.addMember(group.id, userId);
      const updated = conversationRepository.findById(group.id);
      setGroup(updated);
      broadcastService.publish('conversation.updated', {
        conversation: updated,
      });
    },
    [group, isAdmin, conversationRepository, broadcastService],
  );

  const removeMember = useCallback(
    (userId) => {
      if (!group || !isAdmin) return;
      conversationRepository.removeMember(group.id, userId);
      const updated = conversationRepository.findById(group.id);
      setGroup(updated);
      broadcastService.publish('conversation.updated', {
        conversation: updated,
      });
    },
    [group, isAdmin, conversationRepository, broadcastService],
  );

  const getMembers = useCallback(() => {
    if (!group) return [];
    return group.participantIds.map((id) => {
      const user = userRepository.findById(id);
      return { ...user, role: id === group.adminId ? 'admin' : 'member' };
    });
  }, [group, userRepository]);

  return { group, isAdmin, renameGroup, addMember, removeMember, getMembers };
}