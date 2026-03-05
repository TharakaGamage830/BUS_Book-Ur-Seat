import React, { useState, useEffect } from 'react';
import { getSchedules, createSchedule, deleteSchedule, getBuses, getRoutes, getScheduleSeats } from '../../api/admin';
import { Clock, PlusCircle, Trash2, AlertCircle, CheckCircle, Armchair, X } from 'lucide-react';
import { generateSeatLayout } from './ManageBuses';

const ManageSchedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({ bus: '', route: '', departureTime: '', arrivalTime: '', price: '' });

    // Seat View Modal State
    const [showSeatModal, setShowSeatModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [seatData, setSeatData] = useState(null);
    const [seatLoading, setSeatLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [s, b, r] = await Promise.all([getSchedules(), getBuses(), getRoutes()]);
            setSchedules(s);
            setBuses(b.filter(bus => bus.isActive));
            setRoutes(r.filter(rt => rt.isActive));
        } catch (err) {
            setError('Failed to load data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSubmitting(true);
        try {
            await createSchedule({ ...form, price: Number(form.price) });
            setForm({ bus: '', route: '', departureTime: '', arrivalTime: '', price: '' });
            showSuccess('Schedule added!');
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create schedule.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this schedule?')) return;
        try {
            await deleteSchedule(id);
            showSuccess('Schedule deleted.');
            fetchData();
        } catch (err) {
            setError('Delete failed.');
        }
    };

    const handleViewSeats = async (schedule) => {
        setSelectedSchedule(schedule);
        setSeatData(null);
        setShowSeatModal(true);
        setSeatLoading(true);
        try {
            const data = await getScheduleSeats(schedule._id);
            setSeatData(data);
        } catch (err) {
            setError('Failed to load seat data.');
            setShowSeatModal(false);
        } finally {
            setSeatLoading(false);
        }
    };

    const formatDate = (d) => d ? new Date(d).toLocaleString('en-LK', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

    return (
        <div className="page-wrapper animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <Clock size={28} color="var(--success)" />
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>Manage Schedules</h1>
            </div>

            {error && <div className="error-message"><AlertCircle size={16} /> {error}</div>}
            {successMsg && <div className="success-message"><CheckCircle size={16} style={{ display: 'inline', marginRight: '0.4rem' }} />{successMsg}</div>}

            {/* ADD SECTION */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PlusCircle size={20} color="var(--success)" /> Add Schedule
                </h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Bus</label>
                            <select className="form-control" value={form.bus} onChange={e => setForm({ ...form, bus: e.target.value })} required>
                                <option value="">Select active bus...</option>
                                {buses.map(b => <option key={b._id} value={b._id}>{b.busNumber} ({b.type}, {b.capacity} seats)</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Route</label>
                            <select className="form-control" value={form.route} onChange={e => setForm({ ...form, route: e.target.value })} required>
                                <option value="">Select active route...</option>
                                {routes.map(r => <option key={r._id} value={r._id}>{r.origin} → {r.destination}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Departure</label>
                            <input type="datetime-local" className="form-control" value={form.departureTime} onChange={e => setForm({ ...form, departureTime: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Arrival</label>
                            <input type="datetime-local" className="form-control" value={form.arrivalTime} onChange={e => setForm({ ...form, arrivalTime: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Price (LKR)</label>
                            <input type="number" className="form-control" min="1" placeholder="e.g. 500" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={submitting}>
                        {submitting ? 'Adding...' : 'Add Schedule'}
                    </button>
                </form>
            </div>

            {/* Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>Schedules ({schedules.length})</h2>
                </div>
                <div className="scrollable">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Route</th>
                                <th>Bus</th>
                                <th>Departure</th>
                                <th>Price (LKR)</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading...</td></tr>
                            ) : schedules.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No schedules yet.</td></tr>
                            ) : schedules.map(s => (
                                <tr key={s._id}>
                                    <td>
                                        <div style={{ fontWeight: '600' }}>{s.route?.origin} → {s.route?.destination}</div>
                                    </td>
                                    <td style={{ fontSize: '0.875rem' }}>{s.bus?.busNumber}</td>
                                    <td style={{ fontSize: '0.875rem' }}>{formatDate(s.departureTime)}</td>
                                    <td style={{ fontWeight: '700', color: 'var(--success)' }}>Rs. {Number(s.price).toLocaleString('en-LK')}</td>
                                    <td>
                                        <span className={`badge badge-${s.status === 'scheduled' ? 'primary' : 'success'}`}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn btn-secondary btn-sm" onClick={() => handleViewSeats(s)} title="View Seats"><Armchair size={15} /></button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)} title="Delete"><Trash2 size={15} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Seat View Modal */}
            {showSeatModal && (
                <div className="modal-backdrop" onClick={() => setShowSeatModal(false)} style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', padding: '2rem' }}>
                        <button onClick={() => setShowSeatModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                            <X size={24} />
                        </button>

                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Armchair size={24} color="var(--primary)" /> Seat Map Preview
                        </h2>

                        {seatLoading ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading seat map...</div>
                        ) : !seatData ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--border)' }}>Failed to load data.</div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
                                {/* Left Side: Seat Grid */}
                                <div style={{ background: 'var(--bg-color)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                                    {/* Legend */}
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', fontSize: '0.85rem', fontWeight: '600' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <div style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--success)' }}></div> Available
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <div style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--danger)' }}></div> Booked
                                        </div>
                                    </div>

                                    {/* Steering Wheel Indicator */}
                                    <div style={{ width: '100%', maxWidth: '280px', display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem', paddingRight: '1rem' }}>
                                        <div style={{ padding: '0.4rem', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-muted)' }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="2"></circle><line x1="12" y1="2" x2="12" y2="12"></line><line x1="12" y1="12" x2="22" y2="12"></line><line x1="12" y1="12" x2="5" y2="19"></line></svg>
                                        </div>
                                    </div>

                                    {/* Grid */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '2px dashed var(--border)', paddingTop: '1.5rem', width: '100%' }}>
                                        {generateSeatLayout(seatData.capacity).map((row, rowIndex) => {
                                            const seatStyle = (seatObj) => {
                                                if (!seatObj?.num) return { width: '40px', height: '40px' };
                                                const isBooked = seatData.bookedSeats.includes(seatObj.num);
                                                return {
                                                    width: '40px', height: '40px',
                                                    borderRadius: 'var(--radius-sm)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.875rem', fontWeight: '700',
                                                    color: 'white',
                                                    background: isBooked ? 'var(--danger)' : 'var(--success)',
                                                    cursor: 'default',
                                                    boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.1)'
                                                };
                                            };

                                            if (row.isBack) {
                                                return (
                                                    <div key={rowIndex} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border)' }}>
                                                        {row.seats.map(s => <div key={s.num} style={seatStyle(s)}>{s.num}</div>)}
                                                    </div>
                                                );
                                            }

                                            const leftSeats = row.seats.filter(s => s.pos.startsWith('L'));
                                            const rightSeats = row.seats.filter(s => s.pos.startsWith('R'));

                                            return (
                                                <div key={rowIndex} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                    {/* Left side */}
                                                    <div style={seatStyle(leftSeats[0])}>{leftSeats[0]?.num || ''}</div>
                                                    <div style={seatStyle(leftSeats[1])}>{leftSeats[1]?.num || ''}</div>
                                                    {/* Aisle */}
                                                    <div style={{ width: '24px' }}></div>
                                                    {/* Right side */}
                                                    <div style={seatStyle(rightSeats[0])}>{rightSeats[0]?.num || ''}</div>
                                                    <div style={seatStyle(rightSeats[1])}>{rightSeats[1]?.num || ''}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '2px' }}>BACK OF BUS</div>
                                </div>

                                {/* Right Side: Passenger Details */}
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>Booking Details</h3>
                                    <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        <p><strong>Route:</strong> {seatData.schedule?.route?.origin} → {seatData.schedule?.route?.destination}</p>
                                        <p><strong>Departure:</strong> {formatDate(seatData.schedule?.departureTime)}</p>
                                        <p><strong>Bus:</strong> {seatData.schedule?.bus?.busNumber} ({seatData.capacity} seats)</p>
                                        <p><strong>Booked:</strong> {seatData.bookedSeats.length} / {seatData.capacity}</p>
                                    </div>

                                    <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Passengers</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                        {seatData.bookingDetails?.length === 0 ? (
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No passengers yet.</div>
                                        ) : (
                                            seatData.bookingDetails?.map((b, idx) => (
                                                <div key={idx} style={{ padding: '0.75rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.85rem' }}>
                                                    <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Seat {b.seat}</div>
                                                    <div style={{ color: 'var(--text-secondary)' }}>{b.passenger}</div>
                                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{b.email}</div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageSchedules;
