import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, CalendarCheck, ShieldCheck, MapPin, ArrowRight, Search, Clock } from 'lucide-react';
import { searchSchedules } from '../api/booking';

const Home = () => {
    const navigate = useNavigate();
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');

    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Initial load of all active schedules
    useEffect(() => {
        handleSearch();
    }, []);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const data = await searchSchedules({ origin, destination, date });
            setSchedules(data);
            if (e) setHasSearched(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <section style={styles.heroSection}>
                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>
                        Your Journey Begins With <span style={{ color: 'var(--accent-color)' }}>Comfort</span>
                    </h1>
                    <p style={styles.heroSubtitle}>
                        Experience seamless, reliable, and secure bus seat bookings. Choose your destination, pick your perfect seat, and travel with peace of mind.
                    </p>

                    <form onSubmit={handleSearch} className="search-mock animate-fade-in-up" style={{ animationDelay: '0.2s', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', backgroundColor: 'var(--surface-color)', padding: '0.5rem', borderRadius: '9999px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: '150px', padding: '0 1rem', borderRight: '1px solid var(--border-color)' }}>
                            <MapPin size={20} color="var(--primary-color)" />
                            <input
                                type="text"
                                placeholder="Leaving from..."
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                style={{ border: 'none', background: 'transparent', outline: 'none', padding: '0.5rem', width: '100%', color: 'var(--text-primary)' }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: '150px', padding: '0 1rem', borderRight: '1px solid var(--border-color)' }}>
                            <MapPin size={20} color="var(--accent-color)" />
                            <input
                                type="text"
                                placeholder="Going to..."
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                style={{ border: 'none', background: 'transparent', outline: 'none', padding: '0.5rem', width: '100%', color: 'var(--text-primary)' }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: '150px', padding: '0 1rem' }}>
                            <CalendarCheck size={20} color="var(--success-color)" />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                style={{ border: 'none', background: 'transparent', outline: 'none', padding: '0.5rem', width: '100%', color: 'var(--text-secondary)' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ borderRadius: '9999px', padding: '0.75rem 2rem', fontWeight: 'bold' }}>
                            <Search size={20} style={{ marginRight: '0.5rem' }} /> Search
                        </button>
                    </form>
                </div>
            </section>

            {/* Search Results Section */}
            <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--text-primary)', borderBottom: '2px solid var(--primary-color)', display: 'inline-block', paddingBottom: '0.5rem' }}>
                    Available Schedules
                </h2>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Searching for routes...</div>
                ) : schedules.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {schedules.map(schedule => (
                            <div key={schedule._id} className="card feature-card-interactive" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                        <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', margin: 0 }}>
                                            {schedule.route.origin} <ArrowRight size={20} style={{ verticalAlign: 'middle', margin: '0 0.5rem' }} /> {schedule.route.destination}
                                        </h3>
                                        <span style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', color: 'var(--primary-color)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                                            {schedule.bus.type} Bus
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-secondary)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} /> {formatDate(schedule.departureTime)}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Bus size={16} /> {schedule.bus.busNumber}</span>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success-color)', marginBottom: '0.5rem' }}>
                                        ${schedule.price}
                                    </div>
                                    <button
                                        onClick={() => navigate(`/book/${schedule._id}`)}
                                        className="btn btn-primary"
                                    >
                                        View Seats
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--surface-color)', borderRadius: '1rem', border: '1px dashed var(--border-color)' }}>
                        <MapPin size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No routes found</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search criteria or date.</p>
                    </div>
                )}
            </section>

            {/* Features Section */}
            <section style={styles.featuresSection}>
                <h2 style={styles.sectionTitle}>Why Choose Us?</h2>
                <div style={styles.featuresGrid}>

                    <div style={styles.featureCard} className="feature-card-interactive">
                        <div style={styles.iconWrapper}><MapPin size={32} color="var(--primary-color)" /></div>
                        <h3>Countless Destinations</h3>
                        <p>Access an extensive network of routes and bus operators all across the country at your fingertips.</p>
                    </div>

                    <div style={styles.featureCard} className="feature-card-interactive">
                        <div style={styles.iconWrapper}><Bus size={32} color="var(--accent-color)" /></div>
                        <h3>Interactive Seat Mapping</h3>
                        <p>Know exactly where you'll sit before you board. Pick window or aisle seats easily using our live map.</p>
                    </div>

                    <div style={styles.featureCard} className="feature-card-interactive">
                        <div style={styles.iconWrapper}><CalendarCheck size={32} color="var(--success-color)" /></div>
                        <h3>Instant Booking</h3>
                        <p>Skip the queues. Your tickets are confirmed in less than 2 seconds, right on your device.</p>
                    </div>

                    <div style={styles.featureCard} className="feature-card-interactive">
                        <div style={styles.iconWrapper}><ShieldCheck size={32} color="var(--primary-color)" /></div>
                        <h3>Secure Verification</h3>
                        <p>Your data and payments are heavily encrypted. Book confidently knowing your information is safe.</p>
                    </div>

                </div>
            </section>
        </div>
    );
};

// Inline styles leveraging the 60:30:10 theme variables injected by index.css
const styles = {
    container: {
        width: '100%',
    },
    heroSection: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem',
        background: 'linear-gradient(135deg, var(--bg-color) 0%, var(--surface-color) 100%)',
        borderBottom: '1px solid var(--border-color)',
        textAlign: 'center'
    },
    heroContent: {
        maxWidth: '1000px',
        width: '100%',
    },
    heroTitle: {
        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
        fontWeight: '800',
        color: 'var(--text-primary)',
        marginBottom: '1.5rem',
        lineHeight: '1.2'
    },
    heroSubtitle: {
        fontSize: '1.25rem',
        color: 'var(--text-secondary)',
        marginBottom: '2.5rem',
        lineHeight: '1.6'
    },
    featuresSection: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 2rem 5rem 2rem',
    },
    sectionTitle: {
        textAlign: 'center',
        fontSize: '2.5rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        marginBottom: '3.5rem'
    },
    featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '2.5rem',
    },
    featureCard: {
        backgroundColor: 'var(--surface-color)',
        padding: '2.5rem 1.5rem',
        borderRadius: '1rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        border: '1px solid var(--border-color)',
        textAlign: 'center',
        transition: 'transform 0.3s ease',
    },
    iconWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: 'var(--bg-color)',
        margin: '0 auto 1.5rem auto'
    }
};

export default Home;
