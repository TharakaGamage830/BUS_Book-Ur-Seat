import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Search, Clock, Settings, Ticket, MapPin, Calendar, ArrowRight, Bus } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import { getMyBookings } from '../../api/booking';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try { setBookings(await getMyBookings()); }
            catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const upcoming = bookings.filter(b =>
        b.status === 'confirmed' && new Date(b.schedule?.departureTime) > new Date()
    );
    const totalTrips = bookings.filter(b => b.status === 'confirmed').length;

    return (
        <div className="page-wrapper animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>
                    Welcome back, {user?.name?.split(' ')[0]}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Here's an overview of your trips.</p>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Upcoming Trips', value: upcoming.length, icon: <Calendar size={22} />, color: 'var(--primary)' },
                    { label: 'Total Bookings', value: totalTrips, icon: <Ticket size={22} />, color: 'var(--success)' },
                    { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, icon: <Clock size={22} />, color: 'var(--danger)' },
                ].map((s, i) => (
                    <div key={i} className="stat-card">
                        <div className="stat-icon" style={{ background: `${s.color}11`, color: s.color }}>
                            {s.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{s.value}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <Link to="/book-seat" className="card card-hover" style={{ textDecoration: 'none', padding: '1.5rem', textAlign: 'center' }}>
                    <Search size={28} color="var(--primary)" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
                    <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Book a Seat</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Search and reserve</div>
                </Link>
                <Link to="/history" className="card card-hover" style={{ textDecoration: 'none', padding: '1.5rem', textAlign: 'center' }}>
                    <Clock size={28} color="var(--accent)" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
                    <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Booking History</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>View past trips</div>
                </Link>
                <Link to="/settings" className="card card-hover" style={{ textDecoration: 'none', padding: '1.5rem', textAlign: 'center' }}>
                    <Settings size={28} color="var(--text-secondary)" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
                    <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Settings</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Profile & password</div>
                </Link>
            </div>

            {/* Upcoming trips */}
            <div className="card">
                <h2 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={18} color="var(--primary)" /> Upcoming Trips
                </h2>
                {loading ? (
                    <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>Loading...</p>
                ) : upcoming.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-color)', borderRadius: 'var(--radius-sm)' }}>
                        <Bus size={32} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.3 }} />
                        <p>No upcoming trips. <Link to="/book-seat" style={{ color: 'var(--primary)', fontWeight: '600' }}>Book one now</Link></p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {upcoming.slice(0, 5).map(b => (
                            <div key={b._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--primary)' }}>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                                        {b.schedule?.route?.origin} <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {b.schedule?.route?.destination}
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
                                        <span><Calendar size={11} /> {new Date(b.schedule?.departureTime).toLocaleDateString('en-LK', { dateStyle: 'medium' })}</span>
                                        <span><Clock size={11} /> {new Date(b.schedule?.departureTime).toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span className="badge badge-primary">Seat #{b.seatNumber}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
