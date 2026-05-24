import { firebaseConfig as exampleConfig } from './firebase.example';

type FirebaseConfig = {
  webClientId: string;
  iosUrlScheme: string;
};

function isPlaceholderConfig(config: FirebaseConfig): boolean {
  return (
    config.webClientId.includes('YOUR_WEB_CLIENT_ID') ||
    config.iosUrlScheme.includes('YOUR_IOS_CLIENT_ID')
  );
}

function loadConfig(): FirebaseConfig {
  try {
    // Local overrides for development (gitignored).
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const local = require('./firebase.local') as { firebaseConfig: FirebaseConfig };
    return local.firebaseConfig;
  } catch {
    if (__DEV__) {
      console.warn(
        '[firebase] Missing firebase.local.ts — copy firebase.example.ts to firebase.local.ts and add your keys.',
      );
    }
    return exampleConfig;
  }
}

export const firebaseConfig = loadConfig();

export function assertFirebaseConfig(): void {
  if (isPlaceholderConfig(firebaseConfig)) {
    throw new Error(
      'Firebase is not configured. Copy src/config/firebase.example.ts to src/config/firebase.local.ts and add your Google client IDs.',
    );
  }
}
