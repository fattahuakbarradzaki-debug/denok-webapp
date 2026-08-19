import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDefRZCBKAOO6IDtdbsbvGDSLz6KhugOow",
  authDomain: "mie-ayam-bakso-denok.firebaseapp.com",
  projectId: "mie-ayam-bakso-denok",
  storageBucket: "mie-ayam-bakso-denok.firebasestorage.app",
  messagingSenderId: "872908314311",
  appId: "1:872908314311:web:ac8ace5382d5c0b2cad0e2"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)

export default app