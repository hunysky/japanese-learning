import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button/Button';
import TtsButton from '../../components/common/TtsButton/TtsButton';
import FlashCard from '../../features/FlashCard/FlashCard';
import { vocabulary } from '../../data/vocabulary';
import { useProgress } from '../../hooks/useProgress';
import styles from './Vocabulary.module.css';

export default function Vocabulary() {
    const [activeCategory, setActiveCategory] = useState(vocabulary[0].category);
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'flashcard'
    const [flashcardIndex, setFlashcardIndex] = useState(0);
    const { saveFlashcardPos, getFlashcardPos } = useProgress();

    useEffect(() => {
        getFlashcardPos(`vocabulary_${activeCategory}`).then(pos => {
            setFlashcardIndex(pos || 0);
        });
    }, [activeCategory]);

    const currentCategoryData = vocabulary.find(c => c.category === activeCategory);
    const words = currentCategoryData?.words || [];

    const handleCategoryChange = (cat) => {
        setActiveCategory(cat);
    };

    const nextFlashcard = () => {
        const nextIdx = (flashcardIndex + 1) % words.length;
        setFlashcardIndex(nextIdx);
        saveFlashcardPos(`vocabulary_${activeCategory}`, nextIdx);
    };

    const prevFlashcard = () => {
        const prevIdx = (flashcardIndex - 1 + words.length) % words.length;
        setFlashcardIndex(prevIdx);
        saveFlashcardPos(`vocabulary_${activeCategory}`, prevIdx);
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>단어/어휘 <span>초급</span></h1>
            </header>

            {/* Categories */}
            <div className={styles.tabs}>
                {vocabulary.map(cat => (
                    <Button
                        key={cat.category}
                        variant={activeCategory === cat.category ? 'primary' : 'secondary'}
                        onClick={() => handleCategoryChange(cat.category)}
                    >
                        {cat.label}
                    </Button>
                ))}
            </div>

            {/* View Mode Toggle */}
            <div className={styles.viewToggle}>
                <Button
                    variant={viewMode === 'list' ? 'primary' : 'secondary'}
                    onClick={() => setViewMode('list')}
                >
                    카드 보기
                </Button>
                <Button
                    variant={viewMode === 'flashcard' ? 'primary' : 'secondary'}
                    onClick={() => setViewMode('flashcard')}
                >
                    플래시카드
                </Button>
            </div>

            {/* Content */}
            <div className={styles.content}>
                {viewMode === 'list' && (
                    <div className={styles.listGrid}>
                        {words.map(word => (
                            <div key={word.id} className={styles.wordCard}>
                                <div className={styles.wordHeader}>
                                    <div className={styles.japanese}>
                                        {word.japanese} <span className={styles.kanji}>{word.kanji && `(${word.kanji})`}</span>
                                    </div>
                                    <TtsButton text={word.japanese} size="md" />
                                </div>
                                <div className={styles.romaji}>{word.romaji}</div>
                                <div className={styles.korean}>{word.korean}</div>
                            </div>
                        ))}
                    </div>
                )}

                {viewMode === 'flashcard' && words.length > 0 && (
                    <div className={styles.flashcardContainer}>
                        <FlashCard
                            item={{
                                char: words[flashcardIndex].japanese,
                                romaji: words[flashcardIndex].romaji,
                                korean: `${words[flashcardIndex].korean} ${words[flashcardIndex].kanji ? `(${words[flashcardIndex].kanji})` : ''}`
                            }}
                        />
                        <div className={styles.flashcardControls}>
                            <Button variant="ghost" onClick={prevFlashcard}>← 이전</Button>
                            <span className={styles.flashcardCount}>{flashcardIndex + 1} / {words.length}</span>
                            <Button variant="ghost" onClick={nextFlashcard}>다음 →</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
