import background from "./assets/slide5.png"
export default function HeroSlide5() {
  return (
    <div className="relative w-full h-full">
      <img
        src={background}
        alt="Slide 4"
        className="object-cover w-full h-full"
      />
      <div className="absolute text-white top-24 left-44">
        <h1 className="text-4xl font-bold leading-[60px]">
        9/26일 <br /> 문제집 AI 기능 추가 업데이트
        </h1>
        <p className="text-2xl font-semibold mt-2 leading-[60px]">
        1개월 무료 체험 가능 (9/26 ~ 11/31)
        </p>
        <button className="mt-4 w-44 h-14 bg-black border border-zinc-400 text-2xl font-semibold font-[Pretendard]">
        1개월 무료 체험
        </button>
      </div>
    </div>
  );
}