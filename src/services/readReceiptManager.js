/**
 * ReadReceiptManager
 *
 * Tracks the last-read message per (user, conversation) pair with monotonic
 * advancement — a user's read cursor can only move forward in time, never
 * backward.  Broadcasts `message.status` events so other tabs can react.
 *
 * Dependencies (constructor-injected):
 *   - messageRepository  — exposes findById(id)
 *   - broadcastService   — exposes publish(channel, payload)
 *   - userRepository     — reserved for future use (e.g. presence gating)
 */

export class ReadReceiptManager {
  /**
   * @param {import('../repositories/messageRepository.js').MessageRepository} messageRepository
   * @param {{ publish: (channel: string, payload: object) => void }} broadcastService
   * @param {import('../repositories/userRepository.js').UserRepository} userRepository
   */
  constructor(messageRepository, broadcastService, userRepository) {
    this._messages = messageRepository;
    this._broadcast = broadcastService;
    this._users = userRepository;

    /**
     * Map keyed by `${userId}:${conversationId}` → most-recently-read messageId.
     * @type {Map<string, string>}
     */
    this._lastReadPerConv = new Map();
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Advance the read cursor for `userId` in `conversationId` to `messageId`.
   *
   * The cursor is **monotonic**: if the supplied message is older than (or the
   * same as) the currently-stored cursor the call is silently ignored.
   *
   * On successful advancement a `message.status` broadcast is published so
   * other tabs / components can update delivery receipts.
   *
   * @param {string} userId
   * @param {string} conversationId
   * @param {string} messageId
   * @returns {void}
   */
  markRead(userId, conversationId, messageId) {
    const key = `${userId}:${conversationId}`;
    const current = this._lastReadPerConv.get(key);

    // Monotonic enforcement: only advance forward in time.
    if (current) {
      const currentMsg = this._messages.findById(current);
      const newMsg = this._messages.findById(messageId);

      if (currentMsg && newMsg) {
        const currentTime = new Date(currentMsg.createdAt).getTime();
        const newTime = new Date(newMsg.createdAt).getTime();

        // Do not regress — ignore reads of older or same-timestamp messages.
        if (newTime <= currentTime) {
          return;
        }
      }
    }

    this._lastReadPerConv.set(key, messageId);

    // Broadcast read status so other tabs / delivery-trackers can react.
    this._broadcast.publish('message.status', {
      type: 'read',
      userId,
      conversationId,
      messageId,
    });
  }

  /**
   * Return the most-recently-read message id for the given user in the given
   * conversation, or `null` if nothing has been read yet.
   *
   * @param {string} userId
   * @param {string} conversationId
   * @returns {string | null}
   */
  getLastReadMessageId(userId, conversationId) {
    return this._lastReadPerConv.get(`${userId}:${conversationId}`) || null;
  }

  /**
   * Determine whether a specific message has been read by a specific user.
   *
   * A message is considered "read" when its `createdAt` timestamp is on or
   * before the timestamp of the user's last-read message in that conversation.
   *
   * @param {string} userId
   * @param {string} messageId
   * @returns {boolean}
   */
  isMessageRead(userId, messageId) {
    const msg = this._messages.findById(messageId);
    if (!msg) return false;

    const lastRead = this.getLastReadMessageId(userId, msg.conversationId);
    if (!lastRead) return false;

    const lastReadMsg = this._messages.findById(lastRead);
    if (!lastReadMsg) return false;

    return new Date(msg.createdAt).getTime() <= new Date(lastReadMsg.createdAt).getTime();
  }
}