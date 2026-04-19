'use client';
import { useState } from 'react';
import { db, auth } from '../firebase/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function JoinPage() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleJoin = async () => {
    if (!name || !code) return alert("Заполните поля");
    const user = (await signInAnonymously(auth)).user;
    
    await updateDoc(doc(db, "rooms", code.toUpperCase()), {
      players: arrayUnion({ id: user.uid, name: name, isHost: false })
    });

    router.push(`/room/${code.toUpperCase()}`);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-gray-900 text-white">
      <input className="text-black p-2 rounded" placeholder="Код комнаты" onChange={e => setCode(e.target.value)} />
      <input className="text-black p-2 rounded" placeholder="Ваше имя" onChange={e => setName(e.target.value)} />
      <button onClick={handleJoin} className="p-3 bg-blue-600 rounded">Войти</button>
    </div>
  );
}