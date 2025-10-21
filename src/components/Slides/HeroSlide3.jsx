import { useNavigate } from 'react-router-dom';
import background from "./assets/slide3.png"

export default function HeroSlide3() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/arcadeSelect');
  };

  return (
    <div 
      className="relative w-full h-full flex flex-col items-start bg-cover bg-center"
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
      <div className="relative text-white z-10" style={{ marginLeft: "180px" }}>
        {/* 뱃지 */}
        <div className="inline-block px-6 py-2 mb-6 text-base font-bold rounded-full border-4 border-purple-900"
             style={{ backgroundColor: '#E91E8C' }}>
          <span style={{ color: '#FFDD03' }}>전국 학교</span>
          <span style={{ color: 'white' }}> 대항전</span>
        </div>

        {/* 메인 텍스트 */}
        <h1 className="text-5xl font-bold leading-tight mb-4 max-w-2xl">
          판을 뒤집을 최강 학교는 어디인가?
        </h1>

        {/* 서브 텍스트 */}
        <p className="text-lg mb-8">
          <span style={{ color: '#FFDD03', fontWeight: '400' }}>(9/24~10/26)</span>
          <span className="font-semibold"> 역대급 경품 "상품권"이 간다!</span>
        </p>

        {/* 버튼 */}
        <button 
          onClick={handleClick}
          className="px-8 py-3 bg-black text-white text-lg font-bold rounded hover:bg-gray-900 transition-colors"
        >
          아케이드 바로가기
        </button>
      </div>
    </div>
  );
}