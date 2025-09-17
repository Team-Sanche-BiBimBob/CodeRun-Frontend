import React, { useState, useRef, useEffect } from 'react';


const CodeRunTimeAttack = () => {
  const [selectedProblemSet, setSelectedProblemSet] = useState(null);
  const [isTagAdded, setIsTagAdded] = useState(false);
  const [selectedTags, setSelectedTags] = useState({
    python: false,
    javascript: false,
    java: false,
    반복문: false,
    출력문: false,
    기초문장: false,
    실제코드: false,
    문장: false,
    풀코드: false
  });
  const [completedTags, setCompletedTags] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeRankingTab, setActiveRankingTab] = useState('오늘');
  const [showSearch, setShowSearch] = useState(true);
  const scrollContainerRef = useRef(null);

  // 랭킹 데이터
  const rankingsData = {
    '오늘': [
      { rank: 1, name: "Name", time: "00:00:00" },
      { rank: 2, name: "Name", time: "00:00:00" },
      { rank: 3, name: "Name", time: "00:00:00" },
      { rank: 4, name: "Name", time: "00:00:00" },
      { rank: 5, name: "Name", time: "00:00:00" },
      { rank: 23, name: "me", time: "00:00:00" }
    ],
    '이번주': [
      { rank: 1, name: "주간 1등", time: "00:01:15" },
      { rank: 2, name: "주간 2등", time: "00:01:32" },
      { rank: 3, name: "주간 3등", time: "00:01:48" },
      { rank: 4, name: "주간 4등", time: "00:02:05" },
      { rank: 5, name: "주간 5등", time: "00:02:20" },
      { rank: 15, name: "me", time: "00:03:45" }
    ],
    '이번달': [
      { rank: 1, name: "월간 1등", time: "00:00:58" },
      { rank: 2, name: "월간 2등", time: "00:01:12" },
      { rank: 3, name: "월간 3등", time: "00:01:28" },
      { rank: 4, name: "월간 4등", time: "00:01:45" },
      { rank: 5, name: "월간 5등", time: "00:02:02" },
      { rank: 8, name: "me", time: "00:02:30" }
    ]
  };

  // 초기 문제 데이터
  const initialProblems = [
    { id: 1, title: "Python 반복문 예제 1", tags: ["python", "반복문"], difficulty: "문장", time: "00:00:00" },
    { id: 2, title: "Python 출력문 예제 1", tags: ["python", "출력문"], difficulty: "풀코드", time: "00:00:00" },
    { id: 3, title: "JavaScript 반복문 예제 1", tags: ["javascript", "반복문"], difficulty: "문장", time: "00:00:00" },
    { id: 4, title: "Java 기초문장 예제 1", tags: ["java", "기초문장"], difficulty: "풀코드", time: "00:00:00" },
    { id: 5, title: "Python 실제코드 예제 1", tags: ["python", "실제코드"], difficulty: "문장", time: "00:00:00" },
    { id: 6, title: "JavaScript 출력문 예제 1", tags: ["javascript", "출력문"], difficulty: "풀코드", time: "00:00:00" },
    { id: 7, title: "Java 반복문 예제 1", tags: ["java", "반복문"], difficulty: "문장", time: "00:00:00" },
    { id: 8, title: "Python 기초문장 예제 1", tags: ["python", "기초문장"], difficulty: "풀코드", time: "00:00:00" }
  ];

  useEffect(() => {
    setRankings(rankingsData['오늘']);
    setProblems(initialProblems);
    setFilteredProblems([]);
  }, []);

  // 문제 필터링 함수
  const filterProblems = (tags) => {
    if (tags.length === 0) {
      setFilteredProblems([]);
      return;
    }

    const filtered = problems.filter(problem => 
      tags.some(tag => problem.tags.includes(tag))
    );
    setFilteredProblems(filtered);
  };

  // 랭킹 탭 변경
  const handleRankingTabChange = (tab) => {
    setActiveRankingTab(tab);
    setRankings(rankingsData[tab]);
  };

  // 초기화 함수
  const handleReset = () => {
    setSelectedTags({
      python: false,
      javascript: false,
      java: false,
      반복문: false,
      출력문: false,
      기초문장: false,
      실제코드: false,
      문장: false,
      풀코드: false
    });
    setCompletedTags([]);
    setIsTagAdded(false);
    setFilteredProblems([]);
  };

  // 태그 선택 처리
  const handleTagSelect = (tag) => {
    const languageTags = ['python', 'javascript', 'java'];
    const typeTags = ['문장', '풀코드'];
    
    if (languageTags.includes(tag)) {
      // 언어는 하나만 선택 가능
      setSelectedTags(prev => {
        const newTags = { ...prev };
        languageTags.forEach(lang => {
          newTags[lang] = lang === tag ? !prev[tag] : false;
        });
        return newTags;
      });
    } else if (typeTags.includes(tag)) {
      // 문장/풀코드는 하나만 선택 가능
      setSelectedTags(prev => {
        const newTags = { ...prev };
        typeTags.forEach(type => {
          newTags[type] = type === tag ? !prev[tag] : false;
        });
        return newTags;
      });
    } else {
      // 유형 태그들은 다중 선택 가능
      setSelectedTags(prev => ({
        ...prev,
        [tag]: !prev[tag]
      }));
    }
  };

  // 문제집 선택 처리
  const handleProblemSetSelect = (problemSet) => {
    setSelectedProblemSet(problemSet);
    // 여기서 실제로는 서버에서 해당 문제집의 랭킹을 가져올 것
    const newRankings = [
      { rank: 1, name: `${problemSet} 1등`, time: "00:01:23" },
      { rank: 2, name: `${problemSet} 2등`, time: "00:01:45" },
      { rank: 3, name: `${problemSet} 3등`, time: "00:02:10" },
      { rank: 4, name: `${problemSet} 4등`, time: "00:02:30" },
      { rank: 5, name: `${problemSet} 5등`, time: "00:02:55" },
      { rank: 23, name: "me", time: "00:05:20" }
    ];
    setRankings(newRankings);
  };

  // 태그 추가하기 버튼 클릭
  const handleAddTag = () => {
    setIsTagAdded(true);
  };

  // 태그 완료 처리
  const handleCompleteTag = () => {
    const selected = Object.entries(selectedTags)
      .filter(([key, value]) => value)
      .map(([key]) => key);
    
    setCompletedTags(selected);
    setIsTagAdded(false);
    
    // 태그에 따른 문제 필터링
    filterProblems(selected);
  };

  // 문제 도전하기 버튼 클릭 처리
  const handleChallengeClick = (difficulty) => {
    if (difficulty === '문장') {
      // sentence 페이지로 이동
      window.location.href = '/sentence';
    } else if (difficulty === '풀코드') {
      // full 페이지로 이동
      window.location.href = '/full';
    }
  };

  // 스크롤 감지 및 무한 스크롤
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !isLoading) {
      loadMoreProblems();
    }
  };

  const loadMoreProblems = () => {
    setIsLoading(true);
    
    // 서버에서 더 많은 문제를 가져오는 시뮬레이션
    setTimeout(() => {
      const newProblems = Array.from({ length: 6 }, (_, i) => ({
        id: problems.length + i + 1,
        title: `Python 반복문 예제 ${problems.length + i + 1}`,
        tags: ["python", "반복문"],
        difficulty: i % 2 === 0 ? "문장" : "풀코드",
        time: "00:00:00"
      }));
      
      setProblems(prev => [...prev, ...newProblems]);
      setIsLoading(false);
      
      if (problems.length >= 24) {
        setHasMore(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">타임어택</h1>
        
        <div className="flex gap-6">
          <div className="flex-1">
            {/* 태그 섹션 */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="mb-5 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">태그</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-colors"
                    style={{ backgroundColor: '#14B8A6' }}
                  >
                    추가하기
                  </button>
                  {!isTagAdded && (
                    <button 
                      onClick={handleReset}
                      className="w-8 h-8 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* 완료된 태그들 표시 */}
              {completedTags.length > 0 && !isTagAdded && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {completedTags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-sm font-medium rounded-full"
                        style={{ backgroundColor: '#14B8A6', color: 'white' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 태그 선택 창 */}
              {isTagAdded && (
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm text-gray-600 font-medium min-w-16">문제 유형</span>
                    <div className="flex gap-2">
                      {['문장', '풀코드'].map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleTagSelect(tag)}
                          className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                            selectedTags[tag]
                              ? 'text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                          style={selectedTags[tag] ? { backgroundColor: '#14B8A6' } : {}}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm text-gray-600 font-medium min-w-16">언어 선택</span>
                    <div className="flex gap-2">
                      {['python', 'javascript', 'java'].map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleTagSelect(tag)}
                          className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                            selectedTags[tag]
                              ? 'text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                          style={selectedTags[tag] ? { backgroundColor: '#14B8A6' } : {}}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm text-gray-600 font-medium min-w-16">유형 선택</span>
                    <div className="flex gap-2">
                      {['반복문', '출력문', '기초문장', '실제코드'].map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleTagSelect(tag)}
                          className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                            selectedTags[tag]
                              ? 'text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                          style={selectedTags[tag] ? { backgroundColor: '#14B8A6' } : {}}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={handleCompleteTag}
                    className="w-full text-white py-3 rounded-lg font-medium text-base hover:opacity-90 transition-colors"
                    style={{ backgroundColor: '#14B8A6' }}
                  >
                    완료
                  </button>
                </div>
              )}
            </div>

            {/* 문제 목록 */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="h-96 overflow-y-auto bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="grid grid-cols-2 gap-4">
                {(filteredProblems.length > 0 ? filteredProblems : problems).map((problem) => (
                  <div
                    key={problem.id}
                    className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleProblemSetSelect(problem.title)}
                  >
                    <h3 className="font-semibold text-gray-800 mb-3">{problem.title}</h3>
                    <div className="flex gap-2 mb-3">
                      {problem.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-200 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        {problem.difficulty}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                      <span>⏱️ {problem.time}</span>
                    </div>
                    <button 
                      className="w-full mt-3 text-white py-2 rounded-md text-sm hover:opacity-90 transition-colors"
                      style={{ backgroundColor: '#2DD4BF' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChallengeClick(problem.difficulty);
                      }}
                    >
                      도전하기
                    </button>
                  </div>
                ))}
              </div>
              
              {isLoading && (
                <div className="text-center py-4">
                  <div 
                    className="inline-block animate-spin rounded-full h-6 w-6 border-b-2"
                    style={{ borderColor: '#14B8A6' }}
                  ></div>
                </div>
              )}
              
              {!hasMore && (
                <div className="text-center py-4 text-gray-500">
                  모든 문제를 불러왔습니다.
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽 랭킹 섹션 */}
          <div className="w-80">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🏆</span>
                <h2 className="text-xl font-semibold text-gray-800">랭킹</h2>
              </div>

              <div className="flex gap-1 mb-6">
                <button 
                  onClick={() => handleRankingTabChange('오늘')}
                  className={`flex-1 py-2 rounded-l-lg text-sm font-medium ${
                    activeRankingTab === '오늘' 
                      ? 'text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  style={activeRankingTab === '오늘' ? { backgroundColor: '#14B8A6' } : {}}
                >
                  오늘
                </button>
                <button 
                  onClick={() => handleRankingTabChange('이번주')}
                  className={`flex-1 py-2 text-sm font-medium ${
                    activeRankingTab === '이번주' 
                      ? 'text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  style={activeRankingTab === '이번주' ? { backgroundColor: '#14B8A6' } : {}}
                >
                  이번주
                </button>
                <button 
                  onClick={() => handleRankingTabChange('이번달')}
                  className={`flex-1 py-2 rounded-r-lg text-sm font-medium ${
                    activeRankingTab === '이번달' 
                      ? 'text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  style={activeRankingTab === '이번달' ? { backgroundColor: '#14B8A6' } : {}}
                >
                  이번달
                </button>
              </div>

              <div className="space-y-3">
                {rankings.map((rank, index) => {
                  // 'me' 항목 바로 전에 점 3개 표시
                  const showDots = rank.name === 'me' && rank.rank > 6;
                  
                  return (
                    <React.Fragment key={index}>
                      {showDots && (
                        <div className="text-center py-2">
                          <span className="text-gray-400 text-lg">⋮</span>
                        </div>
                      )}
                      <div
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          rank.name === 'me' 
                            ? 'border' 
                            : 'bg-gray-50'
                        }`}
                        style={rank.name === 'me' ? { backgroundColor: '#F0FDFA', borderColor: '#14B8A6' } : {}}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                            rank.rank <= 3 ? '' : 'bg-gray-400'
                          }`}
                          style={rank.rank <= 3 ? { backgroundColor: '#14B8A6' } : {}}
                        >
                          {rank.rank}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{rank.name}</div>
                          <div className="text-sm text-gray-600">⏱️ {rank.time}</div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {selectedProblemSet && (
                <div className="mt-4 p-3 rounded-lg border" style={{ backgroundColor: '#F0FDFA', borderColor: '#14B8A6' }}>
                  <div className="text-sm" style={{ color: '#065F46' }}>
                    선택된 문제집: <strong>{selectedProblemSet}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeRunTimeAttack;