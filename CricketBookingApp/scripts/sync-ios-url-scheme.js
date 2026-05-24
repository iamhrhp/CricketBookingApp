#!/usr/bin/env node
/**
 * Sync CFBundleURLSchemes in Info.plist from firebase.local.ts (local dev only).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const localPath = path.join(root, 'src/config/firebase.local.ts');
const plistPath = path.join(root, 'ios/CricketBookingAppCLI/Info.plist');

if (!fs.existsSync(localPath)) {
  console.log('sync-ios-url-scheme: skip (no firebase.local.ts)');
  process.exit(0);
}

const localSource = fs.readFileSync(localPath, 'utf8');
const match = localSource.match(/iosUrlScheme:\s*['"]([^'"]+)['"]/);

if (!match || match[1].includes('YOUR_IOS_CLIENT_ID')) {
  console.log('sync-ios-url-scheme: skip (placeholder iosUrlScheme)');
  process.exit(0);
}

const scheme = match[1];
let plist = fs.readFileSync(plistPath, 'utf8');

const schemePattern =
  /<string>(YOUR_GOOGLE_IOS_URL_SCHEME|com\.googleusercontent\.apps\.[^<]+)<\/string>/;

if (!schemePattern.test(plist)) {
  console.warn('sync-ios-url-scheme: CFBundleURLSchemes entry not found in Info.plist');
  process.exit(1);
}

plist = plist.replace(schemePattern, `<string>${scheme}</string>`);
fs.writeFileSync(plistPath, plist);
console.log('sync-ios-url-scheme: updated Info.plist URL scheme');
