let _idCounter = 0;

/**
 * Factory: creates a validated Conversation entity with sensible defaults.
 *
 * @param {Object}  opts
 * @param {string}  [opts.id]            - Unique conversation id; auto-generated if omitted.
 * @param {'direct'|'group'} [opts.type] - Conversation type; defaults to 'direct'.
 * @param {string|null} [opts.name]      - Display name (required for groups).
 * @param {string}  [opts.createdBy]     - User id of the conversation creator.
 * @param {string[]} [opts.participantIds] - Array of user ids (min 2).
 * @param {string|null} [opts.adminId]   - Admin user id (required for groups).
 * @param {string}  [opts.createdAt]     - ISO-8601 creation timestamp.
 * @param {string}  [opts.lastMessageAt] - ISO-8601 last-message timestamp.
 * @returns {Object} A mutable conversation entity.
 */
export function createConversation({
  id,
  type,
  name,
  createdBy,
  participantIds,
  adminId,
  createdAt,
  lastMessageAt,
} = {}) {
  const now = new Date().toISOString();

  return {
    id: id || `conv_${Date.now()}_${++_idCounter}`,
    type: type || 'direct',
    name: name || null,
    createdBy: createdBy || '',
    participantIds: participantIds || [],
    adminId: adminId || null,
    createdAt: createdAt || now,
    lastMessageAt: lastMessageAt || now,
  };
}

/**
 * Validator: checks a conversation entity against the business rules.
 *
 * Rules:
 *  - id is required
 *  - type must be 'direct' or 'group'
 *  - group conversations require a name and an adminId
 *  - createdBy is required
 *  - participantIds must be an array with at least 2 entries
 *
 * @param {Object} conv - The conversation entity to validate.
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateConversation(conv) {
  const errors = [];

  if (!conv || typeof conv !== 'object') {
    return { valid: false, errors: ['conversation must be a non-null object'] };
  }

  if (!conv.id) {
    errors.push('id is required');
  }

  if (!conv.type || !['direct', 'group'].includes(conv.type)) {
    errors.push('type must be "direct" or "group"');
  }

  if (conv.type === 'group' && !conv.name) {
    errors.push('name is required for group conversations');
  }

  if (!conv.createdBy) {
    errors.push('createdBy is required');
  }

  if (!conv.participantIds || !Array.isArray(conv.participantIds) || conv.participantIds.length < 2) {
    errors.push('participantIds must have at least 2 entries');
  }

  if (conv.type === 'group' && !conv.adminId) {
    errors.push('adminId is required for group conversations');
  }

  return { valid: errors.length === 0, errors };
}