import React from 'react';
import { useTts } from '../../hooks/useTts';
import styles from './KanaChart.module.css';

// 5열 * 11행 (=55셀) 구조를 만들기 위한 맵핑
const ROWS = ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ', 'ん'];
const COLS = ['あ단', 'い단', 'う단', 'え단', 'お단'];

export default function KanaChart({ data }) {
    const { speak } = useTts();

    // Create lookup table
    const kanaMap = {};
    data.forEach(item => {
        if (!kanaMap[item.row]) kanaMap[item.row] = {};
        kanaMap[item.row][item.col] = item;
    });

    return (
        <div className={styles.chartWrapper}>
            <div className={styles.grid}>
                {ROWS.map(row =>
                    COLS.map(col => {
                        const item = kanaMap[row]?.[col];

                        if (!item) {
                            return <div key={`${row}-${col}`} className={styles.emptyCell} />;
                        }

                        return (
                            <div
                                key={item.id}
                                className={styles.cell}
                                onClick={() => speak(item.char)}
                            >
                                <span className={styles.char}>{item.char}</span>
                                <span className={styles.romaji}>{item.romaji}</span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
