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
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [battleRooms, setBattleRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  // 매칭 타이머 효과
  useEffect(() => {
    let interval = null;
    if (isMatchingModalOpen) {
      interval = setInterval(() => {
        setMatchingTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      setMatchingTime(0);
      setExpectedMatchingTime(10);
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
    console.log('매칭 시작!');
    setIsMatchingModalOpen(true);
  };

  const handleCancelMatching = () => {
    console.log('매칭 취소!');
    setIsMatchingModalOpen(false);
  };

  const handleCreateRoom = () => {
    console.log('방 생성하기 클릭!');
    setIsCreateRoomModalOpen(true);
  };

  const handleCloseCreateRoomModal = () => {
    setIsCreateRoomModalOpen(false);
  };

  const handleSubmitCreateRoom = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const newRoom = {
      id: Date.now(),
      name: formData.get('roomName'),
      players: '1/2',
      status: formData.get('password') ? 'locked' : 'open',
      type: formData.get('practiceType'),
      timeLimit: formData.get('timeLimit'),
      createdBy: userName
    };

    setBattleRooms(prev => [...prev, newRoom]);
    console.log('방 생성 완료:', newRoom);
    setIsCreateRoomModalOpen(false);
  };

  const handleSelectRoom = (roomId) => {
    setSelectedRoomId(selectedRoomId === roomId ? null : roomId);
  };

  // 시간 포맷 함수 (MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      <main className="flex-1 pt-24 pb-8">
        <div className="px-4 mx-auto max-w-7xl">
          <h1 className="mb-8 text-3xl font-bold text-gray-800">대결전</h1>
          
          <div className="flex justify-center gap-8">
            {/* 왼쪽 프로필 영역 */}
            <div className="w-[291px] h-[572px]">
              <div className="flex flex-col justify-center h-full p-8 text-center bg-white border border-gray-200 rounded-lg">
                {isLoggedIn ? (
                  <>
                    <div className="w-32 h-32 mx-auto mb-6 overflow-hidden rounded-full">
                      <img 
                        src={userImg}
                        alt="사용자 프로필"
                        className="object-cover w-full h-full"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <h2 className="mb-4 text-xl font-semibold text-gray-800">{userName}</h2>
                    <div className="mb-8 text-center">
                      <p className="mb-2 text-lg font-medium text-gray-800">
                        {userInfo?.wins || '0'}승 {userInfo?.losses || '0'}패
                      </p>
                      <p className="text-base text-gray-600">
                        {userInfo?.winRate || '0'}%
                      </p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full px-6 py-3 font-medium text-white transition-colors bg-teal-400 rounded-lg hover:bg-teal-500"
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center w-32 h-32 mx-auto mb-6 bg-gray-500 rounded-full">
                      <span className="text-sm text-white">user profile</span>
                    </div>
                    <p className="mb-6 text-gray-600">로그인이 필요합니다</p>
                    <button 
                      onClick={handleLogin}
                      className="w-full px-6 py-3 font-medium text-white transition-colors bg-teal-400 rounded-lg hover:bg-teal-500"
                    >
                      로그인
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* 오른쪽 대결방 영역 */}
            <div className="w-[843px] h-[572px]">
              <div className="flex flex-col h-full p-6 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">대결방</h2>
                  <button 
                    onClick={handleCreateRoom}
                    className={`font-medium py-2 px-4 rounded-lg transition-colors ${
                      isLoggedIn 
                        ? 'bg-teal-400 hover:bg-teal-500 text-white' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!isLoggedIn}
                  >
                    방 생성하기
                  </button>
                </div>
                
                <div className="flex-1 mb-6 overflow-y-auto">
                  {battleRooms.length > 0 ? (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-5 auto-rows-max">
                      {battleRooms.map((room) => (
                        <div 
                          key={room.id} 
                          onClick={() => handleSelectRoom(room.id)}
                          className={`relative flex flex-col justify-between p-4 transition-all duration-200 border rounded-lg cursor-pointer min-h-[100px] h-auto
                            ${selectedRoomId === room.id 
                              ? 'border-2 border-teal-400' 
                              : 'border border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="mb-1 font-medium text-gray-800">{room.createdBy}님의 방</h3>
                              <p className="mb-1 text-gray-700">{room.name}</p>
                              <p className="text-sm text-gray-600">{room.type} {room.timeLimit}초</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-gray-600">{room.players}</span>
                              {room.status === 'locked' && (
                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="mb-6">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <h3 className="mb-2 text-lg font-medium text-gray-500">생성된 방이 없습니다</h3>
                        <p className="text-sm text-gray-400">새로운 대결방을 만들어보세요!</p>
                      </div>
                      <button 
                        onClick={handleCreateRoom}
                        className={`font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2 ${
                          isLoggedIn 
                            ? 'bg-teal-400 hover:bg-teal-500 text-white' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!isLoggedIn}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        방 추가하기
                      </button>
                      {!isLoggedIn && (
                        <p className="mt-3 text-xs text-gray-400">로그인 후 이용 가능합니다</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end pt-4 mt-auto border-t border-gray-200">
                  <div className="flex gap-3">
                    <button 
                      className={`font-medium py-2 px-6 rounded-lg transition-colors ${
                        isLoggedIn && selectedRoomId
                          ? 'bg-teal-400 hover:bg-teal-500 text-white' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!isLoggedIn || !selectedRoomId}
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
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center" 
          style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
        >
          <div className="relative p-8 bg-white border-2 border-gray-100 rounded-lg shadow-2xl w-96">
            <div className="absolute top-4 right-4">
              <div className="w-6 h-6 border-2 border-teal-400 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-medium">매칭중</span>
              </div>
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-teal-400 rounded-full">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="mb-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">매칭 시간</span>
                  <span className="font-medium">{formatTime(matchingTime)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">예상 매칭 시간</span>
                  <span className="font-medium">00:10</span>
                </div>
              </div>
              <button
                onClick={handleCancelMatching}
                className="w-full px-6 py-3 font-medium text-white transition-colors bg-teal-400 rounded-lg hover:bg-teal-500"
              >
                매칭 취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 방 생성 모달 */}
      {isCreateRoomModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center" 
          style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
          onClick={handleCloseCreateRoomModal}
        >
          <div 
            className="relative p-6 bg-white border-2 border-gray-100 rounded-lg shadow-2xl w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">방 생성하기</h3>
              <button
                onClick={handleCloseCreateRoomModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitCreateRoom} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  방 이름
                </label>
                <input
                  type="text"
                  name="roomName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="방 이름을 입력하세요"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  연습 유형
                </label>
                <select 
                  name="practiceType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <option value="단어">단어</option>
                  <option value="문장">문장</option>
                  <option value="풀코드">풀코드</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  제한 시간 (초)
                </label>
                <select 
                  name="timeLimit"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <option value="30">30초</option>
                  <option value="60">60초</option>
                  <option value="120">120초</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  비밀번호 (선택)
                </label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseCreateRoomModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-teal-400 rounded-lg hover:bg-teal-500"
                >
                  생성
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Battle;