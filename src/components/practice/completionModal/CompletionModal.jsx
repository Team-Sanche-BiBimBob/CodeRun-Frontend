import React from 'react';

function CompletionModal({ 
  isOpen, 
  accuracy, 
  typingSpeed, 
  elapsedTime, 
  onRestart, 
  onGoHome 
}) {
  if (!isOpen) return null;

    // 🎯 정확도 기준 대사 로직
    const acc = parseFloat(accuracy);
    let message = '대단해요!'; // 기본 메시지
  
    if (acc >= 90) {
      message = '대단해요!';
    } else if (acc >= 80) {
      message = '훌륭해요!';
    } else if (acc >= 60) {
      message = '잘했어요!';
    } else if (acc >= 40) {
      message = '노력이 필요해요!';
    } else {
      message = '많이 노력이 필요해보여요!';
    }

  return (
    // ✅ 배경: 반투명 + 블러 효과 (뒤 배경 보임)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm">
      {/* ✅ 모달: 불투명 흰색 */}
      <div className="bg-white rounded-xl p-8 w-[500px] text-center shadow-lg relative overflow-hidden">
        {/* 배경 장식 요소들 (파티클) */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="absolute w-6 h-6 transform rotate-45 bg-green-200 rounded top-4 left-8 animate-pulse"></div>
          <div className="absolute w-4 h-4 bg-purple-200 rounded-full top-12 right-16 animate-pulse"></div>
          <div className="absolute w-8 h-4 transform bg-orange-200 rounded top-16 left-20 rotate-12 animate-pulse"></div>
          <div className="absolute w-5 h-8 transform rotate-45 bg-green-200 rounded top-6 right-8 animate-pulse"></div>
          <div className="absolute w-6 h-3 transform rotate-45 bg-purple-200 rounded bottom-20 left-12 animate-pulse"></div>
          <div className="absolute w-4 h-6 transform bg-orange-200 rounded bottom-32 right-20 rotate-12 animate-pulse"></div>
          <div className="absolute w-3 h-3 bg-green-200 rounded-full bottom-16 left-24 animate-pulse"></div>
          <div className="absolute h-4 transform rotate-45 bg-purple-200 rounded bottom-8 right-12 w-7 animate-pulse"></div>
          <div className="absolute w-2 h-2 bg-orange-300 rounded-full top-20 left-32 animate-pulse"></div>
          <div className="absolute w-8 h-3 transform rotate-45 bg-green-200 rounded top-32 right-32 animate-pulse"></div>
          <div className="absolute w-5 h-5 transform bg-purple-200 rounded bottom-24 left-16 rotate-12 animate-pulse"></div>
          <div className="absolute w-3 h-6 transform rotate-45 bg-orange-200 rounded bottom-12 right-24 animate-pulse"></div>
        </div>

        {/* 프로필 아이콘 */}
        <div className="relative z-10 mb-6">
          <div className="flex items-center justify-center w-20 h-20 mx-auto bg-gray-400 rounded-full">
            <div className="w-8 h-8 mb-2 bg-gray-300 rounded-full"></div>
            <div className="absolute w-12 h-6 bg-gray-300 rounded-full bottom-4"></div>
          </div>
        </div>

        {/* 대단해요! 텍스트 */}
        <div className="relative z-10 mb-8 text-2xl font-bold text-gray-800">대단해요!</div>

        {/* 타수와 정확도 */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div className="text-left">
            <div className="mb-1 text-sm text-gray-600">정확도(%)</div>
            <div className="flex items-center">
              <div className="relative w-32 h-3 mr-3 bg-gray-200 rounded-full">
                <div 
                  className="relative h-full bg-teal-400 rounded-full"
                  style={{ width: `${Math.min(100, Number(accuracy))}%` }}
                >
                  <div className="absolute right-0 flex items-center justify-center w-5 h-5 transform translate-x-1/2 -translate-y-1/2 bg-white border-2 border-teal-400 rounded-full top-1/2">
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="mb-1 text-sm text-gray-600">타수 {typingSpeed}타</div>
            <div className="text-3xl font-bold text-teal-400">
              {Number(accuracy).toFixed(2)}%
            </div>
          </div>
        </div>

        {/* 소요시간 */}
        <div className="relative z-10 mb-8 text-left">
          <div className="mb-1 text-sm text-gray-600">소요시간</div>
          <div className="text-lg font-semibold text-gray-800">{elapsedTime}</div>
        </div>

        {/* 버튼들 */}
        <div className="relative z-10 flex justify-center gap-4 mt-8">
          <button 
            onClick={onGoHome} 
            className="px-8 py-3 font-medium text-gray-700 border-2 border-gray-400 rounded-lg hover:bg-gray-100"
          >
            그만 하기
          </button>
          <button 
            onClick={onRestart} 
            className="px-8 py-3 font-medium text-gray-700 border-2 border-gray-400 rounded-lg hover:bg-gray-100"
          >
            다시 하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompletionModal;