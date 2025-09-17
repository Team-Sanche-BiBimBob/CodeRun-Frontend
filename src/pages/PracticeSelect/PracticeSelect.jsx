import React from 'react';
import { useNavigate } from 'react-router-dom';

const PracticeSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-center mb-16 text-black mt-12">
          학습할 타자 유형을 선택하세요.
        </h1>

        <div className="relative mb-16 flex-1 flex items-center justify-center">
          <img
            src="/images/일러스트.png"
            alt="프로그래밍 선택 이미지"
            className="w-full max-w-2xl h-80 object-contain rounded-2xl opacity-90"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
  {['/word', '/sentence', '/full'].map((path, i) => {
    const labels = ['단어', '문장', '풀코드'];
    return (
      <button
        key={path}
        className="px-16 py-5 border-2 rounded-xl text-2xl bg-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 min-w-[180px]"
        onClick={() => navigate(path)}
        style={{
          borderColor: '#e5e7eb',
          color: '#000',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1CC5AE';
          e.currentTarget.style.borderColor = '#1CC5AE';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#fff';
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.color = '#000';
        }}
      >
        {labels[i]}
      </button>
    );
  })}
</div>

      </div>
    </div>
  );
};

export default PracticeSelect;
