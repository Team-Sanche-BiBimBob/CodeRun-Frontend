import React, { useState, useEffect, useCallback } from 'react';
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
  'def func():',
];

function SentencePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedChars, setTypedChars] = useState([]);
  const [spaceErrorIndices, setSpaceErrorIndices] = useState([]);
  const [history, setHistory] = useState([]);

  const currentSentence = sentences[currentIndex];

  const handleKeyDown = useCallback((e) => {
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
          // 문자를 입력해야 하는데 스페이스바 입력 (오류)
          setTypedChars((prev) => [...prev, '']); // 공백 입력 무시
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

      setCurrentIndex((prev) => Math.min(prev + 1, sentences.length - 1));
      setTypedChars([]);
      setSpaceErrorIndices([]);
    }
  }, [typedChars, spaceErrorIndices, currentSentence]);

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

  const renderCompletedText = ({ sentence, typed }) => {
    const sentenceChars = sentence.split('');
    const typedChars = typed.split('');

    return (
      <span className="whitespace-pre font-mono">
        {sentenceChars.map((char, i) => {
          const typedChar = typedChars[i];
          const colorClass =
            typedChar === char ? 'text-teal-600' : 'text-red-500';

          return (
            <span key={i} className={colorClass}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          );
        })}
        {typedChars.length > sentenceChars.length &&
          typedChars.slice(sentenceChars.length).map((char, i) => (
            <span key={`extra-${i}`} className="text-red-500">
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
      </span>
    );
  };

  const renderComparedTextWithCursor = (original, typedArr, isActive) => {
    const elements = [];
    const maxLen = original.length;

    for (let i = 0; i < maxLen; i++) {
      const originalChar = original[i];
      const typedChar = typedArr[i] ?? '';
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
        // 스페이스바 잘못 누른 경우
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

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-[#F0FDFA] font-[Pretendard-Regular]">
      {/* 이전 문장 */}
      <div className={`w-4/5 h-[50px] rounded flex items-center px-4 ${getBoxStyle(currentIndex - 1)}`}>
        {history.length > 0 && renderCompletedText(history[history.length - 1])}
      </div>

      {/* 현재 문장 */}
      <div className={`w-5/6 rounded flex items-center px-4 ${getBoxStyle(currentIndex)}`} style={{ minHeight: '70px' }}>
        <div className="relative font-mono text-2xl leading-[1.75rem] min-h-[1.75rem] w-full">
          {renderComparedTextWithCursor(currentSentence, typedChars, true)}
        </div>
      </div>

      {/* 다음 문장 */}
      <div className={`w-4/5 h-[50px] rounded flex items-center px-4 ${getBoxStyle(currentIndex + 1)}`}>
        {sentences[currentIndex + 1] ?? ''}
      </div>

      {/* 다다음 문장 */}
      <div className={`w-4/5 h-[50px] rounded flex items-center px-4 ${getBoxStyle(currentIndex + 2)}`}>
        {sentences[currentIndex + 2] ?? ''}
      </div>

      <KeyBoard />
    </div>
  );
}

export default SentencePage;
