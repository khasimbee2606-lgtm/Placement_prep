import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

// Page components
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PracticeTracker from './pages/PracticeTracker';
import MockTests from './pages/MockTests';
import Analytics from './pages/Analytics';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';

// Root redirect handler
const RootRedirect = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner-container">
          <div className="spinner" style={{ borderColor: 'rgba(16, 185, 129, 0.2)', borderTopColor: '#10b981' }}></div>
          <p className="loading-text" style={{ color: '#34d399' }}>Securing Campus2Career session...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

// Layout Wrapper with Sidebar & Topbar for Protected Pages
const AppLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="main-viewport">
        <Topbar toggleMobileSidebar={() => setMobileOpen(!mobileOpen)} />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes (Authenticated Layout) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/practice"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PracticeTracker />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tests"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <MockTests />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Analytics />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Leaderboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
