import React, { useState, useEffect, useCallback, useMemo } from 'react';
import KeyBoard from '../components/KeyBoard';

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

// 메모화된 렌더링 컴포넌트들
const MemoizedUserTypedText = React.memo(({ sentence, typed }) => {
  const renderedText = useMemo(() => {
    const sentenceChars = sentence.split('');
    const typedChars = typed.split('');
    const maxLength = Math.max(sentenceChars.length, typedChars.length);

    return Array.from({ length: maxLength }, (_, i) => {
      const originalChar = sentenceChars[i];
      const typedChar = typedChars[i];
      
      if (typedChar === undefined) {
        return null;
      }

      const colorClass = typedChar === originalChar ? 'text-teal-600' : 'text-red-500';
      const displayChar = typedChar === ' ' ? '\u00A0' : typedChar;

      return (
        <span key={i} className={colorClass}>
          {displayChar}
        </span>
      );
    });
  }, [sentence, typed]);

  return <span className="whitespace-pre font-mono">{renderedText}</span>;
});

const MemoizedComparedTextWithCursor = React.memo(({ 
  original, 
  typedArr, 
  spaceErrorIndices, 
  isActive 
}) => {
  const renderedText = useMemo(() => {
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

    return elements;
  }, [original, typedArr, spaceErrorIndices, isActive]);

  return <span className="whitespace-pre">{renderedText}</span>;
});

function SentencePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedChars, setTypedChars] = useState([]);
  const [spaceErrorIndices, setSpaceErrorIndices] = useState([]);
  const [history, setHistory] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(() => new Date());

  // 현재 문장을 메모화
  const currentSentence = useMemo(() => sentences[currentIndex], [currentIndex]);

  // 키보드 이벤트 핸들러 최적화
  const handleKeyDown = useCallback((e) => {
    if (isComplete) return;

    const key = e.key;

    if (key === 'Backspace') {
      setTypedChars((prev) => prev.slice(0, -1));
      setSpaceErrorIndices((prev) => prev.slice(0, -1));
      return;
    }

    if (key === 'Enter') {
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
      return;
    }

    if (key.length === 1) {
      const expectedChar = currentSentence[typedChars.length];

      if (key === ' ') {
        if (expectedChar === ' ') {
          setTypedChars((prev) => [...prev, ' ']);
          setSpaceErrorIndices((prev) => [...prev, false]);
        } else {
          setTypedChars((prev) => [...prev, '']);
          setSpaceErrorIndices((prev) => [...prev, true]);
        }
      } else {
        setTypedChars((prev) => [...prev, key]);
        setSpaceErrorIndices((prev) => [...prev, false]);
      }
    }
  }, [typedChars.length, spaceErrorIndices, currentSentence, currentIndex, isComplete]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Box 스타일을 메모화
  const getBoxStyle = useCallback((index) => {
    if (index === currentIndex - 1) return 'bg-gray-300';
    if (index === currentIndex) return 'bg-white border border-gray-300 text-2xl font-semibold';
    if (index === currentIndex + 1) return 'bg-gray-100';
    if (index === currentIndex + 2) return 'bg-gray-300';
    return 'hidden';
  }, [currentIndex]);

  // 통계 계산 함수들을 메모화
  const stats = useMemo(() => {
    const totalTyped = history.reduce((acc, cur) => acc + cur.typed.length, 0);
    const correctTyped = history.reduce((acc, cur) => {
      const correctCount = cur.typed.split('').filter((char, i) => char === cur.sentence[i]).length;
      return acc + correctCount;
    }, 0);

    // 현재 입력 중인 문장도 포함하여 계산
    const currentTypedCount = typedChars.length;
    const currentCorrectCount = typedChars.filter((char, i) => 
      !spaceErrorIndices[i] && char === currentSentence[i]
    ).length;
    
    const finalTotalTyped = totalTyped + currentTypedCount;
    const finalCorrectTyped = correctTyped + currentCorrectCount;
    
    const accuracy = finalTotalTyped === 0 ? 0 : (finalCorrectTyped / finalTotalTyped) * 100;
    
    return {
      totalTyped: finalTotalTyped,
      correctTyped: finalCorrectTyped,
      accuracy
    };
  }, [history, typedChars, spaceErrorIndices, currentSentence]);

  const elapsedTimeSec = useMemo(() => {
    return Math.floor((new Date() - startTime) / 1000);
  }, [startTime]);

  const elapsedTimeFormatted = useMemo(() => {
    const minutes = String(Math.floor(elapsedTimeSec / 60)).padStart(2, '0');
    const seconds = String(elapsedTimeSec % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [elapsedTimeSec]);

  const typingSpeed = useMemo(() => {
    return elapsedTimeSec === 0 ? 0 : (stats.totalTyped / elapsedTimeSec) * 60;
  }, [elapsedTimeSec, stats.totalTyped]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setTypedChars([]);
    setSpaceErrorIndices([]);
    setHistory([]);
    setIsComplete(false);
  }, []);

  const handleQuit = useCallback(() => {
    setIsComplete(false);
  }, []);

  // 이전 문장, 다음 문장들을 메모화
  const previousSentence = useMemo(() => {
    return history.length > 0 && currentIndex > 0 ? history[history.length - 1] : null;
  }, [history, currentIndex]);

  const nextSentence = useMemo(() => sentences[currentIndex + 1] || '', [currentIndex]);
  const nextNextSentence = useMemo(() => sentences[currentIndex + 2] || '', [currentIndex]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-[#F0FDFA] font-[Pretendard-Regular]">
      {/* 이전 문장 */}
      <div className={`w-4/5 h-[50px] rounded flex items-center px-4 ${getBoxStyle(currentIndex - 1)}`}>
        {previousSentence && (
          <MemoizedUserTypedText 
            sentence={previousSentence.sentence} 
            typed={previousSentence.typed} 
          />
        )}
      </div>

      {/* 현재 문장 */}
      <div className={`w-5/6 rounded flex items-center px-4 ${getBoxStyle(currentIndex)}`} style={{ minHeight: '70px' }}>
        <div className="relative font-mono text-2xl leading-[1.75rem] min-h-[1.75rem] w-full">
          <MemoizedComparedTextWithCursor
            original={currentSentence}
            typedArr={typedChars}
            spaceErrorIndices={spaceErrorIndices}
            isActive={true}
          />
        </div>
      </div>

      {/* 다음 문장 */}
      <div className={`w-4/5 h-[50px] rounded flex items-center px-4 ${getBoxStyle(currentIndex + 1)}`}>
        {nextSentence}
      </div>

      {/* 다다음 문장 */}
      <div className={`w-4/5 h-[50px] rounded flex items-center px-4 ${getBoxStyle(currentIndex + 2)}`}>
        {nextNextSentence}
      </div>

      {!isComplete && <KeyBoard />}

      {isComplete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-[500px] text-center shadow-lg relative">
            {/* 배경 장식 요소들 */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              <div className="absolute top-4 left-8 w-6 h-6 bg-green-200 rounded transform rotate-45"></div>
              <div className="absolute top-12 right-16 w-4 h-4 bg-purple-200 rounded-full"></div>
              <div className="absolute top-16 left-20 w-8 h-4 bg-orange-200 rounded transform rotate-12"></div>
              <div className="absolute top-6 right-8 w-5 h-8 bg-green-200 rounded transform rotate-45"></div>
              <div className="absolute bottom-20 left-12 w-6 h-3 bg-purple-200 rounded transform rotate-45"></div>
              <div className="absolute bottom-32 right-20 w-4 h-6 bg-orange-200 rounded transform rotate-12"></div>
              <div className="absolute bottom-16 left-24 w-3 h-3 bg-green-200 rounded-full"></div>
              <div className="absolute bottom-8 right-12 w-7 h-4 bg-purple-200 rounded transform rotate-45"></div>
              <div className="absolute top-20 left-32 w-2 h-2 bg-orange-300 rounded-full"></div>
              <div className="absolute top-32 right-32 w-8 h-3 bg-green-200 rounded transform rotate-45"></div>
              <div className="absolute bottom-24 left-16 w-5 h-5 bg-purple-200 rounded transform rotate-12"></div>
              <div className="absolute bottom-12 right-24 w-3 h-6 bg-orange-200 rounded transform rotate-45"></div>
            </div>
            
            {/* 프로필 아이콘 */}
            <div className="relative z-10 mb-6">
              <div className="w-20 h-20 bg-gray-400 rounded-full mx-auto flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full mb-2"></div>
                <div className="w-12 h-6 bg-gray-300 rounded-full absolute bottom-4"></div>
              </div>
            </div>
            
            {/* 대단해요! 텍스트 */}
            <div className="relative z-10 text-2xl font-bold mb-8 text-gray-800">대단해요!</div>
            
            {/* 타수와 정확도 */}
            <div className="relative z-10 flex justify-between items-center mb-6">
              <div className="text-left">
                <div className="text-sm text-gray-600 mb-1">정확도(%)</div>
                <div className="flex items-center">
                  <div className="w-32 h-3 bg-gray-200 rounded-full mr-3 relative">
                    <div 
                      className="h-full bg-teal-400 rounded-full relative"
                      style={{ width: `${stats.accuracy}%` }}
                    >
                      <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-teal-400 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">타수 {typingSpeed.toFixed(0)}타</div>
                <div className="text-3xl font-bold text-teal-400">
                  {stats.accuracy.toFixed(2)}%
                </div>
              </div>
            </div>
            
            {/* 소요시간 */}
            <div className="relative z-10 text-left mb-8">
              <div className="text-sm text-gray-600 mb-1">소요시간</div>
              <div className="text-lg font-semibold text-gray-800">{elapsedTimeFormatted}</div>
            </div>
            
            {/* 버튼들 */}
            <div className="relative z-10 flex justify-center gap-4 mt-8">
              <button 
                onClick={handleQuit} 
                className="px-8 py-3 border-2 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
              >
                그만 하기
              </button>
              <button 
                onClick={handleRestart} 
                className="px-8 py-3 border-2 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
              >
                다시 하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SentencePage;