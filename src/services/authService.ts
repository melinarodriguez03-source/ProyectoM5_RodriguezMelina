import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { AppUser, Role } from "../types/user";

const USERS_COLLECTION = "users";


export async function getOrCreateUserProfile(firebaseUser: User): Promise<AppUser> {
  const ref = doc(db, USERS_COLLECTION, firebaseUser.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email ?? "",
      displayName: firebaseUser.displayName,
      role: data.role as Role,
    };
  }

  const newProfile: AppUser = {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? "",
    displayName: firebaseUser.displayName,
    role: "customer", 
  };

  await setDoc(ref, { email: newProfile.email, role: newProfile.role });
  return newProfile;
}

export async function registerWithEmail(
  email: string,
  password: string
): Promise<AppUser> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  return getOrCreateUserProfile(credential.user);
}

export async function loginWithEmail(
  email: string,
  password: string
): Promise<AppUser> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return getOrCreateUserProfile(credential.user);
}

export async function loginWithGoogle(): Promise<AppUser> {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  return getOrCreateUserProfile(credential.user);
}

export async function logout(): Promise<void> {
  await signOut(auth);
}