import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth, GoogleAuthProvider } from 'firebase/auth';
import { doc, Firestore, getDocFromServer, getFirestore } from 'firebase/firestore';

interface LocalFirebaseAppletConfig {
  projectId?: string;
  appId?: string;
  apiKey?: string;
  authDomain?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  firestoreDatabaseId?: string;
}

const localConfigModules = import.meta.glob<LocalFirebaseAppletConfig>(
  '../../firebase-applet-config.json',
  { eager: true, import: 'default' }
);
const localFirebaseConfig: LocalFirebaseAppletConfig =
  Object.values(localConfigModules)[0] ?? {};

const resolvedFirebaseConfig = {
  ...localFirebaseConfig,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || localFirebaseConfig.projectId || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || localFirebaseConfig.appId || '',
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || localFirebaseConfig.apiKey || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localFirebaseConfig.authDomain || '',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localFirebaseConfig.storageBucket || '',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    localFirebaseConfig.messagingSenderId ||
    '',
};

const resolvedDatabaseId =
  import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID ||
  localFirebaseConfig.firestoreDatabaseId ||
  undefined;

export const isFirebaseConfigured = Boolean(
  resolvedFirebaseConfig.apiKey && resolvedFirebaseConfig.projectId
);

const app: FirebaseApp | null = isFirebaseConfigured
  ? initializeApp(resolvedFirebaseConfig)
  : null;

export const db: Firestore = app
  ? resolvedDatabaseId
    ? getFirestore(app, resolvedDatabaseId)
    : getFirestore(app)
  : (null as unknown as Firestore);

export const auth: Auth = app ? getAuth(app) : (null as unknown as Auth);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const BOOTSTRAPPED_ADMIN_EMAIL =
  import.meta.env.VITE_BOOTSTRAPPED_ADMIN_EMAIL || 'thapaujjwal20@gmail.com';

/**
 * Schema constraints synchronized verbatim with firebase-blueprint.json & firestore.rules
 */
export const SCHEMA_LIMITS = {
  ID_MAX: 128,
  ID_PATTERN: /^[a-zA-Z0-9_-]+$/,
  SLUG_MIN: 3,
  SLUG_MAX: 140,
  SLUG_PATTERN: /^[a-z0-9-]+$/,
  PHONE_MIN: 7,
  PHONE_MAX: 25,
  PHONE_PATTERN: /^[0-9+\-()\s]+$/,
  NOTICE_TITLE_MIN: 5,
  NOTICE_TITLE_MAX: 180,
  NOTICE_EXCERPT_MIN: 10,
  NOTICE_EXCERPT_MAX: 400,
  NOTICE_CONTENT_MIN: 10,
  NOTICE_CONTENT_MAX: 8000,
  AUTHOR_NAME_MIN: 2,
  AUTHOR_NAME_MAX: 100,
  ATTACHMENT_MAX: 160,
  DISPLAY_NAME_MAX: 100,
  PHOTO_URL_MAX: 500,
  EMAIL_MAX: 160,
  SAVED_NOTICES_MAX: 50,
  ENQUIRY_NAME_MIN: 2,
  ENQUIRY_NAME_MAX: 100,
  ENQUIRY_PROGRAM_MAX: 100,
  ENQUIRY_MESSAGE_MAX: 2000,
  ENQUIRY_NOTES_MAX: 1000,
  FAQ_QUESTION_MIN: 8,
  FAQ_QUESTION_MAX: 240,
  FAQ_ANSWER_MIN: 10,
  FAQ_ANSWER_MAX: 3000,
  FAQ_SORT_MIN: 0,
  FAQ_SORT_MAX: 9999,
} as const;

export function toSafeSlug(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const fallback = base.length >= SCHEMA_LIMITS.SLUG_MIN ? base : `notice-${Date.now()}`;
  return fallback.slice(0, SCHEMA_LIMITS.SLUG_MAX);
}

export function toSafeDocId(prefix: string): string {
  const randomSuffix = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now()}-${randomSuffix}`.slice(0, SCHEMA_LIMITS.ID_MAX);
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo:
        auth?.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection(): Promise<void> {
  if (!isFirebaseConfigured) {
    return;
  }
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

void testConnection();
