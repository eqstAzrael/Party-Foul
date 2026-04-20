'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { db, auth } from '../../../firebase/firebase'; 
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Quiz from '../../../components/Quiz';
import Map from '../../../components/Map';

export default function GamePage() {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState(null);
ё
  useEffect(() => {
    const roomRef = doc(db, "rooms", roomId);
    const unsub = onSnapshot(roomRef, (s) => {
      if (s.exists()) {
        setRoomData(s.data());
      }
    });
    return () => unsub();
  }, [roomId]);

  if (!roomData) return <div className="h-screen bg-black flex items-center justify-center text-white">Загрузка...</div>;

  
  const isHost = roomData.players?.find(p => p.id === auth.currentUser?.uid)?.isHost;

  
  const changePhase = async (newPhase) => {
    await updateDoc(doc(db, "rooms", roomId), { phase: newPhase });
  };

  
  const renderGameContent = () => {
    switch (roomData.phase) {
      case "QUIZ":
        return <Quiz />;
      case "MAP":
        return <Map />;
      default:
        return (
          <div className="text-center">
            <h1 className="text-2xl mb-4">Ожидание начала...</h1>
            {isHost && (
              <button onClick={() => changePhase("QUIZ")} className="bg-blue-600 px-6 py-2 rounded">
                Начать раунд
              </button>
            )}
          </div>
        );
    }
  };

  return (
    <main className="h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8 relative">
      {renderGameContent()}

      {/* Панель отладки для хоста */}
      {isHost && (
        <div className="absolute bottom-10 flex gap-4 bg-white/5 p-2 rounded border border-white/10">
          <button onClick={() => changePhase("QUIZ")} className="text-xs px-2 py-1">QUIZ</button>
          <button onClick={() => changePhase("MAP")} className="text-xs px-2 py-1">MAP</button>
        </div>
      )}
    </main>
  );
}