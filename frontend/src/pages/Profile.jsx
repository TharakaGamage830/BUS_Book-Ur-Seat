import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getMyBookings } from '../api/booking';
import { Ticket } from 'lucide-react';

const Profile = () => {
    const { user, updateProfile } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setName(user.name);
            fetchBookings();
        }
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            setLoadingBookings(true);
            const data = await getMyBookings();
            setBookings(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingBookings(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password && password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            await updateProfile(name, password);
            setMessage('Profile updated successfully');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    if (!user) return null;

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
                <div className="card" style={{ flex: '1 1 300px' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>User Profile Settings</h2>

                    {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
                    {message && <div style={{ color: 'var(--success-color)', marginBottom: '1rem', fontSize: '0.875rem' }}>{message}</div>}

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
                            <label className="form-label">Email Address (Read Only)</label>
                            <input
                                type="email"
                                className="form-control"
                                value={user.email}
                                disabled
                                style={{ backgroundColor: 'var(--bg-color)', cursor: 'not-allowed' }}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Leave blank to keep current password"
                                minLength="6"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Update Profile
                        </button>
                    </form>
                </div>

                <div className="card" style={{ flex: '2 1 500px' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Ticket size={24} /> My Bookings
                    </h2>

                    {loadingBookings ? (
                        <div>Loading bookings...</div>
                    ) : bookings.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg-color)', borderRadius: '0.5rem', color: 'var(--text-secondary)' }}>
                            You haven't booked any trips yet.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {bookings.map(booking => (
                                <div key={booking._id} style={{ border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                                            {booking.schedule?.route?.origin} to {booking.schedule?.route?.destination}
                                        </div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                            {new Date(booking.schedule?.departureTime).toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: '0.875rem' }}>
                                            Passenger: <strong>{booking.passengerDetails?.name}</strong>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                            Seat #{booking.seatNumber}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: booking.status === 'confirmed' ? 'var(--success-color)' : 'var(--danger-color)', textTransform: 'uppercase', marginTop: '0.25rem', fontWeight: 'bold' }}>
                                            {booking.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
