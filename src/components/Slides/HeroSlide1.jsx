import background from "./assets/slide1.png"
export default function HeroSlide1() {
  return (
    <div className="relative w-full h-full">
      <img
        src={background}
        alt="Slide 1"
        className="object-cover w-full h-full"
      />
      <div className="absolute text-white left-44  transform top-[50%] translate-y-[-50%]" >
        <h1 className="text-4xl font-bold font-[Pretendard] leading-[60px]">
          CodeRun{`{}`}<br/>학교? 학원? 학습방이 궁금해요!
        </h1>
        <p className="text-2xl font-semibold mt-2 leading-[60px]">
          궁금하신 선생님들은 바로 클릭!
        </p>
        <button className="mt-4 w-44 h-14 bg-black border border-zinc-400 text-2xl font-semibold font-[Pretendard]">
          확인하기
        </button>
      </div>
    </div>
  );
}
