import './globals.css'
import 'maplibre-gl-draw/dist/mapbox-gl-draw.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import React from 'react'
import Link from 'next/link'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://robotaximap.example'),
  title: {
    default: 'RobotaxiMap — Live robotaxi coverage map',
    template: '%s | RobotaxiMap'
  },
  description: 'Explore autonomous ride service geofences, operators, and rollout status on an interactive world map.',
  alternates: {
    canonical: '/' 
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico'
  },
  openGraph: {
    title: 'RobotaxiMap — Live robotaxi coverage map',
    description: 'Interactive geofences by operator and status, with global coverage stats.',
    url: '/',
    siteName: 'RobotaxiMap',
    images: [
      { url: '/api/proxy/image?src=globe', width: 1200, height: 630, alt: 'RobotaxiMap coverage' }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RobotaxiMap — Live robotaxi coverage map',
    description: 'Explore robotaxi geofences and rollout momentum worldwide.',
    images: ['/api/proxy/image?src=globe']
  },
  robots: {
    index: true,
    follow: true
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <header className="mb-4 flex items-center justify-between">
            <div className="text-lg font-semibold tracking-tight">
              <Link href="/" className="hover:text-gray-300">RobotaxiMap</Link>
            </div>
            <nav className="flex items-center gap-4 text-sm text-gray-400">
              <a className="hover:text-gray-200" href="/map">Map</a>
            </nav>
          </header>
          {children}
          <footer className="mt-8 border-t border-gray-800 pt-4 text-sm text-gray-400">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>© {new Date().getFullYear()} RobotaxiMap</div>
              <nav className="flex items-center gap-4">
                <a className="hover:text-gray-200" href="/impressum">Impressum</a>
                <a className="hover:text-gray-200" href="/datenschutz">Datenschutz</a>
              </nav>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}


