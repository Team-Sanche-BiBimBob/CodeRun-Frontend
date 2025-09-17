// components/Routers.jsx
import { Routes, Route } from 'react-router-dom';
import Home from '../../pages/main/Home';
import LanguageSelection from '../../pages/PracticeSelect/LanguageSelection';
import PracticeSelect from '../../pages/PracticeSelect/PracticeSelect'; 
import Competition from '../../pages/arcade/arcadeSelect/Competition';
import WordPage from '../../pages/practice/word/WordPage';
import SentencePage from '../../pages/practice/sentence/SentencePage';
import Fullcode from '../../pages/practice/fullCode/FullCode';
import CodingPlatform from '../../pages/workbook/CodingPlatform';
import TeacherView from '../../pages/teacherView/TeacherView';
import Signup from '../../pages/auth/Signup/Signup';
import Login from '../../pages/auth/Login/Login';
import Arcade1V1 from '../../pages/arcade/arcadeSelect/Arcade1V1';

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/selectLanguage" element={<LanguageSelection />} />
      <Route path="/PracticeSelect" element={<PracticeSelect />} />
      <Route path='/competition' element={<Competition />} />
      <Route path='/arcade1v1' element={<Arcade1V1 />} />
      <Route path="/word" element={<WordPage />} />
      <Route path="/sentence" element={<SentencePage />} />
      <Route path="/full" element={<Fullcode />} />
      <Route path="/problem" element={<CodingPlatform />} />
      <Route path="/teacher" element={<TeacherView />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default Routers;