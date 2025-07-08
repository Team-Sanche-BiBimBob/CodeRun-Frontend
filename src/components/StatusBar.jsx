// StatusBar.jsx
import React from 'react';

const StatusBar = ({ typingSpeed, accuracy, currentTime }) => {
  const formatTime = (date) => {
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    // 밀리초를 3자리로 표시
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

    return `${minutes}:${seconds}:${milliseconds}`;
  };

  return (
    <div className="bg-white px-6 py-3 flex justify-between items-center text-sm text-gray-800 border-b border-gray-200 shadow-sm">
      <span className="font-semibold text-base">
        {typingSpeed}타
      </span>
      <span className="text-gray-600 text-base">
        진행시간: {formatTime(currentTime)}
      </span>
      <span className="font-semibold text-base">
        정확도: {accuracy}%
      </span>
    </div>
  );
};

export default React.memo(StatusBar);