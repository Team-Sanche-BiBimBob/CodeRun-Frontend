// components/Routers.jsx
import { Routes, Route } from 'react-router-dom';
import Home from '../../pages/main/Home';
import LanguageSelection from '../../pages/PracticeSelect/LanguageSelection';
import PracticeSelect from '../../pages/PracticeSelect/PracticeSelect'; 
import TimeAttack from '../../pages/arcade/timeattack/TimeAttack';
import WordPage from '../../pages/practice/word/WordPage';
import SentencePage from '../../pages/practice/sentence/SentencePage';
import Fullcode from '../../pages/practice/fullCode/FullCode';
import CodingPlatform from '../../pages/workbook/CodingPlatform';
import TeacherView from '../../pages/teacherView/TeacherView';
import Signup from '../../pages/auth/Signup/Signup';
import Login from '../../pages/auth/Login/Login';
import Battle from '../../pages/arcade/battle/Battle';
import ArcadeSelect from '../../pages/arcade/arcadeSelect/ArcadeSelect';
import NotFound from '../../pages/NotFound/NotFound';
import Study from '../../pages/study/study';

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/selectLanguage" element={<LanguageSelection />} />
      <Route path="/PracticeSelect" element={<PracticeSelect />} />
      <Route path='/timeattack' element={<TimeAttack />} />
      <Route path='/battle' element={<Battle />} />
      <Route path="/word" element={<WordPage />} />
      <Route path="/sentence" element={<SentencePage />} />
      <Route path="/full" element={<Fullcode />} />
      <Route path="/problem" element={<CodingPlatform />} />
      <Route path="/teacher" element={<TeacherView />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path='/arcadeSelect' element={<ArcadeSelect />} />
      <Route path="*" element={<NotFound />} />
      <Route path='/study' element={<Study />} />
    </Routes>
  );
};

export default Routers;