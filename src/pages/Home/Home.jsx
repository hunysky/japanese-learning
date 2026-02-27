import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

export default function Home() {
    const navigate = useNavigate();

    const menuItems = [
        {
            id: 'hiragana',
            title: '히라가나',
            icon: 'あ',
            desc: '46자 + 탁음 정복',
            path: '/hiragana'
        },
        {
            id: 'katakana',
            title: '가타카나',
            icon: 'ア',
            desc: '모양과 발음 익히기',
            path: '/katakana'
        },
        {
            id: 'vocabulary',
            title: '단어/어휘',
            icon: '単',
            desc: '상황별 필수 단어',
            path: '/vocabulary'
        },
        {
            id: 'grammar',
            title: '기초 문법',
            icon: '文',
            desc: '패턴으로 배우는 문장',
            path: '/grammar'
        }
    ];

    return (
        <div className={styles.page}>
            <header className={styles.hero}>
                <h1 className={styles.title}>日本語 학습 도우미</h1>
                <p className={styles.subtitle}>초급자를 위한 가장 쉬운 일본어 시작</p>
            </header>

            <div className={styles.grid}>
                {menuItems.map(item => (
                    <div
                        key={item.id}
                        className={styles.card}
                        onClick={() => navigate(item.path)}
                    >
                        <div className={styles.cardIcon}>{item.icon}</div>
                        <h2 className={styles.cardTitle}>{item.title}</h2>
                        <p className={styles.cardDesc}>{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
