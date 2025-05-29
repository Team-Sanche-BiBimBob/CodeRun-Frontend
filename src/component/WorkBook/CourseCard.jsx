export default function CourseCard({ course }) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{course.description}</p>
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {'★'.repeat(Math.floor(course.rating))}
            {'☆'.repeat(5 - Math.floor(course.rating))}
          </div>
          <span className="text-gray-500 ml-2 text-sm">{course.rating}</span>
        </div>
        <div className="flex items-center justify-between">
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            시작하기
          </button>
          <span className="text-gray-500 text-sm">문제집 {course.lessons}</span>
        </div>
      </div>
    );
  }
  