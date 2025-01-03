import logger from '../../../../lib/logger'
import prisma from '../../../../lib/prisma'
import { NextFunction, Request, Response } from 'express'

export async function patchOrganization(req: Request, res: Response, next: NextFunction) {
  try {
    const newOrg = await prisma.organization.update({
      where: {
        id: req.params.orgId,
      },
      data: req.body,
    })

    res.status(201).json(newOrg)
  } catch (error) {
    logger.error('Error creating organization:' + error)
    next(error)
  }
}
