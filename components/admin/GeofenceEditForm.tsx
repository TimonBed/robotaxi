"use client"
import React, { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import GeofenceEditor from './GeofenceEditor'
import ScreenOverlay from './ScreenOverlay'

type Props = {
  geofenceId: string
  initialGeometry: GeoJSON.MultiPolygon | null
  initialName: string
  initialLevel: string
  initialServiceId: string
  services: { id: string; name: string }[]
  mode?: 'edit' | 'create'
}

export default function GeofenceEditForm({ geofenceId, initialGeometry, initialName, initialLevel, initialServiceId, services, mode = 'edit' }: Props) {
  const router = useRouter()
  const [geometry, setGeometry] = useState<GeoJSON.MultiPolygon | null>(initialGeometry)
  const [name, setName] = useState(initialName)
  const [level, setLevel] = useState(initialLevel)
  const [serviceId, setServiceId] = useState(initialServiceId)
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<string | null>(null)
  const [overlayUrl, setOverlayUrl] = useState<string | null>(null)
  const [overlayOpacity, setOverlayOpacity] = useState(0.5)
  const [overlayKey, setOverlayKey] = useState(0)
  const [overlayScale, setOverlayScale] = useState(1)
  const [overlayRotation, setOverlayRotation] = useState(0)

  // Revoke blob URL when replaced/cleared to avoid leaks
  useEffect(() => {
    return () => {
      if (overlayUrl && overlayUrl.startsWith('blob:')) URL.revokeObjectURL(overlayUrl)
    }
  }, [overlayUrl])

  function handleSave() {
    setStatus(null)
    startTransition(async () => {
      try {
        const isCreate = mode === 'create' || !geofenceId
        const url = isCreate ? `/api/geofences` : `/api/geofences/${geofenceId}`
        const method = isCreate ? 'POST' : 'PATCH'
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ geometry, name, level, serviceId }) })
        if (!res.ok) {
          const msg = await res.text()
          setStatus(`Save failed: ${msg || res.status}`)
          return
        }
        setStatus('Saved')
        if (isCreate) {
          const created = await res.json().catch(() => null)
          if (created?.id) router.push(`/admin/geofences/${created.id}`)
          else router.push('/admin/geofences')
        }
      } catch (e: any) {
        setStatus(`Save failed: ${e?.message ?? 'unknown error'}`)
      }
    })
  }

  return (
    <div className="grid gap-3">
      <div className="grid gap-2 md:grid-cols-3">
        <input className="rounded bg-gray-800 p-2 text-sm" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <select className="rounded bg-gray-800 p-2 text-sm" value={level} onChange={e => setLevel(e.target.value)}>
          {['city','metro','region','country','corridor','test'].map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select className="rounded bg-gray-800 p-2 text-sm" value={serviceId} onChange={e => setServiceId(e.target.value)}>
          {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        <div className="flex items-center gap-2">
          <input
            className="text-xs"
            type="file"
            accept="image/png,image/jpeg"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (!f) return
              const url = URL.createObjectURL(f)
              setOverlayUrl((prev) => {
                if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev)
                return url
              })
              setOverlayKey(k => k + 1)
            }}
          />
          {overlayUrl && (
            <button type="button" className="rounded bg-gray-800 px-2 py-1 text-xs" onClick={() => {
              setOverlayUrl((prev) => {
                if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev)
                return null
              })
            }}>Clear</button>
          )}
        </div>
        <input
          className="rounded bg-gray-800 p-2 text-xs"
          placeholder="or paste external image URL"
          onBlur={(e) => {
            const raw = e.target.value.trim()
            if (!raw) return
            const proxied = `/api/proxy/image?url=${encodeURIComponent(raw)}`
            setOverlayUrl((prev) => {
              if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev)
              return proxied
            })
            setOverlayKey(k => k + 1)
            e.currentTarget.value = ''
          }}
        />
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <span>Opacity</span>
          <input type="range" min={0} max={1} step={0.05} value={overlayOpacity} onChange={e => setOverlayOpacity(parseFloat(e.target.value))} />
          <button type="button" className="rounded bg-gray-800 px-2 py-1" onClick={() => setOverlayKey(k => k + 1)}>Pin to current view</button>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <span>Scale</span>
          <input type="range" min={0.1} max={3} step={0.05} value={overlayScale} onChange={e => setOverlayScale(parseFloat(e.target.value))} />
          <input
            className="w-16 rounded bg-gray-800 p-1 text-right"
            type="number"
            min={0.1}
            max={3}
            step={0.01}
            value={Number.isFinite(overlayScale) ? overlayScale : 1}
            onChange={(e) => {
              const v = parseFloat(e.target.value)
              if (!Number.isFinite(v)) return
              const clamped = Math.max(0.1, Math.min(3, v))
              setOverlayScale(clamped)
            }}
          />
          <span>x</span>
          <span>Rotate</span>
          <input type="range" min={-180} max={180} step={1} value={overlayRotation} onChange={e => setOverlayRotation(parseFloat(e.target.value))} />
        </div>
      </div>
      <GeofenceEditor value={geometry} onChange={setGeometry} />
      <ScreenOverlay url={overlayUrl} opacity={overlayOpacity} scale={overlayScale} rotationDeg={overlayRotation} />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending || !geometry}
          className="rounded bg-sky-500 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isPending ? 'Saving…' : (mode === 'create' ? 'Create geofence' : 'Save changes')}
        </button>
        {status && <span className="text-sm text-gray-300">{status}</span>}
      </div>
    </div>
  )
}


