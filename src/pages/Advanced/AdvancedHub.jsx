import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdvancedHub.module.css';

export default function AdvancedHub() {
    const navigate = useNavigate();

    const sections = [
        {
            id: 'kanji',
            title: '심화 한자 (N2~N1)',
            desc: '비즈니스 및 경제 관련 필수 한자와 어휘를 학습합니다.',
            icon: '🏢',
            path: '/advanced/kanji'
        },
        {
            id: 'grammar',
            title: '고급 문법 및 비즈니스 경어',
            desc: '뉘앙스 차이와 수준 높은 비즈니스 표현을 익힙니다.',
            icon: '👔',
            path: '/advanced/grammar'
        },
        {
            id: 'reading',
            title: '장문 독해 연습',
            desc: '뉴스, 비즈니스 등 실전 일본어 지문을 읽고 퀴즈를 풉니다.',
            icon: '📰',
            path: '/advanced/reading'
        },
        {
            id: 'jlpt',
            title: 'JLPT N1 실전 모의고사',
            desc: '문자·어휘, 문법, 독해 파트 종합 테스트로 실력을 점검합니다.',
            icon: '🎯',
            path: '/advanced/jlpt'
        }
    ];

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>상급자 코스 <span>N2~N1</span></h1>
                <p className={styles.subtitle}>실전 비즈니스 일본어와 심화 학습을 시작해보세요.</p>
            </header>

            <div className={styles.cardGrid}>
                {sections.map(sec => (
                    <div
                        key={sec.id}
                        className={styles.card}
                        onClick={() => navigate(sec.path)}
                    >
                        <div className={styles.icon}>{sec.icon}</div>
                        <h2 className={styles.cardTitle}>{sec.title}</h2>
                        <p className={styles.cardDesc}>{sec.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
