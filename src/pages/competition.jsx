import React from 'react';
import { Clock } from 'lucide-react';
import { useState } from 'react';

const Competition = () => {
  const [type, setType] = useState("단어");

  const handleChange = (type)=>{
    setType(type);
  }


  const handleStartGame = () => {
    alert(`${type} 게임 시작!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 서브 헤더 */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center space-x-8">
          <span className="text-teal-600 font-medium">타임 어택</span>
          <span className="text-gray-600">1대1 경쟁대전</span>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽 - 게임 정보 */}
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center w-full max-w-md">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">{type}</h2>
              <div className="text-gray-500 mb-8">내 최고기록: 00:36:21</div>
              
              <hr className="border-gray-200 mb-8" />
              
              <div className="flex justify-center items-center space-x-4 mb-12 text-xl">
                <span className={`${type==='단어'? 'text-teal-600':'text-gray-600'}  cursor-pointer hover:text-teal-600 transition-colors`}
                  onClick={()=>handleChange("단어")}
                >단어</span>
                <span className="text-gray-400">|</span>
                <span className={`${type==='문장'? 'text-teal-600':'text-gray-600'}  cursor-pointer hover:text-teal-600 transition-colors`}
                  onClick={()=>handleChange("문장")}
                >문장</span>
                <span className="text-gray-400">|</span>
                <span className={`${type==='풀코드'? 'text-teal-600':'text-gray-600'}  cursor-pointer hover:text-teal-600 transition-colors`}
                onClick={()=>handleChange("풀코드")}
                >풀코드</span>
              </div>
            </div>
          </div>

          {/* 오른쪽 - 기록 리스트와 시작하기 버튼 */}
          <div className="space-y-6">
            {/* 기록 리스트 */}
            <div className="space-y-4">
              {[
                { time: '1시간 전', difficulty: '자동구', record: '00:36:21' },
                { time: '1일 전', difficulty: '자동구', record: '00:36:21' },
                { time: '1일 전', difficulty: '자동구', record: '00:36:21' },
                { time: '2일 전', difficulty: '자동구', record: '00:36:21' },
              ].map((item, index) => (
                <div key={index} className="bg-gray-100 rounded-2xl p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">{item.time}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-600">{item.difficulty}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span className="font-mono text-lg font-semibold text-gray-800">
                      {item.record}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 시작하기 버튼 */}
            <div className="flex justify-end pt-8">
              <button 
                onClick={handleStartGame}
                className="bg-teal-600 text-white py-4 px-12 rounded-2xl text-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                시작하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Competition;