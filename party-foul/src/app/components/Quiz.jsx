import { useMemo, useState } from 'react';
import questions from '../data/questions.json'; 


export default function Quiz() {
    const [score, setScore] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [step, setStep] = useState(0);

    const quizList = useMemo(() => {
        return [...questions].sort(() => Math.random() - 0.5).slice(0, 5);
    }, []);
    const currentQuestion = quizList[step];

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