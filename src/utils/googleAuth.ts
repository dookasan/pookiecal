import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/chat.spaces.readonly',
  'https://www.googleapis.com/auth/chat.messages.readonly',
  'https://www.googleapis.com/auth/contacts.readonly'
];

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));

const SESSION_TOKEN_KEY = 'google_oauth_access_token';

let isSigningIn = false;
let cachedAccessToken: string | null =
  typeof window !== 'undefined' ? sessionStorage.getItem(SESSION_TOKEN_KEY) : null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (!cachedAccessToken && typeof window !== 'undefined') {
        cachedAccessToken = sessionStorage.getItem(SESSION_TOKEN_KEY);
      }
      if (onAuthSuccess) {
        onAuthSuccess(user, cachedAccessToken);
      }
    } else {
      cachedAccessToken = null;
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(SESSION_TOKEN_KEY);
      }
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken || '';
    if (token) {
      cachedAccessToken = token;
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem(SESSION_TOKEN_KEY, token);
        } catch {
          // ignore
        }
      }
    }
    return { user: result.user, accessToken: token };
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  if (!cachedAccessToken && typeof window !== 'undefined') {
    cachedAccessToken = sessionStorage.getItem(SESSION_TOKEN_KEY);
  }
  return cachedAccessToken;
};

export const googleSignOut = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
  }
};
