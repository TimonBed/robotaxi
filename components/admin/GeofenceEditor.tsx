"use client"
import React, { useEffect, useRef } from 'react'
import maplibregl, { Map } from 'maplibre-gl'
import MapLibreDraw from 'maplibre-gl-draw'

type Props = {
  value?: GeoJSON.MultiPolygon | null
  onChange: (geom: GeoJSON.MultiPolygon | null) => void
  overlay?: { url: string | null; opacity?: number; pinToViewKey?: number; sticky?: boolean }
}

export default function GeofenceEditor({ value, onChange, overlay }: Props) {
  const mapRef = useRef<Map | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const drawRef = useRef<any | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
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
                tileSize: 256
              }
            },
            layers: [{ id: 'osm', type: 'raster', source: 'osm' }]
          },
      center: [0, 20],
      zoom: 2
    })
    mapRef.current = map

    const draw = new MapLibreDraw({
      displayControlsDefault: false,
      controls: { polygon: true, trash: true }
    })
    ;(map as any).addControl(draw)
    drawRef.current = draw

    map.on('draw.create', update)
    map.on('draw.update', update)
    map.on('draw.delete', update)

    function update() {
      if (!drawRef.current) return
      const fc = drawRef.current.getAll() as GeoJSON.FeatureCollection
      if (!fc || fc.features.length === 0) {
        onChange(null)
        return
      }
      const multipoly: GeoJSON.MultiPolygon = {
        type: 'MultiPolygon',
        coordinates: fc.features
          .filter(f => f.geometry.type === 'Polygon')
          .map(f => (f.geometry as GeoJSON.Polygon).coordinates)
      }
      onChange(multipoly)
    }

    map.on('load', () => {
      if (value) {
        // seed existing geometry
        value.coordinates.forEach(coords => {
          draw.add({ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: coords } })
        })
      }
    })

    return () => {
      map.remove()
      mapRef.current = null
      drawRef.current = null
    }
  }, [containerRef])

  // Temporary raster image overlay for tracing
  useEffect(() => {
    const map = mapRef.current as any
    if (!map) return
    const sourceId = 'temp-overlay-image'
    const layerId = 'temp-overlay-layer'

    function removeOverlay() {
      if (map.getLayer && map.getLayer(layerId)) map.removeLayer(layerId)
      if (map.getSource && map.getSource(sourceId)) map.removeSource(sourceId)
    }

    if (!overlay?.url) {
      removeOverlay()
      return
    }

    let cancelled = false

    const img = new Image()
    img.onload = () => {
      if (cancelled) return
      const imgW = img.naturalWidth || img.width
      const imgH = img.naturalHeight || img.height
      if (!imgW || !imgH) return

      const computeCoordinates = () => {
        const b = map.getBounds()
        let n = b.getNorth()
        let s = b.getSouth()
        let e = b.getEast()
        let w = b.getWest()
        if (e < w) e += 360
        const viewW = e - w
        const viewH = n - s
        const imgAR = imgW / imgH
        const viewAR = viewW / viewH

        let fitW = viewW
        let fitH = viewH
        if (imgAR > viewAR) {
          fitH = viewW / imgAR
        } else {
          fitW = viewH * imgAR
        }

        const cx = (w + e) / 2
        const cy = (n + s) / 2
        const halfW = fitW / 2
        const halfH = fitH / 2
        const ww = cx - halfW
        let ee = cx + halfW
        const nn = cy + halfH
        const ss = cy - halfH
        if (ee > 180) ee -= 360

        return [
          [ww, nn],
          [ee, nn],
          [ee, ss],
          [ww, ss]
        ]
      }

      const ensureOverlay = () => {
        const coords = computeCoordinates()
        if (map.getSource && map.getSource(sourceId)) {
          const src = map.getSource(sourceId)
          if (typeof (src as any).setCoordinates === 'function') {
            ;(src as any).setCoordinates(coords)
          } else {
            removeOverlay()
            map.addSource(sourceId, { type: 'image', url: overlay.url!, coordinates: coords })
          }
        } else {
          map.addSource(sourceId, { type: 'image', url: overlay.url!, coordinates: coords })
        }
        if (!map.getLayer(layerId)) {
          map.addLayer({ id: layerId, type: 'raster', source: sourceId, paint: { 'raster-opacity': overlay.opacity ?? 0.5 } })
        } else if (overlay.opacity !== undefined) {
          map.setPaintProperty(layerId, 'raster-opacity', overlay.opacity)
        }
      }

      ensureOverlay()

      const onMove = () => {
        if (!overlay?.sticky) return
        ensureOverlay()
      }
      map.on('move', onMove)

      // Cleanup
      const cleanup = () => {
        map.off('move', onMove)
        removeOverlay()
      }
      if (cancelled) cleanup()
      else return cleanup
    }
    img.onerror = () => {
      if (cancelled) return
      removeOverlay()
    }
    img.src = overlay.url

    return () => {
      cancelled = true
      removeOverlay()
    }
  }, [overlay?.url, overlay?.opacity, overlay?.pinToViewKey, overlay?.sticky])

  return <div ref={containerRef} className="h-[70vh] w-full rounded border border-gray-800" />
}


