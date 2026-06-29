import { useEffect, useState } from "react";
import { rtdb } from "../lib/firebase";
import { ref, onValue, off, query, orderByChild } from "firebase/database";

export interface ChatRoom {
  userId: string;
  lastMessage: string;
  updatedAt: number;
  unreadByAdmin: boolean;
}

export function useChatRooms() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sắp xếp theo metadata/updatedAt → phòng có tin mới nhất lên đầu
    const chatsRef = query(
      ref(rtdb, "chats"),
      orderByChild("metadata/updatedAt")
    );

    const unsubscribe = onValue(
      chatsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val() as Record<
            string,
            { metadata?: { lastMessage: string; updatedAt: number; unreadByAdmin: boolean } }
          >;
          const list: ChatRoom[] = Object.entries(data)
            .filter(([, val]) => val?.metadata)
            .map(([userId, val]) => ({
              userId,
              lastMessage: val.metadata!.lastMessage ?? "",
              updatedAt: val.metadata!.updatedAt ?? 0,
              unreadByAdmin: val.metadata!.unreadByAdmin ?? false,
            }))
            .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
          setRooms(list);
        } else {
          setRooms([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("[useChatRooms] Lỗi lắng nghe:", error);
        setLoading(false);
      }
    );

    return () => off(chatsRef, "value", unsubscribe);
  }, []);

  return { rooms, loading };
}
