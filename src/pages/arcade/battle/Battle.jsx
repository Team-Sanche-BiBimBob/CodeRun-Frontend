import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../../components/common/footer/Footer';
import userImg from '../../../assets/user.jpg';

function Battle() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('사용자');
  const [userInfo, setUserInfo] = useState(null);
  const [isMatchingModalOpen, setIsMatchingModalOpen] = useState(false);
  const [matchingTime, setMatchingTime] = useState(0);
  const [expectedMatchingTime, setExpectedMatchingTime] = useState(0);

  // 매칭 타이머 효과
  useEffect(() => {
    let interval = null;
    if (isMatchingModalOpen) {
      interval = setInterval(() => {
        setMatchingTime(prevTime => prevTime + 1);
        // 예상 매칭시간은 10초로 고정
      }, 1000);
    } else {
      setMatchingTime(0);
      setExpectedMatchingTime(10); // 10초로 고정
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMatchingModalOpen]);

  // 로그인 상태 및 사용자 정보 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const accessToken = localStorage.getItem('accessToken');
      const userInfoString = localStorage.getItem('userInfo');
      
      if (accessToken && userInfoString) {
        try {
          const user = JSON.parse(userInfoString);
          setIsLoggedIn(true);
          setUserName(user.name || user.username || '사용자');
          setUserInfo(user);
        } catch (error) {
          console.error('사용자 정보 파싱 오류:', error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  // 더미 대결방 데이터
  const battleRooms = [
    { id: 1, name: '23 name', players: '1/2', status: 'open', level: '고수만', folds: 300 },
    { id: 2, name: '23 name', players: '1/2', status: 'locked', level: '출입만 ^^', folds: 300 },
    { id: 3, name: '23 name', players: '1/2', status: 'locked', level: '출입만 ^^', folds: 300 },
    { id: 4, name: '23 name', players: '1/2', status: 'open', level: '출입만 ^^', folds: 300 },
    { id: 5, name: '23 name', players: '1/2', status: 'locked', level: '출입만 ^^', folds: 300 },
    { id: 6, name: '23 name', players: '1/2', status: 'locked', level: '출입만 ^^', folds: 300 },
  ];

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    setUserName('사용자');
    setUserInfo(null);
  };

  const handleStartMatching = () => {
    console.log('매칭 시작!'); // 디버그용
    setIsMatchingModalOpen(true);
  };

  const handleCancelMatching = () => {
    console.log('매칭 취소!'); // 디버그용
    setIsMatchingModalOpen(false);
  };

  // 시간 포맷 함수 (MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* 메인 콘텐츠 영역 - flex-1로 남은 공간 모두 차지 */}
      <main className="flex-1 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">대결전</h1>
          
          <div className="flex gap-8 justify-center">
            {/* 왼쪽 프로필 영역 - 291x572 */}
            <div className="w-[291px] h-[572px]">
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center h-full flex flex-col justify-center">
                {isLoggedIn ? (
                  // 로그인된 상태
                  <>
                    <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden">
                      <img 
                        src={userImg}
                        alt="사용자 프로필"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">{userName}</h2>
                    
                    {/* 승패 및 승률 정보 */}
                    <div className="text-center mb-8">
                      <p className="text-lg font-medium text-gray-800 mb-2">
                        {userInfo?.wins || '10'}승 {userInfo?.losses || '30'}패
                      </p>
                      <p className="text-base text-gray-600">
                        {userInfo?.winRate || '25'}%
                      </p>
                    </div>

                    <button 
                      onClick={handleLogout}
                      className="w-full bg-teal-400 hover:bg-teal-500 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  // 로그인되지 않은 상태
                  <>
                    <div className="w-32 h-32 bg-gray-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <span className="text-white text-sm">user profile</span>
                    </div>
                    <p className="text-gray-600 mb-6">로그인이 필요합니다</p>
                    <button 
                      onClick={handleLogin}
                      className="w-full bg-teal-400 hover:bg-teal-500 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      로그인
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* 오른쪽 대결방 영역 - 843x572 */}
            <div className="w-[843px] h-[572px]">
              <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">대결방</h2>
                
                {/* 대결방 그리드 */}
                <div className="grid grid-cols-2 gap-4 mb-6 flex-1">
                  {battleRooms.map((room) => (
                    <div 
                      key={room.id} 
                      className="relative p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer h-fit"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-800">{room.name}님의 방</h3>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-gray-600">{room.players}</span>
                          {room.status === 'locked' && (
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{room.level}</p>
                      <p className="text-sm text-gray-600">폴드 {room.folds}초</p>
                    </div>
                  ))}
                </div>

                {/* 하단 컨트롤 */}
                <div className="flex items-center justify-end pt-4 border-t border-gray-200 mt-auto">
                  <div className="flex gap-3">
                    <button 
                      className={`font-medium py-2 px-6 rounded-lg transition-colors ${
                        isLoggedIn 
                          ? 'bg-teal-400 hover:bg-teal-500 text-white' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!isLoggedIn}
                    >
                      방 입장
                    </button>
                    <button 
                      className={`font-medium py-2 px-6 rounded-lg transition-colors ${
                        isLoggedIn 
                          ? 'bg-teal-400 hover:bg-teal-500 text-white' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!isLoggedIn}
                      onClick={handleStartMatching}
                    >
                      매칭 잡기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 매칭 모달 */}
      {isMatchingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-5 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96 relative shadow-2xl border-2 border-gray-100">
            {/* 오른쪽 상단 버퍼링 스피너 */}
            <div className="absolute top-4 right-4">
              <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <div className="text-center">
              {/* 매칭중 텍스트 */}
              <div className="flex items-center justify-center mb-6">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-medium">매칭중</span>
              </div>

              {/* 사용자 프로필 */}
              <div className="w-20 h-20 bg-teal-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>

              {/* 시간 표시 */}
              <div className="mb-6 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">매칭 시간</span>
                  <span className="font-medium">{formatTime(matchingTime)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">예상 매칭 시간</span>
                  <span className="font-medium">00:10</span>
                </div>
              </div>

              {/* 매칭 취소 버튼 */}
              <button
                onClick={handleCancelMatching}
                className="w-full bg-teal-400 hover:bg-teal-500 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                매칭 취소
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Battle;