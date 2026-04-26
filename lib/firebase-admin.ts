import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

function getAdminApp() {
  const existing = getApps()
  if (existing.length > 0) {
    const app = existing[0]
    if (!app) throw new Error('Firebase Admin app is undefined')
    return app
  }

  const projectId   = (process.env.FIREBASE_PROJECT_ID   ?? '').trim()
  const clientEmail = (process.env.FIREBASE_CLIENT_EMAIL ?? '').trim()
  const privateKey  = (process.env.FIREBASE_PRIVATE_KEY  ?? '')
    .trim()
    .replace(/\\n/g, '\n')
    .replace(/^"|"$/g, '')

  if (!projectId)   throw new Error(`FIREBASE_PROJECT_ID is missing or empty`)
  if (!clientEmail) throw new Error(`FIREBASE_CLIENT_EMAIL is missing or empty`)
  if (!privateKey)  throw new Error(`FIREBASE_PRIVATE_KEY is missing or empty`)

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket: (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '').trim(),
  })
}

export function getAdminDB() {
  return getFirestore(getAdminApp())
}
