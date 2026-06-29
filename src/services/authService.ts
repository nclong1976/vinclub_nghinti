import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { rtdbAuth } from "../lib/firebase";
import { registerUserToDb, setUserStatus } from "./chatService";

// ── Đăng ký tài khoản mới ──────────────────────────────────────────────────────
export async function signUpUser(
  email: string,
  password: string,
  displayName: string
) {
  // 1. Tạo tài khoản Firebase Auth
  const credential = await createUserWithEmailAndPassword(
    rtdbAuth,
    email,
    password
  );
  const user = credential.user;

  // 2. Cập nhật displayName trên Firebase Auth
  await updateProfile(user, { displayName });

  // 3. Ghi vào /users/$uid trên Realtime Database (trigger real-time Admin)
  await registerUserToDb(user.uid, email, displayName);

  return user;
}

// ── Đăng nhập ─────────────────────────────────────────────────────────────────
export async function signInUser(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(
    rtdbAuth,
    email,
    password
  );
  const user = credential.user;
  // Cập nhật status = "online" khi login
  await setUserStatus(user.uid, "online");
  return user;
}

// ── Đăng xuất ───────────────────────────────────────────────────────────────────
export async function signOutUser() {
  const user = rtdbAuth.currentUser;
  if (user) {
    // Set offline trước khi logout
    await setUserStatus(user.uid, "offline");
  }
  await signOut(rtdbAuth);
}
