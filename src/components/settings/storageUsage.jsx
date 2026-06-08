import { useState, useEffect } from 'react';
import { getUsageStats } from '../../utils/quotaMonitor.js';

/**
 * StorageUsage — displays current localStorage usage with a progress bar.
 *
 * Reads usage statistics from the quotaMonitor utility on mount and
 * renders a card with a progress bar, usage text, and a warning when
 * usage exceeds 80 % of the estimated 5 MB quota.
 */
export default function StorageUsage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setStats(getUsageStats());
  }, []);

  // ── Loading state (stats not yet computed) ──────────────────────
  if (!stats) {
    return (
      <div className="bg-surface rounded-2xl ring-1 ring-border p-6">
        <h3 className="text-lg font-semibold text-text">Storage Usage</h3>
        <div className="mt-4 space-y-3 animate-pulse">
          <div className="h-2 rounded-full bg-surface-3" />
          <div className="h-4 w-3/4 rounded bg-surface-3" />
        </div>
      </div>
    );
  }

  const { usedMB, percentUsed, isWarning } = stats;
  const clampedPercent = Math.min(percentUsed, 100);

  return (
    <div className="bg-surface rounded-2xl ring-1 ring-border p-6">
      {/* ── Title ──────────────────────────────────────────────── */}
      <h3 className="text-lg font-semibold text-text">Storage Usage</h3>

      {/* ── Progress bar ───────────────────────────────────────── */}
      <div className="mt-4 h-2 rounded-full bg-surface-3 overflow-hidden">
        <div
          role="progressbar"
          aria-valuenow={clampedPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Storage usage: ${clampedPercent}%`}
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isWarning ? 'bg-danger' : 'bg-accent'
          }`}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>

      {/* ── Usage text ─────────────────────────────────────────── */}
      <p className="mt-3 text-sm text-text-muted tabular-nums">
        {usedMB} MB of ~5 MB used ({clampedPercent}%)
      </p>

      {/* ── Warning banner ─────────────────────────────────────── */}
      {isWarning && (
        <div
          role="alert"
          className="mt-4 rounded-xl bg-danger-bg px-4 py-3 text-sm text-danger font-medium"
        >
          Storage usage is high ({clampedPercent}%). Consider clearing old
          conversations or data to stay within the ~5 MB localStorage quota.
        </div>
      )}
    </div>
  );
}