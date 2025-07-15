import React from 'react';
import { useNavigate } from 'react-router-dom';

const Choice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">
        학습할 프로그래밍 언어의 종류를 선택하세요.
      </h1>

      <div className="border-4 border-gray-500 p-6 rounded-xl mb-12">
        <img
          src="https://img.freepik.com/premium-vector/cms-content-management-system-concept-with-laptop-website-with-login-smartphone_82472-89.jpg?w=360"
          alt="프로그래밍 선택 이미지"
          className="max-w-2xl w-full h-72 object-contain"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <button
          className="px-10 py-4 border border-gray-300 rounded-lg text-xl bg-white hover:bg-gray-100 transition"
          onClick={() => navigate('/word')}
        >
          단어
        </button>
        <button
          className="px-10 py-4 border border-gray-300 rounded-lg text-xl bg-white hover:bg-gray-100 transition"
          onClick={() => navigate('/sentence')}
        >
          문장
        </button>
        <button
          className="px-10 py-4 border border-gray-300 rounded-lg text-xl bg-white hover:bg-gray-100 transition"
          onClick={() => navigate('/fullcode')}
        >
          풀코드
        </button>
      </div>
    </div>
  );
};

export default Choice;
