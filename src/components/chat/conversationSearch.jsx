import { useCallback } from 'react';

/**
 * ConversationSearch — search input for filtering the conversation list.
 *
 * Props:
 *   value    (string)           — current search query
 *   onChange (value: string) => void — called on every keystroke
 */
export default function ConversationSearch({ value, onChange }) {
  const handleChange = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <div className="relative w-full">
      {/* Magnifying glass icon */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-text-muted"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* Search input */}
      <label htmlFor="conversation-search" className="sr-only">
        Search conversations
      </label>
      <input
        id="conversation-search"
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Search conversations..."
        autoComplete="off"
        className="
          w-full pl-9 pr-3 py-2
          bg-surface-3 rounded-xl
          text-sm text-text
          placeholder:text-text-muted
          ring-1 ring-border
          focus:ring-2 focus:ring-accent focus:outline-none
          transition-shadow duration-150
          motion-reduce:transition-none
        "
      />
    </div>
  );
}