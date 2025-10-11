import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/common/footer/Footer.jsx';
import HeroCarousel from '../../components/Slides/HeroCarouse.jsx';

const Home = () => {
  const navigate = useNavigate();

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

  return (
    <div className="relative w-full min-h-screen mx-auto overflow-hidden bg-white">
      <HeroCarousel/>

      {/* ✅ 랭킹 섹션 (예시로 정리) */}
      <section className="w-full h-[486px] bg-red-400 relative flex flex-col items-center justify-center text-white">
        <p className="text-2xl font-semibold">기준 (실시간 랭킹 자동 갱신 주기)</p>
        <h2 className="mt-2 text-3xl font-semibold">타임어택 실시간 랭킹</h2>
        <div className="grid grid-cols-3 gap-4 mt-8">
          {/* 예시 랭킹 카드 */}
          <div className="w-80 h-20 bg-white rounded-[10px] text-black flex items-center justify-between px-4">
            <span>1</span>
            <span>오늘 밤은 삐딱하게</span>
            <span className="text-[10px]">08:07:06</span>
          </div>
          <div className="w-80 h-20 bg-white rounded-[10px] text-black flex items-center justify-between px-4">
            <span>2</span>
            <span>제발집에가고싶어요</span>
            <span className="text-[10px]">08:07:00</span>
          </div>
          <div className="w-80 h-20 bg-white rounded-[10px] text-black flex items-center justify-between px-4">
            <span>3</span>
            <span>집에가지마베이베~</span>
            <span className="text-[10px]">08:07:00</span>
          </div>
        </div>
      </section>

      <section className="w-full py-10 text-center bg-amber-300">
        <h2 className="text-2xl font-semibold text-zinc-800">CodeRun{`{}`}</h2>
        <p className="text-3xl font-semibold text-zinc-800">
          단어 연습<span className="font-normal">으로 기본부터 튼튼하게</span>
        </p>

        <div className="grid justify-center max-w-3xl grid-cols-4 gap-6 mx-auto mt-8">
          {["Python", "Java", "C", "JavaScript", "Swift", "Kotlin", "SQL", "TypeScript"].map((lang) => (
            <div
              key={lang}
              className="bg-white rounded-[10px] p-5 flex flex-col"
            >
              <div className="mb-5 text-xs font-light text-left">단어 연습</div>
              <div className="text-xl text-right">{lang}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;