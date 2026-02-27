import { useState, useCallback, useEffect } from 'react';

export function useTts() {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.speechSynthesis) {
            setIsSupported(false);
        }
    }, []);

    const speak = useCallback((text, options = {}) => {
        if (!isSupported || !window.speechSynthesis) return;

        window.speechSynthesis.cancel(); // Stop any current speech

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = options.rate || 0.8;
        utterance.pitch = options.pitch || 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [isSupported]);

    return { speak, isSpeaking, isSupported };
}
