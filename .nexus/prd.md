# Chat Application (Static Frontend Demo)

**Type**: web_app
**Audience**: B2C — Friends/small groups (casual users chatting 1:1 or in small groups), Office teams (coworkers coordinating informally), Developers (technical users who value reliable real-time delivery and keyboard-friendly UI). All users are simulated authenticated via mocked localStorage login. Demo user personas are pre-populated with obviously fake data for immediate testing.

## Business Context
A static frontend demo of a real-time chat application that lets users exchange text messages in 1:1 and group conversations through a responsive web interface. This is a client-side-only simulation — all data is stored in the browser, all real-time events are simulated via BroadcastChannel API, and all authentication is mocked. No backend server, database, or external services are involved. The goal is to demonstrate the core chat UX: presence, typing indicators, read receipts, emoji, search, and notifications — all running entirely in the browser.

## Functional Requirements

### FR-001 — Mocked Email/Password Registration [Pipeline-aligned]
Users can register with an email and password through a mocked UI. Credentials are stored in localStorage. No real validation, no JWT, no server. [Clarified] [Pipeline-aligned]
**Priority**: must_have | **Complexity**: low | **Source**: original_prd
**Acceptance Criteria**:
  - User fills in email, password, and display name fields and submits the registration form.
  - Credentials are persisted to localStorage under a 'users' key.
  - User is automatically logged in after successful registration (session flag set in localStorage).
  - Registration with an already-existing email shows an inline error message.
  - All mock data uses obviously fake values: emails use @demo.local or @example.local domains; passwords are simple demo strings like 'demo123'; display names are fictional like 'Alice Demo'.

### FR-002 — Mocked Email/Password Login [Pipeline-aligned]
Users can log in with email and password. Credentials are checked against localStorage data. On success, a session flag is stored in localStorage. [Clarified] [Pipeline-aligned]
**Priority**: must_have | **Complexity**: low | **Source**: original_prd
**Acceptance Criteria**:
  - User enters email and password and submits the login form.
  - Credentials are validated against localStorage 'users' data.
  - On success, a session flag (e.g., 'currentUser') is written to localStorage.
  - On failure, an inline error message is displayed ('Invalid email or password').
  - Below the login form, a hint is displayed: 'Demo credentials — use any email/password to register, or select a pre-loaded user.' [Pipeline-aligned]

### FR-003 — Pre-Provisioned Demo Users [Auto-filled]
On first load (when localStorage is empty), the app auto-seeds 3-5 demo users with obviously fake credentials so testers can immediately log in without registering. [Auto-filled]
**Priority**: must_have | **Complexity**: low | **Source**: default_assumption
**Acceptance Criteria**:
  - When localStorage has no 'users' key, the app seeds 3-5 demo users.
  - Each demo user has a fictional display name (e.g., 'Alice Demo', 'Bob Test'), an email at @demo.local, and a simple password like 'demo123'.
  - Demo users appear as clickable buttons on the login screen for one-click login.
  - Demo users are also available in the 'New Conversation' user picker.

### FR-004 — Session Persistence Across Reloads [Auto-filled]
The user's authenticated session persists across browser page reloads via a localStorage token flag. [Auto-filled]
**Priority**: must_have | **Complexity**: low | **Source**: default_assumption
**Acceptance Criteria**:
  - After login, refreshing the page does not redirect to the login screen.
  - The session flag ('currentUser') is read from localStorage on app initialization.
  - If the session flag is present and valid (references an existing user in localStorage), the user is taken directly to the main chat interface.

### FR-005 — Logout [Auto-filled]
Logout clears the session flag from localStorage and redirects to the login screen. [Auto-filled]
**Priority**: must_have | **Complexity**: low | **Source**: default_assumption
**Acceptance Criteria**:
  - Clicking logout removes the 'currentUser' key from localStorage.
  - After logout, the user is redirected to the login screen.
  - The conversation list and message data remain in localStorage (not cleared on logout) so another user can log in on the same browser.

