import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import ServiceForm from '@/components/admin/ServiceForm'

export default async function NewServicePage() {
  const session = await getServerSession(authOptions as any)
  const role = (session as any)?.user?.role
  if (!session || role !== 'admin') return <main>Unauthorized</main>
  return (
    <main>
      <div className="mb-3"><a href="/admin/services" className="text-sm text-sky-400">← Back to services</a></div>
      <h1 className="text-lg font-semibold">New Service</h1>
      <ServiceForm
        mode="create"
        initial={{
          name: '',
          operator: '',
          website: '',
          colorHex: '#00E5FF',
          status: 'trial',
          launchedAt: '',
          notes: ''
        }}
      />
    </main>
  )
}


