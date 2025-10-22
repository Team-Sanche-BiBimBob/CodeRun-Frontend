import React from 'react';
import { X } from 'lucide-react';

export default function AIProblemModal({ 
  isOpen, 
  onClose, 
  formData, 
  onFormChange, 
  onGenerate,
  languages,
  practiceTypes,
  isGenerating = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center bg-black/50">
      <div className="bg-white rounded-xl p-8 w-[500px] max-w-[90vw] shadow-lg relative">
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">AI 문제 생성</h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 폼 필드들 */}
        <div className="space-y-6">
          {/* 언어 선택 */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              언어
            </label>
            <select
              value={formData.language}
              onChange={(e) => onFormChange('language', e.target.value)}
              className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* 연습 유형 선택 */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              연습 유형
            </label>
            <select
              value={formData.practiceType}
              onChange={(e) => onFormChange('practiceType', e.target.value)}
              className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {practiceTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* 문제 수 입력 */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              문제 수
            </label>
            <input
              type="text"
              value={formData.problemCount}
              onChange={(e) => onFormChange('problemCount', e.target.value)}
              placeholder="문제 수를 입력하세요"
              className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* 문제 유형 입력 */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              문제 유형
            </label>
            <input
              type="text"
              value={formData.problemType}
              onChange={(e) => onFormChange('problemType', e.target.value)}
              placeholder="문제 유형을 입력하세요"
              className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 버튼들 */}
        <div className="flex gap-4 justify-end mt-8">
          <button
            onClick={onClose}
            disabled={isGenerating}
            className={`px-6 py-3 font-medium rounded-lg transition-colors ${isGenerating ? 'text-gray-400 bg-gray-200 cursor-not-allowed' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'}`}
          >
            취소
          </button>
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className={`px-6 py-3 font-medium text-white rounded-lg transition-colors ${isGenerating ? 'bg-teal-400 cursor-wait' : 'bg-teal-600 hover:bg-teal-700'}`}
          >
            {isGenerating ? '생성 중...' : '생성'}
          </button>
        </div>
      </div>
    </div>
  );
}
