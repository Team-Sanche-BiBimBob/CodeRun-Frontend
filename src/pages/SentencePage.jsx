import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import KeyBoard from '../components/KeyBoard';
import CompletionModal from '../components/CompletionModal';

const sentences = [
  'print("Hello world!")',
  'for i in range(10):',
  'print(i)',
  'def greet(name):',
  'return f"Hello, {name}!"',
  'if x > 0:',
  'print("Positive")',
  'else:',
  'print("Non-positive")',
  'while True:',
  'break',
  'class Person:',
  'def __init__(self, name):',
  'self.name = name',
  'def say_hello(self):',
  'print(f"Hi, I am {self.name}")',
  'import math',
  'result = math.sqrt(25)',
  'try:',
  'x = 1 / 0',
  'except ZeroDivisionError:',
  'print("Cannot divide by zero")',
  'with open("file.txt") as f:',
  'content = f.read()',
  'lambda x: x * 2',
  'list_comp = [x for x in range(5)]',
  'dict_comp = {x: x**2 for x in range(5)}',
  'set_comp = {x for x in range(5)}',
  '@decorator',
  'def func():'
];

function SentencePage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedChars, setTypedChars] = useState([]);
  const [spaceErrorIndices, setSpaceErrorIndices] = useState([]);
  const [history, setHistory] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState(() => new Date());

  const currentSentence = sentences[currentIndex];

  const handleKeyDown = useCallback((e) => {
    if (isComplete) return;

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
  }, [typedChars, spaceErrorIndices, currentSentence, currentIndex, isComplete]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getBoxStyle = (index) => {
    if (index === currentIndex - 1) return 'bg-gray-300';
    if (index === currentIndex) return 'bg-white border border-gray-300 text-2xl font-semibold';
    if (index === currentIndex + 1) return 'bg-gray-100';
    if (index === currentIndex + 2) return 'bg-gray-300';
    return 'hidden';
  };

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
            // 사용자가 입력하지 않은 부분은 표시하지 않음
            return null;
          }

          const colorClass = typedChar === originalChar ? 'text-teal-600' : 'text-red-500';
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
          colorClass = 'text-teal-600';
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

  const getTotalTyped = useCallback(() => {
    return history.reduce((acc, cur) => acc + cur.typed.length, 0);
  }, [history]);

  const getCorrectTyped = useCallback(() => {
    return history.reduce((acc, cur) => {
      const correctCount = cur.typed.split('').filter((char, i) => char === cur.sentence[i]).length;
      return acc + correctCount;
    }, 0);
  }, [history]);

  const getAccuracy = useCallback(() => {
    const totalTyped = getTotalTyped();
    const correctTyped = getCorrectTyped();
    
    // 현재 입력 중인 문장도 포함하여 계산
    const currentTypedCount = typedChars.length;
    const currentCorrectCount = typedChars.filter((char, i) => 
      !spaceErrorIndices[i] && char === currentSentence[i]
    ).length;
    
    const finalTotalTyped = totalTyped + currentTypedCount;
    const finalCorrectTyped = correctTyped + currentCorrectCount;
    
    return finalTotalTyped === 0 ? 0 : (finalCorrectTyped / finalTotalTyped) * 100;
  }, [getTotalTyped, getCorrectTyped, typedChars, spaceErrorIndices, currentSentence]);

  const getElapsedTimeSec = useCallback(() => {
    return Math.floor((new Date() - startTime) / 1000);
  }, [startTime]);

  const getElapsedTime = useCallback(() => {
    const diff = getElapsedTimeSec();
    const minutes = String(Math.floor(diff / 60)).padStart(2, '0');
    const seconds = String(diff % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [getElapsedTimeSec]);

  const getTypingSpeed = useCallback(() => {
    const elapsedSeconds = getElapsedTimeSec();
    const totalTyped = getTotalTyped();
    return elapsedSeconds === 0 ? 0 : (totalTyped / elapsedSeconds) * 60;
  }, [getElapsedTimeSec, getTotalTyped]);  

  const handleRestart = () => {
    setCurrentIndex(0);
    setTypedChars([]);
    setSpaceErrorIndices([]);
    setHistory([]);
    setIsComplete(false);
    setStartTime(new Date()); // 시작 시간 초기화
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-[#F0FDFA] font-[Pretendard-Regular]">
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

      {!isComplete && <KeyBoard />}

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