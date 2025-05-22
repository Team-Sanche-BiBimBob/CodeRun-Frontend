import styles from './Header.module.css';
import Navigation from './Navigation';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.navContainer}>
          <div className={styles.logoContainer}>
            <img 
              src="src/assets/logo.svg" 
              alt="header" 
              className={styles.logo}
            />
          </div>

          <div className={styles.navWrapper}>
            <Navigation />
          </div>

          <div className={styles.userMenu}>
            <div className={styles.userInfo}>
              <img 
                src="src/assets/user.jpg" 
                alt="user" 
                className={styles.userAvatar}
              />
              <span className={styles.username}>사용자이름</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;