import * as admin from "firebase-admin";
import * as dotenv from "dotenv";

const isDevMode = process.env.NODE_ENV === "development";

if (isDevMode) {
  dotenv.config();
}

const projectId = process.env.GCLOUD_PROJECT;

if (!admin.apps.length) {
  admin.initializeApp({projectId});
}

const firestore = admin.firestore();

export {firestore};
