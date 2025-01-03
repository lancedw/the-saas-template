import express from 'express'

const router = express.Router()

router.get('/test', (_, res) => {
  res.status(200).json({ message: 'Test Succeeded!' })
})

// USER ROUTES
router.get('/user')
router.get('/user/:id')
router.post('/user')
router.put('/user/:id')
router.delete('/user/:id')

// COMPANY ROUTES
router.get('/company')
router.get('/company/:id')
router.post('/company')
router.put('/company/:id')
router.delete('/company/:id')

router.get('/logs')
router.get('/logs/:id')
router.post('/logs')
router.put('/logs/:id')
router.delete('/logs/:id')

const adminRouter = router

export { adminRouter }
