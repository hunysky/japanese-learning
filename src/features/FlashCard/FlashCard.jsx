import React, { useState } from 'react';
import TtsButton from '../../components/common/TtsButton/TtsButton';
import { useSwipe } from '../../hooks/useSwipe';
import styles from './FlashCard.module.css';

export default function FlashCard({ item, onNext, onPrev }) {
    const [isFlipped, setIsFlipped] = useState(false);

    // item이 바뀔 때 앞면으로 초기화
    React.useEffect(() => {
        setIsFlipped(false);
    }, [item]);

    const swipeHandlers = useSwipe({
        onSwipeLeft: onNext,
        onSwipeRight: onPrev,
        threshold: 50
    });

    if (!item) return null;

    return (
        <div className={styles.scene} {...swipeHandlers}>
            <div
                className={`${styles.card} ${isFlipped ? styles.isFlipped : ''}`}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                {/* Front */}
                <div className={`${styles.face} ${styles.front}`}>
                    <div className={styles.char}>{item.char || item.japanese}</div>
                    <div className={styles.hint}>탭하여 뒤집기 · 스와이프하여 이동</div>
                </div>

                {/* Back */}
                <div className={`${styles.face} ${styles.back}`}>
                    <div className={styles.backMain}>{item.char || item.japanese}</div>
                    <div className={styles.romaji}>{item.romaji}</div>
                    <div className={styles.korean}>{item.korean}</div>

                    <div className={styles.ttsWrapper}>
                        <TtsButton text={item.char || item.japanese} size="md" />
                    </div>
                </div>
            </div>
        </div>
    );
}
