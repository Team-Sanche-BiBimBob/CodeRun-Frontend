import { useState } from "react";

const TeacherDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [classCode, setClassCode] = useState("Co87de1R2RR22U");
  const [userRole, setUserRole] = useState("BASIC"); // "BASIC" or "PREMIUM"

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
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(classCode);
    alert("클래스 코드가 복사되었습니다!");
  };

  return (
    <div className="bg-white min-h-screen flex">
      {/* 사이드바 */}
      <div className="w-72 bg-white shadow-lg flex-shrink-0 min-h-screen fixed top-15">
        <div className="p-6 h-full overflow-y-auto">
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
          <p className="text-[#909090] text-[14px] mb-4">
            나의 폴더
          </p>

          {/* 폴더 아이템들 */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mr-3">
                <path d="M2 4H14L13 12H3L2 4Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-[12px] text-black">이용한 세트</p>
            </div>

            <div className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mr-3">
                <path d="M2 4H14L13 12H3L2 4Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-[12px] text-black">Python</p>
            </div>

            <div className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mr-3">
                <path d="M2 4H14L13 12H3L2 4Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-[12px] text-black">Js</p>
            </div>

            <div className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mr-3">
                <path d="M2 4H14L13 12H3L2 4Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-[12px] text-black">문장 세트 폴더</p>
            </div>
          </div>

          {/* 구분선 */}
          <div className="bg-[#c7c7c7] h-px w-full mb-6" />

          {/* 나의 클래스 섹션 */}
          <p className="text-[#909090] text-[14px] mb-4">
            나의 클래스
          </p>

          <div className="space-y-3 mb-6 ml-5">
            <div className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <p className="text-[12px] text-black">1학년 1반</p>
            </div>

            <div className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <p className="text-[12px] text-black">1학년 2반</p>
            </div>

            <div className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <p className="text-[12px] text-black">1학년 3반</p>
            </div>

            <div className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <p className="text-[12px] text-black">1학년 4반</p>
            </div>
          </div>

          {/* 더보기 */}
          <div className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
            <p className="text-[#929292] text-[12px] mr-2">더보기</p>
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" className="rotate-90">
              <path d="M1 1L5 5L1 9" stroke="#929292" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
          <div className="flex justify-between items-center m-16 mb-6 mt-1 flex-wrap gap-4 ">
            <button className="text-[#686465] text-[16px] hover:text-[#009b84] transition-colors">
              그룹 코드 생성 | 그룹 관리
            </button>
            <button className="text-[#686465] text-[16px] hover:text-[#009b84] transition-colors">
              클래스에 추가 | 폴더에 추가
            </button>
          </div>
          <div className="m-14 mt-0 bg-[#f8f9fa] p-2">


          {/* 컨텐츠 리스트 */}
          <div className="space-y-0">
            {/* 리스트 아이템들 */}
            <div className="bg-[#f8f9fa] border-b border-[#dddddd] p-6 flex items-center hover:bg-gray-50 transition-colors">
              <div className="bg-[#13ae9d] h-[33px] rounded-[5px] w-[66px] flex items-center justify-center mr-6 flex-shrink-0">
                <p className="text-white text-[16px] font-medium">단어</p>
              </div>
              <p className="text-[#1c1c1c] text-[16px] font-medium">Python 예약어 레벨 1- 3까지</p>
            </div>

            <div className="bg-[#f8f9fa] border-b border-[#dddddd] p-6 flex items-center hover:bg-gray-50 transition-colors">
              <div className="bg-[#13ae9d] h-[33px] rounded-[5px] w-[66px] flex items-center justify-center mr-6 flex-shrink-0">
                <p className="text-white text-[16px] font-medium">문장</p>
              </div>
              <p className="text-[#1c1c1c] text-[16px] font-medium">Python 문장 레벨 1- 3까지</p>
            </div>

            <div className="bg-[#f8f9fa] border-b border-[#dddddd] p-6 flex items-center hover:bg-gray-50 transition-colors">
              <div className="bg-[#13ae9d] h-[33px] rounded-[5px] w-[66px] flex items-center justify-center mr-6 flex-shrink-0">
                <p className="text-white text-[16px] font-medium">풀코딩</p>
              </div>
              <p className="text-[#1c1c1c] text-[16px] font-medium">Python 풀코딩 레벨 1- 10까지</p>
            </div>

            <div className="bg-[#f8f9fa] p-6 flex items-center hover:bg-gray-50 transition-colors">
              <div className="bg-[#13ae9d] h-[33px] rounded-[5px] w-[66px] flex items-center justify-center mr-6 flex-shrink-0">
                <p className="text-white text-[16px] font-medium">단어</p>
              </div>
              <p className="text-[#1c1c1c] text-[16px] font-medium">JavaScript 예약어 레벨 1- 5까지</p>
            </div>
          </div>
        </div>
      </div>

      {/* 모달 */}
      {showModal && (
        <>
          {/* 모달 오버레이 */}
          <div className="fixed inset-0 bg-[rgba(18,18,18,0.3)] z-40" />

          {/* 모달 컨텐츠 */}
          <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-white rounded-[30px] w-[90vw] max-w-[675px] h-[408px] relative p-8">
              {/* 로고 */}
              <div className="text-center mb-8">
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
              <div className="text-center mb-8">
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
          <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-white rounded-[30px] w-[90vw] max-w-[675px] h-auto relative p-8 flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-4">프리미엄 기능입니다</h2>
              <p className="text-center mb-8">
                클래스 만들기는 프리미엄 사용자만 이용할 수 있습니다.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    // Handle navigation to payment page
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

export default TeacherDashboard;