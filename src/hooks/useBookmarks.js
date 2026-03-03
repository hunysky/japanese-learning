import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'japanese_learning_bookmarks';

export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    }, [bookmarks]);

    const addBookmark = useCallback((item) => {
        setBookmarks(prev => {
            const key = `${item.type}_${item.id}`;
            if (prev.some(b => `${b.type}_${b.id}` === key)) return prev;
            return [...prev, { ...item, bookmarkedAt: Date.now() }];
        });
    }, []);

    const removeBookmark = useCallback((type, id) => {
        setBookmarks(prev => prev.filter(b => !(b.type === type && b.id === id)));
    }, []);

    const isBookmarked = useCallback((type, id) => {
        return bookmarks.some(b => b.type === type && b.id === id);
    }, [bookmarks]);

    const getBookmarksByType = useCallback((type) => {
        return bookmarks.filter(b => b.type === type);
    }, [bookmarks]);

    return {
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        getBookmarksByType
    };
}
