import React, { useState, useMemo } from 'react';
import KanaChart from '../../../features/KanaChart/KanaChart';
import FlashCard from '../../../features/FlashCard/FlashCard';
import StrokeCanvas from '../../../features/StrokeCanvas/StrokeCanvas';
import Quiz from '../../../features/Quiz/Quiz';
import WrongNotes from '../../../features/WrongNotes/WrongNotes';
import Button from '../Button/Button';
import { useFlashcard } from '../../../hooks/useFlashcard';
import styles from './KanaPage.module.css';

const KANA_FILTERS = [
    { key: 'seion', label: '청음' },
    { key: 'dakuon', label: '탁음' },
    { key: 'handakuon', label: '반탁음' },
    { key: 'all', label: '전체' },
];

export default function KanaPage({ section, data }) {
    const [tab, setTab] = useState('chart');
    const [kanaFilter, setKanaFilter] = useState('seion');
    const [wrongQuizData, setWrongQuizData] = useState(null);

    const filteredData = useMemo(() => {
        if (kanaFilter === 'all') return data;
        return data.filter(item => item.type === kanaFilter);
    }, [data, kanaFilter]);

    const { flashcardIndex, nextFlashcard, prevFlashcard } = useFlashcard(
        filteredData,
        `${section}_${kanaFilter}`
    );

    const title = section === 'hiragana' ? '히라가나' : '가타카나';
    const sectionKey = `${section}_${kanaFilter}`;

    const handleStartWrongQuiz = (wrongItems) => {
        setWrongQuizData(wrongItems);
        setTab('quiz');
    };

    // 오답 퀴즈 모드일 때 quiz 탭에서 오답 데이터 사용
    const quizData = wrongQuizData || filteredData;

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>{title} <span>초급</span></h1>
            </header>

            {/* 가나 필터 */}
            <div className={styles.filterTabs}>
                {KANA_FILTERS.map(f => (
                    <Button
                        key={f.key}
                        variant={kanaFilter === f.key ? 'primary' : 'secondary'}
                        onClick={() => { setKanaFilter(f.key); setWrongQuizData(null); }}
                    >
                        {f.label}
                    </Button>
                ))}
            </div>

            {/* 학습 모드 탭 */}
            <div className={styles.tabs}>
                <Button variant={tab === 'chart' ? 'primary' : 'secondary'} onClick={() => { setTab('chart'); setWrongQuizData(null); }}>오십음도</Button>
                <Button variant={tab === 'flashcard' ? 'primary' : 'secondary'} onClick={() => { setTab('flashcard'); setWrongQuizData(null); }}>플래시카드</Button>
                <Button variant={tab === 'canvas' ? 'primary' : 'secondary'} onClick={() => { setTab('canvas'); setWrongQuizData(null); }}>필순연습</Button>
                <Button variant={tab === 'quiz' ? 'primary' : 'secondary'} onClick={() => { setTab('quiz'); setWrongQuizData(null); }}>퀴즈</Button>
                <Button variant={tab === 'wrong' ? 'primary' : 'secondary'} onClick={() => { setTab('wrong'); setWrongQuizData(null); }}>오답노트</Button>
            </div>

            <div className={styles.content}>
                {tab === 'chart' && <KanaChart data={filteredData} />}

                {tab === 'flashcard' && filteredData.length > 0 && (
                    <div className={styles.flashcardContainer}>
                        <FlashCard item={filteredData[flashcardIndex]} onNext={nextFlashcard} onPrev={prevFlashcard} />
                        <div className={styles.flashcardControls}>
                            <Button variant="ghost" onClick={prevFlashcard}>← 이전</Button>
                            <span className={styles.flashcardCount}>{flashcardIndex + 1} / {filteredData.length}</span>
                            <Button variant="ghost" onClick={nextFlashcard}>다음 →</Button>
                        </div>
                    </div>
                )}

                {tab === 'canvas' && filteredData.length > 0 && <StrokeCanvas data={filteredData} />}

                {tab === 'quiz' && quizData.length >= 4 && (
                    <Quiz data={quizData} section={sectionKey} />
                )}
                {tab === 'quiz' && quizData.length < 4 && (
                    <div className={styles.emptyMessage}>퀴즈를 진행하려면 최소 4개의 문자가 필요합니다.</div>
                )}

                {tab === 'wrong' && (
                    <WrongNotes section={sectionKey} data={filteredData} onStartQuiz={handleStartWrongQuiz} />
                )}
            </div>
        </div>
    );
}
