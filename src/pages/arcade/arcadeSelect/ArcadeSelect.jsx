import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ArcadeSelect = () => {
  const [selectedMode, setSelectedMode] = useState(null);
  const navigate = useNavigate();

  const handleModeClick = (modeName, path) => {
    setSelectedMode(modeName);
    navigate(path);
  };

  const ClockIcon = () => (
    <div className="relative w-20 h-20">
      {/* 시계 외곽 */}
      <div className="w-20 h-20 border-6 border-gray-900 rounded-full relative">
        {/* 시침 */}
        <div className="absolute top-2 left-1/2 w-1 h-6 bg-gray-900 rounded-sm transform -translate-x-1/2"></div>
        {/* 분침 */}
        <div className="absolute top-5 left-1/2 w-0.5 h-4 bg-gray-900 rounded-sm transform -translate-x-1/2"></div>
        {/* 중심점 */}
        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-gray-900 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  );

  const VSIcon = () => (
    <div className="text-8xl font-black text-gray-900 transform -rotate-12 select-none" 
      style={{ fontFamily: 'Arial, sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
      VS
    </div>
  );

  const ModeCard = ({ icon, title, subtitle, disabled = false, onClick }) => (
    <div 
      className={`bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
        disabled 
          ? 'opacity-70 cursor-not-allowed' 
          : 'cursor-pointer hover:-translate-y-2 hover:shadow-2xl'
      }`}
      onClick={!disabled ? onClick : undefined}
    >
      <div className={`h-44 flex items-center justify-center ${
        disabled ? 'bg-gray-400' : 'bg-gradient-to-br from-teal-400 to-teal-600'
      }`}>
        {icon}
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        {subtitle && <p className="text-gray-600 leading-relaxed">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-5 flex justify-center">
      <div className="max-w-6xl mx-auto w-full pt-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
          아케이드 모드 선택
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <ModeCard
            icon={<ClockIcon />}
            title="타임어택"
            subtitle="시간과 싸우세요"
            onClick={() => handleModeClick('타임어택', '/competition')}
          />
          
          <ModeCard
            icon={<VSIcon />}
            title="대결전"
            subtitle="1 대 1 대결을 통해 승리하세요"
            onClick={() => handleModeClick('대결전', '/arcade1v1')}
          />
          
          <ModeCard
            icon={
              <div className="text-4xl font-bold text-gray-600 text-center leading-tight">
                coming<br />soon
              </div>
            }
            disabled={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ArcadeSelect;