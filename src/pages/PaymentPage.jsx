import React from 'react';

const PaymentPage = () => {
  return (
    <div className="flex min-h-screen font-sans bg-gray-50">
      {/* 사이드바 */}
      <div className="w-1/3 bg-white flex justify-center border-r sticky top-0 h-screen overflow-auto">
        <div className="w-full max-w-xs px-6 py-12">
          <h1 className="text-2xl font-semibold mb-8">CodeRun</h1>
          <p className="text-gray-500 text-sm mb-2">CodeRun 구독하기</p>

          <p className="text-3xl font-bold mb-4">
            $22.00 <span className="text-base font-normal text-gray-500">/월</span>
          </p>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between border-b pb-2 font-medium">
              <span>CodeRun<br/> 월간 청구</span>
              <span><br/>$20.00</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>부가세 (10%)</span>
              <span>$2.00</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-semibold text-black">
              <span>당월 청구 총액</span>
              <span>$22.00</span>
            </div>
          </div>
        </div>
      </div>
      {/* 폼 */}
      <div className="w-2/3 h-screen overflow-auto p-12">
        <form className="max-w-xl mx-auto space-y-8">

          <div>
            <h2 className="text-lg font-semibold mb-2">연락처 정보</h2>
            <input
              type="email"
              placeholder="이메일"
              className="w-full p-3 border rounded-md"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">결제 방식</h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="1234 1234 1234 1234"
                className="w-full p-3 border rounded-md"
              />

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-1/2 p-3 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="보안코드 (CVC)"
                  className="w-1/2 p-3 border rounded-md"
                />
              </div>

              <input
                type="text"
                placeholder="카드 소유자 이름"
                className="w-full p-3 border rounded-md"
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">청구 주소</h2>
            <div className="space-y-3">
              <input type="text" placeholder="나라" className="w-full p-3 border rounded-md" />
              <input type="text" placeholder="도시 / 시" className="w-full p-3 border rounded-md" />
              <input type="text" placeholder="읍/면/동" className="w-full p-3 border rounded-md" />
              <input type="text" placeholder="주소란" className="w-full p-3 border rounded-md" />
              <input type="text" placeholder="우편번호" className="w-full p-3 border rounded-md" />
            </div>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              비즈니스 목적으로 구매합니다.
            </label>
            <label className="flex items-start gap-2">
              <input type="checkbox" />
              <span>
                결재를 취소할 때까지 상기 안내된 기간마다 해당 금액이 청구됩니다.
                이용약관에 명시된 바에 따라 요금이 변경될 수 있습니다. <br/>
                결재는 언제든 취소 가능합니다. 구독함으로써, <br/>
                CodeRun의 이용약관 및 개인정보 정책에 동의하는 것으로, <br/>
                갱신 및 기타 구매를 위해 사용자님의 결재 방법을  저장하는 권한을 <br/>
                당사에 부여하는 것으로 간주합니다.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-md font-medium text-lg"
          >
            구독하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
