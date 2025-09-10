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
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-70 bg-white border-r border-gray-200 p-5 flex flex-col gap-6">
        <button 
          className="flex items-center gap-3 px-4 py-3 bg-teal-600 text-white border-none rounded-lg text-sm font-medium cursor-pointer hover:bg-teal-700 transition-colors"
          onClick={openModal}
        >
          <UsersIcon />
          클래스만들기
        </button>

        {/* 나의 폴더 섹션 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm font-medium text-gray-700">
            <span>나의 폴더</span>
            <div className="flex items-center gap-2 text-gray-400">
              <PlusIcon className="cursor-pointer hover:text-gray-600 transition-colors" />
              <SettingsIcon className="cursor-pointer hover:text-gray-600 transition-colors" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {folders.map((folder, index) => (
              <div key={index} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 cursor-pointer rounded-md hover:bg-gray-100 transition-colors">
                {folder.icon}
                <span>{folder.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 나의 클래스 섹션 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm font-medium text-gray-700">
            <span>나의 클래스</span>
            <div className="flex items-center gap-2 text-gray-400">
              <PlusIcon className="cursor-pointer hover:text-gray-600 transition-colors" />
              <SettingsIcon className="cursor-pointer hover:text-gray-600 transition-colors" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {classes.map((classItem, index) => (
              <div key={index} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 cursor-pointer rounded-md hover:bg-gray-100 transition-colors">
                {classItem.icon}
                <span>{classItem.name}</span>
              </div>
            ))}
          </div>

          <button
            className="flex items-center gap-2 px-3 py-2 bg-transparent border-none text-sm text-gray-500 cursor-pointer rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setShowMore(!showMore)}
          >
            더보기 <ChevronDownIcon />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Hero Section */}
        <div className="bg-teal-500 text-white px-10 py-15 flex items-center justify-start h-56 relative">
          <div className="text-left ml-10">
            <h1 className="text-5xl font-semibold m-0 mb-3 tracking-tight">CodeRun{'{}'}</h1>
            <p className="text-lg m-0 opacity-90 font-normal">어제보다 한글자 더 빠르게</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-10 bg-gray-50">
          <div className="flex items-center gap-4 mb-8 text-sm">
            <span className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">그룹 코드 생성</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">학생 관리</span>
            <span className="flex-1"></span>
            <span className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">클래스에 추가</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">폴더에 추가</span>
          </div>

          <div className="flex items-center gap-6 mb-6">
            <button className="px-6 py-3 border-none rounded-lg text-sm font-medium cursor-pointer transition-all min-w-20 bg-teal-600 text-white hover:bg-teal-700">
              단어
            </button>
            <div className="text-sm text-gray-500 bg-white px-5 py-3 rounded-lg border border-gray-200">
              Python 예약어 레벨 1- 20까지
            </div>
          </div>

          <div className="flex items-center gap-6 mb-6">
            <button className="px-6 py-3 border-none rounded-lg text-sm font-medium cursor-pointer transition-all min-w-20 bg-teal-600 text-white hover:bg-teal-700">
              문장
            </button>
          </div>

          <div className="flex items-center gap-6 mb-6">
            <button className="px-6 py-3 border-none rounded-lg text-sm font-medium cursor-pointer transition-all min-w-20 bg-teal-600 text-white hover:bg-teal-700">
              플코딩
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-white px-10 py-12 rounded-3xl shadow-2xl max-w-sm w-full text-center animate-slide-up">
            <div className="mb-6">
              <h2 className="text-3xl font-bold m-0 text-gray-800">
                <span className="text-gray-800">Code</span>
                <span className="text-teal-500">Run</span>
                <span className="text-yellow-400">{'{}'}</span>
              </h2>
              <p className="text-sm text-gray-600 mt-2 mb-0">수업 코드 공유</p>
            </div>
            
            <div className="text-4xl font-bold text-gray-800 my-8 tracking-wider font-mono">
              {randomCode}
            </div>
            
            <button 
              className="w-full bg-teal-500 text-white border-none px-8 py-4 rounded-2xl text-lg font-semibold cursor-pointer hover:bg-teal-600 transition-colors"
              onClick={closeModal}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.25s ease forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default TeacherView;