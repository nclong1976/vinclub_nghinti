import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Re-use app instance nếu đã khởi tạo (tránh duplicate)
const app = getApps().length === 0
  ? initializeApp({
      ...firebaseConfig,
      databaseURL: `https://vinclubcorona-default-rtdb.asia-southeast1.firebasedatabase.app`,
    })
  : getApps()[0];

export const rtdb = getDatabase(app, "https://vinclubcorona-default-rtdb.asia-southeast1.firebasedatabase.app");
export const rtdbAuth = getAuth(app);
export default app;
