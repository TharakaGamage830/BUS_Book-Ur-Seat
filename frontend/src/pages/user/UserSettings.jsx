import React, { useState, useContext } from 'react';
import { User, Lock, AlertCircle, CheckCircle, Mail } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import api from '../../api/axios';

const UserSettings = () => {
    const { user, logout } = useContext(AuthContext);
    const [name, setName] = useState(user?.name || '');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleNameUpdate = async (e) => {
        e.preventDefault();
        setError(''); setSuccess(''); setLoading(true);
        try {
            const { data } = await api.put('/auth/profile', { name });
            localStorage.setItem('user', JSON.stringify(data));
            setSuccess('Name updated successfully.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update name.');
        } finally { setLoading(false); }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        if (newPassword !== confirmPassword) { setError('New passwords do not match.'); return; }
        if (newPassword.length < 6) { setError('New password must be at least 6 characters.'); return; }
        setLoading(true);
        try {
            const { data } = await api.put('/auth/profile', { oldPassword, password: newPassword });
            localStorage.setItem('user', JSON.stringify(data));
            setSuccess('Password changed successfully.');
            setOldPassword(''); setNewPassword(''); setConfirmPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password.');
        } finally { setLoading(false); }
    };

    return (
        <div className="page-wrapper animate-fade-in">
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>Settings</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Manage your profile and security.</p>

            {error && <div className="error-message"><AlertCircle size={14} /> {error}</div>}
            {success && <div className="success-message"><CheckCircle size={14} /> {success}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
                {/* Profile Info */}
                <div className="card">
                    <h2 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={18} color="var(--primary)" /> Profile Information
                    </h2>
                    <form onSubmit={handleNameUpdate}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label"><Mail size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.2rem' }} /> Email (read-only)</label>
                            <input type="email" className="form-control" value={user?.email || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Update Name'}
                        </button>
                    </form>
                </div>

                {/* Change Password */}
                <div className="card">
                    <h2 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Lock size={18} color="var(--accent)" /> Change Password
                    </h2>
                    <form onSubmit={handlePasswordChange}>
                        <div className="form-group">
                            <label className="form-label">Current Password</label>
                            <input type="password" className="form-control" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="Enter current password" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input type="password" className="form-control" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 6 characters" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm New Password</label>
                            <input type="password" className="form-control" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter new password" required />
                        </div>
                        <button type="submit" className="btn btn-accent" disabled={loading}>
                            {loading ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserSettings;
