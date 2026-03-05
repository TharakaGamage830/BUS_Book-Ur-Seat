import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, User, Mail, Lock } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import ThemeContext from '../context/ThemeContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        if (password !== confirmPassword) { setError('Passwords do not match'); return; }
        setLoading(true);
        try {
            await register(name, email, password);
            setSuccess('Account created! You can now sign in.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
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
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.3rem' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Sign up to start booking your trips</p>
                </div>

                {error && <div className="error-message"><AlertCircle size={14} /> {error}</div>}
                {success && <div className="success-message"><CheckCircle size={14} /> {success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label"><User size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }} /> Full Name</label>
                        <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Kamal Perera" required autoFocus />
                    </div>
                    <div className="form-group">
                        <label className="form-label"><Mail size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }} /> Email Address</label>
                        <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label"><Lock size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }} /> Password</label>
                        <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label"><Lock size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }} /> Confirm Password</label>
                        <input type="password" className="form-control" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
