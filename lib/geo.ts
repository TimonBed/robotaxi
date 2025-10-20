import * as turf from '@turf/turf'

export function toKm2(areaSqMeters: number): number {
  return areaSqMeters / 1_000_000
}

export function unionFeatures(features: GeoJSON.Feature<GeoJSON.MultiPolygon | GeoJSON.Polygon>[]) {
  let acc: any = null
  for (const f of features) {
    const g = f.geometry.type === 'Polygon' ? turf.multiPolygon([ (f.geometry as any).coordinates ]) : f
    acc = acc ? turf.union(acc, g as any) : (g as any)
  }
  return acc as GeoJSON.Feature<GeoJSON.MultiPolygon> | null
}

export function featureAreaKm2(feature: GeoJSON.Feature<GeoJSON.MultiPolygon | GeoJSON.Polygon>): number {
  return toKm2(turf.area(feature as any))
}


