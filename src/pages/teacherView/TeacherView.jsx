import React, { useState } from 'react';

const TeacherView = () => {
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
    <div className="flex flex-col h-screen font-sans bg-gray-100 md:flex-row">
      {/* Sidebar */}
      <div className="flex flex-col gap-6 p-5 w-full bg-white border-r border-b border-gray-200 md:w-70 md:border-b-0">
        <button 
          className="flex gap-3 items-center px-4 py-3 text-sm font-medium text-white bg-teal-600 rounded-lg border-none transition-colors duration-200 cursor-pointer hover:bg-teal-700"
          onClick={openModal}
        >
          <UsersIcon />
          클래스만들기
        </button>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm font-medium text-gray-600">
            <span>나의 폴더</span>
            <div className="flex gap-2 items-center text-gray-400">
              <PlusIcon className="transition-colors duration-200 cursor-pointer hover:text-gray-500" />
              <SettingsIcon className="transition-colors duration-200 cursor-pointer hover:text-gray-500" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {folders.map((folder, index) => (
              <div key={index} className="flex gap-3 items-center px-3 py-2 text-sm text-gray-600 rounded-md transition-colors duration-200 cursor-pointer hover:bg-gray-100">
                {folder.icon}
                <span>{folder.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm font-medium text-gray-600">
            <span>나의 클래스</span>
            <div className="flex gap-2 items-center text-gray-400">
              <PlusIcon className="transition-colors duration-200 cursor-pointer hover:text-gray-500" />
              <SettingsIcon className="transition-colors duration-200 cursor-pointer hover:text-gray-500" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {classes.map((classItem, index) => (
              <div key={index} className="flex gap-3 items-center px-3 py-2 text-sm text-gray-600 rounded-md transition-colors duration-200 cursor-pointer hover:bg-gray-100">
                {classItem.icon}
                <span>{classItem.name}</span>
              </div>
            ))}
          </div>

          <button
            className="flex gap-2 items-center px-3 py-2 text-sm text-gray-500 bg-none rounded-md border-none transition-colors duration-200 cursor-pointer hover:bg-gray-100"
            onClick={() => setShowMore(!showMore)}
          >
            더보기 <ChevronDownIcon />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Hero Section */}
        <div className="flex relative justify-start items-center px-10 text-white bg-teal-500 py-15 h-55 md:px-20">
          <div className="ml-10 text-left">
            <h1 className="m-0 mb-3 text-4xl font-semibold tracking-tight">CodeRun{'{}'}</h1>
            <p className="m-0 text-lg font-normal opacity-90">어제보다 한글자 더 빠르게</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-10 bg-gray-50 md:p-20">
          <div className="flex flex-wrap gap-4 items-center mb-8 text-sm md:gap-8">
            <span className="text-gray-500 transition-colors duration-200 cursor-pointer hover:text-gray-700">그룹 코드 생성</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500 transition-colors duration-200 cursor-pointer hover:text-gray-700">학생 관리</span>
            <div className="flex-1"></div>
            <span className="text-gray-500 transition-colors duration-200 cursor-pointer hover:text-gray-700">클래스에 추가</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500 transition-colors duration-200 cursor-pointer hover:text-gray-700">폴더에 추가</span>
          </div>

          <div className="flex flex-col gap-6 items-center mb-6 md:flex-row md:items-center">
            <button className="px-6 py-3 text-sm font-medium text-white bg-teal-600 rounded-lg border-none transition-all duration-200 cursor-pointer min-w-20 hover:bg-teal-700">
              단어
            </button>
            <div className="px-5 py-3 text-sm text-gray-500 bg-white rounded-lg border border-gray-200">
              Python 예약어 레벨 1- 20까지
            </div>
          </div>

          <div className="flex flex-col gap-6 items-center mb-6 md:flex-row md:items-center">
            <button className="px-6 py-3 text-sm font-medium text-white bg-teal-600 rounded-lg border-none transition-all duration-200 cursor-pointer min-w-20 hover:bg-teal-700">
              문장
            </button>
          </div>

          <div className="flex flex-col gap-6 items-center mb-6 md:flex-row md:items-center">
            <button className="px-6 py-3 text-sm font-medium text-white bg-teal-600 rounded-lg border-none transition-all duration-200 cursor-pointer min-w-20 hover:bg-teal-700">
              플코딩
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="flex fixed top-0 right-0 bottom-0 left-0 z-50 justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
          <div className="p-8 w-full max-w-sm text-center bg-white rounded-2xl shadow-xl animate-slideUp">
            <div className="mb-4">
              <h2 className="mb-2 text-3xl font-bold text-gray-800">
                <span className="text-blue-600">Code</span>
                <span className="text-gray-800">Run</span>
                <span className="text-blue-600">{'{}'}</span>
              </h2>
              <p className="text-gray-600">수업 코드 공유</p>
            </div>
            
            <div className="px-6 py-4 mb-6 font-mono text-2xl font-bold tracking-widest text-blue-600 bg-gray-100 rounded-lg">
              {randomCode}
            </div>
            
            <button 
              className="px-8 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg border-none shadow-lg transition-colors duration-200 cursor-pointer hover:bg-blue-700"
              onClick={closeModal}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.25s ease forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default TeacherView;