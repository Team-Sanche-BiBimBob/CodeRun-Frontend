import React, { useState, useEffect, useCallback, useRef } from 'react';
import StatusBar from './StatusBar'; // StatusBar 컴포넌트 import

const KoreanKeyboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [typingSpeed, setTypingSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [typedCharacters, setTypedCharacters] = useState(0);
  const [correctCharacters, setCorrectCharacters] = useState(0);
  const [highlightedKey, setHighlightedKey] = useState(null);
  const [targetText, setTargetText] = useState("The quick brown fox jumps over the lazy dog. This is a typing practice sentence.");
  const [typedTextIndex, setTypedTextIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [userInput, setUserInput] = useState(""); // 사용자 입력 추적

  const startTimeRef = useRef(null);

  // 실시간 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // 타이핑 속도 실시간 계산
  useEffect(() => {
    if (isStarted && startTimeRef.current) {
      const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
      if (elapsedMinutes > 0) {
        const wpm = Math.round(correctCharacters / elapsedMinutes);
        setTypingSpeed(wpm);
      }
    }
  }, [correctCharacters, isStarted]);

  // 정확도 실시간 계산
  useEffect(() => {
    if (typedCharacters > 0) {
      const accuracyPercent = Math.round((correctCharacters / typedCharacters) * 100);
      setAccuracy(accuracyPercent);
    } else {
      setAccuracy(100);
    }
  }, [correctCharacters, typedCharacters]);

  // 입력된 키에 해당하는 문자 반환 (Shift 조합 포함)
  const getOutputChar = useCallback((pressedKey, isShifted) => {
    if (pressedKey.length === 1) {
        if (isShifted) {
            // Shift + 숫자/특수문자 매핑 (이미지 참고)
            if (pressedKey === '1') return '!'; if (pressedKey === '2') return '@';
            if (pressedKey === '3') return '#'; if (pressedKey === '4') return '$';
            if (pressedKey === '5') return '%'; if (pressedKey === '6') return '^';
            if (pressedKey === '7') return '&'; if (pressedKey === '8') return '*';
            if (pressedKey === '9') return '('; if (pressedKey === '0') return ')';
            if (pressedKey === '-') return '_'; if (pressedKey === '=') return '+';
            if (pressedKey === '[') return '{'; if (pressedKey === ']') return '}';
            if (pressedKey === '\\') return '|';
            if (pressedKey === ';') return ':'; if (pressedKey === "'") return '"';
            if (pressedKey === ',') return '<'; if (pressedKey === '.') return '>';
            if (pressedKey === '/') return '?';
            // 영문자는 Shift 시 대문자
            return pressedKey.toUpperCase();
        }
        // Shift 안 눌렀을 때 소문자 또는 기본 특수문자
        return pressedKey.toLowerCase();
    }
    return pressedKey; // 기능 키 등은 그대로 반환
  }, []);

  // 다음 입력해야 할 키를 하이라이트하기 위한 함수
  const getExpectedKeyCode = useCallback(() => {
    if (typedTextIndex >= targetText.length) return null;

    const char = targetText[typedTextIndex];

    for (const row of keyboardLayout) {
      for (const key of row) {
        // 기본 문자 또는 Shift 조합 문자가 타겟 문자와 일치하는지 확인
        if (key.main && key.main.toLowerCase() === char.toLowerCase()) {
            return key.code;
        }
        if (key.shift && key.shift === char) {
            return key.code;
        }
        // 공백 처리
        if (char === ' ' && key.code === 'Space') {
            return 'Space';
        }
        // Enter 키 처리 (줄바꿈 문자에 매핑)
        if (char === '\n' && key.code === 'Enter') {
            return 'Enter';
        }
      }
    }
    return null;
  }, [targetText, typedTextIndex]);

  // 페이지 로드 시 또는 targetText/typedTextIndex 변경 시 다음 키 하이라이트
  useEffect(() => {
    const initialHighlightCode = getExpectedKeyCode();
    setHighlightedKey(initialHighlightCode);
  }, [targetText, typedTextIndex, getExpectedKeyCode]);

  const handleKeyDown = useCallback((event) => {
    // 스페이스바 누를 때 스크롤 방지 및 기능 키 기본 동작 방지
    if (event.key === ' ' || event.code === 'Space' ||
        ['Tab', 'Enter', 'Shift', 'Control', 'Alt', 'CapsLock'].includes(event.key)) {
      event.preventDefault();
    }

    const pressedKey = event.key;
    const pressedKeyCode = event.code;
    const isShiftPressed = event.shiftKey;

    // --- 키보드 하이라이트 로직 ---
    setHighlightedKey(pressedKeyCode);

    // --- 타자 정확도 및 타수 계산 로직 ---
    if (typedTextIndex < targetText.length) {
      // 기능 키는 입력 문자 수에 포함하지 않음 (Backspace는 별도 처리)
      if (['Shift', 'Control', 'Alt', 'Tab', 'CapsLock'].includes(pressedKey)) {
          return;
      }

      let isCorrectInput = false;
      let expectedChar = targetText[typedTextIndex];
      let charForComparison = null;

      if (pressedKeyCode === 'Space') {
          charForComparison = ' ';
      } else if (pressedKeyCode === 'Enter') {
          charForComparison = '\n';
      } else if (pressedKeyCode === 'Backspace') {
          if (typedTextIndex > 0) {
              setTypedTextIndex(prev => prev - 1);
              setTypedCharacters(prev => Math.max(0, prev - 1));
              if (typedCharacters > 1) {
                 setAccuracy(Math.round(correctCharacters / (typedCharacters - 1) * 100));
              } else {
                 setAccuracy(100);
              }
          }
          return;
      } else {
          charForComparison = getOutputChar(pressedKey, isShiftPressed);
      }

      if (charForComparison === expectedChar) {
        setCorrectCharacters(prev => prev + 1);
        setTypedTextIndex(prev => prev + 1);
        isCorrectInput = true;
      } else {
        isCorrectInput = false;
      }

      setTypedCharacters(prev => prev + 1);

      if (typedCharacters + 1 > 0) {
          setAccuracy(Math.round((correctCharacters + (isCorrectInput ? 1 : 0)) / (typedCharacters + 1) * 100));
      }
    }

    // 모든 텍스트를 입력했으면 초기화
    if (typedTextIndex >= targetText.length -1 && targetText.length > 0) {
        const lastExpectedChar = targetText[targetText.length - 1];
        const lastTypedChar = getOutputChar(pressedKey, isShiftPressed);
        const lastTypedCode = pressedKeyCode;

        if ((lastExpectedChar === lastTypedChar) ||
            (lastExpectedChar === ' ' && lastTypedCode === 'Space') ||
            (lastExpectedChar === '\n' && lastTypedCode === 'Enter')) {
                alert("타자 연습 완료!");
                setTypedTextIndex(0);
                setTypedCharacters(0);
                setCorrectCharacters(0);
                setAccuracy(100);
                setTypingSpeed(0);
                startTimeRef.current = Date.now();
        }
    }
  }, [typedCharacters, correctCharacters, targetText, typedTextIndex, getOutputChar]);

  // 키를 떼었을 때 하이라이트 해제
  const handleKeyUp = useCallback((event) => {
    setHighlightedKey(null);
  }, []);

  // 이벤트 리스너 등록 및 해제
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Keyboard Layout (Modified to match Group 45.png, no HANGUL)
  // span 값은 60분할 그리드에 맞춰 4를 곱한 값입니다. (1fr = 4 units)
  const keyboardLayout = [
    [
      { main: '`', shift: '~', code: 'Backquote', span: 4 }, // ✅ 렌더링 포함됨
      { main: '1', shift: '!', code: 'Digit1', span: 4 }, { main: '2', shift: '@', code: 'Digit2', span: 4 },
      { main: '3', shift: '#', code: 'Digit3', span: 4 }, { main: '4', shift: '$', code: 'Digit4', span: 4 },
      { main: '5', shift: '%', code: 'Digit5', span: 4 }, { main: '6', shift: '^', code: 'Digit6', span: 4 },
      { main: '7', shift: '&', code: 'Digit7', span: 4 }, { main: '8', shift: '*', code: 'Digit8', span: 4 },
      { main: '9', shift: '(', code: 'Digit9', span: 4 }, { main: '0', shift: ')', code: 'Digit0', span: 4 },
      { main: '-', shift: '_', code: 'Minus', span: 4 }, { main: '=', shift: '+', code: 'Equal', span: 4 },
      { main: 'Backspace', span: 8, isFunctional: true, code: 'Backspace' }
    ],
    [
      { main: 'Tab', span: 6, isFunctional: true, code: 'Tab' }, // 1.5 * 4 = 6
      { main: 'Q', code: 'KeyQ', span: 4 }, { main: 'W', code: 'KeyW', span: 4 }, { main: 'E', code: 'KeyE', span: 4 },
      { main: 'R', code: 'KeyR', span: 4 }, { main: 'T', code: 'KeyT', span: 4 }, { main: 'Y', code: 'KeyY', span: 4 },
      { main: 'U', code: 'KeyU', span: 4 }, { main: 'I', code: 'KeyI', span: 4 }, { main: 'O', code: 'KeyO', span: 4 },
      { main: 'P', code: 'KeyP', span: 4 },
      { main: '[', shift: '{', code: 'BracketLeft', span: 4 }, { main: ']', shift: '}', code: 'BracketRight', span: 4 }, { main: '\\', shift: '|', code: 'Backslash', span: 6 } // 1.5 * 4 = 6
    ],
    [
      { main: 'Caps Lock', span: 7, isFunctional: true, code: 'CapsLock' }, // 1.75 * 4 = 7
      { main: 'A', code: 'KeyA', span: 4 }, { main: 'S', code: 'KeyS', span: 4 }, { main: 'D', code: 'KeyD', span: 4 },
      { main: 'F', code: 'KeyF', span: 4 }, { main: 'G', code: 'KeyG', span: 4 }, { main: 'H', code: 'KeyH', span: 4 },
      { main: 'J', code: 'KeyJ', span: 4 }, { main: 'K', code: 'KeyK', span: 4 }, { main: 'L', code: 'KeyL', span: 4 },
      { main: ';', shift: ':', code: 'Semicolon', span: 4 }, { main: "'", shift: '"', code: 'Quote', span: 4 },
      { main: 'Enter', span: 9, isFunctional: true, code: 'Enter' } // 2.25 * 4 = 9
    ],
    [
      { main: 'Shift', span: 9, isFunctional: true, code: 'ShiftLeft' }, // 2.25 * 4 = 9
      { main: 'Z', code: 'KeyZ', span: 4 }, { main: 'X', code: 'KeyX', span: 4 }, { main: 'C', code: 'KeyC', span: 4 },
      { main: 'V', code: 'KeyV', span: 4 }, { main: 'B', code: 'KeyB', span: 4 }, { main: 'N', code: 'KeyN', span: 4 },
      { main: 'M', code: 'KeyM', span: 4 },
      { main: ',', shift: '<', code: 'Comma', span: 4 }, { main: '.', shift: '>', code: 'Period', span: 4 },
      { main: '/', shift: '?', code: 'Slash', span: 4 },
      { main: 'Shift', span: 11, isFunctional: true, code: 'ShiftRight' } // 2.75 * 4 = 11
    ],
    [
      { main: 'Ctrl', span: 5, isFunctional: true, code: 'ControlLeft' }, // 1.25 * 4 = 5
      { main: 'Alt', span: 5, isFunctional: true, code: 'AltLeft' },    // 1.25 * 4 = 5
      { main: '', span: 26, isFunctional: true, code: 'Space' }, // 6.5 * 4 = 26
      { main: 'Alt', span: 5, isFunctional: true, code: 'AltRight' },
      { main: 'Ctrl', span: 5, isFunctional: true, code: 'ControlRight' }
    ]
  ];

  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-100 rounded-xl shadow-lg overflow-hidden relative">
      <StatusBar
        typingSpeed={typingSpeed}
        accuracy={accuracy}
        currentTime={currentTime}
      />
      {/* Keyboard */}
      <div className="p-8 bg-gray-100">
        <div
          className="keyboard grid gap-x-3 gap-y-2" // 수정된 간격
          style={{
            gridTemplateColumns: 'repeat(60, 1fr)',
          }}
        >
          {keyboardLayout.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((key, keyIndex) => (
                <div
                  key={`${rowIndex}-${keyIndex}`}
                  className={`key bg-white border border-gray-300 rounded-lg shadow-sm
                              hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150
                              flex flex-col items-center justify-center text-sm font-medium text-gray-700 h-12
                              ${key.isFunctional ? 'text-xs' : ''}
                              ${key.code === highlightedKey ? 'highlighted-key' : ''}
                            `}
                  style={{
                    gridColumn: `span ${key.span}`,
                  }}
                >
                  <div className="flex flex-col items-center">
                    {key.shift && <span className="text-xs text-gray-400">{key.shift}</span>}
                    <span className="text-sm">{key.main}</span>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <style jsx>{`
        .highlighted-key {
          background-color: #fca5a5;
          border-color: #ef4444;
          box-shadow: 0 0 0 3px #f87171;
        }
      `}</style>
    </div>
  );
};

export default KoreanKeyboard;
