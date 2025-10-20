import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

export default async function AdminStatsPage() {
  const session = await getServerSession(authOptions as any)
  const role = (session as any)?.user?.role
  if (!session || role !== 'admin') return <main>Unauthorized</main>
  return (
    <main>
      <h1 className="text-lg font-semibold">Recompute Stats</h1>
      <p className="text-sm text-gray-400">Endpoint coming soon.</p>
    </main>
  )
}


