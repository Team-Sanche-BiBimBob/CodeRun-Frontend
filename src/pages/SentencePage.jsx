import React, { useState, useEffect, useCallback } from 'react';
import KeyBoard from "../components/KeyBoard";
// 타자 연습할 문장 리스트
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
  const [typedText, setTypedText] = useState('');
  const [history, setHistory] = useState([]);
  const [spaceErrorIndex, setSpaceErrorIndex] = useState(null);

  const currentSentence = sentences[currentIndex];
  const isOvertyped = typedText.length > currentSentence.length;

  // 키 입력 처리
  const handleKeyDown = useCallback((e) => {
    if (e.code === 'Space' || e.key === ' ') {
      const tag = e.target.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
      }
    }

    if (e.key === 'Backspace') {
      setTypedText((prev) => prev.slice(0, -1));
      setSpaceErrorIndex(null);
    } else if (e.key.length === 1) {
      const expectedChar = currentSentence[typedText.length];
      const isSpaceError = expectedChar === ' ' && e.key !== ' ';
      if (isSpaceError) {
        setSpaceErrorIndex(typedText.length - 1);
      } else {
        setSpaceErrorIndex(null);
      }
      setTypedText((prev) => prev + e.key);
    } else if (e.key === 'Enter') {
      if (typedText.trim() === '') return;

      const isIncomplete = typedText !== currentSentence;

      setHistory((prev) => [
        ...prev,
        {
          sentence: currentSentence,
          typed: typedText,
          isIncomplete,
          isOvertyped,
        },
      ]);

      setCurrentIndex((prev) => Math.min(prev + 1, sentences.length - 1));
      setTypedText('');
      setSpaceErrorIndex(null);
    }
  }, [typedText, currentSentence, isOvertyped]);

  // 이벤트 리스너 등록 및 해제
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // 각 문장 박스에 적용할 스타일 클래스 반환 함수
  // 현재 인덱스를 기준으로 이전, 현재, 다음, 다다음 문장 구분하여 색상 다르게 함
  const getBoxStyle = (index) => {
    if (index === currentIndex - 1) return 'bg-gray-300'; // 이전 문장
    if (index === currentIndex) return 'bg-white border border-gray-300 text-2xl font-semibold'; // 현재 문장 강조
    if (index === currentIndex + 1) return 'bg-gray-100'; // 다음 문장
    if (index === currentIndex + 2) return 'bg-gray-300'; // 다다음 문장
    return 'hidden'; // 그 외는 숨김
  };

  // 완료된 문장 렌더링 (history에 저장된 문장)
  // 일치하지 않는 글자는 빨간색, 일치하면 초록색으로 표시
  const renderCompletedText = ({ sentence, typed, isIncomplete, isOvertyped }) => {
    return (
      <span className="whitespace-pre font-mono">
        {sentence.split('').map((char, i) => {
          const typedChar = typed[i];
          let colorClass = 'text-teal-600'; // 기본 초록색

          if (isOvertyped || isIncomplete) {
            if (typedChar !== char) {
              colorClass = 'text-red-500'; // 틀린 글자 빨간색
            }
          }

          return (
            <span key={i} className={colorClass}>
              {char}
            </span>
          );
        })}
      </span>
    );
  };

  // 현재 타이핑 중인 문장과 입력된 텍스트를 비교해 렌더링
  // 커서 애니메이션 포함
  const renderComparedTextWithCursor = (original, typed, isActive) => {
    const elements = [];
    const overtyped = typed.length > original.length;

    for (let i = 0; i < original.length; i++) {
      const char = original[i];
      const typedChar = typed[i];
      const isCurrent = i === typed.length; // 커서 위치

      let colorClass = 'text-black'; // 기본 검정색

      if (typedChar !== undefined) {
        if (overtyped) {
          colorClass = 'text-red-500'; // 초과 입력 시 빨간색
        } else if (typedChar === char) {
          colorClass = 'text-teal-600'; // 맞은 글자 초록색
        } else {
          colorClass = 'text-red-500'; // 틀린 글자 빨간색
        }
      }

      // 공백 에러 인덱스는 빨간색 강조
      if (spaceErrorIndex !== null && i === spaceErrorIndex) {
        colorClass = 'text-red-500';
      }

      elements.push(
        <span key={i} className={`${colorClass} relative font-mono`}>
          {char}
          {isActive && isCurrent && (
            // 현재 커서 위치에 깜빡이는 커서 표시
            <span className="absolute left-0 top-0 h-full w-[2px] bg-black custom-blink pointer-events-none" />
          )}
        </span>
      );
    }

    // 입력이 문장 길이 이상일 경우 문장 끝에도 커서 표시
    if (isActive && typed.length >= original.length) {
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
      {/* 이전에 완료한 문장 박스 (currentIndex - 1) */}
      <div className={`w-4/5 h-[50px] rounded flex items-center px-4 ${getBoxStyle(currentIndex - 1)}`}>
        {history.length > 0 && renderCompletedText(history[history.length - 1])}
      </div>

      {/* 현재 타이핑 중인 문장 박스 (currentIndex) */}
      <div className={`w-5/6 rounded flex items-center px-4 ${getBoxStyle(currentIndex)}`} style={{ minHeight: '70px' }}>
        <div className="relative font-mono text-2xl leading-[1.75rem] min-h-[1.75rem] w-full">
          {renderComparedTextWithCursor(currentSentence, typedText, true)}
        </div>
      </div>

      {/* 다음 문장 박스 (currentIndex + 1) */}
      <div className={`w-4/5 h-[50px] rounded flex items-center px-4 ${getBoxStyle(currentIndex + 1)}`}>
        {sentences[currentIndex + 1] ?? ''}
      </div>

      {/* 다다음 문장 박스 (currentIndex + 2) */}
      <div className={`w-4/5 h-[50px] rounded flex items-center px-4 ${getBoxStyle(currentIndex + 2)}`}>
        {sentences[currentIndex + 2] ?? ''}
      </div>
      <KeyBoard/>
    </div>
  );
}

export default SentencePage;
