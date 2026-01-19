import { Link } from 'react-router-dom';
import { BookOpen, Clock, BarChart } from 'lucide-react';

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="h-48 bg-gray-200 relative">
        {course.thumbnailUrl ? (
          <img 
            src={course.thumbnailUrl} 
            alt={course.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <BookOpen className="h-12 w-12" />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-bold text-indigo-600">
          ${course.price}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
          <span className="bg-gray-100 px-2 py-1 rounded">{course.category}</span>
          <span className="flex items-center">
            <BarChart className="h-3 w-3 mr-1" />
            {course.difficulty}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <Link 
          to={`/courses/${course.slug}`} 
          className="block w-full text-center bg-indigo-50 text-indigo-600 py-2 rounded-md font-medium hover:bg-indigo-100 transition"
        >
          View Course
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
