import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                // Determine API URL based on config (fallback to localhost:5000 if not set)
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const { data } = await axios.get(`${apiUrl}/auth/verify/${token}`);

                setStatus('success');
                setMessage(data.message);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed. Token may be invalid or expired.');
            }
        };

        verify();
    }, [token]);

    return (
        <div className="auth-container">
            <div className="card auth-card" style={{ textAlign: 'center' }}>
                <h2>Email Verification</h2>

                <div style={{ margin: '2rem 0', display: 'flex', justifyContent: 'center' }}>
                    {status === 'loading' && <div className="spinner">Verifying...</div>}
                    {status === 'success' && <CheckCircle size={64} color="var(--success)" />}
                    {status === 'error' && <XCircle size={64} color="var(--danger)" />}
                </div>

                {status !== 'loading' && (
                    <p style={{ marginBottom: '2rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                        {message}
                    </p>
                )}

                {status === 'success' && (
                    <Link to="/login" className="btn btn-primary" style={{ width: '100%', display: 'inline-block' }}>
                        Proceed to Login
                    </Link>
                )}

                {status === 'error' && (
                    <Link to="/" className="btn btn-outline" style={{ display: 'inline-block', marginTop: '1rem', border: '1px solid var(--border)', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', color: 'var(--text-primary)' }}>
                        Back to Home
                    </Link>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
