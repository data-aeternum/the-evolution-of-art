/** @type {import('next').NextConfig} */
const nextConfig = {
  // Make the Firebase web app config available to both server and browser bundles.
  // Locally it comes from .env; on Firebase App Hosting the platform sets it at build time.
  // (The web app config is public by design; access is governed by Firestore and Storage rules.)
  env: {
    FIREBASE_WEBAPP_CONFIG: process.env.FIREBASE_WEBAPP_CONFIG || "",
  },
};

module.exports = nextConfig;
