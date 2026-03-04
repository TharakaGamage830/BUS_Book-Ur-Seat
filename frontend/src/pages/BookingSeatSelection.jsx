import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getScheduleSeats, createBooking } from '../api/booking';
import { Bus, MapPin, Clock, Armchair, CreditCard } from 'lucide-react';

const BookingSeatSelection = () => {
    const { scheduleId } = useParams();
    const navigate = useNavigate();

    const [scheduleDetails, setScheduleDetails] = useState(null);
    const [capacity, setCapacity] = useState(0);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Passenger details state
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingError, setBookingError] = useState('');

    useEffect(() => {
        const fetchSeatsAndDetails = async () => {
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

        fetchSeatsAndDetails();
        // Set up polling to keep seats refreshed (every 10 seconds)
        const interval = setInterval(fetchSeatsAndDetails, 10000);
        return () => clearInterval(interval);
    }, [scheduleId]);

    const handleSeatClick = (seatNum) => {
        if (bookedSeats.includes(seatNum)) return;
        if (selectedSeat === seatNum) {
            setSelectedSeat(null); // deselect
        } else {
            setSelectedSeat(seatNum);
        }
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setBookingError('');

        if (!selectedSeat) {
            setBookingError('Please select a seat first.');
            return;
        }

        try {
            await createBooking({
                scheduleId,
                seatNumber: selectedSeat,
                passengerDetails: { name, phone }
            });
            setBookingSuccess(true);
            // Wait 2 seconds and navigate to bookings page
            setTimeout(() => {
                navigate('/profile'); // Assuming we'll put My Bookings there or create a dedicated page
            }, 2000);
        } catch (err) {
            setBookingError(err.response?.data?.message || 'Failed to book seat. It might have been taken.');
            // Refresh seats layout if it fails due to double booking race condition
            if (err.response?.status === 400) {
                try {
                    const data = await getScheduleSeats(scheduleId);
                    setBookedSeats(data.bookedSeats || []);
                    setSelectedSeat(null);
                } catch (e) { }
            }
        }
    };

    const renderSeatGrid = () => {
        const rows = Math.ceil(capacity / 4);
        const grid = [];

        for (let r = 0; r < rows; r++) {
            const rowSeats = [];
            for (let c = 0; c < 4; c++) {
                const seatNum = (r * 4) + c + 1;

                // If capacity is not perfectly divisible by 4, skip drawing extra seats
                if (seatNum > capacity) continue;

                const isBooked = bookedSeats.includes(seatNum);
                const isSelected = selectedSeat === seatNum;

                let bgColor = 'var(--surface-color)';
                let borderColor = 'var(--border-color)';
                let color = 'var(--text-primary)';
                let cursor = 'pointer';

                if (isBooked) {
                    bgColor = 'rgba(239, 68, 68, 0.1)'; // faint red
                    borderColor = 'var(--danger-color)';
                    color = 'var(--danger-color)';
                    cursor = 'not-allowed';
                } else if (isSelected) {
                    bgColor = 'var(--primary-color)';
                    borderColor = 'var(--primary-color)';
                    color = '#ffffff';
                } else {
                    // Available hover effects handled largely via inline-styles logic below
                }

                rowSeats.push(
                    <div
                        key={seatNum}
                        onClick={() => handleSeatClick(seatNum)}
                        style={{
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: bgColor,
                            border: `2px solid ${borderColor}`,
                            borderRadius: '0.375rem',
                            cursor: cursor,
                            color: color,
                            fontWeight: 'bold',
                            transition: 'all 0.2s',
                            opacity: isBooked ? 0.7 : 1
                        }}
                        title={isBooked ? `Seat ${seatNum} (Booked)` : `Seat ${seatNum}`}
                    >
                        {seatNum}
                    </div>
                );

                // Add aisle gap between column 2 and 3
                if (c === 1) {
                    rowSeats.push(<div key={`aisle-${r}`} style={{ width: '30px' }}></div>);
                }
            }

            grid.push(
                <div key={`row-${r}`} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', justifyContent: 'center' }}>
                    {rowSeats}
                </div>
            );
        }
        return grid;
    };

    if (loading && !scheduleDetails) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading layout...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--danger-color)' }}>{error}</div>;
    if (!scheduleDetails) return null;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>

            {/* Context Header */}
            <div className="card feature-card-interactive" style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Bus color="var(--primary-color)" /> Booking {scheduleDetails.busType} Bus
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={18} /> {scheduleDetails.route?.origin} to {scheduleDetails.route?.destination}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={18} /> {new Date(scheduleDetails.departureTime).toLocaleString()}</span>
                    </div>
                </div>
                <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                    <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Ticket Price</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-color)' }}>${scheduleDetails.price}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '3rem' }}>

                {/* Visual Seat Map */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <Armchair size={24} color="var(--accent-color)" /> Select a Seat
                    </h2>

                    {/* Legend */}
                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 16, height: 16, border: '2px solid var(--border-color)', borderRadius: 4 }}></div> Available
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 16, height: 16, border: '2px solid var(--primary-color)', backgroundColor: 'var(--primary-color)', borderRadius: 4 }}></div> Selected
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 16, height: 16, border: '2px solid var(--danger-color)', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 4 }}></div> Booked
                        </div>
                    </div>

                    {/* Driver marker */}
                    <div style={{ width: '100%', maxWidth: '300px', border: '2px solid var(--border-color)', borderBottom: 'none', borderRadius: '2rem 2rem 0 0', padding: '1rem', marginBottom: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-block', width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', title: 'Driver' }}>
                            steering
                        </div>
                    </div>

                    {/* The Grid */}
                    <div style={{ width: '100%', maxWidth: '300px', border: '2px solid var(--border-color)', borderTop: 'none', borderRadius: '0 0 1rem 1rem', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.01)' }}>
                        {renderSeatGrid()}
                    </div>
                </div>

                {/* Booking Form */}
                <div className="card">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <CreditCard size={24} color="var(--success-color)" /> Complete Booking
                    </h2>

                    {bookingSuccess ? (
                        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success-color)', borderRadius: '0.5rem', padding: '2rem', textAlign: 'center', color: 'var(--success-color)' }}>
                            <ShieldCheck size={48} style={{ margin: '0 auto 1rem auto' }} />
                            <h3 style={{ marginBottom: '0.5rem' }}>Booking Confirmed!</h3>
                            <p>Your seat #{selectedSeat} is reserved. Redirecting to your profile...</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>Selected Seat:</span>
                                    <span style={{ fontWeight: 'bold' }}>{selectedSeat ? `#${selectedSeat}` : 'None'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>Base Fare:</span>
                                    <span>${scheduleDetails.price}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                                    <span>Total:</span>
                                    <span style={{ color: 'var(--primary-color)' }}>${selectedSeat ? scheduleDetails.price : '0'}</span>
                                </div>
                            </div>

                            {bookingError && <div className="error-message" style={{ marginBottom: '1rem' }}>{bookingError}</div>}

                            <form onSubmit={handleBookingSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Passenger Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Full Name on ID"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        disabled={!selectedSeat}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Contact Number</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        placeholder="+1 (123) 456-7890"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        disabled={!selectedSeat}
                                    />
                                </div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                    Payment will be collected as Cash on Boarding. By checking out, you agree to our cancellation policy.
                                </p>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                                    disabled={!selectedSeat}
                                >
                                    Confirm Reservation
                                </button>
                            </form>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default BookingSeatSelection;
