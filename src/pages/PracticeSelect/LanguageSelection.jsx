import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageCard from "../../components/LanguageCard/LanguageCard";

/*const programmingLanguages = [
  {
    id: 'python',
    name: 'Python',
    description: '초보자에게 가장 적합한 언어로, 쉬운 문법과 다양한 활용 분야를 가지고 있습니다.',
    difficulty: '쉬움',
    popularity: 4,
    recommended: true,
  },
  {
    id: 'java',
    name: 'Java',
    description: '객체지향 프로그래밍의 대표적인 언어로, 다양한 플랫폼에서 실행 가능합니다.',
    difficulty: '중간',
    popularity: 5,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    description: '웹 개발에 필수적인 언어로, 프론트엔드와 백엔드 모두에서 사용 가능합니다.',
    difficulty: '중간',
    popularity: 5,
  },
  {
    id: 'c',
    name: 'C',
    description: '프로그래밍의 기초가 되는 언어로, 하드웨어에 가까운 프로그래밍이 가능합니다.',
    difficulty: '어려움',
    popularity: 2,
  },
  {
    id: 'sql',
    name: 'SQL',
    description: '데이터베이스 관리에 사용되는 언어로, 데이터 분석에 필수적입니다.',
    difficulty: '중간',
    popularity: 2,
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    description: 'JavaScript의 슈퍼셋으로, 정적 타입을 지원하여 더 안정적인 코드 작성이 가능합니다.',
    difficulty: '중간',
    popularity: 3,
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    description: '안드로이드 앱 개발에 적합한 언어로, Java보다 간결하고 현대적입니다.',
    difficulty: '중간',
    popularity: 4,
  },
  {
    id: 'swift',
    name: 'Swift',
    description: 'iOS 앱 개발을 위한 애플의 언어로, 안전하고 현대적인 문법을 가지고 있습니다.',
    difficulty: '중간',
    popularity: 3,
  },
];*/

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
          
          // API 실패 시 기본 언어 목록 사용
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
        // 에러 발생 시 기본 언어 목록 사용
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
      // 언어 ID 매핑 (서버 데이터에 맞게 수정)
      const languageIdMap = {
        'python': 1,
        'java': 2,
        'javascript': 5,
        'c': 3,
        'c++': 4,
        'typescript': 6,
        'go': 7,
        'rust': 8
      };
      
      const numericLanguageId = languageIdMap[selectedLanguage] || 1; // 기본값은 파이썬
      console.log("Navigating with selectedLanguage:", selectedLanguage, "-> numericId:", numericLanguageId);
      navigate('/PracticeSelect', { state: { language: numericLanguageId } });
    }
  };

  const handleSelectLater = () => {
    console.log('Select later clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl px-4 py-12 mx-auto">
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