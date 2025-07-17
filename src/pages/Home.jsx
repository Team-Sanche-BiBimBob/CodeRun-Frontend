import React, { useEffect, useState } from 'react';
import './Home.css';
import { api } from '../server';
import Footer from '../components/Footer/Footer.jsx';

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
                    {language.description}
                  </p>
                  <button className="language-button">이동하기</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer/>
    </div>
  );
};

export default Home;
