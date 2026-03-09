import React from 'react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle/ThemeToggle';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.brand}>日 일본어 도우미</div>
            <div className={styles.links}>
                <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''} end>홈</NavLink>
                <NavLink to="/hiragana" className={({ isActive }) => isActive ? styles.active : ''}>히라</NavLink>
                <NavLink to="/katakana" className={({ isActive }) => isActive ? styles.active : ''}>가타</NavLink>
                <NavLink to="/vocabulary" className={({ isActive }) => isActive ? styles.active : ''}>단어</NavLink>
                <NavLink to="/grammar" className={({ isActive }) => isActive ? styles.active : ''}>문법</NavLink>
                <NavLink to="/advanced" className={({ isActive }) => isActive ? styles.active : ''}>상급</NavLink>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.active : ''}>현황</NavLink>
                <NavLink to="/bookmarks" className={({ isActive }) => isActive ? styles.active : ''}>★</NavLink>
            </div>
            <ThemeToggle />
        </nav>
    );
}
