import { createMessage } from '../models/message.js';

const STORAGE_KEY = 'chat_app_messages';

export class MessageRepository {
  constructor() {
    this._messages = new Map();
    this._hydrate();
  }

  _hydrate() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        arr.forEach((m) => this._messages.set(m.id, m));
      }
    } catch (e) {
      console.error('MessageRepository: failed to hydrate', e);
    }
  }

  _flush() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(Array.from(this._messages.values())),
      );
    } catch (e) {
      console.error('MessageRepository: failed to flush', e);
      throw e;
    }
  }

  findById(id) {
    return this._messages.get(id) || null;
  }

  findByConversation(convId, { before, limit = 50 } = {}) {
    let messages = Array.from(this._messages.values())
      .filter((m) => m.conversationId === convId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (before) {
      const idx = messages.findIndex((m) => m.id === before);
      if (idx !== -1) messages = messages.slice(idx + 1);
    }

    return messages.slice(0, limit);
  }

  create(data) {
    const msg = createMessage(data);
    this._messages.set(msg.id, msg);
    this._flush();
    return msg;
  }

  findAll() {
    return Array.from(this._messages.values());
  }

  count() {
    return this._messages.size;
  }
}