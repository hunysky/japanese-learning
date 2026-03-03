import React, { useState, useEffect, useMemo } from 'react';
import { useSpacedRepetition } from '../../hooks/useSpacedRepetition';
import { hiragana } from '../../data/hiragana';
import { katakana } from '../../data/katakana';
import TtsButton from '../../components/common/TtsButton/TtsButton';
import Button from '../../components/common/Button/Button';
import styles from './SpacedReview.module.css';

const ALL_CHARS = [
    ...hiragana.map(h => ({ ...h, section: 'hiragana' })),
    ...katakana.map(k => ({ ...k, section: 'katakana' }))
];

export default function SpacedReview() {
    const { items, registerItem, recordReview, getDueItems, getStats } = useSpacedRepetition();
    const [initialized, setInitialized] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [sessionComplete, setSessionComplete] = useState(false);

    // 처음 로드 시 모든 문자 등록
    useEffect(() => {
        ALL_CHARS.forEach(char => {
            registerItem(`${char.section}_${char.id}`);
        });
        setInitialized(true);
    }, []);

    const dueKeys = useMemo(() => {
        if (!initialized) return [];
        return getDueItems();
    }, [initialized, getDueItems]);

    const dueChars = useMemo(() => {
        return dueKeys.map(key => {
            const [section, id] = key.split('_');
            return ALL_CHARS.find(c => c.section === section && c.id === parseInt(id));
        }).filter(Boolean).slice(0, 20); // 한 세션 최대 20개
    }, [dueKeys]);

    const stats = getStats();
    const currentChar = dueChars[currentIndex];

    const handleRate = (quality) => {
        if (!currentChar) return;
        recordReview(`${currentChar.section}_${currentChar.id}`, quality);
        setShowAnswer(false);

        if (currentIndex + 1 >= dueChars.length) {
            setSessionComplete(true);
        } else {
            setCurrentIndex(i => i + 1);
        }
    };

    const restart = () => {
        setCurrentIndex(0);
        setShowAnswer(false);
        setSessionComplete(false);
    };

    if (!initialized) return null;

    if (dueChars.length === 0 || sessionComplete) {
        return (
            <div className={styles.container}>
                <div className={styles.complete}>
                    <div className={styles.completeIcon}>🎉</div>
                    <h2>{sessionComplete ? '복습 완료!' : '오늘의 복습 완료!'}</h2>
                    <p className={styles.completeInfo}>
                        전체 {stats.total}자 중 {stats.mastered}자 마스터
                    </p>
                    {stats.due > 0 && (
                        <Button variant="primary" onClick={restart}>다시 복습하기</Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.progress}>
                복습 {currentIndex + 1} / {dueChars.length}
                <span className={styles.dueCount}>(오늘 {stats.due}자 남음)</span>
            </div>

            <div className={styles.card} onClick={() => setShowAnswer(true)}>
                <div className={styles.charMain}>{currentChar.char}</div>
                {!showAnswer && (
                    <div className={styles.tapHint}>탭하여 정답 보기</div>
                )}
                {showAnswer && (
                    <div className={styles.answer}>
                        <div className={styles.answerRomaji}>{currentChar.romaji}</div>
                        <div className={styles.answerKorean}>{currentChar.korean}</div>
                        <TtsButton text={currentChar.char} size="md" />
                    </div>
                )}
            </div>

            {showAnswer && (
                <div className={styles.ratingButtons}>
                    <p className={styles.rateLabel}>얼마나 알고 있었나요?</p>
                    <div className={styles.rateGrid}>
                        <button className={`${styles.rateBtn} ${styles.rateFail}`} onClick={() => handleRate(1)}>
                            😵 모름
                        </button>
                        <button className={`${styles.rateBtn} ${styles.rateHard}`} onClick={() => handleRate(2)}>
                            😅 어려움
                        </button>
                        <button className={`${styles.rateBtn} ${styles.rateGood}`} onClick={() => handleRate(3)}>
                            🙂 보통
                        </button>
                        <button className={`${styles.rateBtn} ${styles.rateEasy}`} onClick={() => handleRate(5)}>
                            😎 쉬움
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
