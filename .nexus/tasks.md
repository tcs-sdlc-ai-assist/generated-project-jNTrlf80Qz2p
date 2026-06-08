# Implementation Tasks

<!-- nexus-tasks-version: 1 -->

## T01 — Project Scaffolding & Build Configuration

```nexus-task
{
  "task_id": "T01",
  "title": "Project Scaffolding & Build Configuration",
  "status": "in_progress",
  "depends_on": [],
  "target_files": [
    "package.json",
    "vite.config.js",
    "tailwind.config.js",
    "postcss.config.js",
    "index.html",
    "src/main.jsx",
    "src/index.css"
  ],
  "estimated_complexity": 2,
  "assigned_worker_type": "execution"
}
```

**Description:** Initialize the Vite + React + Tailwind CSS project. Create package.json with all dependencies (react, react-dom, react-router-dom, tailwindcss, postcss, autoprefixer, vite, @vitejs/plugin-react). Configure vite.config.js, tailwind.config.js, postcss.config.js, index.html entry point, and src/main.jsx bootstrap file. Set up the src/ directory structure with empty placeholder directories for components, hooks, services, repositories, utils, and data layers.

**Acceptance:**
- [ ] package.json includes react, react-dom, react-router-dom, tailwindcss, postcss, autoprefixer, vite, @vitejs/plugin-react as dependencies
- [ ] vite.config.js configures the React plugin and sets resolve alias for src/
- [ ] tailwind.config.js sets content paths to scan src/**/*.{js,jsx}
- [ ] postcss.config.js registers tailwindcss and autoprefixer plugins
- [ ] index.html has a root div and script tag pointing to src/main.jsx
- [ ] src/main.jsx renders the App component into the root div
- [ ] src/index.css includes @tailwind base, components, and utilities directives
- [ ] Running npm install && npm run dev starts the Vite dev server without errors

---

## T02 — Core Data Models, Repository Layer & localStorage Persistence

```nexus-task
{
  "task_id": "T02",
  "title": "Core Data Models, Repository Layer & localStorage Persistence",
  "status": "in_progress",
  "depends_on": [
    "T01"
  ],
  "target_files": [
    "src/models/user.js",
    "src/models/conversation.js",
    "src/models/message.js",
    "src/models/messageDelivery.js",
    "src/repositories/userRepository.js",
    "src/repositories/conversationRepository.js",
    "src/repositories/messageRepository.js",
    "src/repositories/messageDeliveryRepository.js",
    "src/utils/piiMasking.js"
  ],
  "estimated_complexity": 4,
  "assigned_worker_type": "execution"
}
```

**Description:** Implement all data model schemas (User, Conversation, Message, MessageDelivery) as plain JS factory/validation functions. Implement the three repository classes — UserRepository, ConversationRepository, MessageRepository — each following the in-memory Map + write-through-to-localStorage pattern. Include the MessageDeliveryRepository for per-recipient delivery/read status tracking. Each repository hydrates from localStorage on construction and synchronously flushes every mutation. Also implement the PIIMaskingUtil (maskEmail function).

**Acceptance:**
- [ ] User model validates required fields: id (uuid), email, password, displayName, createdAt
- [ ] Conversation model validates type field ('direct' or 'group'), name, participantIds array, adminId (for groups), createdAt, lastMessageAt
- [ ] Message model validates id, conversationId, senderId, body (≤4000 chars), createdAt, and status field
- [ ] MessageDelivery model tracks messageId, recipientId, status ('sent'|'delivered'|'read'), and timestamp
- [ ] UserRepository.findByEmail() returns null for unknown email and the correct user for known email
- [ ] UserRepository.create() persists to localStorage under 'chat_app_users' key and returns the created user
- [ ] ConversationRepository.findCanonicalDM(userA, userB) returns the existing DM conversation or null
- [ ] ConversationRepository.addMember() and removeMember() mutate participantIds and flush to localStorage
- [ ] MessageRepository.findByConversation(convId, before, limit) returns paginated messages sorted by createdAt descending
- [ ] MessageDeliveryRepository.findUnreadCount(convId, userId) returns correct integer count
- [ ] All repositories hydrate from localStorage on construction — data survives page reload
- [ ] maskEmail('alice@demo.local') returns 'a***@demo.local'

