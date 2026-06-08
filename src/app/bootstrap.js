import { UserRepository } from '../repositories/userRepository.js';
import { ConversationRepository } from '../repositories/conversationRepository.js';
import { MessageRepository } from '../repositories/messageRepository.js';
import { MessageDeliveryRepository } from '../repositories/messageDeliveryRepository.js';
import { BroadcastService } from '../services/broadcastService.js';
import { AuthService } from '../services/authService.js';
import { TypingManager } from '../services/typingManager.js';
import { ReadReceiptManager } from '../services/readReceiptManager.js';
import { PresenceManager } from '../services/presenceManager.js';
import { SeedManager } from '../data/seedManager.js';
import { MessageService } from '../services/messageService.js';

/**
 * createAppContainer — central application bootstrap.
 *
 * Instantiates every persistence, infrastructure, business-logic, and
 * data-seeding module in the correct dependency order and returns a
 * plain object that serves as the application-wide service container.
 *
 * Dependency graph (topological order):
 *   Repositories (no deps)
 *     → BroadcastService (no deps)
 *       → AuthService(userRepository)
 *       → TypingManager(broadcastService)
 *       → ReadReceiptManager(messageRepository, broadcastService, userRepository)
 *       → PresenceManager(broadcastService, userRepository)
 *       → MessageService(messageRepository, messageDeliveryRepository,
 *                        conversationRepository, broadcastService)
 *         → SeedManager(userRepository, conversationRepository, messageRepository)
 *
 * @returns {{
 *   userRepository: UserRepository,
 *   conversationRepository: ConversationRepository,
 *   messageRepository: MessageRepository,
 *   messageDeliveryRepository: MessageDeliveryRepository,
 *   broadcastService: BroadcastService,
 *   authService: AuthService,
 *   typingManager: TypingManager,
 *   readReceiptManager: ReadReceiptManager,
 *   presenceManager: PresenceManager,
 *   messageService: MessageService,
 *   seedManager: SeedManager,
 * }}
 */
export function createAppContainer() {
  // ── Persistence layer ──────────────────────────────────────────
  const userRepository = new UserRepository();
  const conversationRepository = new ConversationRepository();
  const messageRepository = new MessageRepository();
  const messageDeliveryRepository = new MessageDeliveryRepository();

  // ── Infrastructure ─────────────────────────────────────────────
  const broadcastService = new BroadcastService();

  // ── Business logic ─────────────────────────────────────────────
  const authService = new AuthService(userRepository);
  const typingManager = new TypingManager(broadcastService);
  const readReceiptManager = new ReadReceiptManager(
    messageRepository,
    broadcastService,
    userRepository,
  );
  const presenceManager = new PresenceManager(
    broadcastService,
    userRepository,
  );
  const messageService = new MessageService(
    messageRepository,
    messageDeliveryRepository,
    conversationRepository,
    broadcastService,
  );

  // ── Data seeding ───────────────────────────────────────────────
  const seedManager = new SeedManager(
    userRepository,
    conversationRepository,
    messageRepository,
  );

  return {
    userRepository,
    conversationRepository,
    messageRepository,
    messageDeliveryRepository,
    broadcastService,
    authService,
    typingManager,
    readReceiptManager,
    presenceManager,
    messageService,
    seedManager,
  };
}