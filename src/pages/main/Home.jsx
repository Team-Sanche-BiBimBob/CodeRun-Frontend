import React, { useState, useEffect, useMemo } from 'react';
import Footer from '../../components/common/footer/Footer.jsx';
import { useNavigate } from 'react-router-dom';

const slidesFromDesign = [
  { id: 1, bg: 'from-[#c53c6f] to-[#b74488] bg-gradient-to-tr', titleTop: 'CodeRun{}', title: '프로그래밍 언어가 너무 어려워요', subtitle: '쉽게 학습하고 싶은 학생들은 바로 클릭! 단어부터 먼저 해요!', cta: '단어 연습 바로 해보기' },
  { id: 2, bg: 'from-[#4d36cf] to-[#3e3bb3] bg-gradient-to-tr', badge: '전국 학교 대항전', title: '판을 뒤집을 최강 학교는 어디인가?', subtitle: '(9/24~10/26) 역대급 경품 “상품권”이 간다!', cta: '이벤트 보러가기' },
  { id: 3, bg: 'from-[#2dbd88] to-[#1fb977] bg-gradient-to-tr', titleTop: 'CodeRun X 코딩 튜팁 콜라보', title: 'CodeRun 과 함께 하는 라이브 클래스', subtitle: '집에서도 쉽고 간편하게', cta: '이벤트 보러가기' },
  { id: 4, bg: 'from-[#31c7d0] to-[#1bb6c3] bg-gradient-to-tr', date: '9/26일', title: '문제집 AI 기능 추가 업데이트', subtitle: '1개월 무료 체험 가능 (9/26 ~ 11/31)', cta: '업데이트 확인', subCta: '1개월 무료 체험' },
];

const dummyRanking = [
  { id: 1, label: '상명고등학교', value: 1 },
  { id: 2, label: '대구소프트웨어마이스터고', value: 2 },
  { id: 3, label: '한세사이버보안고', value: 3 },
  { id: 4, label: '풍무고등학교', value: 4 },
  { id: 5, label: '세명컴퓨터고', value: 5 },
  { id: 6, label: '선린인터넷고', value: 6 },
  { id: 7, label: '한국디지털미디어고', value: 7 },
  { id: 8, label: '대덕소프트웨어마이스터고', value: 8 },
];

const promoItems = [
  { id: 1, title: '돌핀코딩 라이브클래스', caption: '코딩 라이브 클래스 할인' },
  { id: 2, title: '일대일 코딩수업', caption: '궁금한 건 1:1로 해결' },
  { id: 3, title: '전문가에게 배우기', caption: '꾸준코딩으로의 초대' },
  { id: 4, title: '문제집 프리미엄', caption: '심화 문제 무료 체험' },
  { id: 5, title: '아케이드 이벤트', caption: '랭킹전 참여 혜택' },
];

