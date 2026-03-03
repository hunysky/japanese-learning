import React, { useState, useCallback, useEffect } from 'react';
import Button from '../../components/common/Button/Button';
import TtsButton from '../../components/common/TtsButton/TtsButton';
import { useTts } from '../../hooks/useTts';
import styles from './NumberPractice.module.css';

// 일본어 숫자 데이터 (1-9999)
const BASIC_NUMBERS = {
    1: 'いち', 2: 'に', 3: 'さん', 4: 'よん', 5: 'ご',
    6: 'ろく', 7: 'なな', 8: 'はち', 9: 'きゅう', 10: 'じゅう',
    100: 'ひゃく', 1000: 'せん'
};

const SPECIAL_HUNDREDS = {
    300: 'さんびゃく', 600: 'ろっぴゃく', 800: 'はっぴゃく'
};

const SPECIAL_THOUSANDS = {
    3000: 'さんぜん', 8000: 'はっせん'
};

function numberToJapanese(num) {
    if (num === 0) return 'ゼロ';
    if (num <= 10) return BASIC_NUMBERS[num] || '';

    let result = '';

    // 천의 자리
    const thousands = Math.floor(num / 1000);
    if (thousands > 0) {
        const thousandVal = thousands * 1000;
        if (SPECIAL_THOUSANDS[thousandVal]) {
            result += SPECIAL_THOUSANDS[thousandVal];
        } else if (thousands === 1) {
            result += 'せん';
        } else {
            result += BASIC_NUMBERS[thousands] + 'せん';
        }
    }

    // 백의 자리
    const hundreds = Math.floor((num % 1000) / 100);
    if (hundreds > 0) {
        const hundredVal = hundreds * 100;
        if (SPECIAL_HUNDREDS[hundredVal]) {
            result += SPECIAL_HUNDREDS[hundredVal];
        } else if (hundreds === 1) {
            result += 'ひゃく';
        } else {
            result += BASIC_NUMBERS[hundreds] + 'ひゃく';
        }
    }

    // 십의 자리
    const tens = Math.floor((num % 100) / 10);
    if (tens > 0) {
        if (tens === 1) {
            result += 'じゅう';
        } else {
            result += BASIC_NUMBERS[tens] + 'じゅう';
        }
    }

    // 일의 자리
    const ones = num % 10;
    if (ones > 0) {
        result += BASIC_NUMBERS[ones];
    }

    return result;
}

function getRandomNumber(maxDigits) {
    const max = Math.pow(10, maxDigits) - 1;
    return Math.floor(Math.random() * max) + 1;
}

export default function NumberPractice() {
    const [difficulty, setDifficulty] = useState(1); // 1=1~10, 2=1~100, 3=1~1000, 4=1~9999
    const [currentNumber, setCurrentNumber] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const { speak } = useTts();

    const generateNumber = useCallback(() => {
        const num = getRandomNumber(difficulty);
        setCurrentNumber(num);
        setShowAnswer(false);
    }, [difficulty]);

    useEffect(() => {
        generateNumber();
    }, [generateNumber]);

    const handleShowAnswer = () => {
        setShowAnswer(true);
        if (currentNumber) {
            speak(numberToJapanese(currentNumber));
        }
    };

    const handleKnew = () => {
        setScore(s => ({ correct: s.correct + 1, total: s.total + 1 }));
        generateNumber();
    };

    const handleDidntKnow = () => {
        setScore(s => ({ ...s, total: s.total + 1 }));
        generateNumber();
    };

    const difficultyOptions = [
        { level: 1, label: '1~10', desc: '기본' },
        { level: 2, label: '1~100', desc: '중급' },
        { level: 3, label: '1~1000', desc: '상급' },
        { level: 4, label: '1~9999', desc: '마스터' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.difficultyRow}>
                {difficultyOptions.map(opt => (
                    <Button
                        key={opt.level}
                        variant={difficulty === opt.level ? 'primary' : 'secondary'}
                        onClick={() => {
                            setDifficulty(opt.level);
                            setScore({ correct: 0, total: 0 });
                        }}
                    >
                        {opt.label}
                    </Button>
                ))}
            </div>

            {score.total > 0 && (
                <div className={styles.score}>
                    맞춤: {score.correct} / {score.total}
                </div>
            )}

            {currentNumber !== null && (
                <div className={styles.card} onClick={!showAnswer ? handleShowAnswer : undefined}>
                    <div className={styles.numberDisplay}>{currentNumber}</div>

                    {!showAnswer && (
                        <div className={styles.hint}>탭하여 일본어 보기</div>
                    )}

                    {showAnswer && (
                        <div className={styles.answer}>
                            <div className={styles.japaneseText}>{numberToJapanese(currentNumber)}</div>
                            <TtsButton text={numberToJapanese(currentNumber)} size="md" />
                        </div>
                    )}
                </div>
            )}

            {showAnswer && (
                <div className={styles.actionButtons}>
                    <Button variant="ghost" onClick={handleDidntKnow}>😵 몰랐어요</Button>
                    <Button variant="primary" onClick={handleKnew}>😎 알았어요</Button>
                </div>
            )}
        </div>
    );
}