### FR-006 — Unauthenticated Access Redirect
Any attempt to access the main chat interface without a valid session redirects to the login screen.
**Priority**: must_have | **Complexity**: low | **Source**: original_prd
**Acceptance Criteria**:
  - Navigating to any app route (e.g., /chat, /settings) without a session flag redirects to /login.
  - After login, the user is redirected to the main chat interface.
  - Direct URL manipulation cannot bypass the auth guard.

### FR-007 — PII Fields Inventory and Masking [Auto-filled]
All mock user data must use obviously fake values. Console/debug logging must not output PII fields unmasked. [Auto-filled]
**Priority**: must_have | **Complexity**: low | **Source**: default_assumption
**Acceptance Criteria**:
  - Emails use @demo.local or @example.local domains only.
  - Passwords are simple demo strings: 'demo123', 'password' — never real passwords.
  - Display names are fictional: 'Alice Demo', 'Bob Test', etc.
  - No real email addresses, phone numbers, or personally identifiable information appear anywhere in the codebase or mock data.
  - Console.log statements do not output email or password fields; if needed for debugging, values are masked (e.g., 'a***@demo.local').

### FR-008 — Direct Messages (1:1) [Pipeline-aligned]
A user can start a conversation with exactly one other user. Starting a DM with an existing contact reuses the existing conversation (no duplicates). Messages are persisted in localStorage and broadcast via BroadcastChannel. [Pipeline-aligned]
**Priority**: must_have | **Complexity**: medium | **Source**: original_prd
**Acceptance Criteria**:
  - User selects another user from the 'New Conversation' modal to start a DM.
  - If a DM conversation already exists between the two users, the existing conversation is opened (no duplicate).
  - Messages sent in the DM appear immediately in the local UI and are broadcast to other tabs via BroadcastChannel.
  - Both participants see the same message thread (verified in multi-tab demo).

### FR-009 — Group Chats [Pipeline-aligned]
A user can create a group, give it a name, and add/remove members. The creator is admin; members have a member role. Only admins can rename or remove members. Group data is stored in localStorage and changes are broadcast via BroadcastChannel. [Pipeline-aligned]
**Priority**: must_have | **Complexity**: medium | **Source**: original_prd
**Acceptance Criteria**:
  - User clicks 'New Group', names the group, and selects at least 2 other members (total ≥ 3 including creator).
  - Group appears in the conversation list for all members (via BroadcastChannel in multi-tab demo).
  - Only the admin can rename the group or remove members.
  - Removed members stop receiving new messages but retain read-only access to history up to the point of removal.
  - First message sent to the group is delivered to all members.

### FR-010 — Conversation List [Pipeline-aligned]
Left pane lists the user's conversations, sorted by most recent activity. Each row shows name/participant, last message preview, timestamp, and unread badge. Data is read from localStorage. [Pipeline-aligned]
**Priority**: must_have | **Complexity**: medium | **Source**: original_prd
**Acceptance Criteria**:
  - Conversations are sorted in descending order by last_message_at timestamp.
  - Each row displays: conversation name (or participant name for DMs), last message preview (truncated), relative timestamp, and unread count badge.
  - A new incoming message moves its conversation to the top of the list and increments the unread count.
  - Clicking a conversation opens it in the right pane (desktop) or navigates to it (mobile).
  - Conversation list loads in under 1 second from localStorage.

### FR-011 — Send Plain-Text Messages [Pipeline-aligned]
Users can send plain-text messages up to 4,000 characters. Messages appear immediately in the local UI and are persisted to localStorage and broadcast via BroadcastChannel API. [Pipeline-aligned]
**Priority**: must_have | **Complexity**: medium | **Source**: original_prd
**Acceptance Criteria**:
  - User types a message in the composer and presses Enter or clicks Send.
  - Blank or whitespace-only messages are rejected client-side with an inline hint.
  - Messages exceeding 4,000 characters are blocked with a clear error message.
  - Sent message appears immediately in the local message thread.
  - Message is persisted to localStorage under the conversation's message list.
  - Message is broadcast to other tabs via BroadcastChannel ('message.created' event).
  - Message display p95 latency is under 500ms for local updates.

