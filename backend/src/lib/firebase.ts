import admin from 'firebase-admin'
import serviceAccount from './config/FirebaseService.json'

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

export default firebaseAdmin
