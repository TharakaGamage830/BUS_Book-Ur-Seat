import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAnalytics } from '../../api/admin';
import {
    Bus, MapPin, Ticket, TrendingUp, Users, CheckCircle,
    XCircle, ArrowRight, Clock, BarChart2, AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await getAnalytics();
                setAnalytics(data);
            } catch (err) {
                setError('Failed to load analytics.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const formatLKR = (amount) =>
        `Rs. ${Number(amount).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const StatCard = ({ icon, label, value, sub, color, bgColor }) => (
        <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: bgColor }}>
                {React.cloneElement(icon, { size: 26, color })}
            </div>
            <div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    {loading ? '—' : value}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{label}</div>
                {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{loading ? '' : sub}</div>}
            </div>
        </div>
    );

    return (
        <div className="page-wrapper animate-fade-in">
            {/* Page Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <BarChart2 size={28} color="var(--primary)" />
                    Admin Dashboard
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>Overview of your bus booking system &mdash; Sri Lanka</p>
            </div>

            {error && <div className="error-message"><AlertCircle size={16} /> {error}</div>}

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
                <StatCard
                    icon={<Bus />} label="Total Buses" color="#1E40AF" bgColor="rgba(30,64,175,0.12)"
                    value={analytics?.totalBuses ?? '—'}
                    sub={`${analytics?.activeBuses ?? 0} active`}
                />
                <StatCard
                    icon={<MapPin />} label="Active Routes" color="#F59E0B" bgColor="rgba(245,158,11,0.12)"
                    value={analytics?.activeRoutes ?? '—'}
                    sub={`${analytics?.totalRoutes ?? 0} total routes`}
                />
                <StatCard
                    icon={<Ticket />} label="Total Bookings" color="#10B981" bgColor="rgba(16,185,129,0.12)"
                    value={analytics?.totalBookings ?? '—'}
                    sub={`${analytics?.confirmedBookings ?? 0} confirmed`}
                />
                <StatCard
                    icon={<TrendingUp />} label="Total Revenue" color="#8B5CF6" bgColor="rgba(139,92,246,0.12)"
                    value={analytics ? formatLKR(analytics.totalRevenue) : '—'}
                    sub="from confirmed bookings"
                />
            </div>

            {/* Dashboard Charts */}
            {!loading && analytics && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>

                    {/* Bookings Trend (Last 7 Days) */}
                    <div className="card">
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Bookings (Last 7 Days)</h2>
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                            {analytics.dailyBookings?.map((day, i) => {
                                const maxCount = Math.max(...analytics.dailyBookings.map(d => d.count), 5); // min 5 max to give scale
                                const height = (day.count / maxCount) * 100;
                                return (
                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '12%', height: '100%', justifyContent: 'flex-end', gap: '0.4rem' }}>
                                        <div style={{ fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{day.count > 0 ? day.count : ''}</div>
                                        <div style={{
                                            width: '100%', height: `${Math.max(height, 2)}%`,
                                            background: 'linear-gradient(to top, var(--primary), #818cf8)',
                                            borderRadius: '6px 6px 0 0', opacity: 0.9, transition: 'height 0.3s ease'
                                        }}></div>
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem' }}>
                            {analytics.dailyBookings?.map((day, i) => (
                                <div key={i} style={{ width: '12%', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                    {day.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Revenue by Route */}
                    <div className="card">
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Top Routes by Revenue</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {analytics.revenueByRoute?.length === 0 ? (
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No revenue data.</div>
                            ) : analytics.revenueByRoute?.map((route, i) => {
                                const maxRev = Math.max(analytics.revenueByRoute[0]?.revenue || 1, 1);
                                const width = (route.revenue / maxRev) * 100;
                                return (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                                            <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }} title={route.route}>
                                                {route.route.length > 25 ? route.route.substring(0, 25) + '...' : route.route}
                                            </span>
                                            <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{formatLKR(route.revenue)}</span>
                                        </div>
                                        <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${Math.max(width, 2)}%`, background: 'var(--success)', borderRadius: '4px' }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Grid: Utilization, Actions, Bookings */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>

                {/* Bus Utilization */}
                <div className="card">
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Bus Utilization (Upcoming)</h2>
                    {loading ? (
                        <div style={{ color: 'var(--text-muted)' }}>Loading...</div>
                    ) : analytics?.busUtilization?.length === 0 ? (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No upcoming schedules.</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {analytics.busUtilization?.map((bus, i) => {
                                const pct = Math.round((bus.booked / bus.capacity) * 100);
                                const isFull = pct >= 90;
                                return (
                                    <div key={i} style={{ padding: '0.75rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <div>
                                                <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{bus.busNumber}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{bus.route} · {new Date(bus.departureTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: '800', color: isFull ? 'var(--danger)' : 'var(--primary)', fontSize: '0.95rem' }}>{pct}%</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{bus.booked}/{bus.capacity} seats</div>
                                            </div>
                                        </div>
                                        <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${pct}%`, background: isFull ? 'var(--danger)' : 'var(--primary)', borderRadius: '3px' }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="card">
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
                        Quick Actions
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { to: '/admin/buses', icon: <Bus size={20} />, label: 'Manage Buses', desc: 'Add, edit, or deactivate buses', color: '#1E40AF', bg: 'rgba(30,64,175,0.08)' },
                            { to: '/admin/routes', icon: <MapPin size={20} />, label: 'Manage Routes', desc: 'View & configure routes', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
                            { to: '/admin/schedules', icon: <Clock size={20} />, label: 'Manage Schedules', desc: 'Set departure times & pricing', color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
                            { to: '/admin/bookings', icon: <Ticket size={20} />, label: 'Manage Bookings', desc: 'View and cancel passenger tickets', color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)' },
                        ].map((action) => (
                            <Link
                                key={action.to}
                                to={action.to}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    background: action.bg,
                                    textDecoration: 'none',
                                    transition: 'all var(--transition)',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', background: `${action.bg}`, border: `1px solid ${action.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: action.color }}>
                                    {action.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{action.label}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{action.desc}</div>
                                </div>
                                <ArrowRight size={18} color="var(--text-muted)" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Recent Bookings</h2>
                        <Link to="/admin/bookings" className="btn btn-ghost btn-sm">View all</Link>
                    </div>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading...</div>
                    ) : analytics?.recentBookings?.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No bookings yet.</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {analytics?.recentBookings?.map((b) => (
                                <div key={b._id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--border)',
                                    background: 'var(--bg-color)'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                            {b.schedule?.route?.origin} → {b.schedule?.route?.destination}
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                            {b.user?.name} · Seat #{b.seatNumber}
                                        </div>
                                    </div>
                                    <span className={`badge badge-${b.status === 'confirmed' ? 'success' : 'danger'}`}>
                                        {b.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
