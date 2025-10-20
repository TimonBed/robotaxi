import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db/prisma'
import Link from 'next/link'
import * as turf from '@turf/turf'

export default async function ServicesPage() {
  const session = await getServerSession(authOptions as any)
  const role = (session as any)?.user?.role
  if (!session || role !== 'admin') {
    return <main>Unauthorized</main>
  }
  const services = await prisma.service.findMany({ orderBy: { name: 'asc' }, include: { geofences: true } })
  const rows = services.map(s => {
    let areaKm2 = 0
    for (const g of s.geofences) {
      try {
        const geometry = typeof g.geometry === 'string' ? JSON.parse(g.geometry as unknown as string) : (g.geometry as any)
        const feature = { type: 'Feature', properties: {}, geometry } as any
        areaKm2 += turf.area(feature) / 1_000_000
      } catch {}
    }
    return { ...s, areaKm2 }
  })
  return (
    <main>
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Services</h1>
        <Link className="rounded bg-sky-500 px-3 py-2 text-sm" href="/admin/services/new">New Service</Link>
      </div>
      <div className="overflow-hidden rounded border border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 text-gray-300">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Operator</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Total Area (km²)</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(s => (
              <tr key={s.id} className="border-t border-gray-800">
                <td className="px-3 py-2">{s.name}</td>
                <td className="px-3 py-2">{s.operator}</td>
                <td className="px-3 py-2 text-center">{s.status}</td>
                <td className="px-3 py-2 text-right">{s.areaKm2 ? s.areaKm2.toFixed(2) : '—'}</td>
                <td className="px-3 py-2 text-center">
                  <Link className="text-sky-400" href={`/admin/services/${s.id}`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}


