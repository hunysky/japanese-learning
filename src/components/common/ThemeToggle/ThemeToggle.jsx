import React, { useState, useEffect } from 'react';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved) return saved === 'dark';
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    return (
        <button
            className={styles.toggle}
            onClick={() => setIsDark(!isDark)}
            title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
            aria-label="테마 전환"
        >
            {isDark ? '☀️' : '🌙'}
        </button>
    );
}
