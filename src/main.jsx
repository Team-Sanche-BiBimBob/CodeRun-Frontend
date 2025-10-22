import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import '@fontsource/pretendard/200.css';
import '@fontsource/pretendard/300.css';
import '@fontsource/pretendard/400.css';
import '@fontsource/pretendard/500.css';
import '@fontsource/pretendard/600.css';
import '@fontsource/pretendard/700.css';
import '@fontsource/pretendard/800.css';
import '@fontsource/pretendard/900.css';
import './index.css';

// Monaco Editor Promise 취소 오류 무시
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.name === 'Canceled') {
    event.preventDefault();
    console.warn('Ignored Canceled Promise (Monaco Editor cleanup):', event.reason);
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>  {/* 여기서 감싸기 */}
    <App />
  </BrowserRouter>
);
