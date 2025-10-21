import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import GeofenceEditForm from '@/components/admin/GeofenceEditForm'
import { prisma } from '@/lib/db/prisma'
import { notFound } from 'next/navigation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function EditGeofencePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions as any)
  const role = (session as any)?.user?.role
  if (!session || role !== 'admin') return <main>Unauthorized</main>

  const geofence = await prisma.geofence.findUnique({ where: { id: params.id }, include: { service: true } })
  if (!geofence) return notFound()

  const initialGeom = typeof geofence.geometry === 'string' ? JSON.parse(geofence.geometry as unknown as string) : (geofence.geometry as any)
  const services = await prisma.service.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })

  return (
    <main>
      <div className="mb-3"><a href="/admin/geofences" className="text-sm text-sky-400">← Back to geofences</a></div>
      <h1 className="text-lg font-semibold">Edit Geofence</h1>
      <div className="mb-3 text-sm text-gray-400">{geofence.name} — {geofence.service.name}</div>
      <GeofenceEditForm
        geofenceId={geofence.id}
        initialGeometry={initialGeom}
        initialName={geofence.name}
        initialLevel={geofence.level}
        initialServiceId={geofence.serviceId}
        services={services}
      />
    </main>
  )
}


