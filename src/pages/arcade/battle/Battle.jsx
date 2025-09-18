import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/common/header/Header';
import Footer from '../../../components/common/footer/Footer';

function Arcade1V1() {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* 메인 콘텐츠 영역 - flex-1로 남은 공간 모두 차지 */}
      <main className="flex-1 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">대결전</h1>
          
          <div className="flex gap-8 justify-center">
            {/* 왼쪽 프로필 영역 - 291x572 */}
            <div className="w-[291px] h-[572px]">
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center h-full flex flex-col justify-center">
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
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z" clipRule="evenodd" />
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
                    <button className="bg-teal-400 hover:bg-teal-500 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                      방 입장
                    </button>
                    <button className="bg-teal-400 hover:bg-teal-500 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                      매칭 잡기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default Arcade1V1;