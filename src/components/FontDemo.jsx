import React from 'react';

const FontDemo = () => {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Pretendard 폰트 두께 데모</h1>
      
      <div className="space-y-2">
        <p className="font-thin text-lg">Thin (100) - 얇은 글씨</p>
        <p className="font-extralight text-lg">Extra Light (200) - 매우 얇은 글씨</p>
        <p className="font-light text-lg">Light (300) - 가벼운 글씨</p>
        <p className="font-normal text-lg">Normal (400) - 일반 글씨</p>
        <p className="font-medium text-lg">Medium (500) - 중간 글씨</p>
        <p className="font-semibold text-lg">Semi Bold (600) - 반굵은 글씨</p>
        <p className="font-bold text-lg">Bold (700) - 굵은 글씨</p>
        <p className="font-extrabold text-lg">Extra Bold (800) - 매우 굵은 글씨</p>
        <p className="font-black text-lg">Black (900) - 가장 굵은 글씨</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">사용법 예시:</h2>
        <div className="bg-gray-100 p-4 rounded">
          <code className="text-sm">
            {`<h1 className="font-bold">제목</h1>
<p className="font-medium">중간 굵기 텍스트</p>
<span className="font-light">가벼운 텍스트</span>`}
          </code>
        </div>
      </div>
    </div>
  );
};

export default FontDemo;
