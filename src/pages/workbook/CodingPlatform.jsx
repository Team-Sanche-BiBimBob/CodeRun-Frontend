import React, { useState, useEffect, useCallback } from 'react';
import { Search, Star, Play, RotateCcw } from 'lucide-react';
import { api } from '../../server/index.js';

export default function CodingPlatform() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLanguage, setActiveLanguage] = useState('Python');
  const [problemSets, setProblemSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 서버에서 문제집 데이터 가져오기
  const fetchWorkbooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('문제집 데이터 가져오기 시도 중...');
      
      const response = await api.get('/api/workbook');
      console.log('받은 데이터:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        console.log('서버 데이터 구조 확인:', response.data[0]);
        console.log('서버 데이터 전체:', response.data);
        
        // 서버 데이터를 UI에 맞는 형식으로 변환
        const transformedData = response.data.map((item, index) => ({
          id: item.id || index + 1,
          title: item.title || item.name || `문제집 ${index + 1}`,
          subtitle: item.subtitle || item.description || item.content || '설명이 없습니다',
          language: item.language || item.programming_language || 'Python',
          tags: Array.isArray(item.tags) ? item.tags : 
                Array.isArray(item.categories) ? item.categories :
                item.tag ? [item.tag] : ['기본'],
          progress: item.progress || item.completion_rate || 0,
          rating: item.rating || item.score || 4.0
        }));
        
        console.log('변환된 데이터:', transformedData);
        setProblemSets(transformedData);
        console.log('문제집 로드 성공:', transformedData.length + '개');
      } else {
        throw new Error('서버에서 올바른 데이터 형식을 받지 못했습니다');
      }
      
    } catch (error) {
      console.error('문제집 가져오기 실패:', error);
      setError('문제집을 불러오는데 실패했습니다.');
      
      // 폴백 데이터
      const fallbackData = [
        {
          id: 1,
          title: 'Python 기초 문제집',
          subtitle: 'Python 프로그래밍 기초를 다루는 문제들',
          language: 'Python',
          tags: ['python', 'basic', 'beginner'],
          progress: 0,
          rating: 4.5
        },
        {
          id: 2,
          title: 'JavaScript 알고리즘',
          subtitle: 'JavaScript로 배우는 알고리즘 문제',
          language: 'JavaScript',
          tags: ['javascript', 'algorithm', 'intermediate'],
          progress: 0,
          rating: 4.2
        },
        {
          id: 3,
          title: 'Java 객체지향 프로그래밍',
          subtitle: 'Java OOP 개념을 익히는 문제집',
          language: 'Java',
          tags: ['java', 'oop', 'advanced'],
          progress: 0,
          rating: 4.0
        }
      ];
      setProblemSets(fallbackData);
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    console.log('컴포넌트 마운트됨, 데이터 로드 시작');
    fetchWorkbooks();
  }, [fetchWorkbooks]);

  // 디버깅을 위한 로그
  useEffect(() => {
    console.log('현재 상태:', { loading, error, problemSets: problemSets.length });
  }, [loading, error, problemSets]);

  const languages = ['Python', 'Javascript', 'Java', 'C', 'Ruby'];

  const filteredProblemSets = problemSets.filter(problemSet => {
    // 안전한 필터링을 위해 null/undefined 체크
    const title = problemSet.title || '';
    const subtitle = problemSet.subtitle || '';
    const language = problemSet.language || '';
    
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = activeLanguage === 'Python' || language === activeLanguage;
    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-6 py-8 pt-20 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* 메인 콘텐츠 영역 */}
          <div className="lg:col-span-3">
            {/* 페이지 제목 */}
            <h2 className="mb-8 text-3xl font-bold text-gray-800">문제집</h2>

            {/* 검색바 */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="학습할 문제집을 검색해주세요."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-4 pr-6 pl-12 w-full text-lg rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
            </div>

            {/* 필터 탭 */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex space-x-4">
                {languages.map((language) => (
                  <button
                    key={language}
                    onClick={() => setActiveLanguage(language)}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      activeLanguage === language
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
              <button className="px-6 py-3 font-medium text-white bg-teal-600 rounded-lg transition-colors hover:bg-teal-700">
                AI 문제 생성
              </button>
            </div>

            {/* 로딩 상태 */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 rounded-full border-4 border-teal-600 animate-spin border-t-transparent"></div>
                <span className="ml-3 text-gray-600">문제집을 불러오는 중...</span>
              </div>
            )}

            {/* 에러 상태 */}
            {error && (
              <div className="p-4 mb-6 text-red-600 bg-red-50 rounded-lg border border-red-200">
                {error}
              </div>
            )}


            {/* 문제집 카드 그리드 */}
            {!loading && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {filteredProblemSets.length > 0 ? (
                  filteredProblemSets.map((problemSet) => (
                <div key={problemSet.id} className="p-6 bg-white rounded-xl shadow-md transition-shadow hover:shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="mb-1 text-xl font-bold text-gray-800">{problemSet.title}</h3>
                      <p className="text-sm text-gray-600">{problemSet.subtitle}</p>
                    </div>
                    <div className="flex items-center ml-4 text-yellow-500">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="ml-1 text-sm font-medium">{problemSet.rating || 0}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(problemSet.tags || []).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => console.log('시작하기:', problemSet.title)}
                    className="flex justify-center items-center py-3 w-full font-medium text-white bg-teal-600 rounded-lg transition-colors hover:bg-teal-700"
                  >
                    <Play className="mr-2 w-4 h-4" />
                    시작하기
                  </button>
                </div>
                  ))
                ) : (
                  <div className="flex flex-col col-span-2 justify-center items-center py-12 text-gray-500">
                    <div className="mb-4 w-16 h-16 text-gray-300">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-lg font-medium">문제집이 없습니다</h3>
                    <p className="text-sm">새로운 문제집을 생성하거나 서버 연결을 확인해주세요.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-white rounded-xl shadow-md">
              <h3 className="mb-6 text-lg font-bold text-gray-800">최근 사용한 문제집</h3>
              
              <div className="space-y-4">
                {problemSets.slice(0, 3).map((problemSet) => (
                  <div key={problemSet.id} className="p-4 bg-gray-50 rounded-lg transition-colors hover:bg-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-800">{problemSet.title}</h4>
                        <p className="text-xs text-gray-600">{problemSet.subtitle}</p>
                      </div>
                      <div className="flex items-center ml-2 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-xs font-medium">{problemSet.rating}</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between mb-1 text-xs text-gray-600">
                        <span>진행도</span>
                        <span>{problemSet.progress || 0}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-teal-600 rounded-full transition-all duration-300"
                          style={{ width: `${problemSet.progress || 0}%` }}
                        />  
                      </div>
                    </div>

                    <button
                      onClick={() => console.log('계속하기:', problemSet.title)}
                      className="flex justify-center items-center py-2 w-full text-sm font-medium text-white bg-teal-600 rounded-lg transition-colors hover:bg-teal-700"
                    >
                      <RotateCcw className="mr-1 w-3 h-3" />
                      계속하기
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}