export default function HeroSlide4() {
  return (
    <div className="relative w-full h-full">
      <img
        src="https://placehold.co/1280x443/f39c12/ffffff?text=Slide+4"
        alt="Slide 4"
        className="object-cover w-full h-full"
      />
      <div className="absolute text-white top-24 left-44">
        <h1 className="text-4xl font-bold leading-[60px]">
          라이브 클래스와 함께 <br /> 실시간으로 성장하세요!
        </h1>
        <p className="text-2xl font-semibold mt-2 leading-[60px]">
          전문 강사와 함께하는 실시간 코딩 수업
        </p>
        <button className="mt-4 w-44 h-14 bg-black border border-zinc-400 text-2xl font-semibold font-[Pretendard]">
          수강신청
        </button>
      </div>
    </div>
  );
}
