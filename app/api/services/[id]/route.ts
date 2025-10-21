import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const s = await prisma.service.findUnique({ where: { id } })
  if (!s) return new NextResponse('Not found', { status: 404 })
  return NextResponse.json(s)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions as any)
  const role = (session as any)?.user?.role
  if (!session || role !== 'admin') return new NextResponse('Unauthorized', { status: 401 })

  const body = await req.json()
  const { id } = await params
  const updated = await prisma.service.update({ where: { id }, data: {
    name: body.name,
    operator: body.operator,
    website: body.website,
    colorHex: body.colorHex,
    status: body.status,
    launchedAt: body.launchedAt ? new Date(body.launchedAt) : null,
    notes: body.notes
  }})
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions as any)
  const role = (session as any)?.user?.role
  if (!session || role !== 'admin') return new NextResponse('Unauthorized', { status: 401 })
  const { id } = await params
  await prisma.service.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}



