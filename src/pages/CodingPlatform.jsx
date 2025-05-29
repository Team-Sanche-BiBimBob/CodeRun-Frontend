import React, { useState, useEffect } from 'react';
import SearchBar from '../components/WorkBook/SearchBar';
import FilterTabs from '../components/WorkBook/FilterTabs';
import CourseGrid from '../components/WorkBook/CourseGrid';
import LoadMoreButton from '../components/WorkBook/LoadMoreButton';
import StatsChart from '../components/WorkBook/StatsChart';

export default function CodingPlatform() {
  const [searchQuery, setSearchQuery] = useState('');
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
    <div className="min-h-screen bg-gray-100 text-gray-900 px-6 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">문제집 리스트</h1>

      <div className="flex gap-8">
        {/* Left Section */}
        <div className="flex-1">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <FilterTabs />
          <CourseGrid courses={courses} />
          <LoadMoreButton hasMore={hasMore} loading={loading} handleLoadMore={handleLoadMore} />
        </div>

        {/* Right Sidebar */}
        <div className="w-80">
          <StatsChart data={chartData} />
        </div>
      </div>
    </div>
  );
}
