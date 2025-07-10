import React, { useState, useEffect, useCallback, useRef } from 'react';
import StatusBar from './StatusBar'; // StatusBar 컴포넌트 import

const KoreanKeyboard = () => {
  // 진행 시간(초)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [typedCharacters, setTypedCharacters] = useState(0);
  const [correctCharacters, setCorrectCharacters] = useState(0);
  const [highlightedKey, setHighlightedKey] = useState(null);
  const [targetText, setTargetText] = useState(
    "The quick brown fox jumps over the lazy dog. This is a typing practice sentence."
  );
  const [typedTextIndex, setTypedTextIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const startTimeRef = useRef(null);

  // 타자 연습 시작 시점 저장
  useEffect(() => {
    if (isStarted) {
      startTimeRef.current = Date.now();
    }
  }, [isStarted]);

  // 진행 시간 1초마다 업데이트
  useEffect(() => {
    if (!isStarted) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTimeRef.current) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted]);

  // 타이핑 속도 실시간 계산 (WPM)
  useEffect(() => {
    if (isStarted && startTimeRef.current) {
      const elapsedMinutes = elapsedSeconds / 60;
      if (elapsedMinutes > 0) {
        const wpm = Math.round(correctCharacters / elapsedMinutes);
        setTypingSpeed(wpm);
      }
    } else {
      setTypingSpeed(0);
    }
  }, [correctCharacters, elapsedSeconds, isStarted]);

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
        if (pressedKey === '1') return '!';
        if (pressedKey === '2') return '@';
        if (pressedKey === '3') return '#';
        if (pressedKey === '4') return '$';
        if (pressedKey === '5') return '%';
        if (pressedKey === '6') return '^';
        if (pressedKey === '7') return '&';
        if (pressedKey === '8') return '*';
        if (pressedKey === '9') return '(';
        if (pressedKey === '0') return ')';
        if (pressedKey === '-') return '_';
        if (pressedKey === '=') return '+';
        if (pressedKey === '[') return '{';
        if (pressedKey === ']') return '}';
        if (pressedKey === '\\') return '|';
        if (pressedKey === ';') return ':';
        if (pressedKey === "'") return '"';
        if (pressedKey === ',') return '<';
        if (pressedKey === '.') return '>';
        if (pressedKey === '/') return '?';
        return pressedKey.toUpperCase();
      }
      return pressedKey.toLowerCase();
    }
    return pressedKey;
  }, []);

  // 다음 입력해야 할 키를 하이라이트하기 위한 함수
  const getExpectedKeyCode = useCallback(() => {
    if (typedTextIndex >= targetText.length) return null;

    const char = targetText[typedTextIndex];

    for (const row of keyboardLayout) {
      for (const key of row) {
        if (key.main && key.main.toLowerCase() === char.toLowerCase()) {
          return key.code;
        }
        if (key.shift && key.shift === char) {
          return key.code;
        }
        if (char === ' ' && key.code === 'Space') {
          return 'Space';
        }
        if (char === '\n' && key.code === 'Enter') {
          return 'Enter';
        }
      }
    }
    return null;
  }, [targetText, typedTextIndex]);

  // 타겟 문자 변경 시 하이라이트 갱신
  useEffect(() => {
    const initialHighlightCode = getExpectedKeyCode();
    setHighlightedKey(initialHighlightCode);
  }, [targetText, typedTextIndex, getExpectedKeyCode]);

  // 키 입력 처리
  const handleKeyDown = useCallback((event) => {
    const pressedKey = event.key;
    const pressedKeyCode = event.code;
    const isShiftPressed = event.shiftKey;

    // 엔터키 눌렀을 때 단어 완성 전이면 넘어가지 않도록 막기
    if (pressedKeyCode === 'Enter' && typedTextIndex < targetText.length) {
      event.preventDefault();
      return;
    }

    // 스페이스바 등 기본 스크롤 방지
    if (
      pressedKey === ' ' ||
      pressedKeyCode === 'Space' ||
      ['Tab', 'Shift', 'Control', 'Alt', 'CapsLock'].includes(pressedKey)
    ) {
      event.preventDefault();
    }

    setHighlightedKey(pressedKeyCode);

    if (!isStarted) {
      setIsStarted(true);
      startTimeRef.current = Date.now();
    }

    if (typedTextIndex < targetText.length) {
      if (['Shift', 'Control', 'Alt', 'Tab', 'CapsLock'].includes(pressedKey)) {
        return;
      }

      let isCorrectInput = false;
      const expectedChar = targetText[typedTextIndex];
      let charForComparison = null;

      if (pressedKeyCode === 'Space') {
        charForComparison = ' ';
      } else if (pressedKeyCode === 'Backspace') {
        if (typedTextIndex > 0) {
          setTypedTextIndex((prev) => prev - 1);
          setTypedCharacters((prev) => Math.max(0, prev - 1));
        }
        return;
      } else if (pressedKeyCode === 'Enter') {
        charForComparison = '\n';
      } else {
        charForComparison = getOutputChar(pressedKey, isShiftPressed);
      }

      if (charForComparison === expectedChar) {
        setCorrectCharacters((prev) => prev + 1);
        setTypedTextIndex((prev) => prev + 1);
        isCorrectInput = true;
      } else {
        isCorrectInput = false;
      }

      setTypedCharacters((prev) => prev + 1);
    }

    // 마지막 문자 맞게 입력 시 자동 완료 처리
    if (typedTextIndex >= targetText.length - 1 && targetText.length > 0) {
      const lastExpectedChar = targetText[targetText.length - 1];
      const lastTypedChar = getOutputChar(pressedKey, isShiftPressed);
      const lastTypedCode = pressedKeyCode;

      if (
        lastExpectedChar === lastTypedChar ||
        (lastExpectedChar === ' ' && lastTypedCode === 'Space') ||
        (lastExpectedChar === '\n' && lastTypedCode === 'Enter')
      ) {
        alert('타자 연습 완료!');
        setTypedTextIndex(0);
        setTypedCharacters(0);
        setCorrectCharacters(0);
        setAccuracy(100);
        setTypingSpeed(0);
        setElapsedSeconds(0);
        setIsStarted(false);
      }
    }
  }, [typedTextIndex, targetText, getOutputChar, isStarted]);

  const handleKeyUp = useCallback(() => {
    setHighlightedKey(null);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // 키보드 배열
  const keyboardLayout = [
    [
      { main: '`', shift: '~', code: 'Backquote', span: 4 },
      { main: '1', shift: '!', code: 'Digit1', span: 4 },
      { main: '2', shift: '@', code: 'Digit2', span: 4 },
      { main: '3', shift: '#', code: 'Digit3', span: 4 },
      { main: '4', shift: '$', code: 'Digit4', span: 4 },
      { main: '5', shift: '%', code: 'Digit5', span: 4 },
      { main: '6', shift: '^', code: 'Digit6', span: 4 },
      { main: '7', shift: '&', code: 'Digit7', span: 4 },
      { main: '8', shift: '*', code: 'Digit8', span: 4 },
      { main: '9', shift: '(', code: 'Digit9', span: 4 },
      { main: '0', shift: ')', code: 'Digit0', span: 4 },
      { main: '-', shift: '_', code: 'Minus', span: 4 },
      { main: '=', shift: '+', code: 'Equal', span: 4 },
      { main: 'Backspace', span: 8, isFunctional: true, code: 'Backspace' }
    ],
    [
      { main: 'Tab', span: 6, isFunctional: true, code: 'Tab' },
      { main: 'Q', code: 'KeyQ', span: 4 },
      { main: 'W', code: 'KeyW', span: 4 },
      { main: 'E', code: 'KeyE', span: 4 },
      { main: 'R', code: 'KeyR', span: 4 },
      { main: 'T', code: 'KeyT', span: 4 },
      { main: 'Y', code: 'KeyY', span: 4 },
      { main: 'U', code: 'KeyU', span: 4 },
      { main: 'I', code: 'KeyI', span: 4 },
      { main: 'O', code: 'KeyO', span: 4 },
      { main: 'P', code: 'KeyP', span: 4 },
      { main: '[', shift: '{', code: 'BracketLeft', span: 4 },
      { main: ']', shift: '}', code: 'BracketRight', span: 4 },
      { main: '\\', shift: '|', code: 'Backslash', span: 6 }
    ],
    [
      { main: 'Caps Lock', span: 7, isFunctional: true, code: 'CapsLock' },
      { main: 'A', code: 'KeyA', span: 4 },
      { main: 'S', code: 'KeyS', span: 4 },
      { main: 'D', code: 'KeyD', span: 4 },
      { main: 'F', code: 'KeyF', span: 4 },
      { main: 'G', code: 'KeyG', span: 4 },
      { main: 'H', code: 'KeyH', span: 4 },
      { main: 'J', code: 'KeyJ', span: 4 },
      { main: 'K', code: 'KeyK', span: 4 },
      { main: 'L', code: 'KeyL', span: 4 },
      { main: ';', shift: ':', code: 'Semicolon', span: 4 },
      { main: "'", shift: '"', code: 'Quote', span: 4 },
      { main: 'Enter', span: 9, isFunctional: true, code: 'Enter' }
    ],
    [
      { main: 'Shift', span: 9, isFunctional: true, code: 'ShiftLeft' },
      { main: 'Z', code: 'KeyZ', span: 4 },
      { main: 'X', code: 'KeyX', span: 4 },
      { main: 'C', code: 'KeyC', span: 4 },
      { main: 'V', code: 'KeyV', span: 4 },
      { main: 'B', code: 'KeyB', span: 4 },
      { main: 'N', code: 'KeyN', span: 4 },
      { main: 'M', code: 'KeyM', span: 4 },
      { main: ',', shift: '<', code: 'Comma', span: 4 },
      { main: '.', shift: '>', code: 'Period', span: 4 },
      { main: '/', shift: '?', code: 'Slash', span: 4 },
      { main: 'Shift', span: 11, isFunctional: true, code: 'ShiftRight' }
    ],
    [
      { main: 'Ctrl', span: 5, isFunctional: true, code: 'ControlLeft' },
      { main: 'Alt', span: 5, isFunctional: true, code: 'AltLeft' },
      { main: '', span: 26, isFunctional: true, code: 'Space' },
      { main: 'Alt', span: 5, isFunctional: true, code: 'AltRight' },
      { main: 'Ctrl', span: 5, isFunctional: true, code: 'ControlRight' }
    ]
  ];

  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-100 rounded-xl shadow-lg overflow-hidden relative">
      <StatusBar
        typingSpeed={typingSpeed}
        accuracy={accuracy}
        currentTime={elapsedSeconds} // 진행 시간(초) 전달
      />
      {/* Keyboard */}
      <div className="p-8 bg-gray-100">
        <div
          className="keyboard grid gap-x-3 gap-y-2"
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
