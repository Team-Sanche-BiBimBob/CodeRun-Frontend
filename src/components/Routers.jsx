// components/Routers.jsx
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import LanguageSelection from '../pages/LanguageSelection';
import Choice from '../pages/choice'; 
import WordPage from '../pages/WordPage';
import SentencePage from '../pages/SentencePage';
import Fullcode from '../pages/Fullcode';
import CodingPlatform from '../pages/CodingPlatform';
import TeacherView from '../pages/TeacherView';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/selectLanguage" element={<LanguageSelection />} />
      <Route path="/choice" element={<Choice />} />
      <Route path="/word" element={<WordPage />} />
      <Route path="/sentence" element={<SentencePage />} />
      <Route path="/full" element={<Fullcode />} />
      <Route path="/platform" element={<CodingPlatform />} />
      <Route path="/teacher" element={<TeacherView />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default Routers;