### FR-012 — Message Grouping with Date Separators and Timestamps
Messages in a conversation are grouped under date separators (e.g., 'Today', 'Yesterday', 'Jan 15, 2025') and each message displays its timestamp.
**Priority**: must_have | **Complexity**: low | **Source**: original_prd
**Acceptance Criteria**:
  - Messages from the same calendar date are grouped under a single date separator.
  - Date separators use relative labels where appropriate: 'Today', 'Yesterday', and absolute dates for older messages.
  - Each message bubble displays the time (e.g., '10:32 AM').
  - Date separators and timestamps are consistent across all tabs viewing the same conversation.

### FR-013 — Typing Indicators [Pipeline-aligned]
While a user types, other participants see '{name} is typing…'. Typing state is broadcast via BroadcastChannel API and auto-clears after 3 seconds of inactivity or on send. [Pipeline-aligned]
**Priority**: should_have | **Complexity**: medium | **Source**: original_prd
**Acceptance Criteria**:
  - Typing indicator appears within 1 second of the user starting to type.
  - Indicator displays the typing user's display name: '{name} is typing…'.
  - Indicator auto-clears after 3 seconds of inactivity (no keystrokes).
  - Indicator clears immediately when the user sends the message.
  - Typing state is broadcast via BroadcastChannel ('typing.start' / 'typing.stop' events).
  - Multiple users typing simultaneously shows all their names (e.g., 'Alice and Bob are typing…').

### FR-014 — Delivery and Read Receipts [Pipeline-aligned]
Each message shows status: sent → delivered → read. Read state is per recipient. In groups, 'read by' reflects how many/which members have read. Users can disable read receipts in settings (reciprocal: if you turn yours off, you don't see others'). Status updates are broadcast via BroadcastChannel. [Pipeline-aligned]
**Priority**: must_have | **Complexity**: high | **Source**: original_prd
**Acceptance Criteria**:
  - Sent message shows a single checkmark (sent).
  - When the recipient's tab receives the message via BroadcastChannel, status advances to double checkmark (delivered).
  - When the recipient views the message in the conversation, status advances to blue double checkmark (read).
  - In groups, read receipts show 'Read by N/M' or list reader names.
  - Disabling read receipts in Settings hides the user's own read status from others AND hides others' read status from the user (reciprocal).
  - Status updates are broadcast via BroadcastChannel ('message.status' event).
  - last_read_message_id only moves forward (monotonic) to prevent race conditions.

### FR-015 — Presence (Online / Offline / Last Seen) [Pipeline-aligned]
Show each user's status: online, offline, or last seen {time}. Presence is simulated: the current tab's user is 'online'; other simulated users' presence is managed via BroadcastChannel heartbeats and localStorage timestamps. [Pipeline-aligned]
**Priority**: should_have | **Complexity**: medium | **Source**: original_prd
**Acceptance Criteria**:
  - Current tab's logged-in user is always shown as 'online' (green dot).
  - Other users' presence is determined by BroadcastChannel heartbeats: online if heartbeat received within last 10 seconds.
  - Status flips to online within 2 seconds of a user's tab connecting.
  - Status flips to offline within 30 seconds of a user's tab disconnecting (heartbeat timeout).
  - Offline users show 'last seen {relative time}' based on their last heartbeat timestamp in localStorage.
  - Presence indicator is visible in conversation headers and user lists.

### FR-016 — Emoji Picker
An emoji picker in the message composer inserts emoji into message text. Emoji render correctly for sender and recipients.
**Priority**: should_have | **Complexity**: low | **Source**: original_prd
**Acceptance Criteria**:
  - Clicking the emoji icon in the composer opens an emoji picker panel.
  - Selecting an emoji inserts it at the cursor position in the message text.
  - Emoji render correctly in the composer, in sent messages, and in received messages.
  - Emoji picker supports common emoji categories (smileys, gestures, objects, symbols).
  - Emoji are transmitted as part of the plain-text message content via BroadcastChannel.

