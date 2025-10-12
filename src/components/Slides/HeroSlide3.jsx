import background from "./assets/slide3.png"

export default function HeroSlide3() {
  return (
    <div 
      className="relative w-full h-full flex flex-col items-start justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* 대각선 분할 오버레이 */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ 
            clipPath: 'polygon(0 0, 100% 0, 0 100%)',
            backgroundColor: '#583EBE'
          }}
        ></div>
        <div 
          className="absolute inset-0"
          style={{ 
            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
            backgroundColor: '#423EBE'
          }}
        ></div>
      </div>

      {/* 콘텐츠 */}
      <div className="relative text-white z-10" style={{ marginLeft: "180px" }}>
        {/* 뱃지 */}
        <div className="inline-block px-6 py-2 mb-6 text-base font-bold rounded-full bg-pink-500 border-2 border-purple-900 text-white">
          전국 학교 대항전
        </div>

        {/* 메인 텍스트 */}
        <h1 className="text-5xl font-bold leading-tight mb-4 max-w-2xl">
          판을 뒤집을 최강 학교는 어디인가?
        </h1>

        {/* 서브 텍스트 */}
        <p className="text-lg font-semibold text-gray-200 mb-8">
          (9/24~10/26) 역대급 경품 "상품권"이 간다!
        </p>

        {/* 버튼 */}
        <button className="px-8 py-3 bg-black border-2 border-white text-white text-lg font-bold rounded hover:bg-gray-900 transition-colors">
          아케이드 바로가기
        </button>
      </div>
    </div>
  );
}