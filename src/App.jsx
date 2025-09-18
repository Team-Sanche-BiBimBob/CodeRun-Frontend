import { useLocation } from 'react-router-dom';
import './App.css'
import Header from './components/common/header/Header.jsx'
import { useState, useEffect } from 'react';
import Routers from './components/Routers/Routers.jsx';

const App = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  useEffect(() => {
    const onStorage = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []); 

  const headerVisibleRoutes = [
    "/",
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
  ];

  const normalizePath = (path) => {
    if (!path) return "/";
    let p = path.toLowerCase();
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    return p;
  };

  const currentPath = normalizePath(location.pathname);
  const showHeader = headerVisibleRoutes.map(normalizePath).includes(currentPath);

  return (
    <div style={{ paddingTop: showHeader ? '80px' : '0' }}>
      {showHeader && <Header isLoggedIn={isLoggedIn} />}
      <Routers />
    </div>
  );
};

export default App;

              