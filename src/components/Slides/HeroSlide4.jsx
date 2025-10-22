import background from "./assets/slide4.png"

export default function HeroSlide4() {
  // CTA 제거로 네비게이션 로직 삭제

  const textStrokeStyle = {
    WebkitTextStroke: '3px black',
    paintOrder: 'stroke fill',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
  };

  const titleStrokeStyle = {
    WebkitTextStroke: '10px black',
    paintOrder: 'stroke fill',
    textShadow: '3px 3px 6px rgba(0,0,0,0.5)'
  };

  return (
    <div className="relative w-full h-full">
      <img
        src={background}
        alt="Slide 4"
        className="object-cover w-full h-full"
      />
      <div className="absolute text-white left-80" style={{ top: '55%', transform: 'translateY(-50%)' }}>
        <p className="mb-1 text-2xl font-bold" style={textStrokeStyle}>
          CodeRun X 코딩 돌핀 콜라보
        </p>
        <h1 className="mb-3 text-5xl font-bold" style={titleStrokeStyle}>
          CodeRun과 함께 하는 라이브 클래스
        </h1>
        <p className="mb-8 text-xl font-medium" style={textStrokeStyle}>
          집에서도 쉽고 간편하게
        </p>
        {/* CTA 제거 */}
      </div>
    </div>
  );
}