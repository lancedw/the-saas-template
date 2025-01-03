import { NextFunction, Request, Response } from 'express'
import admin from 'firebase-admin'
import logger from '../../../../lib/logger'
import prisma from '../../../../lib/prisma'

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.params.id
    const user = await admin.auth().getUser(userId)

    await prisma.$transaction(async tx => {
      await tx.user.create({
        data: {
          id: userId,
          email: user.email as string,
        },
      })

      const organization = await tx.organization.create({
        data: {
          license: 'TRAIL',
          type: 'REAL',
          name: `${user.email ? user.email.split('@')[0] + "'s" : userId} Organization`,
        },
      })

      await tx.role.create({
        data: {
          userId: userId,
          organizationId: organization.id,
          role: 'ADMIN',
        },
      })
    })
  } catch (error) {
    logger.error('Error creating user: ' + error)
    next(error)
  }
}
