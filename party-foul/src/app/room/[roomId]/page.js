'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import { db, auth } from '../../firebase/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'; 

export default function RoomPage() {
  const { roomId } = useParams();
  const router = useRouter(); 
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const roomRef = doc(db, "rooms", roomId);
    
    const unsubscribe = onSnapshot(roomRef, (s) => {
      if (s.exists()) {
        const data = s.data();
        setPlayers(data.players || []);

        if (data.status === "STARTED") {
          router.push(`/room/${roomId}/game`);
        }
      }
    });

    return () => unsubscribe();
  }, [roomId, router]);

  const me = players.find(p => p.id === auth.currentUser?.uid);

  const handleStartGame = async () => {
    const roomRef = doc(db, "rooms", roomId);
    try {
      await updateDoc(roomRef, {
        status: "STARTED"
      });
    } catch (error) {
      console.error("Ошибка при запуске игры:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-mono mb-10">{roomId}</h1>
      
      <div className="bg-white/10 p-6 rounded-xl w-64 mb-6">
        {players.map((p, index) => (
          <div key={p.id || index} className="py-2 border-b border-white/10 last:border-0">
            {p.name} {p.isHost && "👑"}
          </div>
        ))}
      </div>

      {me?.isHost && (
        <button 
          onClick={handleStartGame} 
          className="bg-green-600 hover:bg-green-700 px-10 py-3 rounded-full font-bold transition-transform active:scale-95"
        >
          START GAME
        </button>
      )}

      {!me?.isHost && (
        <p className="opacity-50 italic">Ожидание запуска хостом...</p>
      )}
    </div>
  );
}