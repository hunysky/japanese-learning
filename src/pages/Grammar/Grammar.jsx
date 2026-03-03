import React, { useState } from 'react';
import TtsButton from '../../components/common/TtsButton/TtsButton';
import GrammarQuiz from '../../features/GrammarQuiz/GrammarQuiz';
import Button from '../../components/common/Button/Button';
import { grammar } from '../../data/grammar';
import styles from './Grammar.module.css';

export default function Grammar() {
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'quiz'

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>기초 문법 <span>초급</span></h1>
            </header>

            <div className={styles.viewToggle}>
                <Button
                    variant={viewMode === 'list' ? 'primary' : 'secondary'}
                    onClick={() => setViewMode('list')}
                >
                    문법 목록
                </Button>
                <Button
                    variant={viewMode === 'quiz' ? 'primary' : 'secondary'}
                    onClick={() => setViewMode('quiz')}
                >
                    퀴즈
                </Button>
            </div>

            {viewMode === 'list' && (
                <div className={styles.patternList}>
                    {grammar.map((item) => (
                        <div key={item.id} className={styles.patternCard}>
                            <div className={styles.patternHeader}>
                                <h2 className={styles.patternTitle}>#{item.id} {item.pattern}</h2>
                                <p className={styles.explanation}>{item.explanation}</p>
                            </div>

                            <div className={styles.examples}>
                                {item.examples.map((ex, idx) => (
                                    <div key={idx} className={styles.exampleRow}>
                                        <div className={styles.exampleHeader}>
                                            <div className={styles.japanese}>{ex.japanese}</div>
                                            <TtsButton text={ex.japanese} size="sm" />
                                        </div>
                                        <div className={styles.romaji}>{ex.romaji}</div>
                                        <div className={styles.korean}>{ex.korean}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {viewMode === 'quiz' && (
                <GrammarQuiz grammarData={grammar} />
            )}
        </div>
    );
}
