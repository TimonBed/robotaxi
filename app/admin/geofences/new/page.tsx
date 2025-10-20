import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db/prisma'
import GeofenceEditForm from '@/components/admin/GeofenceEditForm'

export default async function NewGeofencePage() {
  const session = await getServerSession(authOptions as any)
  const role = (session as any)?.user?.role
  if (!session || role !== 'admin') return <main>Unauthorized</main>
  const services = await prisma.service.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })
  return (
    <main>
      <div className="mb-3"><a href="/admin/geofences" className="text-sm text-sky-400">← Back to geofences</a></div>
      <h1 className="text-lg font-semibold">New Geofence</h1>
      <GeofenceEditForm
        geofenceId=""
        initialGeometry={null}
        initialName="Untitled Geofence"
        initialLevel="city"
        initialServiceId={services[0]?.id ?? ''}
        services={services}
        mode="create"
      />
    </main>
  )
}


