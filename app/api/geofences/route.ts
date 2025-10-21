import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any)
  const role = (session as any)?.user?.role
  if (!session || role !== 'admin') return new NextResponse('Unauthorized', { status: 401 })
  const body = await req.json().catch(() => ({}))
  const { serviceId, name, level, geometry } = body ?? {}
  if (!serviceId || !name || !level || !geometry || geometry.type !== 'MultiPolygon') {
    return new NextResponse('Missing fields', { status: 400 })
  }
  const created = await prisma.geofence.create({ data: {
    serviceId,
    name,
    level,
    geometry: JSON.stringify(geometry),
    isActive: true
  }})
  return NextResponse.json(created)
}



