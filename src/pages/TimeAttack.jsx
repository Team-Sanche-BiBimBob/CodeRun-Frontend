import React, { useState } from 'react';
import { Clock } from 'lucide-react';

const Competition = () => {
  const [type, setType] = useState("단어");
  
  const handleChange = (type) => { 
    setType(type);
  };

  const handleStartGame = () => {
    // navigate("/selectLanguage"); 
    console.log("게임 시작!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 서브 헤더 */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center space-x-8">
          <span className="text-teal-600 font-medium">타임어택</span>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽 - 게임 설정 */}
          <div className="space-y-6">
            {/* 단어/문제집 섹션 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">단어</h3>
              
              <div className="space-y-4">
                <div 
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    type === '단어' ? 'bg-teal-50 border-2 border-teal-200' : 'bg-gray-50 border-2 border-gray-200'
                  }`}
                  onClick={() => handleChange("단어")}
                >
                  <span className="text-lg font-medium text-gray-700">단어</span>
                </div>
                
                <div className="bg-gray-200 rounded-lg p-20 text-center text-gray-500">
                  <span>문제집</span>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 - 랭킹 */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">랭킹</h3>
            
            <div className="space-y-2">
              {[
                { rank: '1', name: 'name', time: '00:00:00' },
                { rank: '1', name: 'name', time: '00:00:00' },
                { rank: '1', name: 'name', time: '00:00:00' },
                { rank: '1', name: 'name', time: '00:00:00' },
                { rank: '1', name: 'name', time: '00:00:00' },
                { rank: 'n', name: 'me', time: '00:00:00' },
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-4 flex items-center justify-between border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-teal-500 text-white rounded flex items-center justify-center font-bold text-sm">
                      {item.rank}
                    </div>
                    <span className="text-gray-700 font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="font-mono text-gray-800">{item.time}</span>
                  </div>
                </div>
              ))}
              
              {/* 더보기 버튼 */}
              <div className="flex justify-center pt-2">
                <button className="text-gray-500 hover:text-gray-700">
                  ⋯
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={handleStartGame}
                className="bg-teal-500 text-white py-3 px-8 rounded-lg font-medium hover:bg-teal-600 transition-colors"
              >
                도전하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Competition;