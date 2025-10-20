import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123!'
  const hash = await argon2.hash(adminPassword)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: hash },
    create: { email: adminEmail, passwordHash: hash, role: 'admin' }
  })

  const existing = await prisma.service.findFirst({ where: { name: 'Sample Robotaxi' } })
  const service = existing ?? await prisma.service.create({
    data: {
      name: 'Sample Robotaxi',
      operator: 'Sample Operator',
      website: 'https://example.com',
      colorHex: '#00E5FF',
      status: 'pilot'
    }
  })

  // Simple square polygon near SF Bay Area as sample
  const polygon = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [-122.6, 37.6],
            [-122.2, 37.6],
            [-122.2, 37.9],
            [-122.6, 37.9],
            [-122.6, 37.6]
          ]
        ]
      ]
    }
  }

  await prisma.geofence.create({
    data: {
      serviceId: service.id,
      name: 'SF Pilot Zone',
      level: 'city',
      geometry: JSON.stringify(polygon.geometry),
      isActive: true
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })


