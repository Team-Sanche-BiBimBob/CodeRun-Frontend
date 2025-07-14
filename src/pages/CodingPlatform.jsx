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
              ? 'text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          style={activeTab === tab ? { backgroundColor: '#0D9488' } : {}}
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
        <button 
          className="text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium"
          style={{ backgroundColor: '#0D9488' }}
        >
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
    const matchesTab = activeTab === '전체' || course.title.includes(activeTab);
    return matchesSearch && matchesTab;
  });

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
        <TrendingUp className="w-6 h-6 mr-3" style={{ color: '#0D9488' }} />
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
                className="h-4 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(value / maxValue) * 100}%`,
                  backgroundColor: '#0D9488'
                }}
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

  const initialCourses = [
    { title: 'Python 단어 암기', description: '파이썬 변수의 개념', rating: 4.5, lessons: 100 },
    { title: 'Java 문법 읽기', description: 'Java의 기본 문법 학습', rating: 4.3, lessons: 200 },
    { title: 'JavaScript 문법 읽기', description: '함수와 조건문 학습', rating: 4.6, lessons: 150 },
    { title: 'C 단어 암기', description: '파이썬 변수의 개념', rating: 4.2, lessons: 120 },
    { title: 'SQL 단어 암기', description: 'select문의 구조 쿼리 학습', rating: 4.4, lessons: 180 },
    { title: 'Kotlin 단어 암기', description: '파이썬 변수의 개념', rating: 4.1, lessons: 90 },
  ];

  const generateMoreCourses = () => {
    const languages = ['Python', 'Java', 'JavaScript', 'C', 'Swift', 'TypeScript', 'Java', 'Kotlin', 'Python', 'SQL'];
    const types = ['단어 암기', '문법 읽기', '실습 문제', '프로젝트'];
    const descriptions = [
      '기본 개념과 문법 타자 학습',
      '실무에 필요한 핵심 내용 타자 학습',
      '단계별 타자 학습 과정',
      '프로젝트 기반 언어 타자 학습'
    ];
    return Array.from({ length: 6 }, () => ({
      title: `${languages[Math.floor(Math.random() * languages.length)]} ${types[Math.floor(Math.random() * types.length)]}`,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      lessons: Math.floor(Math.random() * 200) + 50
    }));
  };

  useEffect(() => {
    setCourses(initialCourses);
  }, []);

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
      <div className="max-w-5xl mx-auto"> {/* Changed from max-w-6xl to max-w-5xl for a more compact layout */}
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
          
          {/* Right Sidebar - Fixed */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-16 space-y-8">
              <StatsChart data={chartData} />
              
              {/* Additional Stats */}
              <div className="bg-white rounded-lg shadow-md p-8 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">이번 주 요약</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">완료한 문제</span>
                    <span className="font-semibold" style={{ color: '#0D9488' }}>245개</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">학습 시간</span>
                    <span className="font-semibold" style={{ color: '#0D9488' }}>12시간</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">연속 학습</span>
                    <span className="font-semibold" style={{ color: '#0D9488' }}>5일</span>
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