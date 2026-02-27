import React, { useState, useEffect } from 'react';
import KanaChart from '../../../features/KanaChart/KanaChart';
import FlashCard from '../../../features/FlashCard/FlashCard';
import StrokeCanvas from '../../../features/StrokeCanvas/StrokeCanvas';
import Quiz from '../../../features/Quiz/Quiz';
import Button from '../Button/Button';
import { useProgress } from '../../../hooks/useProgress';
import styles from './KanaPage.module.css';

export default function KanaPage({ section, data }) {
    const [tab, setTab] = useState('chart'); // 'chart' | 'flashcard' | 'canvas' | 'quiz'
    const [flashcardIndex, setFlashcardIndex] = useState(0);
    const { saveFlashcardPos, getFlashcardPos } = useProgress();

    useEffect(() => {
        getFlashcardPos(section).then(pos => {
            setFlashcardIndex(pos || 0);
        });
    }, [section]);

    const title = section === 'hiragana' ? '히라가나' : '가타카나';

    const nextFlashcard = () => {
        const nextIdx = (flashcardIndex + 1) % data.length;
        setFlashcardIndex(nextIdx);
        saveFlashcardPos(section, nextIdx);
    };

    const prevFlashcard = () => {
        const prevIdx = (flashcardIndex - 1 + data.length) % data.length;
        setFlashcardIndex(prevIdx);
        saveFlashcardPos(section, prevIdx);
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>{title} <span>초급</span></h1>
            </header>

            <div className={styles.tabs}>
                <Button
                    variant={tab === 'chart' ? 'primary' : 'secondary'}
                    onClick={() => setTab('chart')}
                >오십음도</Button>
                <Button
                    variant={tab === 'flashcard' ? 'primary' : 'secondary'}
                    onClick={() => setTab('flashcard')}
                >플래시카드</Button>
                <Button
                    variant={tab === 'canvas' ? 'primary' : 'secondary'}
                    onClick={() => setTab('canvas')}
                >필순연습</Button>
                <Button
                    variant={tab === 'quiz' ? 'primary' : 'secondary'}
                    onClick={() => setTab('quiz')}
                >퀴즈</Button>
            </div>

            <div className={styles.content}>
                {tab === 'chart' && <KanaChart data={data} />}

                {tab === 'flashcard' && (
                    <div className={styles.flashcardContainer}>
                        <FlashCard item={data[flashcardIndex]} />
                        <div className={styles.flashcardControls}>
                            <Button variant="ghost" onClick={prevFlashcard}>← 이전</Button>
                            <span className={styles.flashcardCount}>{flashcardIndex + 1} / {data.length}</span>
                            <Button variant="ghost" onClick={nextFlashcard}>다음 →</Button>
                        </div>
                    </div>
                )}

                {tab === 'canvas' && <StrokeCanvas data={data} />}

                {tab === 'quiz' && <Quiz data={data} section={section} />}
            </div>
        </div>
    );
}
