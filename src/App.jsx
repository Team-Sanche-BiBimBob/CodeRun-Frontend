import { Routes, Route } from 'react-router';
import './App.css'
import Header from './components/Header/Header.jsx'
import LanguageSelection from './pages/LanguageSelection'
import Home from './pages/Home'
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';

const App = () => {
  return (
    <div>
      <Header/>
      <div className="mt-[64px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/select-language" element={<LanguageSelection />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
        </Routes>
      </div>
    </div>
  );
};

export default App;
