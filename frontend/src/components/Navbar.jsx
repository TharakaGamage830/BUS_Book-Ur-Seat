import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, User, LogOut } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import ThemeContext from '../context/ThemeContext';
// Using the logo from public folder assuming we move or reference it correctly
// For Vite we can reference absolute paths from public, but standard best practice is importing from assets. Let's assume it's moved to public.

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="nav-brand">
                    {/* Logo switches based on light/dark mode */}
                    <img
                        src={theme === 'dark' ? '/BUS_logo_with_txt_dark-mode.png' : '/BUS_logo_with_txt_light-mode.png'}
                        alt="Bus Book-Ur-Seat Logo"
                    />
                </Link>
                <div className="nav-links">
                    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    {user ? (
                        <>
                            <Link to="/profile" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                                <User size={18} /> {user.name}
                            </Link>
                            <button onClick={handleLogout} className="btn btn-accent" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-primary">Login</Link>
                            <Link to="/register" className="btn btn-accent">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
