import { Routes, Route } from 'react-router';
import './App.css'
import Header from './components/Header/Header.jsx'
import LanguageSelection from './pages/LanguageSelection'
import Home from './pages/Home'

const App = () => {
  return (
    <div style={{ paddingTop: '80px' }}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/SelectLanguage" element={<LanguageSelection />} />
      </Routes>
    </div>
  );
};

export default App;
  