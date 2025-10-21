import background from "./assets/slide2.png"
export default function HeroSlide2() {
  return (
    <div className="relative w-full h-full">
      <img
        src={background}
        alt="Slide 2"
        className="object-cover w-full h-full"
      />
      <div className="absolute text-white left-44  transform top-[50%] translate-y-[-50%]" >
        <h1 className="text-4xl font-bold font-[Pretendard] leading-[60px]">
          CodeRun{`{}`}<br/>프로그래밍 언어가 너무 어려워요
        </h1>
        <p className="text-2xl font-semibold mt-2 leading-[60px]">
          쉽게 학습하고 싶은 학생들은 바로 클릭! 단어부터 먼저 해요!
        </p>
        <button className="mt-4 w-44 h-14 bg-black border border-zinc-400 text-sm font-semibold font-[Pretendard]">
        단어 연습 바로 해보기
        </button>
      </div>
    </div>
  );
}
