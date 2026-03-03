import { useRef, useCallback } from 'react';

export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 50 }) {
    const touchStart = useRef(null);
    const touchEnd = useRef(null);

    const onTouchStart = useCallback((e) => {
        touchEnd.current = null;
        touchStart.current = e.targetTouches[0].clientX;
    }, []);

    const onTouchMove = useCallback((e) => {
        touchEnd.current = e.targetTouches[0].clientX;
    }, []);

    const onTouchEnd = useCallback(() => {
        if (!touchStart.current || !touchEnd.current) return;

        const distance = touchStart.current - touchEnd.current;
        const isLeftSwipe = distance > threshold;
        const isRightSwipe = distance < -threshold;

        if (isLeftSwipe && onSwipeLeft) {
            onSwipeLeft();
        }
        if (isRightSwipe && onSwipeRight) {
            onSwipeRight();
        }

        touchStart.current = null;
        touchEnd.current = null;
    }, [onSwipeLeft, onSwipeRight, threshold]);

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
}
