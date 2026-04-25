import { useMemo, useState } from 'react';
import questions from '../data/questions.json'; 
import { auth, db } from '../firebase/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

export default function Quiz({ roomId, onFinish }) {
    const [score, setScore] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [step, setStep] = useState(0);

    const quizList = useMemo(() => {
        return [...questions].sort(() => Math.random() - 0.5).slice(0, 5);
    }, []);
    const currentQuestion = quizList[step];

    const saveFinalResult = async (finalScore) => {
        const user = auth.currentUser;
        if (!user || !roomId) return;

        const roomRef = doc(db, "rooms", roomId);

        try {
            await updateDoc(roomRef, {
            [`scores.${user.uid}`]: increment(finalScore) 
            });

            console.log("Счет успешно обновлен и суммирован!");
        } catch (e) {
            console.error("Ошибка при обновлении счета:", e);
        }
    };

    const checkAnswer = async (index) => {
        console.log(step);
        setIsLocked(true);

        if (index === currentQuestion.correctIndex) {
            let currentScore = score + 100;
            setScore(currentScore);
        }
        setTimeout(() => {
            if (step < quizList.length - 1) {
                setStep(prev => prev + 1); 
                setIsLocked(false);
            } else {
                saveFinalResult(score);
                if (onFinish) onFinish(); 
                return alert("Ожидание других игроков");
            }
        }, 1200);  
    }

    return (
        <section className="h-screen w-full bg-radial-[at_top_left] from-[#8B2FF3] via-[#4A6CF7] to-[#0355da] flex flex-col justify-center items-center gap-40">
          <h1 className="p-10 text-4xl font-bold text-white">Квизяка</h1>  
          <h2> {currentQuestion.question} </h2>
          <div className='flex flex-row gap-10'>
            {currentQuestion.answers.map((answer, index) => (
                <button key={index} onClick={() => checkAnswer(index)} disabled={isLocked} className='border-2 p-10'>
                    {answer}
                </button>
            ))} 
          </div>
          <h1>{score}</h1>
          
        </section> 
    );
}