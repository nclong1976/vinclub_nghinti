import { rtdb, rtdbAuth } from "../lib/firebase";
import {
  ref,
  push,
  set,
  update,
  serverTimestamp,
} from "firebase/database";

// ── Ghi user mới sau khi đăng ký ──────────────────────────────────────────────
export async function registerUserToDb(
  uid: string,
  email: string,
  displayName: string
): Promise<void> {
  await set(ref(rtdb, `users/${uid}`), {
    uid,
    email,
    displayName,
    createdAt: serverTimestamp(),
    status: "online",
  });
}

// ── User gửi tin nhắn → push vào /chats/$userId/messages ──────────────────────
export async function sendMessageAsUser(
  userId: string,
  text: string
): Promise<void> {
  const newMsgRef = push(ref(rtdb, `chats/${userId}/messages`));
  await set(newMsgRef, {
    senderId: userId,
    text,
    createdAt: serverTimestamp(),
  });
  await update(ref(rtdb, `chats/${userId}/metadata`), {
    lastMessage: text,
    updatedAt: serverTimestamp(),
    unreadByAdmin: true,
  });
}

// ── Admin gửi tin nhắn → push vào /chats/$targetUserId/messages ───────────────
export async function sendMessageAsAdmin(
  targetUserId: string,
  adminId: string,
  text: string
): Promise<void> {
  const newMsgRef = push(ref(rtdb, `chats/${targetUserId}/messages`));
  await set(newMsgRef, {
    senderId: adminId,
    text,
    createdAt: serverTimestamp(),
  });
  await update(ref(rtdb, `chats/${targetUserId}/metadata`), {
    lastMessage: text,
    updatedAt: serverTimestamp(),
    unreadByAdmin: false,
  });
}

// ── Đánh dấu Admin đã đọc ─────────────────────────────────────────────────────
export async function markRoomAsReadByAdmin(userId: string): Promise<void> {
  await update(ref(rtdb, `chats/${userId}/metadata`), {
    unreadByAdmin: false,
  });
}

// ── Cập nhật trạng thái online/offline ─────────────────────────────────────────
export async function setUserStatus(
  uid: string,
  status: "online" | "offline"
): Promise<void> {
  await update(ref(rtdb, `users/${uid}`), { status });
}
