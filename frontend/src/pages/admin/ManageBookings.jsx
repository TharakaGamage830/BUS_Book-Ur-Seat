import React, { useState, useEffect } from 'react';
import { getAdminBookings, cancelBooking } from '../../api/admin';
import { Ticket, Search, XCircle, AlertCircle } from 'lucide-react';

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setBookings(await getAdminBookings());
        } catch (err) {
            setError('Failed to fetch bookings. Ensure you have admin access.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Cancel this booking? The seat will be released.')) return;
        try {
            await cancelBooking(bookingId);
            setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
            setSuccessMsg('Booking cancelled successfully.');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to cancel booking.');
        }
    };

    const filtered = bookings.filter(b => {
        if (!searchTerm) return true;
        const t = searchTerm.toLowerCase();
        return (
            b.passengerDetails?.name?.toLowerCase().includes(t) ||
            b.user?.email?.toLowerCase().includes(t) ||
            b.schedule?.route?.origin?.toLowerCase().includes(t) ||
            b.schedule?.route?.destination?.toLowerCase().includes(t)
        );
    });

    return (
        <div className="page-wrapper animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Ticket size={28} color="var(--primary)" />
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>Manage Bookings</h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
                All passenger reservations across the system.
            </p>

            {error && <div className="error-message"><AlertCircle size={16} /> {error}</div>}
            {successMsg && <div className="success-message">{successMsg}</div>}

            {/* Search Bar */}
            <div className="card" style={{ marginBottom: '1.25rem', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Search size={18} color="var(--text-muted)" />
                <input
                    type="text"
                    placeholder="Search by passenger name, email, or city..."
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ border: 'none', background: 'transparent', padding: '0', margin: 0, boxShadow: 'none' }}
                />
                {searchTerm && (
                    <button className="btn btn-ghost btn-sm" onClick={() => setSearchTerm('')} style={{ padding: '0.3rem 0.6rem' }}>✕</button>
                )}
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                        Showing {filtered.length} of {bookings.length} bookings
                    </h2>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span className="badge badge-success">{bookings.filter(b => b.status === 'confirmed').length} Confirmed</span>
                        <span className="badge badge-danger">{bookings.filter(b => b.status === 'cancelled').length} Cancelled</span>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Route & Date</th>
                                <th>Passenger</th>
                                <th>Account</th>
                                <th>Seat</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading bookings...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No bookings found.</td></tr>
                            ) : filtered.map(b => (
                                <tr key={b._id}>
                                    <td>
                                        <div style={{ fontWeight: '700' }}>
                                            {b.schedule?.route?.origin} → {b.schedule?.route?.destination}
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                            {b.schedule ? new Date(b.schedule.departureTime).toLocaleDateString('en-LK', { dateStyle: 'medium' }) : 'N/A'}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{b.passengerDetails?.name}</div>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.passengerDetails?.phone}</div>
                                    </td>
                                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{b.user?.email}</td>
                                    <td>
                                        <span className="badge badge-primary">#{b.seatNumber}</span>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${b.status === 'confirmed' ? 'success' : 'danger'}`}>
                                            {b.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        {b.status === 'confirmed' && (
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleCancel(b._id)}
                                                title="Cancel Booking"
                                            >
                                                <XCircle size={14} /> Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageBookings;
