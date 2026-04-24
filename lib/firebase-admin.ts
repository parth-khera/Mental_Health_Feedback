import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

let adminApp: App | undefined

function getAdminApp(): App {
  const apps = getApps()
  if (apps.length > 0 && apps[0]) return apps[0]
  
  const app = initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      // Next.js escapes \n in env vars — unescape here
      privateKey:  process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  })
  return app
}

export function getAdminDB() {
  if (!adminApp) adminApp = getAdminApp()
  return getFirestore(adminApp!)
}
