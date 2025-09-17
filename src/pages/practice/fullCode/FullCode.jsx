import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import CompletionModal from '../../../components/practice/completionModal/CompletionModal';

const Fullcode = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [keystrokes, setKeystrokes] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isTyping, setIsTyping] = useState(false);
  const editorRef = useRef(null);
  const decorationsRef = useRef([]);
  const isComposingRef = useRef(false);
  const lastValueRef = useRef('');
  const timerRef = useRef(null);

  // 여러 예제 코드들 (JavaScript)
  const exampleCodes = [
    // 예제 1: 배열 처리와 고차 함수
    [
      'const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];',
      'const result = numbers',
      '  .filter(num => num % 2 === 0)',
      '  .map(num => num * num);',
      'console.log(result);',
      '',
      'const people = [',
      '  { name: "Alice", age: 25, city: "New York" },',
      '  { name: "Bob", age: 30, city: "Chicago" },',
      '  { name: "Charlie", age: 25, city: "New York" }',
      '];',
      '',
      'const groupBy = (array, key) => {',
      '  return array.reduce((acc, obj) => {',
      '    const groupKey = obj[key];',
      '    if (!acc[groupKey]) {',
      '      acc[groupKey] = [];',
      '    }',
      '    acc[groupKey].push(obj);',
      '    return acc;',
      '  }, {});',
      '};',
      '',
      'console.log(groupBy(people, "city"));',
    ].join('\n'),
    
    // 예제 2: 비동기 처리와 프로미스
    [
      'async function fetchUserData(userId) {',
      '  try {',
      '    const response = await fetch(`/api/users/${userId}`);',
      '    if (!response.ok) {',
      '      throw new Error(`HTTP error! status: ${response.status}`);',
      '    }',
      '    const data = await response.json();',
      '    return data;',
      '  } catch (error) {',
      '    console.error("Error fetching user data:", error);',
      '    return null;',
      '  }',
      '}',
      '',
      'async function fetchMultipleUsers(userIds) {',
      '  const promises = userIds.map(id => fetchUserData(id));',
      '  const results = await Promise.allSettled(promises);',
      '  return results',
      '    .filter(result => result.status === "fulfilled" && result.value)',
      '    .map(result => result.value);',
      '}',
      '',
      'const userIds = [1, 2, 3];',
      'fetchMultipleUsers(userIds).then(users => {',
      '  console.log("Fetched users:", users);',
      '});',
    ].join('\n'),
    
    // 예제 3: 클래스와 상속
    [
      'class Animal {',
      '  constructor(name) {',
      '    this.name = name;',
      '  }',
      '',
      '  speak() {',
      '    return `${this.name} makes a noise.`;',
      '  }',
      '}',
      '',
      'class Dog extends Animal {',
      '  speak() {',
      '    return `${this.name} says Woof!`;',
      '  }',
      '',
      '  fetch() {',
      '    return `${this.name} fetches the ball!`;',
      '  }',
      '}',
      '',
      'const animals = [new Dog("Buddy"), new Animal("Generic")];',
      'animals.forEach(animal => {',
      '  console.log(animal.speak());',
      '  if (animal instanceof Dog) {',
      '    console.log(animal.fetch());',
      '  }',
      '});',
    ].join('\n'),
    
    // 예제 4: 모듈 패턴과 클로저
    [
      'const counter = (() => {',
      '  let count = 0;',
      '',
      '  return {',
      '    increment() {',
      '      count += 1;',
      '      return count;',
      '    },',
      '    decrement() {',
      '      count -= 1;',
      '      return count;',
      '    },',
      '    getCount() {',
      '      return count;',
      '    },',
      '    reset() {',
      '      count = 0;',
      '      return count;',
      '    }',
      '  };',
      '})();',
      '',
      'console.log(counter.increment());',
      'console.log(counter.increment());',
      'console.log(counter.decrement());',
      'console.log(counter.getCount());',
      'console.log(counter.reset());',
    ].join('\n')
  ];
  
  // 랜덤으로 예제 코드 선택
  const [exampleCode, setExampleCode] = useState('');
  const [exampleLines, setExampleLines] = useState([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionStats, setCompletionStats] = useState({
    accuracy: 0,
    typingSpeed: 0,
    elapsedTime: 0
  });

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // 모든 언어에 대한 검증 비활성화
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true
    });
    
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true
    });
    
    // 에디터 옵션 설정
    editor.updateOptions({
      suggestOnTriggerCharacters: false,
      quickSuggestions: false,
      parameterHints: { enabled: false },
      suggest: {
        showKeywords: false,
        showSnippets: false,
        showClasses: false,
        showFunctions: false,
        showVariables: false,
      }
    });

    // 에디터에 키다운 이벤트 리스너 추가
    editor.onKeyDown((e) => {
      if (!isComposingRef.current) {
        setTimeout(() => {
          if (editorRef.current) {
            const value = editorRef.current.getValue();
            if (value !== lastValueRef.current) {
              lastValueRef.current = value;
              updateDecorations(value);
            }
          }
        }, 0);
      }
    });

    // Add custom CSS for character highlighting
    const style = document.createElement('style');
    style.textContent = `
      .code-correct-char {
        color: #00DC58 !important;
      }
      .code-incorrect-char {
        color: #f85149 !important;
      }
    `;
    document.head.appendChild(style);
  };

  // 데코레이션 업데이트 함수
  const updateDecorations = (value) => {
    if (!editorRef.current || typeof monaco === 'undefined') return;
    
    const newDecorations = [];
    const inputLines = (value || '').split('\n');
    
    inputLines.forEach((line, lineIndex) => {
      const lineNumber = lineIndex + 1;
      const exampleLine = exampleLines[lineIndex] || '';
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const exampleChar = exampleLine[i];
        if (char === exampleChar) {
          newDecorations.push({
            range: new monaco.Range(lineNumber, i + 1, lineNumber, i + 2),
            options: {
              inlineClassName: 'code-correct-char',
            }
          });
        } else { 
          newDecorations.push({
            range: new monaco.Range(lineNumber, i + 1, lineNumber, i + 2),
            options: {
              inlineClassName: 'code-incorrect-char',
            }
          });
        }
      }
      
      if (line.length > exampleLine.length) {
        for (let i = exampleLine.length; i < line.length; i++) {
          newDecorations.push({
            range: new monaco.Range(lineNumber, i + 1, lineNumber, i + 2),
            options: {
              inlineClassName: 'code-incorrect-char',
            }
          });
        }
      }
    });
    
    decorationsRef.current = editorRef.current.deltaDecorations(
      decorationsRef.current,
      newDecorations
    );
  };

  // 전체 정확도 계산 함수
  const calculateOverallAccuracy = (input) => {
    if (!input) return 100;
    
    const inputLines = input.split('\n');
    const exampleLines = exampleCode.split('\n');
    
    let incorrectChars = 0;
    let totalInputChars = 0;
    
    // 모든 라인에 대해 정확도 계산
    inputLines.forEach((inputLine, lineIndex) => {
      const exampleLine = exampleLines[lineIndex] || '';
      
      for (let i = 0; i < inputLine.length; i++) {
        totalInputChars++;
        if (i >= exampleLine.length || inputLine[i] !== exampleLine[i]) {
          incorrectChars++;
        }
      }
    });
    
    return totalInputChars > 0 
      ? Math.round(((totalInputChars - incorrectChars) / totalInputChars) * 100)
      : 100;
  };

  // 분당 타수(Words Per Minute) 계산
  const calculateWPM = useCallback(() => {
    if (elapsedTime === 0) return 0;
    const totalChars = code.length;
    const timeInMinutes = elapsedTime / 60;
    return Math.round((totalChars / 5) / timeInMinutes);
  }, [code, elapsedTime]);

  // 타이머 정지
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Start timer when typing begins
  const startTypingTimer = useCallback(() => {
    if (timerRef.current) return;
    
    const now = Date.now();
    setStartTime(now);
    
    timerRef.current = setInterval(() => {
      setElapsedTime(prevElapsed => {
        const currentTime = Date.now();
        const elapsedSeconds = Math.floor((currentTime - now) / 1000);
        return Math.max(0, elapsedSeconds);
      });
    }, 100);
  }, []);

  const handleEditorChange = (value, event) => {
    if (!value) value = '';
    
    if (value !== lastValueRef.current) {
      if (!isTyping && value.length > 0) {
        setIsTyping(true);
        startTypingTimer();
      }
      
      setKeystrokes(prev => prev + 1);
      
      const currentAccuracy = calculateOverallAccuracy(value);
      setAccuracy(currentAccuracy);
      
      if (!isComposingRef.current) {
        updateDecorations(value);
        
        if (event && event.changes && event.changes.length > 0) {
          const changes = event.changes[0];
          if (changes.text.includes('\n')) {
            const currentLines = value.split('\n');
            const exampleLinesArray = exampleCode.split('\n');
            
            if (currentLines.length - 1 >= exampleLinesArray.length) {
              setIsTyping(false);
              stopTimer();
              
              let correctChars = 0;
              let totalChars = 0;
              const inputLines = value.split('\n');
              
              exampleLinesArray.forEach((exampleLine, i) => {
                const inputLine = inputLines[i] || '';
                totalChars += exampleLine.length;
                for (let j = 0; j < Math.min(exampleLine.length, inputLine.length); j++) {
                  if (exampleLine[j] === inputLine[j]) {
                    correctChars++;
                  }
                }
              });
              
              const finalAccuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
              
              setCompletionStats({
                accuracy: finalAccuracy,
                typingSpeed: calculateWPM(),
                elapsedTime: elapsedTime
              });
              setShowCompletionModal(true);
              
              setCode('');
              setKeystrokes(0);
              setAccuracy(100);
              setElapsedTime(0);
              setStartTime(null);
              lastValueRef.current = '';
              
              const randomIndex = Math.floor(Math.random() * exampleCodes.length);
              const selectedExample = exampleCodes[randomIndex];
              setExampleCode(selectedExample);
              setExampleLines(selectedExample.split('\n'));
              return;
            }
          }
        }
      }
      
      lastValueRef.current = value;
      setCode(value);
    }
  };
  
  // 컴포넌트 마운트 시 랜덤 예제 선택
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * exampleCodes.length);
    const selectedExample = exampleCodes[randomIndex];
    setExampleCode(selectedExample);
    setExampleLines(selectedExample.split('\n'));
    
    setCode('');
    setKeystrokes(0);
    setAccuracy(100);
    setElapsedTime(0);
    setStartTime(null);
  }, []);

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);
  
  // 시간 포맷팅 (초를 MM:SS 형식으로 변환)
  const formatTime = (totalSeconds) => {
    if (totalSeconds < 0) return '00:00';
    
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRestart = () => {
    setShowCompletionModal(false);
    
    // 모든 상태 초기화
    setCode('');
    setKeystrokes(0);
    setAccuracy(100);
    setElapsedTime(0);
    setStartTime(null);
    setIsTyping(false);
    lastValueRef.current = '';
    
    // 타이머 정리
    stopTimer();
    
    // 데코레이션 초기화
    if (editorRef.current && decorationsRef.current) {
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
    }
    
    // 새로운 예제 코드 선택
    const randomIndex = Math.floor(Math.random() * exampleCodes.length);
    const selectedExample = exampleCodes[randomIndex];
    setExampleCode(selectedExample);
    setExampleLines(selectedExample.split('\n'));
  };

  const handleGoHome = () => {
    setShowCompletionModal(false);
    navigate('/');
  };

  return (
    <div className="flex flex-col gap-1 max-w-[1350px] mx-auto p-5 pt-2.5 min-h-[80vh] h-[calc(90vh-40px)]">
      <CompletionModal
        isOpen={showCompletionModal}
        accuracy={completionStats.accuracy}
        typingSpeed={completionStats.typingSpeed}
        elapsedTime={formatTime(completionStats.elapsedTime)}
        onRestart={handleRestart}
        onGoHome={handleGoHome}
      />
      
      {/* Modal Overlay to prevent interactions */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-0 z-40" />
      )}
      
      {/* Statistics Container */}
      <div className={`flex justify-around items-center bg-[#1E1E1E] rounded-lg px-1.5 py-1 mb-2 shadow-sm ${showCompletionModal ? 'pointer-events-none opacity-50' : ''}`}>
        <div className="flex items-center gap-1 text-gray-200 px-1 py-0.5">
          <div className="text-xs text-gray-400 whitespace-nowrap mr-0.5">정확도</div>
          <div className="text-sm font-semibold text-white min-w-[28px] text-right">{accuracy}%</div>
        </div>
        <div className="flex items-center gap-1 text-gray-200 px-1 py-0.5">
          <div className="text-xs text-gray-400 whitespace-nowrap mr-0.5">소요 시간</div>
          <div className="text-sm font-semibold text-white min-w-[28px] text-right">{formatTime(elapsedTime)}</div>
        </div>
        <div className="flex items-center gap-1 text-gray-200 px-1 py-0.5">
          <div className="text-xs text-gray-400 whitespace-nowrap mr-0.5">타수</div>
          <div className="text-sm font-semibold text-white min-w-[28px] text-right">
            {calculateWPM()} <span className="text-xs text-gray-400">타수</span>
          </div>
        </div>
      </div>
      
      {/* Code Editors Container */}
      <div className={`grid grid-cols-2 gap-8 flex-1 min-h-0 ${showCompletionModal ? 'pointer-events-none opacity-50' : ''}`}>
        {/* Example Code Display */}
        <div className="flex flex-col bg-[#1E1E1E] rounded-md overflow-hidden shadow-lg h-full">
          <div className="bg-[#1E1E1E] text-gray-200 px-4 py-2 text-sm border-b border-[#282828] font-semibold">
            예시 코드
          </div>
          <div className="flex-1 overflow-hidden relative h-[70vh] min-h-[300px] border border-[#282828] rounded bg-[#1E1E1E]">
            <div className="absolute top-0 left-0 right-0 bottom-0 z-10 cursor-not-allowed" />
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={exampleCode}
              options={{
                readOnly: true,
                lineNumbers: 'on',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 12,
                wordWrap: 'on',
                automaticLayout: true,
                renderWhitespace: 'selection',
                tabSize: 2,
                domReadOnly: true,
                cursorStyle: 'hidden',
                contextmenu: false,
                theme: 'vs-dark',
                lineNumbersMinChars: 4,
                lineDecorationsWidth: 10,
                renderLineHighlight: 'none',
                hideCursorInOverviewRuler: true,
                overviewRulerBorder: false,
                scrollbar: {
                  vertical: 'hidden',
                  horizontal: 'hidden',
                  useShadows: false,
                  verticalHasArrows: false,
                  horizontalHasArrows: false,
                  verticalScrollbarSize: 0,
                  horizontalScrollbarSize: 0,
                },
              }}
            />
          </div>
        </div>
        
        {/* Code Input */}  
        <div className="flex flex-col bg-[#1E1E1E] rounded-md overflow-hidden shadow-lg h-full">
          <div className="bg-[#1E1E1E] text-gray-200 px-4 py-2 text-sm border-b border-[#282828] font-semibold">
            코드 입력
          </div>
          <div className="flex-1 overflow-hidden relative h-[70vh] min-h-[300px] border border-[#282828] rounded bg-[#1E1E1E]">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={{
                autoIndent: "full",
                formatOnType: true,
                bracketPairColorization: { enabled: true },
                automaticLayout: true,
                fontSize: 12,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                renderWhitespace: 'selection',
                tabSize: 2,
                quickSuggestions: false,
                suggestOnTriggerCharacters: false,
                acceptSuggestionOnEnter: "off",
                wordBasedSuggestions: false,
                lineNumbersMinChars: 4,   
                lineDecorationsWidth: 10,
                links: false,
                hover: false,
                parameterHints: { enabled: false },
                autoClosingBrackets: 'never',
                autoClosingQuotes: 'never',
                autoSurround: 'never',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fullcode;