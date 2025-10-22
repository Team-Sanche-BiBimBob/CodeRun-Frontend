import React, { useState } from 'react';
import { Search, Star, Play, RotateCcw } from 'lucide-react';

export default function CodingPlatform() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLanguage, setActiveLanguage] = useState('Python');

  const problemSets = [
    {
      id: 1,
      title: '문제 제목',
      subtitle: '문제 부제목',
      language: 'Python',
      tags: ['python', 'python', 'python'],
      progress: 0
    },
    {
      id: 2,
      title: '문제 제목',
      subtitle: '문제 부제목',
      language: 'Python',
      tags: ['python', 'python', 'python'],
      progress: 0
    },
    {
      id: 3,
      title: '문제 제목',
      subtitle: '문제 부제목',
      language: 'Python',
      tags: ['python', 'python', 'python'],
      progress: 0
    },
    {
      id: 4,
      title: '문제 제목',
      subtitle: '문제 부제목',
      language: 'Python',
      tags: ['python', 'python', 'python'],
      progress: 0
    },
    {
      id: 5,
      title: '문제 제목',
      subtitle: '문제 부제목',
      language: 'Python',
      tags: ['python', 'python', 'python'],
      progress: 0
    },
    {
      id: 6,
      title: '문제 제목',
      subtitle: '문제 부제목',
      language: 'Python',
      tags: ['python', 'python', 'python'],
      progress: 0
    }
  ];

  const recentProblemSets = [
    {
      id: 1,
      title: '문제 제목',
      subtitle: '문제 부제목',
      rating: 2.4,
      progress: 10
    },
    {
      id: 2,
      title: '문제 제목',
      subtitle: '문제 부제목',
      rating: 2.4,
      progress: 10
    },
    {
      id: 3,
      title: '문제 제목',
      subtitle: '문제 부제목',
      rating: 2.4,
      progress: 10
    },
    {
      id: 4,
      title: '문제 제목',
      subtitle: '문제 부제목',
      rating: 2.4,
      progress: 10
    }
  ];

  const languages = ['Python', 'Javascript', 'Java', 'C', 'Ruby'];

  const filteredProblemSets = problemSets.filter(problemSet => {
    const matchesSearch = problemSet.title.toLowerCase().includes(searchQuery.toLowerCase()) || problemSet.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = activeLanguage === 'Python' || problemSet.language === activeLanguage;
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

            {/* 문제집 카드 그리드 */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredProblemSets.map((problemSet) => (
                <div key={problemSet.id} className="p-6 bg-white rounded-xl shadow-md transition-shadow hover:shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="mb-1 text-xl font-bold text-gray-800">{problemSet.title}</h3>
                      <p className="text-sm text-gray-600">{problemSet.subtitle}</p>
                    </div>
                    <div className="flex items-center ml-4 text-yellow-500">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="ml-1 text-sm font-medium">{problemSet.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {problemSet.tags.map((tag, index) => (
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
              ))}
            </div>
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-white rounded-xl shadow-md">
              <h3 className="mb-6 text-lg font-bold text-gray-800">최근 사용한 문제집</h3>
              
              <div className="space-y-4">
                {recentProblemSets.map((problemSet) => (
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
                        <span>{problemSet.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-teal-600 rounded-full transition-all duration-300"
                          style={{ width: `${problemSet.progress}%` }}
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