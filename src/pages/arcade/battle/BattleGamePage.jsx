// src/pages/arcade/battle/BattleGamePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// 실시간 통계 컴포넌트
function RealTimeStats({ 
  accuracy, 
  typingSpeed, 
  elapsedTime,
  currentIndex,
  totalItems,
  startTime,
  gameType
}) {
  const [displayAccuracy, setDisplayAccuracy] = useState(0);
  const [displaySpeed, setDisplaySpeed] = useState(0);
  const [currentTime, setCurrentTime] = useState(elapsedTime);

  // ⏱ 1초마다 시간 갱신
  useEffect(() => {
    if (!startTime) return;

    const timeInterval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now - startTime) / 1000);
      const minutes = String(Math.floor(diff / 60)).padStart(2, '0');
      const seconds = String(diff % 60).padStart(2, '0');
      setCurrentTime(`${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [startTime]);

  // 🎯 정확도 / 타속 애니메이션
  useEffect(() => {
    const targetAccuracy = parseFloat(accuracy) || 0;
    const targetSpeed = parseFloat(typingSpeed) || 0;

    const accuracyInterval = setInterval(() => {
      setDisplayAccuracy(prev => {
        const diff = targetAccuracy - prev;
        if (Math.abs(diff) < 0.1) {
          clearInterval(accuracyInterval);
          return targetAccuracy;
        }
        return prev + diff * 0.1;
      });
    }, 16);

    const speedInterval = setInterval(() => {
      setDisplaySpeed(prev => {
        const diff = targetSpeed - prev;
        if (Math.abs(diff) < 0.1) {
          clearInterval(speedInterval);
          return targetSpeed;
        }
        return prev + diff * 0.1;
      });
    }, 16);

    return () => {
      clearInterval(accuracyInterval);
      clearInterval(speedInterval);
    };
  }, [accuracy, typingSpeed, startTime]);

  return (
    <div className="flex justify-center w-full mb-4">
      <div className="flex justify-between w-full max-w-4xl px-6 py-3 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm">
        
        {/* 진행도 */}
        <div className="flex items-center flex-1 gap-2">
          <span className="text-gray-500">진행도</span>
          <span className="font-semibold text-gray-800">{currentIndex}/{totalItems}</span>
        </div>

        {/* 소요시간 */}
        <div className="flex items-center justify-center flex-1 gap-2">
          <span className="text-gray-500">시간</span>
          <span className="font-mono font-semibold text-gray-800">{currentTime}</span>
        </div>

        {/* 정확도 */}
        <div className="flex items-center justify-center flex-1 gap-2">
          <span className="text-gray-500">정확도</span>
          <span className={`font-semibold ${displayAccuracy >= 80 ? 'text-green-600' : displayAccuracy >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
            {displayAccuracy.toFixed(1)}%
          </span>
        </div>

        {/* 분당 타수 */}
        <div className="flex items-center justify-end flex-1 gap-2">
          <span className="text-gray-500">분당타수</span>
          <span className="font-semibold text-teal-600">{displaySpeed.toFixed(0)}타</span>
        </div>
      </div>
    </div>
  );
}

function BattleGamePage() {
  const location = useLocation();
  const [gameType, setGameType] = useState(location.state?.gameType || '단어');
  const [timeLimit] = useState(location.state?.timeLimit || 60);
  const [roomName] = useState(location.state?.roomName || '테스트방');

  // 공통 상태
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [remainingTime, setRemainingTime] = useState(timeLimit);
  const [firstKeyTime, setFirstKeyTime] = useState(null);

  // 단어 게임 상태
  const [wordList, setWordList] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordUserInput, setWordUserInput] = useState('');
  
  // 정확도 계산용: 완료된 단어들의 정확도 기록
  const [completedWords, setCompletedWords] = useState([]); // { original, typed, isCorrect }

  // 문장 게임 상태
  const [sentences, setSentences] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [typedChars, setTypedChars] = useState([]);
  const [completedSentences, setCompletedSentences] = useState([]);

  // 플레이어 정보
  const [myProgress, setMyProgress] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [myAccuracy, setMyAccuracy] = useState(100);
  const [mySpeed, setMySpeed] = useState(0);
  const [opponentSpeed, setOpponentSpeed] = useState(0);
  const [opponentAccuracy] = useState(80);

  const hangulRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

  // === 초기 데이터 로드 ===
  useEffect(() => {
    if (gameType === '단어') {
      const defaultWords = [
        'abstract', 'break', 'case', 'catch', 'class', 'const', 'continue',
        'default', 'else', 'enum', 'extends', 'final', 'for', 'if', 'import',
        'interface', 'new', 'null', 'private', 'public', 'return', 'static',
        'switch', 'this', 'try', 'void', 'while', 'async', 'await', 'function',
      ];
      setWordList([...defaultWords].sort(() => Math.random() - 0.5));
      setSentences([]);
    } else {
      const defaultSentences = [
        'print("Hello world!")',
        'for i in range(10):',
        'console.log("Hello world!");',
        'function greet(name) {',
        'System.out.println("Hello world!");',
        'public class Person {',
        'SELECT * FROM users;',
        'let message: string = "Hello world!";',
        'const express = require("express");',
        'import React from "react";',
      ];
      setSentences([...defaultSentences].sort(() => Math.random() - 0.5));
      setWordList([]);
    }

    setCurrentWordIndex(0);
    setCurrentSentenceIndex(0);
    setWordUserInput('');
    setTypedChars([]);
    setCompletedSentences([]);
    setCompletedWords([]);
    setMyProgress(0);
  }, [gameType]);

  // === 타이머 및 상대 시뮬레이션 ===
  useEffect(() => {
    let interval = null;
    if (isGameStarted && !isGameComplete && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            setIsGameComplete(true);
            return 0;
          }
          return prev - 1;
        });

        // 상대 시뮬레이션
        setOpponentProgress(prev => Math.min(100, prev + Math.random() * 3));
        setOpponentSpeed(prev => Math.min(200, prev + Math.random() * 3));
      }, 1000);
    }
    return () => interval && clearInterval(interval);
  }, [isGameStarted, isGameComplete, remainingTime]);

  // === WPM 계산 ===
  useEffect(() => {
    if (!firstKeyTime) return;

    const calcSpeed = () => {
      const now = Date.now();
      const elapsedSeconds = (now - firstKeyTime) / 1000;
      if (elapsedSeconds < 1) return;

      let totalTyped = 0;
      if (gameType === '단어') {
        const completedChars = wordList.slice(0, currentWordIndex).join('').length;
        totalTyped = completedChars + wordUserInput.length;
      } else {
        const completedChars = sentences
          .slice(0, currentSentenceIndex)
          .reduce((sum, s) => sum + s.length, 0);
        const typedNonEmpty = typedChars.filter(c => c !== '').length;
        totalTyped = completedChars + typedNonEmpty;
      }

      const minutes = elapsedSeconds / 60;
      const wpm = minutes > 0 ? (totalTyped / 5) / minutes : 0;
      setMySpeed(Math.round(wpm));
    };

    calcSpeed();
    const id = setInterval(calcSpeed, 1000);
    return () => clearInterval(id);
  }, [firstKeyTime, wordList, currentWordIndex, wordUserInput, typedChars, currentSentenceIndex, sentences, gameType]);

  // === 정확도 계산 (실시간, 글자 단위 기준) ===
  useEffect(() => {
    let totalChars = 0;
    let correctChars = 0;

    if (gameType === '단어') {
      // 완료된 단어들은 모두 정확했다고 가정(엔터로 넘어갔으므로)
      completedWords.forEach(word => {
        totalChars += word.original.length;
        if (word.isCorrect) {
          correctChars += word.original.length;
        } else {
          // 틀린 단어는 typed 길이만큼 정확도 계산
          const minLength = Math.min(word.typed.length, word.original.length);
          for (let i = 0; i < minLength; i++) {
            if (word.typed[i] === word.original[i]) {
              correctChars++;
            }
          }
        }
      });
      
      // 현재 입력 중인 단어의 글자별 정확도
      if (wordUserInput.length > 0) {
        const currentWord = wordList[currentWordIndex] || '';
        totalChars += wordUserInput.length;
        for (let i = 0; i < wordUserInput.length; i++) {
          if (wordUserInput[i] === currentWord[i]) {
            correctChars++;
          }
        }
      }
    } else {
      // 완료된 문장들의 글자별 정확도
      completedSentences.forEach(item => {
        const { original, typed } = item;
        totalChars += typed.length;
        
        for (let i = 0; i < typed.length; i++) {
          if (typed[i] === original[i]) {
            correctChars++;
          }
        }
      });
      
      // 현재 입력 중인 문장의 글자별 정확도
      if (typedChars.length > 0) {
        const currentSentence = sentences[currentSentenceIndex] || '';
        totalChars += typedChars.length;
        
        for (let i = 0; i < typedChars.length; i++) {
          if (typedChars[i] === currentSentence[i]) {
            correctChars++;
          }
        }
      }
    }
    
    if (totalChars === 0) {
      setMyAccuracy(100);
      return;
    }
    
    const acc = (correctChars / totalChars) * 100;
    setMyAccuracy(Number(acc.toFixed(1)));
  }, [completedWords, completedSentences, wordUserInput, typedChars, currentWordIndex, currentSentenceIndex, wordList, sentences, gameType]);

  // === 정확도 애니메이션을 위한 표시 값 ===
  const [displayAccuracy, setDisplayAccuracy] = useState(100);

  useEffect(() => {
    const targetAccuracy = myAccuracy;
    
    const interval = setInterval(() => {
      setDisplayAccuracy(prev => {
        const diff = targetAccuracy - prev;
        if (Math.abs(diff) < 0.1) {
          clearInterval(interval);
          return targetAccuracy;
        }
        return prev + diff * 0.1;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [myAccuracy]);

  // === 게임 결과 전송 ===
  useEffect(() => {
    if (!isGameComplete) return;

    const winnerId =
      myProgress > opponentProgress ? 1 :
      myProgress < opponentProgress ? 2 :
      0;

    const sendResult = async () => {
      try {
        const response = await fetch('/api/battle/result', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ winnerId }),
        });

        if (!response.ok) {
          console.error('결과 전송 실패:', response.status);
        } else {
          console.log('결과 전송 성공');
        }
      } catch (error) {
        console.error('결과 전송 오류:', error);
      }
    };

    sendResult();
  }, [isGameComplete, myProgress, opponentProgress]);

  // === 게임 시작 ===
  const handleStartGame = () => {
    setIsGameStarted(true);
    setIsGameComplete(false);
    setRemainingTime(timeLimit);
    setFirstKeyTime(null);
    setMySpeed(0);
    setMyAccuracy(100);
    setOpponentProgress(0);
    setOpponentSpeed(0);
    setCompletedSentences([]);
    setCompletedWords([]);
    setCurrentWordIndex(0);
    setCurrentSentenceIndex(0);
    setWordUserInput('');
    setTypedChars([]);
    setMyProgress(0);
  };

  // === 단어 게임 로직 ===
  const handleWordChange = (e) => {
    const value = e.target.value;
    if (hangulRegex.test(value)) return;
    if (!firstKeyTime) setFirstKeyTime(Date.now());

    const currentWord = wordList[currentWordIndex] || '';
    setWordUserInput(value);

    // 자동 정답 처리
    if (value === currentWord) {
      // 정확한 단어로 기록
      setCompletedWords(prev => [...prev, {
        original: currentWord,
        typed: value,
        isCorrect: true
      }]);

      const nextIndex = currentWordIndex + 1;
      setMyProgress(((nextIndex) / wordList.length) * 100);
      if (nextIndex >= wordList.length) {
        setIsGameComplete(true);
      } else {
        setCurrentWordIndex(nextIndex);
      }
      setWordUserInput('');
    }
  };

  const handleWordKeyDown = (e) => {
    if (e.key === ' ') e.preventDefault();
    if (e.key === 'Enter') {
      e.preventDefault();
      if (wordUserInput.trim() === '') return;
      if (!firstKeyTime) setFirstKeyTime(Date.now());

      const currentWord = wordList[currentWordIndex] || '';
      
      // 엔터로 넘어갈 때 정확도 판단
      const isCorrect = wordUserInput === currentWord;
      setCompletedWords(prev => [...prev, {
        original: currentWord,
        typed: wordUserInput,
        isCorrect: isCorrect
      }]);

      const nextIndex = currentWordIndex + 1;
      setMyProgress(((nextIndex) / wordList.length) * 100);
      if (nextIndex >= wordList.length) {
        setIsGameComplete(true);
      } else {
        setCurrentWordIndex(nextIndex);
      }
      setWordUserInput('');
    }
  };

  const renderWord = () => {
    const currentWord = wordList[currentWordIndex] || '';
    return currentWord.split('').map((char, index) => {
      let color = 'text-white';
      if (index < wordUserInput.length) {
        color = wordUserInput[index] === char ? 'text-black' : 'text-red-500';
      }
      return (
        <span key={index} className={color}>
          {char}
        </span>
      );
    });
  };

  // === 문장 게임 로직 ===
  const handleSentenceKeyDown = useCallback((e) => {
    if (e.isComposing || e.keyCode === 229) return;
    if (!e.key) return;
    if (hangulRegex.test(e.key)) return;
    if (isGameComplete || sentences.length === 0) return;

    if (!firstKeyTime) setFirstKeyTime(Date.now());
    e.preventDefault();

    const currentSentence = sentences[currentSentenceIndex] || '';

    if (e.key === 'Backspace') {
      setTypedChars(prev => prev.slice(0, -1));
    } else if (e.key.length === 1) {
      setTypedChars(prev => [...prev, e.key]);
    } else if (e.key === 'Enter') {
      if (typedChars.length === 0) return;
      setCompletedSentences(prev => [...prev, {
        original: currentSentence,
        typed: [...typedChars]
      }]);

      const nextIndex = currentSentenceIndex + 1;
      setMyProgress(((nextIndex) / sentences.length) * 100);

      if (nextIndex >= sentences.length) {
        setIsGameComplete(true);
      } else {
        setCurrentSentenceIndex(nextIndex);
        setTypedChars([]);
      }
    }
  }, [typedChars, currentSentenceIndex, isGameComplete, sentences, firstKeyTime]);

  useEffect(() => {
    if (isGameStarted && gameType === '문장') {
      window.addEventListener('keydown', handleSentenceKeyDown);
      return () => window.removeEventListener('keydown', handleSentenceKeyDown);
    }
  }, [handleSentenceKeyDown, isGameStarted, gameType]);

  const renderSentence = () => {
    const currentSentence = sentences[currentSentenceIndex] || '';
    const maxLength = Math.max(currentSentence.length, typedChars.length);

    return (
      <span className="whitespace-pre">
        {Array.from({ length: maxLength }).map((_, i) => {
          const originalChar = currentSentence[i];
          const typedChar = typedChars[i];
          const isCurrent = i === typedChars.length;
          let colorClass = 'text-black';
          let displayChar = '';

          if (i < typedChars.length) {
            displayChar = typedChar;
            colorClass = typedChar === originalChar ? 'text-white' : 'text-red-500';
            if (displayChar === ' ') displayChar = '_';
          } else {
            displayChar = originalChar;
            colorClass = 'text-black';
          }

          if (displayChar === ' ') displayChar = '\u00A0';
          if (!displayChar && i >= currentSentence.length) return null;

          return (
            <span key={i} className={`${colorClass} relative font-mono`}>
              {displayChar}
              {isCurrent && (
                <span className="absolute left-0 top-0 h-full w-[2px] bg-black animate-pulse" />
              )}
            </span>
          );
        })}
      </span>
    );
  };

  const renderCompletedSentence = (original, typed) => {
    const maxLength = Math.max(original.length, typed.length);

    return (
      <span className="whitespace-pre">
        {Array.from({ length: maxLength }).map((_, i) => {
          const originalChar = original[i];
          const typedChar = typed[i];
          let colorClass = 'text-gray-600';
          let displayChar = '';

          if (i < typed.length) {
            displayChar = typedChar;
            colorClass = typedChar === originalChar ? 'text-gray-600' : 'text-red-500';
          } else {
            displayChar = originalChar;
            colorClass = 'text-red-500';
          }

          if (displayChar === ' ') displayChar = '\u00A0';
          if (!displayChar) return null;

          return (
            <span key={i} className={`${colorClass} font-mono`}>
              {displayChar}
            </span>
          );
        })}
      </span>
    );
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // === 렌더링 ===
  if (!isGameStarted) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#F0FDFA]">
        <div className="w-[800px] p-8 bg-white rounded-lg shadow-lg">
          <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">{roomName}</h1>

          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between p-3 rounded bg-gray-50">
              <span className="text-gray-600">게임 유형</span>
              <span className="font-semibold">{gameType}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded bg-gray-50">
              <span className="text-gray-600">제한 시간</span>
              <span className="font-semibold">{timeLimit}초</span>
            </div>
          </div>

          <div className="mb-6 space-y-3">
            <div className="p-4 rounded-lg bg-teal-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">나</span>
                <span className="px-3 py-1 text-sm text-white bg-teal-500 rounded-full">준비 완료</span>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-red-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">상대</span>
                <span className="px-3 py-1 text-sm text-white bg-red-500 rounded-full">준비 완료</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full py-3 text-lg font-semibold text-white transition-colors bg-teal-500 rounded-lg hover:bg-teal-600"
          >
            게임 시작
          </button>
        </div>
      </div>
    );
  }

  if (isGameComplete) {
    const winner = myProgress > opponentProgress ? '승리!' : myProgress < opponentProgress ? '패배...' : '무승부';
    const winnerColor = myProgress > opponentProgress ? 'text-teal-600' : myProgress < opponentProgress ? 'text-red-600' : 'text-gray-600';

    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#F0FDFA]">
        <div className="w-[600px] p-8 bg-white rounded-lg shadow-lg">
          <h1 className={`mb-8 text-4xl font-bold text-center ${winnerColor}`}>{winner}</h1>

          <div className="mb-6 space-y-4">
            <div className="p-4 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold">나</span>
                <span className="text-2xl font-bold text-teal-600">{myProgress.toFixed(0)}%</span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>정확도</span>
                  <span className={`font-semibold ${displayAccuracy >= 80 ? 'text-green-600' : displayAccuracy >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {displayAccuracy.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>정확한 {gameType}</span>
                  <span>
                    {gameType === '단어' 
                      ? `${completedWords.filter(w => w.isCorrect).length} / ${completedWords.length}`
                      : `${completedSentences.filter(s => s.typed.length === s.original.length && s.typed.every((c, i) => c === s.original[i])).length} / ${completedSentences.length}`
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold">상대</span>
                <span className="text-2xl font-bold text-red-600">{opponentProgress.toFixed(0)}%</span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between"><span>정확도</span><span>{opponentAccuracy.toFixed(1)}%</span></div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.location.href = '/battle'}
              className="flex-1 py-3 font-semibold text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              대기실로
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 py-3 font-semibold text-white transition-colors bg-teal-500 rounded-lg hover:bg-teal-600"
            >
              재대결
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === 게임 진행 화면 ===
  return (
    <div className="relative min-h-screen flex flex-col bg-[#F0FDFA] pt-8 pb-32">
      <div className="w-full px-4 mx-auto mb-8 max-w-7xl">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col items-start space-y-1">
              <span className="text-xl font-bold">나</span>
              <span className="text-3xl font-bold text-teal-600">{myProgress.toFixed(0)}%</span>
            </div>

            <div className="text-center">
              <div className="mb-1 text-sm text-gray-600">남은 시간</div>
              <div className="text-3xl font-bold text-gray-800">{formatTime(remainingTime)}</div>
              <div className="mt-1 text-sm text-gray-500">
                정확도: <span className={`font-semibold ${displayAccuracy >= 80 ? 'text-green-600' : displayAccuracy >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {displayAccuracy.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-1">
              <span className="text-3xl font-bold text-red-600">{opponentProgress.toFixed(0)}%</span>
              <span className="text-xl font-bold">상대</span>
            </div>
          </div>

          <div className="flex items-center mb-3 space-x-2">
            <div className="flex-1 h-4 overflow-hidden bg-gray-200 rounded-full">
              <div className="h-full transition-all duration-300 bg-teal-500" style={{ width: `${myProgress}%` }} />
            </div>
            <span className="text-2xl">VS</span>
            <div className="flex-1 h-4 overflow-hidden bg-gray-200 rounded-full">
              <div className="h-full transition-all duration-300 bg-red-500" style={{ width: `${opponentProgress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {gameType === '단어' && (
        <div className="flex flex-col items-center">
          <div className="mb-6">
            <div className="bg-teal-500 w-[450px] h-[120px] rounded-xl shadow-md flex justify-center items-center text-5xl font-medium tracking-wider text-white">
              {renderWord()}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <input
              className="border-none bg-transparent text-2xl text-gray-600 text-center outline-none w-[300px] mb-2"
              type="text"
              value={wordUserInput}
              onChange={handleWordChange}
              onKeyDown={handleWordKeyDown}
              autoFocus
              placeholder="입력하세요"
            />
            <div className="w-[300px] h-[2px] bg-teal-500" />
          </div>
          <div className="mt-8 text-gray-500">{currentWordIndex + 1} / {wordList.length}</div>
        </div>
      )}

      {gameType === '문장' && (
        <div className="flex flex-col items-center px-4">
          <div className="w-full max-w-4xl space-y-4">
            {completedSentences.length > 0 && (
              <div className="w-full min-h-[60px] bg-white rounded-lg flex items-center px-6 py-3 opacity-50">
                {renderCompletedSentence(
                  completedSentences[completedSentences.length - 1].original,
                  completedSentences[completedSentences.length - 1].typed
                )}
              </div>
            )}
            <div className="w-full min-h-[80px] bg-teal-600 border-2 border-teal-700 rounded-lg flex items-center px-6 py-4">
              <div className="w-full font-mono text-2xl">{renderSentence()}</div>
            </div>
            {currentSentenceIndex < sentences.length - 1 && (
              <div className="w-full min-h-[60px] bg-white rounded-lg flex items-center px-6 py-3 opacity-30">
                <span className="font-mono text-gray-400">{sentences[currentSentenceIndex + 1]}</span>
              </div>
            )}
          </div>
          <div className="mt-8 text-gray-500">{currentSentenceIndex + 1} / {sentences.length}</div>
        </div>
      )}
    </div>
  );
}

export default BattleGamePage;