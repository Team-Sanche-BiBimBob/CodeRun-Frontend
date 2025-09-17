import React, { useState, useEffect, useCallback } from 'react';

const SimpleKeyboard = () => {
  const [highlightedKey, setHighlightedKey] = useState(null);

  // 키 눌렀을 때
  const handleKeyDown = useCallback((event) => {
    const pressedKeyCode = event.code;
    setHighlightedKey(pressedKeyCode);
  }, []);

  // 키 뗐을 때
  const handleKeyUp = useCallback(() => {
    setHighlightedKey(null);
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
    <div className="w-full max-w-5xl mx-auto bg-gray-100 rounded-xl shadow-lg overflow-hidden">
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
                  className={`key border border-gray-300 rounded-lg shadow-sm
                              transition-all duration-150
                              flex flex-col items-center justify-center text-sm font-medium text-gray-700 h-12
                              ${key.isFunctional ? 'text-xs' : ''}
                              ${key.code === highlightedKey 
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