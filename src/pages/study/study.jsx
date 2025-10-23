import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/header/Header';
import Footer from '../../components/common/footer/Footer';
import { api } from '../../server';

const Study = () => {
    const navigate = useNavigate();
    useEffect(()=> {
       api.get("/api/auth/user").then((response)=> {
        if (response.data[0].role == "teacher") {
            setIsTeacher(true);
        } else {
            setIsTeacher(false);
        }
       }).catch((error)=> {
        console.error(error);
       });
    },[])

    const [isTeacher, setIsTeacher] = useState(false); // 선생님 여부 (실제로는 로그인 정보에서 가져와야 함)
    const [roomCode, setRoomCode] = useState('ABC123'); // 실제로는 서버에서 생성된 코드
    const [inputCode, setInputCode] = useState('');
    const [isJoined, setIsJoined] = useState(false);
    const [showCode, setShowCode] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // New state for loading

    const handleJoinRoom = () => {
        const codeRegex = /^[A-Za-z0-9]{6}$/;
        if (codeRegex.test(inputCode)) {
            setIsLoading(true); // Start loading
            setTimeout(() => {
                navigate('/student');
                setIsLoading(false); // End loading after navigation
            }, 1000); // 1 second delay
        } else {
            alert('코드는 6글자여야 합니다.');
        }
    };

    const handleCreateRoom = () => {
        // 실제로는 서버에서 새로운 룸 코드를 생성해야 함
        const newCode = Math.random().toString(36).substr(2, 6).toUpperCase();
        setRoomCode(newCode);
        setShowCode(true);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(roomCode);
        alert('룸 코드가 복사되었습니다!');
    };

    return (
        <div className="min-h-screen flex flex-col">
        
            
            <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 p-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                    {!isJoined ? (
                        <>
                            {isTeacher ? (
                                /* 선생님 화면 */
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-8">학습방 만들기</h2>
                                    {!showCode ? (
                                        <button
                                            onClick={handleCreateRoom}
                                            className="w-full bg-[#009b84] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#007a6b] transition-colors"
                                        >
                                            새로운 학습방 만들기
                                        </button>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="text-sm text-gray-600 mb-2">학습방 코드</p>
                                                <p className="text-2xl font-bold text-[#009b84] mb-2">{roomCode}</p>
                                                <p className="text-sm text-gray-500">학생들에게 이 코드를 공유하세요</p>
                                            </div>
                                            <button
                                                onClick={copyToClipboard}
                                                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                                            >
                                                코드 복사하기
                                            </button>
                                            <button
                                                onClick={() => navigate('/teacher')}
                                                className="w-full bg-[#009b84] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#007a6b] transition-colors"
                                            >
                                                학습방 입장하기
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* 학생 화면 */
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-8">학습방 참여하기</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <input
                                                type="text"
                                                value={inputCode}
                                                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                                                placeholder="학습방 코드를 입력하세요"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009b84] focus:border-transparent text-center text-lg font-semibold tracking-wider"
                                                maxLength="6"
                                            />
                                        </div>
                                        <button
                                            onClick={handleJoinRoom}
                                            disabled={!inputCode.trim() || isLoading} // Disable when loading
                                            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                                                inputCode.trim() && !isLoading
                                                    ? 'bg-[#009b84] text-white hover:bg-[#007a6b]'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                            {isLoading ? '로딩 중...' : '학습방 참여하기'} {/* Loading text */}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        /* 학습방 내부 */
                        <div className="text-center">
                            <div className="bg-[#009b84] text-white p-4 rounded-lg mb-6">
                                <h3 className="text-xl font-semibold mb-2">학습방에 참여했습니다!</h3>
                                <p className="text-sm opacity-90">룸 코드: {roomCode}</p>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-600 mb-2">현재 참여자</p>
                                    <p className="text-2xl font-bold text-[#009b84]">{isTeacher ? '5' : '1'}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsJoined(false);
                                        setShowCode(false);
                                        setInputCode('');
                                    }}
                                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    나가기
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default Study;