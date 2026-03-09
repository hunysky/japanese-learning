import React, { useState, useEffect, useMemo } from 'react';
import Button from '../../../components/common/Button/Button';
import styles from './ExamSession.module.css';

export default function ExamSession({ examData, onFinish, onExit }) {
    const [timeLeft, setTimeLeft] = useState(examData.timeLimit);
    const [answers, setAnswers] = useState({});

    // Flatten all questions with indices for easier navigation
    const questionsList = useMemo(() => {
        let list = [];
        examData.sections.forEach((section, secIdx) => {
            section.questions.forEach((q, qIdx) => {
                list.push({
                    ...q,
                    globalIndex: list.length,
                    sectionIndex: secIdx,
                    sectionTitle: section.title,
                });
            });
        });
        return list;
    }, [examData]);

    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

    // Timer Logic
    useEffect(() => {
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }
        const timerBtn = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timerBtn);
    }, [timeLeft]);

    // Setup leaving warning
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    const handleSubmit = () => {
        const timeSpent = examData.timeLimit - timeLeft;
        onFinish(answers, timeSpent);
    };

    const handleOptionSelect = (optIndex) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestionIdx]: optIndex
        }));
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(3, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const currentQuestion = questionsList[currentQuestionIdx];

    return (
        <div className={styles.sessionLayout}>
            {/* OMR / Question Navigator Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.timerBox}>
                    <span className={styles.timerLabel}>남은 시간</span>
                    <span className={`${styles.timerValue} ${timeLeft < 300 ? styles.timerUrgent : ''}`}>
                        {formatTime(timeLeft)}
                    </span>
                </div>

                <div className={styles.omrContainer}>
                    {examData.sections.map((section, sIdx) => {
                        const sectionQuestions = questionsList.filter(q => q.sectionIndex === sIdx);
                        return (
                            <div key={sIdx} className={styles.omrSection}>
                                <div className={styles.omrSectionTitle}>{section.title}</div>
                                <div className={styles.omrGrid}>
                                    {sectionQuestions.map(q => {
                                        const isAnswered = answers[q.globalIndex] !== undefined;
                                        const isCurrent = currentQuestionIdx === q.globalIndex;
                                        return (
                                            <button
                                                key={q.globalIndex}
                                                className={`
                                                    ${styles.omrBtn} 
                                                    ${isAnswered ? styles.omrAnswered : ''} 
                                                    ${isCurrent ? styles.omrCurrent : ''}
                                                `}
                                                onClick={() => setCurrentQuestionIdx(q.globalIndex)}
                                            >
                                                {q.globalIndex + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <Button variant="primary" className={styles.submitBtn} onClick={() => {
                    if (window.confirm('답안을 제출하고 시험を 종료하시겠습니까?')) {
                        handleSubmit();
                    }
                }}>답안 최종 제출</Button>
                <button className={styles.exitBtn} onClick={onExit}>중도 포기</button>
            </aside>

            {/* Main Question Area */}
            <main className={styles.mainArea}>
                <div className={styles.questionHeader}>
                    <span className={styles.qNum}>問題 {currentQuestionIdx + 1}.</span>
                    <span className={styles.qInstruction}>{currentQuestion.instruction}</span>
                </div>

                <div className={styles.questionContent}>
                    {/* Read Comprehension passage if exists */}
                    {currentQuestion.passage && (
                        <div className={styles.passageBox}>
                            {currentQuestion.passage}
                        </div>
                    )}

                    <div className={styles.questionText}>
                        {currentQuestion.text}
                    </div>

                    <div className={styles.optionsList}>
                        {currentQuestion.options.map((opt, idx) => {
                            const isSelected = answers[currentQuestionIdx] === idx;
                            return (
                                <button
                                    key={idx}
                                    className={`${styles.optionBtn} ${isSelected ? styles.selected : ''}`}
                                    onClick={() => handleOptionSelect(idx)}
                                >
                                    <span className={styles.optNum}>{idx + 1}</span> {opt}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.navButtons}>
                    <Button
                        variant="secondary"
                        disabled={currentQuestionIdx === 0}
                        onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                    >
                        ← 이전 문제
                    </Button>
                    <Button
                        variant="secondary"
                        disabled={currentQuestionIdx === questionsList.length - 1}
                        onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                    >
                        다음 문제 →
                    </Button>
                </div>
            </main>
        </div>
    );
}
