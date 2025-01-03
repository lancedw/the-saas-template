import { NextFunction, Response, Request } from 'express'
import logger from '../../../../lib/logger'
import prisma from '../../../../lib/prisma'

export async function getBadges(req: Request, res: Response, next: NextFunction) {
  const { orgId, companyId } = req.params
  try {
    const company = await prisma.company.findFirstOrThrow({
      where: {
        id: companyId,
        organizationId: orgId,
      },
      include: {
        Timepods: {
          select: {
            Badges: true,
          },
        },
      },
    })

    const badges = company.Timepods.map(timepod => timepod.Badges).flat()

    return res.status(200).json(badges)
  } catch (error) {
    logger.error(error)
    next(error)
  }
}
