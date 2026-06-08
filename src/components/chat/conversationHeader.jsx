import { useState, useCallback, useRef, useEffect } from 'react';
import PresenceIndicator from './presenceIndicator.jsx';

/**
 * Extracts the first character of a display name for the avatar initial.
 * Falls back to "?" for empty / missing names.
 *
 * @param {string} name
 * @returns {string} Single uppercase character.
 */
function getInitial(name) {
  if (!name || typeof name !== 'string') return '?';
  const trimmed = name.trim();
  if (trimmed.length === 0) return '?';
  return trimmed.charAt(0).toUpperCase();
}

/**
 * ConversationHeader — top bar of the message thread pane.
 *
 * Displays:
 *  - Avatar initial + conversation name
 *  - For DMs: PresenceIndicator (green/gray dot) + "Online" / "Offline" text
 *  - For groups: member count text ("N members")
 *  - Gear/info button for groups (opens GroupInfoPanel via onOpenGroupInfo)
 *  - Demo hint tooltip: info icon with tooltip about multi-tab demo
 *
 * @param {{
 *   conversation: object,
 *   otherUser: object | null,
 *   isOnline: boolean,
 *   memberCount: number,
 *   onOpenGroupInfo: () => void,
 * }} props
 */
export default function ConversationHeader({
  conversation,
  otherUser,
  isOnline,
  memberCount,
  onOpenGroupInfo,
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);
  const tooltipTriggerRef = useRef(null);

  // ── Close tooltip on outside click ──────────────────────────────
  const handleClickOutside = useCallback((e) => {
    if (
      tooltipRef.current &&
      !tooltipRef.current.contains(e.target) &&
      tooltipTriggerRef.current &&
      !tooltipTriggerRef.current.contains(e.target)
    ) {
      setShowTooltip(false);
    }
  }, []);

  useEffect(() => {
    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip, handleClickOutside]);

  // ── Close tooltip on Escape ─────────────────────────────────────
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setShowTooltip(false);
    }
  }, []);

  useEffect(() => {
    if (showTooltip) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showTooltip, handleKeyDown]);

  // ── Derived values ──────────────────────────────────────────────
  const isGroup = conversation?.type === 'group';
  const displayName = isGroup
    ? conversation?.name || 'Group'
    : otherUser?.displayName || 'Unknown';
  const initial = getInitial(displayName);

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div className="h-14 border-b border-border bg-surface px-4 flex items-center justify-between flex-shrink-0">
      {/* ── Left: avatar + name + presence/group info ─────────────── */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Avatar circle */}
        <div
          className="
            w-9 h-9 rounded-full
            bg-accent-muted text-accent
            flex items-center justify-center
            text-sm font-semibold
            flex-shrink-0
          "
          aria-hidden="true"
        >
          {initial}
        </div>

        {/* Name + sub-info */}
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-text truncate">
            {displayName}
          </h1>

          {/* Sub-info row */}
          <div className="flex items-center gap-1.5">
            {isGroup ? (
              /* ── Group: member count ──────────────────────────── */
              <span className="text-xs text-text-muted">
                {memberCount != null
                  ? `${memberCount} member${memberCount !== 1 ? 's' : ''}`
                  : 'Group'}
              </span>
            ) : (
              /* ── DM: presence indicator + status text ─────────── */
              <>
                <PresenceIndicator isOnline={isOnline} />
                <span className="text-xs text-text-muted">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Right: actions ────────────────────────────────────────── */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Demo hint tooltip */}
        <div className="relative">
          <button
            ref={tooltipTriggerRef}
            type="button"
            onClick={() => setShowTooltip((prev) => !prev)}
            aria-label="Demo information"
            aria-expanded={showTooltip}
            className="
              inline-flex items-center justify-center
              w-8 h-8 rounded-xl
              text-text-muted
              hover:text-text hover:bg-surface-2
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2
              motion-reduce:transition-none
              cursor-pointer
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </button>

          {/* Tooltip popover */}
          {showTooltip && (
            <div
              ref={tooltipRef}
              role="tooltip"
              className="
                absolute right-0 top-full mt-2 z-30
                w-64
                bg-surface
                rounded-2xl
                ring-1 ring-border
                shadow-lg
                p-4
                text-sm text-text
                leading-relaxed
              "
            >
              <div className="flex items-start gap-2">
                {/* Info icon in tooltip */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-accent flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <p>
                  Multi-tab demo: open another tab to chat as a different user.
                </p>
              </div>

              {/* Arrow pointer */}
              <div
                className="
                  absolute -top-1.5 right-3
                  w-3 h-3
                  bg-surface
                  rotate-45
                  border-l border-t border-border
                "
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        {/* Gear button — groups only */}
        {isGroup && (
          <button
            type="button"
            onClick={onOpenGroupInfo}
            aria-label="Open group info"
            className="
              inline-flex items-center justify-center
              w-8 h-8 rounded-xl
              text-text-muted
              hover:text-text hover:bg-surface-2
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2
              motion-reduce:transition-none
              cursor-pointer
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}