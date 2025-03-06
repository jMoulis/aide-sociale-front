/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import admin from 'firebase-admin';

let app: any | undefined;

if (!admin.apps.length) {
  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n")!,
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
} else if (admin.apps[0]) {
  app = admin.apps[0];
}

const bucket = admin.storage().bucket();

export { bucket, app };