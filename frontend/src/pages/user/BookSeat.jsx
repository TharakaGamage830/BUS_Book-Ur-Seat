import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Calendar, ArrowRight, Clock, Bus } from 'lucide-react';
import { searchSchedules } from '../../api/booking';
import AuthContext from '../../context/AuthContext';

const SL_CITIES = ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Matara', 'Negombo', 'Trincomalee', 'Batticaloa', 'Anuradhapura', 'Badulla', 'Nuwara Eliya', 'Kurunegala'];

const BookSeat = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [params, setParams] = useState({ origin: '', destination: '', date: '' });
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searched, setSearched] = useState(false);

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
        try { setSchedules(await searchSchedules(params)); setSearched(true); }
        catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const formatLKR = (v) => `Rs. ${Number(v).toLocaleString('en-LK')}`;

    return (
        <div className="page-wrapper animate-fade-in">
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.25rem' }}>Book a Seat</h1>

            {/* Search */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <form onSubmit={handleSearch}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
                        <div style={{ flex: '1 1 180px' }}>
                            <label className="form-label"><MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.2rem' }} /> Origin</label>
                            <input type="text" className="form-control" list="from" placeholder="e.g. Colombo" value={params.origin} onChange={e => setParams({ ...params, origin: e.target.value })} />
                            <datalist id="from">{SL_CITIES.map(c => <option key={c} value={c} />)}</datalist>
                        </div>
                        <div style={{ flex: '1 1 180px' }}>
                            <label className="form-label"><MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.2rem' }} /> Destination</label>
                            <input type="text" className="form-control" list="to" placeholder="e.g. Kandy" value={params.destination} onChange={e => setParams({ ...params, destination: e.target.value })} />
                            <datalist id="to">{SL_CITIES.map(c => <option key={c} value={c} />)}</datalist>
                        </div>
                        <div style={{ flex: '1 1 150px' }}>
                            <label className="form-label"><Calendar size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.2rem' }} /> Date</label>
                            <input type="date" className="form-control" value={params.date} onChange={e => setParams({ ...params, date: e.target.value })} />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ flexShrink: 0 }}>
                            <Search size={16} /> Find Buses
                        </button>
                    </div>
                </form>
            </div>

            {/* Results */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: '700' }}>
                    {searched ? `Results (${schedules.length})` : 'Available Buses'}
                </h2>
                {searched && (
                    <button className="btn btn-ghost btn-sm" onClick={() => { setParams({ origin: '', destination: '', date: '' }); setSearched(false); loadAll(); }}>Clear</button>
                )}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <Bus size={32} style={{ margin: '0 auto 0.5rem', display: 'block', opacity: 0.3, animation: 'pulse 1.5s infinite' }} />
                    <p>Finding buses...</p>
                </div>
            ) : schedules.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <MapPin size={36} color="var(--border-strong)" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
                    <p style={{ color: 'var(--text-muted)' }}>No buses found. Try different cities or date.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {schedules.map((s, i) => (
                        <div key={s._id} className="card animate-fade-in" style={{ padding: '1.25rem 1.5rem', borderLeft: '4px solid var(--primary)', animationDelay: `${i * 0.04}s`, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ flex: '1 1 300px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>BUS {s.bus?.busNumber}</span>
                                    <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{s.bus?.type}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.35rem 0' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.15rem', fontWeight: '800' }}>{new Date(s.departureTime).toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' })}</div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.route?.origin}</div>
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 0.5rem', minWidth: '80px' }}>
                                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{s.route?.estimatedDuration || 'Direct'}</div>
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
                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                <div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{formatLKR(s.price)}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/ seat</div>
                                </div>
                                <button className="btn btn-accent btn-sm" onClick={() => navigate(`/book/${s._id}`)}>Select Seats</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookSeat;
