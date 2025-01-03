import { NextFunction, Response, Request } from 'express'
import logger from '../../../../lib/logger'
import prisma from '../../../../lib/prisma'

export async function postBadge(req: Request, res: Response, next: NextFunction) {
  const { badgeUid } = req.params
  try {
    // Only registered timepods can create new badges, otherwise there is no way to identify where the badge belongs to
    const timepod = await prisma.timepod.findFirstOrThrow({
      where: {
        id: req.body.timepodId,
        companyId: {
          not: null,
        },
      },
    })

    const badge = await prisma.badge.upsert({
      where: {
        uid: badgeUid,
      },
      create: {
        uid: badgeUid,
        timepodId: timepod.id,
        companyId: timepod.companyId as string,
      },
      update: {
        timepodId: timepod.id,
        updatedAt: new Date(),
      },
    })
    return res.status(200).json(badge)
  } catch (error) {
    logger.error('Error upserting badge: ' + error)
    next(error)
  }
}
