import React from 'react';

const Choice = () => {
  const handleNavigation = (path) => {
    console.log('Navigate to:', path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">



      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-16 text-black">
          네 손가락 vs 내 손가락, 지금 시작한다.
        </h1>

        {/* Characters VS Section */}
        <div className="flex items-center justify-center mb-16 space-x-12">
          {/* Left Character */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {/* Character body */}
              <div className="w-32 h-40 bg-gray-300 rounded-full relative">
                {/* Eyes */}
                <div className="absolute top-8 left-8 w-4 h-4 bg-black rounded-full"></div>
                <div className="absolute top-8 right-8 w-4 h-4 bg-black rounded-full"></div>
                {/* Small diamond on forehead */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-400 rotate-45"></div>
              </div>
              {/* Laptop */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-16 bg-teal-600 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">DGSW</span>
              </div>
            </div>
          </div>

          {/* VS Text */}
          <div className="text-6xl font-bold text-red-500 mx-8">
            VS
          </div>

          {/* Right Character */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {/* Character body */}
              <div className="w-32 h-40 bg-gray-300 rounded-full relative">
                {/* Eyes */}
                <div className="absolute top-8 left-8 w-4 h-4 bg-black rounded-full"></div>
                <div className="absolute top-8 right-8 w-4 h-4 bg-black rounded-full"></div>
                {/* Small diamond on forehead */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-400 rotate-45"></div>
              </div>
              {/* Laptop */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-16 bg-teal-600 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">DGSW</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          {['/word', '/sentence', '/full'].map((path, i) => {
            const labels = ['단어', '문장', '풀코드'];
            return (
              <button
                key={path}
                className="px-8 py-3 border-2 border-gray-300 rounded-full text-lg bg-white transition-all duration-300 hover:shadow-lg min-w-[120px] text-gray-700 hover:bg-gray-50"
                onClick={() => handleNavigation(path)}
              >
                {labels[i]}
              </button>
            );
          })}
        </div>

        {/* Start Button */}
        <button className="px-12 py-4 bg-teal-600 text-white rounded-full text-xl font-medium hover:bg-teal-700 transition-colors">
          경쟁하기
        </button>
      </div>
    </div>
  );
};

export default RankChoice;