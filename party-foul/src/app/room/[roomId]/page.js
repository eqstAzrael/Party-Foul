'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { db, auth } from '../../firebase/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function RoomPage() {
  const { roomId } = useParams();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    return onSnapshot(doc(db, "rooms", roomId), (s) => {
      if (s.exists()) setPlayers(s.data().players || []);
    });
  }, [roomId]);

  const me = players.find(p => p.id === auth.currentUser?.uid);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-mono mb-10">{roomId}</h1>
      <div className="bg-white/10 p-6 rounded-xl w-64">
        {players.map(p => (
          <div key={p.id} className="py-2 border-b border-white/10 last:border-0">
            {p.name} {p.isHost && "👑"}
          </div>
        ))}
      </div>

    {me?.isHost && (
        <button 
          
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