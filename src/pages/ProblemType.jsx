import React from 'react';
import Header from './components/Header/Header';


const CodeRunMainPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-12">
            학습할 프로그래밍 언어의 종류를 선택하세요.
          </h1>
          
          {/* 메인 이미지 영역 */}
          <div className="flex justify-center mb-16">
          <img
            src="/images/일러스트.png"
            alt="프로그래밍 학습 일러스트"
            className="max-w-lg w-full h-auto"
        />

          </div>
          
          {/* 선택 버튼들 */}
          <div className="flex flex-wrap justify-center gap-6 max-w-2xl mx-auto">
            <button className="flex-1 min-w-48 px-8 py-4 bg-white border-2 border-gray-300 rounded-lg hover:border-orange-500 hover:shadow-lg transition-all duration-200">
              <span className="text-lg font-medium text-gray-700">단어</span>
            </button>
            
            <button className="flex-1 min-w-48 px-8 py-4 bg-white border-2 border-gray-300 rounded-lg hover:border-orange-500 hover:shadow-lg transition-all duration-200">
              <span className="text-lg font-medium text-gray-700">문장</span>
            </button>
            
            <button className="flex-1 min-w-48 px-8 py-4 bg-white border-2 border-gray-300 rounded-lg hover:border-orange-500 hover:shadow-lg transition-all duration-200">
              <span className="text-lg font-medium text-gray-700">플로드</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CodeRunMainPage;