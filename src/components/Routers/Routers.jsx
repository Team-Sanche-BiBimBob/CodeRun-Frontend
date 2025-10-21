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
import TeacherDashboard from '../../pages/teacher/TeacherDashboard';
import Signup from '../../pages/auth/Signup/Signup';
import Login from '../../pages/auth/Login/Login';
import Battle from '../../pages/arcade/battle/Battle';
import ArcadeSelect from '../../pages/arcade/arcadeSelect/ArcadeSelect';
import NotFound from '../../pages/NotFound/NotFound';
import Study from '../../pages/study/study';
import MyPage from '../../pages/Mypage';
import StudentDashboard from '../../pages/student/StudentDashboard';

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />  {/* /home 경로 추가 */}
      <Route path="/selectLanguage" element={<LanguageSelection />} />
      <Route path="/PracticeSelect" element={<PracticeSelect />} />
      <Route path='/timeattack' element={<TimeAttack />} />
      <Route path='/battle' element={<Battle />} />
      <Route path="/word" element={<WordPage />} />
      <Route path="/sentence" element={<SentencePage />} />
      <Route path="/full" element={<Fullcode />} />
      <Route path="/problem" element={<CodingPlatform />} />
      <Route path="/teacher" element={<TeacherView />} />
      <Route path="/teacherDashboard" element={<TeacherDashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path='/arcadeSelect' element={<ArcadeSelect />} />
      <Route path='/study' element={<Study />} />
      <Route path='/mypage' element={<MyPage />} />
      <Route path='/student' element={<StudentDashboard />} />
      <Route path="*" element={<NotFound />} />  {/* 404 라우트는 맨 마지막에 */}
    </Routes>
  );
};

export default Routers;