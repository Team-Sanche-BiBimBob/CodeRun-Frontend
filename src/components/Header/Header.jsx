import styles from './Header.module.css';
import Navigation from './Navigation';

const Header = ({ isLoggedIn }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.navContainer}>
          {/*로고*/}
          <div className={styles.logoContainer}>
            <a href="/">
              <img 
                src="src/assets/logo.svg" 
                alt="header" 
                className={styles.logo}
              />
            </a>
          </div>

          {/*네비게이션*/}
          <div className={styles.navWrapper}>
            <Navigation />
          </div>

          {/*사용자 정보*/}
          <div className={styles.userMenu}>
            {isLoggedIn ? (
              <div className={styles.userInfo}>
                <span className={styles.username}>사용자이름</span>
                <img 
                  src="src/assets/user.jpg" 
                  alt="user" 
                  className={styles.userAvatar}
                />
              </div>
            ) : (
              <>
                <a href="/login" className={styles.loginBtn}>로그인</a>
                <a href="/signup" className={styles.signupBtn}>회원가입</a>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;