// Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#2E2E2E] text-white py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* 로고 및 설명 */}
        <div>
          <h2 className="text-2xl font-bold mb-4">CodeRun</h2>
          <p className="text-gray-300">
            영어 타자와 코딩실력을 재미있게 배울 수 있는 플랫폼
          </p>
        </div>

        {/* 메뉴 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">메뉴</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/">홈</Link></li>
            <li><Link to="/competition">경쟁전</Link></li>
            <li><Link to="/selectLanguage">타자연습</Link></li>
            <li><Link to="/study">학습방</Link></li>
            <li><Link to="/problem">문제집</Link></li>
          </ul>
        </div>

        {/* 고객센터 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">고객센터</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/contact">문의하기</Link></li>
            <li><Link to="/terms">이용약관</Link></li>
            <li><Link to="/privacy">개인정보처리방침</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
