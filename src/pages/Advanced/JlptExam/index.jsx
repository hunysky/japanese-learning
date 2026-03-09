import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExamDashboard from './ExamDashboard';
import ExamSession from './ExamSession';
import ExamReport from './ExamReport';
import { jlptN1FullExam } from '../../../data/jlpt-n1-full';
import styles from './JlptExam.module.css';

export default function JlptExamWrapper() {
    const navigate = useNavigate();
    const [examState, setExamState] = useState('intro'); // 'intro', 'session', 'report'
    const [answers, setAnswers] = useState({});
    const [timeUsed, setTimeUsed] = useState(0);

    const handleStartExam = () => {
        setExamState('session');
        setAnswers({});
        setTimeUsed(0);
    };

    const handleFinishExam = (finalAnswers, timeSpent) => {
        setAnswers(finalAnswers);
        setTimeUsed(timeSpent);
        setExamState('report');
    };

    const handleExit = () => {
        if (examState === 'session') {
            if (window.confirm('시험을 종료하고 나가시겠습니까? 모든 진행 상황이 초기화됩니다.')) {
                navigate('/advanced');
            }
        } else {
            navigate('/advanced');
        }
    };

    return (
        <div className={styles.examContainer}>
            {examState === 'intro' && (
                <ExamDashboard
                    examData={jlptN1FullExam}
                    onStart={handleStartExam}
                    onExit={handleExit}
                />
            )}
            {examState === 'session' && (
                <ExamSession
                    examData={jlptN1FullExam}
                    onFinish={handleFinishExam}
                    onExit={handleExit}
                />
            )}
            {examState === 'report' && (
                <ExamReport
                    examData={jlptN1FullExam}
                    userAnswers={answers}
                    timeUsed={timeUsed}
                    onExit={handleExit}
                />
            )}
        </div>
    );
}
