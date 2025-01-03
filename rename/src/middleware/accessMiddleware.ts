import { NextFunction, Response, Request } from 'express'
import logger from '../lib/logger'
import prisma from '../lib/prisma'

export default async function accessMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.params.orgId) {
      // Check if user has access to the organization
      const organization = await prisma.organization.findUniqueOrThrow({
        where: {
          id: req.params.orgId,
        },
        include: {
          Roles: {
            where: {
              userId: req.auth.id,
            },
          },
        },
      })

      const userRole = organization.Roles.find(role => role.userId === req.auth.id)

      if (!userRole) {
        throw new Error('User does not have access to this organization')
      }
      req.org = {
        id: req.params.orgId,
        name: req.params.orgName,
        role: userRole.role,
      }
    }

    next()
  } catch (error) {
    logger.error('Error checking org access: ' + error)
    res.status(403).send('Forbidden')
  }
}
