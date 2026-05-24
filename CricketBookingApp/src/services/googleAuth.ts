import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

import { firebaseConfig } from '../config/firebase';

let configured = false;

export function configureGoogleSignIn(): void {
  if (configured) {
    return;
  }

  GoogleSignin.configure({
    webClientId: firebaseConfig.webClientId,
  });
  configured = true;
}

export async function signInWithGoogle(): Promise<FirebaseAuthTypes.UserCredential> {
  configureGoogleSignIn();

  if (Platform.OS === 'android') {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  }

  const result = await GoogleSignin.signIn();

  if (result.type === 'cancelled') {
    throw new Error('Sign in cancelled');
  }

  const idToken = result.data.idToken;
  if (!idToken) {
    throw new Error('Google Sign-In failed: missing ID token');
  }

  const credential = auth.GoogleAuthProvider.credential(idToken);
  return auth().signInWithCredential(credential);
}

export async function signOutGoogle(): Promise<void> {
  try {
    if (await GoogleSignin.hasPreviousSignIn()) {
      await GoogleSignin.signOut();
    }
  } finally {
    await auth().signOut();
  }
}

export function subscribeToAuthChanges(
  callback: (user: FirebaseAuthTypes.User | null) => void,
): () => void {
  return auth().onAuthStateChanged(callback);
}
