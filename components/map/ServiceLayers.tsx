"use client"
import React, { useEffect } from 'react'
import * as turf from '@turf/turf'
import maplibregl, { Map } from 'maplibre-gl'

export default function ServiceLayers({ map, dataUrl, allowedStatuses, allowedServiceIds }: { map: Map | null; dataUrl: string; allowedStatuses?: string[]; allowedServiceIds?: string[] }) {
  useEffect(() => {
    if (!map) return
    const m = map as any

    let aborted = false
    const sourceId = 'robotaxi-geofences'

    async function load() {
      const res = await fetch(dataUrl, { next: { revalidate: 300 } })
      const geojson = await res.json()
      if (aborted) return

      if (m.getSource && m.getSource(sourceId)) {
        ;(m.getSource(sourceId) as any).setData(geojson)
      } else {
        m.addSource(sourceId, {
          type: 'geojson',
          data: geojson,
          promoteId: 'id'
        })
        m.addLayer({
          id: 'geofill',
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': ['get', 'colorHex'],
            'fill-opacity': 0.35
          }
        })
        m.addLayer({
          id: 'geoline',
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': ['get', 'colorHex'],
            'line-width': 1.2
          }
        })

        const popup = new (maplibregl as any).Popup({ closeButton: false, closeOnClick: false })
        const onMoveInLayer = (e: any) => {
          const features = e.features || []
          if (!features.length) {
            popup.remove()
            m.getCanvas && m.getCanvas().style && (m.getCanvas().style.cursor = '')
            return
          }
          const f = features[0]
          m.getCanvas && m.getCanvas().style && (m.getCanvas().style.cursor = 'pointer')
          let areaKm2 = 0
          try {
            const feature = f as any
            const geom = feature.geometry.type === 'Polygon' ? turf.multiPolygon([feature.geometry.coordinates]) : feature
            areaKm2 = turf.area(geom as any) / 1_000_000
          } catch {}
          const html = `<div style=\"font-size:12px;line-height:1.2\"><div><strong>${f.properties?.name ?? ''}</strong></div><div>${areaKm2 ? areaKm2.toFixed(2) : '—'} km²</div></div>`
          popup.setLngLat(e.lngLat).setHTML(html).addTo(m)
        }
        const onLeaveLayer = () => {
          popup.remove()
          m.getCanvas && m.getCanvas().style && (m.getCanvas().style.cursor = '')
        }
        m.on('mousemove', 'geofill', onMoveInLayer)
        m.on('mouseleave', 'geofill', onLeaveLayer)
      }
    }

    if (map.loaded()) load()
    else map.once('load', load)

    return () => {
      aborted = true
      if (m.getLayer && m.getLayer('geoline')) m.removeLayer('geoline')
      if (m.getLayer && m.getLayer('geofill')) m.removeLayer('geofill')
      if (m.getSource && m.getSource(sourceId)) m.removeSource(sourceId)
    }
  }, [map, dataUrl])

  // Apply style filters when selections change
  useEffect(() => {
    if (!map) return
    const m = map as any
    const statusFilter = (allowedStatuses && allowedStatuses.length)
      ? ['match', ['get', 'status'], allowedStatuses, true, false]
      : true
    const serviceFilter = (allowedServiceIds && allowedServiceIds.length)
      ? ['match', ['get', 'serviceId'], allowedServiceIds, true, false]
      : true
    const combined = ['all', statusFilter, serviceFilter]
    if (m.getLayer && m.getLayer('geofill')) m.setFilter('geofill', combined as any)
    if (m.getLayer && m.getLayer('geoline')) m.setFilter('geoline', combined as any)
  }, [map, allowedStatuses, allowedServiceIds])

  return null
}


