import { maskEmail } from '../utils/piiMasking.js';

const SESSION_KEY = 'chat_app_current_user';

/**
 * Orchestrates registration, login, logout, and session lifecycle
 * for the mocked authentication system.
 *
 * Session persistence is handled via localStorage under the
 * `chat_app_current_user` key. All console.log calls use
 * maskEmail() to avoid leaking PII into the developer console.
 */
export class AuthService {
  /**
   * @param {import('../repositories/userRepository.js').UserRepository} userRepository
   */
  constructor(userRepository) {
    this._users = userRepository;
  }

  /**
   * Registers a new user, persists the session, and returns the user entity.
   *
   * @param {string} email       - Unique email address.
   * @param {string} password    - Plain-text password (mock auth).
   * @param {string} displayName - Human-readable display name.
   * @returns {Object} The newly created user entity.
   * @throws {Error} If the email is already registered.
   */
  register(email, password, displayName) {
    const existing = this._users.findByEmail(email);
    if (existing) {
      throw new Error('Email already registered');
    }
    const user = this._users.create({ email, password, displayName });
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }));
    console.log('AuthService: registered user', maskEmail(user.email));
    return user;
  }

  /**
   * Authenticates an existing user, persists the session, and returns the user entity.
   *
   * @param {string} email    - Registered email address.
   * @param {string} password - Plain-text password to validate.
   * @returns {Object} The authenticated user entity.
   * @throws {Error} If credentials are invalid.
   */
  login(email, password) {
    const user = this._users.findByEmail(email);
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }));
    console.log('AuthService: logged in user', maskEmail(user.email));
    return user;
  }

  /**
   * Clears the current session from localStorage.
   * Logs the masked email of the departing user when a session exists.
   */
  logout() {
    const session = this._getSession();
    if (session) {
      const user = this._users.findById(session.userId);
      if (user) {
        console.log('AuthService: logged out user', maskEmail(user.email));
      }
    }
    localStorage.removeItem(SESSION_KEY);
  }

  /**
   * Returns the currently authenticated user, or null if no session exists
   * or the stored user ID no longer resolves to a valid user.
   *
   * @returns {Object|null} The current user entity, or null.
   */
  getCurrentUser() {
    const session = this._getSession();
    if (!session) return null;
    return this._users.findById(session.userId) || null;
  }

  /**
   * Reads and parses the session object from localStorage.
   *
   * @returns {{ userId: string }|null} The parsed session, or null.
   * @private
   */
  _getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}