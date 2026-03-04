import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, CalendarCheck, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';

const Home = () => {
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
                    <div className="animate-fade-in-up" style={{ ...styles.heroAction, animationDelay: '0.2s' }}>
                        <Link to="/login" className="btn btn-primary" style={styles.primaryBtn}>
                            Book Now <ArrowRight size={20} />
                        </Link>
                        <Link to="/register" className="btn btn-outline" style={styles.outlineBtn}>
                            Create Account
                        </Link>
                    </div>

                    <div className="search-mock animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <MapPin size={24} color="var(--text-secondary)" style={{ marginLeft: '1rem' }} />
                        <input type="text" placeholder="Where do you want to go?" disabled />
                        <button onClick={() => window.location.href = '/login'}>Search</button>
                    </div>
                </div>
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
        maxWidth: '800px',
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
    heroAction: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    primaryBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '1rem 2rem',
        fontSize: '1.1rem'
    },
    outlineBtn: {
        display: 'inline-block',
        padding: '1rem 2rem',
        fontSize: '1.1rem',
        fontWeight: '600',
        color: 'var(--primary-color)',
        backgroundColor: 'transparent',
        border: '2px solid var(--primary-color)',
        borderRadius: '0.375rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    featuresSection: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '5rem 2rem',
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
