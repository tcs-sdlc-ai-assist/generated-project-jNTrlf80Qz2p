import { createMessageDelivery } from '../models/messageDelivery.js';

const STORAGE_KEY = 'chat_app_message_deliveries';

export class MessageDeliveryRepository {
  constructor() {
    this._deliveries = new Map();
    this._hydrate();
  }

  _hydrate() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        arr.forEach(d => this._deliveries.set(d.id, d));
      }
    } catch (e) {
      console.error('MessageDeliveryRepository: failed to hydrate', e);
    }
  }

  _flush() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(this._deliveries.values())));
    } catch (e) {
      console.error('MessageDeliveryRepository: failed to flush', e);
      throw e;
    }
  }

  findByMessage(msgId) {
    return Array.from(this._deliveries.values()).filter(d => d.messageId === msgId);
  }

  findByRecipient(userId) {
    return Array.from(this._deliveries.values()).filter(d => d.recipientId === userId);
  }

  upsert(messageId, recipientId, status) {
    const existing = Array.from(this._deliveries.values()).find(
      d => d.messageId === messageId && d.recipientId === recipientId
    );
    if (existing) {
      const statusOrder = { sent: 0, delivered: 1, read: 2 };
      if (statusOrder[status] > statusOrder[existing.status]) {
        existing.status = status;
        existing.updatedAt = new Date().toISOString();
        this._flush();
      }
      return existing;
    }
    const delivery = createMessageDelivery({ messageId, recipientId, status });
    this._deliveries.set(delivery.id, delivery);
    this._flush();
    return delivery;
  }

  findUnreadCount(convId, userId) {
    return Array.from(this._deliveries.values()).filter(
      d => d.recipientId === userId && d.status !== 'read'
    ).length;
  }

  findAll() {
    return Array.from(this._deliveries.values());
  }

  count() {
    return this._deliveries.size;
  }
}