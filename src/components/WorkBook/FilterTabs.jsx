function FilterTabs({ activeTab, setActiveTab }) {
  const tabs = ["전체", "언어", "문장", "플코딩"];

  return (
    <div className="flex gap-6 mb-8 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-3 px-1 text-sm font-medium transition-colors ${
            activeTab === tab
              ? "text-teal-600 border-b-2 border-teal-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default FilterTabs;
