import { NextFunction, Request, Response } from 'express'
import logger from '../../../../lib/logger'
import prisma from '../../../../lib/prisma'

export default async function postCars(req: Request, res: Response, next: NextFunction) {
  try {
    await prisma.$transaction(async tx => {
      const userCompanies = await tx.company.findMany({
        where: {
          organizationId: req.org.id,
        },
      })

      for (const { id, ...car } of req.body) {
        if (!userCompanies.some(company => company.id === car.companyId)) {
          return res.status(401).json('User does not have access to this company')
        }

        await tx.car.upsert({
          where: {
            id: id,
          },
          create: {
            id: car.id,
            active: true,
            companyId: car.companyId,
            creatorId: req.auth.id,
            make: car.make,
            model: car.model,
            licensePlate: car.licensePlate,
            meta: car.meta,
            chassisNr: car.chassisNr,
            owner: car.owner,
          },
          update: {
            active: true,
            make: car.make,
            model: car.model,
            licensePlate: car.licensePlate,
            meta: car.meta,
            chassisNr: car.chassisNr,
            owner: car.owner,
          },
        })
      }
    })
  } catch (error) {
    logger.error('Failed to upsert car: ' + error)
    next(error)
  }
}
