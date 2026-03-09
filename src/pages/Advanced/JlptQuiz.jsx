import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import { jlptN1Exam } from '../../data/jlpt-n1';
import styles from './JlptQuiz.module.css';

export default function JlptQuiz() {
    const navigate = useNavigate();

    // Quiz Progress State
    const [isStarted, setIsStarted] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Flatten all questions for easier navigation
    const allQuestions = React.useMemo(() => {
        const questions = [];
        jlptN1Exam.sections.forEach((section, sIdx) => {
            section.questions.forEach((q, qIdx) => {
                questions.push({
                    ...q,
                    sectionTitle: section.title,
                    globalIndex: questions.length,
                    sectionIndex: sIdx,
                    qIndexInSection: qIdx
                });
            });
        });
        return questions;
    }, []);

    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState({}); // { [globalIndex]: selectedOptionIndex }

    // Timer State
    const [timeLeft, setTimeLeft] = useState(jlptN1Exam.timeLimit);

    useEffect(() => {
        let timer;
        if (isStarted && !isFinished && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && !isFinished) {
            handleFinish();
        }
        return () => clearInterval(timer);
    }, [isStarted, isFinished, timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
        setIsStarted(true);
    };

    const handleOptionSelect = (optionIndex) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestionIdx]: optionIndex
        }));
    };

    const handleNext = () => {
        if (currentQuestionIdx < allQuestions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
        } else {
            handleFinish();
        }
    };

    const handlePrev = () => {
        if (currentQuestionIdx > 0) {
            setCurrentQuestionIdx(prev => prev - 1);
        }
    };

    const handleFinish = () => {
        setIsFinished(true);
    };

    // Rendering functions
    if (!isStarted) {
        return (
            <div className={styles.page}>
                <header className={styles.header}>
                    <h1 className={styles.title}>{jlptN1Exam.title}</h1>
                    <Button variant="secondary" onClick={() => navigate('/advanced')}>돌아가기</Button>
                </header>
                <div className={styles.introCard}>
                    <div className={styles.icon}>🎯</div>
                    <p className={styles.introDesc}>{jlptN1Exam.description}</p>
                    <p className={styles.introDesc}>제한 시간: {jlptN1Exam.timeLimit / 60}분</p>
                    <p className={styles.introDesc}>총 문항 수: {allQuestions.length}문항</p>
                    <Button variant="primary" onClick={handleStart} size="lg">모의고사 시작하기</Button>
                </div>
            </div>
        );
    }

    if (isFinished) {
        let correctCount = 0;
        allQuestions.forEach((q, idx) => {
            if (answers[idx] === q.answer) correctCount++;
        });

        return (
            <div className={styles.page}>
                <header className={styles.header}>
                    <h1 className={styles.title}>테스트 결과</h1>
                    <Button variant="secondary" onClick={() => navigate('/advanced')}>대시보드로</Button>
                </header>

                <div className={styles.resultContainer}>
                    <div className={styles.scoreBox}>
                        {correctCount} <span>/ {allQuestions.length}</span>
                        <div style={{ fontSize: '1.2rem', marginTop: '1rem', color: 'var(--text-primary)' }}>
                            정답률: {Math.round((correctCount / allQuestions.length) * 100)}%
                        </div>
                    </div>

                    <div className={styles.explanationList}>
                        {allQuestions.map((q, idx) => {
                            const isCorrect = answers[idx] === q.answer;
                            const isAnswered = answers[idx] !== undefined;

                            return (
                                <div key={idx} className={`${styles.explanationItem} ${!isCorrect ? styles.wrong : ''}`}>
                                    <div className={styles.sectionTitle} style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{q.sectionTitle}</div>
                                    <div className={styles.exQuestion}>Q{idx + 1}. {q.text.length > 50 ? q.text.substring(0, 50) + '...' : q.text}</div>

                                    <span className={`${styles.exVerdict} ${isCorrect ? styles.correct : styles.wrong}`}>
                                        {isCorrect ? '정답' : (isAnswered ? '오답' : '미응답')}
                                    </span>

                                    <div className={styles.exText}>
                                        <div style={{ marginBottom: '0.5rem' }}>나의 답: {isAnswered ? q.options[answers[idx]] : '-'}</div>
                                        <div>{q.explanation}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    const q = allQuestions[currentQuestionIdx];

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>{jlptN1Exam.title}</h1>
                <div className={styles.timer} style={{ color: timeLeft < 60 ? '#f44336' : 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    ⏳ {formatTime(timeLeft)}
                </div>
            </header>

            <div className={styles.quizContainer}>
                <div className={styles.quizHeader}>
                    <div className={styles.sectionTitle}>{q.sectionTitle}</div>
                    <div className={styles.progress}>{currentQuestionIdx + 1} / {allQuestions.length}</div>
                </div>

                <div className={styles.questionBox}>
                    <div className={styles.questionText}>{q.text}</div>
                    <div className={styles.optionsGrid}>
                        {q.options.map((opt, idx) => (
                            <button
                                key={idx}
                                className={`${styles.optionBtn} ${answers[currentQuestionIdx] === idx ? styles.selected : ''}`}
                                onClick={() => handleOptionSelect(idx)}
                            >
                                {idx + 1}. {opt}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.navButtons}>
                    <Button variant="secondary" onClick={handlePrev} disabled={currentQuestionIdx === 0}>
                        ← 이전
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleNext}
                    >
                        {currentQuestionIdx === allQuestions.length - 1 ? '제출하기' : '다음 →'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
