import dotenv from 'dotenv'
dotenv.config({ path: '.env' })

import cors from 'cors'
import express from 'express'
import { adminRouter } from './api/admin/router'
import { privateRouter } from './api/private/router'
import { publicRouter } from './api/public/router'
import logger from './lib/logger'
import loggerMiddleware, { errorHandler } from './middleware/loggerMiddleware'
import { authMiddleware } from './middleware/authMiddleware'

const app = express()

app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? ['https://timefusion.pro', 'https://www.timefusion.pro'] : '*',
  })
)

// report all incoming requests

app.get('/', (_, res) => {
  logger.info('root hit')
  res.status(200).json({ message: 'Ok' })
})

app.use(loggerMiddleware)

app.use('/api', publicRouter)

app.use('/core', authMiddleware, privateRouter)

app.use('/admin', authMiddleware, adminRouter)

app.use((_, res) => {
  return res.status(404).json({ message: 'Not Found' })
})

// report and log errors
app.use(errorHandler)

app
  .listen(process.env.PORT, () => {
    logger.info(`Node Environment: ${process.env.NODE_ENV}`)
    logger.info(`⚡️ [server]: running on port ${process.env.PORT}`)
  })
  .on('error', err => {
    // this can happen if the nodemon process is not cleaned up properly and the port is in use
    logger.error(`‼️ [server]: error: ${err.message}`)
    process.once('SIGUSR2', function () {
      process.kill(process.pid, 'SIGUSR2')
    })
    process.on('SIGINT', function () {
      // this is only called on ctrl+c, not restart
      process.kill(process.pid, 'SIGINT')
    })
  })
