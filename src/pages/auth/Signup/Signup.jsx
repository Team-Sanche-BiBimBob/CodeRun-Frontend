import { useState } from "react";
import { api } from "../../../server";
import backgroundImage from "../../../assets/login-background.png";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickname, setNickname] = useState("");
  const [step, setStep] = useState(1);

  const [plan, setPlan] = useState("free");

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      console.log("회원가입 최종 제출", { email, password, nickname });
      api.post("/api/auth/signup", {
        email,
        password,
        username: nickname,
      })
        .then((response) => {
          console.log("회원가입 성공", response);
          toast.success("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
          window.location.href = "/login";
        })
        .catch((error) => {
          console.error("서버 에러 ", error);
          toast.error(error.response.data.error);
        }); 
    }
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <>
          <p className="font-bold mt-[56px] mb-[42px] text-[30px]">회원가입</p>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="이메일을 입력해주세요"
            className="w-full h-[56px] border border-[rgba(146,146,146,0.6)] rounded-[10px] mb-[20px] pl-[20px] text-[20px] focus:outline-none"
          />
          {/* <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            type="text"
            placeholder="인증번호를 입력해주세요"
            className="w-full h-[56px] border border-[rgba(146,146,146,0.6)] rounded-[10px] mb-[20px] pl-[20px] text-[20px] focus:outline-none"
          /> */}
        </>
      );
    }
    if (step === 2) {
      return (
        <>
          <p className="font-bold mt-[56px] mb-[42px] text-[30px]">비밀번호 설정</p>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="비밀번호를 입력해주세요"
            className="w-full h-[56px] border border-[rgba(146,146,146,0.6)] rounded-[10px] mb-[20px] pl-[20px] text-[20px] focus:outline-none"
          />
          <input
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            className="w-full h-[56px] border border-[rgba(146,146,146,0.6)] rounded-[10px] mb-[20px] pl-[20px] text-[20px] focus:outline-none"
          />
          {password && passwordCheck && password !== passwordCheck && (
            <p className="text-sm text-red-500">비밀번호가 일치하지 않습니다.</p>
          )}
        </>
      );
    }
    if (step === 3) {
      return (
        <>
          <p className="font-bold mt-[56px] mb-[42px] text-[30px]">닉네임 설정</p>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            type="text"
            placeholder="닉네임을 입력해주세요"
            className="w-full h-[56px] border border-[rgba(146,146,146,0.6)] rounded-[10px] mb-[20px] pl-[20px] text-[20px] focus:outline-none"
          />
        </>
      );
    }
    if (step === 4) {
      return (
        <div>
          <p className="font-bold mt-[56px] mb-[42px] text-[30px]">회원가입</p>

          <div className="space-y-4 mb-[30px]">
            {[
              { key: "personal", label: "개인 요금제", desc: "개인 요금제로, 모든 프리미엄 기능을 사용할 수 있습니다." },
              { key: "school", label: "학교 요금제", desc: "학교 요금제로, 모든 프리미엄 기능 사용 및 학생 지정이 가능합니다." },
              { key: "free", label: "무료 요금제", desc: "무료 요금제로, 무료 서비스를 이용할 수 있습니다." },
            ].map((p) => (
              <div
                key={p.key}
                onClick={() => setPlan(p.key)}
                className={`w-full border rounded-[10px] p-4 cursor-pointer transition ${plan === p.key ? "border-[#14C5B1] bg-[#E6FFFA]" : "border-gray-300"
                  }`}
              >
                <p className="font-bold text-[20px] mb-1">{p.label}</p>
                <p className="text-gray-500 text-[16px]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  const isStepValid = () => {
    // if (step === 1) return email.includes("@") && code.length > 0;
    if (step === 1) return email.includes("@");
    if (step === 2) return password.length >= 6 && password === passwordCheck;
    if (step === 3) return nickname.trim().length > 0;
    if (step === 4) return true;
    return false;
  };

  return (
    <div className="fixed w-full h-full bg-[#E6E6E6] flex justify-center items-center flex-row">
      <div className="w-[70%] h-[80%] bg-white flex flex-row rounded-[30px] min-w-[1100px] relative overflow-hidden">
        <ArrowLeft
          onClick={() => {
            window.history.back();
          }}
          className="absolute m-[23px] w-[35px] h-[35px] text-white hover:cursor-pointer z-10"
        />

        {/* 왼쪽 이미지 영역 */}
        <div className="w-1/2 h-full">
          <img
            src={backgroundImage}
            className="w-full h-full object-cover rounded-l-[30px]"
          />
        </div>

        {/* 오른쪽 폼 영역 */}
        <div className="w-1/2 flex flex-col justify-center p-[65px] pb-[10px] pt-[10px]">
          <div className="flex justify-between h-[85%] flex-col mb-[20px]">
            <div>
              {/* 진행바 */}
              <div className="relative w-full bg-[#E0E0E0] h-[12px] rounded-full">
                <div
                  className="absolute top-0 left-0 h-[12px] bg-[#14C5B1] rounded-full transition-all duration-300"
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                />
                <div className="flex absolute top-1/2 justify-between w-full -translate-y-1/2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-[28px] h-[28px] rounded-full text-center leading-[28px] font-bold transition-all duration-300 ${i <= step ? "bg-[#14C5B1]" : "bg-[#E0E0E0]"
                        }`}
                    />
                  ))}
                </div>
              </div>

              <div>{renderStepContent()}</div>
            </div>

            {/* 버튼 */}
            <button
              disabled={!isStepValid()}
              className={`w-full h-[58px] rounded-[10px] text-[18px] font-bold transition-colors text-white ${isStepValid()
                ? "bg-[#14C5B1] hover:bg-[#16AC9B] cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
                }`}
              onClick={handleNext}
            >
              {step < 4 ? "다음" : "회원가입"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Signup;
