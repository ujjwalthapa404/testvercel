import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  auth,
  BOOTSTRAPPED_ADMIN_EMAIL,
  db,
  googleProvider,
  handleFirestoreError,
  isFirebaseConfigured,
  OperationType,
  SCHEMA_LIMITS,
} from '../lib/firebase';

interface FirebaseContextValue {
  user: User | null;
  authReady: boolean;
  profileReady: boolean;
  isAdmin: boolean;
  savedNoticeIds: string[];
  authError: string | null;
  signInWithGoogle: () => Promise<User | null>;
  signOutUser: () => Promise<void>;
  toggleSavedNotice: (noticeId: string) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profileReady, setProfileReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [savedNoticeIds, setSavedNoticeIds] = useState<string[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setAuthReady(true);
      setProfileReady(false);
      return;
    }

    let unsubscribePrivateInfo: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (unsubscribePrivateInfo) {
        unsubscribePrivateInfo();
        unsubscribePrivateInfo = null;
      }

      setUser(currentUser);
      setAuthError(null);

      if (!currentUser) {
        setIsAdmin(false);
        setSavedNoticeIds([]);
        setProfileReady(false);
        setAuthReady(true);
        return;
      }

      const uid = currentUser.uid;
      const userDocPath = `users/${uid}`;
      const privateDocPath = `users/${uid}/private/info`;

      try {
        const userRef = doc(db, 'users', uid);
        const privateRef = doc(db, 'users', uid, 'private', 'info');
        const existingUserSnap = await getDoc(userRef);

        if (!existingUserSnap.exists()) {
          const displayName = (currentUser.displayName || 'College Portal User').slice(
            0,
            SCHEMA_LIMITS.DISPLAY_NAME_MAX
          );
          const photoURL = (currentUser.photoURL || '').slice(0, SCHEMA_LIMITS.PHOTO_URL_MAX);
          const email = (currentUser.email || '').slice(0, SCHEMA_LIMITS.EMAIL_MAX);

          const batch = writeBatch(db);
          batch.set(userRef, {
            uid,
            displayName,
            photoURL,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          batch.set(privateRef, {
            uid,
            email,
            savedNoticeIds: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          await batch.commit();
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, userDocPath);
      }

      /* Determine administrative status (bootstrapped verified email or /admins/{uid}) */
      let resolvedAdmin =
        currentUser.emailVerified && currentUser.email === BOOTSTRAPPED_ADMIN_EMAIL;

      if (!resolvedAdmin && currentUser.emailVerified) {
        try {
          const adminSnap = await getDoc(doc(db, 'admins', uid));
          resolvedAdmin = adminSnap.exists();
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `admins/${uid}`);
        }
      }

      setIsAdmin(resolvedAdmin);
      setProfileReady(true);
      setAuthReady(true);

      /* Real-time listener on isolated private user preferences */
      unsubscribePrivateInfo = onSnapshot(
        doc(db, 'users', uid, 'private', 'info'),
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            const list = Array.isArray(data.savedNoticeIds)
              ? data.savedNoticeIds.filter((item): item is string => typeof item === 'string')
              : [];
            setSavedNoticeIds(list);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, privateDocPath);
        }
      );
    });

    return () => {
      if (unsubscribePrivateInfo) {
        unsubscribePrivateInfo();
      }
      unsubscribeAuth();
    };
  }, []);

  const signInWithGoogle = async (): Promise<User | null> => {
    setAuthError(null);
    if (!isFirebaseConfigured) {
      setAuthError(
        'Sign-In is unavailable until Firebase environment variables are configured in deployment settings.'
      );
      return null;
    }
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      return credential.user;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Sign-in could not be completed.';
      if (!msg.includes('auth/popup-closed-by-user')) {
        setAuthError('Google Sign-In could not be completed. Please try again.');
      }
      return null;
    }
  };

  const signOutUser = async (): Promise<void> => {
    setAuthError(null);
    if (!isFirebaseConfigured) {
      return;
    }
    await signOut(auth);
  };

  const toggleSavedNotice = async (noticeId: string): Promise<void> => {
    if (!isFirebaseConfigured || !user || !SCHEMA_LIMITS.ID_PATTERN.test(noticeId)) {
      return;
    }
    const privatePath = `users/${user.uid}/private/info`;
    const existsAlready = savedNoticeIds.includes(noticeId);
    let nextIds: string[];

    if (existsAlready) {
      nextIds = savedNoticeIds.filter((id) => id !== noticeId);
    } else {
      if (savedNoticeIds.length >= SCHEMA_LIMITS.SAVED_NOTICES_MAX) {
        return;
      }
      nextIds = [noticeId, ...savedNoticeIds];
    }

    try {
      await updateDoc(doc(db, 'users', user.uid, 'private', 'info'), {
        savedNoticeIds: nextIds,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, privatePath);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        authReady,
        profileReady,
        isAdmin,
        savedNoticeIds,
        authError,
        signInWithGoogle,
        signOutUser,
        toggleSavedNotice,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export function useFirebase(): FirebaseContextValue {
  const ctx = useContext(FirebaseContext);
  if (!ctx) {
    throw new Error('useFirebase must be used inside a FirebaseProvider');
  }
  return ctx;
}
