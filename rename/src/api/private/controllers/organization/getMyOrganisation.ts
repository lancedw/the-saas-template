import { Organization, Roles } from '@prisma/client'
import logger from '../../../../lib/logger'
import prisma from '../../../../lib/prisma'
import { NextFunction, Request, Response } from 'express'

export async function getMyOrganization(req: Request, res: Response, next: NextFunction) {
  try {
    const roles = await prisma.role.findMany({
      where: {
        userId: req.auth.id,
      },
    })

    const currentOrg = roles.find(role => role.organizationId === req.auth.meta?.lastOrgId)

    let role: Roles
    let organization: Organization

    if (currentOrg) {
      role = currentOrg.role
      organization = await prisma.organization.findUniqueOrThrow({
        where: {
          id: req.auth.meta.lastOrgId,
        },
      })
    } else {
      role = roles[0].role
      organization = await prisma.organization.findFirstOrThrow({
        where: {
          id: roles[0].organizationId,
        },
      })
    }

    return res.status(200).json({ organization, role })
  } catch (error) {
    logger.error('Failed to fetch organization: ' + error)
    next(error)
  }
}
