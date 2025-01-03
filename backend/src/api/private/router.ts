import express from 'express'
import { createUser } from './controllers/user/post'
import { deleteUser } from './controllers/user/delete'
import accessMiddleware from '../../middleware/accessMiddleware'
import { patchUser } from './controllers/user/patch'
import { getUser } from './controllers/user/get'
import { getBadges } from './controllers/badges/get'
import { getCompanies } from './controllers/company/getAll'
import { getCompany } from './controllers/company/get'
import { postCompany } from './controllers/company/post'
import { getMyOrganization } from './controllers/organization/getMyOrganisation'
import { postOrganization } from './controllers/organization/post'
import { patchOrganization } from './controllers/organization/patch'

const router = express.Router()

router.get('/test', (_, res) => {
  res.status(200).json({ message: 'Test Succeeded!' })
})

// USER ROUTES
router.get('/user/:id', getUser)
router.patch('/user/:id', patchUser)
router.post('/user/:id', createUser)
router.delete('/user/:id', deleteUser)

// COMPANY ROUTES
router.get('/organization', getMyOrganization)

// ORGANIZATION ROUTES
router.use('/organization/:orgId', accessMiddleware)
router.post('/organization', postOrganization)
router.patch('/organization/:orgId', patchOrganization)

router.get('/organization/:orgId/company', getCompanies)
router.post('/organization/:orgId/company', postCompany)
router.get('/organization/:orgId/company/:companyId', getCompany)
router.patch('/organization/:orgId/company/:companyId')
router.delete('/organization/:orgId/company/:companyId')

// BADGE ROUTES
router.get('/organization/:orgId/company/:companyId/badges', getBadges)

// CAR ROUTES
router.get('/organization/:orgId/company/:companyId/cars')
router.post('/organization/:orgId/company/:companyId/cars')
router.get('/organization/:orgId/company/:companyId/car/:carId')
router.patch('/organization/:orgId/company/:companyId/car/:carId')

// EMPLOYEE ROUTES
router.get('/organization/:orgId/company/:companyId/employees')
router.post('/organization/:orgId/company/:companyId/employees')
router.get('/organization/:orgId/company/:companyId/employee/:employeeId')

// TIME RECORDS ROUTES
router.get('/organization/:orgId/logs')
router.post('/organization/:orgId/logs')
router.get('/organization/:orgId/logs/:recordId')
router.patch('/organization/:orgId/logs/:recordId')
router.delete('/organization/:orgId/logs/:recordId')

const privateRouter = router

export { privateRouter }
