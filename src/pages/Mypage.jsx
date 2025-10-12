import React, { useState, useEffect } from 'react';
import userImg from '../assets/user.jpg';

const MyPage = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userName, setUserName] = useState('사용자');
  const [userEmail, setUserEmail] = useState('st876@dgsw.hs.kr');

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        setUserName(user.name || user.username || '사용자');
        if (user.email) setUserEmail(user.email);
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(false);
    alert('로그아웃되었습니다.');
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    alert('회원탈퇴가 완료되었습니다.');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-0 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Profile Card */}
          <aside className="w-full lg:w-[320px] flex-shrink-0 lg:-ml-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">마이페이지</h1>
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-24">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-6 flex items-center justify-center">
                  <img src={userImg} alt="사용자 프로필" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{userName}</h2>
                <p className="text-gray-600 mb-4">{userEmail}</p>
                <span className="bg-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-16">레벨 15</span>
                <div className="w-full flex flex-col items-start gap-6">
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="text-red-500 hover:text-red-700 font-medium transition-colors"
                  >
                    로그아웃
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="text-red-500 hover:text-red-700 font-medium transition-colors"
                  >
                    회원 탈퇴
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Right: Content */}
          <main className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">최근 학습한 언어</h3>
            <section className="bg-white rounded-2xl shadow p-8 mb-10 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="pr-6 max-w-2xl">
                  <h4 className="text-2xl font-semibold text-gray-900 mb-2">Python</h4>
                  <p className="text-gray-600 mb-5 leading-7">
                    초보자에게 가장 적합한 언어로,
                    쉬운 문법과 다양한 활용 분야를 가지고 있습니다.
                  </p>
                  <div className="flex gap-3">
                    <button className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium">단어</button>
                    <button className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium">문장</button>
                    <button className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium">풀코드</button>
                  </div>
                </div>
                <div className="text-right min-w-[140px]">
                  <div className="text-gray-600 mb-2">타수 280타</div>
                  <div className="text-6xl font-bold text-teal-400">60%</div>
                </div>
              </div>
            </section>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">가장 많이 학습한 언어</h3>
            <section className="bg-white rounded-2xl shadow p-8 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="pr-6 max-w-2xl">
                  <h4 className="text-2xl font-semibold text-gray-900 mb-2">Java</h4>
                  <p className="text-gray-600 mb-5 leading-7">
                    객체지향 프로그래밍의 대표적인
                    다양한 플랫폼에서 실행 가능한
                  </p>
                  <div className="flex gap-3">
                    <button className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium">단어</button>
                    <button className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium">문장</button>
                    <button className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium">풀코드</button>
                  </div>
                </div>
                <div className="text-right min-w-[140px]">
                  <div className="text-gray-600 mb-2">타수 280타</div>
                  <div className="text-6xl font-bold text-teal-400">30%</div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">로그아웃</h3>
            <p className="text-gray-600 mb-6">정말 로그아웃하시겠습니까?</p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                취소
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">회원탈퇴</h3>
            <p className="text-gray-600 mb-6">
              정말 회원탈퇴하시겠습니까?<br />
              이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                취소
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;