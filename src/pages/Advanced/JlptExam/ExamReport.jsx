import React, { useMemo } from 'react';
import Button from '../../../components/common/Button/Button';
import styles from './ExamReport.module.css';

export default function ExamReport({ examData, userAnswers, timeUsed, onExit }) {

    // Parse score and results
    const reportList = useMemo(() => {
        let list = [];
        let totalCorrect = 0;
        let totalQuestions = 0;

        examData.sections.forEach((section, sIdx) => {
            let sectionCorrect = 0;
            section.questions.forEach((q, qIdx) => {
                totalQuestions++;
                const globalIndex = list.length;
                const userAnswer = userAnswers[globalIndex];
                const isCorrect = userAnswer === q.answer;

                if (isCorrect) {
                    sectionCorrect++;
                    totalCorrect++;
                }

                list.push({
                    ...q,
                    globalIndex,
                    sectionTitle: section.title,
                    userAnswer,
                    isCorrect
                });
            });
        });

        // 실제 N1은 언어지식+독해(120), 청해(60) = 180점 만점.
        // 이 앱에서는 언어지식+독해 파트만 치르므로 120점 만점을 기준으로 [정답률 환산 수치]를 제공합니다.
        const percentage = totalQuestions > 0 ? (totalCorrect / totalQuestions) : 0;
        const score = Math.round(percentage * 120);

        // JLPT 합격 기준 (언어+독해 120점 기준일 때, 종합 합격점은 100/180 이지만, 비율상 60/120을 커트라인으로 임시 적용)
        const passStatus = score >= 60 ? '合格 (PASS)' : '不合格 (FAIL)';

        return { list, totalCorrect, totalQuestions, score, percentage, passStatus };
    }, [examData, userAnswers]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}분 ${s}초`;
    };

    const { list, totalCorrect, totalQuestions, score, passStatus } = reportList;

    return (
        <div className={styles.reportLayout}>
            <header className={styles.header}>
                <h1 className={styles.title}>모의고사 결과 보고서</h1>
                <div className={styles.statusBadge}>{passStatus}</div>
            </header>

            <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                    <div className={styles.cardLabel}>정답 수</div>
                    <div className={styles.cardValue}>{totalCorrect} / {totalQuestions}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        정답률: {Math.round(reportList.percentage * 100)}%
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.cardLabel}>환산 점수 (120점 만점)</div>
                    <div className={styles.cardValue}>
                        <span className={styles.scoreText}>{score}</span> / 120
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.2' }}>
                        * 본 모의고사는 {totalQuestions}개 축약 문항으로 구성되어 정답률 비례 점수로 환산되었습니다. 실제 시험은 약 70문항(120점)입니다.
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.cardLabel}>소요 시간</div>
                    <div className={styles.cardValue}>{formatTime(timeUsed)}</div>
                </div>
            </div>

            <div className={styles.detailsSection}>
                <h2 className={styles.sectionTitle}>오답 노트 및 상세 해설</h2>

                <div className={styles.explanationList}>
                    {list.map((item) => (
                        <div key={item.globalIndex} className={`${styles.explainCard} ${!item.isCorrect ? styles.explainWrong : ''}`}>
                            <div className={styles.explainHeader}>
                                <div className={styles.exMeta}>
                                    <span className={styles.exSection}>{item.sectionTitle}</span>
                                    <span className={styles.exQnum}>Question {item.globalIndex + 1}</span>
                                </div>
                                <div className={`${styles.exBadge} ${item.isCorrect ? styles.badgeCorrect : styles.badgeWrong}`}>
                                    {item.isCorrect ? '정답' : (item.userAnswer !== undefined ? '오답' : '미응답')}
                                </div>
                            </div>

                            {item.passage && (
                                <div className={styles.exPassage}>
                                    {item.passage.substring(0, 100)}...
                                    <span className={styles.passageExpand}>[지문 생략]</span>
                                </div>
                            )}

                            <div className={styles.exText}>{item.text}</div>

                            <div className={styles.userCompare}>
                                <div className={styles.compareItem}>
                                    <span className={styles.compareLabel}>나의 답:</span>
                                    <span className={styles.compareValue}>
                                        {item.userAnswer !== undefined ? item.options[item.userAnswer] : '-'}
                                    </span>
                                </div>
                                {!item.isCorrect && (
                                    <div className={styles.compareItem}>
                                        <span className={styles.compareLabel}>정답:</span>
                                        <span className={styles.compareValue} style={{ color: '#4caf50', fontWeight: 'bold' }}>
                                            {item.options[item.answer]}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className={styles.exExplanation}>
                                <div className={styles.exLabel}>💡 해설</div>
                                {item.explanation}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.actions}>
                <Button variant="primary" onClick={onExit} size="lg">대시보드로 돌아가기</Button>
            </div>
        </div>
    );
}
