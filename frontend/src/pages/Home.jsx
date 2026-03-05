import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Search, Clock, Calendar, ArrowRight, Bus, Shield, Zap, Armchair, Lock } from 'lucide-react';
import { searchSchedules } from '../api/booking';
import AuthContext from '../context/AuthContext';

const SL_CITIES = ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Matara', 'Negombo', 'Trincomalee', 'Batticaloa', 'Anuradhapura', 'Badulla', 'Nuwara Eliya', 'Kurunegala'];

const Home = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [searchParams, setSearchParams] = useState({ origin: '', destination: '', date: '' });
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasSearched, setHasSearched] = useState(false);

    // Logged-in users: redirect to their dashboard
    useEffect(() => {
        if (user) {
            navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
        }
    }, [user, navigate]);

    useEffect(() => { loadAll(); }, []);

    const loadAll = async () => {
        setLoading(true);
        try { setSchedules(await searchSchedules({})); }
        catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try { setSchedules(await searchSchedules(searchParams)); setHasSearched(true); }
        catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    // Don't render if user is logged in (will redirect)
    if (user) return null;

    return (
        <div style={{ width: '100%' }}>
            {/* HERO */}
            <section className="hero-section" style={{ padding: '3.5rem 1.25rem 2.5rem', textAlign: 'center' }}>
                <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: '800', color: '#fff', marginBottom: '0.75rem', lineHeight: 1.2 }}>
                        Book Your Bus Seat Across <span style={{ color: '#FBBF24' }}>Sri Lanka</span>
                    </h1>
                    <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
                        Colombo to Kandy, Galle to Jaffna — find and reserve seats instantly.
                    </p>
                </div>
            </section>

            {/* SEARCH CARD */}
            <div style={{ maxWidth: 'var(--max-width)', margin: '-2rem auto 0', padding: '0 1.25rem', position: 'relative', zIndex: 2 }}>
                <div className="card" style={{ padding: '1.5rem 1.75rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Search your next journey</h2>
                    <form onSubmit={handleSearch}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
                            <div style={{ flex: '1 1 180px' }}>
                                <label className="form-label"><MapPin size={12} style={{ display: 'inline', marginRight: '0.2rem', verticalAlign: 'middle' }} /> Origin</label>
                                <input type="text" className="form-control" list="from-cities" placeholder="e.g. Colombo" value={searchParams.origin} onChange={e => setSearchParams({ ...searchParams, origin: e.target.value })} />
                                <datalist id="from-cities">{SL_CITIES.map(c => <option key={c} value={c} />)}</datalist>
                            </div>
                            <div style={{ flex: '1 1 180px' }}>
                                <label className="form-label"><MapPin size={12} style={{ display: 'inline', marginRight: '0.2rem', verticalAlign: 'middle' }} /> Destination</label>
                                <input type="text" className="form-control" list="to-cities" placeholder="e.g. Kandy" value={searchParams.destination} onChange={e => setSearchParams({ ...searchParams, destination: e.target.value })} />
                                <datalist id="to-cities">{SL_CITIES.map(c => <option key={c} value={c} />)}</datalist>
                            </div>
                            <div style={{ flex: '1 1 160px' }}>
                                <label className="form-label"><Calendar size={12} style={{ display: 'inline', marginRight: '0.2rem', verticalAlign: 'middle' }} /> Travel Date</label>
                                <input type="date" className="form-control" value={searchParams.date} onChange={e => setSearchParams({ ...searchParams, date: e.target.value })} />
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg" style={{ flexShrink: 0 }}>
                                <Search size={16} /> Find Buses
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* RESULTS — Guest: no prices */}
            <section style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '2rem 1.25rem 3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {hasSearched ? `Available Buses (${schedules.length})` : 'Available Buses'}
                    </h2>
                    {hasSearched && (
                        <button className="btn btn-ghost btn-sm" onClick={() => { setSearchParams({ origin: '', destination: '', date: '' }); setHasSearched(false); loadAll(); }}>
                            Clear search
                        </button>
                    )}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        <Bus size={32} style={{ margin: '0 auto 0.5rem', display: 'block', animation: 'pulse 1.5s infinite', opacity: 0.4 }} />
                        <p>Finding available buses...</p>
                    </div>
                ) : schedules.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <MapPin size={40} color="var(--border-strong)" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.35rem' }}>No buses found</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Try different cities or a different date.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {schedules.map((s, i) => (
                            <div key={s._id} className="card animate-fade-in" style={{ padding: '1.25rem 1.5rem', borderLeft: '4px solid var(--primary)', animationDelay: `${i * 0.04}s`, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ flex: '1 1 300px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem', flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>BUS {s.bus?.busNumber}</span>
                                        <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{s.bus?.type}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.35rem 0' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '1.15rem', fontWeight: '800' }}>{new Date(s.departureTime).toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' })}</div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.route?.origin}</div>
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 0.5rem', minWidth: '80px' }}>
                                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{s.route?.estimatedDuration || 'Direct'}</div>
                                            <div style={{ width: '100%', height: '2px', background: 'var(--border)', position: 'relative' }}>
                                                <div style={{ position: 'absolute', left: 0, top: '-3px', width: '8px', height: '8px', borderRadius: '50%', border: '2px solid var(--border-strong)', background: 'var(--surface)' }} />
                                                <div style={{ position: 'absolute', right: 0, top: '-3px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
                                            </div>
                                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Direct</div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '1.15rem', fontWeight: '800' }}>{new Date(s.arrivalTime).toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' })}</div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.route?.destination}</div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem' }}>
                                        <Calendar size={11} /> {new Date(s.departureTime).toLocaleDateString('en-LK', { dateStyle: 'medium' })}
                                    </div>
                                </div>

                                {/* Price hidden for guests */}
                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <Lock size={14} />
                                        <span style={{ fontStyle: 'italic' }}>Sign in to see price</span>
                                    </div>
                                    <Link to="/login" className="btn btn-accent btn-sm">Sign In to Book</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* FEATURES */}
            <section style={{ background: 'var(--section-bg)', padding: '3.5rem 1.25rem' }}>
                <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '2.5rem', color: 'var(--text-primary)' }}>Why Choose Us?</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                        {[
                            { icon: <MapPin size={24} />, color: 'var(--primary)', title: 'Island-Wide Coverage', desc: 'Routes spanning Colombo to Jaffna, Galle to Trincomalee.' },
                            { icon: <Armchair size={24} />, color: 'var(--accent)', title: 'Live Seat Map', desc: 'See available seats and pick your favourite before boarding.' },
                            { icon: <Zap size={24} />, color: 'var(--success)', title: 'Instant Confirmation', desc: 'Skip the bus stand queue. Your ticket is confirmed in seconds.' },
                            { icon: <Shield size={24} />, color: '#8B5CF6', title: 'Secure Booking', desc: 'Data protected with modern encryption and authentication.' },
                        ].map((f, i) => (
                            <div key={i} className="card feature-card-interactive" style={{ padding: '1.75rem 1.25rem', textAlign: 'center' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-md)', background: `${f.color}11`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: f.color }}>{f.icon}</div>
                                <h3 style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.4rem' }}>{f.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ borderTop: '1px solid var(--border)', padding: '1.75rem 1.25rem', textAlign: 'center' }}>
                <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Bus size={16} /> BUS Book-Ur-Seat
                    </span>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <a href="#" style={{ color: 'inherit' }}>Privacy Policy</a>
                        <a href="#" style={{ color: 'inherit' }}>Terms of Service</a>
                        <a href="#" style={{ color: 'inherit' }}>Contact Us</a>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>&copy; 2026 BUS. All rights reserved.</span>
                </div>
            </footer>
        </div>
    );
};

export default Home;
