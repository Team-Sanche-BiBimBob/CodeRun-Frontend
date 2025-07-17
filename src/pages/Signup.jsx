import React, { useState } from "react";
import "./Auth.css";
import { LoginTextField } from "../components/Auth/TextField/LoginTextField";
import { api } from "../server";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (!email || !password || !confirmPassword) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    api
      .post("/api/auth/signup", {
        email,
        password,
      })
      .then((response) => {
        if (response.data.success) {
          alert("회원가입 성공!");
        } else {
          alert("회원가입 실패: " + (response.data.message || "서버 오류"));
        }
      })
      .catch((error) => {
        console.error("서버 에러 ", error);
        alert("회원가입 요청 중 에러 발생!");
      });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div
          className="auth-left"
          style={{
            backgroundImage: "url('/src/assets/authIcon/loginBanner.png')",
          }}
        >
          <span className="logo-title">CodeRun{"{ }"}</span>
          <span className="sublogo-title">어제보다 한글자 더 빠르게</span>
        </div>

        <div className="auth-right">
          <div className="input-group">
            <LoginTextField
              isLoginTextField={true}
              placeholder="이메일을 입력하세요."
              onChange={(e) => setEmail(e.target.value)}
              type="text"
            />
          </div>
          <div className="input-group">
            <LoginTextField
              placeholder="비밀번호를 입력하세요."
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              showPassword={showPassword}
              togglePassword={() => setShowPassword(!showPassword)}
            />
          </div>
          <div className="input-group">
            <LoginTextField
              placeholder="비밀번호를 재입력하세요."
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              showPassword={showPassword}
              togglePassword={() => setShowPassword(!showPassword)}
            />
          </div>
          <button className="auth-btn" onClick={handleSubmit}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
