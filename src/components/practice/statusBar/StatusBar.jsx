// StatusBar.jsx
import React from 'react';

const StatusBar = ({ typingSpeed, accuracy, currentTime }) => {
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white px-6 py-3 flex justify-between items-center text-sm text-gray-800 border-b border-gray-200 shadow-sm">
      <span className="font-semibold text-base">
        {typingSpeed || 0}타/분
      </span>
      <span className="text-gray-600 text-base">
        진행시간: {formatTime(currentTime || 0)}
      </span>
      <span className="font-semibold text-base">
        정확도: {Math.round(accuracy || 0)}%
      </span>
    </div>
  );
};

export default React.memo(StatusBar);