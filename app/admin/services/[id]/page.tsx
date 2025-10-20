import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import ServiceForm from '@/components/admin/ServiceForm'
import { prisma } from '@/lib/db/prisma'
import { notFound } from 'next/navigation'

export default async function EditServicePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions as any)
  const role = (session as any)?.user?.role
  if (!session || role !== 'admin') return <main>Unauthorized</main>

  const service = await prisma.service.findUnique({ where: { id: params.id } })
  if (!service) return notFound()

  return (
    <main>
      <div className="mb-3"><a href="/admin/services" className="text-sm text-sky-400">← Back to services</a></div>
      <h1 className="text-lg font-semibold">Edit Service</h1>
      <div className="mb-3 text-sm text-gray-400">{service.name}</div>
      <ServiceForm
        mode="edit"
        serviceId={service.id}
        initial={{
          name: service.name,
          operator: service.operator,
          website: service.website ?? undefined,
          colorHex: service.colorHex,
          status: service.status,
          launchedAt: service.launchedAt ? service.launchedAt.toISOString().slice(0,10) : undefined,
          notes: service.notes ?? undefined
        }}
      />
    </main>
  )
}


