import React, { useRef, useState, useEffect } from 'react';
import Button from '../../components/common/Button/Button';
import TtsButton from '../../components/common/TtsButton/TtsButton';
import { useTts } from '../../hooks/useTts';
import styles from './StrokeCanvas.module.css';

export default function StrokeCanvas({ data }) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [drawnStrokes, setDrawnStrokes] = useState(0);
    const progressTimeoutRef = useRef(null);

    const { speak } = useTts();

    const currentItem = data[currentIndex] || data[0];

    // Play TTS when character changes
    useEffect(() => {
        if (currentItem?.char) {
            speak(currentItem.char);
        }
    }, [currentIndex, currentItem, speak]);

    useEffect(() => {
        // Stop scrolling on mobile when touching the canvas
        const canvas = canvasRef.current;
        if (!canvas) return;

        const preventTouchScroll = (e) => {
            e.preventDefault();
        };

        canvas.addEventListener('touchstart', preventTouchScroll, { passive: false });
        canvas.addEventListener('touchmove', preventTouchScroll, { passive: false });

        return () => {
            canvas.removeEventListener('touchstart', preventTouchScroll);
            canvas.removeEventListener('touchmove', preventTouchScroll);
            if (progressTimeoutRef.current) {
                clearTimeout(progressTimeoutRef.current);
            }
        };
    }, []);

    const getCoordinates = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        let clientX, clientY;

        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (e) => {
        const coords = getCoordinates(e);
        if (!coords) return;

        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
        setIsDrawing(true);

        if (progressTimeoutRef.current) {
            clearTimeout(progressTimeoutRef.current);
        }
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const coords = getCoordinates(e);
        if (!coords) return;

        const ctx = canvasRef.current.getContext('2d');
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#1C1A14';
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
    };

    const endDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        const newDrawnStrokes = drawnStrokes + 1;
        setDrawnStrokes(newDrawnStrokes);

        if (currentItem?.strokes && newDrawnStrokes >= currentItem.strokes) {
            progressTimeoutRef.current = setTimeout(() => {
                nextCharacter();
            }, 800);
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const nextCharacter = () => {
        setCurrentIndex((prev) => (prev + 1) % data.length);
        setDrawnStrokes(0);
        clearCanvas();
    };

    if (!currentItem) return null;

    return (
        <div className={styles.container}>
            <div className={styles.reference}>
                <div className={styles.referenceHeader}>
                    <div className={styles.referenceChar}>{currentItem.char}</div>
                    <TtsButton text={currentItem.char} size="md" />
                </div>
                {currentItem.strokes && (
                    <div className={styles.strokesInfo}>
                        획수: <span className={styles.drawnStrokesCount}>{drawnStrokes}</span> / {currentItem.strokes}획
                    </div>
                )}
            </div>

            <div className={styles.drawingArea}>
                <canvas
                    ref={canvasRef}
                    width={300}
                    height={300}
                    className={styles.canvas}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                    onMouseOut={endDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={endDrawing}
                    onTouchCancel={endDrawing}
                />
                <div className={styles.actions}>
                    <Button variant="ghost" onClick={clearCanvas}>지우기</Button>
                    <Button variant="primary" onClick={nextCharacter}>다른 문자 ({currentIndex + 1}/{data.length})</Button>
                </div>
            </div>
        </div>
    );
}
