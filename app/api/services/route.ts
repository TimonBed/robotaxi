import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const services = await prisma.service.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(services)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any)
  const role = (session as any)?.user?.role
  if (!session || role !== 'admin') return new NextResponse('Unauthorized', { status: 401 })

  const body = await req.json()
  const created = await prisma.service.create({ data: {
    name: body.name,
    operator: body.operator,
    website: body.website,
    colorHex: body.colorHex,
    status: body.status,
    launchedAt: body.launchedAt ? new Date(body.launchedAt) : null,
    notes: body.notes
  }})
  return NextResponse.json(created)
}