const Home = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [promoStart, setPromoStart] = useState(0);

  const goPrev = () => setActive((p) => (p === 0 ? slidesFromDesign.length - 1 : p - 1));
  const goNext = () => setActive((p) => (p === slidesFromDesign.length - 1 ? 0 : p + 1));

  const visiblePromos = useMemo(() => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      items.push(promoItems[(promoStart + i) % promoItems.length]);
    }
    return items;
  }, [promoStart]);

  useEffect(() => {
    const t = setInterval(goNext, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <header className="header-placeholder"></header>

      {/* Top Carousel */}
      <section className="w-full">
        <div className="relative h-[60vh] overflow-hidden" role="region" aria-label="프로모션 슬라이더">
          {slidesFromDesign.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 z-10 transition-opacity duration-500 ease-out ${idx === active ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} ${slide.bg}`}
            >
              {/* 장식 요소: 슬라이드별 패턴 */}
              {slide.id === 1 && (
                <>
                  {/* 핑크: 좌상단→우하단 대각 빗금 + 원들 */}
                  <div className="absolute -left-40 -top-28 w-[65%] h-[150%] rotate-[-20deg] opacity-25 pointer-events-none" style={{background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.28) 0, rgba(255,255,255,0.28) 10px, transparent 10px, transparent 20px)'}} />
                  <div className="absolute rounded-full -right-24 -bottom-24 w-80 h-80 bg-white/10 blur-xl" />
                  <div className="absolute w-24 h-24 rounded-full right-10 top-10 bg-white/10" />
                </>
              )}
              {slide.id === 2 && (
                <>
                  {/* 보라: 우상단→좌하단 대각 빗금 + 작은 원 */}
                  <div className="absolute -right-40 -top-28 w-[65%] h-[150%] rotate-[20deg] opacity-25 pointer-events-none" style={{background: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.25) 0, rgba(255,255,255,0.25) 10px, transparent 10px, transparent 20px)'}} />
                  <div className="absolute w-12 h-12 rounded-full left-12 bottom-10 bg-white/10" />
                </>
              )}
              {slide.id === 3 && (
                <>
                  {/* 초록: 좌상단/우하단 서로 마주보는 겹친 원 2개 */}
                  <div className="absolute w-56 h-56 rounded-full -left-10 -top-10 bg-white/10" />
                  <div className="absolute w-40 h-40 rounded-full -left-4 -top-4 bg-white/10" />
                  <div className="absolute w-64 h-64 rounded-full -right-8 -bottom-10 bg-white/10" />
                  <div className="absolute rounded-full -right-2 -bottom-2 w-44 h-44 bg-white/10" />
                </>
              )}
              {slide.id === 4 && (
                <>
                  {/* 민트: 좌상단/우하단 큰 원 1개씩 */}
                  <div className="absolute rounded-full -left-24 -top-24 w-96 h-96 bg-white/10" />
                  <div className="absolute rounded-full -right-24 -bottom-24 w-96 h-96 bg-white/10" />
                </>
              )}

              <div className="relative z-10 flex flex-col items-start justify-center w-full h-full max-w-6xl px-6 mx-auto text-white sm:px-10">
                {slide.titleTop && <div className="mb-2 text-xl font-bold opacity-95">{slide.titleTop}</div>}
                {slide.badge && <span className="inline-block px-3 py-1 mb-3 text-xs rounded-full bg-black/40 backdrop-blur">{slide.badge}</span>}
                {slide.date && <div className="mb-2 font-semibold text-white/90">{slide.date}</div>}
                <h2 className="mb-2 text-2xl font-extrabold sm:text-3xl lg:text-4xl">{slide.title}</h2>
                {slide.subtitle && <p className="mb-4 opacity-95">{slide.subtitle}</p>}
                <div className="flex gap-3">
                  {slide.cta && (
                    <button className="px-4 py-2 text-sm font-medium transition-colors rounded bg-black/40 hover:bg-black/50">
                      {slide.cta}
                    </button>
                  )}
                  {slide.subCta && (
                    <button className="bg-black/30 hover:bg-black/40 transition-colors rounded px-3 py-1.5 text-xs font-medium">
                      {slide.subCta}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Arrows */}
          <button aria-label="이전" onClick={goPrev} className="absolute z-20 grid -translate-y-1/2 rounded-full shadow left-2 top-1/2 bg-white/90 hover:bg-white w-9 h-9 place-items-center">
            <span className="text-gray-700">‹</span>
          </button>
          <button aria-label="다음" onClick={goNext} className="absolute z-20 grid -translate-y-1/2 rounded-full shadow right-2 top-1/2 bg-white/90 hover:bg-white w-9 h-9 place-items-center">
            <span className="text-gray-700">›</span>
          </button>

          {/* Dots */}
          <div className="absolute left-0 right-0 flex justify-center gap-2 bottom-4">
            {slidesFromDesign.map((_, i) => (
              <button key={i} aria-label={`슬라이드 ${i + 1}`} onClick={() => setActive(i)} className={`w-2.5 h-2.5 rounded-full ${i === active ? 'bg-white' : 'bg-white/60'}`} />
            ))}
          </div>
        </div>

        {/* 썸네일 전환 제거 */}
      </section>

      {/* Realtime ranking (dummy) */}
      <section className="flex items-center w-full min-h-[60vh] mt-0 bg-orange-400">
        <div className="w-full max-w-6xl px-6 py-10 mx-auto">
          <h3 className="mb-4 text-lg font-semibold text-white">기준 (실시간 랭킹 자동 갱신 기준) 타이핑어택 실시간 랭킹</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {dummyRanking.map((r) => (
              <div key={r.id} className="flex items-center justify-between px-4 py-3 text-white border rounded-lg bg-orange-300/40 border-white/20">
                <div className="mr-3 text-sm truncate">{r.label}</div>
                <div className="grid w-6 h-6 text-xs font-semibold rounded-full bg-white/20 place-items-center">{r.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Word practice entry */}
      <section className="flex items-center w-full min-h-[60vh] bg-yellow-300">
        <div className="w-full max-w-6xl px-6 py-10 mx-auto">
          <h3 className="mb-5 text-lg font-semibold text-gray-900">CoRun{} 단어 연습으로 기본부터 탄탄하게</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {['Python','Java','C','JavaScript','TypeScript','Swift','Kotlin','SQL'].map((lang) => (
              <button
                key={lang}
                onClick={() => navigate('/word')}
                className="px-4 py-3 text-sm text-gray-900 bg-yellow-100 rounded-lg hover:bg-yellow-200"
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom cards */}
      <section className="flex items-center w-full min-h-[60vh] bg-white">
        <div className="w-full max-w-6xl px-6 py-12 mx-auto">
          <h3 className="mb-6 text-xl font-semibold text-center text-gray-900">고객님께 전하는 Code{}에서 드리는 혜택!</h3>
          <div className="relative">
            <button aria-label="이전" onClick={() => setPromoStart((p) => (p - 1 + promoItems.length) % promoItems.length)} className="absolute left-0 z-10 grid -translate-y-1/2 bg-gray-100 rounded-full shadow w-9 h-9 top-1/2 place-items-center hover:bg-gray-200">
              <span className="text-gray-700">‹</span>
            </button>
            <button aria-label="다음" onClick={() => setPromoStart((p) => (p + 1) % promoItems.length)} className="absolute right-0 z-10 grid -translate-y-1/2 bg-gray-100 rounded-full shadow w-9 h-9 top-1/2 place-items-center hover:bg-gray-200">
              <span className="text-gray-700">›</span>
            </button>
            <div className="px-12">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {visiblePromos.map((card) => (
                  <div key={card.id} className="">
                    <div className="w-full h-40 bg-gray-200 border border-gray-300 rounded-xl" />
                    <div className="px-2 mt-3 text-sm text-gray-700 truncate">{card.title}</div>
                    <div className="px-2 text-xs text-gray-500 truncate">{card.caption}</div>
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