import { Response, NextFunction, Request } from 'express'
import logger from '../lib/logger'
import { Roles, User } from '@prisma/client'
import prisma from '../lib/prisma'
import firebaseAdmin from '../lib/firebase'

declare module 'express-serve-static-core' {
  interface Request {
    auth: User
    org: {
      id: string
      name: string
      role: Roles
    }
  }
}

// Middleware to check Firebase Authentication token
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized')
  }

  const idToken = authHeader.split(' ')[1]

  try {
    // Verify the ID token with Firebase Admin SDK
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken)

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: decodedToken.uid,
      },
    })

    req.auth = user
    next()
  } catch (error) {
    logger.error('Error verifying token: ' + error)
    res.status(403).send('Forbidden')
  }
}
