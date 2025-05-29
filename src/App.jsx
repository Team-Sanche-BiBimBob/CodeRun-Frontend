import { Routes, Route } from 'react-router';
import './App.css'
import Header from './components/Header/Header.jsx'
import LanguageSelection from './pages/LanguageSelection'
import WordPage from './pages/WordPage.jsx';

const App = () => {
  return (
    <div>
      <Header/>
      <Routes>
        <Route path="/select-language" element={<LanguageSelection />} />
      </Routes>
      <WordPage/>
    </div>
  );
};

export default App;
