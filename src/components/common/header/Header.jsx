import { useLocation } from 'react-router-dom';
import logo from '../../../assets/logo.svg';
import userImg from '../../../assets/user.jpg';

const Header = ({ isLoggedIn }) => {
  const location = useLocation();

  const navigation = [
    { name: '홈', href: '/', current: false },
    { name: '타자연습', href: '/selectLanguage', current: false },
    { name: '문제집', href: '/problem', current: false },
    { name: '아케이드', href: '/arcadeSelect', current: false },
    { name: '학습방', href: '/study', current: false },
  ];
  
  navigation.forEach(item => {
    if(item.href === location.pathname) {
      item.current = true;
    }
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/*로고*/}
          <div className="flex-shrink-0 flex items-center justify-center w-24 h-5">
            <a href="/">
              <img 
                src={logo}
                alt="header" 
                className="max-w-full max-h-full object-contain"
              />
            </a>
          </div>

          {/*네비게이션*/}
          <nav className="hidden md:flex gap-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`inline-flex items-center py-1 px-1 text-sm font-medium border-b-2 transition-all duration-200 ${
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
              <div className="flex items-center gap-4 text-gray-700">
                <span className="hidden sm:block text-sm font-medium">사용자이름</span>
                <img 
                  src={userImg} 
                  alt="user" 
                  className="w-8 h-8 rounded-full"
                />
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
};

export default Header;