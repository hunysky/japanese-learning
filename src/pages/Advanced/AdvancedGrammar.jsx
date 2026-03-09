import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import { advancedGrammar } from '../../data/advanced-grammar';
import styles from './AdvancedGrammar.module.css';

export default function AdvancedGrammar() {
    const navigate = useNavigate();

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>고급 문법 & 뉘앙스</h1>
                <Button variant="secondary" onClick={() => navigate('/advanced')}>뒤로 가기</Button>
            </header>

            <div className={styles.grammarList}>
                {advancedGrammar.map(item => (
                    <div key={item.id} className={styles.grammarCard}>
                        <div className={styles.pattern}>{item.pattern}</div>
                        <div className={styles.explanation}>{item.explanation}</div>

                        {item.nuance && (
                            <div className={styles.nuanceBox}>
                                <div className={styles.nuanceTitle}>💡 뉘앙스 및 쓰임새 체크</div>
                                <div className={styles.nuanceText}>{item.nuance}</div>
                            </div>
                        )}

                        <div className={styles.examples}>
                            <div className={styles.examplesTitle}>📖 예문</div>
                            {item.examples.map((ex, idx) => (
                                <div key={idx} className={styles.exampleItem}>
                                    <div className={styles.japanese}>{ex.japanese}</div>
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
