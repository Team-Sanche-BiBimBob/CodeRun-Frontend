import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import KeyBoard from '../components/KeyBoard';
import CompletionModal from '../components/CompletionModal';

function SentencePage() {
  const navigate = useNavigate();
  const [sentences, setSentences] = useState([]); // 서버에서 받아올 문장들
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedChars, setTypedChars] = useState([]);
  const [spaceErrorIndices, setSpaceErrorIndices] = useState([]);
  const [history, setHistory] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState(() => new Date());

  // 서버에서 타자연습 문장 리스트 가져오기
  const fetchSentences = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/v1/problems', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const data = await response.json();
      
      // 서버 응답 형태에 따라 조정 필요
      // 예: data가 배열이면 setSentences(data)
      // 예: data가 {sentences: [...]} 형태면 setSentences(data.sentences)
      setSentences(data.sentences || data || []);
      
    } catch (err) {
      console.error('타자연습 리스트 가져오기 실패:', err);
      setError(err.message);
      
      // 에러 발생 시 기본 더미 데이터 사용
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

  // 컴포넌트 마운트 시 문장 리스트 가져오기
  useEffect(() => {
    fetchSentences();
  }, [fetchSentences]);

  const currentSentence = sentences[currentIndex] || '';

  // 한글 입력 차단용 정규식
  const hangulRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

  const handleKeyDown = useCallback((e) => {
    // IME 입력 조합 중이면 무시 (한글 조합 중단)
    if (e.isComposing || e.keyCode === 229) {
      e.preventDefault();
      return;
    }

    // 한글 입력 차단
    if (hangulRegex.test(e.key)) {
      e.preventDefault();
      return;
    }

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

      setHistory((prev) => [
        ...prev,
        {
          sentence: currentSentence,
          typed: userTyped,
          isIncomplete,
        },
      ]);

      if (currentIndex === sentences.length - 1) {
        setIsComplete(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }

      setTypedChars([]);
      setSpaceErrorIndices([]);
    }
  }, [typedChars, spaceErrorIndices, currentSentence, currentIndex, isComplete, sentences.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // 사용자가 입력한 내용을 정확/틀린 글자별로 렌더링하는 함수
  const renderUserTypedText = ({ sentence, typed }) => {
    const sentenceChars = sentence.split('');
    const typedChars = typed.split('');
    const maxLength = Math.max(sentenceChars.length, typedChars.length);

    return (
      <span className="whitespace-pre font-mono">
        {Array.from({ length: maxLength }, (_, i) => {
          const originalChar = sentenceChars[i];
          const typedChar = typedChars[i];
          
          if (typedChar === undefined) {
            return null;
          }

          const colorClass = typedChar === originalChar ? 'text-black' : 'text-red-500';
          const displayChar = typedChar === ' ' ? '\u00A0' : typedChar;

          return (
            <span key={i} className={colorClass}>
              {displayChar}
            </span>
          );
        })}
      </span>
    );
  };

  // 현재 문장과 사용자가 입력한 텍스트를 비교하여, 색상과 커서 표시를 포함한 렌더링 함수
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
        displayChar = originalChar;
      }

      if (displayChar === ' ') displayChar = '\u00A0';

      elements.push(
        <span key={i} className={`${colorClass} relative font-mono`}>
          {displayChar}
          {isActive && isCurrent && (
            <span className="absolute left-0 top-0 h-full w-[2px] bg-black custom-blink pointer-events-none" />
          )}
        </span>
      );
    }

    if (isActive && typedArr.length >= original.length) {
      elements.push(
        <span
          key="cursor-end"
          className="inline-block w-[2px] h-6 bg-black custom-blink ml-1 align-middle pointer-events-none"
        />
      );
    }

    return <span className="whitespace-pre">{elements}</span>;
  };

  // 총 입력한 글자 수 (history 기반)
  const getTotalTyped = useCallback(() => {
    return history.reduce((acc, cur) => acc + cur.typed.length, 0);
  }, [history]);

  // 올바르게 입력한 글자 수 (history 기반)
  const getCorrectTyped = useCallback(() => {
    return history.reduce((acc, cur) => {
      const correctCount = cur.typed.split('').filter((char, i) => char === cur.sentence[i]).length;
      return acc + correctCount;
    }, 0);
  }, [history]);

  // 정확도 계산 (history + 현재 입력 중인 텍스트 포함)
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

  // 경과 시간 계산
  const getElapsedTimeSec = useCallback(() => {
    return Math.floor((new Date() - startTime) / 1000);
  }, [startTime]);

  const getElapsedTime = useCallback(() => {
    const diff = getElapsedTimeSec();
    const minutes = String(Math.floor(diff / 60)).padStart(2, '0');
    const seconds = String(diff % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [getElapsedTimeSec]);

  // 분당 타자 속도 계산
  const getTypingSpeed = useCallback(() => {
    const elapsedSeconds = getElapsedTimeSec();
    const totalTyped = getTotalTyped();
    return elapsedSeconds === 0 ? 0 : (totalTyped / elapsedSeconds) * 60;
  }, [getElapsedTimeSec, getTotalTyped]);  

  // 다시 시작
  const handleRestart = () => {
    setCurrentIndex(0);
    setTypedChars([]);
    setSpaceErrorIndices([]);
    setHistory([]);
    setIsComplete(false);
    setStartTime(new Date());
    // 서버에서 새로운 문장 리스트를 다시 가져올 수도 있음
    // fetchSentences();
  };

  // 홈 이동
  const handleGoHome = () => {
    navigate('/');
  };

  const getBoxStyle = (index) => {
    if (index === currentIndex - 1) return 'bg-white ';
    if (index === currentIndex) return 'bg-teal-600 border border-gray-300 text-2xl font-semibold';
    if (index === currentIndex + 1) return 'bg-gray-300';
    if (index === currentIndex + 2) return 'bg-gray-300';
    return 'hidden';
  };

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0FDFA]">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-700 mb-4">
            타자연습 문장을 불러오는 중...
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  // 에러 발생 시 (더미 데이터로 대체되므로 에러만 표시)
  if (error && sentences.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0FDFA]">
        <div className="text-center">
          <div className="text-xl font-semibold text-red-600 mb-4">
            서버 연결에 실패했습니다
          </div>
          <div className="text-gray-600 mb-6">{error}</div>
          <button
            onClick={fetchSentences}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F0FDFA] font-[Pretendard-Regular] pt-16 pb-32">
      {/* 서버 연결 에러가 있을 때 알림 표시 (더미 데이터 사용 중) */}
      {error && (
        <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded z-50">
          <div className="flex items-center">
            <span className="text-sm">서버 연결 실패 - 기본 문장으로 연습 중</span>
            <button
              onClick={fetchSentences}
              className="ml-3 text-yellow-800 hover:text-yellow-900 font-medium"
            >
              재시도
            </button>
          </div>
        </div>
      )}

      {/* 이전 문장 - 사용자가 입력한 내용으로 렌더링 */}
      <div className={`w-4/5 h-[50px] rounded flex items-center px-4 ${getBoxStyle(currentIndex - 1)}`}>
        {history.length > 0 && currentIndex > 0 && renderUserTypedText(history[history.length - 1])}
      </div>

      {/* 현재 문장 */}
      <div className={`w-5/6 rounded flex items-center px-4 ${getBoxStyle(currentIndex)}`} style={{ minHeight: '70px' }}>
        <div className="relative font-mono text-2xl leading-[1.75rem] min-h-[1.75rem] w-full">
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
        <div className="mt-10 w-full flex justify-center min-h-[200px]">
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