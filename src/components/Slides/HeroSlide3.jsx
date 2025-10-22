import background from "./assets/slide3.png"

export default function HeroSlide3() {
  // CTA 제거, 네비게이션 로직 삭제

  return (
    <div 
      className="relative flex flex-col items-start w-full h-full bg-center bg-cover"
      style={{ backgroundImage: `url(${background})`, justifyContent: 'center', paddingTop: '40px' }}
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
      <div className="relative z-10 text-white" style={{ marginLeft: "250px" }}>
        {/* 뱃지 */}
        <div className="inline-block px-6 py-2 mb-6 text-base font-bold border-4 border-purple-900 rounded-full"
             style={{ backgroundColor: '#E91E8C' }}>
          <span style={{ color: '#FFDD03' }}>전국 학교</span>
          <span style={{ color: 'white' }}> 대항전</span>
        </div>

        {/* 메인 텍스트 */}
        <h1 className="max-w-2xl mb-4 text-5xl font-bold leading-tight">
          판을 뒤집을 최강 학교는 어디인가?
        </h1>

        {/* 서브 텍스트 */}
        <p className="mb-8 text-lg">
          <span style={{ color: '#FFDD03', fontWeight: '400' }}>(9/24~10/26)</span>
          <span className="font-semibold"> 역대급 경품 "상품권"이 간다!</span>
        </p>

        {/* CTA 제거 */}
      </div>
    </div>
  );
}