import React, { useState, useEffect, useCallback, useRef } from 'react';

// props를 올바르게 받도록 수정
const SimpleKeyboard = ({ nextCharInfo }) => {
  const [nextKey, setNextKey] = useState(null); // 다음에 누를 키 (빨간색)
  const [pressedKey, setPressedKey] = useState(null); // 현재 누르고 있는 키 (회색)
  const [focusedElement, setFocusedElement] = useState(null);
  
  // 포커스된 텍스트 입력 요소 추적
  useEffect(() => {
    const handleFocus = (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        setFocusedElement(event.target);
      }
    };
    
    const handleBlur = () => {
      setFocusedElement(null);
      setNextKey(null);
    };
    
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);
    
    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, []);
  
  // nextCharInfo에서 다음 키 코드를 계산하는 함수
  const getKeyCodeFromChar = useCallback((char) => {
    if (!char) return null;
    
    const charToKeyCode = {
      // 알파벳
      'a': 'KeyA', 'b': 'KeyB', 'c': 'KeyC', 'd': 'KeyD', 'e': 'KeyE', 
      'f': 'KeyF', 'g': 'KeyG', 'h': 'KeyH', 'i': 'KeyI', 'j': 'KeyJ', 
      'k': 'KeyK', 'l': 'KeyL', 'm': 'KeyM', 'n': 'KeyN', 'o': 'KeyO', 
      'p': 'KeyP', 'q': 'KeyQ', 'r': 'KeyR', 's': 'KeyS', 't': 'KeyT', 
      'u': 'KeyU', 'v': 'KeyV', 'w': 'KeyW', 'x': 'KeyX', 'y': 'KeyY', 'z': 'KeyZ',
      
      // 숫자
      '0': 'Digit0', '1': 'Digit1', '2': 'Digit2', '3': 'Digit3', '4': 'Digit4',
      '5': 'Digit5', '6': 'Digit6', '7': 'Digit7', '8': 'Digit8', '9': 'Digit9',
      
      // 특수문자
      ' ': 'Space', '.': 'Period', ',': 'Comma', ';': 'Semicolon', 
      "'": 'Quote', '/': 'Slash', '\\': 'Backslash', 
      '[': 'BracketLeft', ']': 'BracketRight', 
      '-': 'Minus', '=': 'Equal', '`': 'Backquote',
      
      // Shift + 문자들
      '!': 'Digit1', '@': 'Digit2', '#': 'Digit3', '$': 'Digit4', '%': 'Digit5',
      '^': 'Digit6', '&': 'Digit7', '*': 'Digit8', '(': 'Digit9', ')': 'Digit0',
      '_': 'Minus', '+': 'Equal', '{': 'BracketLeft', '}': 'BracketRight',
      '|': 'Backslash', ':': 'Semicolon', '"': 'Quote', '<': 'Comma',
      '>': 'Period', '?': 'Slash', '~': 'Backquote'
    };
    
    return charToKeyCode[char.toLowerCase()] || null;
  }, []);

  // nextCharInfo가 변경될 때마다 다음 키 하이라이트 업데이트
  useEffect(() => {
    if (nextCharInfo && nextCharInfo.nextChar) {
      const keyCode = getKeyCodeFromChar(nextCharInfo.nextChar);
      setNextKey(keyCode);
    } else {
      setNextKey(null);
    }
  }, [nextCharInfo, getKeyCodeFromChar]);
  
  // 커서 위치 기반으로 다음 키 예측 (fallback용 - nextCharInfo가 없을 때만 사용)
  const predictNextKey = useCallback(() => {
    if (!focusedElement) {
      console.log('no focusedElement')
      return null;
    } 
    
    const cursorPos = focusedElement.selectionStart;
    const text = focusedElement.value;
    
    if (cursorPos === 0 || cursorPos > text.length) return null;
    
    const lastChar = text[cursorPos - 1];
    
    // 간단한 영어 단어 완성 예측
    if (/[a-zA-Z]/.test(lastChar)) {
      const commonNext = {
        'a': 'KeyN', 'e': 'KeyR', 'i': 'KeyN', 'o': 'KeyN', 'u': 'KeyR',
        't': 'KeyH', 'h': 'KeyE', 's': 'KeyH', 'r': 'KeyE', 'n': 'KeyG'
      };
      return commonNext[lastChar.toLowerCase()] || null;
    }
    
    return null;
  }, [focusedElement]);
  
  // 커서 위치 변경 감지 (nextCharInfo가 없을 때만 사용)
  useEffect(() => {
    if (!focusedElement || (nextCharInfo && nextCharInfo.nextChar)) {
      return; // nextCharInfo가 있으면 그걸 우선 사용
    }
    
    const updatePrediction = () => {
      const nextKey = predictNextKey();
      setNextKey(nextKey);
    };
    
    const handleInput = updatePrediction;
    const handleClick = updatePrediction;
    const handleKeyUp = updatePrediction;
    
    focusedElement.addEventListener('input', handleInput);
    focusedElement.addEventListener('click', handleClick);
    focusedElement.addEventListener('keyup', handleKeyUp);
    
    // 초기 예측
    updatePrediction();
    
    return () => {
      focusedElement.removeEventListener('input', handleInput);
      focusedElement.removeEventListener('click', handleClick);
      focusedElement.removeEventListener('keyup', handleKeyUp);
    };
  }, [focusedElement, predictNextKey, nextCharInfo]);

  // 키 눌렀을 때 (현재 눌린 키 표시)
  const handleKeyDown = useCallback((event) => {
    const pressedKeyCode = event.code;
    setPressedKey(pressedKeyCode);
  }, []);

  // 키 뗐을 때 (눌린 키 표시 해제)
  const handleKeyUp = useCallback(() => {
    setPressedKey(null);
  }, []);

  // 이벤트 리스너 등록
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
      { main: 'Space', span: 26, isFunctional: true, code: 'Space' },
      { main: 'Alt', span: 5, isFunctional: true, code: 'AltRight' },
      { main: 'Ctrl', span: 5, isFunctional: true, code: 'ControlRight' }
    ]
  ];

  return (
    <div className="w-full max-w-5xl mx-auto overflow-hidden bg-gray-100 shadow-lg rounded-xl">
      <div className="p-8 bg-gray-100">
        <div
          className="grid keyboard gap-x-3 gap-y-2"
          style={{
            gridTemplateColumns: 'repeat(60, 1fr)',
          }}
        >
          {keyboardLayout.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((key, keyIndex) => (
                <div
                  key={`${rowIndex}-${keyIndex}`}
                  className={`key border border-gray-300 rounded-lg shadow-sm
                              transition-all duration-150
                              flex flex-col items-center justify-center text-sm font-medium text-gray-700 h-12
                              ${key.isFunctional ? 'text-xs' : ''}
                              ${key.code === pressedKey 
                                ? 'bg-gray-400 border-gray-600 shadow-gray-300 shadow-lg scale-105' 
                                : key.code === nextKey 
                                ? 'bg-red-400 border-red-600 shadow-red-300 shadow-lg scale-105' 
                                : 'bg-white hover:bg-gray-50'
                              }
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
    </div>
  );
};

export default SimpleKeyboard;