import React, { useState } from 'react';
import { CreditCard, Mail, MapPin, Lock, Check } from 'lucide-react';

const PaymentPage = () => {
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedRecurring, setAgreedRecurring] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="lg:w-2/5 w-full bg-gradient-to-br from-teal-600 to-teal-700 text-white p-8 lg:p-16 flex flex-col justify-between shadow-lg">
        <div>
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">CodeRun</h1>
          <p className="text-teal-100 text-lg">프리미엄 구독</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 my-8">
          <p className="text-teal-100 text-base mb-2">월간 요금제</p>
          <p className="text-6xl font-bold mb-1">
            $22<span className="text-3xl font-normal text-teal-100">.00</span>
          </p>
          <p className="text-teal-100 text-base">/ 월</p>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between py-3 border-b border-white/20">
            <span className="text-teal-100">CodeRun 월간 청구</span>
            <span className="font-semibold text-white">$20.00</span>
          </div>
          <div className="flex justify-between py-3 border-b border-white/20">
            <span className="text-teal-100">부가세 (10%)</span>
            <span className="font-semibold text-white">$2.00</span>
          </div>
          <div className="flex justify-between py-4 text-xl font-bold">
            <span className="text-white">총 결제 금액</span>
            <span className="text-white">$22.00</span>
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

      {/* Form */}
      <div className="lg:w-3/5 w-full p-8 lg:p-16 overflow-auto">
        <form className="max-w-2xl mx-auto space-y-10">
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-3">결제 정보</h2>
            <p className="text-gray-600 text-lg">안전하고 간편한 결제를 진행해주세요</p>
          </div>

          {/* Contact Information */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-6 h-6 text-teal-600" />
              <h3 className="text-2xl font-bold text-gray-900">연락처 정보</h3>
            </div>
            <input
              type="email"
              placeholder="이메일 주소를 입력하세요"
              className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
            />
          </div>

          {/* Payment Method */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-6 h-6 text-teal-600" />
              <h3 className="text-2xl font-bold text-gray-900">결제 방식</h3>
            </div>

            <div className="space-y-5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="카드 번호"
                  maxLength="19"
                  className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                />
                <CreditCard className="absolute w-5 h-5 text-gray-400 top-1/2 right-4 -translate-y-1/2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="MM / YY"
                  maxLength="7"
                  className="p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                />
                <div className="relative">
                  <input
                    type="text"
                    placeholder="CVC"
                    maxLength="4"
                    className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                  />
                  <Lock className="absolute w-5 h-5 text-gray-400 top-1/2 right-4 -translate-y-1/2" />
                </div>
              </div>

              <input
                type="text"
                placeholder="카드 소유자 이름"
                className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
              />
            </div>
          </div>

          {/* Billing Address */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-teal-600" />
              <h3 className="text-2xl font-bold text-gray-900">청구 주소</h3>
            </div>
            <div className="space-y-5">
              <input
                type="text"
                placeholder="국가"
                className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="도시"
                  className="p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                />
                <input
                  type="text"
                  placeholder="우편번호"
                  className="p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                />
              </div>
              <input
                type="text"
                placeholder="상세 주소"
                className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
              />
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="bg-gray-50 rounded-xl p-8 space-y-5 text-gray-700 text-base">
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white py-4 rounded-xl font-semibold text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            구독하기
          </button>

          <p className="text-sm text-center text-gray-500 mt-6">
            <Lock className="inline w-4 h-4 mr-1" />
            모든 결제 정보는 암호화되어 안전하게 처리됩니다
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;