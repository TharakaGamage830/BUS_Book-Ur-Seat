import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getScheduleSeats, createBooking } from '../api/booking';
import { ArrowLeft, CheckCircle, AlertCircle, Bus, MapPin, Clock, Calendar, Shield, Info } from 'lucide-react';
import { generateSeatLayout } from './admin/ManageBuses';

const BookingSeatSelection = () => {
    const { scheduleId } = useParams();
    const navigate = useNavigate();

    const [scheduleDetails, setScheduleDetails] = useState(null);
    const [capacity, setCapacity] = useState(0);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [passengerDetails, setPassengerDetails] = useState({ name: '', phone: '' });
    const [bookingInProgress, setBookingInProgress] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [bookingError, setBookingError] = useState('');

    useEffect(() => {
        const fetchSeats = async () => {
            try {
                setLoading(true);
                const data = await getScheduleSeats(scheduleId);
                setScheduleDetails(data.schedule);
                setCapacity(data.capacity);
                setBookedSeats(data.bookedSeats || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load seat layout.');
            } finally {
                setLoading(false);
            }
        };
        fetchSeats();
        const interval = setInterval(fetchSeats, 10000);
        return () => clearInterval(interval);
    }, [scheduleId]);

    const handleSeatClick = (seatNum) => {
        if (bookedSeats.includes(seatNum)) return;
        setSelectedSeat(prev => prev === seatNum ? null : seatNum);
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setBookingError('');
        setBookingInProgress(true);
        if (!selectedSeat) { setBookingError('Please select a seat first.'); setBookingInProgress(false); return; }
        try {
            await createBooking({ scheduleId, seatNumber: selectedSeat, passengerDetails });
            setIsSuccess(true);
            setTimeout(() => navigate('/history'), 2500);
        } catch (err) {
            setBookingError(err.response?.data?.message || 'Failed to book. Seat may have been taken.');
            setBookingInProgress(false);
            if (err.response?.status === 400) {
                try { const d = await getScheduleSeats(scheduleId); setBookedSeats(d.bookedSeats || []); setSelectedSeat(null); } catch (e) { }
            }
        }
    };

    /**
     * Renders the seat grid using the same Sri Lankan bus layout:
     * - Last row: 5 seats (no aisle gap)
     * - Normal rows: 2 left + aisle + 2 right
     * - First row: partial based on (capacity - 5) % 4
     */
    const renderSeatGrid = () => {
        const rows = generateSeatLayout(capacity);
        if (rows.length === 0) return null;

        return rows.map((row, ri) => {
            if (row.isBack) {
                // Last row: 5 seats, no aisle
                return (
                    <div key={ri} style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginTop: '0.4rem', paddingTop: '0.5rem', borderTop: '2px dashed var(--border)' }}>
                        {row.seats.map(s => {
                            const isBooked = bookedSeats.includes(s.num);
                            const isSelected = selectedSeat === s.num;
                            let cls = 'seat available';
                            if (isBooked) cls = 'seat booked';
                            else if (isSelected) cls = 'seat selected';
                            return (
                                <div key={s.num} className={cls} onClick={() => handleSeatClick(s.num)} title={isBooked ? `Seat ${s.num} (Booked)` : `Seat ${s.num}`}>
                                    {s.num}
                                </div>
                            );
                        })}
                    </div>
                );
            }

            // Normal or partial row
            const leftSeats = row.seats.filter(s => s.pos.startsWith('L'));
            const rightSeats = row.seats.filter(s => s.pos.startsWith('R'));

            const renderSlot = (seat) => {
                if (!seat) {
                    return <div className="seat empty-slot" style={{ opacity: 0, cursor: 'default' }}></div>;
                }
                const isBooked = bookedSeats.includes(seat.num);
                const isSelected = selectedSeat === seat.num;
                let cls = 'seat available';
                if (isBooked) cls = 'seat booked';
                else if (isSelected) cls = 'seat selected';
                return (
                    <div key={seat.num} className={cls} onClick={() => handleSeatClick(seat.num)} title={isBooked ? `Seat ${seat.num} (Booked)` : `Seat ${seat.num}`}>
                        {seat.num}
                    </div>
                );
            };

            return (
                <div key={ri} style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '0.4rem' }}>
                    {renderSlot(leftSeats[0] || null)}
                    {renderSlot(leftSeats[1] || null)}
                    <div style={{ width: '24px' }}></div>
                    {renderSlot(rightSeats[0] || null)}
                    {renderSlot(rightSeats[1] || null)}
                </div>
            );
        });
    };

    if (loading && !scheduleDetails) {
        return (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
                <Bus size={44} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                <p>Loading seat layout...</p>
            </div>
        );
    }

    if (error && !scheduleDetails) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--danger)' }}>
                <AlertCircle size={44} style={{ marginBottom: '1rem' }} />
                <p>{error}</p>
                <button className="btn btn-secondary" onClick={() => navigate('/book-seat')} style={{ marginTop: '1rem' }}>Back to Search</button>
            </div>
        );
    }

    const formatLKR = (v) => `Rs. ${Number(v).toLocaleString('en-LK')}`;

    return (
        <div className="page-wrapper animate-fade-in">
            {/* Back button */}
            <button onClick={() => navigate('/book-seat')} className="btn btn-ghost" style={{ marginBottom: '1.25rem' }}>
                <ArrowLeft size={16} /> Back to search
            </button>

            {/* Route header card */}
            {scheduleDetails && (
                <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                                <MapPin size={18} color="var(--primary)" />
                                <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                                    {scheduleDetails.route?.origin} → {scheduleDetails.route?.destination}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Calendar size={13} />
                                    {new Date(scheduleDetails.departureTime).toLocaleDateString('en-LK', { dateStyle: 'medium' })}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Clock size={13} />
                                    {new Date(scheduleDetails.departureTime).toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Bus size={13} /> {scheduleDetails.bus?.busNumber} · {scheduleDetails.bus?.type}
                                </span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: '700' }}>Price Per Seat</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>{formatLKR(scheduleDetails.price)}</div>
                        </div>
                    </div>
                </div>
            )}

            {error && <div className="error-message"><AlertCircle size={14} /> {error}</div>}

            {/* Main grid: Seat map + Booking summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>

                {/* Seat Map */}
                <div className="card">
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Select Your Seat
                    </h2>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                        Route: {scheduleDetails?.route?.origin} to {scheduleDetails?.route?.destination}
                    </p>

                    {/* Legend */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <span style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'var(--success)', display: 'inline-block' }} /> Available
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <span style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'var(--danger)', display: 'inline-block' }} /> Booked
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <span style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'var(--accent)', display: 'inline-block' }} /> Selected
                        </span>
                    </div>

                    {/* Bus shape */}
                    <div style={{
                        background: 'var(--bg-color)',
                        border: '2px dashed var(--border)',
                        borderRadius: '1.5rem 1.5rem 0.75rem 0.75rem',
                        padding: '1.25rem 1.25rem 1.75rem',
                        maxWidth: '280px',
                        margin: '0 auto',
                    }}>
                        {/* Driver */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '2px dashed var(--border)' }}>
                            <div style={{
                                width: '36px', height: '36px',
                                border: '2px solid var(--border)',
                                borderRadius: 'var(--radius-sm)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'var(--surface)', color: 'var(--text-muted)'
                            }}><Bus size={18} /></div>
                        </div>
                        {renderSeatGrid()}
                    </div>
                </div>

                {/* Booking Summary sidebar */}
                <div className="card" style={{ position: 'sticky', top: '80px' }}>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1.25rem' }}>Booking Summary</h2>

                    {isSuccess ? (
                        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid var(--success)', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center', color: 'var(--success)' }}>
                            <CheckCircle size={48} style={{ margin: '0 auto 1rem', display: 'block' }} />
                            <h3 style={{ marginBottom: '0.4rem' }}>Booking Confirmed!</h3>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Seat #{selectedSeat} reserved. Redirecting...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleBookingSubmit}>
                            {/* Journey info chips */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Route</div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{scheduleDetails?.route?.origin} to {scheduleDetails?.route?.destination}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Departure</div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>
                                            {scheduleDetails ? new Date(scheduleDetails.departureTime).toLocaleDateString('en-LK', { dateStyle: 'medium' }) : '—'} | {scheduleDetails ? new Date(scheduleDetails.departureTime).toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' }) : '—'}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', background: selectedSeat ? 'var(--accent-light)' : 'var(--section-bg)', color: selectedSeat ? 'var(--accent-hover)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: selectedSeat ? '1px solid var(--accent-border)' : '1px solid var(--border)' }}>
                                        <Bus size={18} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Selected Seat</div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{selectedSeat ? `Seat ${selectedSeat}` : 'None selected'}</div>
                                    </div>
                                </div>
                            </div>

                            <hr className="divider" />

                            {/* Price */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                                <span>Ticket Price</span>
                                <span>{scheduleDetails ? formatLKR(scheduleDetails.price) : '—'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)', marginTop: '0.35rem' }}>
                                <span>Total Price</span>
                                <span style={{ color: 'var(--accent-hover)' }}>
                                    {selectedSeat && scheduleDetails ? formatLKR(scheduleDetails.price) : 'Rs. 0'}
                                </span>
                            </div>

                            <hr className="divider" />

                            {/* Passenger form */}
                            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Passenger Information</div>
                            {bookingError && <div className="error-message" style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}><AlertCircle size={13} /> {bookingError}</div>}

                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input type="text" className="form-control" placeholder="e.g. Kamal Perera" value={passengerDetails.name} onChange={e => setPassengerDetails({ ...passengerDetails, name: e.target.value })} required disabled={!selectedSeat || bookingInProgress} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input type="tel" className="form-control" placeholder="+94 77 123 4567" value={passengerDetails.phone} onChange={e => setPassengerDetails({ ...passengerDetails, phone: e.target.value })} required disabled={!selectedSeat || bookingInProgress} />
                            </div>

                            {/* Info callout */}
                            <div className="info-callout" style={{ fontSize: '0.78rem', margin: '1rem 0' }}>
                                <Info size={14} style={{ flexShrink: 0, color: 'var(--accent)' }} />
                                <span>Please ensure the name matches your official ID. You may be required to show identification before boarding.</span>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={!selectedSeat || bookingInProgress}>
                                {bookingInProgress ? 'Processing...' : selectedSeat ? 'Proceed to Payment' : 'Select a Seat First'}
                            </button>

                            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                                <Shield size={11} /> Secure SSL Encrypted Checkout
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingSeatSelection;
