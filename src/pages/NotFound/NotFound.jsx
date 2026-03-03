import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className={styles.page}>
            <div className={styles.errorCode}>404</div>
            <h1 className={styles.title}>ページが見つかりません</h1>
            <p className={styles.subtitle}>페이지를 찾을 수 없습니다</p>
            <button className={styles.homeBtn} onClick={() => navigate('/')}>
                홈으로 돌아가기
            </button>
        </div>
    );
}
