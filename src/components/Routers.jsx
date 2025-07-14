    import { Routes, Route } from 'react-router';
import LanguageSelection from '../pages/LanguageSelection';
import Fullcode from '../pages/Fullcode';
import Home from '../pages/Home';
import WordPage from '../pages/WordPage';
import SentencePage from '../pages/SentencePage';
import CodingPlatform from '../pages/CodingPlatform.jsx';
import TeacherView from '../pages/TeacherView.jsx';
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';

const Routers = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/selectLanguage" element={<LanguageSelection />} />
    <Route path="/word" element={<WordPage/>} />
    <Route path="/sentence" element={<SentencePage/>} />
    <Route path="/platform" element={<CodingPlatform/>}/>
    <Route path="/full" element={<Fullcode />} />
    <Route path="/teacher" element={<TeacherView/>} />
    <Route path="/login" element={<Login/>}/>
    <Route path="/signup" element={<Signup/>}/>
  </Routes>
);

export default Routers; 