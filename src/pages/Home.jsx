import React, { useEffect, useState } from 'react';
import './Home.css';
import { api } from '../server';

const Home = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const response = api.get("/api/languages");
    response.then(res => {
      console.log(res.data);
      setItems(res.data);
    });
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
                  <p className="language-description">
                    객체지향 프로그래밍의 대표적인 언어로, 다양한 플랫폼에서 실행 가능합니다.
                  </p>
                  <button className="language-button">이동하기</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="footer-placeholder"></footer>
    </div>
  );
};

export default Home;
