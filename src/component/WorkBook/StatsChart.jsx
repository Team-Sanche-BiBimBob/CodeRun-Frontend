export default function StatsChart({ data }) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">학습 통계</h3>
        <div className="flex items-end space-x-2 h-32">
          {data.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="bg-teal-500 w-full rounded-t-sm transition-all duration-500"
                style={{ height: `${value}%` }}
              ></div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span>
        </div>
      </div>
    );
  }
  