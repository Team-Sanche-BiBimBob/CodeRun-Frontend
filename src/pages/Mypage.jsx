import React, { useState, useEffect } from 'react';
import userImg from '../assets/user.jpg';
import { toast } from 'react-toastify';
import { ChevronRight } from 'lucide-react';
import { api } from '../server';
import { useNavigate } from 'react-router';

  const MyPage = () => {

  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('사용자');
  const [userInfo, setUserInfo] = useState("이메일");
  const [userProfile, setUserProfile] = useState(null); // New state for user profile
  const [userRole, setUserRole] = useState(null); // New state for user role

  // JWT 토큰 디코딩 함수
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('JWT 디코딩 오류:', error);
      return null;
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => { // Made async to await API call
      const accessToken = localStorage.getItem('accessToken');
      const userInfoString = localStorage.getItem('userInfo');
      
      if (accessToken && userInfoString) {
        try {
          // JWT 토큰에서 유저 정보 디코딩
          const tokenPayload = decodeJWT(accessToken);
          console.log('JWT 토큰 페이로드 전체:', tokenPayload);
          console.log('토큰 페이로드의 모든 키:', Object.keys(tokenPayload));
          
          const user = JSON.parse(userInfoString);
          console.log('Parsed user info:', user);
          setIsLoggedIn(true);
          
          // 토큰에서 사용자 정보 추출 (userid 필드 사용)
          const userId = tokenPayload.userid || tokenPayload.userId || tokenPayload.id || user.id;
          const userRole = tokenPayload.role || tokenPayload.userRole || user.role;
          
          console.log('토큰에서 추출한 userId:', userId);
          console.log('토큰에서 추출한 role:', userRole);
          
          setUserRole(userRole);

          // userId가 없으면 경고 출력
          if (!userId) {
            console.warn('userId가 없습니다. 토큰과 userInfo를 확인해주세요.');
            console.log('토큰 페이로드:', tokenPayload);
            console.log('userInfo 내용:', user);
            return;
          }
          
          console.log('최종 사용할 User ID:', userId);
          
          try {
            const response = await api.get(`/api/user/profile/${userId}`); // 토큰에서 추출한 userId 사용
            console.log('마이페이지 데이터:', response.data);
            console.log('사용자 역할:', userRole);
            setUserProfile(response.data);
            
            // 서버에서 받아온 닉네임으로 userName 설정
            console.log('서버 응답 데이터:', response.data);
            console.log('username:', response.data.username);
            console.log('userDescription:', response.data.userDescription);
            
            // 토큰에서 username 추출하여 사용
            const tokenUsername = tokenPayload.username || tokenPayload.name || tokenPayload.nickname;
            console.log('토큰에서 추출한 username:', tokenUsername);
            
            // 토큰의 username 우선 사용, 없으면 서버 데이터 사용
            setUserName(tokenUsername || response.data.username || user.name || user.username || '사용자');
            
          } catch (apiError) {
            console.error('프로필 API 요청 실패:', apiError);
            console.error('API 응답:', apiError.response?.data);
            console.error('상태 코드:', apiError.response?.status);
            
            // API 실패 시 토큰의 username 사용
            const tokenUsername = tokenPayload.username || tokenPayload.name || tokenPayload.nickname;
            setUserName(tokenUsername || user.name || user.username || '사용자');
            setUserProfile(null);
          }
          
          // 이메일은 로컬 스토리지에서 가져오기 (원래대로)
          setUserInfo(user.email);
          

        } catch (error) {
          console.error('사용자 정보 파싱 오류 또는 마이페이지 데이터 가져오기 오류:', error);
          setIsLoggedIn(false);
          // Removed navigate("/login") here, as authentication errors are now handled by the interceptor
        }
      } else {
        navigate("/login")
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, [navigate]); // Added navigate to dependency array

  return (
    <div className="min-h-screen bg-white">
      <h1 className="px-8 py-6 text-3xl font-bold">마이페이지</h1>
      
      <div className="flex gap-8 px-8 pb-8">
        {/* 왼쪽 사이드바 */}
        <div className="flex flex-col justify-between p-8 rounded-lg w-80 bg-gray-50" style={{ height: '640px' }}>
                      <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-40 h-40 mb-6 overflow-hidden bg-gray-300 rounded-full">
                        {userProfile && userProfile.profileImage && userProfile.profileImage !== "/string" ? (
                          <img src={userProfile.profileImage} alt="Profile" className="object-cover w-full h-full" />
                        ) : (
                          <span className="text-6xl font-bold text-gray-600">U</span>
                        )}
                      </div>
                      
                      <h2 className="mb-2 text-2xl font-bold">{userName}</h2>
                      <p className="mb-6 text-gray-600">{userInfo}</p>
                      
                      <button className="px-4 py-2 font-medium text-white bg-teal-500 rounded">
                        레벨 15
                      </button>
                    </div>
          <div className="flex flex-col items-center pt-4 border-t border-gray-300">
            <button className="mb-3 text-sm font-medium text-red-500 hover:text-red-600" onClick={()=>{
              localStorage.removeItem('accessToken');
              localStorage.removeItem('userInfo');
              setIsLoggedIn(false);
              setUserName('사용자');
              setUserInfo(null);
              navigate('/');
            
            }}>
              로그아웃
            </button>
            <button className="text-sm font-medium text-red-500 hover:text-red-600" onClick={()=>{
              api.delete("/auth/withdraw").then(()=>{
                localStorage.removeItem('accessToken');
                localStorage.removeItem('userInfo');
                setIsLoggedIn(false);
                setUserName('사용자');
                setUserInfo(null);
                navigate('/');                
              }).catch(err=>{
                console.log(err)
              })

            }}>
              회원 탈퇴
            </button>
          </div>
        </div>

        {/* 오른쪽 메인 컨텐츠 */}
        <div className="flex-1">
          {/* 최근 학습한 언어 섹션 */}
          {userProfile && userProfile.recentlyStudiedLanguage ? (
            <div className="p-8 mb-8 bg-white rounded-lg shadow-sm">
              <h3 className="mb-6 text-xl font-bold text-gray-800">최근 학습한 언어</h3>
              
              <div className="p-6 bg-white rounded-lg border border-gray-200">
                <h4 className="mb-3 text-xl font-bold text-gray-800">{userProfile.recentlyStudiedLanguage.name}</h4>
                <p className="mb-4 text-sm text-gray-700">
                  {userProfile.recentlyStudiedLanguage.description}
                </p>
                
                {/* 진행도 표시 */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">진행도</span>
                    <span className="text-sm font-medium text-[#13ae9d]">{userProfile.recentlyStudiedLanguageProgress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#13ae9d] h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${userProfile.recentlyStudiedLanguageProgress || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* 타수 표시 */}
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">총 타수</span>
                    <span className="text-lg font-bold text-[#13ae9d]">{userProfile.recentlyStudiedLanguageScore || 0} 타</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-[#13ae9d] rounded hover:bg-[#0f8a7a] transition-colors">
                    단어
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-[#13ae9d] rounded hover:bg-[#0f8a7a] transition-colors">
                    문장
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-[#13ae9d] rounded hover:bg-[#0f8a7a] transition-colors">
                    풀코드
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 mb-8 bg-white rounded-lg shadow-sm">
              <h3 className="mb-6 text-xl font-bold text-gray-800">최근 학습한 언어</h3>
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
                <p className="text-gray-500">아직 학습한 언어가 없습니다.</p>
                <button 
                  onClick={() => navigate("/selectLanguage")}
                  className="mt-4 px-6 py-2 text-sm font-medium text-white bg-[#13ae9d] rounded hover:bg-[#0f8a7a] transition-colors"
                >
                  언어 선택하기
                </button>
              </div>
            </div>
          )}

          {/* 가장 많이 학습한 언어 섹션 */}
          {userProfile && userProfile.mostStudiedLanguage ? (
            <div className="p-8 bg-white rounded-lg shadow-sm">
              <h3 className="mb-6 text-xl font-bold text-gray-800">가장 많이 학습한 언어</h3>
              
              <div className="p-6 bg-white rounded-lg border border-gray-200">
                <h4 className="mb-3 text-xl font-bold text-gray-800">{userProfile.mostStudiedLanguage.name}</h4>
                <p className="mb-4 text-sm text-gray-700">
                  {userProfile.mostStudiedLanguage.description}
                </p>
                
                {/* 진행도 표시 */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">진행도</span>
                    <span className="text-sm font-medium text-[#13ae9d]">{userProfile.mostStudiedLanguageProgress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#13ae9d] h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${userProfile.mostStudiedLanguageProgress || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* 타수 표시 */}
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">총 타수</span>
                    <span className="text-lg font-bold text-[#13ae9d]">{userProfile.mostStudiedLanguageScore || 0} 타</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-[#13ae9d] rounded hover:bg-[#0f8a7a] transition-colors">
                    단어
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-[#13ae9d] rounded hover:bg-[#0f8a7a] transition-colors">
                    문장
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-[#13ae9d] rounded hover:bg-[#0f8a7a] transition-colors">
                    풀코드
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-white rounded-lg shadow-sm">
              <h3 className="mb-6 text-xl font-bold text-gray-800">가장 많이 학습한 언어</h3>
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
                <p className="text-gray-500">아직 학습한 언어가 없습니다.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;