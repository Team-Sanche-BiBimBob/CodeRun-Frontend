import React, { useState, useEffect, useCallback, useRef } from 'react';

const SimpleKeyboard = ({ nextCharInfo }) => {
  const [nextKey, setNextKey] = useState(null); // 다음에 눌러야 할 키
  const [pressedKey, setPressedKey] = useState(null); // 현재 누르고 있는 키
  const [focusedElement, setFocusedElement] = useState(null);

  // ✅ 키보드 사운드 (효과음)
  const keySoundRef = useRef(null);

  useEffect(() => {
    // /public/sounds/key-press.mp3 에 음원 파일 추가
    keySoundRef.current = new Audio('/sound/key-press.mp3');
    keySoundRef.current.volume = 0.3; // 볼륨 (0.0~1.0)
  }, []);

  // ✅ 소리 재생 함수
  const playKeySound = useCallback(() => {
    const sound = keySoundRef.current;
    if (sound) {
      sound.currentTime = 0; // 재생 중이면 처음으로 되감기
      sound.play().catch(() => {}); // 자동재생 제한 방지
    }
  }, []);

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

  // nextCharInfo에서 다음 키코드 계산
  const getKeyCodeFromChar = useCallback((char) => {
    if (!char) return null;
    const map = {
      'a':'KeyA','b':'KeyB','c':'KeyC','d':'KeyD','e':'KeyE','f':'KeyF','g':'KeyG','h':'KeyH','i':'KeyI','j':'KeyJ',
      'k':'KeyK','l':'KeyL','m':'KeyM','n':'KeyN','o':'KeyO','p':'KeyP','q':'KeyQ','r':'KeyR','s':'KeyS','t':'KeyT',
      'u':'KeyU','v':'KeyV','w':'KeyW','x':'KeyX','y':'KeyY','z':'KeyZ',
      '0':'Digit0','1':'Digit1','2':'Digit2','3':'Digit3','4':'Digit4','5':'Digit5','6':'Digit6','7':'Digit7','8':'Digit8','9':'Digit9',
      ' ':'Space','.' :'Period',',' :'Comma',';':'Semicolon',"'" :'Quote','/':'Slash','\\':'Backslash','[':'BracketLeft',']':'BracketRight','-':'Minus','=':'Equal','`':'Backquote',
      '!':'Digit1','@':'Digit2','#':'Digit3','$':'Digit4','%':'Digit5','^':'Digit6','&':'Digit7','*':'Digit8','(':'Digit9',')':'Digit0',
      '_':'Minus','+':'Equal','{':'BracketLeft','}':'BracketRight','|':'Backslash',':':'Semicolon','"':'Quote','<':'Comma','>':'Period','?':'Slash','~':'Backquote'
    };
    return map[char.toLowerCase()] || null;
  }, []);

  // nextCharInfo 변경 시 다음 키 표시 업데이트
  useEffect(() => {
    if (nextCharInfo && nextCharInfo.nextChar) {
      const keyCode = getKeyCodeFromChar(nextCharInfo.nextChar);
      setNextKey(keyCode);
    } else {
      setNextKey(null);
    }
  }, [nextCharInfo, getKeyCodeFromChar]);
  
  useEffect(() => {
    const enableSound = () => {
      const s = new Audio('/sound/key-press.mp3');
      s.play().catch(() => {});
      window.removeEventListener('click', enableSound);
    };
    window.addEventListener('click', enableSound);
  }, []);
  

  // 예측 키 (fallback)
  const predictNextKey = useCallback(() => {
    if (!focusedElement) return null;
    const cursorPos = focusedElement.selectionStart;
    const text = focusedElement.value;
    if (cursorPos === 0 || cursorPos > text.length) return null;
    const lastChar = text[cursorPos - 1];
    if (/[a-zA-Z]/.test(lastChar)) {
      const commonNext = { 'a':'KeyN','e':'KeyR','i':'KeyN','o':'KeyN','u':'KeyR','t':'KeyH','h':'KeyE','s':'KeyH','r':'KeyE','n':'KeyG' };
      return commonNext[lastChar.toLowerCase()] || null;
    }
    return null;
  }, [focusedElement]);

  useEffect(() => {
    if (!focusedElement || (nextCharInfo && nextCharInfo.nextChar)) return;
    const update = () => setNextKey(predictNextKey());
    focusedElement.addEventListener('input', update);
    focusedElement.addEventListener('click', update);
    focusedElement.addEventListener('keyup', update);
    update();
    return () => {
      focusedElement.removeEventListener('input', update);
      focusedElement.removeEventListener('click', update);
      focusedElement.removeEventListener('keyup', update);
    };
  }, [focusedElement, predictNextKey, nextCharInfo]);

  // ✅ 키 입력 이벤트 (소리 재생 포함)
  const handleKeyDown = useCallback((event) => {
    const pressedKeyCode = event.code;
    setPressedKey(pressedKeyCode);
    playKeySound(); // ✅ 소리 재생
  }, [playKeySound]);

  const handleKeyUp = useCallback(() => setPressedKey(null), []);

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
          style={{ gridTemplateColumns: 'repeat(60, 1fr)' }}
        >
          {keyboardLayout.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((key, keyIndex) => (
                <div
                  key={`${rowIndex}-${keyIndex}`}
                  className={`key border border-gray-300 rounded-lg shadow-sm
                    transition-all duration-150 flex flex-col items-center justify-center text-sm font-medium text-gray-700 h-12
                    ${key.isFunctional ? 'text-xs' : ''}
                    ${key.code === pressedKey 
                      ? 'bg-gray-400 border-gray-600 shadow-gray-300 shadow-lg scale-105' 
                      : key.code === nextKey 
                      ? 'bg-red-400 border-red-600 shadow-red-300 shadow-lg scale-105' 
                      : 'bg-white hover:bg-gray-50'
                    }`}
                  style={{ gridColumn: `span ${key.span}` }}
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
