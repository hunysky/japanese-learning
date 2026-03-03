import React, { useState, useEffect } from 'react';
import { useProgress } from '../../hooks/useProgress';
import Button from '../../components/common/Button/Button';
import styles from './WrongNotes.module.css';

export default function WrongNotes({ section, data, onStartQuiz }) {
    const { getWrongAnswers } = useProgress();
    const [wrongAnswers, setWrongAnswers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const wrongs = await getWrongAnswers(section);
            setWrongAnswers(wrongs);
            setLoading(false);
        };
        load();
    }, [section]);

    if (loading) {
        return <div className={styles.loading}>오답 데이터 로딩 중...</div>;
    }

    if (wrongAnswers.length === 0) {
        return (
            <div className={styles.empty}>
                <div className={styles.emptyIcon}>🎉</div>
                <p>아직 오답 기록이 없습니다!</p>
                <p className={styles.emptyHint}>퀴즈를 풀어보면 여기에 틀린 문자가 표시됩니다.</p>
            </div>
        );
    }

    // 오답에 해당하는 data 항목 찾기
    const wrongItems = wrongAnswers
        .map(w => {
            const item = data.find(d => d.char === w.character);
            return item ? { ...item, wrongCount: w.wrong_count } : null;
        })
        .filter(Boolean);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    ❌ 오답 노트 <span>({wrongItems.length}개)</span>
                </h3>
                {wrongItems.length >= 4 && (
                    <Button
                        variant="primary"
                        onClick={() => onStartQuiz && onStartQuiz(wrongItems)}
                    >
                        오답만 퀴즈
                    </Button>
                )}
            </div>

            <div className={styles.grid}>
                {wrongItems.map((item, idx) => (
                    <div key={idx} className={styles.card}>
                        <div className={styles.char}>{item.char}</div>
                        <div className={styles.romaji}>{item.romaji}</div>
                        <div className={styles.korean}>{item.korean}</div>
                        <div className={styles.wrongCount}>×{item.wrongCount}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
