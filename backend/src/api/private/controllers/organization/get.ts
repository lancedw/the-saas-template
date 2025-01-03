import { NextFunction, Response, Request } from 'express'
import logger from '../../../../lib/logger'
import prisma from '../../../../lib/prisma'

export async function getOrganization(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params
  try {
    const organization = await prisma.organization.findUnique({
      where: {
        id,
      },
    })
    return res.status(200).json(organization)
  } catch (error) {
    logger.error('Failed to fetch organization: ' + error)
    next(error)
  }
}
