import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Play, RotateCcw } from 'lucide-react';
import AIProblemModal from '../../components/workbook/AIProblemModal';
import { api } from '../../server';
import { toast } from 'react-toastify';

export default function CodingPlatform() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLanguage, setActiveLanguage] = useState('전체');
  
  // AI 문제 생성 모달 상태
  const [showAIModal, setShowAIModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiFormData, setAiFormData] = useState({
    language: 'Python',
    practiceType: '단어',
    problemCount: '',
    problemType: ''
  });

  const [problemSets, setProblemSets] = useState([]);
  const [loading, setLoading] = useState(true);

  // 서버에서 문제집 데이터 가져오기
  useEffect(() => {
    const fetchProblemSets = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/workbook');
        console.log('서버 응답 데이터:', response.data);
        console.log('데이터 타입:', typeof response.data);
        console.log('배열인가?', Array.isArray(response.data));
        console.log('데이터 길이:', response.data?.length);
        setProblemSets(response.data || []);
      } catch (error) {
        console.error('문제집 데이터 로딩 실패:', error);
        toast.error('문제집 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProblemSets();
  }, []);

  // 최근 추가된 문제집 (최신 5개)
  const recentProblemSets = problemSets.slice(0, 5);

  const languages = ['Python', 'Java', 'C', 'C++', 'Javascript', 'TypeScript', 'Go', 'Rust'];
  
  // 현재 문제집에 있는 언어들만 필터링
  const getAvailableLanguages = () => {
    const languageIds = problemSets.map(problemSet => problemSet.languageId);
    const uniqueLanguageIds = [...new Set(languageIds)];
    return ['전체', ...uniqueLanguageIds.map(id => getLanguageName(id))];
  };
  const languageToId = {
    Python: 1,
    Javascript: 5,
    Java: 2,
    C: 3,
    'C++': 4,
    Go: 7,
    Rust: 8,
    TypeScript: 6,
  };
  
  // ID를 언어 이름으로 변환하는 함수
  const getLanguageName = (languageId) => {
    const idToLanguage = {
      1: 'Python',
      2: 'Java', 
      3: 'C',
      4: 'C++',
      5: 'JavaScript',
      6: 'TypeScript',
      7: 'Go',
      8: 'Rust'
    };
    return idToLanguage[languageId] || `언어 ID: ${languageId}`;
  };
  
  // 연습 유형을 한국어로 변환하는 함수
  const getPracticeTypeKorean = (practiceType) => {
    const typeMap = {
      'PRACTICE_WORD': '단어',
      'PRACTICE_SENTENCE': '문장',
      'PRACTICE_FULL_CODE': '풀코드'
    };
    return typeMap[practiceType] || practiceType;
  };
  
  // AI 모달 옵션들
  const practiceTypes = ['단어', '문장', '풀코드'];
  
  // AI 모달 핸들러들
  const handleAIModalOpen = () => {
    setShowAIModal(true);
  };
  
  const handleAIModalClose = () => {
    setShowAIModal(false);
  };
  
  const handleAIFormChange = (field, value) => {
    setAiFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleAIGenerate = async () => {
    if (!aiFormData.problemCount || !aiFormData.problemType) {
      toast.error('문제 수와 문제 유형을 모두 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    try {
      const practiceTypeMap = {
        '단어': 'PRACTICE_WORD',
        '문장': 'PRACTICE_SENTENCE',
        '풀코드': 'PRACTICE_FULL_CODE',
      };

      // AI 생성 문제 개수 카운트 (같은 언어의 AI 생성 문제 개수)
      const aiGeneratedCount = problemSets.filter(problemSet => 
        problemSet.isAIGenerated && 
        problemSet.languageId === languageToId[aiFormData.language]
      ).length;

      const payload = {
        workbookLanguageId: languageToId[aiFormData.language] ?? 0,
        practiceType: practiceTypeMap[aiFormData.practiceType] ?? 'PRACTICE_WORD',
        workbookProblemsCount: parseInt(aiFormData.problemCount, 10),
        customRequirements: aiFormData.problemType,
        title: `${aiFormData.language} AI 생성 문제 ${aiGeneratedCount + 1}`,
        description: aiFormData.problemType
      };
      
      const response = await api.post('/api/workbook-ai', payload);
      
      toast.success('AI 문제가 성공적으로 생성되었습니다!');
      console.log('생성된 문제:', response.data);
      
      // 생성된 문제를 problemSets에 추가 (하나의 문제집으로 생성)
      if (response.data?.problems && Array.isArray(response.data.problems)) {
        const newWorkbook = {
          id: Date.now(),
          title: `${aiFormData.language} AI 생성 문제  ${aiGeneratedCount + 1}`,
          description: aiFormData.problemType,
          languageId: languageToId[aiFormData.language],
          practiceType: practiceTypeMap[aiFormData.practiceType],
          progress: 0,
          isAIGenerated: true,
          aiData: response.data.problems // 모든 문제를 aiData에 저장
        };
        // 최신 문제집을 상단에 보이도록 prepend
        setProblemSets((prev) => [newWorkbook, ...prev]);
        
        // 새로운 언어가 추가되면 필터 버튼도 업데이트됨 (getAvailableLanguages가 자동으로 반영)
      }
      
      setShowAIModal(false);
      // 폼 초기화
      setAiFormData({
        language: 'Python',
        practiceType: '단어',
        problemCount: '',
        problemType: ''
      });
    } catch (error) {
      console.error('AI 문제 생성 실패:', error);
      toast.error('AI 문제 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredProblemSets = problemSets.filter(problemSet => {
    const matchesSearch = problemSet.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (problemSet.description || problemSet.subtitle || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = activeLanguage === '전체' || getLanguageName(problemSet.languageId) === activeLanguage;
    return matchesSearch && matchesLanguage;
  });

  // 문제집 시작하기 핸들러
  const handleStartWorkbook = async (problemSet) => {
    console.log('시작하기:', problemSet);
    
    // practiceType에 따라 적절한 페이지로 이동
    const practiceTypeMap = {
      'PRACTICE_WORD': '/word',
      'PRACTICE_SENTENCE': '/sentence',
      'PRACTICE_FULL_CODE': '/full'
    };
    
    const route = practiceTypeMap[problemSet.practiceType];
    
    if (!route) {
      toast.error('지원하지 않는 연습 유형입니다.');
      return;
    }
    
    try {
      // API에서 문제집의 문제들을 가져오기
      const response = await api.get(`/api/workbook-ai/problems/${problemSet.id}`);
      console.log('문제집 문제 데이터:', response.data);
      console.log('데이터 타입:', typeof response.data);
      console.log('배열인가?', Array.isArray(response.data));
      
      // 응답 데이터 구조 확인 및 처리
      let problemsData = response.data;
      
      // 문자열이면 JSON 파싱 시도
      if (typeof problemsData === 'string') {
        // 빈 문자열이거나 공백만 있으면 빈 배열로 처리
        if (!problemsData.trim()) {
          console.warn('빈 응답 데이터');
          toast.error('문제 데이터가 비어있습니다.');
          return;
        }
        
        try {
          problemsData = JSON.parse(problemsData);
          console.log('JSON 파싱 후:', problemsData);
        } catch (e) {
          console.error('JSON 파싱 실패:', e);
          console.log('원본 문자열:', problemsData);
          // 파싱 실패하면 문자열 자체를 배열로 감싸기
          problemsData = [problemsData];
        }
      }
      
      // 만약 data가 객체이고 problems 필드가 있다면
      if (problemsData && typeof problemsData === 'object' && !Array.isArray(problemsData)) {
        problemsData = problemsData.problems || problemsData.data || [];
      }
      
      // 배열이 아니면 빈 배열로 처리
      if (!Array.isArray(problemsData)) {
        console.error('문제 데이터가 배열이 아닙니다:', problemsData);
        toast.error('문제 데이터 형식이 올바르지 않습니다.');
        return;
      }
      
      // content 필드에서 문제 내용 추출
      const problems = problemsData.map(problem => {
        if (typeof problem === 'string') {
          return problem;
        }
        return problem.content || problem.code || problem.text || problem;
      });
      
      if (problems.length === 0) {
        toast.error('문제가 없습니다.');
        return;
      }
      
      console.log('추출된 문제들:', problems);
      
      // 문제집 데이터와 함께 페이지로 이동
      navigate(route, {
        state: {
          language: problemSet.languageId,
          workbookId: problemSet.id,
          workbookTitle: problemSet.title,
          workbookProblems: problems
        }
      });
    } catch (error) {
      console.error('문제 데이터 로딩 실패:', error);
      toast.error('문제 데이터를 불러오는데 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* AI 문제 생성 모달 */}
      <AIProblemModal
        isOpen={showAIModal}
        onClose={handleAIModalClose}
        formData={aiFormData}
        onFormChange={handleAIFormChange}
        onGenerate={handleAIGenerate}
        languages={languages}
        practiceTypes={practiceTypes}
        isGenerating={isGenerating}
      />
      <div className="px-6 py-8 pt-20 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-10">
          {/* 메인 콘텐츠 영역 */}
          <div className="lg:col-span-7">
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
                className="py-4 pr-6 pl-12 w-full text-lg rounded-xl border border-gray-400 focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
            </div>

            {/* 필터 탭 */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex space-x-4">
                {getAvailableLanguages().map((language) => (
                  <button
                    key={language}
                    onClick={() => setActiveLanguage(language)}
                    className={`px-4.75 py-2.5 text-sm rounded-lg font-medium transition-colors ${
                      activeLanguage === language
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleAIModalOpen}
                className="px-5 py-2.5 font-medium text-white bg-teal-600 rounded-lg transition-colors hover:bg-teal-700"
              >
                AI 문제 생성
              </button>
            </div>

            {/* 문제집 카드 그리드 */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {loading ? (
                <div className="flex col-span-2 justify-center items-center py-12">
                  <div className="text-gray-500">로딩 중...</div>
                </div>
              ) : filteredProblemSets.length === 0 ? (
                <div className="flex col-span-2 justify-center items-center py-12">
                  <div className="text-gray-500">문제집이 없습니다.</div>
                </div>
              ) : (
                filteredProblemSets.map((problemSet) => {
                  console.log('문제집 데이터:', problemSet);
                  return (
                <div key={problemSet.id} className="p-6 bg-white rounded-xl shadow-md transition-shadow hover:shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="mb-1 text-xl font-bold text-gray-800">{problemSet.title}</h3>
                      <p className="text-sm text-gray-600">{problemSet.description || problemSet.subtitle}</p>
                    </div>
                  </div>
                  
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full">
                        {getLanguageName(problemSet.languageId)}
                      </span>
                      {problemSet.practiceType && (
                        <span className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full">
                          {getPracticeTypeKorean(problemSet.practiceType)}
                        </span>
                      )}
                    </div>

                  <button
                    onClick={() => handleStartWorkbook(problemSet)}
                    className="flex justify-center items-center py-3 w-full font-medium text-white bg-teal-600 rounded-lg transition-colors hover:bg-teal-700"
                  >
                    <Play className="mr-2 w-4 h-4" />
                    시작하기
                  </button>
                </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 p-6 bg-white rounded-xl shadow-md">
              <h3 className="mb-6 text-lg font-bold text-gray-800">최근 추가된 문제집</h3>
              
              <div className="space-y-2">
                {recentProblemSets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    문제집이 없습니다.
                  </div>
                ) : (
                  recentProblemSets.map((problemSet) => (
                    <div key={problemSet.id} className="p-4 bg-white rounded-xl border border-gray-200 shadow-md transition-shadow hover:shadow-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="mb-1 text-lg font-bold text-gray-800">{problemSet.title}</h3>
                          <p className="text-sm text-gray-600">{problemSet.description || problemSet.subtitle}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full">
                          {getLanguageName(problemSet.languageId)}
                        </span>
                        {problemSet.practiceType && (
                          <span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full">
                            {getPracticeTypeKorean(problemSet.practiceType)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleStartWorkbook(problemSet)}
                        className="flex justify-center items-center py-2 w-full text-sm font-medium text-white bg-teal-600 rounded-lg transition-colors hover:bg-teal-700"
                      >
                        <Play className="mr-1 w-3 h-3" />
                        시작하기
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}