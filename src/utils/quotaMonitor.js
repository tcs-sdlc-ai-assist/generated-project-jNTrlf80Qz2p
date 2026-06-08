/**
 * localStorage Quota Monitor
 *
 * Estimates localStorage usage and warns when approaching the ~5 MB
 * per-origin quota typical of modern browsers.  Because the true quota
 * is not exposed via the Storage API we use a conservative 5 MB estimate
 * and flag usage above 80 %.
 *
 * @module quotaMonitor
 */

const ESTIMATED_QUOTA = 5 * 1024 * 1024; // 5 MB (conservative)
const WARNING_THRESHOLD = 0.8; // 80 %

/**
 * Walk every key in localStorage and return the estimated byte count.
 *
 * JavaScript stores strings as UTF-16, so each character occupies
 * roughly 2 bytes.  This is a close-enough approximation for quota
 * monitoring; the actual serialised size may differ slightly.
 *
 * @returns {number} Estimated bytes used.
 */
export function estimateUsage() {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    total += (key ? key.length : 0) + (value ? value.length : 0);
  }
  return total * 2;
}

/**
 * Return a human-readable usage snapshot.
 *
 * @returns {{
 *   usedBytes: number,
 *   usedKB: number,
 *   usedMB: string,
 *   percentUsed: number,
 *   isWarning: boolean,
 *   quotaBytes: number,
 * }} Usage statistics.
 */
export function getUsageStats() {
  const used = estimateUsage();
  const percentUsed = (used / ESTIMATED_QUOTA) * 100;
  const isWarning = used > ESTIMATED_QUOTA * WARNING_THRESHOLD;

  return {
    usedBytes: used,
    usedKB: Math.round(used / 1024),
    usedMB: (used / (1024 * 1024)).toFixed(2),
    percentUsed: Math.round(percentUsed),
    isWarning,
    quotaBytes: ESTIMATED_QUOTA,
  };
}

/**
 * Check current quota usage and emit a console warning when the
 * warning threshold is exceeded.
 *
 * @returns {ReturnType<typeof getUsageStats>} Usage statistics.
 */
export function checkQuota() {
  const stats = getUsageStats();
  if (stats.isWarning) {
    console.warn(
      `localStorage usage at ${stats.percentUsed}% ` +
        `(${stats.usedMB} MB / ~5 MB). Consider clearing old data.`,
    );
  }
  return stats;
}