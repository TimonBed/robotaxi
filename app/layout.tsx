import './globals.css'
import 'maplibre-gl-draw/dist/mapbox-gl-draw.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import React from 'react'

export const metadata = {
  title: 'RobotaxiMap',
  description: 'Interactive map of robotaxi service geofences and rollout status'
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


