import React from "react";
import "./Auth.css";
import { LoginTextField } from "../components/Auth/TextField/LoginTextField";
import { useState } from "react";

import { api } from "../server";

const Signup = () => {
  const [email, setEamil] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleChangeEmail = (e)=>{
    setEamil(e.target.value);
  }

  const handleChangePassword = (e)=>{
    setPassword(e.target.value);
  }

  const handleChangeUsername = (e)=>{
    setUsername(e.target.value);
  }

  const handleSubmit = ()=>{
    if(email == "" || password == "" || username==""){
      alert("모든 항목을 입력해주세요.");
      return;
    } 

    api.post("/api/auth/signup", {
        username,
        email,
        password
      }, {
        headers:{
          'Content-Type':'application/json; charset=utf-8'
        }
    })
    .then((response)=>{
      console.log(response);
    })
    .catch((error)=>{
      console.log(error);
    });
  }

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
            <LoginTextField isLoginTextField={true} placeholder="이메일을 입력하세요." onChange={handleChangeUsername}/>
          </div>
          <div className="input-group">
            <LoginTextField placeholder="비밀번호를 입력하세요." onChange={handleChangeEmail} type='password'/>
          </div>
          <div className="input-group">
            <LoginTextField placeholder="비밀번호를 재입력하세요." onChange={handleChangePassword} type='password'/>
          </div>
          <button className="auth-btn" onClick={handleSubmit}>회원가입</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;