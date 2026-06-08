let _idCounter = 0;

/**
 * Factory for creating a MessageDelivery entity with sensible defaults.
 *
 * @param {Object}  opts
 * @param {string}  [opts.id]          - Unique delivery record ID; auto-generated if omitted.
 * @param {string}  [opts.messageId]   - ID of the message this delivery tracks.
 * @param {string}  [opts.recipientId] - ID of the recipient user.
 * @param {'sent'|'delivered'|'read'} [opts.status] - Delivery status; defaults to 'sent'.
 * @param {string}  [opts.updatedAt]   - ISO-8601 timestamp; defaults to now.
 * @returns {{ id: string, messageId: string, recipientId: string, status: string, updatedAt: string }}
 */
export function createMessageDelivery({ id, messageId, recipientId, status, updatedAt } = {}) {
  const now = new Date().toISOString();
  return {
    id: id || `md_${Date.now()}_${++_idCounter}`,
    messageId: messageId || '',
    recipientId: recipientId || '',
    status: status || 'sent',
    updatedAt: updatedAt || now,
  };
}

/**
 * Validates a MessageDelivery object against the required schema.
 *
 * @param {Object} md - The MessageDelivery object to validate.
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateMessageDelivery(md) {
  const errors = [];

  if (!md || typeof md !== 'object') {
    return { valid: false, errors: ['MessageDelivery must be a non-null object'] };
  }

  if (!md.id) errors.push('id is required');
  if (!md.messageId) errors.push('messageId is required');
  if (!md.recipientId) errors.push('recipientId is required');

  if (!md.status || !['sent', 'delivered', 'read'].includes(md.status)) {
    errors.push('status must be "sent", "delivered", or "read"');
  }

  return { valid: errors.length === 0, errors };
}