import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { register, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            const data = await register(name, email, password);
            setSuccessMessage(data.message || 'Registration successful! Please check your email to verify your account.');
            // Clear form
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            // Handle express-validator array of errors or generic message
            if (err.response?.data?.errors) {
                setError(err.response.data.errors[0].msg);
            } else {
                setError(err.response?.data?.message || 'Registration failed');
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="card auth-card">
                <h2>Create an Account</h2>
                {successMessage ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid var(--success-color)' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>Success!</h3>
                            <p>{successMessage}</p>
                        </div>
                        <Link to="/login" className="btn btn-primary" style={{ display: 'inline-block', width: '100%' }}>Go to Login</Link>
                    </div>
                ) : (
                    <>
                        {error && <div className="error-message" style={{ marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength="6"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                                Register
                            </button>
                        </form>
                        <div className="auth-footer">
                            Already have an account? <Link to="/login">Login here</Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Register;
