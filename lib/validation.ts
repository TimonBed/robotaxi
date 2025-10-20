import { z } from 'zod'

export const serviceSchema = z.object({
  name: z.string().min(2),
  operator: z.string().min(2),
  website: z.string().url().optional().or(z.literal('')),
  colorHex: z.string().regex(/^#([0-9a-fA-F]{6})$/),
  status: z.enum(['trial','pilot','limited','full','paused']),
  launchedAt: z.string().datetime().optional().or(z.literal('')),
  notes: z.string().max(5000).optional().or(z.literal(''))
})

export const geofenceSchema = z.object({
  serviceId: z.string().min(1),
  name: z.string().min(2),
  level: z.enum(['city','metro','region','country','corridor','test']),
  statusOverride: z.enum(['trial','pilot','limited','full','paused']).optional(),
  properties: z.any().optional(),
  geometry: z.object({ type: z.literal('MultiPolygon'), coordinates: z.any() })
})


