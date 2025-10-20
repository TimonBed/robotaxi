"use client"
import React, { useEffect, useMemo, useState } from 'react'
import WorldMapClient from './WorldMapClient'

type Service = { id: string; name: string; colorHex: string; status?: string }

export default function MapWithFilters() {
  const [services, setServices] = useState<Service[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/public/services', { next: { revalidate: 300 } })
      .then(r => r.json())
      .then(setServices)
      .catch(() => setServices([]))
  }, [])

  const statuses = useMemo(() => ['trial','pilot','limited','full','paused'], [])
  const toggle = (arr: string[], v: string) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]

  return (
    <div className="grid gap-3 md:grid-cols-4">
      <aside className="rounded border border-gray-800 bg-gray-900 p-3 md:col-span-1">
        <div className="flex h-[70vh] flex-col">
          <div className="mb-2 text-sm font-medium text-gray-300">Filters</div>
          <div className="mb-3">
            <div className="mb-1 text-xs text-gray-400">Status</div>
            <div className="flex flex-wrap gap-1">
              {statuses.map(s => (
                <button key={s} onClick={() => setSelectedStatuses(prev => toggle(prev, s))} className={`rounded px-2 py-1 text-xs ${selectedStatuses.includes(s) ? 'bg-sky-600 text-white' : 'bg-gray-800 text-gray-300'}`}>{s}</button>
              ))}
            </div>
          </div>
          <div className="mb-2 text-xs text-gray-400">Services</div>
          <div className="flex-1 overflow-auto pr-1">
            <div className="grid gap-1 text-xs">
              {services.map(s => (
                <label key={s.id} className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 rounded" style={{ background: s.colorHex }} />{s.name}</span>
                  <input type="checkbox" className="accent-sky-500" checked={selectedServiceIds.includes(s.id)} onChange={() => setSelectedServiceIds(prev => toggle(prev, s.id))} />
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>
      <section className="overflow-hidden rounded border border-gray-800 bg-gray-900 p-0 md:col-span-3">
        <WorldMapClient allowedStatuses={selectedStatuses} allowedServiceIds={selectedServiceIds} />
      </section>
    </div>
  )
}


