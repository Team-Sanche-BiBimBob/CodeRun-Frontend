import background from "./assets/slide5.png"

export default function HeroSlide5() {
  // CTA 제거, 네비게이션 로직 삭제

  return (
    <div className="relative w-full h-full">
      <img
        src={background}
        alt="Slide 5"
        className="object-cover w-full h-full"
      />
      <div className="absolute left-80" style={{ top: '50%', transform: 'translateY(-50%)' }}>
        <h1 className="mb-2 text-4xl font-bold leading-tight" style={{ color: '#4050E0' }}>
          9/26일
        </h1>
        <h2 className="mb-4 text-5xl font-bold leading-tight" style={{ color: '#1F2A51' }}>
          문제집 AI 기능 추가 업데이트
        </h2>
        <p className="mb-6 text-xl font-medium" style={{ color: '#1F2A51' }}>
          1개월 무료 체험 가능 (9/26 ~ 11/31)
        </p>
        {/* CTA 제거 */}
      </div>
    </div>
  );
}