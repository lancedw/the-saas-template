import { NextFunction, Response, Request } from 'express'
import logger from '../../../../lib/logger'
import prisma from '../../../../lib/prisma'

export async function patchUser(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params
  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name: req.body.name,
        email: req.body.email,
        countryCode: req.body.countryCode,
        phoneNumber: req.body.phoneNumber,
        settings: req.body.settings,
      },
    })
    return res.status(200).json(user)
  } catch (error) {
    logger.error(error)
    next(error)
  }
}
