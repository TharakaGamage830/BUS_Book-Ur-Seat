import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

/**
 * ProtectedRoute — redirects to /login if user is not authenticated.
 * Preserves the attempted URL in location state for redirect-after-login.
 */
export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading...</div>;
    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
    return children;
};

/**
 * AdminRoute — redirects to /login if user is not an admin.
 */
export const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading...</div>;
    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
    if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
    return children;
};

export default ProtectedRoute;
