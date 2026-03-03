import { useState, useEffect, useCallback } from 'react';
import { useProgress } from './useProgress';

export function useFlashcard(items, sectionKey) {
    const [flashcardIndex, setFlashcardIndex] = useState(0);
    const { saveFlashcardPos, getFlashcardPos } = useProgress();

    useEffect(() => {
        getFlashcardPos(sectionKey).then(pos => {
            setFlashcardIndex(pos || 0);
        });
    }, [sectionKey]);

    const next = useCallback(() => {
        const nextIdx = (flashcardIndex + 1) % items.length;
        setFlashcardIndex(nextIdx);
        saveFlashcardPos(sectionKey, nextIdx);
    }, [flashcardIndex, items.length, sectionKey, saveFlashcardPos]);

    const prev = useCallback(() => {
        const prevIdx = (flashcardIndex - 1 + items.length) % items.length;
        setFlashcardIndex(prevIdx);
        saveFlashcardPos(sectionKey, prevIdx);
    }, [flashcardIndex, items.length, sectionKey, saveFlashcardPos]);

    return {
        flashcardIndex,
        setFlashcardIndex,
        nextFlashcard: next,
        prevFlashcard: prev
    };
}
