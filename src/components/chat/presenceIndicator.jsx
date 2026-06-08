export function PresenceIndicator({ isOnline }) {
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ring-2 ring-surface ${
        isOnline ? 'bg-online' : 'bg-offline'
      }`}
      aria-label={isOnline ? 'Online' : 'Offline'}
    />
  );
}