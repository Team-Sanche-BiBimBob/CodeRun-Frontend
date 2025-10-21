import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../server";
import { toast } from "react-toastify";

import backgroundImage from "../../../assets/login-background.png";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  }

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  }

  // onKeyPress 대신 onKeyDown 사용
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  const handleSubmit = () => {
    if (!email || !password) {
      toast.warn("모든 항목을 입력해주세요.");
      return;
    }

    api
      .post("/api/auth/signin", {
        email,
        password,
      })
      .then((response) => {
        localStorage.setItem('accessToken', response.data.accessToken);
        // 사용자 정보 저장 (실제 API 응답에 따라 조정 필요)
        const userInfo = {
          name: response.data.name || response.data.username || email.split('@')[0],
          email: email,
          role: response.data.role
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        // storage 이벤트를 수동으로 트리거하여 App.js의 상태 업데이트
        window.dispatchEvent(new Event('storage'));
        
        toast.success("로그인에 성공했습니다.");
        // home.jsx로 이동
        navigate('/home');
      })
      .catch((error) => {
        console.error("서버 에러 ", error);
        toast.error(error.response?.data?.error || "로그인에 실패했습니다.");
      });
  };

  return (
    <div className="fixed w-full h-full bg-[#E6E6E6] flex justify-center items-center flex-row">
      <div className="w-[70%] h-[80%] bg-white flex flex-row justify-between rounded-[30px] min-w-[1100px] relative overflow-hidden">
        <ArrowLeft
          onClick={() => { window.history.back() }}
          className="absolute m-[23px] w-[35px] h-[35px] text-white hover:cursor-pointer z-10"
        />

        <div className="w-1/2 h-full">
          <img
            src={backgroundImage}
            className="w-full h-full object-cover rounded-l-[30px]"
          />
        </div>

        <div className="w-1/2 flex flex-col justify-center p-[65px]">
          <div className="flex justify-between h-[85%] flex-col mb-[20px]">
            <p className="font-bold mb-[10px] text-[30px]">로그인</p>
            <div>
              <p className="text-[24px] mb-[11px]">이메일</p>
              <input
                onChange={handleChangeEmail}
                onKeyDown={handleKeyDown}  // onKeyPress → onKeyDown으로 변경
                type="text"
                placeholder="아이디를 입력해주세요"
                className="w-full h-[56px] border border-[rgba(146,146,146,0.6)] rounded-[10px] mb-[20px] pl-[20px] text-[20px] focus:outline-none"
                value={email}
              />
              <p className="text-[24px] mb-[11px]">비밀번호</p>
              <input
                onChange={handleChangePassword}
                onKeyDown={handleKeyDown}  // onKeyPress → onKeyDown으로 변경
                type="password"
                placeholder="비밀번호를 입력해주세요"
                className="w-full h-[56px] border border-[rgba(146,146,146,0.6)] rounded-[10px] mb-[20px] pl-[20px] text-[20px] focus:outline-none"
                value={password}
              />
            </div>
            <div>
              <button
                onClick={handleSubmit}
                className="w-full h-[58px] bg-[#14C5B1] rounded-[10px] text-[18px] font-bold hover:bg-[#16AC9B] transition-colors text-white"
              >
                로그인
              </button>
              <p className="mt-[20px] text-[16px] text-center text-gray-600">
                계정이 없으신가요?{" "}
                <a href="/signup" className="text-[#14C5B1] hover:underline">계정 생성하기</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;