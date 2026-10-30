// The Firebase web app config, read from the FIREBASE_WEBAPP_CONFIG environment variable.
// next.config.js copies that variable into both the server and browser bundles.
// Returns undefined when it is not set, so callers can fall back to initializeApp().

function parseConfig() {
  const raw = process.env.FIREBASE_WEBAPP_CONFIG;
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("FIREBASE_WEBAPP_CONFIG is not valid JSON", e);
    return undefined;
  }
}

export const firebaseConfig = parseConfig();
