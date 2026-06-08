import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext.jsx';
import { ProtectedRoute } from './components/auth/protectedRoute.jsx';
import { AppLayout } from './components/layout/appLayout.jsx';
import LoginPage from './pages/loginPage.jsx';
import RegisterPage from './pages/registerPage.jsx';

/**
 * ChatPlaceholder — shown when no conversation is selected.
 * Renders a centered empty-state message using the design system's
 * muted text token on the canvas background.
 */
function ChatPlaceholder() {
  return (
    <div className="flex items-center justify-center h-full text-muted">
      <p>Select a conversation to start chatting</p>
    </div>
  );
}

/**
 * SettingsPlaceholder — temporary settings page shell.
 * Uses the design system's heading and muted text tokens.
 */
function SettingsPlaceholder() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-ink">Settings</h1>
      <p className="text-muted mt-2">Settings page coming soon.</p>
    </div>
  );
}

/**
 * App — top-level application component.
 *
 * Owns the full route table and layout chrome. Wraps every route
 * in AuthProvider so that useAuth() is available tree-wide.
 *
 * @param {{ authService: Object }} props
 *        authService must conform to the contract expected by AuthProvider
 *        (getCurrentUser, login, register, logout).
 */
export default function App({ authService }) {
  return (
    <AuthProvider authService={authService}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected: main chat shell */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ChatPlaceholder />} />
        </Route>

        {/* Protected: settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPlaceholder />
            </ProtectedRoute>
          }
        />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </AuthProvider>
  );
}