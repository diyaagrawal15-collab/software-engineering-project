import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CrisisModal from './components/CrisisModal';
import ChatbotWidget from './components/ChatbotWidget';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import StressAssessmentPage from './pages/StressAssessmentPage';
import AssessmentResultPage from './pages/AssessmentResultPage';
import AssessmentHistoryPage from './pages/AssessmentHistoryPage';
import MoodJournalPage from './pages/MoodJournalPage';
import RecommendationsPage from './pages/RecommendationsPage';
import AppointmentBookingPage from './pages/AppointmentBookingPage';
import ProgressReportsPage from './pages/ProgressReportsPage';
import CounselorDashboard from './pages/CounselorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <p style={{ color: '#64748b' }}>Verifying session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppContent() {
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar onOpenCrisisModal={() => setIsCrisisModalOpen(true)} />

      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage onOpenCrisisModal={() => setIsCrisisModalOpen(true)} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessment"
            element={
              <ProtectedRoute>
                <StressAssessmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessment/result/:id"
            element={
              <ProtectedRoute>
                <AssessmentResultPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessment/history"
            element={
              <ProtectedRoute>
                <AssessmentHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mood"
            element={
              <ProtectedRoute>
                <MoodJournalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <RecommendationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <AppointmentBookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ProgressReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Counselor Portal */}
          <Route
            path="/counselor"
            element={
              <ProtectedRoute allowedRoles={['counselor', 'admin']}>
                <CounselorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Control Center */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer onOpenCrisisModal={() => setIsCrisisModalOpen(true)} />
      
      {/* 24/7 Crisis Modal */}
      <CrisisModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
      />

      {/* Floating AI Stress Assistant Widget */}
      <ChatbotWidget onOpenCrisisModal={() => setIsCrisisModalOpen(true)} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
