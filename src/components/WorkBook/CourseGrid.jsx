import PropTypes from 'prop-types';

export default function CourseGrid({ courses }) {
  if (!Array.isArray(courses) || courses.length === 0) {
    return (
      <div className="text-gray-500 text-center py-12">
        표시할 문제집이 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course, index) => (
        <CourseCard key={course.title + index} course={course} />
      ))}
    </div>
  );
}

CourseGrid.propTypes = {
  courses: PropTypes.arrayOf(PropTypes.object).isRequired,
};
