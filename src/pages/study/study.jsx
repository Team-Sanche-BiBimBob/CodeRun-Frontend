import React from 'react';
import Header from '../../components/common/header/Header';
import Footer from '../../components/common/footer/Footer';

const Study = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            
            <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
                <div className="text-center">
                    <h1 className="text-8xl font-bold text-gray-800 mb-4 tracking-wide">
                        COMING SOON
                    </h1>
                    <div className="w-32 h-1 bg-teal-500 mx-auto mb-6"></div>
                    <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
                        새로운 학습방 기능을 준비하고 있습니다. 곧 만나보실 수 있습니다.
                    </p>
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default Study;