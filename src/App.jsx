import { Routes, Route, useLocation } from 'react-router';
import './App.css'
import Header from './components/Header/Header.jsx'
import LanguageSelection from './pages/LanguageSelection'
import Fullcode from './pages/Fullcode'
import Home from './pages/Home'
import WordPage from './pages/WordPage'
import SentencePage from './pages/SentencePage'
import CodingPlatform from './pages/CodingPlatform.jsx';
import TeacherView from './pages/TeacherView.jsx'
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
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

