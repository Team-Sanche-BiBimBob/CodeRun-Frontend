import { Routes, Route, useLocation } from 'react-router';
import './App.css'
import Header from './components/Header/Header.jsx'
import LanguageSelection from './pages/LanguageSelection'
import Fullcode from './pages/Fullcode'
import Home from './pages/Home'
import WordPage from './pages/WordPage'
import SentencePage from './pages/SentencePage'
import TeacherView from './pages/TeacherView.jsx'
import CodingPlatform from './pages/CodingPlatform.jsx';
import Fullcode from "./pages/Fullcode";


const App = () => {
  const location = useLocation();

  const headerVisibleRoutes = ["/", "/select-language", "/competition"];

  const showHeader = headerVisibleRoutes.includes(location.pathname);

  return (
    <div style={{ paddingTop: '80px' }}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/full" element={<Fullcode />} />
        <Route path="/selectLanguage" element={<LanguageSelection />} />
        <Route path="/word" element={<WordPage/>} />
        <Route path="/sentence" element={<SentencePage/>} />
        <Route path="/teacher" element={<TeacherView/>} />
        <Route path="/platform" element={<CodingPlatform/>}/>
      </Routes>
    </div>
  );
};

export default App;
