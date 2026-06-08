const CHANNEL_NAME = 'chat-app-demo';

export class BroadcastService {
  constructor() {
    this._tabId = `tab_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    this._handlers = new Map();
    this._channel = null;
    this._available = typeof BroadcastChannel !== 'undefined';
    if (this._available) {
      try {
        this._channel = new BroadcastChannel(CHANNEL_NAME);
        this._channel.onmessage = (event) => this._handleMessage(event);
      } catch (e) {
        console.warn(
          'BroadcastService: failed to create channel, running in single-tab mode',
          e
        );
        this._available = false;
      }
    }
  }

  get isAvailable() {
    return this._available;
  }

  get tabId() {
    return this._tabId;
  }

  _handleMessage(event) {
    const { type, payload, sender } = event.data || {};
    if (!type) return;
    if (sender && sender.tabId === this._tabId) return; // echo prevention
    const handlers = this._handlers.get(type);
    if (handlers) {
      handlers.forEach((fn) => {
        try {
          fn(payload, sender);
        } catch (e) {
          console.error('BroadcastService handler error', e);
        }
      });
    }
  }

  publish(type, payload) {
    if (!this._available || !this._channel) return;
    const message = {
      type,
      payload,
      sender: { tabId: this._tabId },
      timestamp: Date.now(),
    };
    try {
      this._channel.postMessage(message);
    } catch (e) {
      console.error('BroadcastService: publish failed', e);
    }
  }

  subscribe(type, handler) {
    if (!this._handlers.has(type)) {
      this._handlers.set(type, new Set());
    }
    this._handlers.get(type).add(handler);
  }

  unsubscribe(type, handler) {
    const handlers = this._handlers.get(type);
    if (handlers) handlers.delete(handler);
  }

  close() {
    if (this._channel) {
      this._channel.close();
      this._channel = null;
    }
    this._handlers.clear();
  }
}