import { NextFunction, Request, Response } from 'express'
import logger from '../../../../lib/logger'
import prisma from '../../../../lib/prisma'

async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string }

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    })

    return res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    logger.error(error)
    next(error)
  }
}

export { deleteUser }
