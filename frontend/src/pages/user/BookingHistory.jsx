import React, { useState, useEffect } from 'react';
import { getMyBookings, cancelMyBooking } from '../../api/booking';
import { Clock, MapPin, Calendar, ArrowRight, XCircle, AlertCircle, CheckCircle, Ticket } from 'lucide-react';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => { load(); }, []);

    const load = async () => {
        try { setLoading(true); setBookings(await getMyBookings()); }
        catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking? Note: You will not be able to rebook on this same bus trip.')) return;
        setError(''); setSuccess('');
        try {
            const res = await cancelMyBooking(bookingId);
            setSuccess(res.message || 'Booking cancelled.');
            load();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to cancel booking.');
        }
    };

    const canCancel = (booking) => {
        if (booking.status !== 'confirmed') return false;
        const departure = new Date(booking.schedule?.departureTime);
        const hoursLeft = (departure - new Date()) / (1000 * 60 * 60);
        return hoursLeft >= 24;
    };

    return (
        <div className="page-wrapper animate-fade-in">
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>Booking History</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>View all your past and upcoming reservations.</p>

            {error && <div className="error-message"><AlertCircle size={14} /> {error}</div>}
            {success && <div className="success-message"><CheckCircle size={14} /> {success}</div>}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading bookings...</div>
            ) : bookings.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <Ticket size={40} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.25 }} />
                    <p style={{ color: 'var(--text-muted)' }}>No bookings yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {bookings.map(b => {
                        const isCancelled = b.status === 'cancelled';
                        const canCancelIt = canCancel(b);
                        const departure = new Date(b.schedule?.departureTime);
                        const isPast = departure < new Date();

                        return (
                            <div key={b._id} className="card" style={{ borderLeft: `4px solid ${isCancelled ? 'var(--danger)' : isPast ? 'var(--border-strong)' : 'var(--primary)'}`, opacity: isCancelled ? 0.7 : 1, padding: '1.25rem 1.5rem' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ flex: '1 1 250px' }}>
                                        <div style={{ fontWeight: '800', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                                            {b.schedule?.route?.origin} <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {b.schedule?.route?.destination}
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Calendar size={11} /> {departure.toLocaleDateString('en-LK', { dateStyle: 'medium' })}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Clock size={11} /> {departure.toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                                            Passenger: <strong>{b.passengerDetails?.name}</strong> &middot; {b.passengerDetails?.phone}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <span className="badge badge-primary" style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem' }}>Seat #{b.seatNumber}</span>
                                            <div style={{ marginTop: '0.35rem' }}>
                                                <span className={`badge badge-${isCancelled ? 'danger' : isPast ? 'warning' : 'success'}`}>
                                                    {isCancelled ? 'CANCELLED' : isPast ? 'COMPLETED' : 'CONFIRMED'}
                                                </span>
                                            </div>
                                        </div>
                                        {canCancelIt && (
                                            <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b._id)} title="Cancel booking">
                                                <XCircle size={14} /> Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {canCancelIt && (
                                    <div className="info-callout" style={{ marginTop: '0.75rem', marginBottom: 0, fontSize: '0.75rem' }}>
                                        <AlertCircle size={14} color="var(--accent)" />
                                        <span>You can cancel this booking up to 24 hours before departure. After cancellation, you cannot rebook on this trip.</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default BookingHistory;