---

## T03 — BroadcastService & Real-Time Infrastructure

```nexus-task
{
  "task_id": "T03",
  "title": "BroadcastService & Real-Time Infrastructure",
  "status": "in_progress",
  "depends_on": [
    "T02"
  ],
  "target_files": [
    "src/services/broadcastService.js",
    "src/services/typingManager.js",
    "src/services/readReceiptManager.js",
    "src/services/presenceManager.js",
    "src/data/seedManager.js"
  ],
  "estimated_complexity": 4,
  "assigned_worker_type": "execution"
}
```

**Description:** Implement the BroadcastService class that wraps the BroadcastChannel API on channel 'chat-app-demo'. Support typed event publish/subscribe for five event types: message.created, message.status, typing.start, typing.stop, presence.update. Implement the TypingManager (3-second auto-clear timer), ReadReceiptManager (monotonic last_read_message_id advancement), and PresenceManager (heartbeat-based online/offline). Also implement the SeedManager that auto-populates 3-5 demo users, 2-3 pre-built conversations, and 5-15 sample messages per conversation on first load when localStorage is empty.

**Acceptance:**
- [ ] BroadcastService constructor creates a BroadcastChannel named 'chat-app-demo'
- [ ] BroadcastService.publish(type, payload) posts a structured message to the channel
- [ ] BroadcastService.subscribe(type, handler) registers a listener that fires on matching event types
- [ ] BroadcastService.unsubscribe(type, handler) removes the listener
- [ ] BroadcastService.close() closes the underlying BroadcastChannel
- [ ] TypingManager.startTyping(userId, conversationId) broadcasts typing.start and sets a 3-second auto-clear timer
- [ ] TypingManager.stopTyping(userId, conversationId) broadcasts typing.stop and clears the timer
- [ ] ReadReceiptManager.markRead(userId, conversationId, messageId) updates last_read_message_id monotonically and broadcasts message.status
- [ ] PresenceManager broadcasts presence.update on connect/disconnect and tracks online users
- [ ] SeedManager seeds exactly 3-5 demo users with @demo.local emails and fictional names when localStorage has no 'chat_app_users' key
- [ ] SeedManager seeds 2-3 conversations with 5-15 messages each, all with obviously fake content
- [ ] SeedManager is idempotent — does not re-seed if data already exists

---

## T04 — AuthService, Auth Context & Session Management

```nexus-task
{
  "task_id": "T04",
  "title": "AuthService, Auth Context & Session Management",
  "status": "in_progress",
  "depends_on": [
    "T02",
    "T03"
  ],
  "target_files": [
    "src/services/authService.js",
    "src/contexts/authContext.jsx",
    "src/components/auth/protectedRoute.jsx"
  ],
  "estimated_complexity": 3,
  "assigned_worker_type": "execution"
}
```

**Description:** Implement the AuthService class that orchestrates registration, login, logout, and session lifecycle. Implement the useAuth React hook and AuthContext provider. Implement the ProtectedRoute guard component. Wire everything together so the app reads the session flag on init and routes accordingly. All console.log calls must use PIIMaskingUtil for email fields.

**Acceptance:**
- [ ] AuthService.register(email, password, displayName) validates email uniqueness, creates user via UserRepository, sets currentUser session flag in localStorage, and returns the User
- [ ] AuthService.register() throws with message 'Email already registered' when email exists
- [ ] AuthService.login(email, password) validates credentials against UserRepository, sets currentUser session flag, and returns the User
- [ ] AuthService.login() throws with message 'Invalid email or password' on mismatch
- [ ] AuthService.logout() removes the currentUser key from localStorage
- [ ] AuthService.getCurrentUser() returns the User if session flag is valid, null otherwise
- [ ] useAuth hook exposes { user, isAuthenticated, login, register, logout }
- [ ] ProtectedRoute redirects to /login via <Navigate> when no valid session exists
- [ ] ProtectedRoute renders children when a valid session exists
- [ ] All console.log statements in AuthService mask email addresses using maskEmail()

---

## T05 — Authentication UI — Login, Registration & Demo User One-Click

