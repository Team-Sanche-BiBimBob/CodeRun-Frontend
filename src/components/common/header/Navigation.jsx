import React from 'react';
import styles from './Navigation.module.css';
import { useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const navigation = [
    { name: '홈', href: '/', current: false },
    { name: '타자연습', href: '/selectLanguage', current: false },
    { name: '문제집', href: '/problem', current: false },
    { name: '아케이드', href: '/competition', current: false },
    { name: '학습방', href: '/study', current: false },
  ];
  navigation.forEach(it=> {
    if(it.href === location.pathname) {
      it.current = true;
    }
  });

  return (
    <nav className={styles.nav}>
      {navigation.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className={`${styles.navLink} ${item.current ? styles.navLinkCurrent : styles.navLinkDefault}`}
          aria-current={item.current ? 'page' : undefined}
        >
          {item.name} 
        </a>
      ))}
    </nav>
  );
};

export default Navigation;

