import React from "react";
import "./Auth.css";
import { LoginTextField } from "../components/Auth/TextField/LoginTextField";

const Signup = () => {
  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-left" style={{
          backgroundImage: "url('/src/assets/authIcon/loginBanner.png')"
        }}>
          <span className="logo-title">CodeRun{"{ }"}</span>
          <span className="sublogo-title">어제보다 한글자 더 빠르게</span>
        </div>

        <div className="auth-right">
          <div className="input-group">
            <LoginTextField isLoginTextField={true} placeholder="이메일을 입력하세요" />
          </div>
          <div className="input-group">
            <LoginTextField placeholder="비밀번호를 입력하세요" />
          </div>
          <div className="input-group">
            <LoginTextField placeholder="비밀번호를 재입력하세요" />
          </div>
          <button className="auth-btn">회원가입</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;