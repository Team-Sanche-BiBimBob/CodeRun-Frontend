import React, { useEffect, useState } from 'react';

const words = [
  "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char", "class", "const",
  "continue", "default", "do", "double", "else", "enum", "extends", "final", "finally", "float",
  "for", "goto", "if", "implements", "import", "instanceof", "int", "interface", "long", "native",
  "new", "null", "package", "private", "protected", "public", "return", "short", "static", "strictfp",
  "super", "switch", "synchronized", "this", "throw", "throws", "transient", "try", "void", "volatile"
];

function WordPage() {
  const [wordList, setWordList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setWordList(shuffled);
    setCurrentIndex(0);
    setUserInput('');
    setHistory([]);
  }, []);

  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const currentWord = wordList[currentIndex];
      const isCorrect = userInput === currentWord;

      const newEntry = isCorrect
        ? { word: currentWord, isCorrect: true }
        : { word: userInput, correctWord: currentWord, isCorrect: false };

      setHistory(prev => [newEntry, ...prev.slice(0, 1)]);
      setCurrentIndex(prev => prev + 1);
      setUserInput('');
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
        <span key={index} className={`${color}`}>
          {char}
        </span>
      );
    });
  };

  const previewNext = wordList[currentIndex + 1] || '';

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-teal-50 font-sans relative">
      {/* 단어 라인 */}
      <div className="grid grid-cols-3 items-end mb-6">
        {/* 왼쪽 - 다음 단어 (회색) */}
        <div className="text-[#BCCCD0] text-5xl whitespace-nowrap flex justify-end pr-6 mb-10">
          {previewNext}
        </div>

        {/* 가운데 - 워드박스 */}
        <div className="bg-teal-500 w-[349px] h-[122px] rounded-xl shadow-md flex justify-center items-center text-5xl font-medium tracking-wider text-white z-10">
          {renderWord()}
        </div>

        {/* 오른쪽 - 최근 단어들 */}
        <div className="text-5xl flex flex-row items-center space-x-6 pl-6 mb-10 max-w-[350px] overflow-hidden">
          {history.slice(0, 2).map((entry, index) => {
            if (entry.isCorrect) {
              return (
                <div key={index} className="text-[#6BCABD] whitespace-nowrap">
                  {entry.word}
                </div>
              );
            } else {
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

      {/* 입력창 */}
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
        <div className="w-[200px] h-[2px] bg-[#37A998]" />
      </div>
    </div>
  );
}

export default WordPage;
