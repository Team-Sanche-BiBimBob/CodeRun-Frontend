import React, { useState } from 'react';
import './TeacherView.css';

const TeacherView = () => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [randomCode, setRandomCode] = useState('');

  const FolderIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  );

  const UsersIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const PlusIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  const SettingsIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  const folders = [
    { name: '이용한 세트', icon: <FolderIcon /> },
    { name: 'Python', icon: <FolderIcon /> },
    { name: 'Js', icon: <FolderIcon /> },
    { name: '운영 세트 폴더', icon: <FolderIcon /> }
  ];

  const classes = [
    { name: '1학년 1반', icon: <UsersIcon /> },
    { name: '1학년 2반', icon: <UsersIcon /> },
    { name: '1학년 3반', icon: <UsersIcon /> },
    { name: '1학년 4반', icon: <UsersIcon /> }
  ];

  const openModal = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRandomCode(code);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="teacher-view">
      <div className="sidebar">
        <button className="class-management-btn" onClick={openModal}>
          <UsersIcon />
          클래스만들기
        </button>

        <div className="section">
          <div className="section-header">
            <span>나의 폴더</span>
            <div className="section-actions">
              <PlusIcon />
              <SettingsIcon />
            </div>
          </div>

          <div className="folder-list">
            {folders.map((folder, index) => (
              <div key={index} className="folder-item">
                {folder.icon}
                <span>{folder.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="section">
          <div className="section-header">
            <span>나의 클래스</span>
            <div className="section-actions">
              <PlusIcon />
              <SettingsIcon />
            </div>
          </div>

          <div className="class-list">
            {classes.map((classItem, index) => (
              <div key={index} className="class-item">
                {classItem.icon}
                <span>{classItem.name}</span>
              </div>
            ))}
          </div>

          <button
            className="more-btn"
            onClick={() => setShowMore(!showMore)}
          >
            더보기 <ChevronDownIcon />
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="Teacherhero-section">
          <div className="Teacherhero-content">
            <h1 className="Teacherhero-title">CodeRun{'{}'}</h1>
            <p className="Teacherhero-subtitle">어제보다 한글자 더 빠르게</p>
          </div>
        </div>
        <div className="content-section">
          <div className="content-tabs">
            <span className="tab-link">그룹 코드 생성</span>
            <span className="tab-divider">|</span>
            <span className="tab-link">학생 관리</span>
            <span className="tab-spacer"></span>
            <span className="tab-link">클래스에 추가</span>
            <span className="tab-divider">|</span>
            <span className="tab-link">폴더에 추가</span>
          </div>

          <div className="action-buttons">
            <button className="action-btn submit-btn">
              단어
            </button>
            <div className="lesson-info">
              Python 예약어 레벨 1- 20까지
            </div>
          </div>

          <div className="action-buttons">
            <button className="action-btn problem-btn">
              문장
            </button>
          </div>

          <div className="action-buttons">
            <button className="action-btn upload-btn">
              플코딩
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="new-modal-overlay">
          <div className="new-modal-content">
            <div className="new-modal-logo">
              <h2>
                <span className="code-text">Code</span>
                <span className="run-text">Run</span>
                <span className="brackets-text">{'{}'}</span>
              </h2>
              <p className="new-modal-subtitle">수업 코드 공유</p>
            </div>
            
            <div className="new-modal-code">
              {randomCode}
            </div>
            
            <button className="new-modal-btn" onClick={closeModal}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherView;
