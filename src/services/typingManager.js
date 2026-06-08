/**
 * TypingManager — manages typing indicator state with 3-second auto-clear.
 *
 * Tracks which users are currently typing in each conversation and
 * broadcasts typing.start / typing.stop events via the injected
 * BroadcastService so other tabs can observe remote typing state.
 *
 * @class TypingManager
 */
export class TypingManager {
  /**
   * @param {Object} broadcastService — service with a `publish(event, payload)` method
   */
  constructor(broadcastService) {
    this._broadcast = broadcastService;

    /**
     * Map of `${userId}:${conversationId}` → timeoutId
     * @type {Map<string, number>}
     */
    this._timers = new Map();

    /**
     * Map of conversationId → Set of userIds currently typing
     * @type {Map<string, Set<string>>}
     */
    this._typingUsers = new Map();
  }

  /**
   * Signal that a local user has started typing in a conversation.
   * Broadcasts `typing.start` on the first keystroke (not every keystroke)
   * and sets a 3-second auto-clear timer.
   *
   * @param {string} userId         - The user who is typing
   * @param {string} conversationId - The conversation they are typing in
   */
  startTyping(userId, conversationId) {
    const key = `${userId}:${conversationId}`;

    // Clear any existing auto-clear timer for this user+conversation pair
    if (this._timers.has(key)) {
      clearTimeout(this._timers.get(key));
    }

    // Ensure the conversation's typing set exists
    if (!this._typingUsers.has(conversationId)) {
      this._typingUsers.set(conversationId, new Set());
    }

    const wasEmpty = this._typingUsers.get(conversationId).size === 0;
    this._typingUsers.get(conversationId).add(userId);

    // Broadcast only on first keystroke (not on every keystroke)
    if (wasEmpty || !this._timers.has(key)) {
      this._broadcast.publish('typing.start', { userId, conversationId });
    }

    // Set 3-second auto-clear
    const timer = setTimeout(() => {
      this.stopTyping(userId, conversationId);
    }, 3000);
    this._timers.set(key, timer);
  }

  /**
   * Signal that a local user has stopped typing in a conversation.
   * Clears the auto-clear timer and broadcasts `typing.stop`.
   *
   * @param {string} userId         - The user who stopped typing
   * @param {string} conversationId - The conversation they were typing in
   */
  stopTyping(userId, conversationId) {
    const key = `${userId}:${conversationId}`;

    // Clear and remove the auto-clear timer
    if (this._timers.has(key)) {
      clearTimeout(this._timers.get(key));
      this._timers.delete(key);
    }

    // Remove user from the conversation's typing set
    const users = this._typingUsers.get(conversationId);
    if (users) {
      users.delete(userId);
      if (users.size === 0) {
        this._typingUsers.delete(conversationId);
      }
    }

    this._broadcast.publish('typing.stop', { userId, conversationId });
  }

  /**
   * Returns an array of userIds currently typing in the given conversation.
   *
   * @param {string} conversationId
   * @returns {string[]} Array of userIds (empty array if none)
   */
  getTypingUsers(conversationId) {
    const users = this._typingUsers.get(conversationId);
    return users ? Array.from(users) : [];
  }

  /**
   * Handle a remote `typing.start` event received from another tab.
   * Adds the remote user to the typing set and sets a 3.5-second
   * auto-clear (slightly longer than local to account for network delay).
   *
   * @param {{ userId: string, conversationId: string }} payload
   */
  handleRemoteTypingStart(payload) {
    const { userId, conversationId } = payload;

    if (!this._typingUsers.has(conversationId)) {
      this._typingUsers.set(conversationId, new Set());
    }
    this._typingUsers.get(conversationId).add(userId);

    // Auto-clear remote typing after 3.5 seconds
    const key = `remote:${userId}:${conversationId}`;
    if (this._timers.has(key)) {
      clearTimeout(this._timers.get(key));
    }

    const timer = setTimeout(() => {
      const users = this._typingUsers.get(conversationId);
      if (users) {
        users.delete(userId);
      }
      this._timers.delete(key);
    }, 3500);
    this._timers.set(key, timer);
  }

  /**
   * Handle a remote `typing.stop` event received from another tab.
   * Removes the remote user from the typing set immediately.
   *
   * @param {{ userId: string, conversationId: string }} payload
   */
  handleRemoteTypingStop(payload) {
    const { userId, conversationId } = payload;
    const users = this._typingUsers.get(conversationId);
    if (users) {
      users.delete(userId);
    }
  }
}