import React, { useState } from 'react';
import Button from '../../components/common/Button/Button';
import TtsButton from '../../components/common/TtsButton/TtsButton';
import FlashCard from '../../features/FlashCard/FlashCard';
import VocabQuiz from '../../features/VocabQuiz/VocabQuiz';
import NumberPractice from '../../features/NumberPractice/NumberPractice';
import SearchBar from '../../components/common/SearchBar/SearchBar';
import BookmarkButton from '../../components/common/BookmarkButton/BookmarkButton';
import { vocabulary } from '../../data/vocabulary';
import { useFlashcard } from '../../hooks/useFlashcard';
import { useBookmarks } from '../../hooks/useBookmarks';
import styles from './Vocabulary.module.css';

export default function Vocabulary() {
    const [activeCategory, setActiveCategory] = useState(vocabulary[0].category);
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'flashcard' | 'quiz' | 'number'
    const [searchQuery, setSearchQuery] = useState('');
    const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

    const currentCategoryData = vocabulary.find(c => c.category === activeCategory);
    const words = currentCategoryData?.words || [];

    const { flashcardIndex, nextFlashcard, prevFlashcard } = useFlashcard(
        words,
        `vocabulary_${activeCategory}`
    );

    // 검색 필터
    const filteredWords = searchQuery
        ? words.filter(w =>
            w.japanese.includes(searchQuery) ||
            w.korean.includes(searchQuery) ||
            w.romaji.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (w.kanji && w.kanji.includes(searchQuery))
        )
        : words;

    const handleCategoryChange = (cat) => {
        setActiveCategory(cat);
        setSearchQuery('');
    };

    const toggleBookmark = (word) => {
        const bmId = `${activeCategory}_${word.id}`;
        if (isBookmarked('vocabulary', bmId)) {
            removeBookmark('vocabulary', bmId);
        } else {
            addBookmark({
                type: 'vocabulary',
                id: bmId,
                japanese: word.japanese,
                kanji: word.kanji,
                romaji: word.romaji,
                korean: word.korean
            });
        }
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
                <Button variant={viewMode === 'list' ? 'primary' : 'secondary'} onClick={() => setViewMode('list')}>카드 보기</Button>
                <Button variant={viewMode === 'flashcard' ? 'primary' : 'secondary'} onClick={() => setViewMode('flashcard')}>플래시카드</Button>
                <Button variant={viewMode === 'quiz' ? 'primary' : 'secondary'} onClick={() => setViewMode('quiz')}>퀴즈</Button>
                {activeCategory === 'numbers' && (
                    <Button variant={viewMode === 'number' ? 'primary' : 'secondary'} onClick={() => setViewMode('number')}>숫자 연습</Button>
                )}
            </div>

            {/* Content */}
            <div className={styles.content}>
                {viewMode === 'list' && (
                    <>
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="단어 검색 (일본어/한국어/로마자)..."
                        />
                        <div className={styles.listGrid}>
                            {filteredWords.map(word => (
                                <div key={word.id} className={styles.wordCard}>
                                    <div className={styles.wordHeader}>
                                        <div className={styles.japanese}>
                                            {word.japanese} <span className={styles.kanji}>{word.kanji && `(${word.kanji})`}</span>
                                        </div>
                                        <div className={styles.wordActions}>
                                            <TtsButton text={word.japanese} size="md" />
                                            <BookmarkButton
                                                isBookmarked={isBookmarked('vocabulary', `${activeCategory}_${word.id}`)}
                                                onToggle={() => toggleBookmark(word)}
                                                size="md"
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.romaji}>{word.romaji}</div>
                                    <div className={styles.korean}>{word.korean}</div>
                                </div>
                            ))}
                            {filteredWords.length === 0 && (
                                <div className={styles.noResults}>검색 결과가 없습니다.</div>
                            )}
                        </div>
                    </>
                )}

                {viewMode === 'flashcard' && words.length > 0 && (
                    <div className={styles.flashcardContainer}>
                        <FlashCard
                            item={{
                                char: words[flashcardIndex]?.japanese,
                                romaji: words[flashcardIndex]?.romaji,
                                korean: `${words[flashcardIndex]?.korean} ${words[flashcardIndex]?.kanji ? `(${words[flashcardIndex].kanji})` : ''}`
                            }}
                            onNext={nextFlashcard}
                            onPrev={prevFlashcard}
                        />
                        <div className={styles.flashcardControls}>
                            <Button variant="ghost" onClick={prevFlashcard}>← 이전</Button>
                            <span className={styles.flashcardCount}>{flashcardIndex + 1} / {words.length}</span>
                            <Button variant="ghost" onClick={nextFlashcard}>다음 →</Button>
                        </div>
                    </div>
                )}

                {viewMode === 'quiz' && (
                    <VocabQuiz words={words} section={`vocabulary_${activeCategory}`} />
                )}

                {viewMode === 'number' && (
                    <NumberPractice />
                )}
            </div>
        </div>
    );
}
