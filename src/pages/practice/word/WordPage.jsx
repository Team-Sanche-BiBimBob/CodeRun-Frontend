import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import KeyBoard from '../../../components/practice/keyboard/KeyBoard';
import CompletionModal from '../../../components/practice/completionModal/CompletionModal';
import RealTimeStats from '../../../components/practice/realTimeStats/RealTimestats';

function WordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language: languageId, workbookId, workbookTitle, workbookProblems } = location.state || {};
  
  // URL 파라미터에서 언어 ID 가져오기 (타임어택에서 전달된 경우)
  const urlParams = new URLSearchParams(location.search);
  const urlLanguageId = urlParams.get('language');
  const finalLanguageId = languageId || (urlLanguageId ? parseInt(urlLanguageId) : null);

  const [wordList, setWordList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [history, setHistory] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState(() => new Date());

  const hangulRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

  // 배열을 랜덤으로 섞는 함수
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchWords = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // 문제집에서 전달받은 문제가 있으면 그것을 사용
    if (workbookProblems && workbookProblems.length > 0) {
      console.log('문제집 단어 사용:', workbookProblems);
      const shuffledWords = shuffleArray(workbookProblems);
      setWordList(shuffledWords);
      console.log('문제집에서 단어 로드 성공:', shuffledWords.length + '개 (랜덤 셔플)');
      setLoading(false);
      return;
    }
    
    try {
      console.log('단어 가져오기 시도 중...');
      
      if (!finalLanguageId) {
        console.warn('언어 ID가 없습니다. 기본 단어 사용');
        throw new Error('언어 ID 없음');
      }

      const possibleUrls = [
        finalLanguageId ? `/api/problems/words/${finalLanguageId}` : '/api/problems/words'
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

        let words = data.words || data || [];

        if (Array.isArray(words) && typeof words[0] === 'object') {
          words = words.map((w) => w.content || w.word || w.title || '');
        }

        if (Array.isArray(words) && words.length > 0) {
          // 서버에서 받은 모든 단어 사용 (랜덤 셔플)
          const shuffledWords = shuffleArray(words);
          setWordList(shuffledWords);
          console.log('서버에서 단어 로드 성공:', shuffledWords.length + '개 (랜덤 셔플)');
          setLoading(false);
          return;
        } else {
          throw new Error('단어 데이터가 비어있습니다');
        }
      } catch (err) {
        console.log('API 호출 실패, 기본 단어 사용:', err.message);
      }

      // 폴백 데이터 사용 (언어별 기본 단어)
      let fallbackWords = [];
      
      if (finalLanguageId === 1) { // Python
        fallbackWords = [
          'print', 'def', 'if', 'else', 'for', 'while', 'class', 'import', 'return', 'lambda'
        ];
      } else if (finalLanguageId === 2) { // Java
        fallbackWords = [
          'public', 'class', 'static', 'void', 'main', 'String', 'int', 'boolean', 'if', 'for'
        ];
      } else if (finalLanguageId === 5) { // JavaScript
        fallbackWords = [
          'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'console'
        ];
      } else {
        // 기본값 (Python)
        fallbackWords = [
          'print', 'def', 'if', 'else', 'for', 'while', 'class', 'import', 'return', 'lambda'
        ];
      }
      
      // 폴백 단어들도 랜덤 셔플
      const shuffledFallbackWords = shuffleArray(fallbackWords);
      setWordList(shuffledFallbackWords);
      console.log('기본 단어 사용:', shuffledFallbackWords.length + '개 (랜덤 셔플)');
    } catch (error) {
      console.error('단어 가져오기 실패:', error);
      setError('서버에서 단어를 가져오는데 실패했습니다. 페이지를 새로고침해주세요.');
    } finally {
      setLoading(false);
    }
  }, [finalLanguageId, workbookProblems]);

  useEffect(() => {
    fetchWords();
    setCurrentIndex(0);
    setUserInput('');
    setHistory([]);
    setIsComplete(false);
    setStartTime(new Date());
  }, [fetchWords]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

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
    // 완료된 단어들의 정확도 계산
    let totalChars = 0;
    let correctChars = 0;
    
    history.forEach((entry) => {
      if (entry.isCorrect) {
        // 정확히 맞춘 경우
        totalChars += entry.word.length;
        correctChars += entry.word.length;
      } else {
        // 틀린 경우 - 입력한 글자 수와 정답 글자 수 중 큰 값을 total로
        const inputLength = entry.word.length;
        const correctLength = entry.correctWord.length;
        totalChars += Math.max(inputLength, correctLength);
        
        // 맞춘 글자 수 계산
        const minLength = Math.min(inputLength, correctLength);
        for (let i = 0; i < minLength; i++) {
          if (entry.word[i] === entry.correctWord[i]) {
            correctChars++;
          }
        }
      }
    });
    
    // 현재 입력 중인 단어 추가
    const currentWord = wordList[currentIndex] || '';
    if (userInput.length > 0) {
      totalChars += Math.max(userInput.length, currentWord.length);
      
      const minLength = Math.min(userInput.length, currentWord.length);
      for (let i = 0; i < minLength; i++) {
        if (userInput[i] === currentWord[i]) {
          correctChars++;
        }
      }
    }
    
    return totalChars === 0 ? 100 : (correctChars / totalChars) * 100;
  }, [history, userInput, wordList, currentIndex]);

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

  // 시간 문자열을 초로 변환하는 함수
  const timeToSeconds = (timeStr) => {
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0]) || 0;
      const seconds = parseInt(parts[1]) || 0;
      return minutes * 60 + seconds;
    }
    return 0;
  };

  const handleRestart = () => {
    fetchWords();
    setCurrentIndex(0);
    setUserInput('');
    setHistory([]);
    setIsComplete(false);
    setStartTime(new Date());
  };

  const handleGoHome = () => {
    // URL 파라미터에서 language가 있으면 타임어택에서 온 것으로 간주
    if (urlLanguageId) {
      // 완료 시간을 타임어택으로 전달
      const completionTime = getElapsedTime();
      const roomId = urlParams.get('roomId');
      
      console.log('단어 연습 완료:', { completionTime, roomId, urlLanguageId });
      
      // roomId가 없어도 언어 ID로 문제 ID 계산
      const languageId = parseInt(urlLanguageId);
      let problemId = null;
      
      // 언어 ID와 난이도로 문제 ID 계산
      if (languageId === 1) { // Python
        problemId = 3; // Python 단어 연습
      } else if (languageId === 2) { // Java
        problemId = 6; // Java 단어 연습
      } else if (languageId === 5) { // JavaScript
        problemId = 9; // JavaScript 단어 연습
      }
      
      if (problemId) {
        // 기존 기록과 비교하여 더 좋은 기록일 때만 업데이트 (localStorage 사용 - 브라우저 껐다 켜도 유지)
        const existingTime = localStorage.getItem(`problem_${problemId}_completion`);
        
        if (!existingTime) {
          // 기존 기록이 없으면 저장
          localStorage.setItem(`problem_${problemId}_completion`, completionTime);
          console.log('완료 시간 localStorage 저장:', { problemId, completionTime, languageId });
        } else {
          // 기존 기록이 있으면 시간 비교 (더 빠른 시간으로 업데이트)
          const existingSeconds = timeToSeconds(existingTime);
          const currentSeconds = timeToSeconds(completionTime);
          
          if (currentSeconds < existingSeconds) {
            localStorage.setItem(`problem_${problemId}_completion`, completionTime);
            console.log('더 좋은 기록으로 업데이트:', { problemId, oldTime: existingTime, newTime: completionTime });
          } else {
            console.log('기존 기록이 더 좋음:', { problemId, existingTime, currentTime: completionTime });
          }
        }
      }
      
      if (roomId) {
        // 방 완료 시간 업데이트 API 호출
        updateRoomCompletionTime(roomId, completionTime);
      }
      
      // 랭킹 점수 서버에 저장 (정확도 100%일 때만)
      if (accuracy === 100) {
        saveRankingScore(completionTime, 'DAILY');
      }
      
      navigate('/timeattack');
    } else {
      navigate('/');
    }
  };

  // 방 완료 시간 업데이트 (API 스펙에 맞게 수정)
  const updateRoomCompletionTime = async (roomId, completionTime) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.coderun.site';
      
      // API 스펙에 맞는 요청 데이터 구조
      const requestData = {
        completionTime: completionTime,
        completedAt: new Date().toISOString(),
        status: 'COMPLETED',
        result: {
          accuracy: getAccuracy().toFixed(2),
          typingSpeed: getTypingSpeed().toFixed(0),
          totalTime: completionTime
        }
      };
      
      console.log('완료 시간 업데이트 요청:', { roomId, requestData });
      
      const response = await axios.put(`${baseUrl}/api/rooms/${roomId}/completion`, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('방 완료 시간 업데이트 성공:', response.data);
    } catch (error) {
      console.error('방 완료 시간 업데이트 실패:', error);
      console.error('에러 상세:', error.response?.data);
    }
  };

  // 랭킹 점수 서버에 저장
  const saveRankingScore = async (score, rankPeriod = 'DAILY') => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.coderun.site';
      
      // 시간을 초로 변환 (예: "00:30:15" -> 1815초)
      const timeToSeconds = (timeStr) => {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
      };
      
      const scoreInSeconds = timeToSeconds(score);
      
      // AccessToken에서 userId 추출
      const getUserIdFromToken = () => {
        try {
          const token = localStorage.getItem('accessToken');
          if (!token) {
            console.log('AccessToken이 없습니다.');
            return 0;
          }
          
          const decoded = jwtDecode(token);
          console.log('디코딩된 토큰:', decoded);
          
          return decoded.userid || decoded.userId || decoded.id || 0;
        } catch (error) {
          console.error('토큰 디코딩 실패:', error);
          return 0;
        }
      };
      
      const userId = getUserIdFromToken();
      
      const requestData = {
        userId: userId, // AccessToken에서 추출한 실제 사용자 ID
        score: scoreInSeconds,
        rankPeriod: rankPeriod
      };
      
      console.log('랭킹 점수 저장 요청:', requestData);
      
      const response = await axios.post(`${baseUrl}/api/arcade/rank`, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('랭킹 점수 저장 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('랭킹 점수 저장 실패:', error);
      console.error('에러 상세:', error.response?.data);
    }
  };

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0FDFA]">
        <div className="text-center">
          <div className="mb-4 text-6xl text-red-500">⚠️</div>
          <div className="mb-4 text-xl font-semibold text-gray-700">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 text-white transition-colors bg-teal-600 rounded-lg hover:bg-teal-700"
          >
            페이지 새로고침
          </button>
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
        {entry.correctWord.split('').map((correctChar, idx) => {
          const userChar = entry.word[idx];
          let color = 'text-red-500'; // 기본값 빨간색 (안 친 부분)
          
          if (userChar !== undefined) {
            // 입력한 부분
            color = userChar === correctChar ? 'text-black' : 'text-red-500';
          }
          
          return (
            <span key={idx} className={color}>
              {userChar !== undefined ? userChar : correctChar}
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