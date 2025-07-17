import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import KeyBoard from '../components/KeyBoard';

// 타자 연습용 단어 목록 (Java 키워드 등)
const words = [
  "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char", "class", "const",
  "continue", "default", "do", "double", "else", "enum", "extends", "final", "finally", "float",
  "for", "goto", "if", "implements", "import", "instanceof", "int", "interface", "long", "native",
  "new", "null", "package", "private", "protected", "public", "return", "short", "static", "strictfp",
  "super", "switch", "synchronized", "this", "throw", "throws", "transient", "try", "void", "volatile"
];

function WordPage() {
  const navigate = useNavigate();
  
  // 단어 리스트 상태 (랜덤 섞인 단어)
  const [wordList, setWordList] = useState([]);
  // 현재 타이핑 중인 단어 인덱스 상태
  const [currentIndex, setCurrentIndex] = useState(0);
  // 사용자가 입력한 텍스트 상태
  const [userInput, setUserInput] = useState('');
  // 최근 타이핑 기록 배열 (정확도 포함)
  const [history, setHistory] = useState([]);
  // 완료 상태
  const [isComplete, setIsComplete] = useState(false);
  // 시작 시간
  const [startTime, setStartTime] = useState(() => new Date());

  // 컴포넌트가 처음 마운트될 때 단어 목록을 랜덤 섞어서 초기화
  useEffect(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setWordList(shuffled);
    setCurrentIndex(0);
    setUserInput('');
    setHistory([]);
    setIsComplete(false);
    setStartTime(new Date());
  }, []);

  // 입력창에 타이핑할 때 상태 업데이트
  const handleChange = (e) => {
    const value = e.target.value;
    const currentWord = wordList[currentIndex] || '';

    // 상태 업데이트
    setUserInput(value);

    // 정답이 완전히 입력되었을 경우 자동으로 다음 단어로 이동
    if (value === currentWord) {
      const newEntry = { word: currentWord, isCorrect: true };
      setHistory(prev => [newEntry, ...prev]);
      
      // 모든 단어를 완료했는지 확인
      if (currentIndex === wordList.length - 1) {
        setIsComplete(true);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
      setUserInput('');
    }
  };

  // 엔터 키를 누르면 입력 유효성 검사 후만 처리
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (userInput.trim() === '') return; // 빈 입력 무시

      const currentWord = wordList[currentIndex]; // 현재 단어
      const isCorrect = userInput === currentWord;

      const newEntry = isCorrect
        ? { word: currentWord, isCorrect: true }
        : { word: userInput, correctWord: currentWord, isCorrect: false };

      setHistory(prev => [newEntry, ...prev]);
      
      // 모든 단어를 완료했는지 확인
      if (currentIndex === wordList.length - 1) {
        setIsComplete(true);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
      setUserInput('');
    }
  };

  // 통계 계산 함수들
  const getTotalTyped = useCallback(() => {
    return history.reduce((acc, cur) => acc + cur.word.length, 0);
  }, [history]);

  const getCorrectTyped = useCallback(() => {
    return history.reduce((acc, cur) => {
      if (cur.isCorrect) {
        return acc + cur.word.length;
      } else {
        const correctCount = cur.word.split('').filter((char, i) => char === cur.correctWord[i]).length;
        return acc + correctCount;
      }
    }, 0);
  }, [history]);

  const getAccuracy = useCallback(() => {
    const totalTyped = getTotalTyped();
    const correctTyped = getCorrectTyped();
    return totalTyped === 0 ? 0 : (correctTyped / totalTyped) * 100;
  }, [getTotalTyped, getCorrectTyped]);

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
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setWordList(shuffled);
    setCurrentIndex(0);
    setUserInput('');
    setHistory([]);
    setIsComplete(false);
    setStartTime(new Date());
  };

  const handleGoHome = () => {
    navigate('/');
  };

  // 현재 단어를 글자별로 렌더링, 입력과 비교해 맞으면 검정, 틀리면 빨간색 글자 표시
  const renderWord = () => {
    const currentWord = wordList[currentIndex] || '';
    return currentWord.split('').map((char, index) => {
      let color = 'text-white'; // 기본 흰색 (아직 입력 안된 글자)
      if (index < userInput.length) {
        color = userInput[index] === char ? 'text-black' : 'text-red-500';
      }
      return (
        <span key={index} className={`${color}`}>
          {char}
        </span>
      );
    });
  };

  // 다음 단어 미리보기 (currentIndex + 1)
  const previewNext = wordList[currentIndex + 1] || '';

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-teal-50 font-sans relative">
      {/* 단어 표시 영역 (왼쪽: 다음 단어, 가운데: 현재 단어, 오른쪽: 최근 기록) */}
      <div className="grid grid-cols-3 items-end mb-6">
        {/* 왼쪽 - 다음 단어 회색으로 미리보기 */}
        <div className="text-[#BCCCD0] text-5xl whitespace-nowrap flex justify-end pr-6 mb-10">
          {previewNext}
        </div>

        {/* 가운데 - 현재 단어 박스, 글자별 색상 다르게 */}
        <div className="bg-teal-500 w-[349px] h-[122px] rounded-xl shadow-md flex justify-center items-center text-5xl font-medium tracking-wider text-white z-10">
          {renderWord()}
        </div>

        {/* 오른쪽 - 최근 타이핑한 단어들 표시 (최대 2개) */}
        <div className="text-5xl flex flex-row items-center space-x-6 pl-6 mb-10 max-w-[350px] overflow-hidden">
          {history.slice(0, 2).map((entry, index) => {
            if (entry.isCorrect) {
              // 맞게 입력한 단어는 파란색으로 단어 전체 표시
              return (
                <div key={index} className="text-[#6BCABD] whitespace-nowrap">
                  {entry.word}
                </div>
              );
            } else {
              // 틀린 단어는 글자별로 맞는 글자는 검정, 틀린 글자는 빨간색으로 표시
              return (
                <div key={index} className="flex whitespace-nowrap tracking-normal">
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
              );
            }
          })}
        </div>
      </div>

      {/* 입력창 영역 */}
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
          {/* 입력창 밑에 강조 라인 */}
          <div className="w-[200px] h-[2px] bg-[#37A998]" />
        </div>
      )}

      {!isComplete && <KeyBoard />}

      {/* 완료 모달 */}
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
                      style={{ width: `${getAccuracy()}%` }}
                    >
                      <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-teal-400 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">타수 {getTypingSpeed().toFixed(0)}타</div>
                <div className="text-3xl font-bold text-teal-400">
                  {getAccuracy().toFixed(2)}%
                </div>
              </div>
            </div>
            
            {/* 소요시간 */}
            <div className="relative z-10 text-left mb-8">
              <div className="text-sm text-gray-600 mb-1">소요시간</div>
              <div className="text-lg font-semibold text-gray-800">{getElapsedTime()}</div>
            </div>
            
            {/* 버튼들 */}
            <div className="relative z-10 flex justify-center gap-4 mt-8">
              <button 
                onClick={handleGoHome} 
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

export default WordPage;