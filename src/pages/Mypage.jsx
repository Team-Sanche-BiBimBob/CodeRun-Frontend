import React from 'react';
import { ChevronRight } from 'lucide-react';

const MyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <h1 className="px-8 py-6 text-3xl font-bold">마이페이지</h1>
      
      <div className="flex gap-8 px-8 pb-8">
        {/* 왼쪽 사이드바 */}
        <div className="flex flex-col justify-between p-8 rounded-lg w-80 bg-gray-50" style={{ height: '640px' }}>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-40 h-40 mb-6 bg-gray-300 rounded-full">
              <span className="text-6xl font-bold text-gray-600">U</span>
            </div>
            
            <h2 className="mb-4 text-2xl font-bold">사용자</h2>
            <p className="mb-12 text-gray-600">st876@dgsw.hs.kr</p>
            
            <button className="px-4 py-2 font-medium text-white bg-teal-500 rounded">
              레벨 15
            </button>
          </div>

          <div className="flex flex-col items-center pt-4 border-t border-gray-300">
            <button className="mb-3 text-sm font-medium text-red-500 hover:text-red-600">
              로그아웃
            </button>
            <button className="text-sm font-medium text-red-500 hover:text-red-600">
              회원 탈퇴
            </button>
          </div>
        </div>

        {/* 오른쪽 메인 컨텐츠 */}
        <div className="flex-1">
          {/* 언어 선택 섹션 */}
          <div className="p-8 mb-8 rounded-lg bg-gray-50">
            <h3 className="mb-6 text-lg font-semibold">이 언어들로 코딩 학습 시작해볼래요?</h3>
            
            <div className="grid grid-cols-3 gap-6 mb-8">
              {/* Python 카드 */}
              <div className="p-6 bg-white rounded-lg">
                <h4 className="mb-3 text-lg font-bold">Python</h4>
                <p className="mb-4 text-sm text-gray-700">초보자에게 가장 적합한 언어로, 쉬운 문법과 다양한 활용 분야를 가지고 있습니다.</p>
                <button className="font-medium text-teal-500 hover:text-teal-600">
                  학습하기
                </button>
              </div>

              {/* Java 카드 */}
              <div className="p-6 bg-white rounded-lg">
                <h4 className="mb-3 text-lg font-bold">Java</h4>
                <p className="mb-4 text-sm text-gray-700">객체지향 프로그래밍의 대표적인 언어로, 다양한 플랫폼에서 실행 가능합니다.</p>
                <button className="font-medium text-teal-500 hover:text-teal-600">
                  학습하기
                </button>
              </div>

              {/* Kotlin 카드 */}
              <div className="p-6 bg-white rounded-lg">
                <h4 className="mb-3 text-lg font-bold">Kotlin</h4>
                <p className="mb-4 text-sm text-gray-700">안드로이드 앱 개발에 적합한 언어로, Java보다 간결하고 현대적입니다.</p>
                <button className="font-medium text-teal-500 hover:text-teal-600">
                  학습하기
                </button>
              </div>
            </div>
          </div>

          {/* 내 학습 기록 섹션 */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">내 학습 기록 보기</h3>
            
            <div className="p-12 text-center rounded-lg bg-gray-50">
              <p className="mb-4 text-lg text-gray-600">
                "아직 아무 기록도 없어요. 첫 학습을 시작해볼까요?"
              </p>
              <button className="px-8 py-3 font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600">
                학습하러 가기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;