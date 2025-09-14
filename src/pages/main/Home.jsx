import React, { useState, useEffect } from 'react';
import './Home.css';
import Footer from '../../components/common/footer/Footer.jsx';
import { useNavigate } from 'react-router-dom'; // ✅ 추가

const Home = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate(); // ✅ 추가

  useEffect(() => {
    const dummyData = [
      {
        name: 'Python',
        description: '간결하고 배우기 쉬운 문법으로 다양한 분야에서 사랑받는 프로그래밍 언어입니다.',
      },
      {
        name: 'C',
        description: '시스템 프로그래밍에 강력하며 하드웨어 제어에 많이 사용되는 저수준 언어입니다.',
      },
      {
        name: 'JavaScript',
        description: '웹 개발에 필수적인 언어로, 동적인 사용자 인터페이스 구현에 주로 사용됩니다.',
      },
    ];
    setItems(dummyData);
  }, []);

  return (
    <div className="home-container">
      <header className="header-placeholder"></header>

      <section className="hero-section">
        <div className="hero-left"></div>
        <div className="hero-right"></div>
        <div className="hero-content">
          <h1 className="hero-title">CodeRun{"{}"}</h1>
          <p className="hero-subtitle">어제보다 한 글자 더 빠르게</p>
        </div>
      </section>

      <div className="content-wrapper">
        <section className="languages-section">
          <h2 className="section-title">최근 인기 있는 언어</h2>
          <div className="languages-grid">
            {items.slice(0, 3).map((language, index) => (
              <div key={index} className="language-card">
                <div className="language-header">
                  <h3 className="language-name">{language.name}</h3>
                </div>
                <div className="language-body">
                  <p className="language-description">{language.description}</p>
                  <button
                    className="language-button"
                    onClick={() => navigate('/choice')}
                  >
                    이동하기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
