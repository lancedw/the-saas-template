import { NextFunction, Request, Response } from 'express'
import logger from '../lib/logger'

export default function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  logger.info('--> ' + req.method + ' ' + req.url)
  res.on('finish', () => {
    if (res.statusCode < 400) {
      logger.info('<-- ' + req.method + ' ' + req.url + ' ' + res.statusCode)
    } else {
      logger.error('X-- ' + req.method + ' ' + req.url + ' ' + res.statusCode)
    }
  })
  next()
}

export function errorHandler(err: Error, req: Request, res: Response) {
  logger.error('here')
  res.status(500).json({ code: 'UNCAUGHT_ERROR', message: 'Something broke!' })
}
