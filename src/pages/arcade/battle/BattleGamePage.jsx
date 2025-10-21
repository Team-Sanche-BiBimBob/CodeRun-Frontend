import React, { useState, useEffect, useCallback } from 'react';

function BattleGamePage() {
  const [gameType, setGameType] = useState('단어'); // '단어' or '문장'
  const [timeLimit] = useState(60);
  const [roomName] = useState('테스트방');

  // 공통 상태
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60);
  const [firstKeyTime, setFirstKeyTime] = useState(null); // 최초 타이핑 시간

  // 단어 게임 상태
  const [wordList, setWordList] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordUserInput, setWordUserInput] = useState('');

  // 문장 게임 상태
  const [sentences, setSentences] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [typedChars, setTypedChars] = useState([]); // '' 은 공백 오류로 들어갈 수 있음
  const [spaceErrorIndices, setSpaceErrorIndices] = useState([]);

  // 플레이어 정보
  const [myProgress, setMyProgress] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [myAccuracy] = useState(100);
  const [opponentAccuracy] = useState(80);
  const [mySpeed, setMySpeed] = useState(0); // 실시간 타수 (WPM)
  const [opponentSpeed, setOpponentSpeed] = useState(0); // 상대 시뮬레이션

  // 초기 데이터 로드
  useEffect(() => {
    if (gameType === '단어') {
      const defaultWords = [
        'abstract', 'break', 'case', 'catch', 'class', 'const', 'continue',
        'default', 'else', 'enum', 'extends', 'final', 'for', 'if', 'import',
        'interface', 'new', 'null', 'private', 'public', 'return', 'static',
        'switch', 'this', 'try', 'void', 'while', 'async', 'await', 'function',
      ];
      setWordList([...defaultWords].sort(() => Math.random() - 0.5));
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
    }
  }, [gameType]);

  // 타이머 (remainingTime 및 상대 시뮬레이션)
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

        // 상대 진행률/속도 시뮬레이션
        setOpponentProgress(prev => Math.min(100, prev + Math.random() * 3));
        setOpponentSpeed(prev => Math.min(150, prev + Math.random() * 3));
      }, 1000);
    }
    return () => interval && clearInterval(interval);
  }, [isGameStarted, isGameComplete, remainingTime]);

  // WPM 계산 - firstKeyTime(최초 타이핑 시간)를 기준으로 계산
  useEffect(() => {
    if (!firstKeyTime) return; // 아직 타자를 시작하지 않음

    const calcSpeed = () => {
      const now = Date.now();
      const elapsedSeconds = (now - firstKeyTime) / 1000;
      if (elapsedSeconds < 1) return; // 너무 짧으면 노이즈 방지

      // 총 입력 글자 수 계산 (빈 문자열 '' 은 제외)
      let totalTyped = 0;
      if (gameType === '단어') {
        const completedChars = wordList.slice(0, currentWordIndex).join('').length;
        totalTyped = completedChars + wordUserInput.length;
      } else { // 문장
        const completedSentencesChars = sentences
          .slice(0, currentSentenceIndex)
          .reduce((sum, s) => sum + s.length, 0);
        const typedNonEmpty = typedChars.filter(c => c !== '').length;
        totalTyped = completedSentencesChars + typedNonEmpty;
      }

      // WPM 계산: (totalChars / 5) / minutes
      const minutes = elapsedSeconds / 60;
      const wpm = minutes > 0 ? (totalTyped / 5) / minutes : 0;
      setMySpeed(Math.round(wpm));
    };

    // 한 번 계산해 적용하고 (실시간성을 위해 애니메이션 프레임으로 주기적으로 업데이트)
    calcSpeed();
    const raf = window.setInterval(calcSpeed, 1000); // 1초마다 갱신
    return () => window.clearInterval(raf);
  }, [firstKeyTime, wordList, currentWordIndex, wordUserInput, typedChars, currentSentenceIndex, sentences, gameType]);

  const handleStartGame = () => {
    setIsGameStarted(true);
    setIsGameComplete(false);
    setRemainingTime(timeLimit);
    setFirstKeyTime(null); // 타이핑 시작은 사용자가 실제로 키를 누르면 시작
    setMySpeed(0);
    setOpponentSpeed(0);
    setMyProgress(0);
    setOpponentProgress(0);
  };

  const hangulRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

  // === 단어 게임 로직 ===
  const handleWordChange = (e) => {
    const value = e.target.value;
    if (hangulRegex.test(value)) return;

    // 최초 타이핑 시점 기록
    if (!firstKeyTime) setFirstKeyTime(Date.now());

    const currentWord = wordList[currentWordIndex] || '';
    setWordUserInput(value);

    if (value === currentWord) {
      if (currentWordIndex === wordList.length - 1) {
        setIsGameComplete(true);
      } else {
        setCurrentWordIndex(prev => prev + 1);
      }
      setWordUserInput('');
      setMyProgress(((currentWordIndex + 1) / wordList.length) * 100);
    }
  };

  const handleWordKeyDown = (e) => {
    if (e.key === ' ') e.preventDefault();
    if (e.key === 'Enter') {
      e.preventDefault();
      if (wordUserInput.trim() === '') return;

      // 최초 타이핑 시점 기록 (엔터 전에 입력이 있었을 수도 있으니 방어)
      if (!firstKeyTime) setFirstKeyTime(Date.now());

      if (currentWordIndex === wordList.length - 1) {
        setIsGameComplete(true);
      } else {
        setCurrentWordIndex(prev => prev + 1);
      }
      setWordUserInput('');
      setMyProgress(((currentWordIndex + 1) / wordList.length) * 100);
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
    if (!e.key || hangulRegex.test(e.key)) return;
    if (isGameComplete || sentences.length === 0) return;

    // 최초 타이핑 시점 기록
    if (!firstKeyTime) setFirstKeyTime(Date.now());

    e.preventDefault();

    const currentSentence = sentences[currentSentenceIndex] || '';

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
          setTypedChars(prev => [...prev, '']); // 오류 표시용 빈값
          setSpaceErrorIndices(prev => [...prev, true]);
        }
      } else {
        setTypedChars(prev => [...prev, e.key]);
        setSpaceErrorIndices(prev => [...prev, false]);
      }
    } else if (e.key === 'Enter') {
      if (typedChars.length === 0) return;

      if (currentSentenceIndex === sentences.length - 1) {
        setIsGameComplete(true);
      } else {
        setCurrentSentenceIndex(prev => prev + 1);
      }
      setTypedChars([]);
      setSpaceErrorIndices([]);
      setMyProgress(((currentSentenceIndex + 1) / sentences.length) * 100);
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
    return (
      <span className="whitespace-pre">
        {currentSentence.split('').map((originalChar, i) => {
          const typedChar = typedChars[i] || '';
          const isError = spaceErrorIndices[i];
          const isCurrent = i === typedChars.length;
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

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 게임 시작 전
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

  // 게임 완료 화면
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
                <div className="flex justify-between"><span>정확도</span><span>{myAccuracy.toFixed(1)}%</span></div>
                <div className="flex justify-between"><span>타수</span><span>{mySpeed} 타/분</span></div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold">상대</span>
                <span className="text-2xl font-bold text-red-600">{opponentProgress.toFixed(0)}%</span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between"><span>정확도</span><span>{opponentAccuracy.toFixed(1)}%</span></div>
                <div className="flex justify-between"><span>타수</span><span>{opponentSpeed.toFixed(0)} 타/분</span></div>
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

  // 게임 진행 화면
  return (
    <div className="relative min-h-screen flex flex-col bg-[#F0FDFA] pt-8 pb-32">
      <div className="w-full px-4 mx-auto mb-8 max-w-7xl">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col items-start space-y-1">
              <span className="text-xl font-bold">나</span>
              <span className="text-3xl font-bold text-teal-600">{myProgress.toFixed(0)}%</span>
              <span className="text-sm text-gray-600">{mySpeed} 타/분</span>
            </div>

            <div className="text-center">
              <div className="mb-1 text-sm text-gray-600">남은 시간</div>
              <div className="text-3xl font-bold text-gray-800">{formatTime(remainingTime)}</div>
            </div>

            <div className="flex flex-col items-end space-y-1">
              <span className="text-3xl font-bold text-red-600">{opponentProgress.toFixed(0)}%</span>
              <span className="text-xl font-bold">상대</span>
              <span className="text-sm text-gray-600">{opponentSpeed.toFixed(0)} 타/분</span>
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

      {/* 단어 모드 */}
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

      {/* 문장 모드 */}
      {gameType === '문장' && (
        <div className="flex flex-col items-center px-4">
          <div className="w-full max-w-4xl space-y-4">
            {currentSentenceIndex > 0 && (
              <div className="w-full min-h-[60px] bg-white rounded-lg flex items-center px-6 py-3 opacity-50">
                <span className="font-mono text-gray-600">{sentences[currentSentenceIndex - 1]}</span>
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
