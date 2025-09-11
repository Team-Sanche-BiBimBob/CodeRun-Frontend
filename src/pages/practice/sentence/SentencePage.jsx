import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import KeyBoard from '../../../components/practice/keyBorad/KeyBoard';
import CompletionModal from '../../../components/practice/completionModal/CompletionModal';
import RealTimeStats from '../../../components/practice/realTimeStats/RealTimestats';

function SentencePage() {
  const navigate = useNavigate();
  const [sentences, setSentences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedChars, setTypedChars] = useState([]);
  const [spaceErrorIndices, setSpaceErrorIndices] = useState([]);
  const [history, setHistory] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState(() => new Date());

  // 서버에서 문장 가져오기
  const fetchSentences = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/problems', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`서버 오류: ${response.status}`);
      const data = await response.json();
      setSentences(data.sentences || data || []);
    } catch (err) {
      console.error('타자연습 리스트 가져오기 실패:', err);
      setError(err.message);
      // 더미 데이터
      setSentences([
        'print("Hello world!")',
        'for i in range(10):',
        'console.log("Hello world!");',
        'function greet(name) {',
        'System.out.println("Hello world!");',
        'public class Person {',
        'SELECT * FROM users;',
        'let message: string = "Hello world!";',
        'println("Hello world!")',
        'func greet(name: String) -> String {'
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSentences(); }, [fetchSentences]);

  const currentSentence = sentences[currentIndex] || '';
  const hangulRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

  // 키 입력 처리
  const handleKeyDown = useCallback((e) => {
    if (e.isComposing || e.keyCode === 229) { e.preventDefault(); return; }
    if (hangulRegex.test(e.key)) { e.preventDefault(); return; }
    if (isComplete || sentences.length === 0) return;

    if (e.key === 'Backspace') {
      setTypedChars((prev) => prev.slice(0, -1));
      setSpaceErrorIndices((prev) => prev.slice(0, -1));
    } else if (e.key.length === 1) {
      const expectedChar = currentSentence[typedChars.length];
      if (e.key === ' ') {
        if (expectedChar === ' ') {
          setTypedChars((prev) => [...prev, ' ']);
          setSpaceErrorIndices((prev) => [...prev, false]);
        } else {
          setTypedChars((prev) => [...prev, '']);
          setSpaceErrorIndices((prev) => [...prev, true]);
        }
      } else {
        setTypedChars((prev) => [...prev, e.key]);
        setSpaceErrorIndices((prev) => [...prev, false]);
      }
    } else if (e.key === 'Enter') {
      if (typedChars.length === 0) return;
      const userTyped = typedChars.map((c, i) =>
        spaceErrorIndices[i] ? '' : c
      ).join('');
      const isIncomplete = userTyped !== currentSentence;

      setHistory((prev) => [...prev, { sentence: currentSentence, typed: userTyped, isIncomplete }]);
      if (currentIndex === sentences.length - 1) setIsComplete(true);
      else setCurrentIndex((prev) => prev + 1);
      setTypedChars([]);
      setSpaceErrorIndices([]);
    }
  }, [typedChars, spaceErrorIndices, currentSentence, currentIndex, isComplete, sentences.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // === 렌더링 보조 함수들 ===
  const renderUserTypedText = ({ sentence, typed }) => {
    const sentenceChars = sentence.split('');
    const typedChars = typed.split('');
    return (
      <span className="whitespace-pre font-mono">
        {typedChars.map((char, i) => {
          const colorClass = char === sentenceChars[i] ? 'text-black' : 'text-red-500';
          return <span key={i} className={colorClass}>{char === ' ' ? '\u00A0' : char}</span>;
        })}
      </span>
    );
  };

  const renderComparedTextWithCursor = (original, typedArr, isActive) => {
    const elements = [];
    for (let i = 0; i < original.length; i++) {
      const originalChar = original[i];
      const typedChar = typedArr[i] || '';
      const isError = spaceErrorIndices[i];
      const isCurrent = i === typedArr.length;

      let colorClass = 'text-black';
      let displayChar = originalChar;
      if (typedChar !== '') {
        if (typedChar === originalChar && !isError) {
          colorClass = 'text-white';
          displayChar = typedChar;
        } else {
          colorClass = 'text-red-500';
          displayChar = typedChar || originalChar;
        }
      } else if (isError) {
        colorClass = 'text-red-500';
      }
      if (displayChar === ' ') displayChar = '\u00A0';

      elements.push(
        <span key={i} className={`${colorClass} relative font-mono`}>
          {displayChar}
          {isActive && isCurrent && (
            <span className="absolute left-0 top-0 h-full w-[2px] bg-black custom-blink" />
          )}
        </span>
      );
    }
    if (isActive && typedArr.length >= original.length) {
      elements.push(<span key="cursor-end" className="inline-block w-[2px] h-6 bg-black custom-blink ml-1" />);
    }
    return <span className="whitespace-pre">{elements}</span>;
  };

  // === 통계 계산 ===
  const getTotalTyped = useCallback(() => history.reduce((acc, cur) => acc + cur.typed.length, 0), [history]);
  const getCorrectTyped = useCallback(() => history.reduce((acc, cur) => {
    const correctCount = cur.typed.split('').filter((c, i) => c === cur.sentence[i]).length;
    return acc + correctCount;
  }, 0), [history]);

  const getAccuracy = useCallback(() => {
    const totalTyped = getTotalTyped();
    const correctTyped = getCorrectTyped();
    const currentTypedCount = typedChars.length;
    const currentCorrectCount = typedChars.filter((char, i) =>
      !spaceErrorIndices[i] && char === currentSentence[i]
    ).length;
    const finalTotalTyped = totalTyped + currentTypedCount;
    const finalCorrectTyped = correctTyped + currentCorrectCount;
    return finalTotalTyped === 0 ? 0 : (finalCorrectTyped / finalTotalTyped) * 100;
  }, [getTotalTyped, getCorrectTyped, typedChars, spaceErrorIndices, currentSentence]);

  const getElapsedTimeSec = useCallback(() => Math.floor((new Date() - startTime) / 1000), [startTime]);
  const getElapsedTime = useCallback(() => {
    const diff = getElapsedTimeSec();
    return `${String(Math.floor(diff / 60)).padStart(2, '0')}:${String(diff % 60).padStart(2, '0')}`;
  }, [getElapsedTimeSec]);

  const getTypingSpeed = useCallback(() => {
    const elapsedSeconds = getElapsedTimeSec();
    return elapsedSeconds === 0 ? 0 : (getTotalTyped() / elapsedSeconds) * 60;
  }, [getElapsedTimeSec, getTotalTyped]);

  // 다시 시작 & 홈
  const handleRestart = () => {
    setCurrentIndex(0);
    setTypedChars([]);
    setSpaceErrorIndices([]);
    setHistory([]);
    setIsComplete(false);
    setStartTime(new Date());
  };
  const handleGoHome = () => navigate('/');

  const getBoxStyle = (index) => {
    if (index === currentIndex - 1) return 'bg-white';
    if (index === currentIndex) return 'bg-teal-600 border text-2xl font-semibold';
    if (index === currentIndex + 1) return 'bg-gray-300';
    if (index === currentIndex + 2) return 'bg-gray-300';
    return 'hidden';
  };

  // === UI ===
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0FDFA]">
      <div className="text-center">
        <div className="text-xl font-semibold text-gray-700 mb-4">타자연습 문장을 불러오는 중...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F0FDFA] font-[Pretendard-Regular] pt-16 pb-32">

      {error && (
        <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <span className="text-sm">서버 연결 실패 - 기본 문장으로 연습 중</span>
          <button onClick={fetchSentences} className="ml-3 text-yellow-800 hover:text-yellow-900">재시도</button>
        </div>
      )}

      {/* 이전 문장 */}
      <div className={`w-4/5 h-[50px] rounded flex items-center px-4 ${getBoxStyle(currentIndex - 1)}`}>
        {history.length > 0 && currentIndex > 0 && renderUserTypedText(history[history.length - 1])}
      </div>

      {/* 현재 문장 */}
      <div className={`w-5/6 rounded flex items-center px-4 ${getBoxStyle(currentIndex)}`} style={{ minHeight: '70px' }}>
        <div className="relative font-mono text-2xl w-full">
          {renderComparedTextWithCursor(currentSentence, typedChars, true)}
        </div>
      </div>

      {/* 다음 문장 */}
      <div className={`w-4/5 h-[50px] rounded flex items-center px-4 ${getBoxStyle(currentIndex + 1)}`}>
        {sentences[currentIndex + 1] || ''}
      </div>

      {/* 다다음 문장 */}
      <div className={`w-4/5 h-[50px] rounded flex items-center px-4 ${getBoxStyle(currentIndex + 2)}`}>
        {sentences[currentIndex + 2] || ''}
      </div>

      {!isComplete && (
        <div className="mt-10 w-full flex flex-col items-center">
          {/* ✅ StatsBar */}
          <RealTimeStats
            accuracy={getAccuracy()}
            typingSpeed={getTypingSpeed()}
            elapsedTime={getElapsedTime()}
            currentIndex={currentIndex}
            totalSentences={sentences.length}
            startTime={startTime}
            getTotalTyped={getTotalTyped}
          />
          {/* 키보드 */}
          <KeyBoard />
        </div>
      )}

      <CompletionModal
        isOpen={isComplete}
        accuracy={getAccuracy().toFixed(2)}
        typingSpeed={getTypingSpeed().toFixed(0)}
        elapsedTime={getElapsedTime()}
        onRestart={handleRestart}
        onGoHome={handleGoHome}
      />
    </div>
  );
}

export default SentencePage;
