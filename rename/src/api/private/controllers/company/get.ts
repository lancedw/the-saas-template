import { NextFunction, Response, Request } from 'express'
import logger from '../../../../lib/logger'
import prisma from '../../../../lib/prisma'

export async function getCompany(req: Request, res: Response, next: NextFunction) {
  const { orgId, companyId } = req.params
  try {
    const companies = await prisma.company.findFirstOrThrow({
      where: {
        organizationId: orgId,
        id: companyId,
      },
    })

    return res.status(200).json(companies)
  } catch (error) {
    logger.error(error)
    next(error)
  }
}
