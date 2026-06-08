import { useState, useEffect, useRef, useCallback } from 'react';
import { emojiCategories } from '../../data/emojiData.js';

/**
 * EmojiPicker — popover grid for selecting emojis.
 *
 * Props:
 *   onSelect  (emojiChar: string) => void  — called when user clicks an emoji
 *   onClose   () => void                    — called when user clicks outside
 */
export default function EmojiPicker({ onSelect, onClose }) {
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  // ── Click-outside listener ──────────────────────────────────────
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
      }
    }
    // Use mousedown so we capture before the toggle button re-opens
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  // ── Filter emojis by search ─────────────────────────────────────
  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const query = search.toLowerCase().trim();

  const filteredCategories = query
    ? emojiCategories
        .map((cat) => ({
          ...cat,
          emojis: cat.emojis.filter((emoji) =>
            emoji.toLowerCase().includes(query),
          ),
        }))
        .filter((cat) => cat.emojis.length > 0)
    : emojiCategories;

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="absolute bottom-full mb-2 left-0 bg-surface rounded-2xl ring-1 ring-border shadow-2xl p-3 w-72 max-h-80 overflow-y-auto"
      role="dialog"
      aria-label="Emoji picker"
    >
      {/* Search input */}
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Search emojis..."
        aria-label="Search emojis"
        className="
          text-sm ring-1 ring-border rounded-lg px-3 py-1.5 mb-2 w-full
          bg-surface placeholder:text-text-muted text-text
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus
          transition-shadow duration-150
          motion-reduce:transition-none
        "
      />

      {/* Category sections */}
      {filteredCategories.length === 0 && (
        <p className="text-xs text-text-muted text-center py-4">
          No emojis found
        </p>
      )}

      {filteredCategories.map((category) => (
        <div key={category.name} className="mb-3 last:mb-0">
          <p className="text-xs font-medium text-text-muted uppercase mb-1 tracking-wider">
            {category.name}
          </p>
          <div className="grid grid-cols-8 gap-1">
            {category.emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => onSelect(emoji)}
                aria-label={`Insert ${emoji} emoji`}
                className="
                  w-8 h-8 flex items-center justify-center
                  hover:bg-surface-2 rounded-lg
                  text-lg cursor-pointer
                  transition-colors duration-100
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-1
                  motion-reduce:transition-none
                "
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}