import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showAddToFolderModal, setShowAddToFolderModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '' });
  const [prompt, setPrompt] = useState({ show: false, message: '', onConfirm: null });
  const [promptValue, setPromptValue] = useState('');
  const [classCode, setClassCode] = useState("Co87de1R2RR22U");
  const [userRole, setUserRole] = useState("BASIC"); // "BASIC" or "PREMIUM"
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  
  const [studentClasses, setStudentClasses] = useState([
    { id: 1, name: '1학년 1반' }
  ]);
  const [selectedStudentClassId, setSelectedStudentClassId] = useState(1); // Default to 1

  const [folders, setFolders] = useState([
    { id: 1, name: "숙제", content: [] },
  ]);

  const [assignments, setAssignments] = useState([
      { id: 1, type: '단어', title: 'Python 예약어 레벨 1- 3까지', path: '/word' },
      { id: 2, type: '문장', title: 'Python 문장 레벨 1- 3까지', path: '/sentence' },
      { id: 3, type: '풀코딩', title: 'Python 풀코딩 레벨 1- 10까지', path: '/full' },
      { id: 4, type: '단어', title: 'JavaScript 예약어 레벨 1- 5까지', path: '/word' },
  ]);

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const showAlert = (message) => {
    setAlert({ show: true, message });
  };

  const showPrompt = (message, onConfirm) => {
    setPrompt({ show: true, message, onConfirm });
  };

  const handleConfirmPrompt = () => {
    prompt.onConfirm(promptValue);
    setPrompt({ show: false, message: '', onConfirm: null });
    setPromptValue('');
  };

  const handleCancelPrompt = () => {
    setPrompt({ show: false, message: '', onConfirm: null });
    setPromptValue('');
  };

  const addFolder = () => {
    showPrompt("추가할 폴더 이름을 입력하세요.", (folderName) => {
        if (folderName) {
            setFolders([...folders, { id: folders.length > 0 ? Math.max(...folders.map(f => f.id)) + 1 : 1, name: folderName, content: [] }]);
        }
    });
  };

  const deleteFolder = (folderId) => {
    if (window.confirm("정말로 이 폴더를 삭제하시겠습니까?")) {
        setFolders(folders.filter(folder => folder.id !== folderId));
    }
  };

  const handleLeaveClass = () => {
    if (window.confirm("정말로 클래스를 탈퇴하시겠습니까?")) {
      setStudentClasses(studentClasses.filter(c => c.id !== selectedStudentClassId));
      setSelectedStudentClassId(null);
      navigate('/study');
    }
  };

  const handleCreateClass = () => {
    if (userRole === "PREMIUM") {
      setShowModal(true);
    } else {
      setShowPremiumModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowPremiumModal(false);
    setShowAddToFolderModal(false);
    setSelectedFolder(null); // Reset selected folder when closing modal
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(classCode);
    showAlert("클래스 코드가 복사되었습니다!");
  };

  const handleAddToFolder = () => {
      if (selectedAssignment && selectedFolder) {
          setFolders(folders.map(f => {
              if (f.id === selectedFolder.id) {
                  if (f.content.includes(selectedAssignment.title)) {
                      showAlert("이미 폴더에 추가된 과제입니다.");
                      return f;
                  }
                  return { ...f, content: [...f.content, selectedAssignment.title] };
              }
              return f;
          }));
          handleCloseModal();
      } else {
          showAlert("과제와 폴더를 모두 선택해주세요.");
      }
  };

  const handleDeleteFolderContent = (folderId, content) => {
    if (window.confirm("정말로 이 내용을 삭제하시겠습니까?")) {
        setFolders(folders.map(f => {
            if (f.id === folderId) {
                return { ...f, content: f.content.filter(item => item !== content) };
            }
            return f;
        }));
    }
  };

  const openAddToFolderModal = () => {
    const folder = folders.find(f => f.id === selectedFolderId);
    if (folder) {
        setSelectedFolder(folder);
    }
    setShowAddToFolderModal(true);
  };

  const FolderIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mr-3">
        <path d="M2 4H14L13 12H3L2 4Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const TrashIcon = ({ className, onClick }) => (
    <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" onClick={onClick}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  const renderFolderContent = () => {
    const folder = folders.find(f => f.id === selectedFolderId);
    if (!folder) return null;

    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{folder.name}</h2>
            <div>
                <button className="mr-4 text-gray-500 hover:text-gray-700" onClick={openAddToFolderModal}>연습 추가</button>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setSelectedFolderId(null)}>뒤로가기</button>
            </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {folder.content.map((item, index) => {
                const assignment = assignments.find(a => a.title === item);
                return (
                    <div key={index} className="relative">
                        <button
                            className="w-full px-4 py-8 text-white bg-teal-500 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                            onClick={() => navigate('/selectLanguage')}
                        >
                            {item}
                        </button>
                        <button
                            className="absolute p-1 text-xs text-white bg-red-500 rounded-full top-2 right-2 hover:bg-red-700"
                            onClick={(e) => { e.stopPropagation(); handleDeleteFolderContent(folder.id, item); }}
                        >
                            X
                        </button>
                    </div>
                );
            })}
        </div>
      </div>
    );
  };

  const renderAlertModal = () => (
    alert.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="w-full max-w-sm p-8 text-center bg-white shadow-xl rounded-2xl">
                <div className="mb-4">
                    <h2 className="mb-2 text-3xl font-bold text-gray-800">
                        <span className="text-black">Code</span>
                        <span className="text-[#2DD4BF]">Run</span>
                        <span className="text-[#FFD602]">{'{ }'}</span>
                    </h2>
                </div>
                <p className="mb-6 text-gray-600">{alert.message}</p>
                <button
                    className="bg-[#14B8A6] text-white border-none py-3 px-8 rounded-lg text-base font-semibold cursor-pointer transition-colors duration-200 shadow-lg hover:bg-[#0F8A7A]"
                    onClick={() => setAlert({ show: false, message: '' })}
                >
                    확인
                </button>
            </div>
        </div>
    )
  );

  const renderPromptModal = () => (
    prompt.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 text-center bg-white rounded-lg shadow-xl">
                <h3 className="mb-4 text-lg font-bold">{prompt.message}</h3>
                <input
                    type="text"
                    className="w-full p-2 mb-4 border rounded"
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                />
                <div className="flex justify-end">
                    <button className="px-4 py-2 mr-2 text-black bg-gray-300 rounded-lg" onClick={handleCancelPrompt}>취소</button>
                    <button className="bg-[#14B8A6] text-white px-4 py-2 rounded-lg" onClick={handleConfirmPrompt}>확인</button>
                </div>
            </div>
        </div>
    )
  );


  return (
    <div className="flex min-h-screen bg-white">
      {renderAlertModal()}
      {renderPromptModal()}
      {/* Sidebar */}
      <div className="fixed flex-shrink-0 min-h-screen bg-white shadow-lg w-72 top-15">
        <div className="h-full p-6 overflow-y-auto">
          {/* 클래스 만들기 버튼 */}
          <button
            onClick={handleCreateClass}
            className="w-full bg-[#009b84] h-[44px] rounded-[15px] flex items-center justify-center mb-8 hover:bg-[#007a6b] transition-colors"
          >
            <p className="font-medium text-[16px] text-white">
              클래스 만들기
            </p>
          </button>

          {/* 나의 폴더 섹션 */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-[#909090] text-[14px]">나의 폴더</p>
            <button onClick={addFolder} className="text-xl">+</button>
          </div>

          {/* 폴더 아이템들 */}
          <div className="mb-6 space-y-3">
            {folders.map(folder => (
              <div key={folder.id} className={`flex items-center justify-between cursor-pointer p-2 rounded transition-colors duration-200 ${selectedFolderId === folder.id ? 'bg-teal-100' : 'hover:bg-gray-50'}`} onClick={() => {
                  setSelectedFolderId(folder.id);
                  setSelectedStudentClassId(null);
              }}>
                <div className="flex items-center">
                  <FolderIcon />
                  <p className="text-[12px] text-black">{folder.name}</p>
                </div>
                <TrashIcon className="text-gray-400 cursor-pointer hover:text-red-500" onClick={(e) => { e.stopPropagation(); deleteFolder(folder.id); }} />
              </div>
            ))}
          </div>

          {/* 구분선 */}
          <div className="bg-[#c7c7c7] h-px w-full mb-6" />

          {/* 나의 클래스 섹션 */}
          <p className="text-[#909090] text-[14px] mb-4">
            나의 클래스
          </p>

          <div className="mb-6 ml-5 space-y-3">
            {studentClasses.map(c => (
                <div
                    key={c.id}
                    className={`flex items-center justify-between cursor-pointer p-2 rounded transition-colors duration-200 ${selectedStudentClassId === c.id ? 'bg-teal-100' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                        setSelectedStudentClassId(c.id);
                        setSelectedFolderId(null);
                    }}
                >
                    <p className="text-[12px] text-black">{c.name}</p>
                    {selectedStudentClassId === c.id && (
                        <button
                            className="text-xs text-red-500 hover:text-red-700"
                            onClick={handleLeaveClass}
                        >
                            클래스 탈퇴하기
                        </button>
                    )}
                </div>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 min-h-screen ml-72">

          {/* 히어로 섹션 */}
          <div className="bg-gradient-to-r from-[#009b84] to-[#13ae9d] p-14 mb-8 h-[220px] flex align-center justify-center flex-col">
            <h1 className="font-semibold text-[24px] text-white mb-[12px]">
              CodeRun{`{ }`}
            </h1>
            <p className="font-medium text-[24px] text-white">
              어제보다 한글자 더 빠르게
            </p>
          </div>
          {selectedFolderId ? renderFolderContent() : (
            <>
                <div className="flex flex-wrap items-center justify-between gap-4 m-16 mt-1 mb-6 ">
                    <button className="text-[#686465] text-[16px] hover:text-[#009b84] transition-colors">
                    과제
                    </button>
                    <button className="text-[#686465] text-[16px] hover:text-[#009b84] transition-colors" onClick={() => setShowAddToFolderModal(true)}>
                    폴더에 추가
                    </button>
                </div>
                <div className="m-14 mt-0 bg-[#f8f9fa] p-2">


                {/* 컨텐츠 리스트 */}
                <div className="space-y-0">
                    {assignments.map(assignment => (
                        <div key={assignment.id} className="bg-[#f8f9fa] border-b border-[#dddddd] p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center">
                                <div className="bg-[#13ae9d] h-[33px] rounded-[5px] w-[66px] flex items-center justify-center mr-6 flex-shrink-0">
                                    <p className="text-white text-[16px] font-medium">{assignment.type}</p>
                                </div>
                                <p className="text-[#1c1c1c] text-[16px] font-medium">{assignment.title}</p>
                            </div>
                            <button className="bg-[#0D9488] text-white px-4 py-2 rounded-lg" onClick={() => navigate('/selectLanguage')}>연습하러가기</button>
                        </div>
                    ))}
                </div>
                </div>
            </>
          )}
      </div>

      {/* Add to Folder Modal */}
      {showAddToFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-8 bg-white rounded-lg shadow-xl">
                <h2 className="mb-4 text-2xl font-bold">폴더에 추가</h2>
                <div className="mb-4">
                    <label className="block mb-2">과제 선택</label>
                    <select className="w-full p-2 border rounded" onChange={(e) => setSelectedAssignment(assignments.find(a => a.id === parseInt(e.target.value)))}>
                        <option value="">과제를 선택하세요</option>
                        {assignments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">폴더 선택</label>
                    <select className="w-full p-2 border rounded" value={selectedFolder ? selectedFolder.id : ""} onChange={(e) => setSelectedFolder(folders.find(f => f.id === parseInt(e.target.value)))}>
                        <option value="">폴더를 선택하세요</option>
                        {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                </div>
                <div className="flex justify-end">
                    <button className="px-4 py-2 mr-2 text-black bg-gray-300 rounded-lg" onClick={handleCloseModal}>취소</button>
                    <button className="bg-[#0D9488] text-white px-4 py-2 rounded-lg" onClick={handleAddToFolder}>추가</button>
                </div>
            </div>
        </div>
      )}

      {/* 모달 */}
      {showModal && (
        <>
          {/* 모달 오버레이 */}
          <div className="fixed inset-0 bg-[rgba(18,18,18,0.3)] z-40" />

          {/* 모달 컨텐츠 */}
          <div className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
            <div className="bg-white rounded-[30px] w-[90vw] max-w-[675px] h-[408px] relative p-8">
              {/* 로고 */}
              <div className="mb-8 text-center">
                <span className="font-semibold text-[40px]">
                  <span className="text-[#121212]">Code</span>
                  <span className="text-teal-400">Run</span>
                  <span className="text-[#ffd602]">{`{ }`}</span>
                </span>
              </div>

              {/* 구분선 */}
              <div className="bg-[#e6e6e6] h-[2px] w-full mb-8" />

              {/* 수업 코드 공유 텍스트 */}
              <p className="text-center text-[20px] text-black mb-8">
                수업 코드 공유
              </p>

              {/* 클래스 코드 */}
              <div className="mb-8 text-center">
                <p className="font-semibold text-[48px] text-black break-all">
                  {classCode}
                </p>
              </div>

              {/* 닫기 버튼 */}
              <div className="text-center">
                <button
                  onClick={handleCloseModal}
                  className="bg-[#13ae9d] h-[54px] rounded-[15px] w-[250px] flex items-center justify-center mx-auto hover:bg-[#0f8a7a] transition-colors"
                >
                  <p className="font-semibold text-[24px] text-white">
                    닫기
                  </p>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 프리미엄 모달 */}
      {showPremiumModal && (
        <>
          {/* 모달 오버레이 */}
          <div className="fixed inset-0 bg-[rgba(18,18,18,0.3)] z-40" />

          {/* 모달 컨텐츠 */}
          <div className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
            <div className="bg-white rounded-[30px] w-[90vw] max-w-[675px] h-auto relative p-8 flex flex-col items-center">
              <h2 className="mb-4 text-2xl font-bold">프리미엄 기능입니다</h2>
              <p className="mb-8 text-center">
                클래스 만들기는 프리미엄 사용자만 이용할 수 있습니다.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    navigate("/payment");
                    handleCloseModal();
                  }}
                  className="bg-[#009b84] h-[54px] rounded-[15px] w-[250px] flex items-center justify-center mx-auto hover:bg-[#007a6b] transition-colors"
                >
                  <p className="font-semibold text-[24px] text-white">
                    프리미엄 결제하기
                  </p>
                </button>
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-300 h-[54px] rounded-[15px] w-[250px] flex items-center justify-center mx-auto hover:bg-gray-400 transition-colors"
                >
                  <p className="font-semibold text-[24px] text-white">
                    닫기
                  </p>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
