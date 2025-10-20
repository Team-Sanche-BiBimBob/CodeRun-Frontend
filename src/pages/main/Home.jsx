import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/common/footer/Footer.jsx';
import HeroCarousel from '../../components/Slides/HeroCarouse.jsx';

const Home = () => {
  const navigate = useNavigate();
  const [promoStart, setPromoStart] = useState(0);

  const rankings = [
    { rank: 1, name: '오늘 밥은 뭐하게', time: '08:07:06' },
    { rank: 2, name: '재밌게타자치고싶어요', time: '08:07:00' },
    { rank: 3, name: '집에가기제발제바...', time: '08:07:00' },
    { rank: 4, name: '둥글게 귀엽게', time: '08:06:36' },
    { rank: 5, name: '민타탐탐', time: '08:07:00' },
    { rank: 6, name: '못생긴타자총애기여엉', time: '08:07:00' },
  ];

  const languages = [
    'Python', 'Java', 'C', 'JavaScript',
    'TypeScript', 'Swift', 'Kotlin', 'SQL'
  ];

  const promoItems = [
    { id: 1, title: '코딩 실력 향상', caption: '체계적인 타이핑 연습', image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80' },
    { id: 2, title: '학습 환경', caption: '최적화된 교육 시스템', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80' },
    { id: 3, title: '협업과 성장', caption: '함께 배우는 코딩', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80' },
  ];

  const visiblePromos = promoItems.slice(promoStart, promoStart + 3);

  return (
    <div className="relative w-full min-h-screen mx-auto overflow-hidden bg-white">
      <HeroCarousel />

      {/* ✅ 랭킹 섹션 */}
      <section className="w-full h-[486px] bg-red-400 relative flex flex-col items-center justify-center text-white">
        <p className="text-2xl font-semibold">기준 (실시간 랭킹 자동 갱신 주기)</p>
        <h2 className="mt-2 text-3xl font-semibold">타임어택 실시간 랭킹</h2>
        <div className="grid grid-cols-3 gap-4 mt-8">
          {/* 1등 */}
          <div className="w-80 h-20 bg-white rounded-[10px] text-black flex items-center justify-between px-4">
            <span>1</span>
            <span>오늘 밥은 뭐하게</span>
            <span className="text-[10px]">08:07:06</span>
          </div>
          {/* 2등 */}
          <div className="w-80 h-20 bg-white rounded-[10px] text-black flex items-center justify-between px-4">
            <span>2</span>
            <span>재밌게타자치고싶어요</span>
            <span className="text-[10px]">08:07:00</span>
          </div>
          {/* 3등 */}
          <div className="w-80 h-20 bg-white rounded-[10px] text-black flex items-center justify-between px-4">
            <span>3</span>
            <span>집에가기제발제바...</span>
            <span className="text-[10px]">08:07:00</span>
          </div>
          {/* 4등 */}
          <div className="w-80 h-20 bg-white rounded-[10px] text-black flex items-center justify-between px-4">
            <span>4</span>
            <span>둥글게 귀엽게</span>
            <span className="text-[10px]">08:06:36</span>
          </div>
          {/* 5등 */}
          <div className="w-80 h-20 bg-white rounded-[10px] text-black flex items-center justify-between px-4">
            <span>5</span>
            <span>민타탐탐</span>
            <span className="text-[10px]">08:07:00</span>
          </div>
          {/* 6등 */}
          <div className="w-80 h-20 bg-white rounded-[10px] text-black flex items-center justify-between px-4">
            <span>6</span>
            <span>못생긴타자총애기여엉</span>
            <span className="text-[10px]">08:07:00</span>
          </div>
        </div>
      </section>

      {/* ✅ 언어 섹션 */}
      <section className="w-full py-10 text-center bg-amber-300">
        <h2 className="text-2xl font-semibold text-zinc-800">CodeRun{`{}`}</h2>
        <p className="text-3xl font-semibold text-zinc-800">
          단어 연습<span className="font-normal">으로 기본부터 튼튼하게</span>
        </p>

        <div className="grid justify-center max-w-3xl grid-cols-4 gap-6 mx-auto mt-8">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => navigate('/word', { state: { language: lang } })}
              className="bg-white rounded-[10px] p-5 flex flex-col hover:shadow-lg transition-shadow"
            >
              <div className="mb-5 text-xs font-light text-left">단어 연습</div>
              <div className="text-xl text-right">{lang}</div>
            </button>
          ))}
        </div>
      </section>

      {/* ✅ 고객 혜택 섹션 */}
      <section className="flex items-center w-full min-h-[60vh] bg-white">
        <div className="w-full max-w-6xl px-6 py-12 mx-auto">
          <h3 className="mb-6 text-xl font-semibold text-center text-gray-900">
            고객님께 전하는 Code{`{}`}에서 드리는 혜택!
          </h3>
          <div className="relative">
            <button
              aria-label="이전"
              onClick={() =>
                setPromoStart((p) => (p - 1 + promoItems.length) % promoItems.length)
              }
              className="absolute left-0 z-10 grid -translate-y-1/2 bg-gray-100 rounded-full shadow w-9 h-9 top-1/2 place-items-center hover:bg-gray-200"
            >
              <span className="text-gray-700">‹</span>
            </button>
            <button
              aria-label="다음"
              onClick={() =>
                setPromoStart((p) => (p + 1) % promoItems.length)
              }
              className="absolute right-0 z-10 grid -translate-y-1/2 bg-gray-100 rounded-full shadow w-9 h-9 top-1/2 place-items-center hover:bg-gray-200"
            >
              <span className="text-gray-700">›</span>
            </button>
            <div className="px-12">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {visiblePromos.map((card) => (
                  <div key={card.id} className="">
                    <div className="w-full h-40 bg-gray-200 border border-gray-300 rounded-xl overflow-hidden">
                      <img 
                        src={card.image} 
                        alt={card.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="px-2 mt-3 text-sm text-gray-700 truncate">
                      {card.title}
                    </div>
                    <div className="px-2 text-xs text-gray-500 truncate">
                      {card.caption}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;