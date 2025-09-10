import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, BookOpen, TrendingUp } from 'lucide-react';

// SearchBar Component
const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative mb-8">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="코스를 검색해보세요..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-12 pr-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
      />
    </div>
  );
};

// FilterTabs Component
const FilterTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ['전체', 'Python', 'Java', 'JavaScript', 'C', 'SQL'];
  
  return (
    <div className="flex space-x-4 mb-10 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-6 py-3 rounded-full whitespace-nowrap transition-colors font-medium ${
            activeTab === tab
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

// CourseCard Component
const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800 flex-1">{course.title}</h3>
        <div className="flex items-center text-yellow-500 ml-4">
          <Star className="w-5 h-5 fill-current" />
          <span className="ml-2 text-sm font-medium">{course.rating}</span>
        </div>
      </div>
      <p className="text-gray-600 mb-6 leading-relaxed">{course.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center text-gray-500">
          <BookOpen className="w-5 h-5 mr-2" />
          <span>{course.lessons}개 문제</span>
        </div>
        <button className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium">
          시작하기
        </button>
      </div>
    </div>
  );
};

// CourseGrid Component
const CourseGrid = ({ courses, searchQuery, activeTab }) => {
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === '전체' || course.language === activeTab;
    return matchesSearch && matchesTab;
  });

  if (filteredCourses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {filteredCourses.map((course, index) => (
        <CourseCard key={index} course={course} />
      ))}
    </div>
  );
};

// LoadMoreButton Component
const LoadMoreButton = ({ onLoadMore, loading, hasMore }) => {
  if (!hasMore) return null;
  
  return (
    <div className="text-center mt-12">
      <button
        onClick={onLoadMore}
        disabled={loading}
        className="bg-gray-100 text-gray-700 px-10 py-4 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {loading ? '로딩 중...' : '더 보기'}
      </button>
    </div>
  );
};

