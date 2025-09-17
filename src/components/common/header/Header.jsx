import logo from '../../../assets/logo.svg';
import userImg from '../../../assets/user.jpg';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const Header = ({ isLoggedIn, userInfo, loading, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();

  const navigation = [
    { name: '홈', href: '/' },
    { name: '타자연습', href: '/selectLanguage' },
    { name: '문제집', href: '/problem' },
    { name: '아케이드', href: '/timeAttack' },
    { name: '학습방', href: '/study' },
  ];

  // 외부 클릭 시 드롭다운 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="shrink-0 flex items-center justify-center w-24 h-[19px]">
            <a href="/">
              <img src={logo} alt="header" className="max-w-full max-h-full object-contain" />
            </a>
          </div>

          {/* 네비게이션 */}
          <nav className="hidden md:flex gap-8">
            {navigation.map((item) => {
              const isCurrent = item.href === location.pathname;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={
                    `inline-flex items-center pt-1 px-1 text-sm font-medium border-b-2 transition duration-200 ` +
                    (isCurrent
                      ? 'border-teal-500 text-gray-900'
                      : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900')
                  }
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* 사용자 정보 */}
          <div className="flex items-center">
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <div
                  className="flex items-center gap-4 text-gray-700 cursor-pointer p-2 rounded-lg transition-colors hover:bg-gray-100"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  {loading ? (
                    <span className="text-sm text-gray-500">로딩중...</span>
                  ) : (
                    <>
                      <span className="hidden sm:block text-sm font-medium">
                        {userInfo?.nickname || userInfo?.name || '사용자'}
                      </span>
                      <img
                        src={userInfo?.profileImage || userImg}
                        alt="user"
                        className="w-8 h-8 rounded-full"
                      />
                    </>
                  )}
                </div>
                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                    <button
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 rounded-lg transition-colors hover:bg-gray-100 hover:text-red-600"
                      onClick={onLogout}
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a href="/login" className="mr-2 px-4 py-1.5 bg-teal-500 text-white rounded text-[0.95rem] font-medium hover:bg-teal-600">로그인</a>
                <a href="/signup" className="px-4 py-1.5 bg-white text-teal-500 border border-teal-500 rounded text-[0.95rem] font-medium hover:bg-teal-500 hover:text-white ml-1">회원가입</a>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;