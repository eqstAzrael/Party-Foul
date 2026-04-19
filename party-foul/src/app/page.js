'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="h-screen flex flex-col items-center justify-center gap-5 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">PARTY FOUL</h1>
      <div className="flex gap-4">
        <Link href="/create" className="p-4 bg-purple-600 rounded-xl">Создать игру</Link>
        <Link href="/join" className="p-4 bg-blue-600 rounded-xl">Войти в игру</Link>
      </div>
    </main>
  );
}