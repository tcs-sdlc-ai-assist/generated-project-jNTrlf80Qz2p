import { createContext, useContext } from 'react';

const AppContainerContext = createContext(null);

/**
 * AppContainerProvider — injects the app container instance into the React tree.
 *
 * The `container` prop should be the fully wired AppContainer object
 * (services, repositories, managers) assembled at application bootstrap.
 * Any descendant component can retrieve it via `useAppContainer()`.
 *
 * @param {{ container: Object, children: React.ReactNode }} props
 */
export function AppContainerProvider({ container, children }) {
  return (
    <AppContainerContext.Provider value={container}>
      {children}
    </AppContainerContext.Provider>
  );
}

/**
 * useAppContainer — access the application container from any descendant component.
 *
 * @returns {Object} The app container instance.
 * @throws {Error} if called outside of an <AppContainerProvider>.
 */
export function useAppContainer() {
  const ctx = useContext(AppContainerContext);
  if (!ctx) {
    throw new Error(
      'useAppContainer must be used within an AppContainerProvider',
    );
  }
  return ctx;
}