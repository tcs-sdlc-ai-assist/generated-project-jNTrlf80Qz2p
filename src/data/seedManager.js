/**
 * SeedManager — auto-populates demo data on first load.
 *
 * Responsibilities:
 *  - Check whether demo data already exists (idempotent guard).
 *  - Seed 5 demo users via UserRepository.seedDemoUsers().
 *  - Create 3 conversations: 2 direct messages + 1 group.
 *  - Populate each conversation with realistic demo messages.
 *  - Update lastMessageAt on every seeded conversation.
 *
 * All mutations flow through the repository layer, which
 * persists to localStorage on every write.
 */

export class SeedManager {
  /**
   * @param {import('../repositories/userRepository.js').UserRepository} userRepository
   * @param {import('../repositories/conversationRepository.js').ConversationRepository} conversationRepository
   * @param {import('../repositories/messageRepository.js').MessageRepository} messageRepository
   */
  constructor(userRepository, conversationRepository, messageRepository) {
    this._users = userRepository;
    this._conversations = conversationRepository;
    this._messages = messageRepository;
  }

  /**
   * Seeds demo data if the user store is empty.
   *
   * Idempotent: if any users already exist the method returns
   * `false` immediately without touching existing data.
   *
   * @returns {boolean} `true` if data was seeded, `false` if already populated.
   */
  seedIfNeeded() {
    // ── Idempotency guard ──────────────────────────────────────
    if (this._users.count() > 0) return false;

    // ── Seed demo users ────────────────────────────────────────
    this._users.seedDemoUsers();
    const allUsers = this._users.findAll();

    if (allUsers.length < 3) return false;

    const [alice, bob, charlie, diana] = allUsers;

    // ── Seed conversations ─────────────────────────────────────
    // DM 1: Alice <-> Bob
    const dm1 = this._conversations.create({
      type: 'direct',
      createdBy: alice.id,
      participantIds: [alice.id, bob.id],
    });

    // Group: Alice, Bob, Charlie
    const group1 = this._conversations.create({
      type: 'group',
      name: 'Demo Team',
      createdBy: alice.id,
      participantIds: [alice.id, bob.id, charlie.id],
      adminId: alice.id,
    });

    // DM 2: Alice <-> Charlie
    const dm2 = this._conversations.create({
      type: 'direct',
      createdBy: alice.id,
      participantIds: [alice.id, charlie.id],
    });

    // ── Seed messages ──────────────────────────────────────────
    const dm1Messages = [
      { senderId: alice.id, body: "Hey Bob! How's the demo going?", minutesAgo: 120 },
      { senderId: bob.id, body: 'Going great! The real-time features are impressive.', minutesAgo: 118 },
      { senderId: alice.id, body: 'Right? The BroadcastChannel API is perfect for this.', minutesAgo: 115 },
      { senderId: bob.id, body: 'Have you tried the multi-tab demo yet?', minutesAgo: 60 },
      { senderId: alice.id, body: 'Not yet — let me open another tab and log in as Charlie.', minutesAgo: 58 },
      { senderId: bob.id, body: "Cool, I'll stay in this tab. Send me a message from the other one!", minutesAgo: 55 },
      { senderId: alice.id, body: 'Testing cross-tab messaging... did you get this?', minutesAgo: 30 },
      { senderId: bob.id, body: 'Yes! Received instantly. The typing indicator works too.', minutesAgo: 29 },
      { senderId: alice.id, body: 'This is going to make a great demo. The UI feels really polished.', minutesAgo: 10 },
      { senderId: bob.id, body: 'Agreed! Love the amber accent and Geist font.', minutesAgo: 5 },
    ];

    const group1Messages = [
      { senderId: alice.id, body: 'Welcome to the Demo Team, everyone!', minutesAgo: 180 },
      { senderId: bob.id, body: 'Thanks for setting this up, Alice!', minutesAgo: 178 },
      { senderId: charlie.id, body: 'Hey team! Excited to test the group chat features.', minutesAgo: 175 },
      { senderId: alice.id, body: "Let's go through the feature checklist: DMs, groups, typing indicators, read receipts, emoji picker, and search.", minutesAgo: 170 },
      { senderId: bob.id, body: "The typing indicator is working — I can see when you're composing a message.", minutesAgo: 90 },
      { senderId: charlie.id, body: "Read receipts are showing too. I can see who's read each message.", minutesAgo: 88 },
      { senderId: alice.id, body: 'Don\'t forget to try the emoji picker! 😊', minutesAgo: 45 },
      { senderId: bob.id, body: 'Nice! The emoji renders perfectly in the message thread.', minutesAgo: 44 },
    ];

    const dm2Messages = [
      { senderId: charlie.id, body: 'Hey Alice, quick question about the project structure.', minutesAgo: 240 },
      { senderId: alice.id, body: "Sure, what's up?", minutesAgo: 238 },
      { senderId: charlie.id, body: 'Are we using an in-memory repository pattern with localStorage?', minutesAgo: 235 },
      { senderId: alice.id, body: 'Yes! Write-through on every mutation. Data survives page reloads.', minutesAgo: 230 },
      { senderId: charlie.id, body: 'Perfect. That\'s exactly what I needed to know. Thanks!', minutesAgo: 200 },
    ];

    /**
     * Helper: bulk-insert messages for a conversation with
     * backdated `createdAt` timestamps.
     *
     * @param {string} convId
     * @param {{ senderId: string, body: string, minutesAgo: number }[]} messages
     */
    const seedMessages = (convId, messages) => {
      const now = Date.now();
      messages.forEach(({ senderId, body, minutesAgo }) => {
        const createdAt = new Date(now - minutesAgo * 60 * 1000).toISOString();
        this._messages.create({ conversationId: convId, senderId, body, createdAt });
      });
    };

    seedMessages(dm1.id, dm1Messages);
    seedMessages(group1.id, group1Messages);
    seedMessages(dm2.id, dm2Messages);

    // ── Update lastMessageAt on each conversation ──────────────
    /**
     * Helper: sets `lastMessageAt` to the most recent message's
     * `createdAt` for the given conversation.
     *
     * @param {string} convId
     */
    const updateLastMessage = (convId) => {
      const msgs = this._messages.findByConversation(convId, { limit: 1 });
      if (msgs.length > 0) {
        this._conversations.update(convId, { lastMessageAt: msgs[0].createdAt });
      }
    };

    updateLastMessage(dm1.id);
    updateLastMessage(group1.id);
    updateLastMessage(dm2.id);

    return true;
  }
}