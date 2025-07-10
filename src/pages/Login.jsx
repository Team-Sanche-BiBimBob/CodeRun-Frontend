import React from "react";
import "./Auth.css";
import { LoginTextField } from "../components/Auth/TextField/LoginTextField";

import { useState } from "react";
import { api } from "../server";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChangeEmail = (e)=>{
    setEmail(e.target.value);
  }

  const handleChangePassword = (e)=>{
    setPassword(e.target.value);
  }

  const handleLogin = ()=>{
    api.post("/api/auth/signin", {
        email,
        password
      }, {
        headers:{
          'Content-Type':'application/json; charset=utf-8'
        }
    })
    .then((response)=>{
      // 로그인 성공
      console.log(response);
      localStorage.setItem("token", response.data.accessToken);
      // 홈으로 이동?
    })
    .catch((error)=>{
      console.log(error);
    });
  }

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
            <LoginTextField isLoginTextField={true} placeholder="이메일" onChange={handleChangeEmail}/>
          </div>
          <div className="input-group">
            <LoginTextField placeholder="비밀번호" onChange={handleChangePassword}/>
          </div>
          <button className="auth-btn" onClick={handleLogin}>로그인</button>
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
