import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';  // 추가
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>  {/* 여기서 감싸기 */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
