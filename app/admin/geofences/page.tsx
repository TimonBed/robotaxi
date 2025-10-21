import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db/prisma'
import Link from 'next/link'
import * as turf from '@turf/turf'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function GeofencesPage() {
  const session = await getServerSession(authOptions as any)
  const role = (session as any)?.user?.role
  if (!session || role !== 'admin') {
    return <main>Unauthorized</main>
  }
  const geos = await prisma.geofence.findMany({ include: { service: true }, orderBy: { updatedAt: 'desc' } })
  const rows = geos.map(g => {
    const geometry = typeof g.geometry === 'string' ? JSON.parse(g.geometry as unknown as string) : (g.geometry as any)
    let areaKm2 = 0
    try {
      const feature = { type: 'Feature', properties: {}, geometry } as any
      areaKm2 = turf.area(feature) / 1_000_000
    } catch {}
    return { ...g, areaKm2 }
  })
  return (
    <main>
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Geofences</h1>
        <Link className="rounded bg-sky-500 px-3 py-2 text-sm" href="/admin/geofences/new">New Geofence</Link>
      </div>
      <div className="overflow-hidden rounded border border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 text-gray-300">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Service</th>
              <th className="px-3 py-2 text-left">Level</th>
              <th className="px-3 py-2 text-right">Area (km²)</th>
              <th className="px-3 py-2">Active</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(g => (
              <tr key={g.id} className="border-t border-gray-800">
                <td className="px-3 py-2"><Link className="text-sky-400" href={`/admin/geofences/${g.id}`}>{g.name}</Link></td>
                <td className="px-3 py-2">{g.service.name}</td>
                <td className="px-3 py-2">{g.level}</td>
                <td className="px-3 py-2 text-right">{g.areaKm2 ? g.areaKm2.toFixed(2) : '—'}</td>
                <td className="px-3 py-2 text-center">{g.isActive ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}


