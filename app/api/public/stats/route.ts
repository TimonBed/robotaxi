import { prisma } from '@/lib/db/prisma'
import { NextResponse } from 'next/server'
import * as turf from '@turf/turf'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  // Load geofences
  const geos = await prisma.geofence.findMany({ where: { isActive: true }, select: { geometry: true } })
  const features = geos
    .map((g) => {
      const geometry = typeof g.geometry === 'string' ? JSON.parse(g.geometry as unknown as string) : (g.geometry as any)
      const feature = { type: 'Feature' as const, properties: {}, geometry } as GeoJSON.Feature
      return feature
    })
    .filter((f) => f && f.geometry && (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'))

  function toMulti(f: GeoJSON.Feature): GeoJSON.Feature<GeoJSON.MultiPolygon> {
    if (f.geometry.type === 'MultiPolygon') return f as GeoJSON.Feature<GeoJSON.MultiPolygon>
    const polygon = f.geometry as GeoJSON.Polygon
    return turf.multiPolygon([polygon.coordinates]) as GeoJSON.Feature<GeoJSON.MultiPolygon>
  }

  function unionBatch(fs: GeoJSON.Feature[]): GeoJSON.Feature[] {
    const out: GeoJSON.Feature[] = []
    for (let i = 0; i < fs.length; i += 2) {
      const a = toMulti(fs[i])
      const b = fs[i + 1] ? toMulti(fs[i + 1]) : null
      if (!b) {
        out.push(a)
        continue
      }
      try {
        const u = turf.union(a as any, b as any) as any
        if (u) out.push(u)
        else out.push(a)
      } catch {
        // If union fails, push both to keep progress rather than fail entirely
        out.push(a)
        out.push(b)
      }
    }
    return out
  }

  let working: GeoJSON.Feature[] = features
  // Iteratively union in batches to handle overlaps and reduce double-counting
  // This avoids a single deep union chain that can be brittle
  for (let pass = 0; pass < 8 && working.length > 1; pass++) {
    working = unionBatch(working)
  }
  const unioned = working.length ? toMulti(working[0]) : null

  const areaCoveredKm2 = unioned ? turf.area(unioned as any) / 1_000_000 : 0

  // Very rough world land area constant (km2) — Natural Earth better later
  const worldLandKm2 = 148_940_000
  const percentArea = worldLandKm2 ? (areaCoveredKm2 / worldLandKm2) * 100 : 0

  const payload = {
    areaCoveredKm2: Number(areaCoveredKm2.toFixed(2)),
    worldLandKm2,
    percentArea: Number(percentArea.toFixed(6)),
    populationCovered: null,
    percentPopulation: null
  }

  return NextResponse.json(payload, { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } })
}


