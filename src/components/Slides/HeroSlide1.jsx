import background from "./assets/slide1.png"

export default function HeroSlide1() {
  // CTA 제거로 네비게이션 로직 삭제

  return (
    <div className="relative w-full h-full">
      <img
        src={background}
        alt="Slide 1"
        className="object-cover w-full h-full"
      />
      <div className="absolute text-white left-80  transform top-[50%] translate-y-[-50%]" >
        <h1 className="text-4xl font-bold font-[Pretendard] leading-[60px]">
          CodeRun{`{}`}<br/>학교? 학원? 학습방이 궁금해요!
        </h1>
        <p className="text-2xl font-semibold mt-2 leading-[60px]">
          궁금하신 선생님들은 바로 클릭!
        </p>
        {/* CTA 제거 */}
      </div>
    </div>
  );
}