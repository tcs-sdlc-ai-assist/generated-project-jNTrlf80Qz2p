import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const NotificationContext = createContext(null);

/**
 * NotificationProvider — wraps the application tree with notification state.
 *
 * Notifications are ephemeral UI messages (success, error, info, warning)
 * that auto-dismiss or are manually dismissed. The provider keeps at most
 * 3 notifications in the queue; older ones are dropped when a new one arrives.
 *
 * Each notification object shape:
 *   { id: string, type?: 'success'|'error'|'info'|'warning', message: string, duration?: number }
 *
 * @param {{ children: React.ReactNode }} props
 */
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    setNotifications((prev) => [...prev.slice(-2), { ...notification, id }]);
    return id;
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  const value = useMemo(
    () => ({
      notifications,
      addNotification,
      dismissNotification,
      clearAll,
    }),
    [notifications, addNotification, dismissNotification, clearAll],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * useNotifications — access the current notification state and actions.
 *
 * @returns {{ notifications: Array, addNotification: Function, dismissNotification: Function, clearAll: Function }}
 * @throws {Error} if called outside of a <NotificationProvider>.
 */
export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return ctx;
}