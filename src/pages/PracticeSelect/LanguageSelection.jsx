import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageCard from "../../components/LanguageCard/LanguageCard";

const LanguageSelection = () => {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const apiUrl = `${apiBaseUrl}${apiBaseUrl.endsWith('/') ? '' : '/'}api/languages`;
        
        console.log('Fetching languages from:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API 응답 실패:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData
          });
          
          const defaultLanguages = [
            { id: 'python', name: 'Python', description: '초보자에게 가장 적합한 언어' },
            { id: 'java', name: 'Java', description: '객체지향 프로그래밍의 대표적인 언어' },
            { id: 'javascript', name: 'JavaScript', description: '웹 개발에 필수적인 언어' },
            { id: 'c', name: 'C', description: '프로그래밍의 기초가 되는 언어' },
            { id: 'sql', name: 'SQL', description: '데이터베이스 관리에 사용되는 언어' },
            { id: 'typescript', name: 'TypeScript', description: 'JavaScript의 슈퍼셋' },
          ];
          setLanguages(defaultLanguages);
          return;
        }
        
        const data = await response.json();
        console.log('API 응답 성공:', data);
        setLanguages(data);
      } catch (error) {
        console.error('언어 목록 가져오기 실패:', error);
        const defaultLanguages = [
          { id: 'python', name: 'Python', description: '초보자에게 가장 적합한 언어' },
          { id: 'java', name: 'Java', description: '객체지향 프로그래밍의 대표적인 언어' },
          { id: 'javascript', name: 'JavaScript', description: '웹 개발에 필수적인 언어' },
          { id: 'c', name: 'C', description: '프로그래밍의 기초가 되는 언어' },
          { id: 'sql', name: 'SQL', description: '데이터베이스 관리에 사용되는 언어' },
          { id: 'typescript', name: 'TypeScript', description: 'JavaScript의 슈퍼셋' },
        ];
        setLanguages(defaultLanguages);
      }
    };
    getData();
  }, []);

  const handleLanguageSelect = (languageId) => {
    setSelectedLanguage(languageId);
  };

  const handleCompleteSelection = () => {
    if (selectedLanguage) {
      const languageIdMap = {
        'python': 1,
        'Python': 1,
        'java': 2,
        'Java': 2,
        'javascript': 5,
        'JavaScript': 5,
        'c': 3,
        'C': 3,
        'c++': 4,
        'C++': 4,
        'typescript': 6,
        'TypeScript': 6,
        'go': 7,
        'Go': 7,
        'rust': 8,
        'Rust': 8,
      };
      
      // selectedLanguage가 이미 숫자면 그대로 사용, 문자열이면 매핑
      let numericLanguageId;
      if (typeof selectedLanguage === 'number') {
        numericLanguageId = selectedLanguage;
      } else if (typeof selectedLanguage === 'string') {
        numericLanguageId = languageIdMap[selectedLanguage] || languageIdMap[selectedLanguage.toLowerCase()] || 1;
      } else {
        numericLanguageId = 1;
      }
      
      console.log("Navigating with selectedLanguage:", selectedLanguage, "-> numericId:", numericLanguageId);
      navigate('/PracticeSelect', { state: { language: numericLanguageId } });
    }
  };
  
  const handleSelectLater = () => {
    console.log('Select later clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="px-4 py-12 mx-auto max-w-6xl">
        <h2 className="mb-16 text-3xl font-bold text-center">
          학습할 프로그래밍 언어를 선택하세요
        </h2>
        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-4">
          {languages.map((language) => (
            <LanguageCard
              key={language.id}
              language={language}
              selectedLanguage={selectedLanguage}
              onSelect={handleLanguageSelect}
            />
          ))}
        </div>
        <div className="flex flex-col items-center">
          <button
            className={`w-64 py-3 px-6 rounded-md text-center border-none cursor-pointer transition-colors ${
              selectedLanguage
                ? 'text-white bg-teal-500 hover:bg-teal-600'
                : 'text-gray-500 bg-gray-300 cursor-not-allowed'
            }`}
            disabled={!selectedLanguage}
            onClick={handleCompleteSelection}
          >
            선택 완료
          </button>
        </div>
      </main>
    </div>
  );
};

export default LanguageSelection;