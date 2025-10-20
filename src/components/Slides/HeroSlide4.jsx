import { useNavigate } from 'react-router-dom';
import background from "./assets/slide4.png"

export default function HeroSlide4() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/*');
  };

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
      <div className="absolute text-white left-44" style={{ top: '55%', transform: 'translateY(-50%)' }}>
        <p className="text-2xl font-bold mb-1" style={textStrokeStyle}>
          CodeRun X 코딩 돌핀 콜라보
        </p>
        <h1 className="text-5xl font-bold mb-3" style={titleStrokeStyle}>
          CodeRun과 함께 하는 라이브 클래스
        </h1>
        <p className="text-xl font-medium mb-8" style={textStrokeStyle}>
          집에서도 쉽고 간편하게
        </p>
        <button 
          onClick={handleClick}
          className="px-8 py-3 bg-black text-white text-lg font-semibold hover:bg-gray-900 transition-colors"
        >
          이벤트 바로가기
        </button>
      </div>
    </div>
  );
}