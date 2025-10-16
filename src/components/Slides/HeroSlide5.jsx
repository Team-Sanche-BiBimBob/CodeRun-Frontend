import background from "./assets/slide5.png"

export default function HeroSlide5() {
  return (
    <div className="relative w-full h-full">
      <img
        src={background}
        alt="Slide 5"
        className="object-cover w-full h-full"
      />
      <div className="absolute left-44" style={{ top: '50%', transform: 'translateY(-50%)' }}>
        <h1 className="text-4xl font-bold leading-tight mb-2" style={{ color: '#4050E0' }}>
          9/26일
        </h1>
        <h2 className="text-5xl font-bold leading-tight mb-4" style={{ color: '#1F2A51' }}>
          문제집 AI 기능 추가 업데이트
        </h2>
        <p className="text-xl font-medium mb-6" style={{ color: '#1F2A51' }}>
          1개월 무료 체험 가능 (9/26 ~ 11/31)
        </p>
        <button className="mt-6 px-8 py-3 bg-black text-white text-lg font-semibold hover:bg-gray-900 transition-colors">
          1개월 무료 체험
        </button>
      </div>
    </div>
  );
}