import React from "react";
import "../Auth.css";
import { LoginTextField } from "../../../components/Auth/TextField/LoginTextField";

import { useState } from "react";
import { api } from "../../../server";
import axios from "axios";
// react-router-dom에서는 href 훅이 없으며, 링크 이동은 useNavigate 또는 Link를 사용합니다.
import { useNavigate } from "react-router-dom";
import loginBanner from "../../../assets/authIcon/loginBanner.png";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  

  const handleChangeEmail = (e)=>{
    setEmail(e.target.value);
  }

  const handleChangePassword = (e)=>{
    setPassword(e.target.value);
  }

  const handleSubmit = () => {
      if (!email || !password) {
        alert("모든 항목을 입력해주세요.");
        return;
      }
  
  
      api
        .post("/api/auth/signin", {
          email,
          password,
        })
        .then((response) => {
          console.log(response.data.error)
          if (response.data.error == null) {
            localStorage.setItem('accessToken', response.data.accessToken);
            window.location.href = "/";
          } else {
            alert("로그인 실패: " + (response.data.message || "서버 오류"));
          }
        })
        .catch((error) => {
          console.error("서버 에러 ", error);
          alert("로그인 요청 중 에러 발생!");
        });
    };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div
          className="auth-left"
          style={{
            backgroundImage: `url(${loginBanner})`,
          }}
        >
          <span className="logo-title">CodeRun{"{ }"}</span>
          <span className="sublogo-title">어제보다 한글자 더 빠르게</span>
        </div>

        <div className="auth-right">
          <div className="input-group">
            <LoginTextField isLoginTextField={true} placeholder="이메일을 입력하세요." onChange={handleChangeEmail}/>
          </div>
          <div className="input-group">
            <LoginTextField placeholder="비밀번호를 입력하세요." togglePassword={() => setShowPassword(!showPassword)} showPassword={showPassword} onChange={handleChangePassword} type="password"/>
            
          </div>
          <button className="auth-btn" onClick={handleSubmit}>로그인</button>
          <p className="signup-link">
            계정이 없으신가요?{" "}
            <a href="/signup" className="to-signup">
              회원가입
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
