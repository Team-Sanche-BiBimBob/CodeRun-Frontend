import React, { useState, useEffect } from 'react';

function RealTimeStats({ 
  accuracy, 
  typingSpeed, 
  elapsedTime,
  currentIndex,
  totalSentences,
  startTime
}) {
  const [displayAccuracy, setDisplayAccuracy] = useState(0);
  const [displaySpeed, setDisplaySpeed] = useState(0);
  const [currentTime, setCurrentTime] = useState(elapsedTime);

  // ⏱ 1초마다 시간 갱신
  useEffect(() => {
    if (!startTime) return;

    const timeInterval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now - startTime) / 1000);
      const minutes = String(Math.floor(diff / 60)).padStart(2, '0');
      const seconds = String(diff % 60).padStart(2, '0');
      setCurrentTime(`${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [startTime]);

  // 🎯 정확도 / 타속 애니메이션
  useEffect(() => {
    const targetAccuracy = parseFloat(accuracy) || 0;
    const targetSpeed = parseFloat(typingSpeed) || 0;

    const accuracyInterval = setInterval(() => {
      setDisplayAccuracy(prev => {
        const diff = targetAccuracy - prev;
        if (Math.abs(diff) < 0.1) {
          clearInterval(accuracyInterval);
          return targetAccuracy;
        }
        return prev + diff * 0.1;
      });
    }, 16);

    const speedInterval = setInterval(() => {
      setDisplaySpeed(prev => {
        const diff = targetSpeed - prev;
        if (Math.abs(diff) < 0.1) {
          clearInterval(speedInterval);
          return targetSpeed;
        }
        return prev + diff * 0.1;
      });
    }, 16);

    return () => {
      clearInterval(accuracyInterval);
      clearInterval(speedInterval);
    };
      }, [accuracy, typingSpeed, startTime]);

  return (
    <div className="w-full flex justify-center">
      {/* 키보드랑 같은 가로 길이 (예: 1024px) */}
      <div className="bg-gray-100 rounded-t-md shadow-sm px-6 py-2 flex justify-between text-sm text-gray-600 w-[1024px]">
        
        {/* 진행도 */}
        <div className="flex items-center gap-1 w-[120px]">
          <span className="text-gray-500">진행도</span>
          <span className="font-medium">{currentIndex}/{totalSentences}</span>
        </div>

        {/* 소요시간 */}
        <div className="flex items-center gap-1 w-[120px] justify-center">
          <span className="text-gray-500">시간</span>
          <span className="font-mono font-medium">{currentTime}</span>
        </div>

        {/* 정확도 */}
        <div className="flex items-center gap-1 w-[120px] justify-center">
          <span className="text-gray-500">정확도</span>
          <span className="font-medium">{displayAccuracy.toFixed(1)}%</span>
        </div>

        {/* 분당 타수 */}
        <div className="flex items-center gap-1 w-[120px] justify-end">
          <span className="text-gray-500">분당타수</span>
          <span className="font-medium">{displaySpeed.toFixed(0)}타</span>
        </div>
      </div>
    </div>
  );
}

export default RealTimeStats;