import React from 'react';
import Navbar from '../Navbar/Navbar';
import styles from './Layout.module.css';

export default function Layout({ children }) {
    return (
        <div className={styles.container}>
            <Navbar />
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
