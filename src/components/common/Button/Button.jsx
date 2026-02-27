import React from 'react';
import styles from './Button.module.css';

export default function Button({ children, onClick, variant = 'secondary', disabled = false }) {
    const className = `${styles.btn} ${styles[variant]} ${disabled ? styles.disabled : ''}`;

    return (
        <button
            className={className}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
