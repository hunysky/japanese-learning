import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpacedReview from '../../features/SpacedReview/SpacedReview';
import styles from './Home.module.css';

export default function Home() {
    const navigate = useNavigate();
    const [showReview, setShowReview] = useState(false);

    const menuItems = [
        {
            id: 'hiragana',
            title: '히라가나',
            icon: 'あ',
            desc: '71자 청음·탁음 정복',
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
        },
        {
            id: 'dashboard',
            title: '학습 현황',
            icon: '📊',
            desc: '내 학습 진행률 확인',
            path: '/dashboard'
        },
        {
            id: 'bookmarks',
            title: '즐겨찾기',
            icon: '★',
            desc: '저장한 단어·문법 보기',
            path: '/bookmarks'
        }
    ];

    return (
        <div className={styles.page}>
            <header className={styles.hero}>
                <h1 className={styles.title}>日本語 학습 도우미</h1>
                <p className={styles.subtitle}>초급자를 위한 가장 쉬운 일본어 시작</p>
            </header>

            {/* 오늘의 복습 배너 */}
            <div className={styles.reviewBanner} onClick={() => setShowReview(!showReview)}>
                <span className={styles.reviewIcon}>🔄</span>
                <span className={styles.reviewText}>
                    {showReview ? '메뉴로 돌아가기' : '오늘의 간격 복습 시작하기 →'}
                </span>
            </div>

            {showReview ? (
                <SpacedReview />
            ) : (
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
            )}
        </div>
    );
}
