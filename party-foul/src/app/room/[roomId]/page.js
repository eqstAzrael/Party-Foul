'use client'

import { serverTimestamp, setDoc } from "firebase/firestore";
import { useParams } from "next/navigation";

export default function RoomPage() {

    const params = useParams();

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

    return(
        <div className="h-screen w-full flex items-center justify-center flex-col">
            <h1> Room Code </h1>
            <p> {params.roomId} </p>
        </div>
    );
}