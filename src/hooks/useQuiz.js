import { useState, useCallback, useEffect } from 'react';
import { shuffle } from '../utils/shuffle';

export function useQuiz(data, mode = 'char-to-romaji') {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [wrongList, setWrongList] = useState([]);
    const [isFinished, setIsFinished] = useState(false);

    const totalQuestions = 10;

    const initQuiz = useCallback(() => {
        // 1. Pick 10 random items
        const shuffledData = shuffle(data);
        const selected = shuffledData.slice(0, totalQuestions);

        // 2. Build questions
        const builtQuestions = selected.map(item => {
            let questionText = mode === 'char-to-romaji' ? item.char : item.romaji;
            let answerText = mode === 'char-to-romaji' ? item.romaji : item.char;

            // Make 3 random wrong choices
            const others = data.filter(d => d.id !== item.id);
            const shuffledOthers = shuffle(others).slice(0, 3);
            const wrongChoices = shuffledOthers.map(o => mode === 'char-to-romaji' ? o.romaji : o.char);

            return {
                item, // keep original item for tracking
                question: questionText,
                answer: answerText,
                choices: shuffle([answerText, ...wrongChoices])
            };
        });

        setQuestions(builtQuestions);
        setCurrentIndex(0);
        setScore(0);
        setWrongList([]);
        setIsFinished(false);
    }, [data, mode]);

    useEffect(() => {
        initQuiz();
    }, [initQuiz]);

    const selectAnswer = (choice) => {
        const currentQ = questions[currentIndex];
        const isCorrect = choice === currentQ.answer;

        if (isCorrect) {
            setScore(s => s + 1);
        } else {
            setWrongList(prev => [...prev, currentQ.item]);
        }
    };

    const nextQuestion = () => {
        if (currentIndex + 1 >= totalQuestions) {
            setIsFinished(true);
        } else {
            setCurrentIndex(i => i + 1);
        }
    };

    return {
        currentQuestion: questions[currentIndex],
        questionIndex: currentIndex + 1,
        totalQuestions,
        isFinished,
        score,
        wrongList,
        selectAnswer,
        nextQuestion,
        reset: initQuiz
    };
}
