import { createConversation } from '../models/conversation.js';

const STORAGE_KEY = 'chat_app_conversations';

export class ConversationRepository {
  constructor() {
    this._conversations = new Map();
    this._hydrate();
  }

  _hydrate() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        arr.forEach(c => this._conversations.set(c.id, c));
      }
    } catch (e) {
      console.error('ConversationRepository: failed to hydrate', e);
    }
  }

  _flush() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(this._conversations.values())));
    } catch (e) {
      console.error('ConversationRepository: failed to flush', e);
      throw e;
    }
  }

  findAll() {
    return Array.from(this._conversations.values());
  }

  findById(id) {
    return this._conversations.get(id) || null;
  }

  findByUser(userId) {
    return this.findAll().filter(c => c.participantIds.includes(userId));
  }

  findCanonicalDM(userA, userB) {
    return this.findAll().find(c =>
      c.type === 'direct' &&
      c.participantIds.length === 2 &&
      c.participantIds.includes(userA) &&
      c.participantIds.includes(userB)
    ) || null;
  }

  create(data) {
    const conv = createConversation(data);
    this._conversations.set(conv.id, conv);
    this._flush();
    return conv;
  }

  update(id, data) {
    const existing = this._conversations.get(id);
    if (!existing) throw new Error(`Conversation not found: ${id}`);
    const updated = { ...existing, ...data, id };
    this._conversations.set(id, updated);
    this._flush();
    return updated;
  }

  addMember(convId, userId) {
    const conv = this._conversations.get(convId);
    if (!conv) throw new Error(`Conversation not found: ${convId}`);
    if (!conv.participantIds.includes(userId)) {
      conv.participantIds = [...conv.participantIds, userId];
      this._flush();
    }
    return conv;
  }

  removeMember(convId, userId) {
    const conv = this._conversations.get(convId);
    if (!conv) throw new Error(`Conversation not found: ${convId}`);
    conv.participantIds = conv.participantIds.filter(id => id !== userId);
    this._flush();
    return conv;
  }

  count() {
    return this._conversations.size;
  }
}