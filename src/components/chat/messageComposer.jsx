import { useState, useRef, useCallback, useEffect } from 'react';
import { MAX_MESSAGE_LENGTH } from '../../models/message.js';
import CharCounter from './charCounter.jsx';
import EmojiPicker from './emojiPicker.jsx';

/**
 * MessageComposer — the bottom-bar input area for composing and sending messages.
 *
 * Features:
 *  - Auto-resizing textarea (1 row min, 6 rows max)
 *  - Enter to send, Shift+Enter for newline
 *  - Emoji picker toggle button
 *  - Character counter (red when < 100 remaining)
 *  - Send button (disabled when empty or over limit)
 *  - Debounced onTyping callback (500 ms)
 *
 * @param {{ onSend: (body: string) => void, onTyping: () => void, onEmojiSelect: (emoji: string) => void }} props
 */
export default function MessageComposer({ onSend, onTyping, onEmojiSelect }) {
  const [body, setBody] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);
  const typingTimerRef = useRef(null);

  const remaining = MAX_MESSAGE_LENGTH - body.length;
  const isOverLimit = remaining < 0;
  const isEmpty = body.trim().length === 0;
  const canSend = !isEmpty && !isOverLimit;

  // ── Auto-resize textarea ──────────────────────────────────────
  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;

    // Reset height to compute scrollHeight correctly
    el.style.height = 'auto';

    // Compute line height from computed styles
    const style = window.getComputedStyle(el);
    const lineHeight = parseFloat(style.lineHeight) || 24;
    const maxHeight = lineHeight * 6;

    const newHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${newHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, []);

  // Resize whenever body changes
  useEffect(() => {
    resizeTextarea();
  }, [body, resizeTextarea]);

  // ── Debounced typing broadcast ────────────────────────────────
  const handleChange = useCallback(
    (e) => {
      const value = e.target.value;
      setBody(value);

      // Debounce onTyping
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
      typingTimerRef.current = setTimeout(() => {
        if (onTyping) onTyping();
      }, 500);
    },
    [onTyping],
  );

  // Cleanup typing timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  // ── Key handling ──────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (canSend) {
          onSend(body.trim());
          setBody('');
          // Reset textarea height
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
          }
        }
      }
    },
    [canSend, body, onSend],
  );

  // ── Send button ───────────────────────────────────────────────
  const handleSendClick = useCallback(() => {
    if (canSend) {
      onSend(body.trim());
      setBody('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [canSend, body, onSend]);

  // ── Emoji picker ──────────────────────────────────────────────
  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker((prev) => !prev);
  }, []);

  const handleEmojiSelect = useCallback(
    (emoji) => {
      setBody((prev) => prev + emoji);
      setShowEmojiPicker(false);
      // Focus back on textarea
      textareaRef.current?.focus();
      if (onEmojiSelect) onEmojiSelect(emoji);
    },
    [onEmojiSelect],
  );

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="relative border-t border-border bg-surface p-3">
      {/* Emoji picker popover */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-3 mb-2 z-20">
          <EmojiPicker onSelect={handleEmojiSelect} />
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Emoji toggle button */}
        <button
          type="button"
          onClick={toggleEmojiPicker}
          aria-label={showEmojiPicker ? 'Close emoji picker' : 'Open emoji picker'}
          aria-expanded={showEmojiPicker}
          className={`
            flex-shrink-0 inline-flex items-center justify-center
            w-9 h-9 rounded-xl
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2
            motion-reduce:transition-none
            ${showEmojiPicker
              ? 'bg-accent-muted text-accent'
              : 'text-text-muted hover:text-text hover:bg-surface-2'
            }
          `}
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
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </button>

        {/* Textarea */}
        <div className="flex-1 min-w-0">
          <label htmlFor="message-composer" className="sr-only">
            Type a message
          </label>
          <textarea
            ref={textareaRef}
            id="message-composer"
            rows={1}
            maxLength={MAX_MESSAGE_LENGTH}
            value={body}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className={`
              w-full resize-none rounded-xl
              bg-surface-2
              px-4 py-2.5
              text-base leading-relaxed font-sans
              text-text placeholder:text-text-muted
              ring-1 ring-border
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus
              transition-shadow duration-150
              motion-reduce:transition-none
              ${isOverLimit ? 'ring-danger focus-visible:ring-danger' : ''}
            `}
            style={{ minHeight: '2.75rem', maxHeight: '10rem' }}
          />
        </div>

        {/* Character counter + Send button */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <CharCounter remaining={remaining} />
          <button
            type="button"
            onClick={handleSendClick}
            disabled={!canSend}
            aria-label="Send message"
            className={`
              inline-flex items-center justify-center
              w-9 h-9 rounded-xl
              transition-all duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2
              motion-reduce:transition-none
              ${canSend
                ? 'bg-accent text-accent-fg hover:bg-accent-hover active:scale-[0.97] cursor-pointer'
                : 'bg-surface-3 text-text-muted cursor-not-allowed'
              }
            `}
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
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}