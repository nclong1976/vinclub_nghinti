import { useEffect, useState } from "react";
import { rtdb } from "../lib/firebase";
import { ref, query, limitToLast, onValue, off } from "firebase/database";

export interface UserRecord {
  uid: string;
  email: string;
  displayName: string;
  createdAt: number;
  status: "online" | "offline";
}

export function useUsers() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy 50 user mới nhất, tự động cập nhật real-time khi có user mới
    const usersRef = query(ref(rtdb, "users"), limitToLast(50));

    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val() as Record<string, UserRecord>;
          const list = Object.values(data).sort(
            (a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)
          );
          setUsers(list);
        } else {
          setUsers([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("[useUsers] Lỗi lắng nghe:", error);
        setLoading(false);
      }
    );

    // Cleanup: hủy listener khi component unmount → tránh memory leak
    return () => off(usersRef, "value", unsubscribe);
  }, []);

  return { users, loading };
}
