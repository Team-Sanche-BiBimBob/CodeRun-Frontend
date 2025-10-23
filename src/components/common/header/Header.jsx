import { useLocation, useNavigate } from 'react-router-dom';
import { memo, useMemo, useState, useEffect } from 'react';
import logo from '../../../assets/logo.svg';
import userImg from '../../../assets/user.jpg';
import { api } from '../../../server';
import { toast } from 'react-toastify';

const Header = memo(({ isLoggedIn }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const [userName, setUserName] = useState('사용자');

  // JWT 토큰에서 사용자 정보 추출
  const decodeJWT = (token) => {
    try {
      if (!token) {
        console.log('Header - 토큰이 없습니다');
        return null;
      }

      console.log('Header - 디코딩할 토큰:', token.substring(0, 50) + '...');

      // JWT 토큰을 '.'으로 분리 (header.payload.signature)
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log('Header - 토큰 형식이 올바르지 않습니다');
        return null;
      }

      // payload 부분을 base64 디코딩 (URL-safe base64 처리)
      const payload = parts[1];

      // URL-safe base64 디코딩 (padding 추가)
      const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const paddedPayload = normalizedPayload + '='.repeat((4 - normalizedPayload.length % 4) % 4);

      try {
        const decodedPayload = atob(paddedPayload);
        const parsedPayload = JSON.parse(decodedPayload);
        console.log('Header - 디코딩된 토큰 페이로드:', parsedPayload);
        return parsedPayload;
      } catch (e) {
        console.error('Header - Base64 디코딩 실패:', e);
        return null;
      }
    } catch (error) {
      console.error('Header - JWT 토큰 디코딩 실패:', error);
      return null;
    }
  };

  // 토큰에서 사용자 정보 가져오기
  const getUserFromToken = () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Header - accessToken 존재 여부:', !!token);
      
      if (!token) {
        console.log('Header - accessToken이 없습니다');
        return null;
      }

      const decoded = decodeJWT(token);
      console.log('Header - 토큰에서 추출된 정보:', decoded);
      return decoded;
    } catch (error) {
      console.error('Header - 토큰에서 사용자 정보 추출 실패:', error);
      return null;
    }
  };

  // 사용자 정보 가져오기
  useEffect(() => {
    if (isLoggedIn) {
      // 1. 먼저 JWT 토큰에서 username 추출 시도
      const tokenUser = getUserFromToken();
      if (tokenUser && tokenUser.username) {
        console.log('토큰에서 username 추출:', tokenUser.username);
        setUserName(tokenUser.username);
        return;
      }

      if (tokenUser && tokenUser.name) {
        console.log('토큰에서 name 추출:', tokenUser.name);
        setUserName(tokenUser.name);
        return;
      }

      if (tokenUser && tokenUser.email) {
        console.log('토큰에서 email 추출:', tokenUser.email);
        setUserName(tokenUser.email.split('@')[0]);
        return;
      }

      // 2. 토큰에 사용자 정보가 없으면 localStorage에서 userId 가져와서 API 호출
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          const userId = user.id || user.userId;

          if (userId) {
            // 서버에서 사용자 프로필 정보 가져오기 (즉시 실행)
            (async () => {
              try {
                console.log('사용자 프로필 요청:', `/api/user/profile/${userId}`);
                const response = await api.get(`/api/user/profile/${userId}`);
                console.log('사용자 프로필 응답:', response.data);

                if (response.data && response.data.username) {
                  setUserName(response.data.username);
                } else if (response.data && response.data.name) {
                  setUserName(response.data.name);
                } else if (response.data && response.data.email) {
                  setUserName(response.data.email.split('@')[0]);
                } else {
                  setUserName('사용자');
                }
              } catch (error) {
                console.error('사용자 프로필 가져오기 실패:', error);
                // API 실패 시 토큰이나 localStorage 정보로 폴백
                const fallbackName = tokenUser?.username || tokenUser?.name || tokenUser?.email?.split('@')[0] ||
                                   user.name || user.username || user.email?.split('@')[0] || '사용자';
                setUserName(fallbackName);
              }
            })();
          } else {
            // userId가 없으면 localStorage의 기존 정보로 폴백
            setUserName(user.name || user.username || user.email?.split('@')[0] || '사용자');
          }
        } catch (error) {
          console.error('사용자 정보 파싱 오류:', error);
          setUserName('사용자');
        }
      }
    }
  }, [isLoggedIn]);

  // 네비게이션 아이템들을 메모이제이션하여 성능 최적화
  const navigation = useMemo(() => {
    // 1. JWT 토큰에서 사용자 정보 추출
    const tokenUser = getUserFromToken();
    console.log('Header - 토큰에서 가져온 사용자 정보:', tokenUser);

    // 2. localStorage에서 사용자 정보 가져오기
    const userInfo = localStorage.getItem('userInfo');
    let localStorageUser = null;
    if (userInfo) {
      try {
        localStorageUser = JSON.parse(userInfo);
        console.log('Header - localStorage에서 가져온 사용자 정보:', localStorageUser);
      } catch (error) {
        console.error('Header - localStorage 파싱 오류:', error);
      }
    }

    // 3. 사용자 정보 통합 (토큰 우선, localStorage 보조)
    let user = {};
    
    if (tokenUser) {
      user = {
        ...tokenUser,
        role: tokenUser.role || tokenUser.userRole || localStorageUser?.role
      };
    } else if (localStorageUser) {
      user = localStorageUser;
    }

    console.log('Header - 최종 사용자 정보:', user);

    // 디버깅을 위한 로그 추가
    console.log('Header - 사용자 정보:', user);
    console.log('Header - 사용자 role:', user.role);
    console.log('Header - role 타입:', typeof user.role);
    
    // role 값을 정확히 비교하기 위해 trim()과 toUpperCase() 사용
    const userRole = user.role ? user.role.toString().trim().toUpperCase() : '';
    console.log('Header - 정리된 role:', userRole);
    
    const studyHref = userRole === 'PREMIUM' ? '/teacher' : '/study';
    console.log('Header - 설정된 studyHref:', studyHref);

    const navItems = [
      { name: '홈', href: '/', current: false },
      { name: '타자연습', href: '/selectLanguage', current: false },
      { name: '문제집', href: '/problem', current: false },
      { name: '아케이드', href: '/arcadeSelect', current: false },
      { name: '학습방', href: studyHref, current: false },
    ];
    
    navItems.forEach(item => {
      if(item.href === location.pathname) {
        item.current = true;
      }
    });
    
    return navItems;
  }, [location.pathname]);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-white shadow-sm transition-all duration-300">
      <div className="px-4 mx-auto max-w-screen-xl sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/*로고*/}
          <div className="flex flex-shrink-0 justify-center items-center pt-1 w-24 h-5">
            <a href="/">
              <img 
                src={logo}
                alt="CodeRun 로고" 
                className="object-contain max-w-full max-h-full"
                loading="eager"
                decoding="async"
              />
            </a>
          </div>

          {/*네비게이션*/}
          <nav className="hidden gap-8 md:flex">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`inline-flex items-center pt-2 pb-1 px-1 text-sm font-medium border-b-2 transition-all duration-200 ${
                  item.current 
                    ? 'border-teal-500 text-gray-900' 
                    : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
                }`}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/*사용자 정보*/}
          <div className="flex items-center">
            {isLoggedIn ? (
              <div // Changed <a> to <div>
                onClick={() => navigate('/mypage')} // Added onClick for navigation
                className="cursor-pointer" // Added cursor-pointer for better UX
              >
                <div className="flex gap-3 items-center text-gray-700">
                  <span className="hidden text-sm font-medium sm:block">{userName}</span>
                  <img 
                    src={userImg} 
                    alt="사용자 프로필" 
                    className="object-cover w-8 h-8 rounded-full"
                    loading="lazy"
                    decoding="async"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent div's onClick from firing
                      e.preventDefault();
                      localStorage.removeItem('accessToken');
                      localStorage.removeItem('userInfo');
                      // 리다이렉션을 통해 헤더 상태 업데이트
                      window.location.href = '/';
                    }}
                    className="px-3 py-1 ml-2 text-xs text-gray-600 rounded transition-colors duration-200 hover:text-gray-900 hover:bg-gray-100"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
              
            ) : (
              <>
                <a 
                  href="/login" 
                  className="mr-2 px-4 py-1.5 bg-teal-500 text-white rounded font-medium text-sm hover:bg-teal-600 transition-colors duration-200 no-underline"
                >
                  로그인
                </a>
                <a 
                  href="/signup" 
                  className="ml-1 px-4 py-1.5 bg-white text-teal-500 border-2 border-teal-500 rounded font-medium text-sm hover:bg-teal-500 hover:text-white transition-all duration-200 no-underline"
                >
                  회원가입
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;