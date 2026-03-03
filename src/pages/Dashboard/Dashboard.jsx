import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../hooks/useProgress';
import styles from './Dashboard.module.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const { getWrongAnswers } = useProgress();

    const [wrongAnswers, setWrongAnswers] = useState({});
    const [loading, setLoading] = useState(true);

    const sections = [
        { key: 'hiragana_seion', label: '히라가나 (청음)', path: '/hiragana' },
        { key: 'hiragana_dakuon', label: '히라가나 (탁음)', path: '/hiragana' },
        { key: 'katakana_seion', label: '가타카나 (청음)', path: '/katakana' },
        { key: 'katakana_dakuon', label: '가타카나 (탁음)', path: '/katakana' },
    ];

    useEffect(() => {
        const loadData = async () => {
            const results = {};
            for (const sec of sections) {
                results[sec.key] = await getWrongAnswers(sec.key);
            }
            setWrongAnswers(results);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.loading}>로딩 중...</div>
            </div>
        );
    }

    const totalWrong = Object.values(wrongAnswers).reduce((sum, arr) => sum + arr.length, 0);

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>📊 학습 대시보드</h1>
                <p className={styles.subtitle}>내 학습 현황을 한눈에 확인하세요</p>
            </header>

            {/* 요약 카드 */}
            <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>📚</div>
                    <div className={styles.summaryValue}>4</div>
                    <div className={styles.summaryLabel}>학습 섹션</div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>❌</div>
                    <div className={styles.summaryValue}>{totalWrong}</div>
                    <div className={styles.summaryLabel}>오답 문자 수</div>
                </div>
                <div className={styles.summaryCard} onClick={() => navigate('/hiragana')} style={{ cursor: 'pointer' }}>
                    <div className={styles.summaryIcon}>あ</div>
                    <div className={styles.summaryValue}>71자</div>
                    <div className={styles.summaryLabel}>히라가나</div>
                </div>
                <div className={styles.summaryCard} onClick={() => navigate('/katakana')} style={{ cursor: 'pointer' }}>
                    <div className={styles.summaryIcon}>ア</div>
                    <div className={styles.summaryValue}>71자</div>
                    <div className={styles.summaryLabel}>가타카나</div>
                </div>
            </div>

            {/* 오답 현황 */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>🔍 섹션별 오답 현황</h2>
                {sections.map(sec => {
                    const wrongs = wrongAnswers[sec.key] || [];
                    return (
                        <div key={sec.key} className={styles.sectionRow}>
                            <div className={styles.sectionInfo}>
                                <span className={styles.sectionName}>{sec.label}</span>
                                <span className={styles.sectionCount}>
                                    {wrongs.length > 0 ? `${wrongs.length}개 오답` : '오답 없음 ✨'}
                                </span>
                            </div>
                            {wrongs.length > 0 && (
                                <div className={styles.wrongChars}>
                                    {wrongs.slice(0, 10).map((w, i) => (
                                        <span key={i} className={styles.wrongChar}>
                                            {w.character}
                                            <small>×{w.wrong_count}</small>
                                        </span>
                                    ))}
                                    {wrongs.length > 10 && (
                                        <span className={styles.moreCount}>+{wrongs.length - 10}개</span>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </section>

            {/* 빠른 이동 */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>🚀 빠른 이동</h2>
                <div className={styles.quickLinks}>
                    <div className={styles.quickLink} onClick={() => navigate('/hiragana')}>
                        <span className={styles.quickIcon}>あ</span>
                        <span>히라가나</span>
                    </div>
                    <div className={styles.quickLink} onClick={() => navigate('/katakana')}>
                        <span className={styles.quickIcon}>ア</span>
                        <span>가타카나</span>
                    </div>
                    <div className={styles.quickLink} onClick={() => navigate('/vocabulary')}>
                        <span className={styles.quickIcon}>単</span>
                        <span>단어</span>
                    </div>
                    <div className={styles.quickLink} onClick={() => navigate('/grammar')}>
                        <span className={styles.quickIcon}>文</span>
                        <span>문법</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
