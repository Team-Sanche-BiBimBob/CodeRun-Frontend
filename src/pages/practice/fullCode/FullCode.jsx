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
  const { 
    language: languageId, 
    workbookId, 
    workbookTitle, 
    workbookProblems 
  } = location.state || {};
  
  const urlParams = new URLSearchParams(location.search);
  const urlLanguageId = urlParams.get('language');
  const finalLanguageId = languageId || (urlLanguageId ? parseInt(urlLanguageId) : null);
  
  // 언어 ID를 Monaco Editor 언어로 매핑
  const getMonacoLanguage = (langId) => {
    const languageMap = {
      1: 'python',
      2: 'java',
      3: 'c',
      4: 'cpp',
      5: 'javascript',
      6: 'typescript',
      7: 'go',
      8: 'rust'
    };
    return languageMap[langId] || 'javascript';
  };

  const [monacoLanguage, setMonacoLanguage] = useState(getMonacoLanguage(finalLanguageId));

  const fetchFullCodes = async () => {
    if (loading) return;
    
    setLoading(true);
    setLoadingMessage('서버에서 문제를 가져오고 있습니다...');
    setError(null);
    
    const fallbackCodes = [
      'const numbers = [1, 2, 3, 4, 5];\nconst result = numbers.filter(num => num % 2 === 0);\nconsole.log(result);',
      'function greet(name) {\n  return `Hello, ${name}!`;\n}\nconsole.log(greet("World"));',
      'const users = [\n  { name: "Alice", age: 25 },\n  { name: "Bob", age: 30 }\n];\nconst adults = users.filter(user => user.age >= 18);\nconsole.log(adults);',
      'class Calculator {\n  add(a, b) {\n    return a + b;\n  }\n  multiply(a, b) {\n    return a * b;\n  }\n}\n\nconst calc = new Calculator();\nconsole.log(calc.add(5, 3));',
      'const fetchData = async () => {\n  try {\n    const response = await fetch("/api/data");\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error("Error:", error);\n  }\n};',
      'const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\nconst evenSquares = numbers\n  .filter(num => num % 2 === 0)\n  .map(num => num * num);\nconsole.log(evenSquares);'
    ];

    // 문제집에서 전달받은 문제가 있으면 그것을 사용
    if (workbookProblems && workbookProblems.length > 0) {
      console.log('문제집 문제 사용:', workbookProblems);
      const randomIndex = Math.floor(Math.random() * workbookProblems.length);
      const selectedCode = workbookProblems[randomIndex];
      setExampleCode(selectedCode);
      setExampleLines(selectedCode.split('\n'));
      setMonacoLanguage(getMonacoLanguage(finalLanguageId));
      console.log('문제집에서 문제 로드 성공:', workbookProblems.length + '개 중 ' + (randomIndex + 1) + '번째 선택됨');
      setLoading(false);
      setLoadingMessage('');
      return;
    }

    try {
      console.log('풀코드 가져오기 시도 중...');

      const possibleUrls = [
        finalLanguageId ? `/api/problems/full-code/${finalLanguageId}` : '/api/problems/full-code'
      ];

      const apiUrl = possibleUrls[0];
      try {
        console.log(`시도 중: ${apiUrl}`);
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
          const randomIndex = Math.floor(Math.random() * codes.length);
          const selectedCode = codes[randomIndex];
          setExampleCode(selectedCode);
          setExampleLines(selectedCode.split('\n'));
          
          // 언어 설정 업데이트
          setMonacoLanguage(getMonacoLanguage(finalLanguageId));
          
          console.log('서버에서 풀코드 로드 성공:', codes.length + '개 중 ' + (randomIndex + 1) + '번째 랜덤 선택됨');
          setLoading(false);
          setLoadingMessage('');
          return;
        }
      } catch (err) {
        const errorMessage = err.message;
        if (err.name !== 'AbortError') {
          console.log(`${apiUrl} 실패:`, errorMessage);
        } else {
          console.log(`${apiUrl} 타임아웃 (2초), 폴백 데이터를 사용합니다.`);
        }
      }

      setLoadingMessage('기본 예제 코드를 준비하고 있습니다...');
      console.log('서버 API를 사용할 수 없어 기본 예제 코드를 사용합니다.');
      
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.log('API 호출 중 오류 발생, 폴백 데이터 사용:', err.message);
      }
    }

    setLoadingMessage('문제를 준비하고 있습니다...');
    const selectedCode = fallbackCodes[0];
    setExampleCode(selectedCode);
    setExampleLines(selectedCode.split('\n'));
    console.log('폴백 데이터 사용:', fallbackCodes.length + '개 중 첫 번째 선택됨');
    setLoading(false);
    setLoadingMessage('');
  };
  
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
      },
      autoIndent: "none",
      formatOnType: false,
      formatOnPaste: false
    });

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
    
    editor.onKeyDown((e) => {
      // 복사/붙여넣기 방지 (Ctrl+V, Cmd+V)
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyV') {
        e.preventDefault();
        e.stopPropagation();
      }
      
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

  const calculateOverallAccuracy = (input) => {
    if (!input) return 100;
    
    const inputLines = input.split('\n');
    const exampleLinesArray = exampleCode.split('\n');
    
    let correctChars = 0;
    let totalChars = 0;
    
    // 예시 코드 라인 수만큼만 계산
    const linesToCheck = Math.min(inputLines.length, exampleLinesArray.length);
    
    for (let lineIndex = 0; lineIndex < linesToCheck; lineIndex++) {
      const inputLine = inputLines[lineIndex] || '';
      const exampleLine = exampleLinesArray[lineIndex] || '';
      
      // 예시 라인의 길이를 totalChars에 추가
      totalChars += exampleLine.length;
      
      // 맞은 글자 수 카운트 - 예시 라인 길이만큼만 비교
      for (let i = 0; i < exampleLine.length; i++) {
        if (i < inputLine.length && inputLine[i] === exampleLine[i]) {
          correctChars++;
        }
      }
    }
    
    return totalChars > 0 
      ? Math.round((correctChars / totalChars) * 100)
      : 100;
  };

  const calculateWPM = () => {
    if (elapsedTime === 0) return 0;
    const totalChars = code.length;
    const timeInMinutes = elapsedTime / 60;
    // 5로 나누지 않고 직접 분당 글자수 계산
    return Math.round(totalChars / timeInMinutes);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

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
              
              // 마지막 엔터로 생긴 빈 줄 제거
              const inputLines = value.split('\n');
              // 마지막이 빈 문자열이면 제거
              if (inputLines[inputLines.length - 1] === '') {
                inputLines.pop();
              }
              
              exampleLinesArray.forEach((exampleLine, i) => {
                const inputLine = inputLines[i] || '';
                totalChars += exampleLine.length;
                
                for (let j = 0; j < exampleLine.length; j++) {
                  if (inputLine[j] === exampleLine[j]) {
                    correctChars++;
                  }
                }
              });
              
              const finalAccuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
              
              const finalElapsedTime = elapsedTime > 0 ? elapsedTime : 1;
              const timeInMinutes = finalElapsedTime / 60;
              const finalTypingSpeed = Math.round(value.length / timeInMinutes);
              
              setCompletionStats({
                accuracy: finalAccuracy,
                typingSpeed: finalTypingSpeed,
                elapsedTime: finalElapsedTime
              });
              setShowCompletionModal(true);
              
              setCode('');
              setKeystrokes(0);
              setAccuracy(100);
              setElapsedTime(0);
              setStartTime(null);
              lastValueRef.current = '';
              
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
  
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;
    
    fetchFullCodes();
    
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
  }, []);
  
  const formatTime = (totalSeconds) => {
    if (totalSeconds < 0) return '00:00';
    
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

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
    setShowCompletionModal(false);
    
    setCode('');
    setKeystrokes(0);
    setAccuracy(100);
    setElapsedTime(0);
    setStartTime(null);
    setIsTyping(false);
    lastValueRef.current = '';
    
    stopTimer();
    
    if (editorRef.current && decorationsRef.current) {
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
    }
    
    setLoading(false);
    setTimeout(() => {
      fetchFullCodes();
    }, 100);
  };

  const handleGoHome = () => {
    setShowCompletionModal(false);
    // URL 파라미터에서 language가 있으면 타임어택에서 온 것으로 간주
    if (urlLanguageId) {
      // 완료 시간을 타임어택으로 전달
      const completionTime = formatTime(completionStats.elapsedTime);
      const roomId = urlParams.get('roomId');
      const accuracy = completionStats.accuracy;
      
      console.log('풀코드 연습 완료:', { completionTime, roomId, urlLanguageId, accuracy });
      
      // 정확도가 100%일 때만 기록 저장
      if (accuracy === 100) {
        // roomId가 없어도 언어 ID로 문제 ID 계산
        const languageId = parseInt(urlLanguageId);
        let problemId = null;
        
        // 언어 ID와 난이도로 문제 ID 계산
        if (languageId === 1) { // Python
          problemId = 2; // Python 풀코드 연습
        } else if (languageId === 2) { // Java
          problemId = 5; // Java 풀코드 연습
        } else if (languageId === 5) { // JavaScript
          problemId = 8; // JavaScript 풀코드 연습
        }
        
        if (problemId) {
          // 기존 기록과 비교하여 더 좋은 기록일 때만 업데이트
          const existingTime = sessionStorage.getItem(`problem_${problemId}_completion`);
          
          if (!existingTime) {
            // 기존 기록이 없으면 저장
            sessionStorage.setItem(`problem_${problemId}_completion`, completionTime);
            console.log('완료 시간 sessionStorage 저장 (정확도 100%):', { problemId, completionTime, languageId, accuracy });
          } else {
            // 기존 기록이 있으면 시간 비교 (더 빠른 시간으로 업데이트)
            const existingSeconds = timeToSeconds(existingTime);
            const currentSeconds = timeToSeconds(completionTime);
            
            if (currentSeconds < existingSeconds) {
              sessionStorage.setItem(`problem_${problemId}_completion`, completionTime);
              console.log('더 좋은 기록으로 업데이트 (정확도 100%):', { problemId, oldTime: existingTime, newTime: completionTime, accuracy });
            } else {
              console.log('기존 기록이 더 좋음 (정확도 100%):', { problemId, existingTime, currentTime: completionTime, accuracy });
            }
          }
        }
      } else {
        console.log('정확도가 100%가 아니어서 기록 저장하지 않음:', { accuracy });
      }
      
      if (roomId) {
        // 방 완료 시간 업데이트 API 호출
        updateRoomCompletionTime(roomId, completionTime);
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
          accuracy: completionStats.accuracy,
          typingSpeed: completionStats.typingSpeed,
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
      
      {showCompletionModal && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-0" />
      )}
      
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
      
      <div className={`grid grid-cols-2 gap-8 flex-1 min-h-0 ${showCompletionModal ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex flex-col bg-[#1E1E1E] rounded-md overflow-hidden shadow-lg h-full">
          <div className="bg-[#1E1E1E] text-gray-200 px-4 py-2 text-sm border-b border-[#282828] font-semibold">
            예시 코드
          </div>
          <div className="flex-1 overflow-hidden relative h-[70vh] min-h-[300px] border border-[#282828] rounded bg-[#1E1E1E]">
            <Editor
              height="100%"
              language={monacoLanguage}
              value={exampleCode}
              options={{
                readOnly: true,
                lineNumbers: 'on',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 12,
                wordWrap: 'on',
                automaticLayout: true,
                renderWhitespace: 'all',
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
        
        <div className="flex flex-col bg-[#1E1E1E] rounded-md overflow-hidden shadow-lg h-full">
          <div className="bg-[#1E1E1E] text-gray-200 px-4 py-2 text-sm border-b border-[#282828] font-semibold">
            코드 입력
          </div>
          <div className="flex-1 overflow-hidden relative h-[70vh] min-h-[300px] border border-[#282828] rounded bg-[#1E1E1E]">
            <Editor
              height="100%"
              language={monacoLanguage}
              value={code}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={{
                autoIndent: "full",
                formatOnType: true,
                formatOnPaste: true,
                bracketPairColorization: { enabled: true },
                automaticLayout: true,
                fontSize: 12,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                renderWhitespace: 'all',
                tabSize: 2,
                insertSpaces: false,
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