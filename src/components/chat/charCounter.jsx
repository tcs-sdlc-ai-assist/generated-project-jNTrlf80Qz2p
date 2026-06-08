export function CharCounter({ remaining }) {
  const isLow = remaining < 100;

  return (
    <span
      className={`font-mono text-xs tabular-nums ${isLow ? 'text-danger' : 'text-text-muted'}`}
      aria-live="polite"
      aria-label={`${remaining} characters remaining`}
    >
      {remaining}
    </span>
  );
}

export default CharCounter;