```nexus-task
{
  "task_id": "T05",
  "title": "Authentication UI \u2014 Login, Registration & Demo User One-Click",
  "status": "in_progress",
  "depends_on": [
    "T04"
  ],
  "target_files": [
    "src/pages/loginPage.jsx",
    "src/pages/registerPage.jsx",
    "src/components/auth/loginForm.jsx",
    "src/components/auth/registerForm.jsx",
    "src/components/auth/demoUserList.jsx"
  ],
  "estimated_complexity": 3,
  "assigned_worker_type": "execution"
}
```

**Description:** Build the full authentication UI: LoginPage with email/password form, inline error display, demo-user quick-login buttons, and the demo hint text. RegistrationPage with email, password, display name fields, inline error for duplicate email, and auto-login on success. Both pages use Tailwind CSS for responsive styling. Wire forms to the useAuth hook.

**Acceptance:**
- [ ] LoginPage renders email and password inputs with a submit button
- [ ] Submitting valid credentials calls auth.login() and redirects to /chat
- [ ] Submitting invalid credentials shows inline error 'Invalid email or password'
- [ ] LoginPage shows hint text: 'Demo credentials — use any email/password to register, or select a pre-loaded user.'
- [ ] DemoUserList renders clickable buttons for each seeded demo user
- [ ] Clicking a demo user button calls auth.login() with that user's credentials and redirects to /chat
- [ ] RegistrationPage renders email, password, and display name inputs
- [ ] Submitting a new email calls auth.register() and redirects to /chat
- [ ] Submitting an already-registered email shows inline error 'Email already registered'
- [ ] All forms are responsive from 360px to 1920px viewport widths

---

## T06 — App Routing, Layout Shell & Navigation

```nexus-task
{
  "task_id": "T06",
  "title": "App Routing, Layout Shell & Navigation",
  "status": "in_progress",
  "depends_on": [
    "T04"
  ],
  "target_files": [
    "src/app.jsx",
    "src/components/layout/appLayout.jsx",
    "src/components/layout/topNav.jsx",
    "src/components/layout/mobileBackButton.jsx"
  ],
  "estimated_complexity": 3,
  "assigned_worker_type": "execution"
}
```

**Description:** Implement the top-level App component with React Router routes: /login, /register, /chat (protected), and a catch-all redirect. Build the main AppLayout shell with a responsive two-pane layout (conversation list left, message thread right). Include the top navigation bar with current user display, settings icon placeholder, and logout button. On mobile (<768px), show only one pane at a time with a back button.

**Acceptance:**
- [ ] Navigating to / when unauthenticated redirects to /login
- [ ] Navigating to /chat when unauthenticated redirects to /login
- [ ] Navigating to /chat when authenticated renders the AppLayout
- [ ] AppLayout shows a left pane (conversation list) and right pane (message thread) on screens ≥768px
- [ ] AppLayout shows only one pane at a time on screens <768px with a back button to switch
- [ ] TopNav displays the current user's display name and a logout button
- [ ] Clicking logout calls auth.logout() and redirects to /login
- [ ] Catch-all unknown routes redirect to /login (if unauthenticated) or /chat (if authenticated)

---

## T07 — MessageService & Message Composition Pipeline

```nexus-task
{
  "task_id": "T07",
  "title": "MessageService & Message Composition Pipeline",
  "status": "in_progress",
  "depends_on": [
    "T02",
    "T03"
  ],
  "target_files": [
    "src/services/messageService.js"
  ],
  "estimated_complexity": 3,
  "assigned_worker_type": "execution"
}
```

**Description:** Implement the MessageService class that orchestrates the full message-send pipeline: validate body length (≤4000 chars), create message via MessageRepository, create delivery records for all recipients via MessageDeliveryRepository, update conversation lastMessageAt, broadcast message.created event, and return the created message. Also implement the markRead flow with monotonic last_read_message_id.

