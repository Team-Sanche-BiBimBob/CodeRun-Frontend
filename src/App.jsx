import { useLocation } from 'react-router';
import './App.css'
import Header from './components/Header/Header.jsx'
import { useState, useEffect } from 'react';
import Routers from './components/Routers.jsx';

const App = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const onStorage = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const headerVisibleRoutes = ["/", "/selectLanguage", "/full", "/word", "/sentence", "/teacher"];

  const showHeader = headerVisibleRoutes.includes(location.pathname);

  return (
    <div style={{ paddingTop: '80px' }}>
      <Header isLoggedIn={isLoggedIn} />
      <Routers />
    </div>
  );
};

export default App;

