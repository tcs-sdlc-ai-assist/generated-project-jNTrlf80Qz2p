import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the application tree with authentication state.
 *
 * Accepts an `authService` prop that must conform to:
 *   - getCurrentUser()  → user object | null
 *   - login(email, pw)  → user object (throws on failure)
 *   - register(email, pw, displayName) → user object (throws on failure)
 *   - logout()          → void
 *
 * @param {{ authService: Object, children: React.ReactNode }} props
 */
export function AuthProvider({ authService, children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());

  const login = useCallback(
    (email, password) => {
      const u = authService.login(email, password);
      setUser(u);
      return u;
    },
    [authService],
  );

  const register = useCallback(
    (email, password, displayName) => {
      const u = authService.register(email, password, displayName);
      setUser(u);
      return u;
    },
    [authService],
  );

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, [authService]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }),
    [user, login, register, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth — access the current authentication state and actions.
 *
 * @returns {{ user: Object|null, isAuthenticated: boolean, login: Function, register: Function, logout: Function }}
 * @throws {Error} if called outside of an <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}