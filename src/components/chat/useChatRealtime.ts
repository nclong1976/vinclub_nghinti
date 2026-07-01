// ============================================================
// src/components/chat/useChatRealtime.ts
// Custom hook: Subscribe realtime messages & rooms từ Firestore
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  collection, query, where, orderBy, onSnapshot,
  addDoc, updateDoc, doc, serverTimestamp, setDoc,
  increment, writeBatch, getDoc, getDocs, limit
} from 'firebase/firestore';

import { db } from '../../firebase';
import type { ChatRoom, ChatMessage, ChatMessageRaw, ChatRoomRaw } from './types';

// ─── Parse helpers ────────────────────────────────────────────
const parseRoom = (id: string, data: ChatRoomRaw): ChatRoom => ({
  id,
  userId: data.userId || id,
  userName: data.userName || 'Người dùng',
  userEmail: data.userEmail || '',
  status: data.status || 'active',
  lastMessage: data.lastMessage || '',
  lastMessageAt: data.lastMessageAt ?? null,
  unreadByAdmin: data.unreadByAdmin || 0,
  avatarUrl: (data as any).avatarUrl,
});

const parseMessage = (id: string, data: ChatMessageRaw): ChatMessage => ({
  id,
  roomId: data.roomId,
  senderId: data.senderId,
  senderType: data.senderType,
  senderName: data.senderName || '',
  content: data.content || '',
  imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : [],
  isRead: data.isRead || false,
  createdAt: data.createdAt ?? null,
});

// ─── Hook: Lắng nghe messages của 1 room ─────────────────────
export function useMessages(roomId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!roomId) {
      setMessages([]);
      return;
    }
    setLoading(true);

    const q = query(
      collection(db, 'chat_messages'),
      where('roomId', '==', roomId),
      orderBy('createdAt', 'asc'),
      limit(200)
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => parseMessage(d.id, d.data() as ChatMessageRaw)));
      setLoading(false);
    }, (err) => {
      console.error('[chat] messages onSnapshot error:', err);
      setLoading(false);
    });

    return () => unsub();
  }, [roomId]);

  return { messages, loading };
}

// ─── Hook: Lắng nghe tất cả rooms (dành cho Admin) ───────────
export function useChatRooms() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'chat_rooms'),
      orderBy('lastMessageAt', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      setRooms(snap.docs.map(d => parseRoom(d.id, d.data() as ChatRoomRaw)));
      setLoading(false);
    }, (err) => {
      console.error('[chat] rooms onSnapshot error:', err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { rooms, loading };
}

// ─── Ensure room exists ───────────────────────────────────────
export async function ensureChatRoom(
  userId: string,
  userName: string,
  userEmail: string,
  avatarUrl?: string
): Promise<void> {
  const roomRef = doc(db, 'chat_rooms', userId);
  const snap = await getDoc(roomRef);
  if (!snap.exists()) {
    await setDoc(roomRef, {
      userId,
      userName,
      userEmail,
      avatarUrl: avatarUrl || null,
      status: 'active',
      lastMessage: '',
      lastMessageAt: serverTimestamp(),
      unreadByAdmin: 0,
    });
  }
}

// ─── Gửi tin nhắn (dùng chung User + Admin) ──────────────────
export async function sendChatMessage(params: {
  roomId: string;
  senderId: string;
  senderType: 'user' | 'admin';
  senderName: string;
  content: string;
  imageUrls?: string[];
}): Promise<void> {
  const { roomId, senderId, senderType, senderName, content, imageUrls = [] } = params;

  // Ghi tin nhắn
  await addDoc(collection(db, 'chat_messages'), {
    roomId,
    senderId,
    senderType,
    senderName,
    content,
    imageUrls,
    isRead: false,
    createdAt: serverTimestamp(),
  });

  // Cập nhật room metadata
  const roomRef = doc(db, 'chat_rooms', roomId);
  const updateData: Record<string, any> = {
    lastMessage: imageUrls.length > 0 && !content
      ? `📷 ${imageUrls.length} ảnh`
      : content,
    lastMessageAt: serverTimestamp(),
    status: 'active',
  };

  // Tăng unread cho admin nếu user gửi
  if (senderType === 'user') {
    updateData.unreadByAdmin = increment(1);
  }

  await updateDoc(roomRef, updateData);
}

// ─── Admin: đánh dấu đã đọc tất cả tin nhắn của 1 room ──────
export async function markRoomAsRead(roomId: string): Promise<void> {
  try {
    // Reset unread counter
    await updateDoc(doc(db, 'chat_rooms', roomId), { unreadByAdmin: 0 });

    // Mark individual messages as read
    const q = query(
      collection(db, 'chat_messages'),
      where('roomId', '==', roomId),
      where('senderType', '==', 'user'),
      where('isRead', '==', false)
    );

    const snap = await getDocs(q);
    if (snap.empty) return;

    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.update(d.ref, { isRead: true }));
    await batch.commit();
  } catch (err) {
    console.error('[chat] markRoomAsRead error:', err);
  }
}

// ─── User: đánh dấu đọc tin nhắn từ admin ────────────────────
export async function markAdminMessagesRead(roomId: string): Promise<void> {
  try {
    const q = query(
      collection(db, 'chat_messages'),
      where('roomId', '==', roomId),
      where('senderType', '==', 'admin'),
      where('isRead', '==', false)
    );
    const snap = await getDocs(q);
    if (snap.empty) return;

    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.update(d.ref, { isRead: true }));
    await batch.commit();
  } catch (err) {
    console.error('[chat] markAdminMessagesRead error:', err);
  }
}
