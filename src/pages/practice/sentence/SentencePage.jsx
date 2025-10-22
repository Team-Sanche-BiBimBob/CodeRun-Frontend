// src/pages/practice/sentence/SentencePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
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

  const location = useLocation();
  const { language: languageId, workbookId, workbookTitle, workbookProblems } = location.state || {};
  
  // URL 파라미터에서 언어 ID 가져오기 (타임어택에서 전달된 경우)
  const urlParams = new URLSearchParams(location.search);
  const urlLanguageId = urlParams.get('language');
  const finalLanguageId = languageId || (urlLanguageId ? parseInt(urlLanguageId) : null);
  
  // console.log("SentencePage received languageId:", finalLanguageId);

  // 서버에서 문장 가져오기
  const fetchSentences = useCallback(async () => {
    try {
      setLoading(true);
      console.log('문장 가져오기 시도 중...');

      // 문제집에서 전달받은 문제가 있으면 그것을 사용
      if (workbookProblems && workbookProblems.length > 0) {
        console.log('문제집 문장 사용:', workbookProblems);
        setSentences(workbookProblems);
        console.log('문제집에서 문장 로드 성공:', workbookProblems.length + '개');
        setLoading(false);
        return;
      }

      // 기본 문장 목록 (폴백 데이터)
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

      const possibleUrls = [
        finalLanguageId ? `/api/problems/sentences/${finalLanguageId}` : '/api/problems/sentences'
      ];

      // 첫 번째 API만 시도하고 실패하면 바로 폴백 사용
      const apiUrl = possibleUrls[0];
      try {
        console.log(`시도 중: ${apiUrl}`);
        // 직접 서버에 요청 (프록시 우회)
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.coderun.site';
        const fullUrl = baseUrl + apiUrl;
        console.log(`API 요청 URL: ${fullUrl}`);
        
        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(10000), // 10초 타임아웃
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log(`${apiUrl} 성공! 받은 데이터:`, data);

        let sentences = data.sentences || data || [];

        if (Array.isArray(sentences) && typeof sentences[0] === 'object') {
          sentences = sentences.map((s) => s.content || s.sentence || s.title || '');
        }

        if (Array.isArray(sentences) && sentences.length > 0) {
          // 서버에서 받은 모든 문장 사용
          setSentences(sentences);
          console.log('서버에서 문장 로드 성공:', sentences.length + '개 전체 불러옴');
          return;
        }
      } catch (err) {
        console.log('API 호출 실패, 기본 문장 사용:', err.message);
      }

      // 폴백 데이터 사용 (언어별 기본 문장)
      let fallbackSentences = [];
      
      if (finalLanguageId === 1) { // Python
        fallbackSentences = [
          'print("Hello, World!")',
          'def greet(name):',
          '    return f"Hello, {name}!"',
          'for i in range(5):',
          '    print(i)'
        ];
      } else if (finalLanguageId === 2) { // Java
        fallbackSentences = [
          'System.out.println("Hello, World!");',
          'public class Main {',
          '    public static void main(String[] args) {',
          '        System.out.println("Hello, World!");',
          '    }',
          '}'
        ];
      } else if (finalLanguageId === 5) { // JavaScript
        fallbackSentences = [
          'console.log("Hello, World!");',
          'function greet(name) {',
          '    return `Hello, ${name}!`;',
          '}',
          'for (let i = 0; i < 5; i++) {',
          '    console.log(i);',
          '}'
        ];
      } else {
        // 기본값 (Python)
        fallbackSentences = [
          'print("Hello, World!")',
          'def greet(name):',
          '    return f"Hello, {name}!"'
        ];
      }
      
      setSentences(fallbackSentences);
      console.log('기본 문장 사용:', fallbackSentences.length + '개');
    } catch (error) {
      console.error('문장 가져오기 실패:', error);
      
      // 언어별 기본 문장 설정
      let defaultSentences = [];
      
      if (finalLanguageId === 1) { // Python
        defaultSentences = [
          'print("Hello, World!")',
          'def greet(name):',
          '    return f"Hello, {name}!"',
          'for i in range(5):',
          '    print(i)',
          'if x > 0:',
          '    print("Positive")',
          'class Person:',
          '    def __init__(self, name):',
          '        self.name = name'
        ];
      } else if (finalLanguageId === 2) { // Java
        defaultSentences = [
          'System.out.println("Hello, World!");',
          'public class Main {',
          '    public static void main(String[] args) {',
          '        System.out.println("Hello, World!");',
          '    }',
          '}',
          'for (int i = 0; i < 5; i++) {',
          '    System.out.println(i);',
          '}',
          'if (x > 0) {',
          '    System.out.println("Positive");',
          '}'
        ];
      } else if (finalLanguageId === 5) { // JavaScript
        defaultSentences = [
          'console.log("Hello, World!");',
          'function greet(name) {',
          '    return `Hello, ${name}!`;',
          '}',
          'for (let i = 0; i < 5; i++) {',
          '    console.log(i);',
          '}',
          'if (x > 0) {',
          '    console.log("Positive");',
          '}',
          'const person = {',
          '    name: "John",',
          '    age: 30',
          '};'
        ];
      } else {
        // 기본값 (Python)
        defaultSentences = [
          'print("Hello, World!")',
          'def greet(name):',
          '    return f"Hello, {name}!"',
          'for i in range(5):',
          '    print(i)'
        ];
      }
      
      setSentences(defaultSentences);
    } finally {
      setLoading(false);
    }
  }, [finalLanguageId, workbookProblems]);

  useEffect(() => { fetchSentences(); }, [fetchSentences]);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const currentSentence = sentences[currentIndex] || '';
  const hangulRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

  const handleKeyDown = useCallback((e) => {
    console.log('Key pressed:', e.key); // DEBUG: Add this line
    if (e.isComposing || e.keyCode === 229) { e.preventDefault(); return; }
    if (hangulRegex.test(e.key)) { e.preventDefault(); return; }
    if (isComplete || sentences.length === 0) return;

    e.preventDefault();

    if (e.key === 'Backspace') {
      setTypedChars(prev => prev.slice(0, -1));
      setSpaceErrorIndices(prev => prev.slice(0, -1));
    } else if (e.key.length === 1) {
      const expectedChar = currentSentence[typedChars.length];
      if (e.key === ' ') {
        if (expectedChar === ' ') {
          setTypedChars(prev => [...prev, ' ']);
          setSpaceErrorIndices(prev => [...prev, false]);
        } else {
          setTypedChars(prev => [...prev, '']);
          setSpaceErrorIndices(prev => [...prev, true]);
        }
      } else {
        setTypedChars(prev => [...prev, e.key]);
        setSpaceErrorIndices(prev => [...prev, false]);
      }
    } else if (e.key === 'Enter') {
      if (typedChars.length === 0) return;
      const userTyped = typedChars.map((c, i) => spaceErrorIndices[i] ? '' : c).join('');
      const isIncomplete = userTyped !== currentSentence;

      setHistory(prev => [...prev, { sentence: currentSentence, typed: userTyped, isIncomplete }]);
      if (currentIndex === sentences.length - 1) setIsComplete(true);
      else setCurrentIndex(prev => prev + 1);
      setTypedChars([]);
      setSpaceErrorIndices([]);
    }
  }, [typedChars, spaceErrorIndices, currentSentence, currentIndex, isComplete, sentences.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const renderComparedTextWithCursor = (original, typedArr, isActive) => {
    const elements = [];
    const originalLength = original.length;

    for (let i = 0; i < originalLength; i++) {
      const originalChar = original[i];
      const typedChar = typedArr[i] || '';
      const isError = spaceErrorIndices[i];
      const isCurrent = i === typedArr.length;

      let colorClass = 'text-black';
      let displayChar = originalChar;

      if (typedChar !== '') {
        if (typedChar === originalChar && !isError) colorClass = 'text-white';
        else colorClass = 'text-red-500';
        displayChar = typedChar || originalChar;
      } else if (isError) colorClass = 'text-red-500';
      if (displayChar === ' ') displayChar = '\u00A0';

      elements.push(
        <span key={i} className={`relative font-mono ${colorClass}`}>
          {displayChar}
          {isActive && isCurrent && (
            <span className="absolute left-0 top-0 h-full w-[2px] bg-black custom-blink" />
          )}
        </span>
      );
    }

    if (typedArr.length > original.length) {
      const extraChars = typedArr.slice(original.length);
      extraChars.forEach((char, i) => {
        elements.push(
          <span key={`extra-${i}`} className="font-mono text-red-500">
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      });
    }

    if (isActive && typedArr.length >= original.length) {
      elements.push(
        <span key="cursor-end" className="inline-block w-[2px] h-6 bg-black custom-blink ml-1" />
      );
    }

    return <span className="whitespace-pre">{elements}</span>;
  };

  const getTotalTyped = useCallback(() => history.reduce((acc, cur) => acc + cur.typed.length, 0), [history]);
  const getCorrectTyped = useCallback(() => history.reduce((acc, cur) => {
    const correctCount = cur.typed.split('').filter((c, i) => c === cur.sentence[i]).length;
    return acc + correctCount;
  }, 0), [history]);
  const getAccuracy = useCallback(() => {
    const totalTyped = getTotalTyped();
    const correctTyped = getCorrectTyped();
    const currentCorrectCount = typedChars.filter((c, i) => !spaceErrorIndices[i] && c === currentSentence[i]).length;
    const finalTotal = totalTyped + typedChars.length;
    const finalCorrect = correctTyped + currentCorrectCount;
    return finalTotal === 0 ? 0 : (finalCorrect / finalTotal) * 100;
  }, [getTotalTyped, getCorrectTyped, typedChars, spaceErrorIndices, currentSentence]);

  const getElapsedTimeSec = useCallback(() => Math.floor((new Date() - startTime) / 1000), [startTime]);
  const getElapsedTime = useCallback(() => {
    const diff = getElapsedTimeSec();
    return `${String(Math.floor(diff / 60)).padStart(2,'0')}:${String(diff % 60).padStart(2,'0')}`;
  }, [getElapsedTimeSec]);
  const getTypingSpeed = useCallback(() => {
    const elapsed = getElapsedTimeSec();
    const totalTyped = getTotalTyped() + typedChars.length;
    return elapsed === 0 ? 0 : (totalTyped / elapsed) * 60;
  }, [getElapsedTimeSec, getTotalTyped, typedChars.length]);

  const getNextCharInfo = useCallback(() => {
    if (!currentSentence || typedChars.length >= currentSentence.length) {
      return { nextChar: null, nextWord: null, currentPosition: typedChars.length, totalLength: currentSentence.length, remainingText: '' };
    }
    const nextCharIndex = typedChars.length;
    const nextChar = currentSentence[nextCharIndex];
    const remainingText = currentSentence.slice(nextCharIndex);
    const nextWordMatch = remainingText.match(/^(\S+)/);
    const nextWord = nextWordMatch ? nextWordMatch[1] : remainingText;
    return { nextChar, nextWord, currentPosition: nextCharIndex, totalLength: currentSentence.length, remainingText, currentSentence };
  }, [currentSentence, typedChars.length]);

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0FDFA]">
      <div className="text-center">
        <div className="mb-4 text-xl font-semibold text-gray-700">타자연습 문장을 불러오는 중...</div>
        <div className="mx-auto w-12 h-12 rounded-full border-b-2 border-teal-600 animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F0FDFA] font-[Pretendard-Regular] pt-16 pb-32">
      {/* 이전 문장 */}
      <div
        className={`w-4/5 h-[50px] rounded flex items-center px-4 ${getBoxStyle(currentIndex - 1)}`}
        style={{
          overflow: 'hidden',       // 넘치는 텍스트 숨김
          wordBreak: 'break-all',   // 긴 단어 줄바꿈
          whiteSpace: 'pre-wrap',   // 공백 유지 + 줄바꿈 허용
        }}
      >
        {history.length > 0 && currentIndex > 0 && (() => {
          const lastHistory = history[history.length - 1];
          const { sentence, typed } = lastHistory;
          const elements = [];
          for (let i = 0; i < sentence.length; i++) {
            const originalChar = sentence[i];
            const typedChar = typed[i] || '';
            const isCorrect = typedChar === originalChar;
            elements.push(
              <span key={i} className={`font-mono ${isCorrect ? 'text-black' : 'text-red-500'}`}>
                {typedChar || originalChar}
              </span>
            );
          }
          if (typed.length > sentence.length) {
            const extras = typed.slice(sentence.length);
            extras.split('').forEach((char, i) => {
              elements.push(
                <span key={`extra-${i}`} className="font-mono text-red-500">{char}</span>
              );
            });
          }
          return (
            <span className="font-mono break-all whitespace-pre">
              {elements}
            </span>
          );
        })()}
      </div>

      {/* 현재 문장 */}
      <div
        className={`w-5/6 rounded flex items-center px-4 ${getBoxStyle(currentIndex)}`}
        style={{
          minHeight: '70px',
          maxWidth: '90vw',
          overflow: 'hidden',
          wordBreak: 'break-all',
          whiteSpace: 'pre-wrap',
        }}
      >
        <div className="relative w-full overflow-hidden font-mono text-2xl break-all whitespace-pre-wrap">
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
        <div className="flex flex-col items-center mt-10 w-full">
          <RealTimeStats
            accuracy={getAccuracy()}
            typingSpeed={getTypingSpeed()}
            elapsedTime={getElapsedTime()}
            currentIndex={currentIndex}
            totalSentences={sentences.length}
            startTime={startTime}
          />
          <KeyBoard nextCharInfo={getNextCharInfo()} isTypingActive={!isComplete} />
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