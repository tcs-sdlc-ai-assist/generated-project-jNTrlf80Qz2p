import { createUser } from '../models/user.js';

const STORAGE_KEY = 'chat_app_users';

export class UserRepository {
  constructor() {
    this._users = new Map();
    this._hydrate();
  }

  _hydrate() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        arr.forEach((u) => this._users.set(u.id, u));
      }
    } catch (e) {
      console.error('UserRepository: failed to hydrate from localStorage', e);
    }
  }

  _flush() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(Array.from(this._users.values())),
      );
    } catch (e) {
      console.error('UserRepository: failed to flush to localStorage', e);
      throw e;
    }
  }

  findAll() {
    return Array.from(this._users.values());
  }

  findById(id) {
    return this._users.get(id) || null;
  }

  findByEmail(email) {
    const lower = email.toLowerCase();
    for (const user of this._users.values()) {
      if (user.email.toLowerCase() === lower) return user;
    }
    return null;
  }

  create(data) {
    const user = createUser(data);
    this._users.set(user.id, user);
    this._flush();
    return user;
  }

  update(id, data) {
    const existing = this._users.get(id);
    if (!existing) throw new Error(`User not found: ${id}`);
    const updated = { ...existing, ...data, id };
    this._users.set(id, updated);
    this._flush();
    return updated;
  }

  seedDemoUsers() {
    if (this._users.size > 0) return;
    const demos = [
      { email: 'alice@demo.local', ***REDACTED-BY-SECURITY-SCRUB***, displayName: 'Alice Demo' },
      { email: 'bob@demo.local', ***REDACTED-BY-SECURITY-SCRUB***, displayName: 'Bob Test' },
      { email: 'charlie@demo.local', ***REDACTED-BY-SECURITY-SCRUB***, displayName: 'Charlie Mock' },
      { email: 'diana@demo.local', ***REDACTED-BY-SECURITY-SCRUB***, displayName: 'Diana Fake' },
      { email: 'eve@demo.local', ***REDACTED-BY-SECURITY-SCRUB***, displayName: 'Eve Example' },
    ];
    demos.forEach((d) => this.create(d));
  }

  count() {
    return this._users.size;
  }
}