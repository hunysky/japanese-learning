import React from 'react';
import { useTts } from '../../../hooks/useTts';
import styles from './TtsButton.module.css';

export default function TtsButton({ text, size = 'md' }) {
    const { speak, isSpeaking, isSupported } = useTts();

    if (!isSupported) {
        return null;
    }

    const handleClick = (e) => {
        e.stopPropagation();
        speak(text);
    };

    return (
        <button
            className={`${styles.ttsBtn} ${styles[size]} ${isSpeaking ? styles.speaking : ''}`}
            onClick={handleClick}
            disabled={isSpeaking}
            title="발음 듣기"
        >
            🔊
        </button>
    );
}
