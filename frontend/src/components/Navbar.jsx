import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Moon, Sun, User, LogOut, Shield, Bus, MapPin, Clock, Ticket, LayoutDashboard, Search, Settings } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import ThemeContext from '../context/ThemeContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => { logout(); navigate('/login'); };
    const isActive = (path) => location.pathname === path;
    const isAdmin = user?.role === 'admin';
    const isPassenger = user && user.role !== 'admin';

    const adminLinks = [
        { to: '/admin', icon: <LayoutDashboard size={15} />, label: 'Dashboard' },
        { to: '/admin/buses', icon: <Bus size={15} />, label: 'Buses' },
        { to: '/admin/routes', icon: <MapPin size={15} />, label: 'Routes' },
        { to: '/admin/schedules', icon: <Clock size={15} />, label: 'Schedules' },
        { to: '/admin/bookings', icon: <Ticket size={15} />, label: 'Bookings' },
    ];

    const userLinks = [
        { to: '/dashboard', icon: <LayoutDashboard size={15} />, label: 'Dashboard' },
        { to: '/book-seat', icon: <Search size={15} />, label: 'Book Seat' },
        { to: '/history', icon: <Clock size={15} />, label: 'History' },
        { to: '/settings', icon: <Settings size={15} />, label: 'Settings' },
    ];

    return (
        <>
            <nav className="navbar">
                <div className="container">
                    <Link to={isAdmin ? '/admin' : isPassenger ? '/dashboard' : '/'} className="nav-brand" style={{ textDecoration: 'none' }}>
                        <img
                            src={theme === 'dark' ? '/BUS_logo_with_txt_dark-mode.png' : '/BUS_logo_with_txt_light-mode.png'}
                            alt="BUS Logo"
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                        <span style={{ display: 'none', alignItems: 'center', gap: '0.4rem', fontWeight: '800', fontSize: '1.05rem', color: 'var(--primary)' }}>
                            <Bus size={20} /> BUS
                        </span>
                    </Link>

                    <div className="nav-links">
                        {isAdmin && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.6rem', fontSize: '0.7rem', fontWeight: '700', background: 'var(--accent-light)', color: 'var(--accent-hover)', borderRadius: 'var(--radius-full)', border: '1px solid var(--accent-border)' }}>
                                <Shield size={11} /> ADMIN
                            </span>
                        )}

                        <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
                            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                        </button>

                        {user ? (
                            <>
                                <Link to={isAdmin ? '/admin' : '/dashboard'} className="btn btn-ghost btn-sm"><User size={15} /> {user.name.split(' ')[0]}</Link>
                                <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}><LogOut size={15} /></button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Admin sub-nav */}
            {isAdmin && (
                <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
                    <div style={{ display: 'flex', maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 1.25rem' }}>
                        {adminLinks.map(link => (
                            <Link key={link.to} to={link.to} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.55rem 0.85rem', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap', color: isActive(link.to) ? 'var(--primary)' : 'var(--text-muted)', borderBottom: isActive(link.to) ? '2px solid var(--primary)' : '2px solid transparent', transition: 'all 0.15s' }}>
                                {link.icon} {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* User sub-nav */}
            {isPassenger && (
                <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
                    <div style={{ display: 'flex', maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 1.25rem' }}>
                        {userLinks.map(link => (
                            <Link key={link.to} to={link.to} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.55rem 0.85rem', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap', color: isActive(link.to) ? 'var(--primary)' : 'var(--text-muted)', borderBottom: isActive(link.to) ? '2px solid var(--primary)' : '2px solid transparent', transition: 'all 0.15s' }}>
                                {link.icon} {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
