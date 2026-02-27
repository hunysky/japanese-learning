import React, { useState } from 'react';
import TtsButton from '../../components/common/TtsButton/TtsButton';
import styles from './FlashCard.module.css';

export default function FlashCard({ item }) {
    const [isFlipped, setIsFlipped] = useState(false);

    // item이 바뀔 때 앞면으로 초기화
    React.useEffect(() => {
        setIsFlipped(false);
    }, [item]);

    if (!item) return null;

    return (
        <div className={styles.scene}>
            <div
                className={`${styles.card} ${isFlipped ? styles.isFlipped : ''}`}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                {/* Front */}
                <div className={`${styles.face} ${styles.front}`}>
                    <div className={styles.char}>{item.char || item.japanese}</div>
                    <div className={styles.hint}>클릭해서 뒤집기</div>
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
