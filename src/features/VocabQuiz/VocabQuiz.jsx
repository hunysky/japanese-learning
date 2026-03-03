import React, { useState, useCallback, useEffect } from 'react';
import Button from '../../components/common/Button/Button';
import TtsButton from '../../components/common/TtsButton/TtsButton';
import { useProgress } from '../../hooks/useProgress';
import { shuffle } from '../../utils/shuffle';
import styles from './VocabQuiz.module.css';

export default function VocabQuiz({ words, section }) {
    const [mode, setMode] = useState('jp-to-kr'); // 'jp-to-kr' | 'kr-to-jp'
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const { saveQuizScore } = useProgress();

    const totalQuestions = Math.min(10, words.length);

    const buildQuestions = useCallback(() => {
        const shuffled = shuffle(words);
        const selected = shuffled.slice(0, totalQuestions);

        const builtQuestions = selected.map(word => {
            const questionText = mode === 'jp-to-kr' ? word.japanese : word.korean;
            const answerText = mode === 'jp-to-kr' ? word.korean : word.japanese;

            const others = words.filter(w => w.id !== word.id);
            const wrongChoices = shuffle(others)
                .slice(0, 3)
                .map(w => mode === 'jp-to-kr' ? w.korean : w.japanese);

            return {
                word,
                question: questionText,
                answer: answerText,
                choices: shuffle([answerText, ...wrongChoices])
            };
        });

        setQuestions(builtQuestions);
        setCurrentIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsFinished(false);
    }, [words, mode, totalQuestions]);

    useEffect(() => {
        if (words.length >= 4) {
            buildQuestions();
        }
    }, [buildQuestions, words.length]);

    const handleChoice = (choice) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(choice);

        const isCorrect = choice === questions[currentIndex].answer;
        if (isCorrect) setScore(s => s + 1);

        setTimeout(() => {
            if (currentIndex + 1 >= questions.length) {
                setIsFinished(true);
                saveQuizScore(section || 'vocabulary', score + (isCorrect ? 1 : 0), questions.length);
            } else {
                setCurrentIndex(i => i + 1);
                setSelectedAnswer(null);
            }
        }, 1200);
    };

    if (words.length < 4) {
        return <div className={styles.empty}>퀴즈를 진행하려면 최소 4개의 단어가 필요합니다.</div>;
    }

    if (questions.length === 0) return null;

    if (isFinished) {
        return (
            <div className={styles.result}>
                <h2 className={styles.resultTitle}>단어 퀴즈 결과</h2>
                <div className={styles.resultScore}>{score} / {questions.length}</div>
                <Button variant="primary" onClick={buildQuestions}>다시 풀기</Button>
            </div>
        );
    }

    const q = questions[currentIndex];

    return (
        <div className={styles.container}>
            <div className={styles.modeToggle}>
                <Button
                    variant={mode === 'jp-to-kr' ? 'primary' : 'secondary'}
                    onClick={() => { setMode('jp-to-kr'); }}
                >
                    일본어 → 한국어
                </Button>
                <Button
                    variant={mode === 'kr-to-jp' ? 'primary' : 'secondary'}
                    onClick={() => { setMode('kr-to-jp'); }}
                >
                    한국어 → 일본어
                </Button>
            </div>

            <div className={styles.progress}>
                문제 {currentIndex + 1} / {questions.length}
            </div>

            <div className={styles.questionBox}>
                <div className={styles.question}>{q.question}</div>
                {mode === 'jp-to-kr' && (
                    <div className={styles.ttsRow}>
                        <TtsButton text={q.question} size="md" />
                    </div>
                )}
                <div className={styles.instruction}>
                    {mode === 'jp-to-kr' ? '위 단어의 뜻은?' : '위 뜻에 해당하는 일본어는?'}
                </div>
            </div>

            <div className={styles.choicesGrid}>
                {q.choices.map((choice, idx) => {
                    let cls = styles.choiceBtn;
                    if (selectedAnswer !== null) {
                        if (choice === q.answer) cls += ` ${styles.correct}`;
                        else if (choice === selectedAnswer) cls += ` ${styles.wrong}`;
                    }

                    return (
                        <button
                            key={idx}
                            className={cls}
                            onClick={() => handleChoice(choice)}
                            disabled={selectedAnswer !== null}
                        >
                            {choice}
                        </button>
                    );
                })}
            </div>

            {selectedAnswer && (
                <div className={`${styles.feedback} ${selectedAnswer === q.answer ? styles.feedbackCorrect : styles.feedbackWrong}`}>
                    {selectedAnswer === q.answer ? '正解！ 정답!' : `오답... 정답: ${q.answer}`}
                </div>
            )}
        </div>
    );
}
