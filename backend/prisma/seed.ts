/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const hasData = await prisma.user.count()

  if (hasData > 0) {
    console.log('Database already has data. Skipping seeding.')
    return
  }

  const user = await prisma.user.create({
    data: {
      id: 'CHANGE-THIS-TO-YOUR-FIREBASE-UID',
      email: 'user@timefusion.com',
      name: 'Test User',
    },
  })

  const org = await prisma.organization.create({
    data: {
      name: 'Test Organization',
      type: 'TEST',
    },
  })

  await prisma.role.create({
    data: {
      role: 'SUPPORT',
      userId: user.id,
      organizationId: org.id,
    },
  })

  const company = await prisma.company.create({
    data: {
      name: 'Test Company',
      creatorId: user.id,
      organizationId: org.id,
    },
  })

  await prisma.employee.createMany({
    data: [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        companyId: company.id,
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Doe',
        companyId: company.id,
      },
      {
        id: '3',
        firstName: 'Bob',
        lastName: 'Doe',
        companyId: company.id,
      },
      {
        id: '4',
        firstName: 'Alice',
        lastName: 'Doe',
        companyId: company.id,
      },
    ],
  })

  await prisma.timepod.createMany({
    data: [
      {
        id: '1',
        IPAddress: '192.168.1.1',
        activeSince: new Date(),
        bootCount: 1,
        carId: '1',
        companyId: company.id,
        disciplines: [],
        failedRequests: 0,
        firebaseClient: 'firebase-client',
        gatewayIp: '192.168.1.1',
        hostname: 'hostname',
        isActive: true,
        lastPingTime: new Date(),
        macAddress: '00:00:00:00:00:00',
        networkId: 'network-id',
        restarts: 0,
        succeededRequests: 0,
        timepodNr: 1,
        totalPings: 1,
        wifiMac: '00:00:00:00:00:00',
        signalStrength: 0,
      },
      {
        id: '2',
        IPAddress: '192.168.1.2',
        activeSince: new Date(),
        bootCount: 1,
        carId: '1',
        companyId: company.id,
        disciplines: [],
        failedRequests: 0,
        firebaseClient: 'firebase-client',
        gatewayIp: '192.168.1.2',
        hostname: 'hostname',
        isActive: true,
        lastPingTime: new Date(),
        macAddress: '00:00:00:00:00:00',
        networkId: 'network-id',
        restarts: 0,
        succeededRequests: 0,
        timepodNr: 1,
        totalPings: 1,
        wifiMac: '00:00:00:00:00:00',
      },
    ],
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