### FR-017 — Unread Badges and In-App Notifications [Pipeline-aligned]
Per-conversation unread counts and a global unread total. In-app toast/notification for new messages when the relevant conversation isn't focused. Opening a conversation marks it read and clears its badge. [Pipeline-aligned]
**Priority**: must_have | **Complexity**: medium | **Source**: original_prd
**Acceptance Criteria**:
  - Each conversation in the list shows an unread count badge (number of messages since last_read_message_id).
  - A global unread total is displayed (e.g., in the app header or favicon badge).
  - When a new message arrives for a conversation that is not currently focused, an in-app toast notification appears.
  - Clicking the toast or opening the conversation clears its unread badge.
  - Unread counts are accurate across multiple conversations and reset to zero when the conversation is viewed.
  - Unread counts persist across page reloads (derived from localStorage data).

### FR-018 — Message Search [Pipeline-aligned]
Search the user's messages by text, filterable by sender and date range. Search runs against localStorage message data (client-side filtering). Results link to the message in context. [Pipeline-aligned]
**Priority**: should_have | **Complexity**: medium | **Source**: original_prd
**Acceptance Criteria**:
  - User enters a search query in the search bar.
  - Search filters messages across all conversations the user belongs to.
  - Results are filterable by sender (dropdown of conversation participants) and date range (from/to date pickers).
  - Each result shows: message preview with highlighted matching text, sender name, conversation name, and timestamp.
  - Clicking a result navigates to the message in its conversation context.
  - Search runs entirely client-side against localStorage data; no network requests.
  - Empty query or no results shows an appropriate empty state message.

### FR-019 — Responsive Web UI [Pipeline-aligned]
Layout adapts from desktop (two-pane) to mobile (single-pane with back navigation). Built with Tailwind CSS utility classes. Usable at widths from 360px to 1920px. [Pipeline-aligned]
**Priority**: must_have | **Complexity**: high | **Source**: original_prd
**Acceptance Criteria**:
  - Desktop (≥768px): left pane shows conversation list; right pane shows active conversation. Both visible simultaneously.
  - Mobile (<768px): single pane shows either conversation list or active conversation with back button navigation.
  - No horizontal scrolling or broken layouts at any width between 360px and 1920px.
  - Touch targets are at least 44x44px on mobile.
  - All interactive elements are accessible via keyboard navigation.
  - Composer, emoji picker, and modals adapt appropriately to viewport size.

### FR-020 — Pre-Seeded Demo Conversations and Messages [Auto-filled]
On first load (when localStorage is empty), the app auto-seeds 2-3 conversations with sample messages so the chat experience is immediately demonstrable. [Auto-filled]
**Priority**: must_have | **Complexity**: medium | **Source**: default_assumption
**Acceptance Criteria**:
  - When localStorage has no 'conversations' key, the app seeds 2-3 conversations (at least one DM and one group).
  - Each conversation contains 5-15 sample messages with varied timestamps spanning recent time periods.
  - Sample messages use obviously fake content (e.g., 'Hey, how's the demo going?', 'Loving the new chat app!').
  - Pre-seeded conversations appear in the conversation list immediately after first login.
  - Unread badges on pre-seeded conversations reflect messages the logged-in user hasn't 'read' yet.

### FR-021 — Multi-Tab Real-Time Demo [Auto-filled]
The app supports a multi-tab demo scenario where a user opens the app in two browser tabs, logs in as different users in each tab, and chats between tabs in real time via BroadcastChannel. [Auto-filled]
**Priority**: should_have | **Complexity**: medium | **Source**: default_assumption
**Acceptance Criteria**:
  - Opening the app in two tabs and logging in as different users allows real-time message exchange between tabs.
  - Typing indicators, presence updates, read receipts, and unread badges update live across tabs.
  - The BroadcastChannel is named 'chat-app-demo' and carries all real-time events.
  - A hint is displayed in the conversation header: 'Multi-tab demo: open another tab to chat as a different user.'
  - In single-tab mode (no BroadcastChannel peers), the app functions fully with graceful degradation of real-time features.

### FR-022 — Settings — Read Receipts Toggle
Users can access a Settings screen to toggle read receipts on/off. The toggle is reciprocal: disabling hides the user's read status from others and hides others' read status from the user.
**Priority**: should_have | **Complexity**: low | **Source**: original_prd
**Acceptance Criteria**:
  - Settings screen is accessible from the main interface (e.g., gear icon or user menu).
  - Read receipts toggle defaults to 'enabled' for all users.
  - Toggling off updates the user's read_receipts_enabled field in localStorage.
  - When disabled: the user's messages do not show read status to other participants; the user does not see read status on others' messages.
  - Toggle change is broadcast via BroadcastChannel so other tabs update immediately.
  - Settings screen displays: 'Data stored in your browser's localStorage only. Clearing browser data will reset the app.' [Auto-filled]

### FR-023 — localStorage Quota Warning [Auto-filled]
When localStorage approaches its quota (~5MB), the app displays a warning to the user. Oldest messages may be trimmed. [Auto-filled]
**Priority**: nice_to_have | **Complexity**: medium | **Source**: default_assumption
**Acceptance Criteria**:
  - App estimates localStorage usage on each write operation.
  - When usage exceeds ~4MB (80% of 5MB quota), a non-blocking warning banner is displayed.
  - Warning suggests the user clear old conversations or notes that oldest messages may be automatically trimmed.
  - If a localStorage write fails due to quota exceeded, the app displays an error toast and gracefully degrades (new messages may not be persisted).

### FR-024 — Mock UI Hints [Auto-filled]
Strategic UI hints inform users that this is a demo application with mocked functionality. [Auto-filled]
**Priority**: should_have | **Complexity**: low | **Source**: default_assumption
**Acceptance Criteria**:
  - Login screen displays: 'This is a demo — use any email/password or select a pre-loaded user.'
  - Conversation header displays: 'Multi-tab demo: open another tab to chat as a different user.'
  - Settings screen displays: 'Data stored in your browser's localStorage only. Clearing browser data will reset the app.'
  - Hints are styled subtly (e.g., muted text, info icon) and do not interfere with primary UI interactions.

## Non-Functional Requirements

### NFR-001 — performance
Message display latency: sent messages must appear in the local UI with p95 latency under 500ms. [Pipeline-aligned]
**Target**: < 500ms p95 for local message display

### NFR-002 — performance
Conversation list load time: the conversation list must load and render in under 1 second when read from localStorage. [Pipeline-aligned]
**Target**: < 1s for conversation list load from localStorage

### NFR-003 — reliability
No message loss within a browser session: every accepted message must be persisted to localStorage before being displayed in the UI. [Auto-filled]
**Target**: 100% of accepted messages persisted to localStorage before UI display

### NFR-004 — reliability
localStorage write success rate: localStorage write operations should succeed at a rate of ≥ 99.99% under normal conditions. [Auto-filled]
**Target**: ≥ 99.99% localStorage write success rate

### NFR-005 — scalability
Simulated conversations support up to 100 members. localStorage capacity limits total message history to approximately 5-10MB. [Auto-filled]
**Target**: Up to 100 members per group conversation; ~5-10MB localStorage capacity

### NFR-006 — security
Passwords stored in localStorage are plaintext (not hashed). This is a demo only and must be clearly documented as insecure. All data is local to the browser; no network transmission occurs. [Pipeline-aligned]
**Target**: Documented as insecure demo; no network transmission of credentials

### NFR-007 — compatibility
The application must function correctly on the latest 2 versions of Chrome, Firefox, Safari, and Edge. BroadcastChannel API must be available (supported in all modern browsers).
**Target**: Latest 2 versions of Chrome, Firefox, Safari, Edge; BroadcastChannel API required

### NFR-008 — usability
Crash-free session rate target: ≥ 99.5% of user sessions should complete without an unhandled JavaScript exception.
**Target**: ≥ 99.5% crash-free sessions

### NFR-009 — usability
Activation metric: ≥ 60% of demo users should send at least one message within a session.
**Target**: ≥ 60% activation rate (first message sent)

## Tech Stack
- **Frontend**: Vite + React JS (JavaScript/JSX) + Tailwind CSS [Pipeline-aligned]
- **Backend**: None — all operations are mock functions [Pipeline-aligned]
- **Database**: localStorage (browser) with in-memory repository pattern [Pipeline-aligned]
- **Infrastructure**: Static hosting (Vercel-compatible) [Pipeline-aligned]
- *Specified by user*: True

## In Scope
- Mocked email/password registration and login with localStorage persistence
- Pre-provisioned demo users for immediate testing
- Session persistence across page reloads via localStorage token flag
- Logout clearing session flag; unauthenticated access redirects to login
- 1:1 direct messages with canonical conversation reuse (no duplicates)
- Group chats with admin/member roles, naming, add/remove members
- Conversation list sorted by most recent activity with unread badges
- Send plain-text messages (max 4,000 characters) with immediate local UI update
- Messages persisted in localStorage and broadcast via BroadcastChannel API
- Message grouping under date separators with timestamps
- Typing indicators broadcast via BroadcastChannel (auto-clear after 3s inactivity)
- Delivery and read receipts per recipient with reciprocal opt-out
- Presence simulation (online/offline/last seen) via BroadcastChannel heartbeats and localStorage timestamps
- Emoji picker in message composer
- Per-conversation unread counts and global unread total with in-app toast notifications
- Message search by text, sender, and date range against localStorage (client-side filtering)
- Responsive web UI (360px–1920px) with two-pane desktop and single-pane mobile layouts
- Settings screen with read receipts toggle
- Pre-seeded demo conversations and messages on first load
- Multi-tab real-time demo via BroadcastChannel API
- localStorage quota warning when approaching ~5MB
- Mock UI hints indicating demo nature of the application
- In-memory repository pattern syncing to localStorage on every write
- Static hosting (Vercel-compatible)

## Out of Scope
- Voice/video calls
- Message editing/deletion
- File/image attachments
- End-to-end encryption (E2EE)
- Public communities
- Moderation tooling
- Real backend infrastructure (Node, Rails, Go, etc.)
- Real authentication (JWT, OAuth, SSO, token validation)
- Real WebSocket servers
- Real databases (PostgreSQL, MySQL, etc.)
- Push notifications / email notifications
- Password hashing (bcrypt/argon2)
- TLS / server-side security headers
- 10k concurrent connections / server uptime guarantees (99.9%)
- Anonymous access (all users must be authenticated, even if mocked)
- Self-DM or adding self to a group

## Assumptions
- BroadcastChannel API is available in all target browsers (Chrome, Firefox, Safari, Edge latest 2 versions).
- localStorage quota of ~5-10MB is sufficient for demo purposes with pre-seeded data and moderate usage.
- Users will open multiple browser tabs to experience real-time features; single-tab mode degrades gracefully.
- Demo users and pre-seeded data provide sufficient onboarding experience for evaluators.
- Plaintext password storage in localStorage is acceptable for a demo (clearly documented as insecure).
- Reference date of 2025-01-15 is used for all relative date calculations in mock data and token expiry simulations.
- No network transmission occurs — all data remains local to the browser.
- The app is fully self-contained with no external service dependencies.

## Constraints
- Static frontend only — Vite + React JS (JavaScript/JSX, no TypeScript) + Tailwind CSS [Pipeline-aligned]
- No backend server — all operations are mock functions reading/writing localStorage [Pipeline-aligned]
- No real database — localStorage with in-memory repository pattern [Pipeline-aligned]
- No real WebSocket server — BroadcastChannel API for cross-tab real-time simulation [Pipeline-aligned]
- No TypeScript — JavaScript/JSX only [Pipeline-aligned]
- No file uploads in v1.0
- No external services — fully self-contained static frontend
- Static hosting (Vercel-compatible)
- All mock data must use obviously fake PII values (see PII fields inventory)
- Reference date: 2025-01-15 for relative date calculations [Auto-filled]
- Maximum message length: 4,000 characters
- localStorage capacity: approximately 5-10MB per origin

## Additional Context
## Data Model [Pipeline-aligned]

All data is stored in localStorage as JSON. The data layer uses an in-memory repository pattern that syncs to localStorage on every write.

### Entities

**User**
- id, display_name, email, password (plaintext — demo only), avatar_url, presence (online|offline), last_seen_at, read_receipts_enabled (bool), created_at

**Conversation**
- id, type (direct|group), name (nullable for direct), created_by, created_at, last_message_at

**ConversationMember**
- id, conversation_id, user_id, role (admin|member), joined_at, last_read_message_id (nullable)

**Message**
- id, conversation_id, sender_id, content (text), created_at

**MessageDelivery** (per recipient status)
- id, message_id, recipient_id, status (delivered|read), updated_at

> Read receipts are derived from ConversationMember.last_read_message_id and/or MessageDelivery. Unread counts = messages newer than a member's last_read_message_id.

### Mock Data Operations (client-side only)

```
// Auth (mocked — localStorage)
mockAuth.register(email, password, displayName)  → stores user in localStorage
mockAuth.login(email, password)                   → checks localStorage, sets session flag
mockAuth.logout()                                 → clears session flag

// Conversations (localStorage)
mockConversations.list(userId)                    → reads from localStorage, sorted by last_message_at
mockConversations.create(type, participants, name)
mockConversations.get(id)
mockConversations.update(id, data)                // rename (admin only)
mockConversations.addMember(convId, userId)       // admin only
mockConversations.removeMember(convId, userId)    // admin only

// Messages (localStorage)
mockMessages.list(convId, before, limit)          → paginated from localStorage
mockMessages.send(convId, senderId, content)      → persists to localStorage, broadcasts via BroadcastChannel
mockMessages.markRead(convId, userId, messageId)  → updates last_read_message_id

// Search (client-side filter)
mockSearch.messages(userId, query, sender, from, to) → filters localStorage messages

// Users (localStorage)
mockUsers.get(userId)
mockUsers.update(userId, data)                    // update profile, read_receipts_enabled
```

### Real-time Simulation (BroadcastChannel events) [Pipeline-aligned]

Instead of WebSocket events, the app uses the BroadcastChannel API to communicate between browser tabs:

```
→ message.created        // new message broadcast to other tabs
→ message.status         // delivered / read updates broadcast
→ typing.start / typing.stop  // typing state broadcast
→ presence.update        // online / offline / last_seen broadcast
→ conversation.updated   // rename, membership change, unread change broadcast
```

**Multi-tab demo architecture:** Each browser tab acts as a separate "client." The BroadcastChannel named `chat-app-demo` carries all real-time events between tabs. This allows a single user to open two tabs, log in as different users, and see real-time chat behavior.

## UI Screens

**Tech Stack:** Vite + React JS (JavaScript/JSX only, no TypeScript) + Tailwind CSS. [Pipeline-aligned]

- **Auth:** register / login — with pre-populated demo user buttons for quick access. [Pipeline-aligned]
- **Main (two-pane desktop):** left = conversation list with search + unread badges; right = active conversation (message thread, date separators, status ticks, typing indicator, presence in header).
- **Composer:** text input, emoji picker, send button.
- **New conversation modal:** pick user (DM) or name + members (group).
- **Settings:** profile, toggle read receipts.
- **Mobile:** single pane; list ↔ thread with back navigation.

## User Flows

**Onboarding**
1. User opens the app → 2. sees login screen with pre-populated demo users → 3. selects a demo user or registers with fake credentials → 4. lands in app → 5. sees pre-seeded conversations or empty conversation list with "Start a chat" prompt.

**Send a 1:1 message**
1. User opens/creates a DM → 2. types (recipient sees typing via BroadcastChannel) → 3. sends → 4. message appears for both (local + BroadcastChannel); status goes sent → delivered → read.

**Create a group**
1. User clicks "New group" → 2. names it, selects members → 3. group appears for all members (via BroadcastChannel) → 4. first message delivered to everyone.

**Catch up after being offline**
1. User opens the app → 2. conversation list loads from localStorage with unread badges → 3. opens a conversation → 4. sees missed messages in order; badge clears.

**Multi-tab real-time demo**
1. Open the app in two browser tabs → 2. log in as different users in each tab → 3. chat between tabs in real time via BroadcastChannel → 4. observe typing indicators, presence, read receipts, and unread badges updating live.

## Edge Cases

- **Empty message:** blank/whitespace-only sends are rejected client-side.
- **Over-length message:** >4,000 chars blocked with a clear error.
- **Recipient offline:** message persists in localStorage; delivered status set when recipient's tab loads and reads from localStorage.
- **Duplicate DM:** opening a chat with an existing contact reuses the canonical conversation.
- **Removed from group:** user keeps history visible up to removal but receives no new messages.
- **Self-DM / adding self to a group:** disallowed.
- **Large conversation list / long history:** list and messages are paginated from localStorage.
- **Race on read receipts:** last_read_message_id only moves forward (monotonic).
- **Tab close / no BroadcastChannel:** app functions fully in single-tab mode; real-time features degrade gracefully (no cross-tab updates).
- **localStorage full:** app displays a warning when storage approaches quota (~5MB); oldest messages may be trimmed.
- **First load / empty localStorage:** app auto-seeds demo data (users, conversations, messages) so the experience is immediately usable.

## Metrics

- **Activation:** % of demo users who send a first message within a session (target ≥ 60%).
- **Engagement:** D7 retention not applicable (static demo); session duration and messages/session tracked locally.
- **Reliability:** message persistence success rate (localStorage write success ≥ 99.99%); message display latency (target < 500 ms).
- **Performance:** conversation list load p95 (target < 1 s from localStorage).
- **Quality:** crash-free sessions (target ≥ 99.5%).

## PII Fields Inventory [Auto-filled]

| Field | Masking Strategy |
|---|---|
| email | Use obviously fake domains: @demo.local, @example.local |
| password | Use simple demo strings: demo123, password — never real passwords |
| display_name | Use fictional names: "Alice Demo", "Bob Test" |

All mock data must use obviously fake values. Console/debug logging must not output PII fields unmasked.

## Open Questions (resolved for v1.0)

| Question | Decision |
|---|---|
| Should users log in? | Yes — mocked email/password, stored in localStorage. [Pipeline-aligned] |
| Group support? | Yes — named groups with admin/member roles. |
| Read receipts? | Yes — with a reciprocal opt-out. |
| Message editing/deletion? | Deferred to Phase 2. |
| Attachments/media? | Deferred to Phase 2. |
| Notifications? | In-app + unread badges in v1.0; push/email in Phase 2. |
| Encryption (E2EE)? | Deferred; v1.0 is a static demo with no network transmission. |
| Voice/video calls? | Out of scope for v1.0. |
| Real-time transport? | BroadcastChannel API for multi-tab demo; no WebSocket server. [Pipeline-aligned] |
| Data persistence? | localStorage with in-memory repository pattern. [Pipeline-aligned] |
| Backend/API? | None — all operations are mock functions reading/writing localStorage. [Pipeline-aligned] |

## Timeline

To be determined during HLD/LLD phase based on requirements.