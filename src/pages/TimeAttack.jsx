import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import axios from 'axios';

const Competition = () => {
  const [type, setType] = useState("단어");
  const [selectedPeriod, setSelectedPeriod] = useState("DAILY");
  const [rankings, setRankings] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [myRank, setMyRank] = useState(null);
  const [problemSets, setProblemSets] = useState([]);
  const [selectedProblemSet, setSelectedProblemSet] = useState(null);
  const [loading, setLoading] = useState(false);

  // 문제집 목록 가져오기 (실제 API 엔드포인트로 교체 필요)
  useEffect(() => {
    const fetchProblemSets = async () => {
      try {
        // 실제 문제집 목록 API 호출
        // const response = await axios.get('/problem-sets');
        // setProblemSets(response.data);
      } catch (error) {
        console.error("문제집 목록을 가져오는데 실패했습니다:", error);
      }
    };
    
    if (type === "문제집") {
      fetchProblemSets();
    }
  }, [type]);

  // 랭킹 데이터 가져오기
  const fetchRankings = async () => {
    if (type === "문제집" && !selectedProblemSet) {
      setRankings([]);
      setTotalCount(0);
      setMyRank(null);
      console.log('Rankings:', rankings);
      console.log('Loading:', loading);
      return;
    }

    setLoading(true);
    try {
      let url = `/arcade/rank?rankPeriod=${selectedPeriod}`;
      
      if (type === "문제집" && selectedProblemSet) {
        url += `&problemSetId=${selectedProblemSet.id}`;
      }

      const response = await axios.get(url);
      
      if (response.data && response.data.rankings) {
        setRankings(response.data.rankings);
        setTotalCount(response.data.totalCount || 0);
        
        // 내 랭킹 찾기 (실제 로그인된 사용자 ID로 비교 필요)
        const currentUserId = 0; // 실제 로그인된 사용자 ID
        const myRanking = response.data.rankings.find(r => r.userId === currentUserId);
        setMyRank(myRanking);
      } else {
        setRankings([]);
        setTotalCount(0);
        setMyRank(null);
      }
    } catch (error) {
      console.error("랭킹 데이터를 가져오는데 실패했습니다:", error);
      setRankings([]);
      setTotalCount(0);
      setMyRank(null);
    } finally {
      setLoading(false);
    }
  };

  // 타입, 기간, 문제집이 변경될 때마다 랭킹 다시 가져오기
  useEffect(() => {
    fetchRankings();
  }, [type, selectedPeriod, selectedProblemSet]);

  const handleChangeType = (newType) => { 
    setType(newType);
    if (newType === "단어") {
      setSelectedProblemSet(null);
    }
    setRankings([]);
    setTotalCount(0);
    setMyRank(null);
  };

  const handleSelectProblemSet = (set) => {
    setSelectedProblemSet(set);
  };

  const handleStartGame = async () => {
    try {
      const requestBody = {
        userId: 0, // 실제 사용자 ID
        score: 0,
        rankPeriod: selectedPeriod
      };
      
      if (type === "문제집" && selectedProblemSet) {
        requestBody.problemSetId = selectedProblemSet.id;
      }
      
      await axios.post('/arcade/rank', requestBody);
      
      // navigate("/selectLanguage"); 
      console.log("게임 시작!");
    } catch (error) {
      console.error("게임 시작 실패:", error);
    }
  };

  const formatTime = (score) => {
    const hours = Math.floor(score / 3600);
    const minutes = Math.floor((score % 3600) / 60);
    const seconds = score % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 서브 헤더 */}
      <div className="px-6 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center max-w-6xl mx-auto space-x-8">
          <span className="font-medium text-teal-600">타임어택</span>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-6xl px-6 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* 왼쪽 - 게임 설정 */}
          <div className="space-y-6">
            {/* 단어/문제집 섹션 */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg">
              <h3 className="mb-8 text-2xl font-bold text-center text-gray-800">타임어택</h3>
              
              <div className="space-y-4">
                <div 
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    type === '단어' ? 'bg-teal-50 border-2 border-teal-200' : 'bg-gray-50 border-2 border-gray-200'
                  }`}
                  onClick={() => handleChangeType("단어")}
                >
                  <span className="text-lg font-medium text-gray-700">단어</span>
                </div>
                
                <div 
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    type === '문제집' ? 'bg-teal-50 border-2 border-teal-200' : 'bg-gray-50 border-2 border-gray-200'
                  }`}
                  onClick={() => handleChangeType("문제집")}
                >
                  <span className="text-lg font-medium text-gray-700">문제집</span>
                </div>

                {/* 문제집 선택 시 문제집 목록 표시 */}
                {type === '문제집' && (
                  <div className="pl-4 mt-4 space-y-2">
                    {problemSets.length > 0 ? (
                      problemSets.map((set) => (
                        <div
                          key={set.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedProblemSet?.id === set.id
                              ? 'bg-teal-100 border-2 border-teal-300'
                              : 'bg-gray-100 border-2 border-gray-300'
                          }`}
                          onClick={() => handleSelectProblemSet(set)}
                        >
                          <span className="text-base font-medium text-gray-700">{set.name}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-500">
                        문제집이 없습니다
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 오른쪽 - 랭킹 */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                랭킹
                {type === '문제집' && selectedProblemSet && (
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    - {selectedProblemSet.name}
                  </span>
                )}
              </h3>
              
              {/* 기간 선택 탭 */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedPeriod("DAILY")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedPeriod === "DAILY"
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  오늘
                </button>
                <button
                  onClick={() => setSelectedPeriod("WEEKLY")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedPeriod === "WEEKLY"
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  이번주
                </button>
                <button
                  onClick={() => setSelectedPeriod("MONTHLY")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedPeriod === "MONTHLY"
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  이번달
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              {loading ? (
                <div className="p-8 text-center text-gray-500 bg-white border border-gray-200 rounded-lg">
                  로딩중...
                </div>
              ) : type === '문제집' && !selectedProblemSet ? (
                <div className="p-8 text-center text-gray-500 bg-white border border-gray-200 rounded-lg">
                  문제집을 선택해주세요
                </div>
              ) : rankings.length > 0 ? (
                <>
                  {rankings.map((item, index) => (
                    <div 
                      key={index} 
                      className={`rounded-lg p-4 flex items-center justify-between border ${
                        myRank && item.rank === myRank.rank
                          ? 'bg-teal-50 border-2 border-teal-300'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 ${
                          item.rank <= 3 ? 'bg-yellow-500' : 
                          myRank && item.rank === myRank.rank ? 'bg-teal-600' : 'bg-teal-500'
                        } text-white rounded flex items-center justify-center font-bold text-sm`}>
                          {item.rank}
                        </div>
                        <span className="font-medium text-gray-700">{item.username}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-mono text-gray-800">{formatTime(item.score)}</span>
                      </div>
                    </div>
                  ))}
                  
                  {/* 더보기 버튼 */}
                  {totalCount > rankings.length && (
                    <div className="flex justify-center pt-2">
                      <button className="text-gray-500 hover:text-gray-700">
                        ⋯
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center text-gray-500 bg-white border border-gray-200 rounded-lg">
                  랭킹 데이터가 없습니다
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={handleStartGame}
                className="px-8 py-3 font-medium text-white transition-colors bg-teal-500 rounded-lg hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={type === '문제집' && !selectedProblemSet}
              >
                도전하기
              </button>
            </div>
          </div>ç
        </div>
      </div>
    </div>
  );
};

export default Competition;