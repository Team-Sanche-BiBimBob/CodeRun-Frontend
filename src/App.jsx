import { Routes, Route } from 'react-router';


import './App.css'
import Header from './components/Header/Header.jsx'

const App = () => {
  return (

    <div>
      <Header/>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/select-language" element={<LanguageSelection />} />
      </Routes>
    </div>
  );
};

export default App;
