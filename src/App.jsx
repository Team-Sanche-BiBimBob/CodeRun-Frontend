import { Routes, Route } from 'react-router';
import LanguageSelection from './pages/LanguageSelection'; 

const App = () => {
  return (
    <div>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/select-language" element={<LanguageSelection />} />
      </Routes>
    </div>
  );
};

export default App;
