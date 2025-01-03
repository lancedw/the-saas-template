import logger from '../../../../lib/logger'
import prisma from '../../../../lib/prisma'
import { NextFunction, Request, Response } from 'express'

export async function postOrganization(req: Request, res: Response, next: NextFunction) {
  try {
    const role = req.body.role
    const orgName = req.body.name

    const newOrg = await prisma.organization.create({
      data: {
        name: orgName,
        type: 'REAL',
      },
    })

    await prisma.role.create({
      data: {
        role: role,
        organizationId: newOrg.id,
        userId: req.auth.id,
      },
    })

    res.status(201).json(newOrg)
  } catch (error) {
    logger.error('Error creating organization:' + error)
    next(error)
  }
}
