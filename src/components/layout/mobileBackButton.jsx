export function MobileBackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors py-2"
      aria-label="Back to conversations"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 3L5 8l5 5" />
      </svg>
      Back
    </button>
  );
}