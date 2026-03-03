'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from '@/components/ThemeProvider'
import styles from './Navbar.module.css'

export default function Navbar() {
    const { theme, toggleTheme } = useTheme()

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/BUS_logo.png"
                        alt="BUS Logo"
                        width={44}
                        height={44}
                        className={styles.logoImg}
                    />
                    <div className={styles.logoText}>
                        <span className={styles.brandName}>BUS</span>
                        <span className={styles.brandTagline}>Book Ur Seat</span>
                    </div>
                </Link>

                {/* Nav Links */}
                <div className={styles.navLinks}>
                    <Link href="/" className={styles.navLink}>Home</Link>
                    <Link href="/book" className={styles.navLink}>Book Ticket</Link>
                    <Link href="/my-booking" className={styles.navLink}>My Booking</Link>
                </div>

                {/* Right Actions */}
                <div className={styles.navActions}>
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={styles.themeToggle}
                        aria-label="Toggle theme"
                        id="theme-toggle-btn"
                    >
                        {theme === 'light' ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        )}
                    </button>

                    {/* Admin Link */}
                    <Link href="/admin" className={`btn btn-accent btn-sm ${styles.adminBtn}`} id="admin-login-btn">
                        Admin
                    </Link>
                </div>
            </div>
        </nav>
    )
}
