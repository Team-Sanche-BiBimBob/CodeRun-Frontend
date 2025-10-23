import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';


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
  const [activeRankingTab, setActiveRankingTab] = useState('오늘');
  const [rooms, setRooms] = useState([]);
  const [completionTimes, setCompletionTimes] = useState({});
  const [selectedProblem, setSelectedProblem] = useState(null);

  // 랭킹 데이터를 서버에서 가져오는 함수 (문제별)
  const fetchRankings = async (period, problemId = null) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.coderun.site';
      
      const params = {
        rankPeriod: period
      };
      
      // 문제별 랭킹인 경우 problemId 추가
      if (problemId) {
        params.problemId = problemId;
      }
      
      console.log(`${period} 랭킹 시도 중 (문제ID: ${problemId}): ${baseUrl}/api/arcade/rank`);
      const response = await axios.get(`${baseUrl}/api/arcade/rank`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        params: params
      });
      
      console.log(`${period} 랭킹 성공:`, response.data);
      return response.data.rankings || response.data || [];
    } catch (error) {
      console.error(`${period} 랭킹 가져오기 실패:`, error);
      // 서버에서 가져오기 실패 시 기본 데이터 사용
      return getDefaultRankings(period, problemId);
    }
  };

  // 기본 랭킹 데이터 (서버 연결 실패 시 사용)
  const getDefaultRankings = (period, problemId = null) => {
    const defaultData = {
      'DAILY': [
        { rank: 1, username: "김동현", score: 1926 },
        { rank: 2, username: "최해성", score: 1980 },
        { rank: 3, username: "서민덕", score: 2040 },
        { rank: 4, username: "서희원", score: 2136 },
        { rank: 5, username: "최장우", score: 2160 },
        { rank: 6, username: "차동규", score: 2220 }
      ],
      'WEEKLY': [
        { rank: 1, username: "김동현", score: 1725 },
        { rank: 2, username: "서민덕", score: 1812 },
        { rank: 3, username: "최해성", score: 1893 },
        { rank: 4, username: "서희원", score: 1938 },
        { rank: 5, username: "최장우", score: 2035 },
        { rank: 6, username: "차동규", score: 2122 }
      ],
      'MONTHLY': [
        { rank: 1, username: "서민덕", score: 1530 },
        { rank: 2, username: "김동현", score: 1605 },
        { rank: 3, username: "서희원", score: 1692 },
        { rank: 4, username: "최해성", score: 1773 },
        { rank: 5, username: "최장우", score: 1855 },
        { rank: 6, username: "차동규", score: 1938 }
      ]
    };
    return defaultData[period] || [];
  };

  // 시간을 초로 변환하는 함수 (score 표시용)
  const formatScore = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 초기 문제 데이터 - 언어당 하나씩만 (서버 ID에 맞게 수정)
  const initialProblems = [
    { id: 1, title: "Python 문장 연습", tags: ["python"], difficulty: "문장", time: "00:00:00" },
    { id: 2, title: "Python 풀코드 연습", tags: ["python"], difficulty: "풀코드", time: "00:00:00" },
    { id: 3, title: "Java 문장 연습", tags: ["java"], difficulty: "문장", time: "00:00:00" },
    { id: 4, title: "Java 풀코드 연습", tags: ["java"], difficulty: "풀코드", time: "00:00:00" },
    { id: 5, title: "JavaScript 문장 연습", tags: ["javascript"], difficulty: "문장", time: "00:00:00" },
    { id: 6, title: "JavaScript 풀코드 연습", tags: ["javascript"], difficulty: "풀코드", time: "00:00:00" }
  ];

  // 방 목록 가져오기 (API 스펙에 맞게 수정)
  const fetchRooms = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.coderun.site';
      
      const response = await axios.get(`${baseUrl}/api/rooms`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        params: {
          arcadeType: 'TIME_ATTACK', // TIME_ATTACK 타입만 필터링
          status: 'ACTIVE' // 활성 상태만 가져오기
        }
      });
      
      setRooms(response.data);
      console.log('방 목록:', response.data);
    } catch (error) {
      console.error('방 목록 가져오기 실패:', error);
      console.error('에러 상세:', error.response?.data);
    }
  };

  // 방 생성하기 (API 스펙에 맞게 수정)
  const createRoom = async (arcadeType, eventType, language, difficulty) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.coderun.site';
      
      // API 스펙에 맞는 요청 데이터 구조
      const requestData = {
        title: `${language} ${difficulty} 연습`,
        description: `${language} ${difficulty} 연습을 위한 방입니다`,
        arcadeType: arcadeType,
        eventType: eventType,
        // 추가 필드들 (API 스펙에 따라 조정)
        maxPlayers: 1,
        isPrivate: false,
        settings: {
          timeLimit: 300, // 5분 제한
          difficulty: difficulty
        }
      };
      
      console.log('방 생성 요청 데이터:', requestData);
      
      const response = await axios.post(`${baseUrl}/api/rooms`, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('방 생성 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('방 생성 실패:', error);
      console.error('에러 상세:', error.response?.data);
      return null;
    }
  };

  // 완료 시간 업데이트
  const updateCompletionTime = (problemId, time) => {
    setCompletionTimes(prev => ({
      ...prev,
      [problemId]: time
    }));
  };

  // 기록 삭제 함수
  const deleteRecord = (problemId) => {
    // sessionStorage에서 완료 시간 삭제
    sessionStorage.removeItem(`problem_${problemId}_completion`);
    
    // 상태에서도 완료 시간 제거
    setCompletionTimes(prev => {
      const newTimes = { ...prev };
      delete newTimes[problemId];
      return newTimes;
    });
    
    console.log(`문제 ${problemId} 기록 삭제됨`);
  };

  // 방 완료 시간 가져오기 (API 스펙에 맞게 수정)
  const fetchRoomCompletionTimes = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.coderun.site';
      
      const response = await axios.get(`${baseUrl}/api/rooms`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        params: {
          arcadeType: 'TIME_ATTACK',
          status: 'COMPLETED' // 완료된 방만 가져오기
        }
      });
      
      const completionTimesMap = {};
      response.data.forEach(room => {
        if (room.completionTime && room.arcadeType === 'TIME_ATTACK') {
          // 방의 이벤트 타입과 언어에 따라 문제 ID 매핑
          const problemId = getProblemIdFromRoom(room);
          if (problemId) {
            completionTimesMap[problemId] = room.completionTime;
          }
        }
      });
      
      // 실제로 변경된 데이터가 있을 때만 업데이트
      if (Object.keys(completionTimesMap).length > 0) {
        setCompletionTimes(prev => ({
          ...prev,
          ...completionTimesMap
        }));
        console.log('서버에서 완료 시간 업데이트:', completionTimesMap);
      }
      
    } catch (error) {
      // 에러 로그는 필요할 때만 출력
      // console.error('완료 시간 가져오기 실패:', error);
    }
  };

  // 방 정보에서 문제 ID 매핑 (더 정확한 매핑)
  const getProblemIdFromRoom = (room) => {
    // 방 제목이나 설명에서 언어와 타입을 추출
    const title = room.title || '';
    const description = room.description || '';
    
    // 언어 추출 (대소문자 구분 없이)
    let language = '';
    const titleLower = title.toLowerCase();
    const descLower = description.toLowerCase();
    
    if (titleLower.includes('python') || descLower.includes('python')) language = 'python';
    else if (titleLower.includes('java') || descLower.includes('java')) language = 'java';
    else if (titleLower.includes('javascript') || descLower.includes('javascript')) language = 'javascript';
    
    // 타입 추출
    let difficulty = '';
    if (room.eventType === 'PRACTICE_SENTENCE' || title.includes('문장')) difficulty = '문장';
    else if (room.eventType === 'PRACTICE_FULL_CODE' || title.includes('풀코드')) difficulty = '풀코드';
    else if (room.eventType === 'PRACTICE_WORD' || title.includes('단어')) difficulty = '단어';
    
    // 문제 ID 매핑
    const problemMap = {
      'python-문장': 1,
      'python-풀코드': 2,
      'python-단어': 3,
      'java-문장': 4,
      'java-풀코드': 5,
      'java-단어': 6,
      'javascript-문장': 7,
      'javascript-풀코드': 8,
      'javascript-단어': 9
    };
    
    const key = `${language}-${difficulty}`;
    const problemId = problemMap[key];
    console.log('방 매핑:', { title, eventType, language, difficulty, key, problemId });
    return problemId;
  };


  // sessionStorage에서 완료 시간 가져오기 (기록 유지)
  const loadCompletionTimeFromStorage = () => {
    try {
      // 모든 문제에 대해 완료 시간 확인
      const problemIds = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // 모든 문제 ID
      const newCompletionTimes = {};
      
      console.log('완료 시간 로드 시작...');
      
      problemIds.forEach(problemId => {
        const completionTime = sessionStorage.getItem(`problem_${problemId}_completion`);
        if (completionTime) {
          newCompletionTimes[problemId] = completionTime;
          console.log(`문제 ${problemId} 완료 시간 로드:`, completionTime);
        }
      });
      
      if (Object.keys(newCompletionTimes).length > 0) {
        setCompletionTimes(prev => ({
          ...prev,
          ...newCompletionTimes
        }));
        console.log('완료 시간 업데이트:', newCompletionTimes);
        
        // 기록 유지를 위해 sessionStorage에서 제거하지 않음
        // 페이지 새로고침 시에만 자동으로 사라짐
      } else {
        console.log('저장된 완료 시간이 없습니다.');
      }
      
    } catch (error) {
      console.error('sessionStorage에서 완료 시간 로드 실패:', error);
    }
  };

  useEffect(() => {
    setProblems(initialProblems);
    setFilteredProblems([]);
    fetchRooms();
    
    // 랭킹 데이터 가져오기
    const loadRankings = async () => {
      const periodMap = { '오늘': 'DAILY', '이번주': 'WEEKLY', '이번달': 'MONTHLY' };
      const period = periodMap[activeRankingTab];
      const rankingsData = await fetchRankings(period);
      setRankings(rankingsData);
    };
    
    loadRankings();
    
    // 서버에서 완료 시간 주기적으로 가져오기 (5초마다)
    const interval = setInterval(fetchRoomCompletionTimes, 5000);
    
    // 페이지 포커스 시 완료 시간 로드
    const handleFocus = () => {
      loadCompletionTimeFromStorage();
      fetchRoomCompletionTimes(); // 포커스 시에도 서버에서 최신 데이터 가져오기
    };
    
    window.addEventListener('focus', handleFocus);
    
    // 초기 로드 시에도 완료 시간 확인
    loadCompletionTimeFromStorage();
    fetchRoomCompletionTimes(); // 초기 로드 시에도 서버에서 데이터 가져오기
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [activeRankingTab]);

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

  // 문제 카드 클릭 핸들러
  const handleProblemClick = async (problem) => {
    setSelectedProblem(problem);
    
    // 선택된 문제의 랭킹 데이터 가져오기
    const periodMap = { '오늘': 'DAILY', '이번주': 'WEEKLY', '이번달': 'MONTHLY' };
    const period = periodMap[activeRankingTab];
    const rankingsData = await fetchRankings(period, problem.id);
    setRankings(rankingsData);
  };

  // 랭킹 탭 변경
  const handleRankingTabChange = async (tab) => {
    setActiveRankingTab(tab);
    
    if (selectedProblem) {
      // 선택된 문제가 있으면 해당 문제의 랭킹 가져오기
      const periodMap = { '오늘': 'DAILY', '이번주': 'WEEKLY', '이번달': 'MONTHLY' };
      const period = periodMap[tab];
      const rankingsData = await fetchRankings(period, selectedProblem.id);
      setRankings(rankingsData);
    } else {
      // 선택된 문제가 없으면 전체 랭킹 가져오기
      const periodMap = { '오늘': 'DAILY', '이번주': 'WEEKLY', '이번달': 'MONTHLY' };
      const period = periodMap[tab];
      const rankingsData = await fetchRankings(period);
      setRankings(rankingsData);
    }
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
  const handleChallengeClick = async (difficulty, problem) => {
    console.log('handleChallengeClick 호출됨:', { difficulty, problem });
    
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
    
    // 문제가 없으면 에러 처리
    if (!problem) {
      console.error('문제 객체가 없습니다.');
      return;
    }
    
    // 문제의 태그에서 언어 찾기
    const allLanguages = ['python', 'java', 'javascript', 'c', 'c++', 'typescript', 'go', 'rust'];
    const selectedLanguage = problem.tags ? 
                            problem.tags.find(tag => allLanguages.includes(tag)) : 
                            null;
    
    const languageId = selectedLanguage ? languageIdMap[selectedLanguage] : null;
    
    console.log('타임어택 디버깅:', {
      problem,
      problemTags: problem.tags,
      selectedLanguage,
      languageId,
      difficulty,
      problemTitle: problem.title
    });

    // 이벤트 타입 매핑
    const eventTypeMap = {
      '문장': 'PRACTICE_SENTENCE',
      '풀코드': 'PRACTICE_FULL_CODE',
      '단어': 'PRACTICE_WORD'
    };

    const eventType = eventTypeMap[difficulty];
    
    // 방 생성
    const room = await createRoom('TIME_ATTACK', eventType, selectedLanguage || 'python', difficulty);
    
    if (room) {
      console.log('방 생성 완료, 연습 페이지로 이동:', room);
      
      // 방 정보를 localStorage에 저장 (문제 ID와 함께)
      const problemId = getProblemIdFromLanguageAndDifficulty(selectedLanguage, difficulty);
      const roomData = {
        roomId: room.roomId,
        problemId: problemId,
        language: selectedLanguage,
        difficulty: difficulty,
        eventType: eventType
      };
      
      localStorage.setItem('currentRoom', JSON.stringify(roomData));
      localStorage.setItem(`roomInfo_${room.roomId}`, JSON.stringify(roomData));
      
      console.log('방 정보 저장:', roomData);
      
      if (difficulty === '문장') {
        if (languageId) {
          // sentence 페이지로 이동 (선택된 언어 ID와 방 ID 전달)
          window.location.href = `/sentence?language=${languageId}&roomId=${room.roomId}`;
        } else {
          // 일반 sentence 페이지로 이동
          window.location.href = `/sentence?roomId=${room.roomId}`;
        }
      } else if (difficulty === '풀코드') {
        if (languageId) {
          // full 페이지로 이동 (선택된 언어 ID와 방 ID 전달)
          window.location.href = `/full?language=${languageId}&roomId=${room.roomId}`;
        } else {
          // 일반 full 페이지로 이동
          window.location.href = `/full?roomId=${room.roomId}`;
        }
      } else if (difficulty === '단어') {
        if (languageId) {
          // word 페이지로 이동 (선택된 언어 ID와 방 ID 전달)
          window.location.href = `/word?language=${languageId}&roomId=${room.roomId}`;
        } else {
          // 일반 word 페이지로 이동
          window.location.href = `/word?roomId=${room.roomId}`;
        }
      }
    } else {
      console.error('방 생성 실패, 기본 페이지로 이동');
      
      // 방 생성 실패 시 기본 동작
      if (difficulty === '문장') {
        if (languageId) {
          window.location.href = `/sentence?language=${languageId}`;
        } else {
          window.location.href = '/sentence';
        }
      } else if (difficulty === '풀코드') {
        if (languageId) {
          window.location.href = `/full?language=${languageId}`;
        } else {
          window.location.href = '/full';
        }
      } else if (difficulty === '단어') {
        if (languageId) {
          window.location.href = `/word?language=${languageId}`;
        } else {
          window.location.href = '/word';
        }
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl px-6 py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">타임어택</h1>
        
        <div className="flex gap-6">
          <div className="flex-1">
            {/* 태그 섹션 */}
            <div className="p-6 mb-6 bg-white shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-semibold text-gray-800">태그</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg hover:opacity-90"
                    style={{ backgroundColor: '#14B8A6' }}
                  >
                    추가하기
                  </button>
                  {!isTagAdded && (
                    <button 
                      onClick={handleReset}
                      className="flex items-center justify-center w-8 h-8 text-gray-500 transition-colors rounded-lg hover:text-gray-700 hover:bg-gray-100"
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
                    <span className="text-sm font-medium text-gray-600 min-w-16">문제 유형</span>
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
                    <span className="text-sm font-medium text-gray-600 min-w-16">언어 선택</span>
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
                    <span className="text-sm font-medium text-gray-600 min-w-16">유형 선택</span>
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
                    className="w-full py-3 text-base font-medium text-white transition-colors rounded-lg hover:opacity-90"
                    style={{ backgroundColor: '#14B8A6' }}
                  >
                    완료
                  </button>
                </div>
              )}
            </div>

            {/* 문제 목록 */}
            <div className="p-6 overflow-y-auto bg-white shadow-sm h-96 rounded-xl">
              <div className="grid grid-cols-2 gap-4">
                {(filteredProblems.length > 0 ? filteredProblems : problems).map((problem) => (
                  <div
                    key={problem.id}
                    className={`relative p-4 transition-shadow rounded-lg bg-gray-50 hover:shadow-md cursor-pointer ${
                      selectedProblem?.id === problem.id ? 'ring-2 ring-teal-500 bg-teal-50' : ''
                    }`}
                    onClick={() => handleProblemClick(problem)}
                  >
                    {/* 기록 삭제 버튼 */}
                    {completionTimes[problem.id] && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRecord(problem.id);
                        }}
                        className="absolute flex items-center justify-center w-6 h-6 text-red-500 transition-colors rounded-full top-2 right-2 hover:text-red-700 hover:bg-red-100"
                        title="기록 삭제"
                      >
                        ✕
                      </button>
                    )}
                    
                    <h3 className="mb-3 font-semibold text-gray-800">{problem.title}</h3>
                    <div className="flex gap-2 mb-3">
                      {problem.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-200 rounded">
                          {tag}
                        </span>
                      ))}
                      <span className="px-2 py-1 text-xs bg-gray-200 rounded">
                        {problem.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
                      <span>⏱️ {completionTimes[problem.id] || problem.time}</span>
                      {completionTimes[problem.id] && (
                        <span className="text-xs text-green-600">✓ 완료</span>
                      )}
                      <div className="text-xs text-gray-400">
                        ID: {problem.id} | 완료시간: {completionTimes[problem.id] || '없음'}
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-center text-gray-500">
                      {selectedProblem?.id === problem.id ? '선택됨 - 랭킹 보기' : '클릭하여 랭킹 보기'}
                    </div>
                    
                    {/* 도전하기 버튼 */}
                    {selectedProblem?.id === problem.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChallengeClick(problem.difficulty, problem);
                        }}
                        className="w-full py-2 mt-3 text-sm text-white transition-colors rounded-md hover:opacity-90"
                        style={{ backgroundColor: '#2DD4BF' }}
                      >
                        도전하기
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽 랭킹 섹션 */}
          <div className="w-80">
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🏆</span>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {selectedProblem ? `${selectedProblem.title} 랭킹` : '전체 랭킹'}
                  </h2>
                  {selectedProblem && (
                    <p className="text-sm text-gray-500">{selectedProblem.difficulty}</p>
                  )}
                </div>
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
                  const showDots = rank.username === 'me' && rank.rank > 6;
                  
                  return (
                    <React.Fragment key={index}>
                      {showDots && (
                        <div className="py-2 text-center">
                          <span className="text-lg text-gray-400">⋮</span>
                        </div>
                      )}
                      <div
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          rank.username === 'me' 
                            ? 'border' 
                            : 'bg-gray-50'
                        }`}
                        style={rank.username === 'me' ? { backgroundColor: '#F0FDFA', borderColor: '#14B8A6' } : {}}
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
                          <div className="font-medium text-gray-800">{rank.username}</div>
                          <div className="text-sm text-gray-600">⏱️ {formatScore(rank.score)}</div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {selectedProblemSet && (
                <div className="p-3 mt-4 border rounded-lg" style={{ backgroundColor: '#F0FDFA', borderColor: '#14B8A6' }}>
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