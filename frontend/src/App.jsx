import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// User pages (protected)
import UserDashboard from './pages/user/UserDashboard';
import BookSeat from './pages/user/BookSeat';
import BookingHistory from './pages/user/BookingHistory';
import UserSettings from './pages/user/UserSettings';
import BookingSeatSelection from './pages/BookingSeatSelection';

// Admin pages (admin-only)
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBuses from './pages/admin/ManageBuses';
import ManageRoutes from './pages/admin/ManageRoutes';
import ManageSchedules from './pages/admin/ManageSchedules';
import ManageBookings from './pages/admin/ManageBookings';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main>
              <Routes>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify/:token" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/resetpassword/:token" element={<ResetPassword />} />

                {/* User — Protected */}
                <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                <Route path="/book-seat" element={<ProtectedRoute><BookSeat /></ProtectedRoute>} />
                <Route path="/book/:scheduleId" element={<ProtectedRoute><BookingSeatSelection /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><UserSettings /></ProtectedRoute>} />

                {/* Admin — Admin-only */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/buses" element={<AdminRoute><ManageBuses /></AdminRoute>} />
                <Route path="/admin/routes" element={<AdminRoute><ManageRoutes /></AdminRoute>} />
                <Route path="/admin/schedules" element={<AdminRoute><ManageSchedules /></AdminRoute>} />
                <Route path="/admin/bookings" element={<AdminRoute><ManageBookings /></AdminRoute>} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
