import React from "react";
import "./Login.css";
import { LoginTextField } from "../components/Auth/TextField/LoginTextField";

const Login = () => {
  return (
    <div className="login-wrapper"> 
      <div className="login-container">
        <div className="login-left">
          <span className="logo-title">CodeRun{"{ }"}</span>
          <span className="sublogo-title">어제보다 한글자 더 빠르게</span>
        </div>

        <div className="login-right">
          <div className="input-group">
          <LoginTextField isLoginTextField={true} placeholder='이메일'/>

          </div>
          <div className="input-group">
            <LoginTextField placeholder='비밀번호'/>
          </div>
          <button className="login-btn">로그인</button>
          <p className="signup-link">
            계정이 없으신가요? <a href="/signup" className="to-signup">회원가입</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
