import { NextFunction, Request, Response } from 'express'
import prisma from '../../../../lib/prisma'
import logger from '../../../../lib/logger'

export async function postCompany(req: Request, res: Response, next: NextFunction) {
  try {
    const { orgId } = req.params
    const { name } = req.body
    const company = await prisma.company.create({
      data: {
        name,
        creatorId: req.auth.id,
        organizationId: orgId,
      },
    })
    res.status(201).json(company)
  } catch (error) {
    logger.error('Error creating company:' + error)
    next(error)
  }
}
