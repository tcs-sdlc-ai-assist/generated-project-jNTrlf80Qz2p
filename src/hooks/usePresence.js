import { useState, useEffect } from 'react';

/**
 * usePresence — polls the PresenceManager every 2 seconds for the online
 * status of the given userId.
 *
 * @param {import('../services/presenceManager').PresenceManager} presenceManager
 * @param {string} userId
 * @returns {{ isOnline: boolean }}
 */
export function usePresence(presenceManager, userId) {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!userId) {
      setIsOnline(false);
      return;
    }

    const check = () => setIsOnline(presenceManager.isOnline(userId));
    check();

    const interval = setInterval(check, 2000);
    return () => clearInterval(interval);
  }, [presenceManager, userId]);

  return { isOnline };
}