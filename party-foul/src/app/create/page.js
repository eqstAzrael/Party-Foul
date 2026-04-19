'use client';
import { useState } from 'react';
import { db, auth } from '../firebase/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function CreatePage() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleCreate = async () => {
    if (!name) return alert("Введите имя");
    const user = (await signInAnonymously(auth)).user;
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();

    await setDoc(doc(db, "rooms", code), {
      players: [{ id: user.uid, name: name, isHost: true }],
      createdAt: serverTimestamp()
    });

    router.push(`/room/${code}`);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-gray-900 text-white">
      <input className="text-black p-2 rounded" placeholder="Ваше имя" onChange={e => setName(e.target.value)} />
      <button onClick={handleCreate} className="p-3 bg-purple-600 rounded">Создать и войти</button>
    </div>
  );
}