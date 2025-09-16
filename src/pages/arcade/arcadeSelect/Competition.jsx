import React, { useState, useRef, useEffect } from 'react';

const CodeRunTimeAttack = () => {
  const [selectedProblemSet, setSelectedProblemSet] = useState(null);
  const [isTagAdded, setIsTagAdded] = useState(false);
  const [selectedTags, setSelectedTags] = useState({
    모든선택: true,
    python: false,
    javascript: false,
    java: false,
    반복문: false,
    출력문: false,
    기초문장: false,
    실제코드: false
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
    { id: 1, title: "Python 반복문 예제 1", tags: ["python", "반복문", "초급"], difficulty: "이전 기록", time: "00:00:00" },
    { id: 2, title: "Python 출력문 예제 1", tags: ["python", "출력문", "초급"], difficulty: "이전 기록", time: "00:00:00" },
    { id: 3, title: "JavaScript 반복문 예제 1", tags: ["javascript", "반복문", "초급"], difficulty: "이전 기록", time: "00:00:00" },
    { id: 4, title: "Java 기초문장 예제 1", tags: ["java", "기초문장", "초급"], difficulty: "이전 기록", time: "00:00:00" },
    { id: 5, title: "Python 실제코드 예제 1", tags: ["python", "실제코드", "중급"], difficulty: "이전 기록", time: "00:00:00" },
    { id: 6, title: "JavaScript 출력문 예제 1", tags: ["javascript", "출력문", "초급"], difficulty: "이전 기록", time: "00:00:00" },
    { id: 7, title: "Java 반복문 예제 1", tags: ["java", "반복문", "초급"], difficulty: "이전 기록", time: "00:00:00" },
    { id: 8, title: "Python 기초문장 예제 1", tags: ["python", "기초문장", "초급"], difficulty: "이전 기록", time: "00:00:00" }
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
      모든선택: true,
      python: false,
      javascript: false,
      java: false,
      반복문: false,
      출력문: false,
      기초문장: false,
      실제코드: false
    });
    setCompletedTags([]);
    setIsTagAdded(false);
    setFilteredProblems([]);
  };

  // 태그 선택 처리
  const handleTagSelect = (tag) => {
    if (tag === '모든선택') {
      setSelectedTags({
        모든선택: true,
        python: false,
        javascript: false,
        java: false,
        반복문: false,
        출력문: false,
        기초문장: false,
        실제코드: false
      });
    } else {
      setSelectedTags(prev => ({
        ...prev,
        모든선택: false,
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
      .filter(([key, value]) => value && key !== '모든선택')
      .map(([key]) => key);
    
    setCompletedTags(selected);
    setIsTagAdded(false);
    
    // 태그에 따른 문제 필터링
    filterProblems(selected);
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
        tags: ["python", "반복문", "초급"],
        difficulty: "이전 기록",
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
            {/* 태그 추가하기 버튼 - 밖으로 이동 */}
            <div className="mb-4">
              <button
                onClick={handleAddTag}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors"
              >
                추가하기
              </button>
            </div>

            {/* 태그 섹션 */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-gray-800">태그</h2>
              </div>

              {/* 완료된 태그들 표시 */}
              {completedTags.length > 0 && !isTagAdded && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {completedTags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
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
                    <span className="text-sm text-gray-600 font-medium min-w-16">모든 선택</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTagSelect('모든선택')}
                        className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                          selectedTags.모든선택
                            ? 'bg-teal-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        모든선택
                      </button>
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
                              ? 'bg-teal-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
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
                              ? 'bg-teal-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={handleCompleteTag}
                    className="w-full bg-teal-500 text-white py-3 rounded-lg font-medium text-base hover:bg-teal-600 transition-colors"
                  >
                    완료
                  </button>
                </div>
              )}

              {/* 초기화 버튼 */}
              {!isTagAdded && (
                <button 
                  onClick={handleReset}
                  className="bg-gray-500 text-white px-4 py-3 rounded-lg font-medium text-base hover:bg-gray-600 transition-colors"
                >
                  초기화
                </button>
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
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>{problem.difficulty}</span>
                      <span>⏱️ {problem.time}</span>
                    </div>
                    <button className="w-full mt-3 bg-teal-500 text-white py-2 rounded-md text-sm hover:bg-teal-600 transition-colors">
                      도전하기
                    </button>
                  </div>
                ))}
              </div>
              
              {isLoading && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500"></div>
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
                      ? 'bg-teal-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  오늘
                </button>
                <button 
                  onClick={() => handleRankingTabChange('이번주')}
                  className={`flex-1 py-2 text-sm font-medium ${
                    activeRankingTab === '이번주' 
                      ? 'bg-teal-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  이번주
                </button>
                <button 
                  onClick={() => handleRankingTabChange('이번달')}
                  className={`flex-1 py-2 rounded-r-lg text-sm font-medium ${
                    activeRankingTab === '이번달' 
                      ? 'bg-teal-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  이번달
                </button>
              </div>

              <div className="space-y-3">
                {rankings.map((rank, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      rank.name === 'me' 
                        ? 'bg-teal-50 border border-teal-200' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                        rank.rank <= 3 ? 'bg-teal-500' : 'bg-gray-400'
                      }`}
                    >
                      {rank.rank}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{rank.name}</div>
                      <div className="text-sm text-gray-600">⏱️ {rank.time}</div>
                    </div>
                  </div>
                ))}
                
                {rankings.length > 5 && (
                  <div className="text-center py-2">
                    <span className="text-gray-400 text-lg">⋮</span>
                  </div>
                )}
              </div>

              {selectedProblemSet && (
                <div className="mt-4 p-3 bg-teal-50 rounded-lg border border-teal-200">
                  <div className="text-sm text-teal-700">
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