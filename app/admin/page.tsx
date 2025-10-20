import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'

export default async function AdminHome() {
  const session = await getServerSession(authOptions as any)
  const role = (session as any)?.user?.role
  if (!session || role !== 'admin') {
    return (
      <main>
        <h1 className="text-lg font-semibold">Unauthorized</h1>
        <p className="text-sm text-gray-400">Please <Link className="text-sky-400" href="/auth/signin">sign in</Link> with an admin account.</p>
      </main>
    )
  }
  return (
    <main className="grid gap-3">
      <h1 className="text-lg font-semibold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Link className="rounded border border-gray-800 bg-gray-900 p-4 hover:border-gray-700" href="/admin/services">Manage Services</Link>
        <Link className="rounded border border-gray-800 bg-gray-900 p-4 hover:border-gray-700" href="/admin/geofences">Manage Geofences</Link>
        <Link className="rounded border border-gray-800 bg-gray-900 p-4 hover:border-gray-700" href="/admin/stats">Recompute Stats</Link>
      </div>
    </main>
  )
}


