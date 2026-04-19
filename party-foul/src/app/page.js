/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
'use client'

import { signInAnonymously } from "firebase/auth";
import { auth, db } from "./firebase/firebase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";


export default function Home() {
  const router = useRouter();

  const createGame = async () => {
          const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
  
          try {
              await setDoc(doc(db, "rooms", roomCode), {
                  status: "LOBBY",
                  createdAt: serverTimestamp(),
              });
  
              router.push(`/room/${roomCode}`);
          }   catch(e) {
              console.error("Ошибка при создании комнаты: ", e);
          }
      };  

  return (
    <main className="text-white flex flex-col items-center justify-center h-screen gap-20 w-full bg-gradient-to-br from-[#7A1CFC] via-[#2F5FFF] to-[#00E0FF]">
      <h1 className="text-2xl text-center"> PARTY FOUL </h1> 
      <button onClick={createGame} className="border-1 rounded-2xl p-5"> Create New Game</button>
    </main>
  );
}
