import express, { Request, Response } from 'express'
import { TimePodResponse, TimePodStatus } from '../../../../types/timepod.types'
import logger from '../../../../lib/logger'
import prisma from '../../../../lib/prisma'
import { Prisma } from '@prisma/client'

const router = express.Router()

router.post('/', async (req: Request, res: Response<TimePodResponse>) => {
  // validate bearer token
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({
      status: TimePodStatus.Unauthorized,
      error: 'No Bearer Token',
    })
  }
  const bearer = authHeader.split('Bearer ')[1]

  if (bearer !== process.env.TIME_POD_TOKEN) {
    return res.status(401).json({
      status: TimePodStatus.Unauthorized,
      error: 'Invalid Bearer Token',
    })
  }

  try {
    const { id, badge_uid, discipline } = req.body

    const currentTime = new Date()

    await prisma.$transaction(async tx => {
      const rawLog = await tx.timeRecordRaw.create({
        data: {
          timepodId: id,
          badgeUid: badge_uid,
          status: 'received',
          extra: req.body,
        },
      })

      const timepod = await tx.timepod.update({
        where: {
          id: id,
        },
        data: {
          lastPingTime: currentTime.toISOString(),
        },
        include: {
          Company: {
            include: {
              AutoClose: true,
            },
          },
        },
      })

      if (!timepod.companyId) {
        await tx.timeRecordRaw.update({
          where: { id: rawLog.id },
          data: {
            status: 'no_company',
          },
        })
        logger.warn(`Timepod ${id} is not registered to a company`)
        return res.status(422).json({
          status: TimePodStatus.NoCompany,
          error: 'Timepod is not registered to a company',
        })
      }

      if (!timepod.timepodNr) {
        await tx.timeRecordRaw.update({
          where: { id: rawLog.id },
          data: {
            status: 'no_timepod_nr',
          },
        })
        logger.warn(`Timepod ${id} has no nr assigned`)
        return res.status(422).json({
          status: TimePodStatus.NoTimePodNr,
          error: 'Timepod has no nr assigned',
        })
      }

      const employee = await tx.employee.findFirst({
        where: {
          badgeUid: badge_uid,
          companyId: timepod.companyId,
        },
      })

      // if employee is not found, make the badge available for selection
      if (!employee) {
        await tx.badge.upsert({
          where: {
            uid: badge_uid,
          },
          create: {
            uid: badge_uid,
            timepodId: id,
            companyId: timepod.companyId,
          },
          update: {},
        })
        logger.info(`New badge detected on timepod ${id}: ${badge_uid}`)
        await tx.timeRecordRaw.update({
          where: { id: rawLog.id },
          data: {
            status: 'new_badge',
          },
        })
        return res.status(200).json({ status: TimePodStatus.NewBadge, data: { badge_uid } })
      }

      const targetCar = await prisma.car.findFirst({
        where: {
          companyId: timepod.companyId,
          active: true,
          timepodId: id,
        },
      })

      if (!targetCar) {
        await tx.timeRecordRaw.update({
          where: { id: rawLog.id },
          data: {
            status: 'no_car',
          },
        })
        logger.warn(`Timepod ${id} has no car assigned`)
        return res.status(422).json({
          status: TimePodStatus.CarNotFound,
          error: 'Timepod is not registered to a car',
        })
      }

      let autoClose = undefined
      let badgeOut = undefined

      if (timepod.Company?.AutoClose) {
        const now = new Date()
        const nowHours = now.getHours()
        const nowMinutes = now.getMinutes()
        const sortedAutoClose = timepod.Company.AutoClose.sort((a, b) => a.startTime.localeCompare(b.startTime))
        for (const autoCloseInterval of sortedAutoClose) {
          const [endHour, endMinutes] = autoCloseInterval.endTime.split(':')
          if (Number(nowHours + nowMinutes) < Number(endHour + endMinutes)) {
            autoClose = autoCloseInterval
            badgeOut = new Date()
            badgeOut.setHours(Number(endHour), Number(endMinutes))
            break
          }
        }
      }

      const newTimeRecord = {
        badgeIn: new Date(),
        badgeOut: badgeOut,
        status: autoClose ? 'AUTO_CLOSE' : 'PENDING',
        discipline: discipline,
        employeeId: employee.id,
        BadgeUid: badge_uid,
        timepodId: id,
        CompanyId: timepod.companyId,
        carId: targetCar.id,
      } satisfies Prisma.TimeRecordCreateArgs['data']

      await tx.timeRecord.create({
        data: newTimeRecord,
      })
    })

    return res.status(200).json({
      status: TimePodStatus.Created,
      data: { id, badge_uid, discipline },
    })
  } catch (error) {
    logger.error('Failed to post time record: ' + error)
    return res.status(500).json({
      status: TimePodStatus.Error,
      error: 'Failed to post time record',
    })
  }
})

export default router
