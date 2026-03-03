import React, { useState, useCallback, useEffect } from 'react';
import Button from '../../components/common/Button/Button';
import TtsButton from '../../components/common/TtsButton/TtsButton';
import { shuffle } from '../../utils/shuffle';
import styles from './GrammarQuiz.module.css';

export default function GrammarQuiz({ grammarData }) {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const totalQuestions = 5;

    const buildQuestions = useCallback(() => {
        // grammarData의 examples에서 문제 생성
        const allExamples = grammarData.flatMap(g =>
            g.examples.map(ex => ({
                ...ex,
                pattern: g.pattern,
                explanation: g.explanation
            }))
        );

        const shuffled = shuffle(allExamples);
        const selected = shuffled.slice(0, Math.min(totalQuestions, shuffled.length));

        const builtQuestions = selected.map(ex => {
            // 빈칸 문제: 한국어 뜻을 보고 올바른 일본어 문장 고르기
            const correctAnswer = ex.japanese;
            const otherExamples = allExamples
                .filter(e => e.japanese !== ex.japanese)
                .map(e => e.japanese);
            const wrongChoices = shuffle(otherExamples).slice(0, 3);

            return {
                question: ex.korean,
                hint: ex.pattern,
                answer: correctAnswer,
                romaji: ex.romaji,
                choices: shuffle([correctAnswer, ...wrongChoices])
            };
        });

        setQuestions(builtQuestions);
        setCurrentIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsFinished(false);
    }, [grammarData]);

    useEffect(() => {
        buildQuestions();
    }, [buildQuestions]);

    const handleChoice = (choice) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(choice);

        if (choice === questions[currentIndex].answer) {
            setScore(s => s + 1);
        }

        setTimeout(() => {
            if (currentIndex + 1 >= questions.length) {
                setIsFinished(true);
            } else {
                setCurrentIndex(i => i + 1);
                setSelectedAnswer(null);
            }
        }, 1500);
    };

    if (questions.length === 0) return null;

    if (isFinished) {
        return (
            <div className={styles.result}>
                <h2 className={styles.resultTitle}>문법 퀴즈 결과</h2>
                <div className={styles.resultScore}>{score} / {questions.length}</div>
                <Button variant="primary" onClick={buildQuestions}>다시 풀기</Button>
            </div>
        );
    }

    const q = questions[currentIndex];

    return (
        <div className={styles.container}>
            <div className={styles.progress}>
                문제 {currentIndex + 1} / {questions.length}
            </div>

            <div className={styles.questionBox}>
                <div className={styles.hint}>패턴: {q.hint}</div>
                <div className={styles.question}>"{q.question}"</div>
                <div className={styles.instruction}>위 뜻에 맞는 일본어 문장은?</div>
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
                            <span className={styles.choiceText}>{choice}</span>
                            <TtsButton text={choice} size="sm" />
                        </button>
                    );
                })}
            </div>

            {selectedAnswer && (
                <div className={`${styles.feedback} ${selectedAnswer === q.answer ? styles.feedbackCorrect : styles.feedbackWrong}`}>
                    {selectedAnswer === q.answer ? '正解！ 정답입니다!' : `오답... 정답: ${q.answer}`}
                </div>
            )}
        </div>
    );
}
