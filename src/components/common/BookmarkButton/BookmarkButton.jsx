import React from 'react';
import styles from './BookmarkButton.module.css';

export default function BookmarkButton({ isBookmarked, onToggle, size = 'md' }) {
    return (
        <button
            className={`${styles.btn} ${styles[size]} ${isBookmarked ? styles.active : ''}`}
            onClick={(e) => {
                e.stopPropagation();
                onToggle();
            }}
            title={isBookmarked ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            aria-label="즐겨찾기"
        >
            {isBookmarked ? '★' : '☆'}
        </button>
    );
}
