import Link from 'next/link'
import Image from 'next/image'
import styles from './page.module.css'

export default function HomePage() {
    return (
        <div className={styles.page}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.heroBadge}>
                        <span>🚌</span> Sri Lanka&apos;s Smartest Bus Booking
                    </div>
                    <h1 className={styles.heroTitle}>
                        Book Your Bus Seat
                        <span className={styles.heroTitleAccent}> in Seconds</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Choose your route, pick your seat, confirm your journey.
                        Fast, simple and reliable — no queues, no hassle.
                    </p>

                    {/* Search Card */}
                    <div className={styles.searchCard}>
                        <div className={styles.searchRow}>
                            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                                <label className="form-label">From</label>
                                <select className="form-input" id="search-from" defaultValue="">
                                    <option value="" disabled>Select city</option>
                                    <option>Colombo</option>
                                    <option>Kandy</option>
                                    <option>Galle</option>
                                    <option>Matara</option>
                                    <option>Jaffna</option>
                                </select>
                            </div>

                            <div className={styles.swapBtn} title="Swap">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M8 3L4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4" />
                                </svg>
                            </div>

                            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                                <label className="form-label">To</label>
                                <select className="form-input" id="search-to" defaultValue="">
                                    <option value="" disabled>Select city</option>
                                    <option>Colombo</option>
                                    <option>Kandy</option>
                                    <option>Galle</option>
                                    <option>Matara</option>
                                    <option>Jaffna</option>
                                </select>
                            </div>

                            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    id="search-date"
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <Link href="/book" className={`btn btn-accent btn-lg ${styles.searchBtn}`} id="search-buses-btn">
                                Search Buses
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative bus illustration */}
                <div className={styles.heroIllustration}>
                    <Image
                        src="/BUS_logo_with_txt.png"
                        alt="BUS Book Ur Seat"
                        width={360}
                        height={360}
                        className={styles.heroLogo}
                        priority
                    />
                </div>
            </section>

            {/* Features */}
            <section className={styles.features}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Why Book With Us?</h2>
                    <p className={styles.sectionSubtitle}>Simple, fast and reliable bus seat booking</p>

                    <div className={styles.featuresGrid}>
                        {[
                            { icon: '🗺️', title: 'All Major Routes', desc: 'Coverage across all major cities in Sri Lanka' },
                            { icon: '💺', title: 'Live Seat Map', desc: 'See exactly which seats are available in real-time' },
                            { icon: '⚡', title: 'Instant Confirmation', desc: 'Get your booking ID within 2 seconds' },
                            { icon: '🔒', title: 'Secure Booking', desc: 'Your details are always stored safely' },
                        ].map((f) => (
                            <div key={f.title} className={`card card-body ${styles.featureCard}`}>
                                <div className={styles.featureIcon}>{f.icon}</div>
                                <h3 className={styles.featureTitle}>{f.title}</h3>
                                <p className={styles.featureDesc}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <div className="container">
                    <div className={styles.ctaCard}>
                        <h2>Ready to travel?</h2>
                        <p>Find your bus and book your seat now — it takes less than a minute.</p>
                        <Link href="/book" className="btn btn-accent btn-lg" id="cta-book-btn">
                            Book a Seat →
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
