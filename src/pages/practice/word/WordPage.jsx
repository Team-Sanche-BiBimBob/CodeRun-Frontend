import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import KeyBoard from '../../../components/practice/keyboard/KeyBoard';
import CompletionModal from '../../../components/practice/completionModal/CompletionModal';
import RealTimeStats from '../../../components/practice/realTimeStats/RealTimestats';

function WordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const languageId = location.state?.language || location.state?.languageId;

  const [wordList, setWordList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [history, setHistory] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState(() => new Date());

  const hangulRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

  const fetchWords = useCallback(async () => {
    // languageId가 없어도 기본 단어로 연습 가능하도록 수정
    if (!languageId) {
      console.warn('언어 ID가 없습니다. 기본 단어로 연습합니다.');
    }

    try {
      setLoading(true);
      
      if (!languageId) {
        console.warn('언어 ID가 없습니다. 기본 단어 사용');
        throw new Error('언어 ID 없음');
      }

      const response = await api.get(`/api/problems/words/${languageId}`, {
        headers: { 'x-auth-not-required': true }
      });

      const words = response.data
        .filter(item => item.content)
        .map(item => item.content);

      if (words.length === 0) {
        throw new Error('단어 데이터가 없습니다.');
      }

      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setWordList(shuffled);
      console.log('단어 로드 성공:', shuffled.length + '개');
    } catch (error) {
      console.error('단어 가져오기 실패:', error);
      const defaultWords = [
        'abstract', 'break', 'case', 'catch', 'class', 'const', 'continue',
        'default', 'else', 'enum', 'extends', 'final', 'for', 'if', 'import',
        'interface', 'new', 'null', 'private', 'public', 'return', 'static',
        'switch', 'this', 'try', 'void', 'while', 'async', 'await', 'function',
      ];
      const shuffled = [...defaultWords].sort(() => Math.random() - 0.5);
      setWordList(shuffled);
    } finally {
      setLoading(false);
    }
  }, [languageId]);

  useEffect(() => {
    fetchWords();
    setCurrentIndex(0);
    setUserInput('');
    setHistory([]);
    setIsComplete(false);
    setStartTime(new Date());
  }, [fetchWords]);

  const getNextCharInfo = useCallback(() => {
    const currentWord = wordList[currentIndex] || '';
    
    if (!currentWord || userInput.length >= currentWord.length) {
      return {
        nextChar: null,
        nextWord: wordList[currentIndex + 1] || null,
        currentPosition: userInput.length,
        totalLength: currentWord.length,
        remainingText: '',
        currentWord: currentWord
      };
    }

    const nextCharIndex = userInput.length;
    const nextChar = currentWord[nextCharIndex];
    const remainingText = currentWord.slice(nextCharIndex);

    return {
      nextChar: nextChar,
      nextWord: remainingText,
      currentPosition: nextCharIndex,
      totalLength: currentWord.length,
      remainingText: remainingText,
      currentWord: currentWord
    };
  }, [wordList, currentIndex, userInput]);

  const handleGlobalKeyDown = useCallback((e) => {
    if (isComplete) return;
    if (e.target.tagName !== 'INPUT') {
      e.preventDefault();
    }
  }, [isComplete]);

  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (hangulRegex.test(value)) return;

    const currentWord = wordList[currentIndex] || '';
    setUserInput(value);

    if (value === currentWord) {
      const newEntry = { word: currentWord, isCorrect: true };
      setHistory((prev) => [newEntry, ...prev]);
      if (currentIndex === wordList.length - 1) setIsComplete(true);
      else setCurrentIndex((prev) => prev + 1);
      setUserInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      e.preventDefault();
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (userInput.trim() === '' || hangulRegex.test(userInput)) return;

      const currentWord = wordList[currentIndex];
      const isCorrect = userInput === currentWord;

      const newEntry = isCorrect
        ? { word: currentWord, isCorrect: true }
        : { word: userInput, correctWord: currentWord, isCorrect: false };

      setHistory((prev) => [newEntry, ...prev]);

      if (currentIndex === wordList.length - 1) setIsComplete(true);
      else setCurrentIndex((prev) => prev + 1);

      setUserInput('');
    }
  };

  const getTotalTyped = useCallback(
    () => history.reduce((acc, cur) => acc + cur.word.length, 0),
    [history]
  );

  const getCorrectTyped = useCallback(
    () =>
      history.reduce((acc, cur) => {
        if (cur.isCorrect) return acc + cur.word.length;
        const correctCount = cur.word
          .split('')
          .filter((char, i) => char === cur.correctWord[i]).length;
        return acc + correctCount;
      }, 0),
    [history]
  );

  const getAccuracy = useCallback(() => {
    const totalTyped = getTotalTyped();
    const correctTyped = getCorrectTyped();
    const currentWord = wordList[currentIndex] || '';
    const currentCorrectCount = userInput
      .split('')
      .filter((char, i) => char === currentWord[i]).length;

    const finalTotalTyped = totalTyped + userInput.length;
    const finalCorrectTyped = correctTyped + currentCorrectCount;

    return finalTotalTyped === 0
      ? 0
      : (finalCorrectTyped / finalTotalTyped) * 100;
  }, [getTotalTyped, getCorrectTyped, userInput, wordList, currentIndex]);

  const getElapsedTimeSec = useCallback(
    () => Math.floor((new Date() - startTime) / 1000),
    [startTime]
  );

  const getElapsedTime = useCallback(() => {
    const diff = getElapsedTimeSec();
    const minutes = String(Math.floor(diff / 60)).padStart(2, '0');
    const seconds = String(diff % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [getElapsedTimeSec]);

  const getTypingSpeed = useCallback(() => {
    const elapsedSeconds = getElapsedTimeSec();
    const completedTyped = getTotalTyped();
    const currentTyped = userInput.length;
    const totalTyped = completedTyped + currentTyped;
    return elapsedSeconds === 0 ? 0 : (totalTyped / elapsedSeconds) * 60;
  }, [getElapsedTimeSec, getTotalTyped, userInput.length]);

  const handleRestart = () => {
    fetchWords();
    setCurrentIndex(0);
    setUserInput('');
    setHistory([]);
    setIsComplete(false);
    setStartTime(new Date());
  };

  const handleGoHome = () => navigate('/');

  const renderWord = () => {
    const currentWord = wordList[currentIndex] || '';
    return currentWord.split('').map((char, index) => {
      let color = 'text-white';
      if (index < userInput.length) {
        color = userInput[index] === char ? 'text-black' : 'text-red-500';
      }
      return (
        <span key={index} className={color}>
          {char}
        </span>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0FDFA]">
        <div className="text-center">
          <div className="mb-4 text-xl font-semibold text-gray-700">
            타자연습 단어를 불러오는 중...
          </div>
          <div className="w-12 h-12 mx-auto border-b-2 border-teal-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const previewNext = wordList[currentIndex + 1] || '';

  return (
    <div className="relative flex flex-col items-center min-h-screen pt-16 pb-32 font-sans bg-teal-50">
      <div className="grid items-end grid-cols-3 mb-6">
        <div className="text-5xl flex flex-row items-center space-x-6 justify-end pr-6 mb-10 max-w-[350px] overflow-hidden">
          {history.slice(0, 2).reverse().map((entry, index) =>
            entry.isCorrect ? (
              <div key={index} className="text-[#6BCABD] whitespace-nowrap">
                {entry.word}
              </div>
            ) : (
              <div key={index} className="flex tracking-normal whitespace-nowrap">
                {entry.word.split('').map((char, idx) => {
                  const correctChar = entry.correctWord[idx];
                  const isCorrectChar = char === correctChar;
                  return (
                    <span
                      key={idx}
                      className={isCorrectChar ? 'text-black' : 'text-red-500'}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>
            )
          )}
        </div>

        <div className="bg-teal-500 w-[349px] h-[122px] rounded-xl shadow-md flex justify-center items-center text-5xl font-medium tracking-wider text-white z-10">
          {renderWord()}
        </div>

        <div className="text-[#BCCCD0] text-5xl whitespace-nowrap flex justify-start pl-6 mb-10">
          {previewNext}
        </div>
      </div>

      {!isComplete && (
        <div className="flex flex-col items-center">
          <input
            className="border-none bg-transparent text-2xl text-gray-600 text-center outline-none w-[200px] mb-2"
            type="text"
            value={userInput}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoFocus
            placeholder="입력하세요"
          />
          <div className="w-[200px] h-[2px] bg-[#37A998] mb-7" />
        </div>
      )}

      {!isComplete && (
        <div className="flex flex-col items-center w-full mt-10">
          <RealTimeStats
            accuracy={getAccuracy()}
            typingSpeed={getTypingSpeed()}
            elapsedTime={getElapsedTime()}
            currentIndex={currentIndex}
            totalSentences={wordList.length}
            startTime={startTime}
          />
          <KeyBoard 
            nextCharInfo={getNextCharInfo()}
            isTypingActive={!isComplete}
          />
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

export default WordPage;