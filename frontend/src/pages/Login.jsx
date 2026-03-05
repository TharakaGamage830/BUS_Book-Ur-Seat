import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, Mail, Lock } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import ThemeContext from '../context/ThemeContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const u = await login(email, password);
            navigate(u?.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally { setLoading(false); }
    };

    return (
        <div className="auth-container animate-fade-in">
            <div className="auth-card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <img
                        src={theme === 'dark' ? '/BUS_logo_with_txt_dark-mode.png' : '/BUS_logo_with_txt_light-mode.png'}
                        alt="BUS Logo"
                        style={{ height: '48px', objectFit: 'contain', margin: '0 auto 1.25rem' }}
                    />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.3rem' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Sign in to manage your bookings</p>
                </div>

                {error && <div className="error-message"><AlertCircle size={14} /> {error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label"><Mail size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }} /> Email Address</label>
                        <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus />
                    </div>
                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                            <label className="form-label" style={{ margin: 0 }}><Lock size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }} /> Password</label>
                            <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: '600' }}>Forgot password?</Link>
                        </div>
                        <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700' }}>Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
