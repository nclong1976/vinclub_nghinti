import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, writeBatch, doc } from "firebase/firestore";
import fs from "fs";
import { projects, stocks, casinoGames } from "./src/data.js";

const firebaseConfig = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  try {
    const batch = writeBatch(db);
    
    projects.forEach(p => {
      batch.set(doc(collection(db, "projects"), p.id), p);
    });
    
    await batch.commit();
    console.log("Database seeded!");
  } catch (error) {
    console.error("Error:", error);
  }
}
run();
