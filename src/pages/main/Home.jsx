import React, { useState, useEffect } from 'react';
import Footer from '../../components/common/footer/Footer.jsx';
import { useNavigate } from 'react-router-dom'; 

const Home = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const dummyData = [
      {
        name: 'Python',
        description: '간결하고 배우기 쉬운 문법으로 다양한 분야에서 사랑받는 프로그래밍 언어입니다.',
      },
      {
        name: 'C',
        description: '시스템 프로그래밍에 강력하며 하드웨어 제어에 많이 사용되는 저수준 언어입니다.',
      },
      {
        name: 'JavaScript',
        description: '웹 개발에 필수적인 언어로, 동적인 사용자 인터페이스 구현에 주로 사용됩니다.',
      },
    ];
    setItems(dummyData);
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-screen mx-auto bg-gray-100 relative">
      {/* Hero Section */}
      <section className="relative w-full h-96 overflow-hidden bg-white">
        {/* Hero Left */}
        <div 
          className="absolute top-0 h-full w-full z-10"
          style={{ 
            backgroundColor: '#14b8a6',
            clipPath: 'polygon(0 0, 70% 0, 50% 100%, 0% 100%)' 
          }}
        ></div>
        
        {/* Hero Right */}
        <div 
          className="absolute top-0 h-full w-full z-0"
          style={{ 
            background: '#1fa799',
            clipPath: 'polygon(70% 0, 100% 0, 100% 100%, 50% 100%)'
          }}
        ></div>

        {/* Background Gradient */}
        <div 
          className="absolute top-0 left-0 w-full h-full z-0"
          style={{ 
            background: 'linear-gradient(135deg, #1abc9c 0%, #16a085 100%)',
            clipPath: 'polygon(0 0, 60% 0, 40% 100%, 0% 100%)'
          }}
        ></div>

        {/* Hero Content */}
        <div className="relative z-20 p-25 text-white max-w-1/2">
          <h1 className="text-4xl font-bold mb-3">CodeRun{"{}"}</h1>
          <p className="text-lg font-normal">어제보다 한 글자 더 빠르게</p>
        </div>
      </section>

      {/* Content Wrapper */}
      <div className="max-w-4xl mx-auto py-15 px-5 flex flex-col gap-15">
        {/* Languages Section */}
        <section className="w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">최근 인기 있는 언어</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.slice(0, 3).map((language, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                {/* Language Header */}
                <div className="text-white py-4 px-5 text-center" style={{ backgroundColor: '#17b6a2' }}>
                  <h3 className="text-xl font-semibold m-0">{language.name}</h3>
                </div>
                
                {/* Language Body */}
                <div className="p-5">
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {language.description}
                  </p>
                  <button
                    className="bg-teal-50 text-teal-700 border-none rounded-lg py-2 px-4 text-sm cursor-pointer transition-colors duration-200 w-full hover:bg-teal-100"
                    onClick={() => navigate('/PracticeSelect')}
                  >
                    이동하기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Home;