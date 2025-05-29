import React from 'react';
import './Signup.css';

const Signup = () => {
  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-left">
          <h1 className="logo">CodeRun{'{ }'}</h1>
          <p>어제보다 한글자 더 빠르게</p>
        </div>

        <div className="login-right">
          <div className="input-group">
            <input type="email" placeholder="이메일을 입력해주세요" />
          </div>
          <div className="input-group">
            <input type="password" placeholder="비밀번호를 입력해주세요" />
          </div>
          <button className="login-btn">로그인</button>
          <p className="signup-link">
            계정이 없으신가요? <a href="#">회원가입</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
