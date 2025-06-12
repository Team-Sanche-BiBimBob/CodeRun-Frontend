import './LoginTextField.css';
import React from 'react';

export const LoginTextField = (props) => {
    return (
      <div className="container">
        {props.isLoginTextField ? (
            <img src='src/assets/authIcon/loginMailIcon.svg' className='login-icon'/>
        ) : (
            <img src='src/assets/authIcon/loginKeyIcon.svg' className='login-icon'/>
        )}
        <input className='login-input' type='text' placeholder={props.placeholder}/>
      </div>
    )
}