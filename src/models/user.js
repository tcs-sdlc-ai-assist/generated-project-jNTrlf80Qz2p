let _idCounter = 0;

/**
 * Factory function to create a User entity with sensible defaults.
 *
 * @param {Object}  params
 * @param {string}  [params.id]                  - Unique user identifier; auto-generated if omitted.
 * @param {string}  [params.email]               - User email address.
 * @param {string}  [params.password]            - User password (plain-text for mock auth).
 * @param {string}  [params.displayName]         - Human-readable display name.
 * @param {string}  [params.avatarUrl]           - URL to avatar image; null if none.
 * @param {string}  [params.presence]            - Presence status: 'online', 'offline', or 'away'.
 * @param {string}  [params.lastSeenAt]          - ISO-8601 timestamp of last activity.
 * @param {boolean} [params.readReceiptsEnabled] - Whether read receipts are enabled for this user.
 * @param {string}  [params.createdAt]           - ISO-8601 timestamp of account creation.
 * @returns {Object} A frozen user entity object.
 */
export function createUser({
  id,
  email,
  password,
  displayName,
  avatarUrl,
  presence,
  lastSeenAt,
  readReceiptsEnabled,
  createdAt,
} = {}) {
  const now = new Date().toISOString();

  return {
    id: id || `user_${Date.now()}_${++_idCounter}`,
    email: email || '',
    password: password || '',
    displayName: displayName || '',
    avatarUrl: avatarUrl || null,
    presence: presence || 'offline',
    lastSeenAt: lastSeenAt || now,
    readReceiptsEnabled: readReceiptsEnabled !== undefined ? readReceiptsEnabled : true,
    createdAt: createdAt || now,
  };
}

/**
 * Validates a user entity, returning an object with `valid` (boolean) and
 * `errors` (array of human-readable error strings).
 *
 * Required fields: id, email, password, displayName, createdAt.
 *
 * @param {Object} user - The user entity to validate.
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateUser(user) {
  const errors = [];

  if (!user.id) errors.push('id is required');
  if (!user.email) errors.push('email is required');
  if (!user.password) errors.push('password is required');
  if (!user.displayName) errors.push('displayName is required');
  if (!user.createdAt) errors.push('createdAt is required');

  return { valid: errors.length === 0, errors };
}