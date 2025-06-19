import { Loader } from 'lucide-react';

export default function LoadMoreButton({ hasMore, loading, handleLoadMore }) {
  if (!hasMore) {
    return <div className="text-center py-8 text-gray-500">모든 강의를 불러왔습니다.</div>;
  }

  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={handleLoadMore}
        disabled={loading}
        className="flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <Loader className="animate-spin mr-2" size={16} />
            로딩 중...
          </>
        ) : (
          <>
            더보기
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
