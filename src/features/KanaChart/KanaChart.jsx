import React, { useMemo } from 'react';
import { useTts } from '../../hooks/useTts';
import styles from './KanaChart.module.css';

export default function KanaChart({ data }) {
    const { speak } = useTts();

    // 데이터에서 행/열 순서를 동적으로 추출
    const rows = useMemo(() => {
        const seen = new Set();
        return data.filter(item => {
            if (seen.has(item.row)) return false;
            seen.add(item.row);
            return true;
        }).map(item => item.row);
    }, [data]);

    const cols = useMemo(() => {
        const seen = new Set();
        return data.filter(item => {
            if (seen.has(item.col)) return false;
            seen.add(item.col);
            return true;
        }).map(item => item.col);
    }, [data]);

    // Create lookup table
    const kanaMap = useMemo(() => {
        const map = {};
        data.forEach(item => {
            if (!map[item.row]) map[item.row] = {};
            map[item.row][item.col] = item;
        });
        return map;
    }, [data]);

    return (
        <div className={styles.chartWrapper}>
            <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${cols.length}, 1fr)` }}>
                {rows.map(row =>
                    cols.map(col => {
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
