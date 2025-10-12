export default function HeroSlide3() {
  return (
    <div className="relative w-full h-full">
      <img
        src="https://placehold.co/1280x443/2c3e50/ffffff?text=Slide+3"
        alt="Slide 3"
        className="object-cover w-full h-full"
      />
      <div className="absolute text-white top-24 left-44">
        <h1 className="text-4xl font-bold leading-[60px]">
          단어 연습으로 <br /> 기초부터 탄탄하게!
        </h1>
        <p className="text-2xl font-semibold mt-2 leading-[60px]">
          Python, Java, Swift 등 다양한 언어 지원
        </p>
        <button className="mt-4 w-44 h-14 bg-black border border-zinc-400 text-2xl font-semibold font-[Pretendard]">
          바로가기
        </button>
      </div>
    </div>
  );
}
