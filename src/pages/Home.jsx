import React from 'react';
import './Home.css';

const Home = () => {
 return (
   <div className="home-container">
     <header className="header-placeholder">
     </header>


     <section className="hero-section">
     <div className="hero-section">
  <div className="hero-left"></div>
  <div className="hero-right"></div>
  <div className="hero-content">
    <h1 className="hero-title">CodeRun{"{}"}</h1>
    <p className="hero-subtitle">어제보다 한 글자 더 빠르게</p>
  </div>
</div>


     </section>


     <div className="content-wrapper">
       <section className="weekly-challenge">
       <div class="weekly-challenge">
  <div class="challenge-header">주간 도전 과제</div>
  <div class="challenge-body">
    <h3>너의 췌장이 먹고싶어</h3>
    <p>아아아아앙아아앙아앙ㅇ 집갈래에</p>
    <div class="challenge-meta">
      <span>난이도: <strong>중급</strong></span>
      <span>포인트: <strong>100점</strong></span>
      <span>참가자: <strong>326명</strong></span>
    </div>
    <button class="challenge-button">도전하기</button>
  </div>
</div>

       </section>

       <section className="ranking-section">
         <h2 className="ranking-title">랭킹</h2>
         <div className="ranking-table">
         </div>
       </section>
     </div>
     <footer className="footer-placeholder">
     </footer>
   </div>
 );
};

export default Home;