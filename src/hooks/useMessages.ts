import { useEffect, useState } from "react";
import { rtdb } from "../lib/firebase";
import {
  ref,
  query,
  limitToLast,
  onChildAdded,
  off,
} from "firebase/database";

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: number;
  type?: 'text' | 'image' | 'video' | 'file';
  fileUrl?: string;
  fileName?: string;
}

// roomUserId: luôn là uid của user (không phải adminId)
export function useMessages(roomUserId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomUserId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    // Reset khi chuyển phòng
    setMessages([]);
    setLoading(true);

    // Dùng onChildAdded: chỉ trigger khi có tin mới, load 100 tin gần nhất lúc mở
    const messagesRef = query(
      ref(rtdb, `chats/${roomUserId}/messages`),
      limitToLast(100)
    );

    const unsubscribe = onChildAdded(
      messagesRef,
      (snapshot) => {
        const msg = snapshot.val() as Omit<Message, "id">;
        setMessages((prev) => {
          // Chống duplicate khi snapshot trigger lại
          if (prev.some((m) => m.id === snapshot.key)) return prev;
          return [...prev, { id: snapshot.key as string, ...msg }];
        });
        setLoading(false);
      },
      (error) => {
        console.error("[useMessages] Lỗi lắng nghe:", error);
        setLoading(false);
      }
    );

    // Cleanup: hủy listener → tránh memory leak
    return () => off(messagesRef, "child_added", unsubscribe);
  }, [roomUserId]);

  return { messages, loading };
}
