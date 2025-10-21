import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions as any)
  const role = (session as any)?.user?.role
  if (!session || role !== 'admin') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const geometry = body?.geometry as GeoJSON.MultiPolygon | null
  const { serviceId, name, level, isActive } = body ?? {}

  const data: any = {}
  if (geometry) {
    if (geometry.type !== 'MultiPolygon') {
      return new NextResponse('Invalid geometry type', { status: 400 })
    }
    data.geometry = JSON.stringify(geometry)
  }
  if (typeof serviceId === 'string' && serviceId.length > 0) {
    data.serviceId = serviceId
  }
  if (typeof name === 'string' && name.length > 0) {
    data.name = name
  }
  if (typeof level === 'string' && level.length > 0) {
    data.level = level
  }
  if (typeof isActive === 'boolean') {
    data.isActive = isActive
  }

  if (Object.keys(data).length === 0) {
    return new NextResponse('No changes', { status: 400 })
  }

  const { id } = await params
  await prisma.geofence.update({ where: { id }, data })
  return NextResponse.json({ ok: true })
}


