import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookmarks } from '../../hooks/useBookmarks';
import TtsButton from '../../components/common/TtsButton/TtsButton';
import BookmarkButton from '../../components/common/BookmarkButton/BookmarkButton';
import styles from './Bookmarks.module.css';

export default function Bookmarks() {
    const navigate = useNavigate();
    const { bookmarks, removeBookmark } = useBookmarks();

    const vocabBookmarks = bookmarks.filter(b => b.type === 'vocabulary');
    const grammarBookmarks = bookmarks.filter(b => b.type === 'grammar');

    const isEmpty = bookmarks.length === 0;

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>★ 즐겨찾기</h1>
                <p className={styles.subtitle}>저장한 단어와 문법을 확인하세요</p>
            </header>

            {isEmpty && (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>☆</div>
                    <p>아직 즐겨찾기한 항목이 없습니다.</p>
                    <p className={styles.emptyHint}>단어나 문법에서 ☆ 버튼을 눌러 저장하세요.</p>
                </div>
            )}

            {vocabBookmarks.length > 0 && (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>📝 단어 ({vocabBookmarks.length})</h2>
                    <div className={styles.grid}>
                        {vocabBookmarks.map((item, idx) => (
                            <div key={idx} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.japanese}>{item.japanese || item.char}</div>
                                    <div className={styles.cardActions}>
                                        <TtsButton text={item.japanese || item.char} size="sm" />
                                        <BookmarkButton
                                            isBookmarked={true}
                                            onToggle={() => removeBookmark('vocabulary', item.id)}
                                            size="sm"
                                        />
                                    </div>
                                </div>
                                {item.kanji && <div className={styles.kanji}>{item.kanji}</div>}
                                <div className={styles.romaji}>{item.romaji}</div>
                                <div className={styles.korean}>{item.korean}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {grammarBookmarks.length > 0 && (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>文 문법 ({grammarBookmarks.length})</h2>
                    <div className={styles.grammarList}>
                        {grammarBookmarks.map((item, idx) => (
                            <div key={idx} className={styles.grammarCard}>
                                <div className={styles.grammarHeader}>
                                    <span className={styles.grammarPattern}>{item.pattern}</span>
                                    <BookmarkButton
                                        isBookmarked={true}
                                        onToggle={() => removeBookmark('grammar', item.id)}
                                        size="sm"
                                    />
                                </div>
                                <div className={styles.grammarExplanation}>{item.explanation}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
