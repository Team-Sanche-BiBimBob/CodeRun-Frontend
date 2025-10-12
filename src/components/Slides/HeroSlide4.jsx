import background from "./assets/slide4.png"

export default function HeroSlide4() {
  return (
    <div className="relative w-full h-full">
      <img
        src={background}
        alt="Slide 4"
        className="object-cover w-full h-full"
      />
      <div className="absolute text-white top-35 left-44">
        <p className="text-2xl font-bold mb-1" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          CodeRun X 코딩 돌핀 콜라보
        </p>
        <h1 className="text-5xl font-bold mb-3" style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.9)' }}>
          CodeRun과 함께 하는 라이브 클래스
        </h1>
        <p className="text-xl font-medium mb-8" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          집에서도 쉽고 간편하게
        </p>
        <button className="px-8 py-3 bg-black text-white text-lg font-semibold hover:bg-gray-900 transition-colors">
          이벤트 바로가기
        </button>
      </div>
    </div>
  );
}