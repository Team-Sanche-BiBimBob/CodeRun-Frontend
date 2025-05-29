export default function FilterTabs() {
    return (
      <div className="flex space-x-6 mb-8 text-sm">
        <button className="text-teal-600 border-b-2 border-teal-600 pb-2 font-medium">전체</button>
        <button className="text-gray-500 hover:text-gray-700 pb-2">인기</button>
        <button className="text-gray-500 hover:text-gray-700 pb-2">최신</button>
        <button className="text-gray-500 hover:text-gray-700 pb-2">추천순</button>
      </div>
    );
  }
  