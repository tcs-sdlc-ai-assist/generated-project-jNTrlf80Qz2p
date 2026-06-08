let _idCounter = 0;

export const MAX_MESSAGE_LENGTH = 4000;

/**
 * Factory: creates a Message entity with sensible defaults.
 *
 * @param {Object}  opts
 * @param {string}  [opts.id]             – unique message id; auto-generated if omitted
 * @param {string}  [opts.conversationId] – id of the parent conversation
 * @param {string}  [opts.senderId]       – id of the sending user
 * @param {string}  [opts.body]           – message text content
 * @param {string}  [opts.createdAt]      – ISO-8601 timestamp; defaults to now
 * @param {string}  [opts.status]         – delivery status; defaults to 'sent'
 * @returns {{ id: string, conversationId: string, senderId: string, body: string, createdAt: string, status: string }}
 */
export function createMessage({ id, conversationId, senderId, body, createdAt, status } = {}) {
  const now = new Date().toISOString();
  return {
    id: id || `msg_${Date.now()}_${++_idCounter}`,
    conversationId: conversationId || '',
    senderId: senderId || '',
    body: body || '',
    createdAt: createdAt || now,
    status: status || 'sent',
  };
}

/**
 * Validates a Message entity against the business rules.
 *
 * @param {Object} msg – a message object (as returned by createMessage)
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateMessage(msg) {
  const errors = [];

  if (!msg || typeof msg !== 'object') {
    errors.push('message must be a non-null object');
    return { valid: false, errors };
  }

  if (!msg.id) errors.push('id is required');
  if (!msg.conversationId) errors.push('conversationId is required');
  if (!msg.senderId) errors.push('senderId is required');

  if (!msg.body || msg.body.trim().length === 0) {
    errors.push('body must not be empty');
  } else if (msg.body.length > MAX_MESSAGE_LENGTH) {
    errors.push(`body must not exceed ${MAX_MESSAGE_LENGTH} characters`);
  }

  if (!msg.createdAt) errors.push('createdAt is required');

  return { valid: errors.length === 0, errors };
}