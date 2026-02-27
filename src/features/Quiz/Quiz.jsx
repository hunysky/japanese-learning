import React, { useState, useEffect } from 'react';
import { useQuiz } from '../../hooks/useQuiz';
import { useProgress } from '../../hooks/useProgress';
import Button from '../../components/common/Button/Button';
import styles from './Quiz.module.css';

export default function Quiz({ data, section }) {
    const [mode, setMode] = useState('char-to-romaji'); // or 'romaji-to-char'
    const [selectedChoice, setSelectedChoice] = useState(null);
    const { saveQuizScore, saveWrongAnswer } = useProgress();

    const {
        currentQuestion,
        questionIndex,
        totalQuestions,
        isFinished,
        score,
        wrongList,
        selectAnswer,
        nextQuestion,
        reset
    } = useQuiz(data, mode);

    useEffect(() => {
        if (selectedChoice !== null) {
            const timer = setTimeout(() => {
                setSelectedChoice(null);
                nextQuestion();
            }, 1200);
            return () => clearTimeout(timer);
        }
    }, [selectedChoice, nextQuestion]);

    useEffect(() => {
        if (isFinished) {
            saveQuizScore(section || 'unknown', score, totalQuestions);
        }
    }, [isFinished, score, totalQuestions, section, saveQuizScore]);

    if (!currentQuestion && !isFinished) return null;

    const handleChoiceClick = (choice) => {
        if (selectedChoice !== null) return; // Prevent multiple clicks
        setSelectedChoice(choice);
        selectAnswer(choice);

        // Save to Supabase if wrong
        if (choice !== currentQuestion.answer) {
            saveWrongAnswer(section || 'unknown', currentQuestion.item.char);
        }
    };

    if (isFinished) {
        return (
            <div className={styles.resultContainer}>
                <h2 className={styles.resultTitle}>결과</h2>
                <div className={styles.score}>{score} / {totalQuestions}</div>

                {wrongList.length > 0 && (
                    <div className={styles.wrongArea}>
                        <p className={styles.wrongTitle}>틀린 문자 목록:</p>
                        <div className={styles.wrongList}>
                            {wrongList.map((item, idx) => (
                                <span key={idx} className={styles.wrongItem}>{item.char}</span>
                            ))}
                        </div>
                    </div>
                )}

                <div className={styles.actions}>
                    <Button variant="primary" onClick={reset}>다시 풀기</Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.quizWrapper}>
            <div className={styles.modeToggle}>
                <Button
                    variant={mode === 'char-to-romaji' ? 'primary' : 'secondary'}
                    onClick={() => { setMode('char-to-romaji'); reset(); }}
                >
                    문자 → 발음
                </Button>
                <Button
                    variant={mode === 'romaji-to-char' ? 'primary' : 'secondary'}
                    onClick={() => { setMode('romaji-to-char'); reset(); }}
                >
                    발음 → 문자
                </Button>
            </div>

            <div className={styles.progress}>
                문제 {questionIndex} / {totalQuestions}
            </div>

            <div className={styles.questionBox}>
                <div className={styles.questionHint}>
                    "{currentQuestion.question}" 의 {mode === 'char-to-romaji' ? '발음은?' : '문자는?'}
                </div>
            </div>

            <div className={styles.choicesGrid}>
                {currentQuestion.choices.map((choice, idx) => {
                    let btnClass = styles.choiceBtn;

                    if (selectedChoice !== null) {
                        if (choice === currentQuestion.answer) {
                            btnClass += ` ${styles.correct}`;
                        } else if (choice === selectedChoice) {
                            btnClass += ` ${styles.wrong}`;
                        }
                    }

                    return (
                        <button
                            key={idx}
                            className={btnClass}
                            onClick={() => handleChoiceClick(choice)}
                            disabled={selectedChoice !== null}
                        >
                            {choice}
                        </button>
                    );
                })}
            </div>

            {selectedChoice && (
                <div className={`${styles.feedback} ${selectedChoice === currentQuestion.answer ? styles.feedbackCorrect : styles.feedbackWrong}`}>
                    {selectedChoice === currentQuestion.answer ? '正解！ (정답)' : '不正解... (오답)'}
                </div>
            )}
        </div>
    );
}
