import React, { useState, useEffect } from 'react';

const KoreanKeyboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-100 rounded-xl shadow-lg overflow-hidden">
      {/* Status Bar */}
      <div className="bg-gray-50 px-4 py-2 flex justify-between items-center text-sm text-gray-600 border-b border-gray-200">
        <span>100타</span>
        <span>진행시간: {formatTime(currentTime)}</span>
        <span>정확도: 100%</span>
      </div>

      {/* Keyboard */}
      <div className="p-8 bg-gray-100">
        <div className="keyboard grid gap-2" style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}>
          {/* 1번 줄 */}
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">~</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">1</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">2</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">3</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">4</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">5</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">6</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">7</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">8</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">9</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">0</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">-</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">=</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12 col-span-2">←</div>

          {/* 2번 줄 */}
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12" style={{ gridColumn: 'span 1.5' }}></div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">Q</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">W</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">E</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">R</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">T</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">Y</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">U</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">I</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">O</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">P</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">[</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">]</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">\</div>

          {/* 3번 줄 */}
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12" style={{ gridColumn: 'span 1.75' }}></div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">A</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">S</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">D</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">F</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">G</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">H</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">J</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">K</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">L</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">;</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">'</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12" style={{ gridColumn: 'span 2.25' }}></div>

          {/* 4번 줄 */}
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12 col-span-2">Shift</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">Z</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">X</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">C</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">V</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">B</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">N</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">M</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">,</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">.</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12">/</div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12 col-span-3"></div>

          {/* 5번 줄 */}
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12 col-span-2"></div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12"></div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12"></div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12 col-span-6"></div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12"></div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12"></div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12"></div>
          <div className="key bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 flex items-center justify-center text-sm font-medium text-gray-700 h-12 col-span-2"></div>
        </div>
      </div>
    </div>
  );
};

export default KoreanKeyboard;