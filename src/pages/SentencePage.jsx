import React, { useState } from 'react';

const sentences = Array.from({ length: 30 }, (_, i) => `print("Hello world! ${i + 1}")`);

function SentencePage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (inputValue.trim() === sentences[currentIndex]) {
                setCurrentIndex((prev) => prev + 1);
                setInputValue('');
            }
        }
    };

    const getBoxStyle = (index) => {
        if (index === currentIndex - 1) return 'bg-gray-300 text-black'; // 완료
        if (index === currentIndex) return 'bg-white border border-gray-300 text-teal-600 text-2xl font-semibold'; // 현재
        if (index === currentIndex + 1) return 'bg-gray-100 text-black'; // 다음
        if (index === currentIndex + 2) return 'bg-gray-300 text-black'; // 다다음
        return 'hidden';
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4 bg-[#F0FDFA]">
            {[currentIndex - 1, currentIndex, currentIndex + 1, currentIndex + 2].map((index, i) => (
                <div
                    key={i}
                    className={`w-4/5 h-[50px] rounded flex items-center px-4 ${getBoxStyle(index)}`}
                >
                    {sentences[index] ?? ''}
                </div>
            ))}

            {/* 입력창 */}
            <input
                type="text"
                className="w-5/6 h-[40px] mt-4 px-4 border border-gray-300 rounded outline-none"
                placeholder="위 문장을 따라 입력하세요"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
}

export default SentencePage;