// StatsChart Component
const StatsChart = ({ data }) => {
  const maxValue = Math.max(...data);
  
  return (
    <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
      <div className="flex items-center mb-6">
        <TrendingUp className="w-6 h-6 text-teal-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-800">학습 통계</h3>
      </div>
      <div className="space-y-4">
        {data.map((value, index) => (
          <div key={index} className="flex items-center">
            <span className="text-gray-600 w-8 font-medium">
              {['월', '화', '수', '목', '금', '토'][index]}
            </span>
            <div className="flex-1 bg-gray-200 rounded-full h-4 mx-4">
              <div
                className="bg-teal-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(value / maxValue) * 100}%` }}
              />
            </div>
            <span className="font-semibold text-gray-700 w-10 text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Component
export default function CodingPlatform() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('전체');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 초기 코스 데이터
  const initialCourses = [
    // Python 코스들
    { title: 'Python 기초 문법', description: '변수, 자료형, 연산자 등 파이썬의 기본 개념을 학습합니다', rating: 4.5, lessons: 100, language: 'Python' },
    { title: 'Python 함수와 모듈', description: '함수 정의, 모듈 사용법, 패키지 관리를 배웁니다', rating: 4.7, lessons: 90, language: 'Python' },
    { title: 'Python 객체지향', description: '클래스, 상속, 캡슐화 등 객체지향 개념을 학습합니다', rating: 4.3, lessons: 120, language: 'Python' },
    { title: 'Python 데이터 처리', description: '리스트, 딕셔너리, 파일 입출력을 다룹니다', rating: 4.6, lessons: 80, language: 'Python' },
    
    // Java 코스들
    { title: 'Java 기초 문법', description: 'Java의 기본 문법과 데이터 타입을 학습합니다', rating: 4.3, lessons: 200, language: 'Java' },
    { title: 'Java 객체지향 프로그래밍', description: '클래스, 인터페이스, 추상클래스를 배웁니다', rating: 4.1, lessons: 110, language: 'Java' },
    { title: 'Java 컬렉션 프레임워크', description: 'List, Set, Map 등 컬렉션 사용법을 학습합니다', rating: 4.4, lessons: 150, language: 'Java' },
    { title: 'Java 예외 처리', description: 'try-catch, throws, 사용자 정의 예외를 다룹니다', rating: 4.2, lessons: 95, language: 'Java' },
    
    // JavaScript 코스들
    { title: 'JavaScript 기초', description: '변수, 함수, 조건문, 반복문을 학습합니다', rating: 4.6, lessons: 150, language: 'JavaScript' },
    { title: 'JavaScript ES6+', description: '화살표 함수, 구조분해, 템플릿 리터럴을 배웁니다', rating: 4.2, lessons: 95, language: 'JavaScript' },
    { title: 'JavaScript DOM 조작', description: '웹 페이지 요소를 동적으로 조작하는 방법을 학습합니다', rating: 4.7, lessons: 110, language: 'JavaScript' },
    { title: 'JavaScript 비동기 처리', description: 'Promise, async/await, 콜백 함수를 다룹니다', rating: 4.5, lessons: 130, language: 'JavaScript' },
    
    // C 코스들
    { title: 'C 기초 문법', description: 'C언어의 기본 문법과 데이터 타입을 학습합니다', rating: 4.2, lessons: 120, language: 'C' },
    { title: 'C 포인터와 배열', description: '포인터의 개념과 배열 사용법을 배웁니다', rating: 4.0, lessons: 95, language: 'C' },
    { title: 'C 메모리 관리', description: '동적 메모리 할당과 해제를 다룹니다', rating: 4.1, lessons: 140, language: 'C' },
    { title: 'C 구조체와 파일', description: '구조체 정의와 파일 입출력을 학습합니다', rating: 4.3, lessons: 110, language: 'C' },
    
    // SQL 코스들
    { title: 'SQL 기초 쿼리', description: 'SELECT, INSERT, UPDATE, DELETE 문을 학습합니다', rating: 4.4, lessons: 180, language: 'SQL' },
    { title: 'SQL 조인과 서브쿼리', description: '테이블 간의 관계와 복잡한 쿼리를 다룹니다', rating: 4.5, lessons: 130, language: 'SQL' },
    { title: 'SQL 함수와 집계', description: '내장 함수와 GROUP BY, HAVING을 학습합니다', rating: 4.2, lessons: 170, language: 'SQL' },
    { title: 'SQL 데이터베이스 설계', description: '테이블 설계와 정규화를 배웁니다', rating: 4.6, lessons: 200, language: 'SQL' }
  ];

  // 초기 데이터 로딩
  useEffect(() => {
    setCourses(initialCourses);
  }, []);

  // 더 많은 코스 생성
  const generateMoreCourses = () => {
    const languages = ['Python', 'Java', 'JavaScript', 'C', 'SQL'];
    const types = ['고급', '실무', '심화', '프로젝트', '알고리즘'];
    const topics = {
      Python: ['데이터 분석', '웹 개발', '머신러닝', '자동화', '크롤링'],
      Java: ['스프링', '안드로이드', '웹 개발', '디자인 패턴', '멀티스레딩'],
      JavaScript: ['React', 'Node.js', 'Vue.js', 'TypeScript', '웹팩'],
      C: ['시스템 프로그래밍', '임베디드', '자료구조', '네트워크', '운영체제'],
      SQL: ['성능 최적화', '저장 프로시저', '트리거', '인덱스', '백업/복구']
    };
    
    const newCourses = [];
    
    for (let i = 0; i < 6; i++) {
      const language = languages[Math.floor(Math.random() * languages.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const topic = topics[language][Math.floor(Math.random() * topics[language].length)];
      
      newCourses.push({
        title: `${language} ${type} ${topic}`,
        description: `${language}의 ${topic} 분야를 다루는 ${type} 수준의 코스입니다`,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        lessons: Math.floor(Math.random() * 200) + 50,
        language: language
      });
    }
    
    return newCourses;
  };

  const handleLoadMore = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      const newCourses = generateMoreCourses();
      setCourses(prev => [...prev, ...newCourses]);
      setPage(prev => prev + 1);
      if (page >= 5) setHasMore(false);
      setLoading(false);
    }, 1000);
  };

  const chartData = [40, 60, 80, 70, 65, 45];

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="pt-8 mb-16">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">문제집 리스트</h1>
          <p className="text-gray-600 text-lg">다양한 프로그래밍 언어를 학습해보세요</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Left Section */}
          <div className="lg:col-span-3">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <CourseGrid 
              courses={courses} 
              searchQuery={searchQuery} 
              activeTab={activeTab}
            />
            <LoadMoreButton 
              onLoadMore={handleLoadMore} 
              loading={loading} 
              hasMore={hasMore} 
            />
          </div>
          
          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-16 space-y-8">
              <StatsChart data={chartData} />
              
              <div className="bg-white rounded-lg shadow-md p-8 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">이번 주 요약</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">완료한 문제</span>
                    <span className="font-semibold text-teal-600">245개</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">학습 시간</span>
                    <span className="font-semibold text-teal-600">12시간</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">연속 학습</span>
                    <span className="font-semibold text-teal-600">5일</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}