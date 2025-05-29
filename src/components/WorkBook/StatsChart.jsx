// StatsChart.jsx
export default function StatsChart() {
  const chartData = [
    { name: "C", value: 65 },
    { name: "TypeScript", value: 80 },
    { name: "Python", value: 95 },
    { name: "Java", value: 85 },
    { name: "SQL", value: 75 },
    { name: "JavaScript", value: 70 },
    { name: "Kotlin", value: 60 },
    { name: "Swift", value: 55 }
  ];

  return (
    <div className="w-80">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          언어별 통계 ▼
        </h3>
        <div className="space-y-3">
          {chartData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-3">
              <div className="w-12 text-xs text-gray-600">{item.name}</div>
              <div className="flex-1 relative">
                <div className="w-full h-6 bg-gray-100 rounded">
                  <div
                    className="h-full bg-teal-500 rounded transition-all duration-500"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}