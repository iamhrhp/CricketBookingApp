# Secrets & safe git push

Do **not** commit real API keys, OAuth client IDs, or Firebase config files.

## Gitignored (never pushed)

| File | Purpose |
|------|---------|
| `src/config/firebase.local.ts` | Google Sign-In web client ID + iOS URL scheme |
| `android/app/google-services.json` | Firebase Android config (contains API key) |
| `ios/CricketBookingAppCLI/GoogleService-Info.plist` | Firebase iOS config (contains API key) |
| `.env`, `.env.local` | Optional local env vars |
| `*.keystore`, `*.jks`, `*.p12`, `*.pem` | Signing keys |
| `android/local.properties` | SDK paths / local overrides |

## First-time setup

1. Copy examples and add your Firebase / Google values:

```bash
cp src/config/firebase.example.ts src/config/firebase.local.ts
cp android/app/google-services.json.example android/app/google-services.json
cp ios/CricketBookingAppCLI/GoogleService-Info.plist.example ios/CricketBookingAppCLI/GoogleService-Info.plist
```

2. Download real `google-services.json` and `GoogleService-Info.plist` from [Firebase Console](https://console.firebase.google.com/) (or paste values into the copies above).

3. Set `webClientId` and `iosUrlScheme` in `firebase.local.ts` (Web client ID + reversed iOS client ID from Firebase).

4. Update **iOS URL scheme** in `ios/CricketBookingAppCLI/Info.plist` → `CFBundleURLSchemes` must match `REVERSED_CLIENT_ID` from `GoogleService-Info.plist`.

## Before you push

```bash
npm run check-secrets
```

This blocks commits that contain `AIza…` Firebase API keys or `*.apps.googleusercontent.com` client IDs in staged files (examples are allowed).

## If secrets were already pushed

1. Rotate keys in Firebase Console / Google Cloud Console.
2. Remove files from git history (e.g. `git filter-repo`) or create new keys.
3. Never rely on "delete in next commit" alone — history still contains secrets.
