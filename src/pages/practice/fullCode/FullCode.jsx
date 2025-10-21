import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);
  const editorRef = useRef(null);
  const decorationsRef = useRef([]);
  const isComposingRef = useRef(false);
  const lastValueRef = useRef('');
  const timerRef = useRef(null);
  const isInitializedRef = useRef(false);

  const location = useLocation();
  const { language: languageId } = location.state || {}; // languageId를 가져옴
  
  // URL 파라미터에서 언어 ID 가져오기 (타임어택에서 전달된 경우)
  const urlParams = new URLSearchParams(location.search);
  const urlLanguageId = urlParams.get('language');
  const finalLanguageId = languageId || (urlLanguageId ? parseInt(urlLanguageId) : null);
  
  // console.log("Received languageId:", finalLanguageId);

  // 풀코드 데이터 가져오기 (서버 API 시도 후 폴백)
  const fetchFullCodes = async () => {
    // 이미 로딩 중이면 중복 호출 방지
    if (loading) return;
    
    setLoading(true);
    setLoadingMessage('서버에서 문제를 가져오고 있습니다...');
    setError(null);
    
    // 폴백 데이터 (서버 API가 준비되지 않은 경우 사용)
    const fallbackCodes = [
      'const numbers = [1, 2, 3, 4, 5];\nconst result = numbers.filter(num => num % 2 === 0);\nconsole.log(result);',
      'function greet(name) {\n  return `Hello, ${name}!`;\n}\nconsole.log(greet("World"));',
      'const users = [\n  { name: "Alice", age: 25 },\n  { name: "Bob", age: 30 }\n];\nconst adults = users.filter(user => user.age >= 18);\nconsole.log(adults);',
      'class Calculator {\n  add(a, b) {\n    return a + b;\n  }\n  multiply(a, b) {\n    return a * b;\n  }\n}\n\nconst calc = new Calculator();\nconsole.log(calc.add(5, 3));',
      'const fetchData = async () => {\n  try {\n    const response = await fetch("/api/data");\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error("Error:", error);\n  }\n};',
      'const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\nconst evenSquares = numbers\n  .filter(num => num % 2 === 0)\n  .map(num => num * num);\nconsole.log(evenSquares);'
    ];

    try {
      console.log('풀코드 가져오기 시도 중...');

      const possibleUrls = [
        finalLanguageId ? `/api/problems/full-code/${finalLanguageId}` : '/api/problems/full-code'
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
          signal: AbortSignal.timeout(2000),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log(`${apiUrl} 성공! 받은 데이터:`, data);

        let codes = data.codes || data.fullcodes || data || [];

        if (Array.isArray(codes) && typeof codes[0] === 'object') {
          codes = codes.map((c) => c.content || c.code || c.title || '');
        }

        if (Array.isArray(codes) && codes.length > 0) {
          // 5개 중 랜덤으로 선택
          const randomIndex = Math.floor(Math.random() * codes.length);
          const selectedCode = codes[randomIndex];
          setExampleCode(selectedCode);
          setExampleLines(selectedCode.split('\n'));
          console.log('서버에서 풀코드 로드 성공:', codes.length + '개 중 ' + (randomIndex + 1) + '번째 랜덤 선택됨');
          setLoading(false);
          setLoadingMessage('');
          return;
        }
      } catch (err) {
        const errorMessage = err.message;
        // AbortError (타임아웃)은 정상적인 동작이므로 에러 로그를 표시하지 않음
        if (err.name !== 'AbortError') {
          console.log(`${apiUrl} 실패:`, errorMessage);
        } else {
          console.log(`${apiUrl} 타임아웃 (2초), 폴백 데이터를 사용합니다.`);
        }
      }

      // API 시도 실패 시 폴백 데이터 사용
      setLoadingMessage('기본 예제 코드를 준비하고 있습니다...');
      console.log('서버 API를 사용할 수 없어 기본 예제 코드를 사용합니다.');
      
    } catch (err) {
      // AbortError (타임아웃)은 정상적인 동작이므로 에러 로그를 표시하지 않음
      if (err.name !== 'AbortError') {
        console.log('API 호출 중 오류 발생, 폴백 데이터 사용:', err.message);
      }
    }

    // 폴백 데이터 사용 (첫 번째 코드 선택)
    setLoadingMessage('문제를 준비하고 있습니다...');
    const selectedCode = fallbackCodes[0];
    setExampleCode(selectedCode);
    setExampleLines(selectedCode.split('\n'));
    console.log('폴백 데이터 사용:', fallbackCodes.length + '개 중 첫 번째 선택됨');
    setLoading(false);
    setLoadingMessage('');
  };
  
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
  const calculateWPM = () => {
    if (elapsedTime === 0) return 0;
    const totalChars = code.length;
    const timeInMinutes = elapsedTime / 60;
    return Math.round((totalChars / 5) / timeInMinutes);
  };

  // 타이머 정지
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Start timer when typing begins
  const startTypingTimer = () => {
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
  };

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
              
              // 새로운 풀코드 가져오기
              fetchFullCodes();
              return;
            }
          }
        }
      }
      
      lastValueRef.current = value;
      setCode(value);
    }
  };
  
  // 컴포넌트 마운트 시 서버에서 풀코드 데이터 가져오기
  useEffect(() => {
    // 중복 호출 방지
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;
    
    fetchFullCodes();
    
    setCode('');
    setKeystrokes(0);
    setAccuracy(100);
    setElapsedTime(0);
    setStartTime(null);
  }, []); // fetchFullCodes 의존성 제거

  useEffect(() => {
    return () => {
      stopTimer();
    };
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
    
    // 로딩 상태 초기화 후 새로운 풀코드 가져오기
    setLoading(false);
    setTimeout(() => {
      fetchFullCodes();
    }, 100);
  };

  const handleGoHome = () => {
    setShowCompletionModal(false);
    navigate('/');
  };

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="mb-4 text-xl font-semibold text-gray-700">
            {loadingMessage || '풀코드를 불러오는 중...'}
          </div>
          <div className="w-12 h-12 mx-auto border-b-2 border-teal-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }


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
        <div className="fixed inset-0 z-40 bg-black bg-opacity-0" />
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
      <div className={`grid grid-cols-2 gap-8 flex-1 min-h-0 ${showCompletionModal ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Example Code Display */}
        <div className="flex flex-col bg-[#1E1E1E] rounded-md overflow-hidden shadow-lg h-full">
          <div className="bg-[#1E1E1E] text-gray-200 px-4 py-2 text-sm border-b border-[#282828] font-semibold">
            예시 코드
          </div>
          <div className="flex-1 overflow-hidden relative h-[70vh] min-h-[300px] border border-[#282828] rounded bg-[#1E1E1E]">
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
                  vertical: 'auto',
                  horizontal: 'auto',
                  useShadows: true,
                  verticalHasArrows: false,
                  horizontalHasArrows: false,
                  verticalScrollbarSize: 12,
                  horizontalScrollbarSize: 12,
                },
                // 스크롤을 허용하되 편집은 막기
                selectOnLineNumbers: false,
                selectionClipboard: false,
                find: {
                  addExtraSpaceOnTop: false,
                  autoFindInSelection: 'never',
                  seedSearchStringFromSelection: 'never'
                }
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
                scrollbar: {
                  vertical: 'auto',
                  horizontal: 'auto',
                  useShadows: true,
                  verticalHasArrows: false,
                  horizontalHasArrows: false,
                  verticalScrollbarSize: 12,
                  horizontalScrollbarSize: 12,
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fullcode;