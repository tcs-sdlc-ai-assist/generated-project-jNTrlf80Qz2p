import { MAX_MESSAGE_LENGTH } from '../models/message.js';

/**
 * MessageService — orchestrates the full message-send pipeline.
 *
 * Responsibilities:
 *  - Validate message body (non-empty, ≤ MAX_MESSAGE_LENGTH)
 *  - Create the message entity via MessageRepository
 *  - Create delivery records for every conversation participant except the sender
 *  - Update the conversation's lastMessageAt timestamp
 *  - Broadcast a 'message.created' event on the shared BroadcastChannel
 *  - Mark messages as read and broadcast 'message.status' events
 *  - Delegate message retrieval and unread-count queries to the repositories
 */
export class MessageService {
  /**
   * @param {import('../repositories/messageRepository.js').MessageRepository} messageRepository
   * @param {import('../repositories/messageDeliveryRepository.js').MessageDeliveryRepository} messageDeliveryRepository
   * @param {import('../repositories/conversationRepository.js').ConversationRepository} conversationRepository
   * @param {import('./broadcastService.js').BroadcastService} broadcastService
   */
  constructor(
    messageRepository,
    messageDeliveryRepository,
    conversationRepository,
    broadcastService,
  ) {
    this._messages = messageRepository;
    this._deliveries = messageDeliveryRepository;
    this._conversations = conversationRepository;
    this._broadcast = broadcastService;
  }

  /**
   * Send a message in a conversation.
   *
   * @param {string} conversationId
   * @param {string} senderId
   * @param {string} body
   * @returns {Object} the created message entity
   * @throws {Error} if body is empty or exceeds MAX_MESSAGE_LENGTH
   */
  sendMessage(conversationId, senderId, body) {
    // ── Validation ──────────────────────────────────────────────
    if (!body || body.trim().length === 0) {
      throw new Error('Message body cannot be empty');
    }
    if (body.length > MAX_MESSAGE_LENGTH) {
      throw new Error(
        `Message body must not exceed ${MAX_MESSAGE_LENGTH} characters`,
      );
    }

    // ── Create message ──────────────────────────────────────────
    const message = this._messages.create({
      conversationId,
      senderId,
      body: body.trim(),
      status: 'sent',
    });

    // ── Create delivery records for all participants except sender
    const conv = this._conversations.findById(conversationId);
    if (conv) {
      conv.participantIds.forEach((participantId) => {
        if (participantId !== senderId) {
          this._deliveries.upsert(message.id, participantId, 'sent');
        }
      });
    }

    // ── Update conversation lastMessageAt ───────────────────────
    this._conversations.update(conversationId, {
      lastMessageAt: message.createdAt,
    });

    // ── Broadcast ───────────────────────────────────────────────
    this._broadcast.publish('message.created', {
      message,
      conversationId,
      senderId,
    });

    return message;
  }

  /**
   * Mark a message as read by a specific user.
   *
   * @param {string} userId
   * @param {string} conversationId
   * @param {string} messageId
   */
  markRead(userId, conversationId, messageId) {
    // Update delivery record
    this._deliveries.upsert(messageId, userId, 'read');

    // Broadcast read status
    this._broadcast.publish('message.status', {
      type: 'read',
      userId,
      conversationId,
      messageId,
    });
  }

  /**
   * Retrieve messages for a conversation, newest-first.
   *
   * @param {string} conversationId
   * @param {{ before?: string, limit?: number }} [options]
   * @returns {Object[]}
   */
  getMessages(conversationId, { before, limit } = {}) {
    return this._messages.findByConversation(conversationId, { before, limit });
  }

  /**
   * Get the count of unread messages for a user in a conversation.
   *
   * @param {string} conversationId
   * @param {string} userId
   * @returns {number}
   */
  getUnreadCount(conversationId, userId) {
    return this._deliveries.findUnreadCount(conversationId, userId);
  }
}