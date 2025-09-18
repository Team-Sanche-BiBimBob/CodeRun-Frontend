import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4 pt-16">
      <div className="max-w-xl mx-auto text-center">
        {/* 404 Section - CodeRun Style */}
        <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 mb-6">
          {/* CodeRun Logo Style */}
          <div className="mb-6">
            <img 
              src={logo}
              alt="CodeRun 로고" 
              className="h-12 mx-auto"
            />
          </div>
          
          {/* 404 Error - IDE Style */}
          <div className="mb-6">
            <div className="text-6xl font-bold text-red-500 mb-3 font-mono">404</div>
            <div className="text-lg font-mono bg-gray-100 rounded-lg p-3 text-left">
              <span className="text-purple-600">const</span>
              <span className="text-blue-600 mx-1">error</span>
              <span className="text-gray-800">=</span>
              <span className="text-green-600 mx-1">"Page Not Found"</span>
              <span className="text-gray-800">;</span>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-6">
            <div className="bg-gray-900 rounded-lg p-4 text-left font-mono text-xs">
              <div className="text-gray-500">// 페이지를 찾을 수 없습니다</div>
              <div className="text-red-400">
                <span className="text-purple-400">throw new</span> 
                <span className="text-yellow-400 mx-1">Error</span>
                <span className="text-white">(</span>
                <span className="text-green-400">"요청하신 페이지가 존재하지 않습니다"</span>
                <span className="text-white">);</span>
              </div>
              <div className="text-gray-500 mt-1">// 올바른 경로로 이동해보세요! 🚀</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleGoHome}
              className="w-56 sm:w-56 w-full h-10 bg-[#17b6a2] text-white rounded-lg font-mono text-sm hover:bg-[#14b8a6] transition-colors duration-200 shadow-md"
            >
              홈으로
            </button>
            <button
              onClick={handleGoBack}
              className="w-56 sm:w-56 w-full h-10 bg-gray-600 text-white rounded-lg font-mono text-sm hover:bg-gray-700 transition-colors duration-200 shadow-md"
            >
              뒤로
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;