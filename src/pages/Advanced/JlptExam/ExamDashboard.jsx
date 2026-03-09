import React from 'react';
import Button from '../../../components/common/Button/Button';
import styles from './JlptExam.module.css';

export default function ExamDashboard({ examData, onStart, onExit }) {
    // Calculate total questions
    const totalQuestions = examData.sections.reduce((acc, sec) => acc + sec.questions.length, 0);
    const timeInMinutes = examData.timeLimit / 60;

    return (
        <div className={styles.introBox}>
            <h1 className={styles.title}>{examData.title}</h1>
            <p className={styles.subtitle}>{examData.description}</p>

            <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>⏳ 제한 시간</span>
                    <span className={styles.infoValue}>{timeInMinutes}분 (1시간 50분)</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>📝 총 문항 수</span>
                    <span className={styles.infoValue}>{totalQuestions}문항</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>💯 합격 기준</span>
                    <span className={styles.infoValue}>종합득점 100점 이상 / 과목별 과락 19점 미만 시 불합격</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>📋 검정 과목</span>
                    <span className={styles.infoValue}>언어지식(문자・어휘・문법), 독해</span>
                </div>
            </div>

            <div className={styles.warningBox}>
                <strong>🚫 주의사항</strong><br />
                - 시험이 시작되면 중간에 일시정지 되거나 저장되지 않습니다.<br />
                - 제한 시간이 초과되면 자동으로 답안이 제출됩니다.<br />
                - 새로고침 하거나 뒤로 이동할 경우, 시험 진행 내용이 모두 초기화됩니다.
            </div>

            <div className={styles.actions}>
                <Button variant="secondary" onClick={onExit} size="lg">돌아가기</Button>
                <Button variant="primary" onClick={onStart} size="lg">시험 응시하기</Button>
            </div>
        </div>
    );
}
