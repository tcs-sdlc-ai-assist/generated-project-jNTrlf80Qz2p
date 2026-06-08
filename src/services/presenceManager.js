/**
 * PresenceManager — heartbeat-based online/offline tracking.
 *
 * Responsibilities:
 *   - Maintain an in-memory map of userId → lastHeartbeat timestamp.
 *   - Broadcast presence.update events on a 5-second heartbeat interval.
 *   - Listen for remote presence.update events from other tabs via BroadcastService.
 *   - Persist presence status and lastSeenAt to the UserRepository.
 *   - Provide isOnline(userId) with a 10-second heartbeat timeout.
 *
 * Dependencies:
 *   - broadcastService: an object with publish(event, payload), subscribe(event, handler),
 *     and unsubscribe(event, handler) methods.
 *   - userRepository: an instance of UserRepository (findById, update).
 */

export class PresenceManager {
  /**
   * @param {Object} broadcastService — cross-tab event bus (publish / subscribe / unsubscribe).
   * @param {Object} userRepository   — UserRepository instance for persistence.
   */
  constructor(broadcastService, userRepository) {
    this._broadcast = broadcastService;
    this._users = userRepository;

    /** @type {Map<string, number>} userId → lastHeartbeat timestamp (ms) */
    this._onlineUsers = new Map();

    /** @type {number|null} interval handle for the heartbeat timer */
    this._heartbeatInterval = null;

    /** @type {string|null} the currently connected user's id */
    this._currentUserId = null;

    // Bind the handler once so unsubscribe works with the same reference.
    this._boundHandler = this._handlePresenceUpdate.bind(this);
  }

  /**
   * Connect a user — mark them online, start the heartbeat, and begin listening
   * for remote presence updates.
   *
   * @param {string} userId
   */
  connect(userId) {
    this._currentUserId = userId;
    this._onlineUsers.set(userId, Date.now());

    // Persist presence in the user repository.
    try {
      this._users.update(userId, {
        presence: 'online',
        lastSeenAt: new Date().toISOString(),
      });
    } catch (e) {
      // Repository may not have the user yet (e.g. during initial seed) — non-fatal.
    }

    // Announce to all tabs.
    this._broadcast.publish('presence.update', {
      userId,
      status: 'online',
    });

    // Start the 5-second heartbeat.
    this._heartbeatInterval = setInterval(() => {
      this._onlineUsers.set(userId, Date.now());
      this._broadcast.publish('presence.update', {
        userId,
        status: 'online',
      });
    }, 5000);

    // Listen for presence updates from other tabs.
    this._broadcast.subscribe('presence.update', this._boundHandler);
  }

  /**
   * Disconnect the current user — stop the heartbeat, broadcast offline status,
   * persist offline state, and stop listening for remote updates.
   */
  disconnect() {
    if (this._heartbeatInterval !== null) {
      clearInterval(this._heartbeatInterval);
      this._heartbeatInterval = null;
    }

    if (this._currentUserId) {
      // Broadcast offline.
      this._broadcast.publish('presence.update', {
        userId: this._currentUserId,
        status: 'offline',
      });

      // Persist offline status.
      try {
        this._users.update(this._currentUserId, {
          presence: 'offline',
          lastSeenAt: new Date().toISOString(),
        });
      } catch (e) {
        // Non-fatal — repository may have been cleared.
      }

      // Remove from local online map.
      this._onlineUsers.delete(this._currentUserId);
    }

    // Stop listening for remote updates.
    this._broadcast.unsubscribe('presence.update', this._boundHandler);

    this._currentUserId = null;
  }

  /**
   * Handle an incoming presence.update event from another tab.
   *
   * @param {{ userId: string, status: 'online'|'offline' }} payload
   */
  _handlePresenceUpdate(payload) {
    const { userId, status } = payload;

    // Ignore our own events — they're already handled locally.
    if (userId === this._currentUserId) return;

    if (status === 'online') {
      this._onlineUsers.set(userId, Date.now());
    } else if (status === 'offline') {
      this._onlineUsers.delete(userId);
    }
  }

  /**
   * Check whether a user is currently online.
   * A user is considered online if their last heartbeat was within the last 10 seconds.
   *
   * @param {string} userId
   * @returns {boolean}
   */
  isOnline(userId) {
    const lastHeartbeat = this._onlineUsers.get(userId);
    if (lastHeartbeat === undefined) return false;
    return Date.now() - lastHeartbeat < 10_000; // 10-second timeout
  }

  /**
   * Retrieve the lastSeenAt timestamp for a user from the repository.
   *
   * @param {string} userId
   * @returns {string|null} ISO-8601 timestamp or null if the user is not found.
   */
  getLastSeen(userId) {
    const user = this._users.findById(userId);
    return user ? user.lastSeenAt : null;
  }

  /**
   * Tear down the manager — disconnect and release all resources.
   */
  destroy() {
    this.disconnect();
  }
}