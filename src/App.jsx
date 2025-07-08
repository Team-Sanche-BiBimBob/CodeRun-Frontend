 
import { Routes, Route, useLocation } from 'react-router';
import './App.css'
import Header from './components/Header/Header.jsx'
import LanguageSelection from './pages/LanguageSelection'
import Home from './pages/Home'
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import MyPage from './pages/MyPage.jsx';
import WordPage from './pages/WordPage.jsx';

const App = () => {
  const location = useLocation();

  const headerVisibleRoutes = ["/", "/select-language", "/competition","/mypage"];

  const showHeader = headerVisibleRoutes.includes(location.pathname);

  return (
    <div>
      {showHeader && <Header />}
      <div className={showHeader ? "mt-[64px]" : ""}>
        <WordPage/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/select-language" element={<LanguageSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path='/mypage' element={<MyPage />}/>
        </Routes>
      </div>
    </div>
  );
};

export default App;