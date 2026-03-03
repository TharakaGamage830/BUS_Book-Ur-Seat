import type { Metadata } from 'next'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
    title: 'BUS — Book Ur Seat',
    description: 'Book your bus seat easy and fast. Find routes, choose seats and confirm your journey in seconds.',
    keywords: ['bus booking', 'seat reservation', 'online bus ticket'],
    icons: {
        icon: '/BUS_logo.png',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" data-theme="light" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body>
                <ThemeProvider>
                    <Navbar />
                    <main className="page-wrapper">
                        {children}
                    </main>
                </ThemeProvider>
            </body>
        </html>
    )
}
