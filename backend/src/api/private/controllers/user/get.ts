import { NextFunction, Response, Request } from 'express'
import logger from '../../../../lib/logger'
import prisma from '../../../../lib/prisma'

export async function getUser(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        id,
        isDeleted: false,
      },
    })
    return res.status(200).json(user)
  } catch (error) {
    logger.error(error)
    next(error)
  }
}
