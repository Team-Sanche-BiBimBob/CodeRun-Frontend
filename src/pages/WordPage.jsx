import React, { useEffect, useState } from 'react';

// 타자 연습용 단어 목록 (Java 키워드 등)
const words = [
  "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char", "class", "const",
  "continue", "default", "do", "double", "else", "enum", "extends", "final", "finally", "float",
  "for", "goto", "if", "implements", "import", "instanceof", "int", "interface", "long", "native",
  "new", "null", "package", "private", "protected", "public", "return", "short", "static", "strictfp",
  "super", "switch", "synchronized", "this", "throw", "throws", "transient", "try", "void", "volatile"
];

function WordPage() {
  // 단어 리스트 상태 (랜덤 섞인 단어)
  const [wordList, setWordList] = useState([]);
  // 현재 타이핑 중인 단어 인덱스 상태
  const [currentIndex, setCurrentIndex] = useState(0);
  // 사용자가 입력한 텍스트 상태
  const [userInput, setUserInput] = useState('');
  // 최근 타이핑 기록 배열 (정확도 포함)
  const [history, setHistory] = useState([]);

  // 컴포넌트가 처음 마운트될 때 단어 목록을 랜덤 섞어서 초기화
  useEffect(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setWordList(shuffled);
    setCurrentIndex(0);
    setUserInput('');
    setHistory([]);
  }, []);

  // 입력창에 타이핑할 때 상태 업데이트
  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  // 엔터 키를 누르면 현재 입력한 단어와 정답 단어 비교 후 처리
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const currentWord = wordList[currentIndex]; // 현재 단어
      const isCorrect = userInput === currentWord; // 정답 여부

      // 기록 객체 생성
      // 맞으면 {word, isCorrect: true}
      // 틀리면 {word: 사용자가 입력한 단어, correctWord: 정답, isCorrect: false}
      const newEntry = isCorrect
        ? { word: currentWord, isCorrect: true }
        : { word: userInput, correctWord: currentWord, isCorrect: false };

      // history 배열 맨 앞에 새 기록 추가, 최대 2개까지만 유지 (slice(0, 1))
      setHistory(prev => [newEntry, ...prev.slice(0, 1)]);

      // 다음 단어로 인덱스 증가
      setCurrentIndex(prev => prev + 1);

      // 입력창 초기화
      setUserInput('');
    }
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
    </div>
  );
}

export default WordPage;

