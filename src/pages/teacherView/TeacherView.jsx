import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TeacherView = () => {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [randomCode, setRandomCode] = useState('');
  const [activeView, setActiveView] = useState('assignment');
  const [selectedClassId, setSelectedClassId] = useState(1);
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const [students, setStudents] = useState([
    { id: 1, name: '김민준', progress: 85, class: '1학년 1반' },
    { id: 2, name: '이서연', progress: 92, class: '1학년 1반' },
    { id: 3, name: '박도윤', progress: 78, class: '1학년 2반' },
    { id: 4, name: '최지우', progress: 95, class: '1학년 2반' },
    { id: 5, name: '정시우', progress: 88, class: '1학년 3반' },
  ]);

  const [classes, setClasses] = useState([
    { id: 1, name: '1학년 1반', assignments: { word: ['Python 예약어 레벨 1- 20까지'], sentence: [], fullCoding: [] } },
    { id: 2, name: '1학년 2반', assignments: { word: [], sentence: [], fullCoding: [] } },
    { id: 3, name: '1학년 3반', assignments: { word: [], sentence: [], fullCoding: [] } },
    { id: 4, name: '1학년 4반', assignments: { word: [], sentence: [], fullCoding: [] } },
  ]);

  const [folders, setFolders] = useState([
    { id: 1, name: "숙제", content: [] },
  ]);

  const [availableAssignments, setAvailableAssignments] = useState([
    { id: 1, title: 'JavaScript 기초' },
    { id: 2, title: 'React 심화' },
    { id: 3, title: 'Python 알고리즘' },
    { id: 4, title: 'Java 객체지향' },
  ]);

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('word');

  const handleExpel = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const handleAddAssignment = () => {
    if (selectedAssignment && selectedCategory && selectedClassId) {
      setClasses(classes.map(c => {
        if (c.id === selectedClassId) {
          return {
            ...c,
            assignments: {
              ...c.assignments,
              [selectedCategory]: [...c.assignments[selectedCategory], selectedAssignment.title]
            }
          };
        }
        return c;
      }));
      setShowAssignmentModal(false);
      setSelectedAssignment(null);
    }
  };

  const handleAddClass = () => {
    const newClassName = prompt("새로운 반의 이름을 입력하세요:");
    if (newClassName) {
      const newClass = {
        id: classes.length > 0 ? Math.max(...classes.map(c => c.id)) + 1 : 1,
        name: newClassName,
        assignments: { word: [], sentence: [], fullCoding: [] }
      };
      setClasses([...classes, newClass]);
    }
  };

  const handleDeleteSelectedClass = () => {
    if (window.confirm("정말로 이 반을 삭제하시겠습니까?")) {
      const newClasses = classes.filter(c => c.id !== selectedClassId);
      setClasses(newClasses);
      if (newClasses.length > 0) {
        setSelectedClassId(newClasses[0].id);
      } else {
        setSelectedClassId(null);
      }
    }
  };

  const handleRenameClass = () => {
    const newClassName = prompt("새로운 반의 이름을 입력하세요:");
    if (newClassName) {
      setClasses(classes.map(c => {
        if (c.id === selectedClassId) {
          return { ...c, name: newClassName };
        }
        return c;
      }));
    }
  };

  const handleAddFolder = () => {
    const newFolderName = prompt("새로운 폴더의 이름을 입력하세요:");
    if (newFolderName) {
      const newFolder = {
        id: folders.length > 0 ? Math.max(...folders.map(f => f.id)) + 1 : 1,
        name: newFolderName,
        content: []
      };
      setFolders([...folders, newFolder]);
    }
  };

  const handleDeleteFolder = (id) => {
    if (window.confirm("정말로 이 폴더를 삭제하시겠습니까?")) {
      setFolders(folders.filter(f => f.id !== id));
    }
  };

  const handleAddFolderContent = () => {
    const newContent = prompt("추가할 내용을 입력하세요:");
    if (newContent) {
        setFolders(folders.map(f => {
            if (f.id === selectedFolderId) {
                return { ...f, content: [...f.content, newContent] };
            }
            return f;
        }));
    }
  };

  const handleDeleteFolderContent = (content) => {
    if (window.confirm("정말로 이 내용을 삭제하시겠습니까?")) {
        setFolders(folders.map(f => {
            if (f.id === selectedFolderId) {
                return { ...f, content: f.content.filter(item => item !== content) };
            }
            return f;
        }));
    }
  };

  const renderStudents = () => (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-2xl font-bold">학생 관리</h2>
      <ul className="divide-y divide-gray-200">
        {students.map(student => (
          <li key={student.id} className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <div className="ml-4">
                <p className="text-lg font-semibold text-gray-800">{student.name}</p>
                <p className="text-sm text-gray-500">{student.class}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="mr-4 text-right">
                <p className="text-lg font-semibold text-gray-800">{student.progress}%</p>
                <p className="text-sm text-gray-500">진행률</p>
              </div>
              <button className="ml-4 text-red-500 hover:text-red-700" onClick={() => handleExpel(student.id)}>추방</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderFolderContent = () => {
    const folder = folders.find(f => f.id === selectedFolderId);
    if (!folder) return null;

    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{folder.name}</h2>
            <div>
                <button className="mr-4 text-gray-500 hover:text-gray-700" onClick={handleAddFolderContent}>연습 추가</button>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setSelectedFolderId(null)}>뒤로가기</button>
            </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {folder.content.map((item, index) => (
                <div key={index} className="relative">
                    <button 
                        className="w-full px-4 py-8 text-white bg-teal-500 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                        onClick={() => navigate('/selectLanguage')}
                    >
                        {item}
                    </button>
                    {folder.name === '이용한 세트' ? (
                        <button 
                            className="absolute p-1 text-xs text-white bg-transparent rounded-full top-2 right-2 hover:bg-black/20"
                            onClick={(e) => { e.stopPropagation(); handleDeleteFolderContent(item); }}
                        >
                            -
                        </button>
                    ) : (
                        <button 
                            className="absolute p-1 text-xs text-white bg-red-500 rounded-full top-2 right-2 hover:bg-red-700"
                            onClick={(e) => { e.stopPropagation(); handleDeleteFolderContent(item); }}
                        >
                            X
                        </button>
                    )}
                </div>
            ))}
        </div>
      </div>
    );
  };

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

  const PlusIcon = ({ className, onClick }) => (
    <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" onClick={onClick}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  const TrashIcon = ({ className, onClick }) => (
    <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" onClick={onClick}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  const openModal = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRandomCode(code);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const selectedClass = classes.find(c => c.id === selectedClassId);

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-100 md:flex-row">
      {/* Sidebar */}
      <div className="flex flex-col w-full gap-6 p-5 bg-white border-b border-r border-gray-200 md:w-70 md:border-b-0">
        <button
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white transition-colors duration-200 bg-teal-600 border-none rounded-lg cursor-pointer hover:bg-teal-700"          onClick={openModal}
        >
          <UsersIcon />
          클래스만들기
        </button>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm font-medium text-gray-600">
            <span>나의 폴더</span>
            <div className="flex items-center gap-2 text-gray-600">
              <PlusIcon className="transition-colors duration-200 cursor-pointer hover:text-black" onClick={handleAddFolder} />            </div>
          </div>

          <div className="flex flex-col gap-1">
            {folders.map((folder) => (
              <div key={folder.id} className={`flex items-center justify-between gap-3 px-3 py-2 text-sm cursor-pointer rounded-md transition-colors duration-200 ${selectedFolderId === folder.id ? 'bg-teal-100 text-teal-700' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setSelectedFolderId(folder.id)}>
                <div className="flex items-center gap-3">
                    <FolderIcon />
                    <span>{folder.name}</span>
                </div>
                <TrashIcon className="transition-colors duration-200 cursor-pointer hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }} />              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm font-medium text-gray-600">
            <span>나의 클래스</span>
            <div className="flex items-center gap-2 text-gray-600">
              <PlusIcon className="transition-colors duration-200 cursor-pointer hover:text-black" onClick={handleAddClass} />            </div>
          </div>

          <div className="flex flex-col gap-1">
            {classes.map((classItem) => (
              <div key={classItem.id} className={`flex items-center justify-between gap-3 px-3 py-2 text-sm cursor-pointer rounded-md transition-colors duration-200 ${selectedClassId === classItem.id ? 'bg-teal-100 text-teal-700' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => { setSelectedClassId(classItem.id); setSelectedFolderId(null); }}>
                <div className="flex items-center gap-3">
                  <UsersIcon />
                  <span>{classItem.name}</span>
                </div>              </div>
            ))}
          </div>

          <button
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 transition-colors duration-200 border-none rounded-md cursor-pointer bg-none hover:bg-gray-100"
            onClick={() => setShowMore(!showMore)}
          >
            더보기 <ChevronDownIcon />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Hero Section */}
        <div className="relative flex items-center justify-start px-10 text-white bg-teal-500 py-15 h-55 md:px-20">
          <div className="ml-10 text-left">
            <h1 className="m-0 mb-3 text-4xl font-semibold tracking-tight">CodeRun{'{ }'}</h1>
            <p className="m-0 text-lg font-normal opacity-90">어제보다 한글자 더 빠르게</p>          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-10 bg-gray-50 md:p-20">
            {selectedFolderId ? renderFolderContent() : (
                <>
                    <div className="flex flex-wrap items-center gap-4 mb-8 text-sm md:gap-8">
                        <span className={`cursor-pointer transition-colors duration-200 ${activeView === 'assignment' ? 'text-teal-600 font-semibold' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveView('assignment')}>과제</span>
                        <span className="text-gray-300">|</span>
                        <span className={`cursor-pointer transition-colors duration-200 ${activeView === 'students' ? 'text-teal-600 font-semibold' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveView('students')}>학생 관리</span>
                        <div className="flex-1"></div>
                        <span className="text-gray-500 transition-colors duration-200 cursor-pointer hover:text-gray-700" onClick={() => setShowAssignmentModal(true)}>과제 추가</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500 transition-colors duration-200 cursor-pointer hover:text-gray-700" onClick={handleRenameClass}>클래스 이름 변경</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500 transition-colors duration-200 cursor-pointer hover:text-gray-700" onClick={handleDeleteSelectedClass}>클래스 삭제</span>
                    </div>

                    {activeView === 'assignment' && selectedClass && (
                    <div>
                        <div className="flex flex-col items-center gap-6 mb-6 md:flex-row md:items-center ">
                        <button className="px-6 py-3 text-sm font-medium text-white transition-all duration-200 bg-teal-600 border-none rounded-lg cursor-pointer min-w-20 hover:bg-teal-700">
                            단어
                        </button>
                        <div className="flex flex-col gap-2">
                            {selectedClass.assignments.word.map((item, index) => (
                            <div key={index} className="px-5 py-3 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg">
                                {item}
                            </div>
                            ))}
                        </div>
                        </div>

                        <div className="flex flex-col items-center gap-6 mb-6 md:flex-row md:items-center ">
                        <button className="px-6 py-3 text-sm font-medium text-white transition-all duration-200 bg-teal-600 border-none rounded-lg cursor-pointer min-w-20 hover:bg-teal-700">
                            문장
                        </button>
                        <div className="flex flex-col gap-2">
                            {selectedClass.assignments.sentence.map((item, index) => (
                            <div key={index} className="px-5 py-3 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg">
                                {item}
                            </div>
                            ))}
                        </div>
                        </div>

                        <div className="flex flex-col items-center gap-6 mb-6 md:flex-row md:items-center ">
                        <button className="px-6 py-3 text-sm font-medium text-white transition-all duration-200 bg-teal-600 border-none rounded-lg cursor-pointer min-w-20 hover:bg-teal-700">
                            풀코딩
                        </button>
                        <div className="flex flex-col gap-2">
                            {selectedClass.assignments.fullCoding.map((item, index) => (
                            <div key={index} className="px-5 py-3 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg">
                                {item}
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
                    )}

                    {activeView === 'students' && renderStudents()}
                </>
            )}        </div>
      </div>

      {/* Class Modal */}
      {showModal && (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm p-8 text-center bg-white shadow-xl rounded-2xl animate-slideUp">
            <div className="mb-4">
              <h2 className="mb-2 text-3xl font-bold text-gray-800">
                <span className="text-black">Code</span>
                <span className="text-[#2DD4BF]">Run</span>
                <span className="text-[#FFD602]">{'{ }'}</span>
              </h2>
              <p className="text-gray-600">수업 코드 공유</p>
            </div>

            <div className="px-6 py-4 mb-6 font-mono text-2xl font-bold tracking-widest text-black bg-gray-100 rounded-lg">
              {randomCode}
            </div>

            <button
              className="bg-[#13AE9D] text-white border-none py-3 px-8 rounded-lg text-base font-semibold cursor-pointer transition-colors duration-200 shadow-lg hover:bg-[#0F8A7A]"              onClick={closeModal}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg p-8 text-center bg-white shadow-xl rounded-2xl animate-slideUp">
            <h2 className="mb-4 text-2xl font-bold">과제 추가</h2>
            <div className="mb-4">
              <h3 className="mb-2 text-lg font-semibold">과제 선택</h3>
              <div className="flex flex-col items-start">
                {availableAssignments.map(assignment => (
                  <div key={assignment.id} className="mb-2">
                    <input
                      type="radio"
                      id={`assignment-${assignment.id}`}
                      name="assignment"
                      value={assignment.id}
                      onChange={() => setSelectedAssignment(assignment)}
                      className="mr-2"
                    />
                    <label htmlFor={`assignment-${assignment.id}`}>{assignment.title}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <h3 className="mb-2 text-lg font-semibold">카테고리 선택</h3>
              <div className="flex justify-center">
                <div className="mr-4">
                  <input
                    type="radio"
                    id="category-word"
                    name="category"
                    value="word"
                    checked={selectedCategory === 'word'}
                    onChange={() => setSelectedCategory('word')}
                    className="mr-2"
                  />
                  <label htmlFor="category-word">단어</label>
                </div>
                <div className="mr-4">
                  <input
                    type="radio"
                    id="category-sentence"
                    name="category"
                    value="sentence"
                    checked={selectedCategory === 'sentence'}
                    onChange={() => setSelectedCategory('sentence')}
                    className="mr-2"
                  />
                  <label htmlFor="category-sentence">문장</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="category-fullCoding"
                    name="category"
                    value="fullCoding"
                    checked={selectedCategory === 'fullCoding'}
                    onChange={() => setSelectedCategory('fullCoding')}
                    className="mr-2"
                  />
                  <label htmlFor="category-fullCoding">풀코딩</label>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="px-6 py-2 mr-2 text-base font-semibold text-white transition-colors duration-200 bg-gray-400 border-none rounded-lg cursor-pointer hover:bg-gray-500"
                onClick={() => setShowAssignmentModal(false)}
              >
                취소
              </button>
              <button
                className="bg-[#13AE9D] text-white border-none py-2 px-6 rounded-lg text-base font-semibold cursor-pointer transition-colors duration-200 shadow-lg hover:bg-[#0F8A7A]"
                onClick={handleAddAssignment}
              >
                추가
              </button>
            </div>
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