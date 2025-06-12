import { Routes, Route } from 'react-router';
import './App.css'
import Header from './components/Header/Header.jsx'
import LanguageSelection from './pages/LanguageSelection'
import Fullcode from './pages/Fullcode'
import Home from './pages/Home'
import WordPage from './pages/WordPage'
import SentencePage from './pages/SentencePage'
import TeacherView from './pages/TeacherView.jsx'

const App = () => {
  return (
    <div style={{ paddingTop: '80px' }}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/full" element={<Fullcode />} />
        <Route path="/SelectLanguage" element={<LanguageSelection />} /> 
        <Route path="/word" element={<WordPage/>} />
        <Route path="/sentence" element={<SentencePage/>} />
        <Route path="/teacher" element={<TeacherView/>} />
      </Routes>
    </div>
  );
};

export default App;
