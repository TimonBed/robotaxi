"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import ServiceLayers from './ServiceLayers'
import Legend from './Legend'

export default function WorldMap({ allowedStatuses, allowedServiceIds }: { allowedStatuses?: string[]; allowedServiceIds?: string[] }) {
  const mapRef = useRef<maplibregl.Map | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [services, setServices] = useState<{ id: string; name: string; colorHex: string; status?: string }[]>([])

  useEffect(() => {
    if (!containerRef.current) return
    if (mapRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: process.env.NEXT_PUBLIC_MAPTILER_KEY
        ? `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`
        : {
            version: 8,
            sources: {
              osm: {
                type: 'raster',
                tiles: [
                  'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                  'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                  'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
                ],
                tileSize: 256,
                attribution:
                  '© OpenStreetMap contributors'
              }
            },
            layers: [
              {
                id: 'osm',
                type: 'raster',
                source: 'osm'
              }
            ]
          },
      center: [0, 20],
      zoom: 1.5,
      attributionControl: true
    })
    mapRef.current = map

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }))
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 120, unit: 'metric' }))
    map.on('load', () => setMapReady(true))

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    fetch('/api/public/services', { next: { revalidate: 300 } })
      .then(r => r.json())
      .then(setServices)
      .catch(() => setServices([]))
  }, [])

  return (
    <div className="relative">
      <div ref={containerRef} className="map-container" />
      <Legend services={services} />
      <ServiceLayers map={mapRef.current} dataUrl="/api/public/geofences" allowedStatuses={allowedStatuses} allowedServiceIds={allowedServiceIds} />
    </div>
  )
}


