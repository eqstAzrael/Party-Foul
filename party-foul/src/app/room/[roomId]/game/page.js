'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { db, auth } from '../../../firebase/firebase'; 
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Quiz from '../../../components/Quiz';
import Map from '../../../components/Map';

export default function GamePage() {
  const { roomId } = useParams(); //
  const [roomData, setRoomData] = useState(null); //

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "rooms", roomId), (s) => {
      if (s.exists()) setRoomData(s.data());
    });
    return () => unsub();
  }, [roomId]);

  const isHost = roomData?.players?.find(p => p.id === auth.currentUser?.uid)?.isHost; //

  const changePhase = async (newPhase) => {
    await updateDoc(doc(db, "rooms", roomId), { phase: newPhase });
  };

  if (!roomData) return <div className="h-screen bg-black flex items-center justify-center text-white">Загрузка...</div>;

  const renderGameContent = () => {
    switch (roomData.phase) {
      case "QUIZ":
        return <Quiz roomId={roomId} onFinish={() => isHost && changePhase("RESULTS")} />;
      
      case "RESULTS":
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Раунд завершен!</h2>
            {isHost && (
              <button onClick={() => changePhase("MAP")} className="bg-green-600 px-8 py-3 rounded-xl font-bold">
                Продолжить путь (Карта)
              </button>
            )}
          </div>
        );

      case "MAP":
        return <Map onFinish={() => isHost && changePhase("QUIZ")} />;

      default:
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">Лобби</h1>
            {isHost ? (
              <button onClick={() => changePhase("QUIZ")} className="bg-blue-600 px-8 py-3 rounded-xl font-bold">
                Начать игру
              </button>
            ) : (
              <p className="text-gray-400">Ожидаем хоста...</p>
            )}
          </div>
        );
    }
  };

  return (
    <main className="h-screen w-full bg-gray-950 text-white flex items-center justify-center">
      {renderGameContent()}
    </main>
  );
}