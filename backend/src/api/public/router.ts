import express from 'express'
import { postBadge } from './controllers/badges/post'
import postTimeRecord from './controllers/time-records/post'

const router = express.Router()

router.get('/test', (_, res) => {
  res.status(200).json({ message: 'Test Succeeded!' })
})

// BADGE ROUTES
router.post('/badges/:badgeUid', postBadge)

// TIME RECORD ROUTES
router.post('/logs', postTimeRecord)

const publicRouter = router

export { publicRouter }
