import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfigData from '../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfigData) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfigData.firestoreDatabaseId || undefined);
export const googleProvider = new GoogleAuthProvider();

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface UserProgressState {
  userId: string;
  lastCompletedStepId: string;
  lastCompletedModuleId?: string;
  completionPercentage: number;
  completedLessonIds: string[];
  completedQuizIds: string[];
  customDataJson?: string;
  updatedAt?: any;
}

/**
 * Ensures user profile exists in Firestore upon authentication
 */
export async function syncUserProfile(user: User): Promise<UserProfile> {
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      const newProfile: UserProfile = {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'Researcher',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    }

    return snap.data() as UserProfile;
  } catch (err) {
    console.warn('Sync profile fallback triggered:', err);
    return {
      id: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'Researcher'
    };
  }
}

/**
 * Fetches saved user progress state from Firestore
 */
export async function fetchUserProgress(userId: string): Promise<UserProgressState | null> {
  try {
    const progressRef = doc(db, 'user_progress', userId);
    const snap = await getDoc(progressRef);
    if (snap.exists()) {
      return snap.data() as UserProgressState;
    }
  } catch (err) {
    console.error('Error fetching user progress:', err);
  }
  return null;
}

/**
 * Saves or updates user progress state in Firestore
 * Enforces client-side authorization check before dispatching write
 */
export async function saveUserProgress(progress: Partial<UserProgressState> & { userId: string }): Promise<void> {
  try {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid || currentUid !== progress.userId) {
      console.warn('Security guard: User is not authenticated or userId does not match active session.');
      return;
    }

    const progressRef = doc(db, 'user_progress', progress.userId);
    const payload = {
      ...progress,
      updatedAt: serverTimestamp()
    };
    await setDoc(progressRef, payload, { merge: true });
  } catch (err) {
    console.error('Error saving user progress:', err);
  }
}

/**
 * Securely signs out the user and clears any sensitive local session artifacts
 */
export async function signOutUser(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.error('Sign out error:', err);
  }
}

/**
 * Retrieves the active user's Firebase ID token to authorize administrative and mutating backend API calls.
 */
export async function getAuthToken(): Promise<string | null> {
  if (!auth.currentUser) return null;
  try {
    return await auth.currentUser.getIdToken();
  } catch (err) {
    console.error('Error getting auth token:', err);
    return null;
  }
}

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut,
  onAuthStateChanged
};
export type { User };
