import { useEffect } from 'react';

export function useDocumentTitle(unreadCount) {
  useEffect(() => {
    const base = 'ChatApp Demo';
    document.title = unreadCount > 0 ? `(${unreadCount}) ${base}` : base;
    return () => { document.title = base; };
  }, [unreadCount]);
}