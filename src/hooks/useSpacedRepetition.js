import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'japanese_learning_srs';

// SM-2 알고리즘 간소화 버전
function calculateNextReview(quality, repetitions, easeFactor, interval) {
    let newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEF < 1.3) newEF = 1.3;

    let newInterval;
    let newReps;

    if (quality < 3) {
        // 다시 시작
        newReps = 0;
        newInterval = 1;
    } else {
        newReps = repetitions + 1;
        if (newReps === 1) {
            newInterval = 1;
        } else if (newReps === 2) {
            newInterval = 6;
        } else {
            newInterval = Math.round(interval * newEF);
        }
    }

    return {
        repetitions: newReps,
        easeFactor: newEF,
        interval: newInterval,
        nextReviewDate: Date.now() + newInterval * 24 * 60 * 60 * 1000
    };
}

export function useSpacedRepetition() {
    const [items, setItems] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    // 아이템 등록 (이미 있으면 무시)
    const registerItem = useCallback((itemKey) => {
        setItems(prev => {
            if (prev[itemKey]) return prev;
            return {
                ...prev,
                [itemKey]: {
                    repetitions: 0,
                    easeFactor: 2.5,
                    interval: 0,
                    nextReviewDate: Date.now()
                }
            };
        });
    }, []);

    // 리뷰 후 점수 기록 (quality: 0-5, 0=완전몰라, 5=완벽)
    const recordReview = useCallback((itemKey, quality) => {
        setItems(prev => {
            const current = prev[itemKey] || {
                repetitions: 0,
                easeFactor: 2.5,
                interval: 0,
                nextReviewDate: Date.now()
            };

            const updated = calculateNextReview(
                quality,
                current.repetitions,
                current.easeFactor,
                current.interval
            );

            return { ...prev, [itemKey]: updated };
        });
    }, []);

    // 오늘 복습할 아이템 키 목록
    const getDueItems = useCallback(() => {
        const now = Date.now();
        return Object.entries(items)
            .filter(([, data]) => data.nextReviewDate <= now)
            .map(([key]) => key)
            .sort();
    }, [items]);

    // 전체 통계
    const getStats = useCallback(() => {
        const now = Date.now();
        const total = Object.keys(items).length;
        const due = Object.values(items).filter(d => d.nextReviewDate <= now).length;
        const mastered = Object.values(items).filter(d => d.repetitions >= 5).length;
        return { total, due, mastered };
    }, [items]);

    return {
        items,
        registerItem,
        recordReview,
        getDueItems,
        getStats
    };
}
