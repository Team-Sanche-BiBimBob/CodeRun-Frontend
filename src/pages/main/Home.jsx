import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../server/index.js';
import Footer from '../../components/common/footer/Footer.jsx';
import HeroCarousel from '../../components/Slides/HeroCarouse.jsx';

const Home = () => {
  const navigate = useNavigate();
  const [promoStart, setPromoStart] = useState(0);
  const [languages, setLanguages] = useState([]);

  const rankings = [
    { rank: 1, name: '김동현', time: '00:32:06' },
    { rank: 2, name: '최해성', time: '00:32:50' },
    { rank: 3, name: '서민덕', time: '00:34:00' },
    { rank: 4, name: '서희원', time: '00:35:36' },
    { rank: 5, name: '최장우', time: '00:36:00' },
    { rank: 6, name: '차동규', time: '01:39:00' },
  ];

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await api.get('/api/languages', {
          headers: { 'x-auth-not-required': true }
        });
        setLanguages(response.data);
      } catch (error) {
        console.error('Failed to fetch languages:', error);
      }
    };
    fetchLanguages();
  }, []);

  const promoItems = [
    { id: 1, title: '코딩 실력 향상', caption: '체계적인 타이핑 연습', image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80' },
    { id: 2, title: '학습 환경', caption: '최적화된 교육 시스템', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80' },
    { id: 3, title: '협업과 성장', caption: '함께 배우는 코딩', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80' },
  ];

  const visiblePromos = promoItems.slice(promoStart, promoStart + 3);

  return (
    <div className="relative w-full min-h-screen mx-auto overflow-hidden bg-white">
      <HeroCarousel />

      <section className="w-full h-[486px] bg-red-400 relative flex flex-col items-center justify-center text-white">
        <p className="text-2xl font-semibold">기준 (실시간 랭킹 자동 갱신 주기)</p>
        <h2 className="mt-2 text-3xl font-semibold">타임어택 실시간 랭킹</h2>
        <div className="grid grid-cols-3 gap-4 mt-8">
          {rankings.map((ranking) => (
            <div key={ranking.rank} className="w-80 h-20 bg-white rounded-[10px] text-black flex items-center justify-between px-4">
              <span>{ranking.rank}</span>
              <span>{ranking.name}</span>
              <span className="text-[10px]">{ranking.time}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full py-10 text-center bg-amber-300">
        <h2 className="text-2xl font-semibold text-zinc-800">CodeRun{`{}`}</h2>
        <p className="text-3xl font-semibold text-zinc-800">
          단어 연습<span className="font-normal">으로 기본부터 튼튼하게</span>
        </p>

        <div className="grid justify-center max-w-3xl grid-cols-4 gap-6 mx-auto mt-8">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => navigate('/word', { state: { languageId: lang.id } })}
              className="bg-white rounded-[10px] p-5 flex flex-col hover:shadow-lg transition-shadow"
            >
              <div className="mb-5 text-xs font-light text-left">단어 연습</div>
              <div className="text-xl text-right">{lang.name}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="flex items-center w-full min-h-[60vh] bg-white">
        <div className="w-full max-w-6xl px-6 py-12 mx-auto">
          <h3 className="mb-6 text-xl font-semibold text-center text-gray-900">
            고객님께 전하는 CodeRun{`{}`}에서 드리는 혜택!
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
                    <div className="w-full h-40 overflow-hidden bg-gray-200 border border-gray-300 rounded-xl">
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
