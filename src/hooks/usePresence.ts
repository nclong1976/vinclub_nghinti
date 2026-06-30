import { useEffect } from "react";
import { rtdb } from "../lib/firebase";
import { ref, set, onDisconnect, onValue, off } from "firebase/database";
import { useUser } from "../components/UserContext";

/**
 * Gọi hook này ở component gốc (App.tsx) sau khi user đã login.
 * Tự động:
 *   - Set status = "online" khi kết nối
 *   - Set status = "offline" ngay lập tức khi mất kết nối (qua Firebase server)
 */
export function usePresence() {
  const { userId } = useUser();

  useEffect(() => {
    if (!userId || userId === 'profile') return;

    const safeUserId = userId.replace(/[\.\#\$\[\]]/g, "_");
    const userStatusRef = ref(rtdb, `users/${safeUserId}/status`);
    // Nhánh ".info/connected" là built-in của Firebase RTDB
    const connectedRef = ref(rtdb, ".info/connected");

    const unsubscribe = onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === true) {
        // Khi disconnect: Firebase server tự ghi "offline" (không cần client gọi)
        onDisconnect(userStatusRef).set("offline");
        // Khi có kết nối: ghi "online"
        set(userStatusRef, "online");
      }
    });

    return () => {
      off(connectedRef, "value", unsubscribe);
      // Ghi offline khi unmount hoặc log out
      set(userStatusRef, "offline").catch(console.error);
    };
  }, [userId]);
}
