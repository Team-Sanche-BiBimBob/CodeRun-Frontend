import React, { useState } from 'react';

export default function Competition() {
  const [selectedCategory, setSelectedCategory] = useState('단독 대결');

  const categories = [
    { id: 'solo', name: '단독 대결', active: true },
    { id: 'multi', name: '다수 대결', active: false },
    { id: 'friends', name: '친구와 플레이하기', active: false },
    { id: 'ranking', name: '공식 유튜브', active: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full">
        <div className="bg-gray-100">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-6 px-6">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl"></div>
              <span className="text-2xl font-bold text-gray-800 tracking-wide">hs080401</span>
            </div>
          </div>

          <div className="py-6 px-6">
            <div className="flex">
              {/* Left Side - Categories */}
              <div className="w-1/3 pr-6">
                <div className="space-y-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full py-4 px-6 rounded-xl text-left text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                        selectedCategory === category.name
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white border-2 border-teal-400'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Side - Stats and Actions */}
              <div className="w-2/3 pl-6 border-l border-gray-300">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                  <div className="text-center bg-white p-6 rounded-xl border border-gray-200">
                    <div className="text-base font-medium text-gray-600 mb-2">플레이</div>
                    <div className="text-2xl font-bold text-gray-900">300</div>
                  </div>
                  <div className="text-center bg-white p-6 rounded-xl border border-gray-200">
                    <div className="text-base font-medium text-gray-600 mb-2">승률</div>
                    <div className="text-2xl font-bold text-gray-900">54%</div>
                  </div>
                  <div className="text-center bg-white p-6 rounded-xl border border-gray-200">
                    <div className="text-base font-medium text-gray-600 mb-2">순위</div>
                    <div className="text-2xl font-bold text-gray-900">120등</div>
                  </div>
                  <div className="text-center bg-white p-6 rounded-xl border border-gray-200">
                    <div className="text-base font-medium text-gray-600 mb-2">친구</div>
                    <div className="text-2xl font-bold text-gray-900">17명</div>
                  </div>
                </div>

                {/* Selected Category Display */}
                <div className="mb-8">
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white py-8 px-6 rounded-xl border-2 border-teal-400">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{selectedCategory}</div>
                      <div className="text-teal-100 text-base mt-1">여길 눌러서 시작하세요</div>
                    </div>
                  </div>
                </div>

                {/* Advertisement Section */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 text-center border-2 border-dashed border-gray-300">
                  <div className="text-gray-500 text-lg font-medium mb-1">haesung3308@gmail.com</div>
                  <div className="text-gray-400 text-sm">오류가 있다면 여기로 연락 해주세요</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
