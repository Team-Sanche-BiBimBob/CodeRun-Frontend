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
      if (userInput === currentWord) {
        setHistory(prev => [currentWord, ...prev.slice(0, 1)]); // 최근 2개만 유지
        setCurrentIndex(prev => prev + 1);
        setUserInput('');
      } else {
        alert('오타가 있습니다! 다시 입력하세요.');
      }
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
  const lastTyped1 = history[0] || '';
  const lastTyped2 = history[1] || '';

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-teal-50 font-sans">
      <div className="flex items-center space-x-12 mb-8">
        {/* 다음 단어 미리보기 */}
        <div className="text-teal-400 text-2xl w-24 text-right">{previewNext}</div>

        {/* 현재 단어 */}
        <div className="bg-teal-500 w-[349px] h-[122px] rounded-xl shadow-md flex justify-center items-center text-3xl font-medium tracking-wider text-white">
          {renderWord()}
        </div>

        {/* 최근 완료 단어 2개 */}
        <div className="flex flex-col text-teal-400 text-2xl w-24 text-left">
          {lastTyped1 && <div>{lastTyped1}</div>}
          {lastTyped2 && <div>{lastTyped2}</div>}
        </div>
      </div>

      {/* 입력창 */}
      <input
        className="border-none bg-transparent text-2xl text-gray-600 text-center outline-none w-[200px] mb-2"
        type="text"
        value={userInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus
        placeholder="입력하세요"
      />

      {/* 밑줄 강조 */}
      <div className="w-[200px] h-[2px] bg-[#37A998]" />
    </div>
  );
}

export default WordPage;
