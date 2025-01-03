import { NextFunction, Response, Request } from 'express'
import logger from '../../../../lib/logger'
import prisma from '../../../../lib/prisma'

export async function getCompanies(req: Request, res: Response, next: NextFunction) {
  const { orgId } = req.params
  try {
    const companies = await prisma.company.findMany({
      where: {
        organizationId: orgId,
      },
    })

    return res.status(200).json(companies)
  } catch (error) {
    logger.error(error)
    next(error)
  }
}
