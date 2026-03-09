import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import { readingTexts } from '../../data/reading';
import styles from './ReadingPractice.module.css';

export default function ReadingPractice() {
    const navigate = useNavigate();
    const [activeArticleId, setActiveArticleId] = useState(readingTexts[0].id);
    const [showTranslation, setShowTranslation] = useState(false);

    // Quiz state: { [quizIndex]: selectedOptionIndex }
    const [quizAnswers, setQuizAnswers] = useState({});

    const article = readingTexts.find(a => a.id === activeArticleId);

    const handleArticleChange = (id) => {
        setActiveArticleId(id);
        setShowTranslation(false);
        setQuizAnswers({});
    };

    const handleOptionSelect = (qIndex, optIndex) => {
        if (quizAnswers[qIndex] !== undefined) return; // Already answered
        setQuizAnswers(prev => ({
            ...prev,
            [qIndex]: optIndex
        }));
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>장문 독해 연습</h1>
                <Button variant="secondary" onClick={() => navigate('/advanced')}>뒤로 가기</Button>
            </header>

            <div className={styles.selectText}>
                <div className={styles.selectTitle}>지문 선택:</div>
                <div className={styles.textButtons}>
                    {readingTexts.map(item => (
                        <Button
                            key={item.id}
                            variant={activeArticleId === item.id ? 'primary' : 'secondary'}
                            onClick={() => handleArticleChange(item.id)}
                        >
                            {item.title}
                        </Button>
                    ))}
                </div>
            </div>

            {article && (
                <div className={styles.readingCard}>
                    <div className={styles.articleHeader}>
                        <h2 className={styles.articleTitle}>{article.title}</h2>
                        <div className={styles.articleMeta}>
                            <span className={styles.badge}>{article.level}</span>
                            <span className={styles.badge}>{article.category}</span>
                        </div>
                    </div>

                    <div className={styles.articleContent}>
                        {article.text}
                    </div>

                    <div className={styles.translationToggle}>
                        <Button
                            variant="secondary"
                            onClick={() => setShowTranslation(!showTranslation)}
                        >
                            {showTranslation ? '해석 숨기기 ▲' : '한국어 해석 보기 ▼'}
                        </Button>
                    </div>

                    {showTranslation && (
                        <div className={styles.translationBox}>
                            {article.translation}
                        </div>
                    )}

                    <div className={styles.quizSection}>
                        <h3 className={styles.quizSectionTitle}>독해 확인 퀴즈</h3>
                        {article.quiz.map((q, qIndex) => {
                            const isAnswered = quizAnswers[qIndex] !== undefined;
                            const selectedOption = quizAnswers[qIndex];

                            return (
                                <div key={qIndex} className={styles.quizItem}>
                                    <div className={styles.questionText}>
                                        Q{qIndex + 1}. {q.question}
                                    </div>
                                    <div className={styles.optionsList}>
                                        {q.options.map((opt, optIndex) => {
                                            let btnClass = styles.optionButton;
                                            if (isAnswered) {
                                                if (optIndex === q.answer) {
                                                    btnClass += ` ${styles.correct}`;
                                                } else if (optIndex === selectedOption) {
                                                    btnClass += ` ${styles.incorrect}`;
                                                }
                                            }

                                            return (
                                                <button
                                                    key={optIndex}
                                                    className={btnClass}
                                                    onClick={() => handleOptionSelect(qIndex, optIndex)}
                                                    disabled={isAnswered}
                                                >
                                                    {optIndex + 1}. {opt}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {isAnswered && (
                                        <div className={styles.explanationBox}>
                                            <span className={styles.exLabel}>해설:</span>
                                            <span className={styles.exText}>{q.explanation}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
