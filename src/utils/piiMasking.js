/**
 * Masks an email address for safe logging.
 * Keeps the first character, replaces everything between it and '@' with asterisks.
 * Example: 'alice@demo.local' -> 'a***@demo.local'
 * Example: 'b@demo.local' -> 'b***@demo.local'
 *
 * @param {string|null|undefined} email - The email address to mask.
 * @returns {string} The masked email, or '***' if input is invalid.
 */
export function maskEmail(email) {
  if (!email || typeof email !== 'string') return '***';
  const atIndex = email.indexOf('@');
  if (atIndex <= 0) return '***';
  const firstChar = email[0];
  return firstChar + '***' + email.slice(atIndex);
}