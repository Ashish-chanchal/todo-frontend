import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import ShareView from './pages/ShareView';
import AdminDashboard from './pages/admin/AdminDashboard';
import { Loader2 } from 'lucide-react';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#08080a] text-[#ededef] flex flex-col items-center justify-center font-sans">
      <Loader2 className="w-6 h-6 animate-spin text-[#5c68ff] mb-2" />
      <p className="text-xs text-[#88889c]">Loading workspace...</p>
    </div>
  );
}

// Route guard for authenticated areas
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Route guard for guest/auth pages (redirects if already logged in)
function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
}

// Route guard for admin-only areas
function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/dashboard" replace />;
}

// Inner router connector
function AppRoutes() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="relative w-full h-full">
      <Routes>
        {/* Public Landing Route */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing onGetStarted={() => navigate('/login')} />
          } 
        />

        {/* Guest Auth Routes */}
        <Route 
          path="/login" 
          element={
            <GuestRoute>
              <Login onSwitchToSignup={() => navigate('/signup')} />
            </GuestRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <GuestRoute>
              <Signup onSwitchToLogin={() => navigate('/login')} />
            </GuestRoute>
          } 
        />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/chat" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/board" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/timeline" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* Public Share Links (accessible by anyone) */}
        <Route 
          path="/share/:userId" 
          element={<ShareViewWrapper />} 
        />

        {/* Protected Admin Console */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard onBack={() => navigate('/dashboard')} />
            </AdminRoute>
          } 
        />

        {/* Fallback Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Admin floating console trigger */}
      {isAuthenticated && user?.role === 'admin' && (
        <button
          onClick={() => navigate('/admin')}
          className="fixed bottom-4 left-4 z-50 bg-[#121216] border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl px-4 py-2 font-semibold text-xs transition-all duration-150 active:scale-95 shadow-lg"
        >
          Open Admin Panel
        </button>
      )}
    </div>
  );
}

// Helper wrapper to extract params cleanly for ShareView
import { useParams } from 'react-router-dom';
function ShareViewWrapper() {
  const { userId } = useParams();
  return <ShareView sharedUserId={userId} />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
