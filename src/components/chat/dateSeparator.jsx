/**
 * DateSeparator — renders a centered date label with horizontal rules
 * between message groups in a conversation thread.
 *
 * The label is computed upstream by messageThread's formatDateLabel()
 * and passed directly as a string prop.
 *
 * @param {{ label: string }} props
 */
export default function DateSeparator({ label }) {
  return (
    <div className="flex items-center gap-3 py-3" role="separator" aria-label={label}>
      <div className="flex-1 h-px bg-border" aria-hidden="true" />
      <span className="text-xs font-medium text-text-muted uppercase tracking-wider whitespace-nowrap select-none">
        {label}
      </span>
      <div className="flex-1 h-px bg-border" aria-hidden="true" />
    </div>
  );
}