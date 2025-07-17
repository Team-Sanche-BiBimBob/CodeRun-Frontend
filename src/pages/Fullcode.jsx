import React, { useState, useRef, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import CompletionModal from '../components/CompletionModal';
import './Fullcode.css';

const Fullcode = () => {
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
    
    // 모든 언어에 대한 검증 비활성화
    monaco.languages.getLanguages().forEach(language => {
      monaco.languages.registerDocumentSemanticTokensProvider(language.id, {
        getLegend: () => ({
          tokenTypes: [],
          tokenModifiers: []
        }),
        provideDocumentSemanticTokens: () => ({
          data: new Uint32Array(),
          resultId: null
        }),
        releaseDocumentSemanticTokens: () => {}
      });
    });
    
    // 에디터 옵션 설정 (스펠링 체크, 시맨틱 검증 비활성화)
    editor.updateOptions({
      suggestOnTriggerCharacters: false,
      quickSuggestions: false,
      parameterHints: {
        enabled: false
      },
      suggest: {
        showKeywords: false,
        showSnippets: false,
        showClasses: false,
        showFunctions: false,
        showVariables: false,
        showModules: false,
        showFiles: false,
        showReferences: false,
        showFolders: false,
        showTypeParameters: false,
        showConstants: false,
        showProperties: false,
        showValues: false,
        showIssues: false,
        showUsers: false,
        showWords: false,
        showColors: false,
        showOperators: false,
        showUnits: false
      },
      'semanticHighlighting.enabled': false,
      'semanticValidation': false,
      'suggestSelection': 'none',
      'suggest.showStatusBar': false,
      'suggest.showIcons': false,
      'suggest.showInlineDetails': false,
      'suggest.showMethodSuggestions': false,
      'suggest.showFunctionSuggestions': false,
      'suggest.showConstructorSuggestions': false,
      'suggest.showDeprecated': false,
      'suggest.showFieldSuggestions': false,
      'suggest.showVariableSuggestions': false,
      'suggest.showClassSuggestions': false,
      'suggest.showStructSuggestions': false,
      'suggest.showInterfaceSuggestions': false,
      'suggest.showModuleSuggestions': false,
      'suggest.showPropertySuggestions': false,
      'suggest.showEventSuggestions': false,
      'suggest.showOperatorSuggestions': false,
      'suggest.showUnitSuggestions': false,
      'suggest.showValueSuggestions': false,
      'suggest.showConstantSuggestions': false,
      'suggest.showEnumSuggestions': false,
      'suggest.showEnumMemberSuggestions': false,
      'suggest.showKeywordSuggestions': false,
      'suggest.showTextSuggestions': false,
      'suggest.showIssueSuggestions': false,
      'suggest.showUserSuggestions': false,
      'suggest.showSnippetSuggestions': false,
      'suggest.showColorSuggestions': false,
      'suggest.showFileSuggestions': false,
      'suggest.showReferenceSuggestions': false,
      'suggest.showFolderSuggestions': false,
      'suggest.showTypeParameterSuggestions': false,
      'suggest.showSnippetOnTab': false,
      'suggest.filterGraceful': false,
      'suggest.localityBonus': false,
      'suggest.shareSuggestSelections': false,
      'suggest.showCustomcolors': false,
      'suggest.showVariables': false,
      'suggest.showKeywords': false,
      'suggest.showSnippets': false,
      'suggest.showClasses': false,
      'suggest.showColors': false,
      'suggest.showConstants': false,
      'suggest.showConstructors': false,
      'suggest.showValues': false,
      'suggest.showFolders': false,
      'suggest.showUsers': false,
      'suggest.showIssues': false
    });

    // 에디터에 키다운 이벤트 리스너 추가
    editor.onKeyDown((e) => {
      // 한글 조합 중이 아닌 경우에만 즉시 업데이트
      if (!isComposingRef.current) {
        // 약간의 지연을 두어 입력이 완전히 처리되도록 함
        setTimeout(() => {
          if (editorRef.current) {
            const value = editorRef.current.getValue();
            if (value !== lastValueRef.current) {
              lastValueRef.current = value;
              // updateDecorations(value);
            }
          }
        }, 0);
      }
    });
  };

  // 데코레이션 업데이트 함수
  const updateDecorations = (value) => {
    if (!editorRef.current) return;
    
    const model = editorRef.current.getModel();
    const newDecorations = [];
    const inputLines = (value || '').split('\n');
    
    inputLines.forEach((line, lineIndex) => {
      const lineNumber = lineIndex + 1;
      const exampleLine = exampleLines[lineIndex] || '';
      // 현재 줄의 각 문자를 비교
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const exampleChar = exampleLine[i];
        if (char === exampleChar) {
          // 일치하는 문자: 초록색
          newDecorations.push({
            range: new monaco.Range(lineNumber, i + 1, lineNumber, i + 2),
            options: {
              inlineClassName: 'code-correct-char',
            }
          });
        } else { 
          // 일치하지 않는 문자: 빨간색
          newDecorations.push({
            range: new monaco.Range(lineNumber, i + 1, lineNumber, i + 2),
            options: {
              inlineClassName: 'code-incorrect-char',
            }
          });
        }
      }
      
      // 예시보다 긴 부분은 빨간색으로 표시
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
    
    // 기존 장식 제거하고 새 장식 적용
    decorationsRef.current = editorRef.current.deltaDecorations(
      decorationsRef.current,
      newDecorations
    );
  };

  // 현재 라인 정확도 계산 함수
  const calculateCurrentLineAccuracy = (input) => {
    if (!input) return 100;
    
    const currentLineIndex = (input.match(/\n/g) || []).length;
    const exampleLines = exampleCode.split('\n');
    const inputLines = input.split('\n');
    
    // 현재 라인이 유효한지 확인
    if (currentLineIndex >= exampleLines.length) return 0;
    
    const currentExampleLine = exampleLines[currentLineIndex];
    const currentInputLine = inputLines[currentLineIndex] || '';
    
    let correctChars = 0;
    const lengthToCheck = Math.min(currentExampleLine.length, currentInputLine.length);
    
    // 현재까지 입력된 문자들만 비교
    for (let i = 0; i < currentInputLine.length; i++) {
      if (i < currentExampleLine.length && currentInputLine[i] === currentExampleLine[i]) {
        correctChars++;
      }
    }
    
    // 정확도 계산 (0으로 나누기 방지)
    return currentInputLine.length > 0 
      ? Math.round((correctChars / currentInputLine.length) * 100)
      : 100;
  };

  // 분당 타수(Keystrokes Per Minute) 계산
  const calculateKPM = useCallback(() => {
    if (elapsedTime === 0) return 0;
    // 초 단위를 분 단위로 변환 (elapsedTime / 60)으로 나누기
    return Math.round(keystrokes / (elapsedTime / 60));
  }, [keystrokes, elapsedTime]);

  // 타이머 시작
  const startTimer = useCallback(() => {
    if (isTyping) {
      const now = Date.now();
      setStartTime(prevStartTime => {
        const startTimeValue = prevStartTime || now;
        
        // Clear any existing timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        
        // Start new timer
        timerRef.current = setInterval(() => {
          setElapsedTime(prevElapsed => {
            const currentTime = Date.now();
            const elapsedSeconds = Math.floor((currentTime - startTimeValue) / 1000);
            return Math.max(0, elapsedSeconds);
          });
        }, 100);
        
        return startTimeValue;
      });
    }
  }, [isTyping]);

  // 타이머 정지
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Reset timer when component unmounts or when typing is complete
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  // Start timer when typing begins
  const startTypingTimer = useCallback(() => {
    if (timerRef.current) return; // Prevent multiple timers
    
    const now = Date.now();
    setStartTime(now);
    
    // Set up the timer interval
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
    
    // 값이 변경되었는지 확인
    if (value !== lastValueRef.current) {
      // 타이핑 시작 시 타이머 시작 (첫 글자 입력 시)
      if (!isTyping && value.length > 0) {
        setIsTyping(true);
        startTypingTimer();
      }
      
      // 키 입력 수 업데이트 (항상 증가)
      setKeystrokes(prev => prev + 1);
      
      // 현재 라인 정확도 계산
      const currentAccuracy = calculateCurrentLineAccuracy(value);
      setAccuracy(currentAccuracy);
      
      // 한글 입력 중이 아닐 때만 즉시 업데이트
      if (!isComposingRef.current) {
        updateDecorations(value);
        
        // 엔터 키를 눌렀을 때 라인 수가 예시 코드와 같으면 완료
        if (event && event.changes && event.changes.length > 0) {
          const changes = event.changes[0];
          if (changes.text.includes('\n')) {
            const currentLines = value.split('\n');
            const exampleLines = exampleCode.split('\n');
            
            // 현재 라인 수가 예시 코드의 라인 수와 같은 경우 (마지막 엔터로 인해 한 줄 더 생긴 경우 고려)
            if (currentLines.length - 1 >= exampleLines.length) {
              setIsTyping(false);
              stopTimer();
              
              // 전체 정확도 계산 (완료 시에만)
              let correctChars = 0;
              let totalChars = 0;
              const exampleLines = exampleCode.split('\n');
              const inputLines = value.split('\n');
              
              exampleLines.forEach((exampleLine, i) => {
                const inputLine = inputLines[i] || '';
                totalChars += exampleLine.length;
                for (let j = 0; j < Math.min(exampleLine.length, inputLine.length); j++) {
                  if (exampleLine[j] === inputLine[j]) {
                    correctChars++;
                  }
                }
              });
              
              const finalAccuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
              
              // 완료 통계 저장 및 모달 표시
              setCompletionStats({
                accuracy: finalAccuracy,
                typingSpeed: calculateKPM(),
                elapsedTime: elapsedTime
              });
              setShowCompletionModal(true);
              
              // 에디터 초기화
              setCode('');
              setKeystrokes(0);
              setAccuracy(100);
              setElapsedTime(0);
              setStartTime(null);
              lastValueRef.current = '';
              
              // 새 예제 코드 선택
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
      '    const response = await fetch(`https://api.example.com/users/${userId}`);',
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
  
  // 컴포넌트 마운트 시 랜덤 예제 선택
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * exampleCodes.length);
    const selectedExample = exampleCodes[randomIndex];
    setExampleCode(selectedExample);
    setExampleLines(selectedExample.split('\n'));
    
    // 에디터 초기화
    setCode('');
    setKeystrokes(0);
    setAccuracy(100);
    setElapsedTime(0);
    setStartTime(null);
  }, []);
  
  // 시간 포맷팅 (초를 MM:SS 형식으로 변환)
  const formatTime = (totalSeconds) => {
    if (totalSeconds < 0) return '00:00';
    
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRestart = () => {
    setShowCompletionModal(false);
    // 새 예제 코드 선택
    const randomIndex = Math.floor(Math.random() * exampleCodes.length);
    const selectedExample = exampleCodes[randomIndex];
    setExampleCode(selectedExample);
    setExampleLines(selectedExample.split('\n'));
  };

  const handleGoHome = () => {
    setShowCompletionModal(false);
    // 홈으로 이동하는 로직 (예: react-router의 navigate 사용)
    // navigate('/');
  };

  return (
    <div className="fullcode-container">
      <CompletionModal
        isOpen={showCompletionModal}
        accuracy={completionStats.accuracy}
        typingSpeed={completionStats.typingSpeed}
        elapsedTime={completionStats.elapsedTime}
        formatTime={formatTime}
        onRestart={handleRestart}
        onGoHome={handleGoHome}
      />
      <div className="stats-container">
        <div className="stat-box">
          <div className="stat-label">정확도</div>
          <div className="stat-value">{accuracy}%</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">소요 시간</div>
          <div className="stat-value">{formatTime(elapsedTime)}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">타수</div>
          <div className="stat-value">{calculateKPM()} <span className="stat-unit">타수</span></div>
        </div>
      </div>
      <div className="code-editors-container">
        <div className="code-display" style={{ position: 'relative' }}>
        <div className="code-header">예시 코드</div>
        <div className="monaco-editor-container">
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, cursor: 'not-allowed' }} />
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
              readOnlyMessage: { value: '이 코드는 예시용입니다.' },
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
        <div className="code-input">
        <div className="code-header">코드 입력</div>
        <div className="monaco-editor-container">
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