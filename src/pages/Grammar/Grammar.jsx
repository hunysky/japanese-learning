import React from 'react';
import TtsButton from '../../components/common/TtsButton/TtsButton';
import { grammar } from '../../data/grammar';
import styles from './Grammar.module.css';

export default function Grammar() {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>기초 문법 <span>초급</span></h1>
            </header>

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
        </div>
    );
}
