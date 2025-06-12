import React, { useEffect, useState } from "react";

const rows = [
  [
    { label: '!', width: 48 }, { label: '@', width: 48 }, { label: '#', width: 48 },
    { label: '$', width: 48 }, { label: '%', width: 48 }, { label: '^', width: 48 },
    { label: '&', width: 48 }, { label: '*', width: 48 }, { label: '(', width: 48 },
    { label: ')', width: 48 }, { label: '-', width: 48 }, { label: '=', width: 48 },
    { label: '\\', width: 48 }
  ],
  [
    { label: 'Tab', width: 72 }, { label: 'Q', width: 48 }, { label: 'W', width: 48 },
    { label: 'E', width: 48 }, { label: 'R', width: 48 }, { label: 'T', width: 48 },
    { label: 'Y', width: 48 }, { label: 'U', width: 48 }, { label: 'I', width: 48 },
    { label: 'O', width: 48 }, { label: 'P', width: 48 }, { label: '{', width: 48 },
    { label: '}', width: 48 }
  ],
  [
    { label: 'Caps', width: 80 }, { label: 'A', width: 48 }, { label: 'S', width: 48 },
    { label: 'D', width: 48 }, { label: 'F', width: 48 }, { label: 'G', width: 48 },
    { label: 'H', width: 48 }, { label: 'J', width: 48 }, { label: 'K', width: 48 },
    { label: 'L', width: 48 }, { label: ':', width: 48 }, { label: '"', width: 48 },
    { label: 'Enter', width: 72 }
  ],
  [
    { label: 'Shift', width: 96 }, { label: 'Z', width: 48 }, { label: 'X', width: 48 },
    { label: 'C', width: 48 }, { label: 'V', width: 48 }, { label: 'B', width: 48 },
    { label: 'N', width: 48 }, { label: 'M', width: 48 }, { label: '<', width: 48 },
    { label: '>', width: 48 }, { label: '?', width: 48 }, { label: 'Shift', width: 96 }
  ],
  [
    { label: 'Ctrl', width: 60 }, { label: 'Win', width: 60 }, { label: 'Alt', width: 60 },
    { label: 'Space', width: 240 }, { label: 'Alt', width: 60 }, { label: 'Fn', width: 60 },
    { label: 'Ctrl', width: 60 }
  ]
];

const Key = ({ label, width = 48 }) => {
  const isSpace = label === '␣' || label === 'Space';

  return (
    <div
      className={`h-[58px] flex items-center justify-center mx-[4px] my-[2px]
        bg-white border border-gray-200 rounded-md text-[13px] font-light
        ${isSpace ? 'opacity-0' : ''}`}
      style={{ width: isSpace ? 240 : width }}
    >
      {isSpace ? '' : label}
    </div>
  );
};

function formatTime(seconds) {
  const total = Math.floor(seconds * 1000);
  const sec = Math.floor(total / 1000).toString().padStart(2, '0');
  const ms = (total % 1000).toString().padStart(3, '0');
  return `${sec}.${ms}`;
}

export default function KeyboardWithStats() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setSeconds(prev => +(prev + 0.1).toFixed(1));
    }, 100);
    return () => clearInterval(timer);
  }, [isRunning]);

  return (
    <div className="bg-[#f1fbfa] p-6 rounded-md max-w-5xl mx-auto">
      {/* 상단 상태 정보 */}
      <div className="flex justify-between items-center px-2 mb-4 text-[13px] text-gray-600 font-medium">
        <div>100타</div>
        <div>진행시간: {formatTime(seconds)}</div>
        <div>정확도: 100%</div>
      </div>

      {/* 키보드 본체 */}
      <div className="bg-[#f8f8f8] rounded-lg py-4 px-2">
        {rows.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={`flex ${rowIndex === 0 ? 'justify-start' : 'justify-center'}`}
          >
            {row.map((key, keyIndex) => (
              <Key key={`key-${rowIndex}-${keyIndex}`} label={key.label} width={key.width} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
