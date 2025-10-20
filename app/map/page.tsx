import React from 'react'
import { headers } from 'next/headers'
import MapWithFilters from '@/components/map/MapWithFilters'

export const fetchCache = 'default-no-store'

async function getStats() {
  const h = headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3001'
  const proto = h.get('x-forwarded-proto') ?? (host.includes('localhost') ? 'http' : 'https')
  const baseUrl = `${proto}://${host}`
  const res = await fetch(`${baseUrl}/api/public/stats`, { cache: 'no-store' })
  try {
    return await res.json()
  } catch {
    return null
  }
}

export default async function MapPage() {
  const stats = await getStats()
  return (
    <main className="grid gap-4">
      <section className="rounded-lg border border-gray-800 bg-gray-900 p-3">
        <h2 className="mb-2 text-sm font-medium text-gray-300">Global Coverage</h2>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 md:grid-cols-4">
          <div>
            <div className="text-2xl font-semibold">{stats ? `${Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(stats.percentArea)}%` : '—'}</div>
            <div className="text-gray-400">World area covered</div>
          </div>
          <div>
            <div className="text-2xl font-semibold">{stats?.populationCovered ? `${Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(stats.percentPopulation)}%` : '—'}</div>
            <div className="text-gray-400">Population covered</div>
          </div>
          <div>
            <div className="text-2xl font-semibold">{stats ? `${Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(stats.areaCoveredKm2)} km²` : '—'}</div>
            <div className="text-gray-400">Active services</div>
          </div>
          <div>
            <div className="text-2xl font-semibold">—</div>
            <div className="text-gray-400">Countries</div>
          </div>
        </div>
      </section>

      <MapWithFilters />
    </main>
  )
}


