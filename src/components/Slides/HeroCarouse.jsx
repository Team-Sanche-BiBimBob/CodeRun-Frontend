import React, { useState, useEffect } from "react";
import HeroSlide1 from "./HeroSlide1.jsx";
import HeroSlide2 from "./HeroSlide2.jsx";
import HeroSlide3 from "./HeroSlide3.jsx";
import HeroSlide4 from "./HeroSlide4.jsx";
import HeroSlide5 from "./HeroSlide5.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [HeroSlide1, HeroSlide2, HeroSlide3, HeroSlide4, HeroSlide5];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  // ⏰ 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index) => {
    setCurrent(index);
  };

  const next = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full overflow-hidden bg-black" style={{ height: "480px" }}>
      {/* 슬라이드 컨테이너 */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((SlideComp, idx) => (
          <div key={idx} className="flex-shrink-0 w-full h-full">
            <SlideComp />
          </div>
        ))}
      </div>

      {/* 좌우 화살표 */}
      <button
        onClick={prev}
        className="absolute p-3 text-white transition -translate-y-1/2 rounded-full top-1/2 left-8 bg-black/50 hover:bg-black z-10"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={next}
        className="absolute p-3 text-white transition -translate-y-1/2 rounded-full top-1/2 right-8 bg-black/50 hover:bg-black z-10"
      >
        <ChevronRight size={32} />
      </button>

      {/* 하단 인디케이터 */}
      <div className="absolute flex gap-3 -translate-x-1/2 bottom-8 left-1/2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              current === idx ? "bg-black" : "bg-white"
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
}