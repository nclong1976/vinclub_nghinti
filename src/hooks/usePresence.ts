import { useEffect } from "react";
import { rtdb, rtdbAuth } from "../lib/firebase";
import { ref, set, onDisconnect, onValue, off } from "firebase/database";

/**
 * Gọi hook này ở component gốc (App.tsx) sau khi user đã login.
 * Tự động:
 *   - Set status = "online" khi kết nối
 *   - Set status = "offline" ngay lập tức khi mất kết nối (qua Firebase server)
 */
export function usePresence() {
  useEffect(() => {
    const user = rtdbAuth.currentUser;
    if (!user) return;

    const uid = user.uid;
    const userStatusRef = ref(rtdb, `users/${uid}/status`);
    // Nánh ".info/connected" là built-in của Firebase RTDB
    const connectedRef = ref(rtdb, ".info/connected");

    const unsubscribe = onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === true) {
        // Khi disconnect: Firebase server tự ghi "offline" (không cần client gọi)
        onDisconnect(userStatusRef).set("offline");
        // Khi có kết nối: ghi "online"
        set(userStatusRef, "online");
      }
    });

    return () => off(connectedRef, "value", unsubscribe);
  }, []);
}
