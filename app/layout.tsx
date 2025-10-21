import './globals.css'
import 'maplibre-gl-draw/dist/mapbox-gl-draw.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import React from 'react'

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
            <h1 className="text-lg font-semibold tracking-tight">RobotaxiMap</h1>
            <nav className="flex items-center gap-4 text-sm text-gray-400">
              <a className="hover:text-gray-200" href="/map">Map</a>
              <a className="hover:text-gray-200" href="/impressum">Impressum</a>
              <a className="hover:text-gray-200" href="/datenschutz">Datenschutz</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}


