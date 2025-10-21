import { useLocation } from 'react-router-dom';
import { memo, useMemo, useState, useEffect } from 'react';
import logo from '../../../assets/logo.svg';
import userImg from '../../../assets/user.jpg';

const Header = memo(({ isLoggedIn }) => {
  const location = useLocation();
  const [userName, setUserName] = useState('사용자');

  // 사용자 정보 가져오기
  useEffect(() => {
    if (isLoggedIn) {
      // localStorage에서 사용자 정보 가져오기 (실제 구현에서는 API 호출)
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          setUserName(user.name || user.username || '사용자');
        } catch (error) {
          console.error('사용자 정보 파싱 오류:', error);
        }
      }
    }
  }, [isLoggedIn]);

  // 네비게이션 아이템들을 메모이제이션하여 성능 최적화
  const navigation = useMemo(() => {
    const navItems = [
      { name: '홈', href: '/', current: false },
      { name: '타자연습', href: '/selectLanguage', current: false },
      { name: '문제집', href: '/problem', current: false },
      { name: '아케이드', href: '/arcadeSelect', current: false },
      { name: '학습방', href: '/study', current: false },
    ];
    
    navItems.forEach(item => {
      if(item.href === location.pathname) {
        item.current = true;
      }
    });
    
    return navItems;
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/*로고*/}
          <div className="flex-shrink-0 flex items-center justify-center w-24 h-5 pt-1">
            <a href="/">
              <img 
                src={logo}
                alt="CodeRun 로고" 
                className="max-w-full max-h-full object-contain"
                loading="eager"
                decoding="async"
              />
            </a>
          </div>

          {/*네비게이션*/}
          <nav className="hidden md:flex gap-8">
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
              <a href="/mypage">
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="hidden sm:block text-sm font-medium">{userName}</span>
                  <img 
                    src={userImg} 
                    alt="사용자 프로필" 
                    className="w-8 h-8 rounded-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <button
                    onClick={() => {
                      localStorage.removeItem('accessToken');
                      localStorage.removeItem('userInfo');
                      window.location.reload();
                    }}
                    className="ml-2 px-3 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors duration-200"
                  >
                    로그아웃
                  </button>
                </div>
              </a>
              
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