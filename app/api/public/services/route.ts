import { prisma } from '@/lib/db/prisma'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const services = await prisma.service.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(services, { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } })
}


