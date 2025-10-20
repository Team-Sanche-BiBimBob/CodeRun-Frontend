import { useLocation } from 'react-router-dom';
import './App.css'
import Header from './components/common/header/Header.jsx'
import { useState, useEffect, useMemo } from 'react';
import Routers from './components/Routers/Routers.jsx';
import ToastProvider from './components/common/Toast/ToastProvider.jsx';

const App = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));
  
  useEffect(() => {
    const onStorage = () => setIsLoggedIn(!!localStorage.getItem('accessToken'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []); 

  // 헤더 표시 경로들을 메모이제이션 (/home 경로 추가)
  const headerVisibleRoutes = useMemo(() => [
    "/",
    "/home",  // 홈 경로 추가
    "/selectLanguage",
    "/practiceSelect",
    "/competition",
    "/arcadeSelect",
    "/word",
    "/sentence",
    "/full",
    "/problem",
    "/teacher",
    "/timeattack",
    "/battle",
    "/mypage",
  ], []);

  const normalizePath = useMemo(() => (path) => {
    if (!path) return "/";
    let p = path.toLowerCase();
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    return p;
  }, []);

  // 현재 경로와 헤더 표시 여부를 메모이제이션
  const { currentPath, showHeader } = useMemo(() => {
    const currentPath = normalizePath(location.pathname);
    const showHeader = headerVisibleRoutes.map(normalizePath).includes(currentPath);
    return { currentPath, showHeader };
  }, [location.pathname, headerVisibleRoutes, normalizePath]);

  return (
    <div style={{ paddingTop: showHeader ? '64px' : '0' }}>
      {showHeader && <Header isLoggedIn={isLoggedIn} />}
      <Routers />
      <ToastProvider />
    </div>
  );
};

export default App;