**Acceptance:**
- [ ] MessageService.sendMessage(conversationId, senderId, body) throws if body is empty or exceeds 4000 characters
- [ ] MessageService.sendMessage() creates a Message with status 'sent' and persists it
- [ ] MessageService.sendMessage() creates MessageDelivery records for every conversation participant except the sender
- [ ] MessageService.sendMessage() updates the conversation's lastMessageAt timestamp
- [ ] MessageService.sendMessage() broadcasts a message.created event via BroadcastService
- [ ] MessageService.markRead(userId, conversationId, messageId) updates the delivery record to 'read'
- [ ] MessageService.markRead() broadcasts a message.status event
- [ ] MessageService.markRead() does not regress last_read_message_id (monotonic enforcement)

---

## T08 — Conversation List Pane — UI, Sorting, Unread Badges & Search

```nexus-task
{
  "task_id": "T08",
  "title": "Conversation List Pane \u2014 UI, Sorting, Unread Badges & Search",
  "status": "in_progress",
  "depends_on": [
    "T06",
    "T07"
  ],
  "target_files": [
    "src/components/chat/conversationList.jsx",
    "src/components/chat/conversationRow.jsx",
    "src/components/chat/conversationSearch.jsx",
    "src/components/chat/newConversationModal.jsx",
    "src/hooks/useConversations.js"
  ],
  "estimated_complexity": 4,
  "assigned_worker_type": "execution"
}
```

**Description:** Build the ConversationList component that displays all conversations for the current user sorted by lastMessageAt descending. Each row shows: conversation name (or participant name for DMs), last message preview (truncated to ~50 chars), relative timestamp, and unread count badge. Include a search/filter input that filters conversations by name or participant name. Include a 'New Conversation' button that opens the NewConversationModal. Wire to ConversationRepository and MessageDeliveryRepository for data.

