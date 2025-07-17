import React from 'react';

function CompletionModal({ 
  isOpen, 
  accuracy, 
  typingSpeed, 
  elapsedTime, 
  formatTime,
  onRestart, 
  onGoHome 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-[500px] text-center shadow-lg relative">
        {/* 배경 장식 요소들 */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="absolute top-4 left-8 w-6 h-6 bg-green-200 rounded transform rotate-45"></div>
          <div className="absolute top-12 right-16 w-4 h-4 bg-purple-200 rounded-full"></div>
          <div className="absolute top-16 left-20 w-8 h-4 bg-orange-200 rounded transform rotate-12"></div>
          <div className="absolute top-6 right-8 w-5 h-8 bg-green-200 rounded transform rotate-45"></div>
          <div className="absolute bottom-20 left-12 w-6 h-3 bg-purple-200 rounded transform rotate-45"></div>
          <div className="absolute bottom-32 right-20 w-4 h-6 bg-orange-200 rounded transform rotate-12"></div>
          <div className="absolute bottom-16 left-24 w-3 h-3 bg-green-200 rounded-full"></div>
          <div className="absolute bottom-8 right-12 w-7 h-4 bg-purple-200 rounded transform rotate-45"></div>
          <div className="absolute top-20 left-32 w-2 h-2 bg-orange-300 rounded-full"></div>
          <div className="absolute top-32 right-32 w-8 h-3 bg-green-200 rounded transform rotate-45"></div>
          <div className="absolute bottom-24 left-16 w-5 h-5 bg-purple-200 rounded transform rotate-12"></div>
          <div className="absolute bottom-12 right-24 w-3 h-6 bg-orange-200 rounded transform rotate-45"></div>
        </div>
        
        {/* 프로필 아이콘 */}
        <div className="relative z-10 mb-6">
          <div className="w-20 h-20 bg-gray-400 rounded-full mx-auto flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full mb-2"></div>
            <div className="w-12 h-6 bg-gray-300 rounded-full absolute bottom-4"></div>
          </div>
        </div>
        
        {/* 대단해요! 텍스트 */}
        <div className="relative z-10 text-2xl font-bold mb-8 text-gray-800">대단해요!</div>
        
        {/* 타수와 정확도 */}
        <div className="relative z-10 flex justify-between items-center mb-6">
          <div className="text-left">
            <div className="text-sm text-gray-600 mb-1">정확도(%)</div>
            <div className="flex items-center">
              <div className="w-32 h-3 bg-gray-200 rounded-full mr-3 relative">
                <div 
                  className="h-full bg-teal-400 rounded-full relative"
                  style={{ width: `${accuracy}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-teal-400 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">타수 {typingSpeed}타</div>
            <div className="text-3xl font-bold text-teal-400">
              {accuracy}%
            </div>
          </div>
        </div>
        
        {/* 소요시간 */}
        <div className="relative z-10 text-left mb-8">
          <div className="text-sm text-gray-600 mb-1">소요시간</div>
          <div className="text-lg font-semibold text-gray-800">{formatTime(elapsedTime)}</div>
        </div>
        
        {/* 버튼들 */}
        <div className="relative z-10 flex justify-center gap-4 mt-8">
          <button 
            onClick={onGoHome} 
            className="px-8 py-3 border-2 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
          >
            그만 하기
          </button>
          <button 
            onClick={onRestart} 
            className="px-8 py-3 border-2 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
          >
            다시 하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompletionModal;