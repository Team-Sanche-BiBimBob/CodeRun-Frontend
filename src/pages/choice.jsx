import React from 'react';
import { useNavigate } from 'react-router-dom';

const Choice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-6xl">
        <h1 className="text-5xl font-bold text-center mb-16 text-black mt-12">
          학습할 프로그래밍 언어의 종류를 선택하세요.
        </h1>

        <div className="relative mb-16 flex-1 flex items-center justify-center">
          <img
            src="https://img.freepik.com/premium-vector/cms-content-management-system-concept-with-laptop-website-with-login-smartphone_82472-89.jpg?w=360"
            alt="프로그래밍 선택 이미지"
            className="w-full max-w-2xl h-80 object-contain rounded-2xl opacity-90"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-16 justify-center items-center">
          <button
            className="px-20 py-7 border-2 border-gray-200 rounded-xl text-2xl bg-white hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 min-w-[220px]"
            onClick={() => navigate('/word')}
          >
            단어
          </button>
          <button
            className="px-20 py-7 border-2 border-gray-200 rounded-xl text-2xl bg-white hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 min-w-[220px]"
            onClick={() => navigate('/sentence')}
          >
            문장
          </button>
          <button
            className="px-20 py-7 border-2 border-gray-200 rounded-xl text-2xl bg-white hover:bg-pink-50 hover:border-pink-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 min-w-[220px]"
            onClick={() => navigate('/full')}
          >
            풀코드
          </button>
        </div>
      </div>
    </div>
  );
};

export default Choice;