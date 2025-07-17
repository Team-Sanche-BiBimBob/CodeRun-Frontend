import './LoginTextField.css';
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import React from 'react';

export const LoginTextField = (props) => {
  const isPassword = props.type === 'password';

  return (
    <div className="container">
      {props.isLoginTextField ? (
        <img src='src/assets/authIcon/loginMailIcon.svg' className='login-icon' />
      ) : (
        <img src='src/assets/authIcon/loginKeyIcon.svg' className='login-icon' />
      )}
      <input
        className='login-input'
        type={props.showPassword && isPassword ? "text" : props.type || 'text'}
        placeholder={props.placeholder}
        onChange={props.onChange}
      />
      {isPassword && (
        <div onClick={props.togglePassword} style={{cursor:"pointer"}}>
          {props.showPassword ? <IoEye size={30} /> : <IoMdEyeOff size={30} />}
        </div>
      )}
    </div>
  );
};