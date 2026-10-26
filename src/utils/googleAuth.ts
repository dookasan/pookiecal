import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  provider?: 'google' | 'email';
}

// Standard Google Auth provider (ONLY basic profile & email — no restricted scopes
// so anyone can sign in without Google OAuth "Testing Mode" test-user restrictions)
const basicGoogleProvider = new GoogleAuthProvider();
basicGoogleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Optional incremental Google Workspace scopes (only used when user explicitly clicks "Sync Live Gmail")
export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/contacts.readonly'
];

const SESSION_TOKEN_KEY = 'google_oauth_access_token';
const LOCAL_USERS_KEY = 'pookiecal_registered_users';
const LOCAL_SESSION_KEY = 'pookiecal_active_user';

interface LocalStoredUser {
  uid: string;
  displayName: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

let cachedAccessToken: string | null =
  typeof window !== 'undefined' ? sessionStorage.getItem(SESSION_TOKEN_KEY) : null;

function getLocalRegisteredUsers(): LocalStoredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalRegisteredUsers(users: LocalStoredUser[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch {
    // ignore storage errors
  }
}

export function getActiveLocalSession(): AppUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LOCAL_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setActiveLocalSession(user: AppUser | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_SESSION_KEY);
    }
  } catch {
    // ignore
  }
}

function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return `h_${Math.abs(hash).toString(36)}_${input.length}`;
}

export const initAuth = (
  onAuthSuccess?: (user: AppUser, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (firebaseUser: User | null) => {
    if (firebaseUser) {
      if (!cachedAccessToken && typeof window !== 'undefined') {
        cachedAccessToken = sessionStorage.getItem(SESSION_TOKEN_KEY);
      }
      const appUser: AppUser = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Member',
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        provider: firebaseUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email'
      };
      setActiveLocalSession(appUser);
      if (onAuthSuccess) {
        onAuthSuccess(appUser, cachedAccessToken);
      }
    } else {
      // Check if user is signed in via local email session
      const localSession = getActiveLocalSession();
      if (localSession) {
        if (onAuthSuccess) {
          onAuthSuccess(localSession, null);
        }
        return;
      }

      cachedAccessToken = null;
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(SESSION_TOKEN_KEY);
      }
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: AppUser; accessToken: string } | null> => {
  const result = await signInWithPopup(auth, basicGoogleProvider);
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
  const appUser: AppUser = {
    uid: result.user.uid,
    displayName: result.user.displayName || result.user.email?.split('@')[0] || 'Member',
    email: result.user.email,
    photoURL: result.user.photoURL,
    provider: 'google'
  };
  setActiveLocalSession(appUser);
  return { user: appUser, accessToken: token };
};

export const connectGoogleWorkspaceScopes = async (): Promise<{ user: AppUser; accessToken: string } | null> => {
  const workspaceProvider = new GoogleAuthProvider();
  WORKSPACE_SCOPES.forEach((scope) => workspaceProvider.addScope(scope));
  workspaceProvider.setCustomParameters({
    prompt: 'consent'
  });

  const result = await signInWithPopup(auth, workspaceProvider);
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
  const appUser: AppUser = {
    uid: result.user.uid,
    displayName: result.user.displayName || result.user.email?.split('@')[0] || 'Member',
    email: result.user.email,
    photoURL: result.user.photoURL,
    provider: 'google'
  };
  setActiveLocalSession(appUser);
  return { user: appUser, accessToken: token };
};

export const registerWithEmail = async (
  name: string,
  email: string,
  password: string
): Promise<AppUser> => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim() || cleanEmail.split('@')[0];

  try {
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    if (cleanName) {
      await updateProfile(cred.user, { displayName: cleanName });
    }
    const appUser: AppUser = {
      uid: cred.user.uid,
      displayName: cleanName,
      email: cred.user.email || cleanEmail,
      photoURL: cred.user.photoURL,
      provider: 'email'
    };
    setActiveLocalSession(appUser);
    return appUser;
  } catch (err: unknown) {
    const firebaseErr = err as { code?: string; message?: string };
    const code = firebaseErr?.code || '';

    // If Email/Password already exists or invalid in Firebase, surface those standard errors
    if (
      code === 'auth/email-already-in-use' ||
      code === 'auth/weak-password' ||
      code === 'auth/invalid-email'
    ) {
      throw err;
    }

    // Fallback to instant account registration if Email/Password provider isn't toggled yet in Firebase Console
    const users = getLocalRegisteredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      const duplicateErr = new Error('An account with this email already exists. Please sign in instead.') as Error & { code?: string };
      duplicateErr.code = 'auth/email-already-in-use';
      throw duplicateErr;
    }

    const newLocalUser: LocalStoredUser = {
      uid: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      displayName: cleanName,
      email: cleanEmail,
      passwordHash: simpleHash(password),
      createdAt: new Date().toISOString()
    };

    saveLocalRegisteredUsers([...users, newLocalUser]);
    const appUser: AppUser = {
      uid: newLocalUser.uid,
      displayName: newLocalUser.displayName,
      email: newLocalUser.email,
      provider: 'email'
    };
    setActiveLocalSession(appUser);
    return appUser;
  }
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<AppUser> => {
  const cleanEmail = email.trim().toLowerCase();

  // Check local registered users first so local accounts work immediately
  const users = getLocalRegisteredUsers();
  const localMatch = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (localMatch) {
    if (localMatch.passwordHash !== simpleHash(password)) {
      const wrongPassErr = new Error('Incorrect password. Please try again.') as Error & { code?: string };
      wrongPassErr.code = 'auth/wrong-password';
      throw wrongPassErr;
    }
    const appUser: AppUser = {
      uid: localMatch.uid,
      displayName: localMatch.displayName,
      email: localMatch.email,
      provider: 'email'
    };
    setActiveLocalSession(appUser);
    return appUser;
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
    const appUser: AppUser = {
      uid: cred.user.uid,
      displayName: cred.user.displayName || cleanEmail.split('@')[0],
      email: cred.user.email || cleanEmail,
      photoURL: cred.user.photoURL,
      provider: 'email'
    };
    setActiveLocalSession(appUser);
    return appUser;
  } catch (err: unknown) {
    const firebaseErr = err as { code?: string };
    const code = firebaseErr?.code || '';
    if (
      code === 'auth/user-not-found' ||
      code === 'auth/invalid-credential' ||
      code === 'auth/operation-not-allowed'
    ) {
      const notFoundErr = new Error('No account found with this email and password. Click "Create Account" to register.') as Error & { code?: string };
      notFoundErr.code = 'auth/user-not-found';
      throw notFoundErr;
    }
    throw err;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  if (!cachedAccessToken && typeof window !== 'undefined') {
    cachedAccessToken = sessionStorage.getItem(SESSION_TOKEN_KEY);
  }
  return cachedAccessToken;
};

export const googleSignOut = async () => {
  setActiveLocalSession(null);
  cachedAccessToken = null;
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
  }
  try {
    await signOut(auth);
  } catch {
    // ignore
  }
};
