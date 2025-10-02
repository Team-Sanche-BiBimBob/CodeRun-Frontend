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
    // localStorage에서 토큰과 사용자 정보 제거
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userInfo');
    // storage 이벤트를 수동으로 트리거하여 Header의 상태 업데이트
    window.dispatchEvent(new Event('storage'));
    alert('로그아웃되었습니다.');
    // 홈페이지로 리다이렉트
    window.location.href = '/';
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    alert('회원탈퇴가 완료되었습니다.');
  };

  return (
    <div className="min-h-screen px-0 py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left: Profile Card */}
          <aside className="w-full lg:w-[320px] flex-shrink-0 lg:-ml-16">
            <h1 className="mb-6 text-3xl font-bold text-gray-900">마이페이지</h1>
            <div className="sticky p-8 bg-white shadow-lg rounded-xl top-24">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-32 h-32 mb-6 overflow-hidden bg-gray-200 rounded-full">
                  <img src={userImg} alt="사용자 프로필" className="object-cover w-full h-full" />
                </div>
                <h2 className="mb-2 text-2xl font-semibold text-gray-900">{userName}</h2>
                <p className="mb-4 text-gray-600">{userEmail}</p>
                <span className="px-4 py-2 mb-16 text-sm font-medium text-white bg-teal-500 rounded-full">레벨 15</span>
                <div className="flex flex-col items-start w-full gap-6">
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="font-medium text-red-500 transition-colors hover:text-red-700"
                  >
                    로그아웃
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="font-medium text-red-500 transition-colors hover:text-red-700"
                  >
                    회원 탈퇴
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Right: Content */}
          <main className="flex-1">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">최근 학습한 언어</h3>
            <section className="p-8 mb-10 bg-white border border-gray-200 shadow rounded-2xl">
              <div className="flex items-start justify-between">
                <div className="max-w-2xl pr-6">
                  <h4 className="mb-2 text-2xl font-semibold text-gray-900">Python</h4>
                  <p className="mb-5 leading-7 text-gray-600">
                    초보자에게 가장 적합한 언어로,
                    쉬운 문법과 다양한 활용 분야를 가지고 있습니다.
                  </p>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-teal-500 rounded-lg">단어</button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-teal-500 rounded-lg">문장</button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-teal-500 rounded-lg">풀코드</button>
                  </div>
                </div>
                <div className="text-right min-w-[140px]">
                  <div className="mb-2 text-gray-600">타수 280타</div>
                  <div className="text-6xl font-bold text-teal-400">60%</div>
                </div>
              </div>
            </section>

            <h3 className="mb-4 text-xl font-semibold text-gray-900">가장 많이 학습한 언어</h3>
            <section className="p-8 bg-white border border-gray-200 shadow rounded-2xl">
              <div className="flex items-start justify-between">
                <div className="max-w-2xl pr-6">
                  <h4 className="mb-2 text-2xl font-semibold text-gray-900">Java</h4>
                  <p className="mb-5 leading-7 text-gray-600">
                    객체지향 프로그래밍의 대표적인
                    다양한 플랫폼에서 실행 가능한
                  </p>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-teal-500 rounded-lg">단어</button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-teal-500 rounded-lg">문장</button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-teal-500 rounded-lg">풀코드</button>
                  </div>
                </div>
                <div className="text-right min-w-[140px]">
                  <div className="mb-2 text-gray-600">타수 280타</div>
                  <div className="text-6xl font-bold text-teal-400">30%</div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-sm p-6 mx-4 bg-white rounded-lg">
            <h3 className="mb-4 text-lg font-semibold">로그아웃</h3>
            <p className="mb-6 text-gray-600">정말 로그아웃하시겠습니까?</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-gray-600 transition-colors hover:text-gray-800"
              >
                취소
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-white transition-colors bg-red-500 rounded hover:bg-red-600"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-sm p-6 mx-4 bg-white rounded-lg">
            <h3 className="mb-4 text-lg font-semibold">회원탈퇴</h3>
            <p className="mb-6 text-gray-600">
              정말 회원탈퇴하시겠습니까?<br />
              이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 transition-colors hover:text-gray-800"
              >
                취소
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="px-4 py-2 text-white transition-colors bg-red-500 rounded hover:bg-red-600"
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