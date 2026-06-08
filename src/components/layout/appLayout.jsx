import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from './topNav.jsx';

/**
 * AppLayout — main application layout shell with responsive two-pane design.
 *
 * Desktop (md+): two-pane layout — left pane (w-80) for conversation list,
 * right pane (flex-1) for message thread.
 * Mobile (<md): single pane — toggles between conversation list and message
 * thread via showSidebar state.
 *
 * Uses design-system tokens: bg-bg, bg-surface, border-border, text-text,
 * text-text-muted.
 */
export function AppLayout() {
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  /**
   * When a conversation is selected on mobile, hide the sidebar so the
   * message thread fills the viewport.
   */
  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
    // On mobile: switch to message thread view
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  /**
   * Back button handler — returns to the conversation list on mobile.
   */
  const handleBackToList = () => {
    setActiveConversationId(null);
    setShowSidebar(true);
  };

  return (
    <div className="h-screen flex flex-col bg-bg">
      {/* Top navigation bar */}
      <TopNav />

      {/* Main content area: two-pane on desktop, single-pane on mobile */}
      <div className="flex-1 flex overflow-hidden">
        {/* ================================================================ */}
        {/* Left Pane — Conversation List                                    */}
        {/* ================================================================ */}
        <aside
          className={`
            w-full md:w-80 flex-shrink-0 border-r border-border bg-surface
            ${showSidebar ? 'flex' : 'hidden md:flex'}
            flex-col
          `}
        >
          {/* Pane header */}
          <div className="h-14 flex items-center px-4 border-b border-border">
            <h2 className="text-lg font-semibold text-text">Messages</h2>
          </div>

          {/* Conversation list area — rendered via nested <Outlet> */}
          <div className="flex-1 overflow-y-auto">
            <Outlet context={{ activeConversationId, onSelectConversation: handleSelectConversation }} />
          </div>
        </aside>

        {/* ================================================================ */}
        {/* Right Pane — Message Thread                                      */}
        {/* ================================================================ */}
        <main
          className={`
            flex-1 flex-col bg-bg
            ${showSidebar ? 'hidden md:flex' : 'flex'}
          `}
        >
          {activeConversationId ? (
            /* Active conversation: show back button (mobile) + thread */
            <div className="flex-1 flex flex-col">
              {/* Mobile back button */}
              <div className="md:hidden h-14 flex items-center px-4 border-b border-border bg-surface">
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-accent
                             hover:text-accent-hover transition-colors duration-150
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus
                             focus-visible:ring-offset-2 rounded-lg px-2 py-1"
                  aria-label="Back to conversations"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M19 12H5" />
                    <path d="M12 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>

              {/* Message thread placeholder — will be wired to MessageThread component */}
              <div className="flex-1 flex items-center justify-center text-text-muted">
                <div className="text-center">
                  <p className="text-lg font-medium text-text">
                    Conversation {activeConversationId}
                  </p>
                  <p className="text-sm mt-1 text-text-muted">
                    Message thread will render here
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* No conversation selected: empty state */
            <div className="flex-1 flex items-center justify-center text-text-muted">
              <div className="text-center max-w-sm px-6">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-text-muted"
                    aria-hidden="true"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-text">
                  Welcome to ChatApp Demo
                </p>
                <p className="text-sm mt-1.5 text-text-muted leading-relaxed">
                  Select a conversation from the list or start a new one to
                  begin chatting.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}