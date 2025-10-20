import { prisma } from '@/lib/db/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const geos = await prisma.geofence.findMany({
    where: { isActive: true },
    select: { id: true, serviceId: true, name: true, level: true, statusOverride: true, geometry: true, service: { select: { colorHex: true, status: true, name: true } } }
  })
  const fc = {
    type: 'FeatureCollection',
    features: geos.map((g) => ({
      type: 'Feature',
      properties: {
        id: g.id,
        serviceId: g.serviceId,
        name: g.name,
        level: g.level,
        status: g.statusOverride ?? g.service.status,
        colorHex: g.service.colorHex,
        serviceName: g.service.name
      },
      geometry: typeof g.geometry === 'string' ? JSON.parse(g.geometry as unknown as string) : (g.geometry as any)
    }))
  }
  return NextResponse.json(fc, { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } })
}


