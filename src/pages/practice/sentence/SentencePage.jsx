import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import KeyBoard from '../../../components/practice/keyboard/KeyBoard';
import CompletionModal from '../../../components/practice/completionModal/CompletionModal';
import RealTimeStats from '../../../components/practice/realTimeStats/RealTimestats';

function SentencePage() {
  const navigate = useNavigate();
  const [sentences, setSentences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedChars, setTypedChars] = useState([]);
  const [spaceErrorIndices, setSpaceErrorIndices] = useState([]);
  const [history, setHistory] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState(() => new Date());

  // 서버에서 문장 가져오기 (개선된 버전)
const fetchSentences = useCallback(async () => {
  try {
    setLoading(true);
    console.log('문장 가져오기 시도 중...');

    const possibleUrls = [
      '/api/problems/sentences',
    ];

    let lastError = null;

    for (const apiUrl of possibleUrls) {
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('응답이 JSON 형식이 아닙니다');
        }

        const data = await response.json();
        console.log('받은 데이터:', data);

        let sentences = data.sentences || data || [];

        // ✅ 객체 배열일 경우 content나 sentence 필드 추출
        if (Array.isArray(sentences) && typeof sentences[0] === 'object') {
          sentences = sentences.map((s) => s.content || s.sentence || s.title || '');
        }

        if (!Array.isArray(sentences) || sentences.length === 0) {
          throw new Error('문장 데이터가 비어있습니다');
        }

        const shuffled = [...sentences].sort(() => Math.random() - 0.5);
        setSentences(shuffled);
        console.log('문장 로드 성공:', shuffled.length + '개');
        return;
      } catch (err) {
        console.log(`${apiUrl} 실패:`, err.message);
        lastError = err;
        continue;
      }
    }

    throw lastError || new Error('모든 API 엔드포인트에 연결할 수 없습니다');
  } catch (err) {
    console.error('타자연습 문장 가져오기 최종 실패:', err);

    // fallback 문장들 (더 많은 프로그래밍 관련 문장들)
    const defaultSentences = [
      'print("Hello world!")',
      'for i in range(10):',
      'console.log("Hello world!");',
      'function greet(name) {',
      'System.out.println("Hello world!");',
      'public class Person {',
      'SELECT * FROM users;',
      'let message: string = "Hello world!";',
      'println("Hello world!")',
      'func greet(name: String) -> String {',
      'const express = require("express");',
      'import React from "react";',
      'def calculate_sum(a, b):',
      'try { connection.close(); }',
      'UPDATE users SET name = ?',
      'while (condition === true) {',
      'async function fetchData() {',
      'class Calculator extends Component {',
      'catch (error) { console.error(error); }',
      'const [state, setState] = useState();',
      'public static void main(String[] args) {',
      'from django.http import HttpResponse',
      'npm install express mongoose',
      'git add . && git commit -m "Initial commit"',
      'docker run -d -p 3000:3000 myapp',
      'const result = await api.getData();',
      'if (user.isAuthenticated()) {',
      'return res.status(200).json(data);',
      'CREATE TABLE users (id INT PRIMARY KEY);',
      'const handleSubmit = (e) => { e.preventDefault(); }'
    ];
    
    const shuffled = [...defaultSentences].sort(() => Math.random() - 0.5);
    setSentences(shuffled);
    console.log('기본 문장으로 시작:', shuffled.length + '개');
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => { fetchSentences(); }, [fetchSentences]);

  const currentSentence = sentences[currentIndex] || '';
  const hangulRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

  // 키 입력 처리 - 모든 기본 동작 방지
  const handleKeyDown = useCallback((e) => {
    if (e.isComposing || e.keyCode === 229) { e.preventDefault(); return; }
    if (hangulRegex.test(e.key)) { e.preventDefault(); return; }
    if (isComplete || sentences.length === 0) return;

    // ✅ 모든 키 입력에 대해 기본 동작 방지
    e.preventDefault();

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
    const completedTyped = getTotalTyped();
    const currentTyped = typedChars.length; // 현재 타이핑 중인 글자 추가
    const totalTyped = completedTyped + currentTyped;
    return elapsedSeconds === 0 ? 0 : (totalTyped / elapsedSeconds) * 60;
  }, [getElapsedTimeSec, getTotalTyped, typedChars.length]);

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