**Acceptance:**
- [ ] ConversationList renders all conversations for the current user sorted by lastMessageAt descending
- [ ] Each ConversationRow shows the conversation name (group name or other participant's displayName for DMs)
- [ ] Each ConversationRow shows the last message body truncated to ~50 characters with ellipsis
- [ ] Each ConversationRow shows a relative timestamp (e.g., '2m ago', '1h ago')
- [ ] Each ConversationRow shows an unread count badge (number of messages with status != 'read' for current user)
- [ ] ConversationSearch filters the list in real-time as the user types
- [ ] Clicking 'New Conversation' opens the NewConversationModal
- [ ] NewConversationModal lists all users except the current user with checkboxes for group creation
- [ ] Selecting one user and clicking 'Start Chat' creates or reuses a DM conversation and navigates to it
- [ ] Selecting 2+ users, entering a group name, and clicking 'Create Group' creates a group conversation
- [ ] useConversations hook returns { conversations, loading, error } and re-renders on localStorage change
- [ ] Conversation list loads in under 1 second with seeded data

---

## T09 — Message Thread Pane — Messages, Date Separators, Delivery Status & Typing Indicators

```nexus-task
{
  "task_id": "T09",
  "title": "Message Thread Pane \u2014 Messages, Date Separators, Delivery Status & Typing Indicators",
  "status": "in_progress",
  "depends_on": [
    "T06",
    "T07"
  ],
  "target_files": [
    "src/components/chat/messageThread.jsx",
    "src/components/chat/messageBubble.jsx",
    "src/components/chat/dateSeparator.jsx",
    "src/components/chat/typingIndicator.jsx",
    "src/components/chat/deliveryStatusIcon.jsx",
    "src/hooks/useMessages.js",
    "src/hooks/useTypingIndicator.js"
  ],
  "estimated_complexity": 4,
  "assigned_worker_type": "execution"
}
```

**Description:** Build the MessageThread component that displays messages for the active conversation with date separators between days. Each message bubble shows: sender avatar/initial, sender name (in groups), body text, timestamp, and delivery status icon (single-check for sent, double-check for delivered, blue double-check for read). Include the typing indicator bar that shows '[User] is typing...' when a typing.start event is received. Implement infinite scroll upward to load older messages. Wire to MessageRepository, ReadReceiptManager, TypingManager, and BroadcastService.

**Acceptance:**
- [ ] MessageThread displays all messages for the active conversation in chronological order
- [ ] DateSeparator appears between messages sent on different calendar days (e.g., 'Today', 'Yesterday', 'Mar 15')
- [ ] MessageBubble shows the sender's initial avatar for group chats
- [ ] MessageBubble shows the sender's display name above the bubble in group chats
- [ ] MessageBubble shows the message body text with preserved whitespace and line breaks
- [ ] MessageBubble shows a timestamp (HH:MM format)
- [ ] DeliveryStatusIcon shows a single gray check for 'sent', double gray checks for 'delivered', double blue checks for 'read'
- [ ] DeliveryStatusIcon only appears on messages sent by the current user
- [ ] TypingIndicator shows '[DisplayName] is typing...' with animated dots when typing.start is received
- [ ] TypingIndicator clears after 3 seconds of no typing.start events for that user
- [ ] Scrolling to the top of the thread loads older messages (pagination via before cursor)
- [ ] useMessages hook returns { messages, loading, hasMore, loadMore }
- [ ] useTypingIndicator hook returns { typingUsers: string[] } for the active conversation

---

## T10 — Message Composer — Input, Emoji Picker & Send

```nexus-task
{
  "task_id": "T10",
  "title": "Message Composer \u2014 Input, Emoji Picker & Send",
  "status": "in_progress",
  "depends_on": [
    "T07"
  ],
  "target_files": [
    "src/components/chat/messageComposer.jsx",
    "src/components/chat/emojiPicker.jsx",
    "src/components/chat/charCounter.jsx",
    "src/data/emojiData.js",
    "src/hooks/useEmojiPicker.js"
  ],
  "estimated_complexity": 3,
  "assigned_worker_type": "execution"
}
```

**Description:** Build the MessageComposer component with a textarea input (auto-resizing, max 4000 chars), a character counter, an emoji picker button that opens an emoji popover grid, and a send button. The emoji picker includes a searchable grid of common emojis organized by category (smileys, gestures, objects, symbols). Implement keyboard shortcut: Enter sends, Shift+Enter inserts newline. Wire to MessageService.sendMessage().

**Acceptance:**
- [ ] MessageComposer renders a textarea that auto-resizes between 1 and 6 lines
- [ ] Character counter shows remaining characters out of 4000; turns red when <100 remain
- [ ] Typing in the textarea broadcasts typing.start events (debounced at 500ms) for the active conversation
- [ ] Pressing Enter (without Shift) sends the message and clears the textarea
- [ ] Pressing Shift+Enter inserts a newline without sending
- [ ] Send button is disabled when textarea is empty or exceeds 4000 characters
- [ ] Clicking the emoji button toggles the EmojiPicker popover
- [ ] EmojiPicker displays emojis in categorized sections: Smileys & People, Animals & Nature, Food & Drink, Activities, Travel & Places, Objects, Symbols, Flags
- [ ] EmojiPicker includes a search input that filters emojis by name
- [ ] Clicking an emoji inserts it at the cursor position in the textarea
- [ ] Clicking outside the EmojiPicker closes it
- [ ] Sending a message calls MessageService.sendMessage() and the message appears in the thread immediately

---

## T11 — Group Chat Management — Rename, Members List, Add/Remove Members

```nexus-task
{
  "task_id": "T11",
  "title": "Group Chat Management \u2014 Rename, Members List, Add/Remove Members",
  "status": "in_progress",
  "depends_on": [
    "T06",
    "T07"
  ],
  "target_files": [
    "src/components/chat/groupInfoPanel.jsx",
    "src/components/chat/memberList.jsx",
    "src/components/chat/memberRow.jsx",
    "src/components/chat/addMemberModal.jsx",
    "src/hooks/useGroupManagement.js"
  ],
  "estimated_complexity": 3,
  "assigned_worker_type": "execution"
}
```

**Description:** Build the GroupInfo panel (accessible from the conversation header) that shows the group name (editable by admin), member list with roles (admin/member), and add/remove member controls. Only the admin can rename the group or remove members. Removed members retain read-only access to history. Wire to ConversationRepository and BroadcastService for cross-tab sync.

**Acceptance:**
- [ ] GroupInfoPanel is accessible from the conversation header for group-type conversations
- [ ] Group name is displayed as an editable field for the admin; clicking it allows inline editing
- [ ] Non-admin users see the group name as read-only text
- [ ] MemberList shows all members with their display name, avatar initial, and role badge (Admin/Member)
- [ ] Admin sees a remove button (X icon) next to each non-admin member
- [ ] Clicking remove shows a confirmation dialog; confirming removes the member from participantIds
- [ ] Removed members can still see the conversation in their list with read-only history
- [ ] Admin sees an 'Add Member' button that opens AddMemberModal
- [ ] AddMemberModal lists users not currently in the group; selecting one adds them
- [ ] All group mutations (rename, add member, remove member) broadcast via BroadcastService for cross-tab sync
- [ ] useGroupManagement hook returns { group, isAdmin, renameGroup, addMember, removeMember }

---

## T12 — Conversation Header — Info, Presence & Settings

```nexus-task
{
  "task_id": "T12",
  "title": "Conversation Header \u2014 Info, Presence & Settings",
  "status": "in_progress",
  "depends_on": [
    "T06",
    "T03"
  ],
  "target_files": [
    "src/components/chat/conversationHeader.jsx",
    "src/components/chat/presenceIndicator.jsx",
    "src/hooks/usePresence.js"
  ],
  "estimated_complexity": 2,
  "assigned_worker_type": "execution"
}
```

**Description:** Build the ConversationHeader component that appears at the top of the message thread pane. For DMs: shows the other user's display name, presence indicator (green dot for online, gray for offline), and a link to open group info (for groups). For groups: shows group name, member count, and a button to open GroupInfoPanel. Include the strategic UI hint about single-browser limitation.

**Acceptance:**
- [ ] ConversationHeader displays the conversation name (other user's displayName for DMs, group name for groups)
- [ ] For DMs: PresenceIndicator shows a green dot when the other user is online, gray when offline
- [ ] For groups: ConversationHeader shows member count (e.g., '5 members')
- [ ] For groups: A gear/info icon button opens the GroupInfoPanel
- [ ] A subtle info tooltip or text reads: '💡 Open another browser tab as a different user to see real-time messaging in action'
- [ ] usePresence hook returns { isOnline: boolean } for a given userId based on BroadcastService presence events

---

## T13 — Notifications — Toast System & Unread Badge Aggregation

```nexus-task
{
  "task_id": "T13",
  "title": "Notifications \u2014 Toast System & Unread Badge Aggregation",
  "status": "in_progress",
  "depends_on": [
    "T06",
    "T03"
  ],
  "target_files": [
    "src/components/notifications/toastContainer.jsx",
    "src/components/notifications/toast.jsx",
    "src/contexts/notificationContext.jsx",
    "src/hooks/useNotifications.js",
    "src/hooks/useDocumentTitle.js"
  ],
  "estimated_complexity": 3,
  "assigned_worker_type": "execution"
}
```

**Description:** Build a toast notification system that displays temporary notifications for new messages when the user is viewing a different conversation. Implement the NotificationContext and useNotifications hook. Also implement the browser tab title unread count badge (e.g., '(3) ChatApp Demo'). Wire to BroadcastService message.created events.

**Acceptance:**
- [ ] ToastContainer renders in a fixed position (bottom-right on desktop, top on mobile)
- [ ] When a message.created event arrives for a conversation other than the active one, a toast appears with sender name and message preview
- [ ] Toast auto-dismisses after 5 seconds or on click
- [ ] Toast shows the conversation name; clicking it navigates to that conversation
- [ ] Multiple toasts stack vertically with a max of 3 visible at once
- [ ] Document title updates to '(N) ChatApp Demo' where N is total unread messages across all conversations
- [ ] Document title reverts to 'ChatApp Demo' when unread count is 0
- [ ] useNotifications hook exposes { notifications, addNotification, dismissNotification, clearAll }
- [ ] useDocumentTitle hook updates document.title reactively based on unread count

---

## T14 — App Bootstrap, Container Wiring & Initialization

```nexus-task
{
  "task_id": "T14",
  "title": "App Bootstrap, Container Wiring & Initialization",
  "status": "in_progress",
  "depends_on": [
    "T02",
    "T03",
    "T04",
    "T07"
  ],
  "target_files": [
    "src/app/bootstrap.js",
    "src/contexts/appContainerContext.jsx",
    "src/app/initialization.js",
    "src/utils/featureDetect.js",
    "src/utils/quotaMonitor.js"
  ],
  "estimated_complexity": 3,
  "assigned_worker_type": "execution"
}
```

**Description:** Implement the central app bootstrap module (createAppContainer) that instantiates all services and repositories with correct dependency injection order. Implement the AppContainerContext provider. Wire the initialization sequence: feature-detect localStorage/BroadcastChannel, seed demo data if needed, read session, and render the app. Include the localStorage quota monitor and graceful degradation for missing BroadcastChannel.

**Acceptance:**
- [ ] createAppContainer() instantiates all modules in correct dependency order: UserRepository → ConversationRepository → MessageRepository → BroadcastService → AuthService → TypingManager → ReadReceiptManager → PresenceManager → SeedManager → MessageService
- [ ] AppContainerContext.Provider wraps the app and makes the container available via useAppContainer() hook
- [ ] initialization.js runs featureDetect.localStorage() — if false, renders a full-screen 'localStorage required' message
- [ ] initialization.js runs featureDetect.broadcastChannel() — if false, sets a flag that disables cross-tab features gracefully
- [ ] initialization.js calls SeedManager.seedIfNeeded() before rendering
- [ ] initialization.js reads the currentUser session flag and sets initial auth state
- [ ] quotaMonitor.js estimates localStorage usage and console.warns when >80% of 5MB quota
- [ ] quotaMonitor.js provides a trimOldestMessages() fallback that removes oldest messages when writes fail

---

## T15 — Settings Page & Cross-Tab Demo Hint

```nexus-task
{
  "task_id": "T15",
  "title": "Settings Page & Cross-Tab Demo Hint",
  "status": "in_progress",
  "depends_on": [
    "T06",
    "T14"
  ],
  "target_files": [
    "src/pages/settingsPage.jsx",
    "src/components/settings/profileCard.jsx",
    "src/components/settings/storageUsage.jsx"
  ],
  "estimated_complexity": 2,
  "assigned_worker_type": "execution"
}
```

**Description:** Build a simple Settings page accessible from the top nav. Shows the current user's profile info (display name, masked email), a theme toggle placeholder (light/dark — can be cosmetic only), and the strategic demo hint explaining the single-browser multi-tab demo workflow. Include localStorage usage stats from quotaMonitor.

**Acceptance:**
- [ ] SettingsPage is accessible via a gear icon in the TopNav
- [ ] ProfileCard shows the current user's display name and masked email (e.g., 'a***@demo.local')
- [ ] StorageUsage shows current localStorage usage in KB/MB and a progress bar
- [ ] StorageUsage shows a warning color when usage exceeds 80%
- [ ] SettingsPage includes a demo hint section: 'This is a browser-only demo. Open a second tab, log in as a different user, and watch messages appear in real-time via BroadcastChannel.'
- [ ] SettingsPage has a back button or navigation to return to /chat

---

## T16 — Vercel Deployment Configuration & Final Wiring

```nexus-task
{
  "task_id": "T16",
  "title": "Vercel Deployment Configuration & Final Wiring",
  "status": "in_progress",
  "depends_on": [
    "T01",
    "T14"
  ],
  "target_files": [
    "vercel.json",
    ".gitignore",
    "README.md"
  ],
  "estimated_complexity": 1,
  "assigned_worker_type": "execution"
}
```

**Description:** Add Vercel deployment configuration (vercel.json with SPA rewrite rules). Add the final .gitignore. Ensure the build produces a valid dist/ directory. Add README.md with setup instructions, demo usage guide, and technology stack overview. Verify all imports are correct and the app builds without errors.

**Acceptance:**
- [ ] vercel.json includes rewrites rule: { 'source': '/(.*)', 'destination': '/index.html' } for SPA routing
- [ ] .gitignore includes node_modules/, dist/, .env, and OS files
- [ ] README.md includes: project description, tech stack, setup instructions (npm install && npm run dev), demo usage guide (open two tabs, log in as different users), and build/deploy instructions
- [ ] Running npm run build produces a dist/ directory with index.html and assets
- [ ] Running npm run preview serves the built app correctly

---
