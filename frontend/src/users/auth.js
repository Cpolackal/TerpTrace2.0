import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";

export async function registerWithEmail(email, password, firstName, lastName) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    
    // Set the display name for the user
    if (firstName && lastName) {
      await userCredential.user.updateProfile({
        displayName: `${firstName} ${lastName}`
      });
    }
    
    return userCredential.user;
  } catch (error) {
    // throw new Error(`Registration failed:`, error.code);
    console.error("Full error object:", error);
    console.error("Error type:", typeof error);
    console.error("Error keys:", Object.keys(error));
  }
}

export async function loginWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    throw new Error(`Google login failed: ${error.message}`);
  }
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(`Logout failed: ${error.message}`);
  }
}
