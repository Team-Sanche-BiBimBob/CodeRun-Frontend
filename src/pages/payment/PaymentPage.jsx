import React, { useState } from 'react';
import { CreditCard, Mail, MapPin, Lock, Check } from 'lucide-react';

const PaymentPage = () => {
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedRecurring, setAgreedRecurring] = useState(false);

  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 사이드바 */}
      <div className="sticky top-0 flex justify-center w-2/5 h-screen overflow-auto text-white shadow-2xl bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="w-full max-w-sm px-8 py-16">
          <div className="mb-12">
            <h1 className="mb-2 text-3xl font-bold tracking-tight">CodeRun</h1>
            <p className="text-sm text-teal-100">프리미엄 구독</p>
          </div>

          <div className="p-6 mb-8 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20">
            <p className="mb-3 text-sm text-teal-100">월간 요금제</p>
            <p className="mb-1 text-5xl font-bold">
              $22<span className="text-2xl font-normal text-teal-100">.00</span>
            </p>
            <p className="text-sm text-teal-100">/ 월</p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between py-3 border-b border-white/20">
              <span className="text-teal-100">CodeRun 월간 청구</span>
              <span className="font-semibold">$20.00</span>
            </div>
            <div className="flex justify-between py-3 border-b border-white/20">
              <span className="text-teal-100">부가세 (10%)</span>
              <span className="font-semibold">$2.00</span>
            </div>
            <div className="flex justify-between py-4 text-lg font-bold">
              <span>총 결제 금액</span>
              <span>$22.00</span>
            </div>
          </div>

          <div className="mt-12 space-y-4 text-sm text-teal-100">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>언제든지 구독 취소 가능</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>모든 프리미엄 기능 이용</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>우선 고객 지원</span>
            </div>
          </div>
        </div>
      </div>

      {/* 폼 */}
      <div className="w-3/5 h-screen p-12 overflow-auto">
        <form className="max-w-2xl mx-auto space-y-8">
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold text-gray-900">결제 정보</h2>
            <p className="text-gray-500">안전하고 간편한 결제를 진행해주세요</p>
          </div>

          {/* 연락처 정보 */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-teal-600" />
              <h3 className="text-lg font-semibold text-gray-900">연락처 정보</h3>
            </div>
            <input
              type="email"
              placeholder="이메일 주소를 입력하세요"
              className="w-full p-4 transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* 결제 방식 */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-teal-600" />
              <h3 className="text-lg font-semibold text-gray-900">결제 방식</h3>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="카드 번호"
                  maxLength="19"
                  className="w-full p-4 pr-12 transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <CreditCard className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 right-4 top-1/2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM / YY"
                  maxLength="7"
                  className="p-4 transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <div className="relative">
                  <input
                    type="text"
                    placeholder="CVC"
                    maxLength="4"
                    className="w-full p-4 pr-12 transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 right-4 top-1/2" />
                </div>
              </div>

              <input
                type="text"
                placeholder="카드 소유자 이름"
                className="w-full p-4 transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 청구 주소 */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-teal-600" />
              <h3 className="text-lg font-semibold text-gray-900">청구 주소</h3>
            </div>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="국가" 
                className="w-full p-4 transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="도시" 
                  className="p-4 transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                />
                <input 
                  type="text" 
                  placeholder="우편번호" 
                  className="p-4 transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                />
              </div>
              <input 
                type="text" 
                placeholder="상세 주소" 
                className="w-full p-4 transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
              />
            </div>
          </div>

          {/* 약관 동의 */}
          <div className="p-6 space-y-4 text-sm text-gray-700 bg-gray-50 rounded-xl">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-5 h-5 mt-1 text-teal-600 border-gray-300 rounded cursor-pointer focus:ring-2 focus:ring-teal-500" 
              />
              <span className="transition group-hover:text-gray-900">
                비즈니스 목적으로 구매합니다.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input 
                type="checkbox"
                checked={agreedRecurring}
                onChange={(e) => setAgreedRecurring(e.target.checked)}
                className="w-5 h-5 mt-1 text-teal-600 border-gray-300 rounded cursor-pointer focus:ring-2 focus:ring-teal-500" 
              />
              <span className="leading-relaxed transition group-hover:text-gray-900">
                결제를 취소할 때까지 매월 자동으로 결제됩니다. CodeRun의 이용약관 및 개인정보 정책에 동의하며, 
                갱신 및 기타 구매를 위해 결제 정보를 저장하는 것에 동의합니다.
              </span>
            </label>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            구독하기
          </button>

          <p className="text-sm text-center text-gray-500">
            <Lock className="inline w-4 h-4 mr-1" />
            모든 결제 정보는 암호화되어 안전하게 처리됩니다
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;