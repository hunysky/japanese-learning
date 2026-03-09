import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import { advancedKanji } from '../../data/advanced-kanji';
import styles from './AdvancedKanji.module.css';

export default function AdvancedKanji() {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState(advancedKanji[0].category);

    const currentCategoryData = advancedKanji.find(c => c.category === activeCategory);
    const words = currentCategoryData?.words || [];

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>심화 한자 (N2~N1)</h1>
                <Button variant="secondary" onClick={() => navigate('/advanced')}>뒤로 가기</Button>
            </header>

            <div className={styles.tabs}>
                {advancedKanji.map(cat => (
                    <Button
                        key={cat.category}
                        variant={activeCategory === cat.category ? 'primary' : 'secondary'}
                        onClick={() => setActiveCategory(cat.category)}
                    >
                        {cat.label}
                    </Button>
                ))}
            </div>

            <div className={styles.kanjiGrid}>
                {words.map(kanjiInfo => (
                    <div key={kanjiInfo.id} className={styles.kanjiCard}>
                        <div className={styles.kanjiHeader}>
                            <div>
                                <div className={styles.kanjiChar}>{kanjiInfo.kanji}</div>
                                <div className={styles.kanjiMeaning}>{kanjiInfo.meaning}</div>
                            </div>
                            <div className={styles.readings}>
                                <div className={styles.readingGroup}>
                                    <span className={styles.readingLabel}>음독</span>
                                    <span className={styles.readingText}>{kanjiInfo.onyomi || '-'}</span>
                                </div>
                                <div className={styles.readingGroup}>
                                    <span className={styles.readingLabel}>훈독</span>
                                    <span className={styles.readingText}>{kanjiInfo.kunyomi || '-'}</span>
                                </div>
                            </div>
                        </div>

                        {kanjiInfo.examples.length > 0 && (
                            <div className={styles.examples}>
                                <div className={styles.examplesTitle}>활용 예시</div>
                                {kanjiInfo.examples.map((ex, idx) => (
                                    <div key={idx} className={styles.exampleItem}>
                                        <div className={styles.exWord}>{ex.word}</div>
                                        <div className={styles.exReading}>{ex.reading}</div>
                                        <div className={styles.exMeaning}>{ex.meaning}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
