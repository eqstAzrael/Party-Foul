import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC-baMOTcLMC4jDDQyn7YROsqLxw4vTOVk",
  authDomain: "party-foul-97f1b.firebaseapp.com",
  projectId: "party-foul-97f1b",
  storageBucket: "party-foul-97f1b.firebasestorage.app",
  messagingSenderId: "351357968009",
  appId: "1:351357968009:web:f241b52a9d50548798f058",
  measurementId: "G-KFT59CXBFE"
};

// Инициализируем Firebase
const app = initializeApp(firebaseConfig);

// Экспортируем сервисы для использования в других файлах
export const db = getFirestore(app);
export const auth = getAuth(app);